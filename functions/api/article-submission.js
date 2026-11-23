import {json} from "../_lib/editorial-auth.js";
const categories=new Set(["youth","culture","digital","learning","community","creative"]);
const mimeAllowed=new Set(["image/jpeg","image/png","image/webp"]);
const maxImage=5*1024*1024;
function clean(x){return String(x||"").replace(/[\u0000-\u001f\u007f]/g," ").trim()}
function ready(env){return Boolean(env.EDITORIAL_INTAKE_ENABLED==="true"&&env.EDITORIAL_DB&&env.EDITORIAL_R2&&env.TURNSTILE_SECRET_KEY)}
function validImage(bytes,mime){
 if(mime==="image/jpeg")return bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
 if(mime==="image/png")return bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71;
 if(mime==="image/webp")return String.fromCharCode(...bytes.slice(0,4))==="RIFF"&&String.fromCharCode(...bytes.slice(8,12))==="WEBP";
 return false;
}
export async function onRequestGet({env}){return json({ready:ready(env),max_images:5,max_image_mb:5})}
export async function onRequestPost({request,env}){
 if(!ready(env))return json({ok:false,error:"not_configured"},503);
 if(!/multipart\/form-data/i.test(request.headers.get("Content-Type")||""))return json({ok:false,error:"invalid_format"},415);
 const length=Number(request.headers.get("Content-Length")||0);if(length>27*1024*1024)return json({ok:false,error:"too_large"},413);
 const origin=request.headers.get("Origin");
 if(!origin||origin!==new URL(request.url).origin)return json({ok:false,error:"origin_denied"},403);
 let form;try{form=await request.formData()}catch{return json({ok:false,error:"invalid_format"},400)}
 if(form.get("website"))return json({ok:true},202);
 const title=clean(form.get("title")),body=clean(form.get("body")),category=clean(form.get("category")),
 locale=clean(form.get("locale")),displayName=clean(form.get("display_name")),email=clean(form.get("email"));
 if(title.length<5||title.length>140||body.length<150||body.length>15000||displayName.length<2||displayName.length>90||
    !categories.has(category)||!["en","mk","sq"].includes(locale)||!/^\S+@\S+\.\S+$/.test(email)||email.length>150||
    form.get("consent")!=="yes"||form.get("images_consent")!=="yes")return json({ok:false,error:"invalid_input"},400);
 const images=form.getAll("images").filter(v=>v&&typeof v==="object"&&typeof v.arrayBuffer==="function"&&v.size>0);
 if(images.length>5||images.some(x=>x.size>maxImage||!mimeAllowed.has(x.type)))return json({ok:false,error:"invalid_images"},400);
 const token=clean(form.get("cf-turnstile-response"));
 if(!token||token.length>3000)return json({ok:false,error:"captcha_required"},403);
 try{
  const v=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",
   headers:{"Content-Type":"application/x-www-form-urlencoded"},
   body:new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY,response:token,
      remoteip:request.headers.get("CF-Connecting-IP")||""})});
  if(!v.ok||(await v.json()).success!==true)return json({ok:false,error:"captcha_failed"},403);
 }catch{return json({ok:false,error:"captcha_unavailable"},503)}
 const id=crypto.randomUUID(),uploaded=[];
 try{
  for(let i=0;i<images.length;i++){
   const file=images[i],raw=new Uint8Array(await file.arrayBuffer());
   if(!validImage(raw,file.type))return json({ok:false,error:"invalid_image_content"},400);
   const ext=file.type==="image/jpeg"?"jpg":file.type==="image/png"?"png":"webp";
   const key="editorial/"+id+"/"+crypto.randomUUID()+"."+ext;
   await env.EDITORIAL_R2.put(key,raw,{httpMetadata:{contentType:file.type}});
   uploaded.push({id:crypto.randomUUID(),key,name:clean(file.name).slice(0,140),mime:file.type,size:raw.byteLength,index:i});
  }
  await env.EDITORIAL_DB.prepare("INSERT INTO editorial_submissions (id,title,category,locale,display_name,reply_email,body,status) VALUES(?,?,?,?,?,?,?,'submitted')")
   .bind(id,title,category,locale,displayName,email,body).run();
  for(const f of uploaded){
   await env.EDITORIAL_DB.prepare("INSERT INTO editorial_images(id,submission_id,object_key,original_name,mime_type,byte_size,position) VALUES(?,?,?,?,?,?,?)")
   .bind(f.id,id,f.key,f.name,f.mime,f.size,f.index).run();
  }
  await env.EDITORIAL_DB.prepare("INSERT INTO editorial_events(submission_id,actor,action,details) VALUES(?,?,?,?)")
   .bind(id,"contributor","submitted","Article received for private editorial review").run();
  if(env.RESEND_API_KEY&&env.STORY_FROM_EMAIL){
   const summary="New Youth Voice submission: "+title+"\nCategory: "+category+"\nLanguage: "+locale+"\nAuthor: "+displayName+"\nPhotos: "+uploaded.length+"\nReference: "+id+"\n\nSign in to the private Editorial Desk to read it.";
   try{await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":"Bearer "+env.RESEND_API_KEY,"Content-Type":"application/json"},
    body:JSON.stringify({from:env.STORY_FROM_EMAIL,to:[env.STORY_TO_EMAIL||"pegasusyouthvoice@gmail.com"],subject:"New Youth Voice article for review",text:summary})})}catch{}
  }
  return json({ok:true,reference:id,message:"Received for private review; not published"},202);
 }catch{
  for(const f of uploaded){try{await env.EDITORIAL_R2.delete(f.key)}catch{}}
  return json({ok:false,error:"storage_failure"},503);
 }
}

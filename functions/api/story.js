// Cloudflare Pages Function: receive private Youth Voice Blog pitches.
// Requires Cloudflare secret RESEND_API_KEY and verified sender STORY_FROM_EMAIL.
// The content never enters the public repository or a public blog feed.
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
const clean=s=>String(s||"").replace(/[\u0000-\u001f\u007f]/g," ").trim();
const escapeHtml=s=>clean(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const isReady=env=>Boolean(env.RESEND_API_KEY&&env.STORY_FROM_EMAIL);
export async function onRequestGet({env}) {
 return json({ready:isReady(env)});
}
export async function onRequestPost({request,env}) {
 if(!isReady(env))return json({ok:false,error:"not_configured"},503);
 const origin=request.headers.get("Origin");
 if(origin){
   try{if(new URL(origin).host!==new URL(request.url).host)return json({ok:false,error:"origin"},403)}
   catch{return json({ok:false,error:"origin"},403)}
 }
 if(!/application\/json/i.test(request.headers.get("content-type")||""))return json({ok:false,error:"format"},415);
 if(Number(request.headers.get("content-length")||0)>5500)return json({ok:false,error:"too_large"},413);
 let body;try{body=await request.json()}catch{return json({ok:false,error:"format"},400)}
 if(!body||typeof body!=="object")return json({ok:false,error:"format"},400);
 // Honeypot bots appear successful but nothing is sent.
 if(body.website)return json({ok:true},202);
 const title=clean(body.topic),idea=clean(body.idea),reply=clean(body.email),locale=["en","mk","sq"].includes(body.locale)?body.locale:"en";
 if(title.length<3||title.length>110||idea.length<15||idea.length>1100)return json({ok:false,error:"invalid"},400);
 if(reply.length>150||(reply&&!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(reply)))return json({ok:false,error:"invalid_email"},400);
 const to=env.STORY_TO_EMAIL||"pegasusyouthvoice@gmail.com";
 const sender=env.STORY_FROM_EMAIL;
 const text="Pegasus Youth Voice · Blog story suggestion\n\nLanguage: "+locale+"\nTopic: "+title+"\nReply email: "+(reply||"Not provided")+"\n\nStory idea:\n"+idea+"\n\nPlease review this pitch privately before publication.";
 const payload={from:sender,to:[to],subject:"Youth Voice Blog story: "+title.slice(0,80),text,html:"<h2>Youth Voice Blog story suggestion</h2><p><b>Language:</b> "+escapeHtml(locale)+"</p><p><b>Topic:</b> "+escapeHtml(title)+"</p><p><b>Reply email:</b> "+escapeHtml(reply||"Not provided")+"</p><h3>Story idea</h3><p style=\"white-space:pre-wrap\">"+escapeHtml(idea)+"</p><p>For private editorial review only.</p>"};
 if(reply)payload.reply_to=reply;
 try{
   const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":"Bearer "+env.RESEND_API_KEY,"Content-Type":"application/json"},body:JSON.stringify(payload)});
   if(!response.ok)return json({ok:false,error:"delivery"},502);
   return json({ok:true},202);
 }catch{return json({ok:false,error:"delivery"},502)}
}

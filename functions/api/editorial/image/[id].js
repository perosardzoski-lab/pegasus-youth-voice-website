import {verifyEditorial,json} from "../../../_lib/editorial-auth.js";
export async function onRequestGet({request,env,params}){
 const user=await verifyEditorial(request,env);if(user.response)return user.response;
 if(!env.EDITORIAL_DB||!env.EDITORIAL_R2)return json({ok:false,error:"storage_not_configured"},503);
 const id=params.id;if(!/^[a-f0-9-]{36}$/.test(id))return json({ok:false,error:"invalid_id"},400);
 try{
  const photo=await env.EDITORIAL_DB.prepare("SELECT object_key,mime_type FROM editorial_images WHERE id = ?").bind(id).first();
  if(!photo)return json({ok:false,error:"not_found"},404);
  const file=await env.EDITORIAL_R2.get(photo.object_key);
  if(!file)return json({ok:false,error:"not_found"},404);
  return new Response(file.body,{headers:{"Content-Type":photo.mime_type,"Content-Disposition":"inline",
    "Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff","Content-Security-Policy":"default-src 'none'; sandbox","Referrer-Policy":"no-referrer"}});
 }catch{return json({ok:false,error:"storage_unavailable"},503)}
}

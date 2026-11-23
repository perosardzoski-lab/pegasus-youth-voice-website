import {verifyEditorial,json} from "../../../_lib/editorial-auth.js";
const statuses=new Set(["submitted","reviewing","changes_requested","approved","rejected"]);
export async function onRequestGet({request,env,params}){
 const who=await verifyEditorial(request,env);if(who.response)return who.response;
 if(!env.EDITORIAL_DB)return json({ok:false,error:"storage_not_configured"},503);
 const id=params.id;if(!/^[a-f0-9-]{36}$/.test(id))return json({ok:false,error:"invalid_id"},400);
 try{
  const v=await env.EDITORIAL_DB.prepare("SELECT id,title,category,locale,display_name,reply_email,body,status,editor_notes,submitted_at,updated_at,approved_by FROM editorial_submissions WHERE id = ?").bind(id).first();
  if(!v)return json({ok:false,error:"not_found"},404);
  const images=await env.EDITORIAL_DB.prepare("SELECT id,original_name,mime_type,byte_size,position FROM editorial_images WHERE submission_id = ? ORDER BY position ASC").bind(id).all();
  return json({ok:true,item:v,images:images.results||[]});
 }catch{return json({ok:false,error:"storage_unavailable"},503)}
}
export async function onRequestPatch({request,env,params}){
 const who=await verifyEditorial(request,env);if(who.response)return who.response;
 if(!env.EDITORIAL_DB)return json({ok:false,error:"storage_not_configured"},503);
 const id=params.id;if(!/^[a-f0-9-]{36}$/.test(id))return json({ok:false,error:"invalid_id"},400);
 const origin=request.headers.get("Origin");
 if(!origin||origin!==new URL(request.url).origin)return json({ok:false,error:"origin_denied"},403);
 if(!/application\/json/i.test(request.headers.get("Content-Type")||""))return json({ok:false,error:"invalid_format"},415);
 let data;try{data=await request.json()}catch{return json({ok:false,error:"invalid_format"},400)}
 const status=String(data?.status||"");
 const notes=String(data?.notes||"").trim();
 if(!statuses.has(status)||notes.length>2500)return json({ok:false,error:"invalid_input"},400);
 if((status==="approved"||status==="rejected")&&who.role!=="admin")return json({ok:false,error:"admin_required"},403);
 if(status==="changes_requested"&&!notes)return json({ok:false,error:"notes_required"},400);
 try{
  const existing=await env.EDITORIAL_DB.prepare("SELECT status FROM editorial_submissions WHERE id = ?").bind(id).first();
  if(!existing)return json({ok:false,error:"not_found"},404);
  if(existing.status==="published")return json({ok:false,error:"already_published"},409);
  const result=await env.EDITORIAL_DB.prepare("UPDATE editorial_submissions SET status = ?,editor_notes = ?,updated_at = datetime('now'),approved_by = CASE WHEN ? = 'approved' THEN ? ELSE approved_by END WHERE id = ?").bind(status,notes,status,who.email,id).run();
  if(!result.success)return json({ok:false,error:"write_failed"},503);
  await env.EDITORIAL_DB.prepare("INSERT INTO editorial_events (submission_id,actor,action,details) VALUES(?,?,?,?)").bind(id,who.email,"status:"+status,notes.slice(0,1000)).run();
  return json({ok:true,status});
 }catch{return json({ok:false,error:"storage_unavailable"},503)}
}

import {verifyEditorial,json} from "../../../_lib/editorial-auth.js";
export async function onRequestGet({request,env}){
 const who=await verifyEditorial(request,env);
 if(who.response)return who.response;
 if(!env.EDITORIAL_DB)return json({ok:false,error:"storage_not_configured"},503);
 const url=new URL(request.url);
 const state=url.searchParams.get("status");
 const valid=["submitted","reviewing","changes_requested","approved","published","rejected"];
 if(state&&!valid.includes(state))return json({ok:false,error:"invalid_filter"},400);
 try{
  const sql=state?"SELECT id,title,category,locale,display_name,status,submitted_at,updated_at FROM editorial_submissions WHERE status = ? ORDER BY submitted_at DESC LIMIT 100":"SELECT id,title,category,locale,display_name,status,submitted_at,updated_at FROM editorial_submissions ORDER BY submitted_at DESC LIMIT 100";
  const stmt=env.EDITORIAL_DB.prepare(sql);
  const rs=await (state?stmt.bind(state):stmt).all();
  return json({ok:true,items:rs.results||[]});
 }catch{return json({ok:false,error:"storage_unavailable"},503)}
}

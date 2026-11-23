import {verifyEditorial,json} from "../../_lib/editorial-auth.js";
export async function onRequestGet({request,env}){
 const who=await verifyEditorial(request,env);
 if(who.response)return who.response;
 return json({ok:true,email:who.email,role:who.role,storage_ready:Boolean(env.EDITORIAL_DB),
   publication_ready:false});
}

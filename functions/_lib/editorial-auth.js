// Cloudflare Access identity verification for the PEGASUS editorial service.
// Never trust user-provided headers such as email without verifying Access JWT.
const unauth=(status=403)=>new Response(JSON.stringify({ok:false,error:status===503?"not_configured":"access_denied"}),{status,headers:{"Content-Type":"application/json","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
const base64url=s=>{const x=s.replace(/-/g,"+").replace(/_/g,"/");const decoded=atob(x.padEnd(Math.ceil(x.length/4)*4,"="));return Uint8Array.from(decoded,c=>c.charCodeAt(0))};
const parseList=s=>new Set(String(s||"").split(/[;,\n]/).map(v=>v.trim().toLowerCase()).filter(Boolean));
export const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer"}});
export async function verifyEditorial(request,env){
 if(env.EDITORIAL_ENABLED!=="true"||!env.ACCESS_TEAM_DOMAIN||!env.ACCESS_AUD)return {response:unauth(503)};
 const domain=String(env.ACCESS_TEAM_DOMAIN).trim().toLowerCase().replace(/^https?:\/\//,"").replace(/\/$/,"");
 if(!/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(domain))return {response:unauth(503)};
 const aud=String(env.ACCESS_AUD).trim();
 const jwt=request.headers.get("Cf-Access-Jwt-Assertion");
 if(!jwt||jwt.length>12000)return {response:unauth(403)};
 const seg=jwt.split(".");if(seg.length!==3)return {response:unauth(403)};
 try{
  const hdr=JSON.parse(new TextDecoder().decode(base64url(seg[0])));
  const claims=JSON.parse(new TextDecoder().decode(base64url(seg[1])));
  if(hdr.alg!=="RS256"||!hdr.kid||typeof hdr.kid!=="string"||hdr.kid.length>250)return {response:unauth(403)};
  const now=Math.floor(Date.now()/1000);
  if(claims.iss!==`https://${domain}`||!Array.isArray(claims.aud)||!claims.aud.includes(aud)||
     !Number.isFinite(claims.exp)||claims.exp<=now||!Number.isFinite(claims.iat)||claims.iat>now+60||
     (claims.nbf!==undefined&&claims.nbf>now+60))return {response:unauth(403)};
  const keys=await fetch(`https://${domain}/cdn-cgi/access/certs`,{headers:{Accept:"application/json"}});
  if(!keys.ok)return {response:unauth(503)};
  const jwks=await keys.json();const key=(jwks.keys||[]).find(k=>k.kid===hdr.kid&&k.kty==="RSA"&&(!k.alg||k.alg==="RS256")&&(!k.use||k.use==="sig"));
  if(!key)return {response:unauth(403)};
  const publicKey=await crypto.subtle.importKey("jwk",key,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["verify"]);
  const valid=await crypto.subtle.verify("RSASSA-PKCS1-v1_5",publicKey,base64url(seg[2]),new TextEncoder().encode(seg[0]+"."+seg[1]));
  if(!valid)return {response:unauth(403)};
  const email=String(claims.email||"").trim().toLowerCase();
  if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return {response:unauth(403)};
  const admins=parseList(env.EDITOR_ADMIN_EMAILS);
  const reviewers=parseList(env.EDITOR_REVIEWER_EMAILS);
  if(!admins.size)return {response:unauth(503)};
  const role=admins.has(email)?"admin":reviewers.has(email)?"editor":null;
  if(!role)return {response:unauth(403)};
  return {email,role,claims};
 }catch{return {response:unauth(403)}}
}

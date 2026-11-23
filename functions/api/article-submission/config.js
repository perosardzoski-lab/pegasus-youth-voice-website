import {json} from "../../_lib/editorial-auth.js";
export async function onRequestGet({env}){return json({ok:env.EDITORIAL_INTAKE_ENABLED==="true"&&Boolean(env.TURNSTILE_SITE_KEY)&&Boolean(env.TURNSTILE_SECRET_KEY)&&Boolean(env.EDITORIAL_DB)&&Boolean(env.EDITORIAL_R2),sitekey:env.EDITORIAL_INTAKE_ENABLED==="true"&&env.TURNSTILE_SITE_KEY||null})}

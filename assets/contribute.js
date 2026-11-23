(() => {
 const $=id=>document.getElementById(id);const form=$("contribution-form"),status=$("contribution-availability"),out=$("contribution-result"),send=$("contribution-send");
 let ready=false,captchaReady=false;
 const message=t=>status.textContent=t;
 fetch("/api/article-submission",{cache:"no-store"}).then(r=>r.json()).then(data=>{
  if(data.ready!==true){message("Article submission is being set up. Online submissions are not accepting personal information yet. Please use the editorial email below.");return;}
  ready=true;form.hidden=false;message("Online article submissions are available. Your story will be reviewed privately.");
  return fetch("/api/article-submission/config",{cache:"no-store"}).then(r=>r.json()).then(data=>{
   if(!data.ok||!data.sitekey){message("Verification is not configured yet; submissions are temporarily unavailable.");return}
   const el=document.createElement("script");el.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";el.async=true;
   el.onload=()=>{window.turnstile.render("#contribution-turnstile",{sitekey:data.sitekey,callback:()=>{captchaReady=true;send.disabled=false}, "expired-callback":()=>{captchaReady=false;send.disabled=true}})};
   el.onerror=()=>message("Verification did not load. Please try again later.");document.head.appendChild(el);
  }).catch(()=>message("Verification is unavailable."));
 }).catch(()=>message("Article submissions are not available yet. Please use the editorial email below."));
 form.addEventListener("submit",async e=>{
  e.preventDefault();if(!ready||!captchaReady||!form.reportValidity())return;
  const fd=new FormData(form);
  const images=fd.getAll("images").filter(v=>v instanceof File&&v.size>0);
  if(images.length>5||images.some(f=>f.size>5*1024*1024)){out.textContent="Please choose no more than five images of 5 MB each.";return}
  send.disabled=true;out.textContent="Submitting privately for review…";
  try{const r=await fetch("/api/article-submission",{method:"POST",body:fd,credentials:"same-origin"}),data=await r.json();
   if(r.ok&&data.ok){out.textContent="Submitted for private editorial review. Reference: "+data.reference+". Keep this reference for your records.";form.reset();ready=false;}
   else{out.textContent="The submission was not accepted ("+(data.error||"error")+"). Please check the form or try again.";send.disabled=false;}
  }catch{out.textContent="Submission could not be completed. Please try again.";send.disabled=false;}
 });
})();
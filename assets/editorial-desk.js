(() => {
 const $=id=>document.getElementById(id);
 const status=$("editorial-status"), area=$("editorial-interface"), inbox=$("editorial-inbox"),
  details=$("editorial-detail"), form=$("editorial-review-form"), decision=$("editorial-decision"),
  notes=$("editorial-notes"), feedback=$("editorial-feedback");
 let role=null,selected=null;
 const say=t=>{status.textContent=t};
 const textEl=(tag,value,cls)=>{const el=document.createElement(tag);el.textContent=value==null?"":String(value);if(cls)el.className=cls;return el};
 async function api(path,opts){
  const r=await fetch(path,{credentials:"same-origin",cache:"no-store",headers:{"Accept":"application/json",...(opts?.headers||{})},...opts});
  const data=await r.json().catch(()=>({ok:false}));
  if(!r.ok||!data.ok)throw Error(data.error||"request_failed");
  return data;
 }
 async function load(){
  inbox.replaceChildren(textEl("p","Loading inbox…"));
  try{
   const data=await api("/api/editorial/submissions/");
   if(!data.items.length){inbox.replaceChildren(textEl("p","No submissions yet."));return}
   inbox.replaceChildren(...data.items.map(item=>{
    const b=document.createElement("button");b.type="button";b.className="editorial-inbox-item";
    b.append(textEl("strong",item.title),textEl("small",item.status+" · "+item.locale+" · "+item.submitted_at));
    b.addEventListener("click",()=>show(item.id));
    return b;
   }));
  }catch(e){inbox.replaceChildren(textEl("p","The private submission database is not connected yet. Editors cannot review or publish articles until setup is complete."))}
 }
 async function show(id){
  try{
   const data=await api("/api/editorial/submissions/"+encodeURIComponent(id));
   const item=data.item;selected=item.id;feedback.textContent="";
   const title=textEl("h4",item.title);
   const meta=textEl("p",item.display_name+" · "+item.category+" · "+item.locale+" · "+item.status,"editorial-meta");
   const body=textEl("div",item.body,"editorial-submission-body");
   details.replaceChildren(title,meta,body);
   if(data.images?.length){
    const gallery=document.createElement("div");gallery.className="editorial-image-list";
    gallery.append(textEl("h4","Submitted photographs"));
    for(const photo of data.images){
     const link=document.createElement("a");link.href="/api/editorial/image/"+encodeURIComponent(photo.id);link.target="_blank";link.rel="noopener noreferrer";
     link.textContent=photo.original_name+" · "+Math.ceil(photo.byte_size/1024)+" KB (open securely)";
     gallery.append(link);
    }
    details.append(gallery);
   }
   decision.value=["submitted","published"].includes(item.status)?"reviewing":item.status;
   notes.value=item.editor_notes||"";
   const approved=decision.querySelector('option[value="approved"]');
   approved.disabled=role!=="admin";
   decision.querySelector('option[value="rejected"]').disabled=role!=="admin";
   if(role!=="admin"&&decision.value==="approved")decision.value="reviewing";
   form.hidden=false;
  }catch{details.replaceChildren(textEl("p","Unable to load this submission."));form.hidden=true}
 }
 form.addEventListener("submit",async e=>{
  e.preventDefault();if(!selected)return;
  feedback.textContent="Saving…";
  try{
   await api("/api/editorial/submissions/"+encodeURIComponent(selected),{
    method:"PATCH",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({status:decision.value,notes:notes.value.trim()})
   });
   feedback.textContent="Editorial decision saved. Article remains private until separately published.";
   await load();await show(selected);
  }catch(err){feedback.textContent="Could not save: "+err.message}
 });
 $("editorial-refresh").addEventListener("click",load);
 api("/api/editorial/session").then(data=>{
  role=data.role;
  $("editorial-user").textContent=data.email;
  $("editorial-role").textContent=role==="admin"?"Administrator / Editor-in-Chief":"Editor / Reviewer";
  say(data.storage_ready?"Authorised editorial access":"Authorised. Submission storage is not yet configured.");
  area.hidden=false;load();
 }).catch(()=>say("Editorial access is not active for this account. The Administrator must first configure Cloudflare Access and invite authorised editors. No submissions are accessible."));
})();
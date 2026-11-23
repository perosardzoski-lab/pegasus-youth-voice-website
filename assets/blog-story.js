/* Youth Voice Blog — private submissions via Cloudflare Pages Function.
   If delivery is not configured, show truthful availability + direct email fallback. */
(() => {
  const labels={
   en:{checking:"Checking whether online submissions are available…",unavailable:"Online story submission is not active yet. You can still email the editorial team using the link below.",sending:"Sending your story idea securely…",success:"Thank you! Your idea has been sent privately to the Pegasus Youth Voice editorial team. It will not be published automatically.",error:"We couldn't send your idea. Please try again, or use the email link below.",invalid:"Please complete the topic and idea fields correctly."},
   mk:{checking:"Проверуваме дали е достапно онлајн испраќање…",unavailable:"Онлајн испраќањето сè уште не е активирано. Можеш да испратиш идеја по е-пошта преку врската подолу.",sending:"Безбедно ја испраќаме твојата идеја…",success:"Ти благодариме! Твојата идеја е испратена приватно до редакцијата на Пегасус Младински Глас. Нема автоматски да биде објавена.",error:"Не успеавме да ја испратиме идејата. Обиди се повторно или користи ја е-адресата подолу.",invalid:"Пополни ги правилно полињата за темата и идејата."},
   sq:{checking:"Po kontrollojmë nëse dërgimi online është i disponueshëm…",unavailable:"Dërgimi online i historive ende nuk është aktivizuar. Mund të dërgosh idenë me email përmes lidhjes më poshtë.",sending:"Po e dërgojmë në mënyrë të sigurt idenë tënde…",success:"Faleminderit! Ideja jote është dërguar privatisht te redaksia e Pegasus Youth Voice. Nuk do të publikohet automatikisht.",error:"Nuk mund ta dërgonim idenë. Provo përsëri ose përdor lidhjen e emailit më poshtë.",invalid:"Plotëso saktë fushat e temës dhe idesë."}
  };
  const lang=(location.pathname.split("/")[1]||"en");
  const t=labels[lang]||labels.en;
  document.querySelectorAll(".blog-story-form").forEach(form=>{
    const status=form.querySelector(".blog-story-status");
    const button=form.querySelector('button[type="submit"]');
    const say=(message)=>{status.textContent=message;status.hidden=false};
    let ready=false;
    button.disabled=true;
    say(t.checking);
    fetch("/api/story",{method:"GET",headers:{"Accept":"application/json"},cache:"no-store"})
     .then(async response=>response.ok?response.json():{ready:false})
     .then(data=>{ready=data.ready===true;button.disabled=!ready;if(!ready)say(t.unavailable);else status.hidden=true})
     .catch(()=>{ready=false;button.disabled=true;say(t.unavailable)});
    form.addEventListener("submit",async event=>{
      event.preventDefault();
      if(!ready){say(t.unavailable);return}
      if(!form.reportValidity()){say(t.invalid);return}
      const topic=form.elements.namedItem("topic").value.trim();
      const idea=form.elements.namedItem("idea").value.trim();
      const email=form.elements.namedItem("email")?.value.trim()||"";
      const website=form.elements.namedItem("website")?.value||"";
      if(!topic||!idea){say(t.invalid);return}
      button.disabled=true;say(t.sending);
      try{
        const response=await fetch("/api/story",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({topic,idea,email,website,locale:lang})});
        const result=await response.json().catch(()=>({ok:false}));
        if(response.ok&&result.ok){say(t.success);form.reset()}
        else{say(response.status===503?t.unavailable:t.error);if(response.status===503)ready=false}
      }catch{say(t.error)}
      button.disabled=!ready;
    });
  });
})();

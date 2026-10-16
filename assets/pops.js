/* Paneles visuales de cada tarjeta (se cargan solo cuando hacen falta):
   · cadena campesinos → dependencia alimentaria (iconos animados)
   · plano real de Bogotá con las troncales y estaciones de TransMilenio, "respirando" según la hora
   · red esquemática de clusters laborales                                                           */
(function(){
"use strict";
const $=s=>document.querySelector(s);
const CSS=`
#pp{position:fixed;z-index:62;right:20px;top:70px;background:#fff;color:#111;border-radius:18px;padding:10px 12px 12px;box-shadow:0 24px 70px -18px rgba(0,0,0,.9);display:none;max-width:calc(100vw - 24px);user-select:none;-webkit-user-select:none}
#pp.show{display:block;animation:plin .55s cubic-bezier(.2,1.15,.3,1)}
#pp .pl-h{padding-bottom:8px}
#pp .note{font:400 10px/1.35 var(--sans);color:#777;margin-top:8px}
/* --- historia en iconos --- */
.st-row{display:flex;align-items:stretch;gap:0;margin-top:2px}
.st-tile{position:relative;flex:1;min-width:0;padding:8px 4px 10px;border-radius:14px;text-align:center;transition:transform .35s cubic-bezier(.2,1.4,.3,1),background .3s,opacity .3s;opacity:.45;cursor:pointer}
.st-tile.on{opacity:1;background:#111;color:#fff;transform:translateY(-4px) scale(1.04);box-shadow:0 14px 28px -12px rgba(0,0,0,.6)}
.st-tile:hover{opacity:1}
.st-tile b{display:block;font:600 11px/1.2 var(--sans);margin-top:6px;padding:0 2px}
.st-n{position:absolute;left:6px;top:4px;font:600 9.5px var(--mono);opacity:.55}
.sc{position:relative;height:74px;display:grid;place-items:center}
.sc .m{display:grid;place-items:center;width:46px;height:46px;border-radius:14px;background:#f1efe9;color:#111;transition:background .3s,color .3s}
.st-tile.on .sc .m{background:var(--c1);color:#111}
.sc .m svg{width:26px;height:26px}
.sc span:not(.m){position:absolute;display:grid;place-items:center;pointer-events:none}
.sc span:not(.m) svg{width:15px;height:15px}
.st-arr{flex:none;width:22px;align-self:center;display:grid;place-items:center;color:#999;margin-top:-30px}
.st-arr svg{width:18px;height:18px;animation:starr 1.4s ease-in-out infinite}
@keyframes starr{50%{transform:translateX(4px);opacity:.5}}
/* escenas */
.sc-exp .u{left:62%;top:30%;opacity:0;animation:suser 2.4s ease-in infinite}.sc-exp .u2{animation-delay:.5s;top:48%}.sc-exp .u3{animation-delay:1s;top:66%}
@keyframes suser{0%{transform:translateX(-14px);opacity:0}25%{opacity:1}100%{transform:translateX(34px);opacity:0}}
.sc-crec .m{animation:screc 2.2s ease-in-out infinite}
@keyframes screc{50%{transform:scale(1.18)}}
.sc-crec .p{opacity:0;animation:spop 2.2s ease-out infinite}.sc-crec .p1{left:62%;top:16%}.sc-crec .p2{left:14%;top:30%;animation-delay:.6s}.sc-crec .p3{left:66%;top:68%;animation-delay:1.2s}
@keyframes spop{0%{transform:scale(0);opacity:0}30%{transform:scale(1.3);opacity:1}100%{transform:scale(1) translateY(-8px);opacity:0}}
.sc-mod .sw{left:50%;top:2px;transform:translateX(-50%);width:20px;height:20px}
.sc-mod .sw b{position:absolute;inset:0;display:grid;place-items:center}.sc-mod .sw b svg{width:17px;height:17px}
.sc-mod .a{animation:swa 3s ease-in-out infinite}.sc-mod .b{animation:swb 3s ease-in-out infinite}
@keyframes swa{0%,40%{opacity:1;transform:scale(1)}55%,100%{opacity:0;transform:scale(.4)}}
@keyframes swb{0%,40%{opacity:0;transform:scale(.4)}55%,100%{opacity:1;transform:scale(1)}}
.sc-perd .w{top:6px;animation:swheat 3s ease-in infinite;opacity:1}.sc-perd .w1{left:22%}.sc-perd .w2{left:46%;animation-delay:.4s}.sc-perd .w3{left:70%;animation-delay:.8s}
@keyframes swheat{0%{opacity:1;transform:translateY(0)}60%,100%{opacity:0;transform:translateY(16px) rotate(30deg)}}
.sc-dep .a{top:2px;animation:sdrop 2s ease-in infinite;opacity:0}.sc-dep .a1{left:18%}.sc-dep .a2{left:46%;animation-delay:.5s}.sc-dep .a3{left:74%;animation-delay:1s}
@keyframes sdrop{0%{transform:translateY(-6px);opacity:0}30%{opacity:1}100%{transform:translateY(18px);opacity:0}}
.st-cap{margin:12px 2px 0;padding:10px 12px;border-radius:12px;background:#f6f4ee;font:400 12.5px/1.45 var(--sans);color:#222;min-height:62px}
.st-cap b{display:block;font:700 13px var(--sans);margin-bottom:2px}
.st-sum{font:500 11.5px/1.45 var(--sans);color:#555;margin:10px 2px 0}
/* --- plano de Bogotá --- */
.tm-wrap{display:flex;gap:14px}
.tm-map{position:relative;border-radius:12px;overflow:hidden;background:#000;flex:none}
.tm-map svg{position:absolute;inset:0;width:100%;height:100%}
.tm-side{width:236px;display:flex;flex-direction:column;gap:10px;min-height:0}
.tm-clock{padding:10px 12px;border-radius:12px;background:#111;color:#fff}
.tm-clock .t{font:700 30px/1 var(--mono);letter-spacing:-1px}.tm-clock .ph{font:500 10.5px var(--mono);letter-spacing:.8px;text-transform:uppercase;color:#bbb;margin-top:5px}
.tm-bar{height:6px;border-radius:4px;background:#333;margin-top:9px;overflow:hidden}.tm-bar i{display:block;height:100%;width:calc(var(--int,.3)*100%);background:linear-gradient(90deg,#ffb02e,#ff5a3c);border-radius:4px;transition:width .25s}
.tm-ctl{display:flex;align-items:center;gap:8px}
.tm-ctl button{flex:none;width:34px;height:34px;border-radius:10px;border:1px solid #ddd;background:#f6f6f6;color:#222;cursor:pointer;display:grid;place-items:center}.tm-ctl button:hover{background:#111;color:#fff}.tm-ctl button svg{width:16px;height:16px}
.tm-ctl input[type=range]{flex:1;accent-color:#111;cursor:pointer}
.tm-chips{display:flex;flex-wrap:wrap;gap:5px}
.tm-chip{display:inline-flex;align-items:center;gap:6px;padding:3px 9px 3px 6px;border-radius:12px;border:1px solid #e1e1e1;background:#fafafa;font:500 10.5px var(--sans);color:#222;cursor:pointer;transition:all .15s}
.tm-chip i{width:9px;height:9px;border-radius:50%;background:var(--c)}.tm-chip small{font:500 9.5px var(--mono);color:#888}
.tm-chip:hover,.tm-chip.on{background:#111;color:#fff;border-color:#111}.tm-chip:hover small,.tm-chip.on small{color:#bbb}
.tm-info{padding:9px 11px;border-radius:12px;background:#f6f4ee;font:400 11.5px/1.4 var(--sans);color:#222;min-height:58px}.tm-info b{display:block;font:700 12px var(--sans)}
.tm-h5{font:600 9.5px var(--mono);letter-spacing:1.1px;text-transform:uppercase;color:#888;margin:0 0 5px}
.tm-map svg{will-change:transform;transform-origin:50% 50%;animation:tmb 7s ease-in-out infinite}
@keyframes tmb{50%{transform:scale(calc(1 + var(--amp,.01)))}}
.tm-loc{fill:#161616;stroke:#303030;stroke-width:.8}
.tm-loc.ken{fill:#2a1d12;stroke:#ffb02e;stroke-width:1.6;animation:tmken 3.4s ease-in-out infinite}
@keyframes tmken{50%{fill:#3a2814;stroke-width:2.4}}
.tm-g{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:9;opacity:calc(.12 + var(--int,.3)*.28)}
.tm-l{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:2.6;opacity:calc(.55 + var(--int,.3)*.45)}
.tm-d{fill:none;stroke:#fff;stroke-width:1.4;stroke-linecap:round;stroke-dasharray:1.5 14;animation:tmd 1.4s linear infinite;animation-play-state:paused;opacity:calc(var(--int,.3)*.9)}.tm-map.s1 .tm-d{animation-play-state:running}
@keyframes tmd{to{stroke-dashoffset:-15.5}}
.tm-hit{fill:none;stroke:transparent;stroke-width:14;pointer-events:stroke;cursor:help}
.tm-hit:hover+*{}
.tm-tr.dim{opacity:.12}
.tm-b{fill:#fff}
.tm-b.t1,.tm-b.t2{display:none}.tm-map.s1 .tm-b.t1{display:inline}.tm-map.s2 .tm-b.t2{display:inline}
.tm-st{stroke:#000;stroke-width:.8;cursor:help}.tm-st.p{animation:tmst var(--sp,3s) ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes tmst{0%,100%{transform:scale(1)}50%{transform:scale(1.9)}}
.tm-st.dim{opacity:.15}
.tm-kl{font:700 15px var(--sans);fill:#ffd9a0;letter-spacing:3px;paint-order:stroke;stroke:#000;stroke-width:3px}
/* --- clusters --- */
.cl-box{position:relative;border-radius:12px;background:#0a0a0a;overflow:hidden}
.cl-box svg{display:block;width:100%;height:100%}
.cl-g{transition:opacity .25s}.cl-g.dim{opacity:.15}
.cl-t{font:600 11px var(--mono);letter-spacing:1.4px;text-transform:uppercase;paint-order:stroke;stroke:#0a0a0a;stroke-width:3px}
/* variante negra (plano de Bogotá) */
#pp.dark{background:#080808;color:#eee;border:1px solid #2a2a2a;box-shadow:0 24px 70px -18px rgba(0,0,0,.95)}
#pp.dark .pl-h i{background:#f4f4f4;color:#000}#pp.dark .pl-h b{color:#fff}#pp.dark .pl-h span{color:#8a8a8a}
#pp.dark .pl-h button,#pp.dark .tm-ctl button{background:#161616;border-color:#333;color:#ddd}#pp.dark .pl-h button:hover,#pp.dark .tm-ctl button:hover{background:#f4f4f4;color:#000;border-color:#f4f4f4}
#pp.dark .tm-map{box-shadow:0 0 0 1px #262626}
#pp.dark .tm-clock{background:#141414;border:1px solid #2a2a2a}
#pp.dark .tm-ctl input[type=range]{accent-color:#f4f4f4}
#pp.dark .tm-chip{background:#131313;border-color:#2c2c2c;color:#ddd}#pp.dark .tm-chip small{color:#8a8a8a}
#pp.dark .tm-chip:hover,#pp.dark .tm-chip.on{background:#f4f4f4;color:#000;border-color:#f4f4f4}#pp.dark .tm-chip:hover small,#pp.dark .tm-chip.on small{color:#444}
#pp.dark .tm-info{background:#131313;border:1px solid #262626;color:#ddd}#pp.dark .tm-info b{color:#fff}
#pp.dark .tm-h5{color:#777}#pp.dark .note{color:#777}
#pp.dark .st-tile.on{background:#f4f4f4;color:#000;box-shadow:0 14px 28px -12px rgba(0,0,0,.8)}#pp.dark .sc .m{background:#171717;color:#eee}#pp.dark .st-tile.on .sc .m{background:var(--c1);color:#111}#pp.dark .st-arr{color:#666}#pp.dark .st-cap{background:#131313;border:1px solid #262626;color:#ddd}#pp.dark .st-cap b{color:#fff}#pp.dark .st-sum{color:#9a9a9a}
@media (max-width:900px){
  #pp{left:8px!important;right:8px;top:auto;bottom:calc(78px + env(safe-area-inset-bottom));width:auto!important;max-height:calc(100vh - 96px);overflow:auto}
  .tm-wrap{flex-direction:column}.tm-side{width:auto}.tm-map{width:100%!important}
  .st-tile b{font-size:10px}.sc .m{width:38px;height:38px}.sc .m svg{width:22px;height:22px}.st-arr{width:12px}
}`;
const st=document.createElement("style"); st.textContent=CSS; document.head.appendChild(st);

let pp=null, cur=null, raf=0, timers=[];
function ensure(){ if(!pp){ pp=document.createElement("div"); pp.id="pp"; pp.className="dark"; document.body.appendChild(pp); } return pp; }
function setPad(w){ try{ popPad=w; }catch(e){} }
function stopAll(){ cancelAnimationFrame(raf); raf=0; timers.forEach(clearTimeout); timers=[]; }
function head(titulo,sub,extra){ return `<div class="pl-h"><i>${extra||""}</i><div><b>${titulo}</b><span>${sub}</span></div><div class="sp" id="ppBtns"></div></div>`; }
function closeBtn(){ const b=document.createElement("button"); b.setAttribute("aria-label","Cerrar"); b.innerHTML=icon("X",2.2); b.onclick=close; $("#ppBtns").appendChild(b); }
function close(){ cur=null; curR=null; stopAll(); setPad(0); if(pp){ pp.classList.remove("show"); pp.innerHTML=""; } }
function show(w){ ensure(); pp.classList.add("show"); const mob=isMobile(); pp.style.width= mob?"auto":w+"px"; setPad(mob?0:w+30); }

/* ================= 1) cadena campesinos → dependencia alimentaria ================= */
const STEPS=[
 {k:"exp", n:"Expulsión de campesinos", d:"Expulsaron violentamente a millones de campesinos de sus tierras rurales.", sc:()=>`<div class="sc sc-exp"><span class="m">${icon("Tractor")}</span><span class="u u1">${icon("User")}</span><span class="u u2">${icon("User")}</span><span class="u u3">${icon("User")}</span></div>`},
 {k:"crec",n:"Crecimiento acelerado", d:"El crecimiento demográfico acelerado de la ciudad.", sc:()=>`<div class="sc sc-crec"><span class="m">${icon("Users")}</span><span class="p p1">${icon("Plus")}</span><span class="p p2">${icon("Plus")}</span><span class="p p3">${icon("Plus")}</span></div>`},
 {k:"mod", n:"Modelo económico", d:"Resultó mucho más rentable transformar la tierra rural en suelo urbano.", sc:()=>`<div class="sc sc-mod"><span class="m">${icon("Banknote")}</span><span class="sw"><b class="a">${icon("Sprout")}</b><b class="b">${icon("Building2")}</b></span></div>`},
 {k:"perd",n:"Pérdida de producción local", d:"Se perdió la producción agrícola local.", sc:()=>`<div class="sc sc-perd"><span class="m">${icon("Sprout")}</span><span class="w w1">${icon("Wheat")}</span><span class="w w2">${icon("Wheat")}</span><span class="w w3">${icon("Wheat")}</span></div>`},
 {k:"dep", n:"Dependencia alimentaria", d:"Dependencia alimentaria generada por la pérdida de producción agrícola local.", sc:()=>`<div class="sc sc-dep"><span class="m">${icon("ShoppingBasket")}</span><span class="a a1">${icon("ArrowDownToLine")}</span><span class="a a2">${icon("ArrowDownToLine")}</span><span class="a a3">${icon("ArrowDownToLine")}</span></div>`}];
function openStory(key){
  ensure(); cur="story"; pp.classList.add("dark"); const c1=(typeof P!=="undefined"?P.c1:"#d9755f"); pp.style.setProperty("--c1",c1);
  let tiles=""; STEPS.forEach((s,i)=>{ tiles+=`<div class="st-tile" data-i="${i}"><span class="st-n">0${i+1}</span>${s.sc()}<b>${s.n}</b></div>`+(i<STEPS.length-1?`<div class="st-arr">${icon("ArrowRight",2.2)}</div>`:""); });
  pp.innerHTML=head("De los campesinos a la dependencia alimentaria","Cómo se encadena",icon("Wheat",2))+`<div class="st-row">${tiles}</div><div class="st-cap" id="stCap"></div>
   <div class="st-sum">La dependencia alimentaria viene de perder la producción agrícola local: un modelo donde era más rentable convertir tierra rural en suelo urbano, acelerado por la expulsión de campesinos.</div>`;
  const bt=$("#ppBtns"); const pl=document.createElement("button"); pl.setAttribute("aria-label","Recorrer la cadena"); pl.title="Recorrer la cadena"; pl.innerHTML=icon("Play",2); pl.onclick=()=>playStory(); bt.appendChild(pl); closeBtn();
  pp.querySelectorAll(".st-tile").forEach(t=>t.onclick=()=>{ stopAll(); setStep(+t.dataset.i,true); });
  show(660);
}
function setStep(i,doPing){ const s=STEPS[i]; pp.querySelectorAll(".st-tile").forEach((t,j)=>t.classList.toggle("on",j===i)); const cap=$("#stCap"); if(cap) cap.innerHTML=`<b>${s.n}</b>${s.d}`; if(doPing&&typeof KK!=="undefined"&&KK[s.k]) try{ ping(KK[s.k]); }catch(e){} }
function playStory(){ stopAll(); STEPS.forEach((s,i)=>timers.push(setTimeout(()=>{ if(cur==="story") setStep(i,true); },i*2600))); }

/* ================= 2) plano de Bogotá con TransMilenio ================= */
const TCOL={"Caracas":"#ff5a3c","NQS":"#ffb02e","Americas":"#36d1c4","Autonorte":"#8ab4ff","Calle 26":"#c792ff","Suba":"#7dffa2","Calle 80":"#ff8fb3","Cr 7-10":"#ffe066","Soacha":"#9be0ff","Tunal":"#ff9d5c","Eje Ambiental":"#a3ffe3","Calle 6":"#d0d0d0"};
const FCOL={1:"#ff7a45",2:"#ffc24d",3:"#4fe3d2"};
let tmHour=5.5, tmPlay=true;
function loadData(cb){ if(window.BOG) return cb(); const s=document.createElement("script"); s.src="assets/bogota-data.js"; s.onload=cb; document.head.appendChild(s); }
const gauss=(h,m,s)=>Math.exp(-((h-m)*(h-m))/(2*s*s));
const intensity=h=>Math.min(1,.16+.84*Math.max(gauss(h,7.2,1.25),.92*gauss(h,18,1.6),.55*gauss(h+24,31,2)));
const phase=h=>h<4.5?"Madrugada":h<6?"Amanece":h<9.5?"Hora pico de la mañana":h<16?"Valle del día":h<20?"Hora pico de la tarde":"Noche";
function openTM(){
  ensure(); cur="tm";  pp.innerHTML=head("Bogotá respira con TransMilenio","Sobrecarga de la red de transporte",icon("Bus",2))+`<div class="tm-wrap"><div class="tm-map" id="tmMap"></div><div class="tm-side" id="tmSide"></div></div>`; closeBtn(); show(10);
  loadData(()=>{ if(cur!=="tm") return; buildTM(); });
}
function sizeTM(){ const mob=isMobile(), B=window.BOG; const mapEl=$("#tmMap"); if(!mapEl) return; let h=Math.min(innerHeight-96,860)-86, w=h*B.w/B.h; if(mob){ w=Math.min(innerWidth-40,360); h=w*B.h/B.w; h=Math.min(h,innerHeight*.5); w=h*B.w/B.h; mapEl.style.margin="0 auto"; } mapEl.style.width=w+"px"; mapEl.style.height=h+"px"; pp.style.width=mob?"auto":(w+236+14+26)+"px"; setPad(mob?0:w+236+14+56); }
function buildTM(){
  const B=window.BOG; sizeTM(); const mapEl=$("#tmMap");
  const lens=B.tr.map(t=>t.km), rnd=(s=>()=>{ s=(s*16807)%2147483647; return (s-1)/2147483646; })(5);
  let glow="",lines="",dash="",hit="",buses="";
  B.tr.forEach((t,i)=>{ const c=FCOL[t.f]||"#fff"; glow+=`<path class="tm-g" stroke="${c}" d="${t.d}"/>`; lines+=`<path id="tmp${i}" class="tm-l tm-tr" data-i="${i}" stroke="${c}" d="${t.d}"/>`; dash+=`<path class="tm-d" d="${t.d}" style="animation-duration:${(1.1+i*.07).toFixed(2)}s"/>`; hit+=`<path class="tm-hit" data-i="${i}" d="${t.d}"/>`;
    const n=Math.max(2,Math.round(t.km/2.2)); for(let j=0;j<n;j++){ const dur=(t.km*1.05+4).toFixed(1), rev=j%2?` keyPoints="1;0" keyTimes="0;1" calcMode="linear"`:""; buses+=`<circle class="tm-b t${j%3}" r="2.5"><animateMotion dur="${dur}s" begin="${(-rnd()*dur).toFixed(1)}s" repeatCount="indefinite"${rev}><mpath href="#tmp${i}"/></animateMotion></circle>`; } });
  const ken=B.loc.find(l=>l.n==="KENNEDY"), nums=(ken.d.match(/-?\d+\.?\d*/g)||[]).map(Number); let kx=0,ky=0,kn=0; for(let i=0;i+1<nums.length;i+=2){ kx+=nums[i]; ky+=nums[i+1]; kn++; } kx/=kn; ky/=kn;
  const stations=B.st.map((s,i)=>`<circle class="tm-st${i%3===0?" p":""}" cx="${s[0]}" cy="${s[1]}" r="2.1" fill="${TCOL[s[3]]||"#fff"}" data-t="${s[3]}" data-n="${s[2].replace(/"/g,"")}" style="animation-delay:${(-(i%17)*.2).toFixed(1)}s"/>`).join("");
  mapEl.innerHTML=`<svg viewBox="0 0 ${B.w} ${B.h}" preserveAspectRatio="xMidYMid slice"><g class="tm-world">
     <g>${B.loc.map(l=>`<path class="tm-loc${l.n==="KENNEDY"?" ken":""}" d="${l.d}"/>`).join("")}</g>
     <g>${glow}</g><g>${lines}</g><g>${dash}</g><g>${buses}</g><g>${stations}</g>
     <text class="tm-kl" x="${kx.toFixed(1)}" y="${(ky+4).toFixed(1)}" text-anchor="middle">KENNEDY</text><g>${hit}</g></g></svg>`;
  const counts={}; B.st.forEach(s=>counts[s[3]]=(counts[s[3]]||0)+1);
  const chips=Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([n,c])=>`<span class="tm-chip" data-t="${n}" style="--c:${TCOL[n]||"#999"}"><i></i>${n}<small>${c}</small></span>`).join("");
  $("#tmSide").innerHTML=`<div class="tm-clock"><div class="t" id="tmT">05:30</div><div class="ph" id="tmP"></div><div class="tm-bar"><i></i></div></div>
    <div class="tm-ctl"><button id="tmPl" aria-label="Pausar o reproducir">${icon("Pause",2.2)}</button><input id="tmR" type="range" min="0" max="24" step="0.05" value="5.5" aria-label="Hora del día"></div>
    <div><div class="tm-h5">Troncales · estaciones</div><div class="tm-chips">${chips}</div></div>
    <div class="tm-info" id="tmI"><b>Pasa el mouse</b>por una línea o una estación.</div>
    <div class="note">Datos reales: trazados y estaciones troncales de TransMilenio (datos abiertos) y localidades de Bogotá. El ritmo según la hora es una ilustración, no son cifras.</div>`;
  const wrap=pp, info=$("#tmI");
  const setH=h=>{ tmHour=h; const i=intensity(h); mapEl.classList.toggle("s1",i>.35); mapEl.classList.toggle("s2",i>.65); wrap.style.setProperty("--int",i.toFixed(3)); wrap.style.setProperty("--amp",(.006+i*.016).toFixed(4)); wrap.style.setProperty("--sp",(3.6-i*2.3).toFixed(2)+"s"); const hh=Math.floor(h)%24, mm=Math.floor((h%1)*60); $("#tmT").textContent=String(hh).padStart(2,"0")+":"+String(mm).padStart(2,"0"); $("#tmP").textContent=phase(h%24); $("#tmR").value=h%24; };
  $("#tmR").oninput=e=>{ tmPlay=false; $("#tmPl").innerHTML=icon("Play",2.2); setH(+e.target.value); };
  $("#tmPl").onclick=()=>{ tmPlay=!tmPlay; $("#tmPl").innerHTML=icon(tmPlay?"Pause":"Play",2.2); };
  let last=performance.now(), lastSet=0; const loop=t=>{ if(cur!=="tm") return; const dt=(t-last)/1000; last=t; if(tmPlay){ tmHour=(tmHour+dt*.9)%24; if(t-lastSet>110){ lastSet=t; setH(tmHour); } } raf=requestAnimationFrame(loop); }; setH(tmHour); raf=requestAnimationFrame(loop);
  const showTr=i=>{ const t=B.tr[i]; info.innerHTML=`<b>Trazado troncal · fase ${t.f}</b>${t.o} → ${t.e}<br><small>${t.km.toFixed(1)} km</small>`; mapEl.querySelectorAll(".tm-tr").forEach((p,j)=>p.classList.toggle("dim",j!==i)); };
  mapEl.querySelectorAll(".tm-hit").forEach(h=>{ h.onmouseenter=()=>showTr(+h.dataset.i); h.onmouseleave=()=>{ mapEl.querySelectorAll(".tm-tr").forEach(p=>p.classList.remove("dim")); }; });
  mapEl.querySelectorAll(".tm-st").forEach(s=>{ s.onmouseenter=()=>{ info.innerHTML=`<b>Estación ${s.dataset.n}</b>Troncal: ${s.dataset.t}`; }; });
  $("#tmSide").querySelectorAll(".tm-chip").forEach(c=>{ const on=()=>{ const t=c.dataset.t; c.classList.add("on"); mapEl.querySelectorAll(".tm-st").forEach(s=>s.classList.toggle("dim",s.dataset.t!==t)); const n=counts[t]; info.innerHTML=`<b>Troncal ${t}</b>${n} estaciones en el conjunto de datos.`; }, off=()=>{ c.classList.remove("on"); mapEl.querySelectorAll(".tm-st").forEach(s=>s.classList.remove("dim")); }; c.onmouseenter=on; c.onmouseleave=off; c.onclick=()=>{ c.classList.contains("on")?off():on(); }; });
}

/* ================= 3) clusters laborales (esquema) ================= */
function openClusters(){
  ensure(); cur="cl"; pp.classList.add("dark"); const col=(typeof P!=="undefined")?[P.c1,P.c2,P.c3,"#b9b3a8"]:["#d9755f","#cdae67","#6fb1a7","#b9b3a8"];
  pp.innerHTML=head("Clusters laborales","Dónde se concentra el trabajo",icon("Briefcase",2))+`<div class="cl-box" id="clB"><svg id="clS" viewBox="0 0 600 420" preserveAspectRatio="xMidYMid meet"></svg></div><div class="note">Representación esquemática de aglomeración de empleo: grupos densos de actividad conectados entre sí y con la periferia. No son datos reales.</div>`; closeBtn(); show(640);
  const box=$("#clB"); box.style.height=Math.min(420,innerHeight*.5)+"px";
  const rnd=(s=>()=>{ s=(s*16807)%2147483647; return (s-1)/2147483646; })(9); const C=[[170,150,46],[420,120,40],[470,300,52],[190,310,36]];
  const clusters=C.map(([x,y,r],ci)=>({x,y,r,col:col[ci],nodes:Array.from({length:12+ci*3},()=>{ const a=rnd()*6.283,d=Math.sqrt(rnd())*r*1.5; return {bx:Math.cos(a)*d,by:Math.sin(a)*d,ph:rnd()*6.283,w:.5+rnd()*.9,am:3+rnd()*5,s:2.4+rnd()*2.2}; })}));
  const svg=$("#clS"); let html=""; clusters.forEach((c,ci)=>{ html+=`<g class="cl-g" data-c="${ci}"><circle class="halo" cx="${c.x}" cy="${c.y}" r="${c.r*2.1}" fill="${c.col}" opacity=".08"/><g class="ed"></g><g class="nd"></g><text class="cl-t" x="${c.x}" y="${c.y+c.r*2.15+14}" text-anchor="middle" fill="${c.col}">Cluster ${"ABCD"[ci]}</text></g>`; });
  html+=`<g class="br"></g><g class="fl"></g>`; svg.innerHTML=html;
  const G=[...svg.querySelectorAll(".cl-g")], brG=svg.querySelector(".br"), flG=svg.querySelector(".fl");
  const pairs=[[0,1],[1,2],[2,3],[3,0],[0,2]]; brG.innerHTML=pairs.map(([a,b])=>`<line stroke="#555" stroke-width="1.2" stroke-dasharray="3 5" data-a="${a}" data-b="${b}"/>`).join(""); const brs=[...brG.children];
  const flows=[]; pairs.forEach(([a,b],i)=>{ for(let k=0;k<3;k++){ const el=document.createElementNS("http://www.w3.org/2000/svg","circle"); el.setAttribute("r","2.6"); el.setAttribute("fill","#fff"); flG.appendChild(el); flows.push({el,a,b,t:rnd(),sp:.12+rnd()*.12,dir:k%2?1:-1}); } });
  clusters.forEach((c,ci)=>{ const g=G[ci], nd=g.querySelector(".nd"), ed=g.querySelector(".ed"); c.els=c.nodes.map(n=>{ const el=document.createElementNS("http://www.w3.org/2000/svg","circle"); el.setAttribute("r",n.s); el.setAttribute("fill",c.col); el.setAttribute("opacity",".9"); nd.appendChild(el); return el; });
    c.lines=c.nodes.map((n,i)=>{ const l=document.createElementNS("http://www.w3.org/2000/svg","line"); l.setAttribute("stroke",c.col); l.setAttribute("stroke-opacity",".35"); l.setAttribute("stroke-width","1"); ed.appendChild(l); const j=(i+1+Math.floor(rnd()*4))%c.nodes.length; return [l,j]; });
    const hub=document.createElementNS("http://www.w3.org/2000/svg","circle"); hub.setAttribute("r","9"); hub.setAttribute("fill",c.col); hub.setAttribute("stroke","#fff"); hub.setAttribute("stroke-width","2"); nd.appendChild(hub); c.hub=hub;
    g.onmouseenter=()=>G.forEach((o,k)=>o.classList.toggle("dim",k!==ci)); g.onmouseleave=()=>G.forEach(o=>o.classList.remove("dim")); });
  let lastF=0; const loop=t=>{ if(cur!=="cl") return; if(t-lastF<32){ raf=requestAnimationFrame(loop); return; } lastF=t; const s=t/1000;
    clusters.forEach(c=>{ const pts=c.nodes.map((n,i)=>[c.x+n.bx+Math.sin(s*n.w+n.ph)*n.am, c.y+n.by+Math.cos(s*n.w*.8+n.ph)*n.am]); c.els.forEach((el,i)=>{ el.setAttribute("cx",pts[i][0].toFixed(1)); el.setAttribute("cy",pts[i][1].toFixed(1)); }); c.lines.forEach(([l,j],i)=>{ l.setAttribute("x1",pts[i][0].toFixed(1)); l.setAttribute("y1",pts[i][1].toFixed(1)); l.setAttribute("x2",pts[j][0].toFixed(1)); l.setAttribute("y2",pts[j][1].toFixed(1)); }); c.hub.setAttribute("cx",c.x); c.hub.setAttribute("cy",c.y); c.hub.setAttribute("r",(9+Math.sin(s*2+c.x)*1.8).toFixed(1)); });
    brs.forEach(l=>{ const a=clusters[+l.dataset.a],b=clusters[+l.dataset.b]; l.setAttribute("x1",a.x); l.setAttribute("y1",a.y); l.setAttribute("x2",b.x); l.setAttribute("y2",b.y); });
    flows.forEach(f=>{ f.t=(f.t+(1/60)*f.sp)%1; const a=clusters[f.a],b=clusters[f.b],u=f.dir>0?f.t:1-f.t; f.el.setAttribute("cx",(a.x+(b.x-a.x)*u).toFixed(1)); f.el.setAttribute("cy",(a.y+(b.y-a.y)*u).toFixed(1)); });
    raf=requestAnimationFrame(loop); }; raf=requestAnimationFrame(loop);
}

/* ================= 4) escenas esquemáticas (negras, animadas) para el resto de variables ================= */
const SXCSS=`
.sx svg{display:block;width:100%;height:auto;background:#050505;border-radius:12px}
.sx-t{font:600 10.5px var(--mono);letter-spacing:1.2px;text-transform:uppercase;fill:#cfcfcf}
.sx-s{font:500 9.5px var(--sans);fill:#8e8e8e}
.px-m{display:flex;flex-direction:column;gap:8px;margin-top:10px}
.px-r{display:grid;grid-template-columns:92px 1fr 64px;gap:10px;align-items:center;font:500 11px var(--sans);color:#cfcfcf}
.px-b{position:relative;height:10px;border-radius:6px;background:#161616}
.px-b i{display:block;height:100%;width:0;border-radius:6px;background:var(--c);animation:mfill 2.6s cubic-bezier(.2,.8,.2,1) forwards}
.px-b u{position:absolute;left:62%;top:-4px;bottom:-4px;width:0;border-left:1.5px dashed #fff;opacity:.7}
.px-r em{font:600 9.5px var(--mono);letter-spacing:.8px;color:#ff7a5c;font-style:normal;text-transform:uppercase;opacity:0;animation:sqshow .5s 2.4s forwards}
.px-cap{font:500 9.5px var(--mono);letter-spacing:1px;color:#8e8e8e;text-transform:uppercase;margin-top:6px}
@keyframes mfill{to{width:calc(var(--v)*62%)}}
@keyframes sqshow{to{opacity:1}}
.sx-seg{display:inline-flex;gap:6px;margin:10px 0 0}
.sx-seg button{height:30px;padding:0 12px;border-radius:9px;border:1px solid #333;background:#161616;color:#ddd;font:500 11.5px var(--sans);cursor:pointer}
.sx-seg button.on{background:#f4f4f4;color:#000;border-color:#f4f4f4}
.sx-leg{display:flex;align-items:center;gap:8px;font:500 10px var(--mono);letter-spacing:.8px;color:#8e8e8e;text-transform:uppercase;margin-top:8px}
.sx-leg i{flex:1;height:7px;border-radius:4px}
.gcell{transition:fill 1s ease}
.rd{animation:rdrop 1.4s linear infinite}
@keyframes rdrop{0%{transform:translateY(-10px);opacity:0}15%{opacity:1}100%{transform:translateY(128px);opacity:0}}
.ia{animation:iinf 2.2s ease-in infinite;opacity:0}
@keyframes iinf{0%{transform:translateY(0);opacity:0}30%{opacity:1}100%{transform:translateY(26px);opacity:0}}
.ro{animation:rrun 1.8s linear infinite;opacity:0}
@keyframes rrun{0%{transform:translateX(0);opacity:0}15%{opacity:1}100%{transform:translateX(120px);opacity:0}}
.cn{transform-box:fill-box;transform-origin:bottom;animation:clvl 5s ease-in-out infinite alternate}
@keyframes clvl{from{transform:scaleY(.25)}to{transform:scaleY(1)}}
.sm{transform-box:fill-box;transform-origin:center;animation:ssm 3.4s ease-out infinite;opacity:0}
@keyframes ssm{0%{transform:translateY(0) scale(.5);opacity:0}15%{opacity:.8}100%{transform:translateY(-70px) scale(2.4);opacity:0}}
.cr{animation:scr 6s linear infinite}
@keyframes scr{from{transform:translateX(-70px)}to{transform:translateX(640px)}}
.bd{transform-box:fill-box;transform-origin:bottom;animation:sbd 5.5s ease-in-out infinite alternate}
@keyframes sbd{from{transform:scaleY(.3)}to{transform:scaleY(1)}}
.drip{animation:sdrip 1.2s ease-in infinite;opacity:0}
@keyframes sdrip{0%{transform:translateY(0);opacity:0}25%{opacity:1}100%{transform:translateY(22px);opacity:0}}
.stg{transition:opacity .3s}.stg.dim{opacity:.35}
.hlp{animation:shl 1.6s ease-in-out infinite}
@keyframes shl{50%{opacity:.35}}
`;
const stx=document.createElement("style"); stx.textContent=SXCSS; document.head.appendChild(stx);
const svgI=(name,x,y,sz,col)=>`<g style="color:${col||"#eee"}">${icon(name,1.9).replace("<svg ",`<svg x="${x}" y="${y}" width="${sz}" height="${sz}" `)}</g>`;
const PCOL=()=>({c1:(typeof P!=="undefined"?P.c1:"#d9755f"),c2:(typeof P!=="undefined"?P.c2:"#cdae67"),c3:(typeof P!=="undefined"?P.c3:"#6fb1a7")});
function meters(list,cap){ return `<div class="px-m">${list.map(m=>`<div class="px-r"><span>${m.n}</span><div class="px-b" style="--c:${m.c};--v:${m.v}"><i></i><u></u></div><em>${m.v>1?"supera":"cerca"}</em></div>`).join("")}</div><div class="px-cap">┆ ${cap}</div>`; }
function sceneShell(title,sub,ic,body,note,w){ ensure(); pp.classList.add("dark"); pp.innerHTML=head(title,sub,icon(ic,2))+`<div class="sx">${body}</div><div class="note">${note}</div>`; closeBtn(); show(w); }

/* a) del andén al humedal */
function openWater(key){
  const C=PCOL(), st=[["Andén","Trash2",C.c2,["res","desc"]],["Alcantarillado","Gauge",C.c2,["san"]],["Escorrentía","Droplets",C.c3,["aguasres","cargas"]],["Humedal El Burro","Droplet",C.c3,["calagua"]]];
  let g="",paths="",parts="";
  st.forEach((s,i)=>{ const x=22+i*148, on=s[3].includes(key); g+=`<g class="stg${on||!key||key==="x"?"":" dim"}"><rect x="${x}" y="40" width="112" height="62" rx="14" fill="#0c0c0c" stroke="${s[2]}" stroke-width="${on?3:1.6}"/>${svgI(s[1],x+10,59,24,s[2])}<text class="sx-t" x="${x+40}" y="68" style="font-size:9.5px">${s[0].split(" ")[0]}</text><text class="sx-s" x="${x+40}" y="82">${s[0].split(" ").slice(1).join(" ")||["residuos","colapsa","carga","recibe"][i]}</text></g>`;
    if(i<3){ const a=x+112, b=x+148; paths+=`<path id="wp${i}" d="M${a} 71L${b} 71" stroke="#444" stroke-width="2" stroke-dasharray="4 4" fill="none"/>`; for(let j=0;j<4;j++) parts+=`<circle r="${3+i*.9}" fill="${i<2?C.c2:C.c3}"><animateMotion dur="1.8s" begin="${(j*.45+i*.2).toFixed(2)}s" repeatCount="indefinite"><mpath href="#wp${i}"/></animateMotion></circle>`; } });
  let drips=""; for(let k=0;k<5;k++) drips+=`<circle class="drip" cx="${170+k*18}" cy="104" r="2.6" fill="#ff7a5c" style="animation-delay:${(k*.25).toFixed(2)}s"/>`;
  const body=`<svg viewBox="0 0 600 150"><text class="sx-t" x="22" y="24">Del desecho al humedal</text>${paths}${g}${parts}${drips}<text class="sx-s" x="22" y="136">Generación masiva de desechos → colapso del alcantarillado → impacto hídrico por escorrentía</text></svg>`+
    meters([{n:"DBO₅",v:1.38,c:C.c1},{n:"Nitrógeno",v:1.22,c:C.c2},{n:"Fósforo",v:1.3,c:C.c3}],"Capacidad de los humedales");
  sceneShell("Del desecho al humedal","Saturación de los residuos",key==="calagua"?"Droplets":"Trash2",body,"Esquema ilustrativo del encadenamiento. Las proporciones de las barras no son mediciones.",660);
}
/* b) lluvia sobre suelo permeable vs. sellado */
function openRain(){
  let rain="",arr="",run="",x0;
  for(let i=0;i<9;i++){ const x=20+i*30; rain+=`<line class="rd" x1="${x}" y1="30" x2="${x-4}" y2="42" stroke="#6fb1ff" stroke-width="2" stroke-linecap="round" style="animation-delay:${(i*.17).toFixed(2)}s"/>`; }
  for(let i=0;i<9;i++){ const x=330+i*30; rain+=`<line class="rd" x1="${x}" y1="30" x2="${x-4}" y2="42" stroke="#6fb1ff" stroke-width="2" stroke-linecap="round" style="animation-delay:${(i*.17+.08).toFixed(2)}s"/>`; }
  for(let i=0;i<6;i++) arr+=`<path class="ia" d="M${40+i*46} 168l0 14m-5-5l5 6 5-6" stroke="#6fb1ff" stroke-width="2" fill="none" stroke-linecap="round" style="animation-delay:${(i*.3).toFixed(2)}s"/>`;
  for(let i=0;i<5;i++) run+=`<ellipse class="ro" cx="${340+i*8}" cy="160" rx="9" ry="2.6" fill="#6fb1ff" style="animation-delay:${(i*.35).toFixed(2)}s"/>`;
  const body=`<svg viewBox="0 0 600 250"><text class="sx-t" x="20" y="18">Suelo permeable</text><text class="sx-t" x="330" y="18">Suelo sellado</text>
   <rect x="0" y="150" width="290" height="46" fill="#2b5d46"/><rect x="0" y="196" width="290" height="40" fill="#18384f"/><text class="sx-s" x="14" y="228">Acuífero · recarga</text>
   <rect x="310" y="150" width="236" height="12" fill="#3a3a3a"/><rect x="310" y="162" width="236" height="74" fill="#1c1c1c"/><rect x="546" y="150" width="54" height="86" fill="#18384f"/><rect class="cn" x="546" y="150" width="54" height="86" fill="#2a78b5" opacity=".7"/>
   <text class="sx-s" x="318" y="205">Asfalto y concreto: el agua no entra</text><text class="sx-s" x="552" y="144">canal</text>
   ${rain}${arr}${run}</svg>`;
  sceneShell("Lluvia sobre suelo sellado","Impermeabilización del suelo","CloudRain",body,"Esquema ilustrativo: donde el suelo se sella, el agua escurre hacia el humedal en vez de infiltrarse.",640);
}
/* c) cuadrícula 2020 → 2026 (calor · comercio · corredores verdes) */
function openGrid(kind){
  const C=PCOL(), NX=30, NY=15, mix=(a,b,t)=>{ const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16); const r=(A>>16)+(((B>>16)-(A>>16))*t)|0,g=(A>>8&255)+(((B>>8&255)-(A>>8&255))*t)|0,bl=(A&255)+(((B&255)-(A&255))*t)|0; return "#"+((1<<24)+(r<<16)+(g<<8)+bl).toString(16).slice(1); };
  const rnd=(s=>()=>{ s=(s*16807)%2147483647; return (s-1)/2147483646; })(kind.length*7+3), noise=[]; for(let i=0;i<NX*NY;i++) noise.push(rnd());
  const cx=12, cy=8, cfg={
    calor:{t:"Islas de calor",s:"Mancha térmica 2020 → 2026",ic:"Mountain",lo:"#2a6f78",hi:"#e5484d",mid:"#e7c45a",lab:["Más fresco","Más caliente"],note:"Esquema ilustrativo: la mancha térmica crece donde se pierde cobertura vegetal y evapotranspiración.",
      f:(i,j,y)=>{ const d=Math.hypot((i-cx)/1.4,(j-cy)*1.1), h=Math.max(0,1-d/ (y?13:8))*.9+noise[j*NX+i]*.18; return Math.min(1,y?h*1.15+.1:h); }},
    comercio:{t:"Concentración comercial y logística",s:"Núcleos comerciales 2020 → 2026",ic:"Store",lo:"#171717",hi:C.c1,mid:"#7a4a3c",lab:["Residencial","Concentración alta"],note:"Esquema ilustrativo: la concentración se expande desde Corabastos hacia los corredores residenciales colindantes.",
      f:(i,j,y)=>{ const d=Math.hypot(i-cx,(j-cy)*1.6), av=(Math.abs(j-cy)<=1&&i>cx-(y?12:5)&&i<cx+(y?14:6))||(Math.abs(i-cx-5)<=0&&Math.abs(j-cy)<(y?7:3))||(Math.abs(i-cx+6)<=0&&Math.abs(j-cy)<(y?6:2)); const h=Math.max(0,1-d/(y?9:5))*.95+(av?.38:0)+noise[j*NX+i]*.12; return Math.min(1,h); }},
    verde:{t:"Soporte ecológico",s:"Corredores ecológicos 2020 → 2026",ic:"Globe",lo:"#1b1b1b",hi:C.c3,mid:"#25483f",lab:["Pavimento","Vegetación conectada"],note:"Esquema ilustrativo: los corredores que conectaban la trama urbana con el humedal se fragmentan por la pavimentación.",
      f:(i,j,y)=>{ const cor=([3,8,12].includes(j)&&i<24)||([6,14].includes(i)&&j>=3&&j<=12); if(i>=24&&i<=28&&j>=4&&j<=10) return 2; if(!cor) return noise[j*NX+i]*.1; return y?(noise[j*NX+i]<.3?.9:.05):.95; }}
  }[kind];
  let cells=""; for(let j=0;j<NY;j++) for(let i=0;i<NX;i++) cells+=`<rect class="gcell" data-i="${i}" data-j="${j}" x="${i*20}" y="${j*20}" width="18" height="18" rx="3"/>`;
  const body=`<svg viewBox="0 0 600 300">${cells}${kind==="verde"?`<text class="sx-t" x="492" y="222" fill="#7fd0ff" style="fill:#7fd0ff">Humedal</text>`:`<g><circle cx="${cx*20+9}" cy="${cy*20+9}" r="14" fill="none" stroke="#fff" stroke-width="2"><animate attributeName="r" values="10;26;10" dur="2.6s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;0;.9" dur="2.6s" repeatCount="indefinite"/></circle><text class="sx-t" x="${cx*20+22}" y="${cy*20-8}" style="fill:#fff">Corabastos</text></g>`}</svg>
   <div class="sx-seg"><button data-y="0" class="on">2020</button><button data-y="1">2026</button></div><div class="sx-leg"><span>${cfg.lab[0]}</span><i style="background:linear-gradient(90deg,${cfg.lo},${cfg.mid},${cfg.hi})"></i><span>${cfg.lab[1]}</span></div>`;
  sceneShell(cfg.t,cfg.s,cfg.ic,body,cfg.note,640);
  const rects=[...pp.querySelectorAll(".gcell")], btns=[...pp.querySelectorAll(".sx-seg button")]; let yr=0;
  const paint=y=>{ yr=y; btns.forEach(b=>b.classList.toggle("on",+b.dataset.y===y)); rects.forEach(r=>{ const v=cfg.f(+r.dataset.i,+r.dataset.j,y); r.setAttribute("fill",v===2?"#2a78b5":v<.5?mix(cfg.lo,cfg.mid,v*2):mix(cfg.mid,cfg.hi,(v-.5)*2)); }); };
  paint(0); btns.forEach(b=>b.onclick=()=>{ stopAll(); paint(+b.dataset.y); });
  const tick=()=>{ if(cur!=="g"+kind) return; paint(yr?0:1); timers.push(setTimeout(tick,3600)); }; cur="g"+kind; timers.push(setTimeout(()=>{ paint(1); timers.push(setTimeout(tick,3600)); },1400));
}
/* d) aire */
function openAir(){
  const C=PCOL(); let sm="",cars="",b="";
  [[40,70,110],[120,40,140],[200,90,90],[270,55,125],[350,100,80],[420,60,120],[500,85,95]].forEach(([x,w,h],i)=>{ b+=`<rect x="${x}" y="${170-h}" width="${w-8}" height="${h}" fill="#171717" stroke="#2a2a2a"/>`; });
  [[150,60],[300,95]].forEach(([x,h],i)=>{ b+=`<rect x="${x}" y="${170-h-40}" width="14" height="40" fill="#222"/>`; for(let k=0;k<4;k++) sm+=`<circle class="sm" cx="${x+7}" cy="${170-h-40}" r="9" fill="${i?C.c2:C.c1}" style="animation-delay:${(k*.85+i*.4).toFixed(2)}s"/>`; });
  for(let k=0;k<3;k++){ cars+=`<g class="cr" style="animation-delay:${(-k*2).toFixed(1)}s"><rect x="0" y="176" width="34" height="12" rx="4" fill="#cfcfcf"/><circle class="sm" cx="-4" cy="178" r="4" fill="${C.c1}" style="animation-delay:${(k*.3).toFixed(1)}s"/></g>`; }
  const body=`<svg viewBox="0 0 600 200"><text class="sx-t" x="20" y="20">Industria y tráfico vehicular</text><rect x="0" y="170" width="600" height="30" fill="#0d0d0d"/><line x1="0" y1="185" x2="600" y2="185" stroke="#333" stroke-dasharray="14 12"/>${b}${sm}${cars}</svg>`+
   meters([{n:"NO₂",v:1.35,c:C.c1},{n:"CO",v:1.18,c:C.c2},{n:"CH₄",v:1.1,c:C.c3}],"Capacidad de dispersión del ecosistema");
  sceneShell("El aire se satura","Presión sobre el aire","Wind",body,"Esquema ilustrativo: la acumulación de dióxido de nitrógeno, monóxido de carbono y metano supera la capacidad de dispersión.",640);
}
/* e) crecer hacia arriba */
function openHeight(){
  const C=PCOL(); let b="";
  [[30,50,160],[100,44,200],[165,56,140],[240,40,210],[305,52,170],[375,46,190],[440,54,150],[510,40,180]].forEach(([x,w,h],i)=>{ let win=""; for(let r=0;r<Math.floor(h/16);r++) for(let c=0;c<2;c++) win+=`<rect x="${x+8+c*(w/2-4)}" y="${196-h+8+r*16}" width="${w/2-12}" height="7" fill="${C.c1}" opacity=".5"/>`; b+=`<g class="bd" style="animation-delay:${(i*.35).toFixed(2)}s"><rect x="${x}" y="${196-h}" width="${w}" height="${h}" rx="3" fill="#141414" stroke="#333"/>${win}</g>`; });
  const body=`<svg viewBox="0 0 600 230"><text class="sx-t" x="20" y="20">Más vivienda en el mismo suelo</text><rect x="0" y="196" width="600" height="34" fill="#0d0d0d"/>${b}
   <g style="color:${C.c2}"><path d="M560 60 v-28 m-8 8 l8 -10 l8 10" stroke="${C.c2}" stroke-width="2.4" fill="none" stroke-linecap="round"><animateTransform attributeName="transform" type="translate" values="0 8;0 -8;0 8" dur="2.4s" repeatCount="indefinite"/></path><text class="sx-t" x="520" y="76" style="fill:${C.c2}">Precio</text></g></svg>`+
   meters([{n:"Densidad",v:1.3,c:C.c1},{n:"Especulación",v:1.25,c:C.c2},{n:"Suelo disponible",v:.35,c:C.c3}],"Límite del suelo urbano");
  sceneShell("Crecer hacia arriba","Densificación · especulación · escasez de suelo","Building2",body,"Esquema ilustrativo: la densificación en altura y la especulación del suelo concentran la residencia donde ya no queda suelo.",640);
}
/* f) planificación: concentrada vs. descentralizada */
function openPlan(){
  const C=PCOL(); let h1="",h2="",id=0;
  const sat=(cx,cy,n,r,rot,tx,ty,pre)=>{ let o=""; for(let i=0;i<n;i++){ const a=rot+i/n*6.283, x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r*.72, pid=pre+(id++); o+=`<path id="${pid}" d="M${x.toFixed(1)} ${y.toFixed(1)}L${tx} ${ty}" stroke="#555" stroke-width="1.4" fill="none"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="#2a2a2a" stroke="#777"/><circle r="3" fill="${C.c1}"><animateMotion dur="${(1.6+(i%3)*.4).toFixed(1)}s" begin="${(i*.2).toFixed(1)}s" repeatCount="indefinite"><mpath href="#${pid}"/></animateMotion></circle>`; } return o; };
  h1=sat(300,115,12,98,.2,300,115,"pa")+`<circle cx="300" cy="115" r="22" fill="${C.c1}" stroke="#fff" stroke-width="2"><animate attributeName="r" values="20;25;20" dur="1.8s" repeatCount="indefinite"/></circle><text class="sx-t" x="300" y="158" text-anchor="middle" style="fill:#fff">Corabastos</text>`;
  [[130,110],[300,70],[470,115]].forEach(([x,y],k)=>{ h2+=sat(x,y,5,48,k,x,y,"pb")+`<circle cx="${x}" cy="${y}" r="13" fill="${[C.c1,C.c2,C.c3][k]}" stroke="#fff" stroke-width="1.6"/>`; });
  const body=`<svg viewBox="0 0 600 230"><g id="plA">${h1}</g><g id="plB" style="display:none">${h2}</g></svg><div class="sx-seg"><button data-m="a" class="on">Orientada al mercado</button><button data-m="b">Descentralizada</button></div>`;
  sceneShell("Planificación urbana","Orientada al mercado y no a la descentralización","PencilRuler",body,"Esquema ilustrativo: cuando todo converge en un solo nodo, la infraestructura incentiva más clústeres y cierra el ciclo.",640);
  const bt=[...pp.querySelectorAll(".sx-seg button")]; bt.forEach(b=>b.onclick=()=>{ bt.forEach(x=>x.classList.toggle("on",x===b)); $("#plA").style.display=b.dataset.m==="a"?"":"none"; $("#plB").style.display=b.dataset.m==="b"?"":"none"; });
}

/* ================= enrutador por tarjeta ================= */
const ROUTE={exp:"story",crec:"story",mod:"story",perd:"story",trans:"tm",desp:"tm",sinc:"tm",cult:"tm",clust:"cl",conc:"cl",monoc:"cl",econag:"cl",
  res:"water",desc:"water",san:"water",aguasres:"water",cargas:"water",calagua:"water",imperm:"rain",suelo:"rain",lluvia:"rain",supcons:"calor",
  eco:"verde",frag:"verde",perdveg:"verde",hab:"verde",biodiv:"verde",may:"comercio",aire:"aire",no2:"aire",esp:"height",esc:"height",plan:"plan"};
const OPEN={story:openStory,tm:openTM,cl:openClusters,water:openWater,rain:openRain,calor:()=>openGrid("calor"),comercio:()=>openGrid("comercio"),verde:()=>openGrid("verde"),aire:openAir,height:openHeight,plan:openPlan};
let curR=null;
window.POPS={
  route:k=>ROUTE[k]||null,
  click(key){
    const r=ROUTE[key]; if(!r){ close(); curR=null; return; }
    if(curR!==r||r==="water"){ stopAll(); OPEN[r](key); curR=r; }
    if(r==="story"){ const i=STEPS.findIndex(s=>s.k===key); if(i>=0) setStep(i,false); }
  },
  close
};window.addEventListener("keydown",e=>{ if(e.key==="Escape") close(); });
window.addEventListener("resize",()=>{ if(cur==="tm"&&window.BOG) sizeTM(); });
})();

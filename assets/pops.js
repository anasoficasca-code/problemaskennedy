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
.tm-world{transform-origin:50% 50%;animation:tmb 7s ease-in-out infinite}
@keyframes tmb{50%{transform:scale(calc(1 + var(--amp,.01)))}}
.tm-loc{fill:#161616;stroke:#303030;stroke-width:.8}
.tm-loc.ken{fill:#2a1d12;stroke:#ffb02e;stroke-width:1.6;animation:tmken 3.4s ease-in-out infinite}
@keyframes tmken{50%{fill:#3a2814;stroke-width:2.4}}
.tm-g{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:9;opacity:calc(.12 + var(--int,.3)*.28)}
.tm-l{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:2.6;opacity:calc(.55 + var(--int,.3)*.45)}
.tm-d{fill:none;stroke:#fff;stroke-width:1.4;stroke-linecap:round;stroke-dasharray:1.5 14;animation:tmd 1.4s linear infinite;opacity:calc(var(--int,.3)*.9)}
@keyframes tmd{to{stroke-dashoffset:-15.5}}
.tm-hit{fill:none;stroke:transparent;stroke-width:14;pointer-events:stroke;cursor:help}
.tm-hit:hover+*{}
.tm-tr.dim{opacity:.12}
.tm-b{fill:#fff}
.tm-b.t1{opacity:calc((var(--int,.3) - .3)*4)}.tm-b.t2{opacity:calc((var(--int,.3) - .6)*5)}
.tm-st{stroke:#000;stroke-width:.8;animation:tmst var(--sp,3s) ease-in-out infinite;transform-box:fill-box;transform-origin:center;cursor:help}
@keyframes tmst{0%,100%{transform:scale(1)}50%{transform:scale(1.9)}}
.tm-st.dim{opacity:.15}
.tm-kl{font:700 15px var(--sans);fill:#ffd9a0;letter-spacing:3px;paint-order:stroke;stroke:#000;stroke-width:3px}
/* --- clusters --- */
.cl-box{position:relative;border-radius:12px;background:#0a0a0a;overflow:hidden}
.cl-box svg{display:block;width:100%;height:100%}
.cl-g{transition:opacity .25s}.cl-g.dim{opacity:.15}
.cl-t{font:600 11px var(--mono);letter-spacing:1.4px;text-transform:uppercase;paint-order:stroke;stroke:#0a0a0a;stroke-width:3px}
@media (max-width:900px){
  #pp{left:8px!important;right:8px;top:auto;bottom:calc(78px + env(safe-area-inset-bottom));width:auto!important;max-height:calc(100vh - 96px);overflow:auto}
  .tm-wrap{flex-direction:column}.tm-side{width:auto}.tm-map{width:100%!important}
  .st-tile b{font-size:10px}.sc .m{width:38px;height:38px}.sc .m svg{width:22px;height:22px}.st-arr{width:12px}
}`;
const st=document.createElement("style"); st.textContent=CSS; document.head.appendChild(st);

let pp=null, cur=null, raf=0, timers=[];
function ensure(){ if(!pp){ pp=document.createElement("div"); pp.id="pp"; document.body.appendChild(pp); } return pp; }
function setPad(w){ try{ popPad=w; }catch(e){} }
function stopAll(){ cancelAnimationFrame(raf); raf=0; timers.forEach(clearTimeout); timers=[]; }
function head(titulo,sub,extra){ return `<div class="pl-h"><i>${extra||""}</i><div><b>${titulo}</b><span>${sub}</span></div><div class="sp" id="ppBtns"></div></div>`; }
function closeBtn(){ const b=document.createElement("button"); b.setAttribute("aria-label","Cerrar"); b.innerHTML=icon("X",2.2); b.onclick=close; $("#ppBtns").appendChild(b); }
function close(){ cur=null; stopAll(); setPad(0); if(pp){ pp.classList.remove("show"); pp.innerHTML=""; } }
function show(w){ ensure(); pp.classList.add("show"); const mob=isMobile(); pp.style.width= mob?"auto":w+"px"; setPad(mob?0:w+30); }

/* ================= 1) cadena campesinos → dependencia alimentaria ================= */
const STEPS=[
 {k:"exp", n:"Expulsión de campesinos", d:"Expulsaron violentamente a millones de campesinos de sus tierras rurales.", sc:()=>`<div class="sc sc-exp"><span class="m">${icon("Tractor")}</span><span class="u u1">${icon("User")}</span><span class="u u2">${icon("User")}</span><span class="u u3">${icon("User")}</span></div>`},
 {k:"crec",n:"Crecimiento acelerado", d:"El crecimiento demográfico acelerado de la ciudad.", sc:()=>`<div class="sc sc-crec"><span class="m">${icon("Users")}</span><span class="p p1">${icon("Plus")}</span><span class="p p2">${icon("Plus")}</span><span class="p p3">${icon("Plus")}</span></div>`},
 {k:"mod", n:"Modelo económico", d:"Resultó mucho más rentable transformar la tierra rural en suelo urbano.", sc:()=>`<div class="sc sc-mod"><span class="m">${icon("Banknote")}</span><span class="sw"><b class="a">${icon("Sprout")}</b><b class="b">${icon("Building2")}</b></span></div>`},
 {k:"perd",n:"Pérdida de producción local", d:"Se perdió la producción agrícola local.", sc:()=>`<div class="sc sc-perd"><span class="m">${icon("Sprout")}</span><span class="w w1">${icon("Wheat")}</span><span class="w w2">${icon("Wheat")}</span><span class="w w3">${icon("Wheat")}</span></div>`},
 {k:"dep", n:"Dependencia alimentaria", d:"Dependencia alimentaria generada por la pérdida de producción agrícola local.", sc:()=>`<div class="sc sc-dep"><span class="m">${icon("ShoppingBasket")}</span><span class="a a1">${icon("ArrowDownToLine")}</span><span class="a a2">${icon("ArrowDownToLine")}</span><span class="a a3">${icon("ArrowDownToLine")}</span></div>`}];
function openStory(key){
  ensure(); cur="story"; const c1=(typeof P!=="undefined"?P.c1:"#d9755f"); pp.style.setProperty("--c1",c1);
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
  ensure(); cur="tm"; pp.innerHTML=head("Bogotá respira con TransMilenio","Sobrecarga de la red de transporte",icon("Bus",2))+`<div class="tm-wrap"><div class="tm-map" id="tmMap"></div><div class="tm-side" id="tmSide"></div></div>`; closeBtn(); show(10);
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
  const stations=B.st.map((s,i)=>`<circle class="tm-st" cx="${s[0]}" cy="${s[1]}" r="2.1" fill="${TCOL[s[3]]||"#fff"}" data-t="${s[3]}" data-n="${s[2].replace(/"/g,"")}" style="animation-delay:${(-(i%17)*.2).toFixed(1)}s"/>`).join("");
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
  const setH=h=>{ tmHour=h; const i=intensity(h); wrap.style.setProperty("--int",i.toFixed(3)); wrap.style.setProperty("--amp",(.006+i*.016).toFixed(4)); wrap.style.setProperty("--sp",(3.6-i*2.3).toFixed(2)+"s"); const hh=Math.floor(h)%24, mm=Math.floor((h%1)*60); $("#tmT").textContent=String(hh).padStart(2,"0")+":"+String(mm).padStart(2,"0"); $("#tmP").textContent=phase(h%24); $("#tmR").value=h%24; };
  $("#tmR").oninput=e=>{ tmPlay=false; $("#tmPl").innerHTML=icon("Play",2.2); setH(+e.target.value); };
  $("#tmPl").onclick=()=>{ tmPlay=!tmPlay; $("#tmPl").innerHTML=icon(tmPlay?"Pause":"Play",2.2); };
  let last=performance.now(); const loop=t=>{ if(cur!=="tm") return; const dt=(t-last)/1000; last=t; if(tmPlay){ tmHour=(tmHour+dt*.9)%24; setH(tmHour); } raf=requestAnimationFrame(loop); }; setH(tmHour); raf=requestAnimationFrame(loop);
  const showTr=i=>{ const t=B.tr[i]; info.innerHTML=`<b>Trazado troncal · fase ${t.f}</b>${t.o} → ${t.e}<br><small>${t.km.toFixed(1)} km</small>`; mapEl.querySelectorAll(".tm-tr").forEach((p,j)=>p.classList.toggle("dim",j!==i)); };
  mapEl.querySelectorAll(".tm-hit").forEach(h=>{ h.onmouseenter=()=>showTr(+h.dataset.i); h.onmouseleave=()=>{ mapEl.querySelectorAll(".tm-tr").forEach(p=>p.classList.remove("dim")); }; });
  mapEl.querySelectorAll(".tm-st").forEach(s=>{ s.onmouseenter=()=>{ info.innerHTML=`<b>Estación ${s.dataset.n}</b>Troncal: ${s.dataset.t}`; }; });
  $("#tmSide").querySelectorAll(".tm-chip").forEach(c=>{ const on=()=>{ const t=c.dataset.t; c.classList.add("on"); mapEl.querySelectorAll(".tm-st").forEach(s=>s.classList.toggle("dim",s.dataset.t!==t)); const n=counts[t]; info.innerHTML=`<b>Troncal ${t}</b>${n} estaciones en el conjunto de datos.`; }, off=()=>{ c.classList.remove("on"); mapEl.querySelectorAll(".tm-st").forEach(s=>s.classList.remove("dim")); }; c.onmouseenter=on; c.onmouseleave=off; c.onclick=()=>{ c.classList.contains("on")?off():on(); }; });
}

/* ================= 3) clusters laborales (esquema) ================= */
function openClusters(){
  ensure(); cur="cl"; const col=(typeof P!=="undefined")?[P.c1,P.c2,P.c3,"#b9b3a8"]:["#d9755f","#cdae67","#6fb1a7","#b9b3a8"];
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
  const loop=t=>{ if(cur!=="cl") return; const s=t/1000;
    clusters.forEach(c=>{ const pts=c.nodes.map((n,i)=>[c.x+n.bx+Math.sin(s*n.w+n.ph)*n.am, c.y+n.by+Math.cos(s*n.w*.8+n.ph)*n.am]); c.els.forEach((el,i)=>{ el.setAttribute("cx",pts[i][0].toFixed(1)); el.setAttribute("cy",pts[i][1].toFixed(1)); }); c.lines.forEach(([l,j],i)=>{ l.setAttribute("x1",pts[i][0].toFixed(1)); l.setAttribute("y1",pts[i][1].toFixed(1)); l.setAttribute("x2",pts[j][0].toFixed(1)); l.setAttribute("y2",pts[j][1].toFixed(1)); }); c.hub.setAttribute("cx",c.x); c.hub.setAttribute("cy",c.y); c.hub.setAttribute("r",(9+Math.sin(s*2+c.x)*1.8).toFixed(1)); });
    brs.forEach(l=>{ const a=clusters[+l.dataset.a],b=clusters[+l.dataset.b]; l.setAttribute("x1",a.x); l.setAttribute("y1",a.y); l.setAttribute("x2",b.x); l.setAttribute("y2",b.y); });
    flows.forEach(f=>{ f.t=(f.t+(1/60)*f.sp)%1; const a=clusters[f.a],b=clusters[f.b],u=f.dir>0?f.t:1-f.t; f.el.setAttribute("cx",(a.x+(b.x-a.x)*u).toFixed(1)); f.el.setAttribute("cy",(a.y+(b.y-a.y)*u).toFixed(1)); });
    raf=requestAnimationFrame(loop); }; raf=requestAnimationFrame(loop);
}

/* ================= enrutador por tarjeta ================= */
const ROUTE={exp:"story",crec:"story",mod:"story",perd:"story",trans:"tm",desp:"tm",sinc:"tm",cult:"tm",clust:"cl"};
window.POPS={
  route:k=>ROUTE[k]||null,
  click(key){
    const r=ROUTE[key]; if(!r){ close(); return; }
    if(cur!==r){ stopAll(); (r==="story"?openStory:r==="tm"?openTM:openClusters)(key); }
    if(r==="story"){ const i=STEPS.findIndex(s=>s.k===key); if(i>=0) setStep(i,false); }
  },
  close
};
window.addEventListener("keydown",e=>{ if(e.key==="Escape") close(); });
window.addEventListener("resize",()=>{ if(cur==="tm"&&window.BOG) sizeTM(); });
})();

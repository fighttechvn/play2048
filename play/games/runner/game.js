/* =====================================================================
   Endless Runner thương hiệu — game marketing tự chứa (offline).
   - Theme tách rời: nạp ./theme.json; fallback THEME mặc định.
   - Lead + leaderboard: localStorage (prototype). Production → Supabase.
   ===================================================================== */

const THEME = {
  brand:"BrewLab", logo:"🏃", name:"BrewLab Dash",
  tagline:"Chạy thật xa, nhặt cà phê, né vật cản — leo bảng xếp hạng nhận thưởng thật!",
  colors:{ primary:"#6F4E37", accent:"#E0B015", bg:"#FBF1E6", sky:"#f3e2cd", card:"#ffffff",
           ink:"#2b231c", muted:"#8a7d6e", bd:"#e7dccd", gold:"#e0b015", ground:"#5a4632" },
  mascot:"🏃", collectible:"☕",
  powerup:{ img:"⚡", label:"Espresso bứt tốc!", buffMs:4500 },
  milestones:[
    { m:500,  code:"DASH05", label:"Giảm 5% cho đơn tiếp theo" },
    { m:1000, code:"DASH10", label:"Giảm 10% cho đơn tiếp theo" },
    { m:2000, code:"DASH20", label:"Giảm 20% + 1 phần quà" },
  ],
};

// ---- tuning ----
const GROUND_H = 64;          // ground strip height (css px)
const BASE_SPEED = 320;       // px/s
const SPEED_K = 0.05;         // speed gain per meter
const MAX_SPEED = 720;
const GRAVITY = 2600;         // px/s^2
const JUMP_V = 1020;          // jump impulse
const M_PER_PX = 0.05;        // distance scale: px scrolled → meters
const COIN_VALUE = 25;
const DUCK_MS = 650;          // swipe-duck duration

let cfg = THEME;
const cv = document.getElementById("cv"), ctx = cv.getContext("2d");
const $ = id => document.getElementById(id);
let W=0, H=0, groundY=0, dpr=1;

// ---- state ----
let running=false, raf=0, lastT=0;
let dist=0, coins=0, speed=BASE_SPEED;
let mascot=null;             // {x,y,vy,w,h,duckUntil,ducking}
let ents=[];                 // obstacles/coins/powerups
let spawnX=0;                // next spawn cursor (world px ahead)
let buffUntil=0;
let bestMilestone=null;      // {code,label,m}
let scrollBg=0;
let lastResult=null;
let screens=["start","over","lb","tut"];

function show(name){ // null => gameplay (all overlays off)
  screens.forEach(s=>$("s-"+s).classList.toggle("on", s===name));
  const inGame = name===null;
  $("hud").style.display = inGame ? "flex" : "none";
  $("hint").style.display = inGame ? "block" : "none";
}

// ---- theme ----
async function loadTheme(){
  try{ const r=await fetch("./theme.json",{cache:"no-store"}); if(r.ok) cfg=Object.assign({},THEME,await r.json()); }catch(_){}
  const c=cfg.colors||{};
  for(const [k,v] of Object.entries(c)) document.documentElement.style.setProperty("--"+k,v);
  $("brandLogo").textContent=cfg.logo||"🏃";
  $("brandName").textContent=cfg.name||"Endless Runner";
  $("brandTagline").textContent=cfg.tagline||"";
  $("brandFoot").textContent=cfg.brand||"YourBrand";
}

// ---- sizing ----
function resize(){
  dpr=Math.min(window.devicePixelRatio||1, 2);
  const st=document.getElementById("stage");
  W=st.clientWidth; H=st.clientHeight; groundY=H-GROUND_H;
  cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener("resize", resize);

// ---- colors helper ----
function cssvar(n){ return getComputedStyle(document.documentElement).getPropertyValue("--"+n).trim(); }

// ---- game control ----
function start(){
  resize();
  running=true; dist=0; coins=0; speed=BASE_SPEED; ents=[]; buffUntil=0; bestMilestone=null; scrollBg=0;
  mascot={ x:Math.round(W*0.22), y:groundY, vy:0, w:46, h:54, ducking:false, duckUntil:0 };
  spawnX=W+200;
  $("hDist").textContent="0"; $("hCoins").textContent="0"; $("hBuff").style.display="none";
  show(null);
  lastT=performance.now();
  cancelAnimationFrame(raf); raf=requestAnimationFrame(loop);
}

function gameOver(){
  running=false; cancelAnimationFrame(raf);
  const meters=Math.floor(dist);
  const score=meters + coins*COIN_VALUE;
  lastResult={ meters, score };
  $("oDist").textContent=meters.toLocaleString("vi-VN")+" m";
  $("oScore").textContent=score.toLocaleString("vi-VN");
  // milestone reward (highest reached)
  const rw=$("reward");
  if(bestMilestone){
    rw.classList.remove("none"); rw.classList.add("locked");
    $("rMile").textContent=`✅ Đạt mốc ${bestMilestone.m.toLocaleString("vi-VN")}m`;
    $("rCode").textContent=bestMilestone.code;
    $("rLabel").textContent=bestMilestone.label;
    $("leadForm").style.display="flex";
  }else{
    rw.classList.add("none"); rw.classList.remove("locked");
    $("rMile").textContent="Chạy tới mốc 500m để mở mã giảm giá!";
    $("rCode").textContent=""; $("rLabel").textContent="";
    $("leadForm").style.display="flex";
  }
  // provisional rank
  $("oRank").textContent = "#"+provisionalRank(score);
  $("leadInput").value=""; $("leadErr").textContent="";
  show("over");
}

// ---- input ----
function jump(){
  if(!running||!mascot) return;
  if(mascot.y>=groundY-0.5){ mascot.vy=-JUMP_V; }       // only from ground
}
function duck(ms){
  if(!running||!mascot) return;
  mascot.duckUntil=performance.now()+ms;
}
function endDuck(){ if(mascot) mascot.duckUntil=0; }

addEventListener("keydown", e=>{
  if(e.code==="Space"||e.code==="ArrowUp"){ e.preventDefault(); if(running) jump(); }
  else if(e.code==="ArrowDown"){ e.preventDefault(); if(running) duck(99999); }
});
addEventListener("keyup", e=>{ if(e.code==="ArrowDown") endDuck(); });

// pointer/touch: tap=jump, swipe-down=duck
let pStartY=0, pStartT=0, pMoved=false;
cv.addEventListener("pointerdown", e=>{ pStartY=e.clientY; pStartT=performance.now(); pMoved=false; });
cv.addEventListener("pointermove", e=>{ if(e.clientY-pStartY>40 && !pMoved){ pMoved=true; if(running) duck(DUCK_MS); } });
cv.addEventListener("pointerup", e=>{
  if(!running) return;
  const dt=performance.now()-pStartT;
  if(!pMoved && dt<350) jump();              // quick tap
});

// ---- spawning ----
function spawn(){
  // spawn ahead until spawnX beyond view+buffer
  const horizon=W+260;
  while(spawnX < dist/M_PER_PX + horizon){
    const r=rndFor(Math.floor(spawnX));
    let type;
    if(r<0.16) type="powerup"; else if(r<0.52) type="coin"; else type="obstacle";
    const worldX=spawnX;
    if(type==="obstacle"){
      const high = rndFor(worldX*3) < 0.32;     // ~1/3 are overhead → duck
      if(high) ents.push({type:"obs",hi:true, wx:worldX, y:groundY-78, w:54, h:34});
      else { const w=28+Math.floor(rndFor(worldX*5)*26); ents.push({type:"obs",hi:false, wx:worldX, y:groundY-(34), w, h:34}); }
    }else if(type==="coin"){
      // a small arc of coins
      const n=3+Math.floor(rndFor(worldX*7)*3);
      for(let i=0;i<n;i++) ents.push({type:"coin", wx:worldX+i*40, y:groundY-70-Math.round(26*Math.sin(i/(n-1)*Math.PI)), w:26, h:26, got:false});
    }else{
      ents.push({type:"pow", wx:worldX, y:groundY-90, w:34, h:34, got:false});
    }
    // gap scales with speed so it's always passable
    const gap = (type==="coin"?160:0) + 260 + speed*0.55*rndFor(worldX*11);
    spawnX += gap;
  }
}

// ---- loop ----
function loop(now){
  const dt=Math.min(0.034,(now-lastT)/1000); lastT=now;
  update(dt); render();
  if(running) raf=requestAnimationFrame(loop);
}

function update(dt){
  const boosted = now()<buffUntil;
  speed=Math.min(MAX_SPEED, BASE_SPEED + dist*SPEED_K) * (boosted?1.45:1);
  const dpx=speed*dt;
  dist += dpx*M_PER_PX;
  scrollBg += dpx;

  // mascot physics
  mascot.vy += GRAVITY*dt;
  mascot.y += mascot.vy*dt;
  if(mascot.y>groundY){ mascot.y=groundY; mascot.vy=0; }
  mascot.ducking = now()<mascot.duckUntil && mascot.y>=groundY-0.5;

  // HUD
  $("hDist").textContent=Math.floor(dist).toLocaleString("vi-VN");
  $("hCoins").textContent=String(coins);
  if(boosted){ $("hBuff").style.display="inline-block"; $("hBuffT").textContent=Math.ceil((buffUntil-now())/1000); }
  else $("hBuff").style.display="none";

  // milestones
  for(const ms of (cfg.milestones||[])){
    if(dist>=ms.m && (!bestMilestone || ms.m>bestMilestone.m)) bestMilestone={...ms};
  }

  spawn();

  // entity update + collision
  const mb=mascotBox();
  for(const e of ents){
    e.x = e.wx - dist/M_PER_PX;      // world→screen
    if(e.type==="coin"&&!e.got && hit(mb,e)){ e.got=true; coins++; }
    else if(e.type==="pow"&&!e.got && hit(mb,e)){ e.got=true; buffUntil=now()+((cfg.powerup&&cfg.powerup.buffMs)||4000); }
    else if(e.type==="obs" && !boosted && hit(mb,e)){ return gameOver(); }
  }
  ents = ents.filter(e=> e.x > -80 && !(e.got));
}

function mascotBox(){
  const duck=mascot.ducking;
  const w=duck?mascot.w+10:mascot.w, h=duck?mascot.h*0.55:mascot.h;
  return { x:mascot.x-w/2+6, y:mascot.y-h, w:w-12, h:h-4 };
}
function hit(a,b){ return a.x<b.x+b.w && a.x+a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y; }

// ---- render ----
function render(){
  ctx.clearRect(0,0,W,H);
  // sky
  const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,cssvar("bg")); g.addColorStop(1,cssvar("sky")); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  // far parallax hills
  drawHills(scrollBg*0.25, groundY, cssvar("sky"), 0.6);
  drawHills(scrollBg*0.5, groundY+8, cssvar("sky"), 1);
  // ground
  ctx.fillStyle=cssvar("ground"); ctx.fillRect(0,groundY,W,H-groundY);
  // ground dashes scrolling
  ctx.strokeStyle="rgba(255,255,255,.25)"; ctx.lineWidth=4; ctx.setLineDash([26,22]);
  ctx.lineDashOffset=-(scrollBg%48); ctx.beginPath(); ctx.moveTo(0,groundY+18); ctx.lineTo(W,groundY+18); ctx.stroke(); ctx.setLineDash([]);

  // entities
  for(const e of ents){
    if(e.x<-80||e.x>W+80) continue;
    if(e.type==="coin"){ emoji(cfg.collectible||"🪙", e.x+e.w/2, e.y+e.h, e.h); }
    else if(e.type==="pow"){ glow(e.x+e.w/2,e.y+e.h/2,e.h); emoji((cfg.powerup&&cfg.powerup.img)||"⚡", e.x+e.w/2, e.y+e.h, e.h+4); }
    else { drawObstacle(e); }
  }

  // mascot
  drawMascot();

  // buff aura
  if(now()<buffUntil){ ctx.save(); ctx.globalAlpha=.35; glow(mascot.x, mascot.y-mascot.h/2, mascot.h*1.4); ctx.restore(); }
}

function drawHills(off, baseY, color, alpha){
  const span=260, amp=46; ctx.save(); ctx.globalAlpha=0.5*alpha; ctx.fillStyle=color;
  ctx.beginPath(); ctx.moveTo(0,baseY);
  for(let x=-((off)%span)-span; x<=W+span; x+=span){
    ctx.quadraticCurveTo(x+span/2, baseY-amp, x+span, baseY);
  }
  ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath(); ctx.fill(); ctx.restore();
}

function drawObstacle(e){
  ctx.save();
  ctx.fillStyle=cssvar("primary");
  if(e.hi){ // overhead bar hanging from a post → must duck
    roundRect(e.x, e.y, e.w, e.h, 7); ctx.fill();
    ctx.fillStyle="rgba(0,0,0,.18)"; ctx.fillRect(e.x+e.w/2-3, e.y-(groundY-78-0), 6, 0); // (no-op spacer)
    ctx.fillStyle=cssvar("accent"); roundRect(e.x+6,e.y+e.h-8,e.w-12,5,3); ctx.fill();
  }else{ // ground crate → jump
    roundRect(e.x, e.y, e.w, e.h, 6); ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,.35)"; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(e.x,e.y+e.h/2); ctx.lineTo(e.x+e.w,e.y+e.h/2); ctx.stroke();
  }
  ctx.restore();
}

function drawMascot(){
  const bob = mascot.y>=groundY-0.5 ? Math.sin(scrollBg*0.05)*3 : 0;
  const size = mascot.ducking ? mascot.h*0.7 : mascot.h;
  emoji(cfg.mascot||"🏃", mascot.x, mascot.y+bob, size+8);
}

function emoji(ch,cx,baseY,size){
  ctx.save(); ctx.font=`${size}px "Apple Color Emoji","Segoe UI Emoji",sans-serif`;
  ctx.textAlign="center"; ctx.textBaseline="alphabetic"; ctx.fillText(ch,cx,baseY); ctx.restore();
}
function glow(cx,cy,r){ const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r); g.addColorStop(0,"rgba(255,220,90,.8)"); g.addColorStop(1,"rgba(255,220,90,0)");
  ctx.save(); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,r,0,7); ctx.fill(); ctx.restore(); }
function roundRect(x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }

// ---- lead + leaderboard (prototype localStorage) ----
function submitLead(contact,score){
  const leads=JSON.parse(localStorage.getItem("run.leads")||"[]");
  leads.push({contact,score,at:new Date().toISOString()}); localStorage.setItem("run.leads",JSON.stringify(leads));
  saveScore(nameFrom(contact),score);
}
function nameFrom(c){ const s=String(c).trim(); return s.includes("@")?s.split("@")[0].slice(0,3)+"***":s.slice(0,3)+"***"+s.slice(-2); }
function weekKey(){ const d=new Date(),o=new Date(d.getFullYear(),0,1); return d.getFullYear()+"-W"+Math.ceil((((d-o)/864e5)+o.getDay()+1)/7); }
function seedIfEmpty(){
  const wk=weekKey(); const seeded=JSON.parse(localStorage.getItem("run.seeded")||"{}"); if(seeded[wk]) return;
  const all=JSON.parse(localStorage.getItem("run.scores")||"{}");
  const names=["Tú","Vy","Nam","Minh","Lan","An","Huy","Bảo","Chi","Đạt"];
  all[wk]=(all[wk]||[]).concat(names.map((n,i)=>({name:n+"***",score:3900-i*240-i*i*8,me:false})));
  localStorage.setItem("run.scores",JSON.stringify(all)); seeded[wk]=true; localStorage.setItem("run.seeded",JSON.stringify(seeded));
}
function saveScore(name,score){ const wk=weekKey(); const all=JSON.parse(localStorage.getItem("run.scores")||"{}");
  const arr=all[wk]||[]; arr.forEach(x=>x.me=false); arr.push({name,score,me:true}); all[wk]=arr; localStorage.setItem("run.scores",JSON.stringify(all)); }
function provisionalRank(score){ seedIfEmpty(); const wk=weekKey(); const all=JSON.parse(localStorage.getItem("run.scores")||"{}");
  const arr=(all[wk]||[]).slice(); arr.push({score}); arr.sort((a,b)=>b.score-a.score); return arr.findIndex(x=>x.score===score)+1; }
function renderLb(){
  seedIfEmpty(); const wk=weekKey(); const all=JSON.parse(localStorage.getItem("run.scores")||"{}");
  const arr=(all[wk]||[]).slice().sort((a,b)=>b.score-a.score); const list=$("lbList"); list.innerHTML="";
  const medal=["🥇","🥈","🥉"];
  arr.slice(0,12).forEach((x,i)=>{ const r=document.createElement("div"); r.className="r"+(x.me?" me":"");
    r.innerHTML=`<span class="rk">${medal[i]||("#"+(i+1))}</span><span class="nm">${x.me?"BẠN":esc(x.name)}</span><span class="sc">${x.score.toLocaleString("vi-VN")}</span>`;
    list.appendChild(r); });
  $("lbReset").textContent=`Top 3 nhận quà thật cuối tuần • ${arr.length} người chơi`;
}
function esc(s){ return String(s).replace(/[<>&]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;"}[c])); }

// ---- share ----
async function share(){
  const sc=(lastResult&&lastResult.score)||0;
  const text=`Mình vừa chạy được ${sc.toLocaleString("vi-VN")} điểm ở ${cfg.name}! Thử vượt mình nhé 👇`;
  try{ if(navigator.share){ await navigator.share({title:cfg.name,text,url:location.href}); return; } }catch(_){}
  try{ await navigator.clipboard.writeText(text+" "+location.href); toast("Đã copy link thách đấu!"); }catch(_){ alert(text); }
}
let toastT=0; function toast(m){ const h=$("hint"); h.style.display="block"; h.textContent=m; clearTimeout(toastT); toastT=setTimeout(()=>{ h.textContent="Chạm để NHẢY · Vuốt xuống để CÚI"; },2200); }

// ---- tutorial ----
const TUT=[
  { e:"👆", t:"Nhảy qua vật cản", x:"<b>Chạm màn hình</b> (hoặc phím cách) để mascot <b>nhảy</b> qua thùng/chướng ngại dưới đất." },
  { e:"👇", t:"Cúi né vật cản cao", x:"<b>Vuốt xuống</b> (hoặc phím ↓) để <b>cúi</b> né các thanh chắn trên cao." },
  { e:"🎁", t:"Nhặt quà & lên top", x:`Nhặt ${(cfg&&cfg.collectible)||"🪙"} ăn điểm, ${(cfg&&cfg.powerup&&cfg.powerup.img)||"⚡"} để bứt tốc. Chạy xa mở <b>mã giảm giá</b> & leo <b>bảng xếp hạng</b>!` },
];
let tStep=0, tThenStart=false;
function renderTut(){ const s=TUT[tStep]; $("tutEmoji").textContent=s.e; $("tutTitle").textContent=s.t; $("tutText").innerHTML=s.x;
  $("tutDots").innerHTML=TUT.map((_,i)=>`<i class="${i===tStep?"on":""}"></i>`).join("");
  $("tutNext").textContent=tStep===TUT.length-1?(tThenStart?"▶ Bắt đầu":"Đã hiểu!"):"Tiếp →"; }
function openTut(thenStart){ tThenStart=thenStart; tStep=0; renderTut(); show("tut"); }
function closeTut(){ localStorage.setItem("run.tutSeen","1"); if(tThenStart){ tThenStart=false; start(); } else show("start"); }
$("tutNext").onclick=()=>{ if(tStep<TUT.length-1){ tStep++; renderTut(); } else closeTut(); };
$("tutSkip").onclick=closeTut;
function playOrTutor(){ if(localStorage.getItem("run.tutSeen")) start(); else openTut(true); }

// ---- helpers ----
function now(){ return performance.now(); }
// deterministic pseudo-random per worldX (stable across frames)
function rndFor(seed){ let x=Math.sin(seed*12.9898+78.233)*43758.5453; return x-Math.floor(x); }

// ---- wire up ----
$("btnPlay").onclick=playOrTutor;
$("btnPlayFromLb").onclick=start;
$("btnReplay").onclick=start;
$("btnHowTo").onclick=()=>openTut(false);
$("btnBack").onclick=()=>show("start");
$("btnLbFromStart").onclick=()=>{ renderLb(); show("lb"); };
$("btnLbFromOver").onclick=()=>{ renderLb(); show("lb"); };
$("btnShare").onclick=share;
$("leadForm").addEventListener("submit", e=>{
  e.preventDefault(); const v=$("leadInput").value.trim();
  const ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)||/^[0-9+\-\s]{8,}$/.test(v);
  if(!ok){ $("leadErr").textContent="Nhập email hoặc số điện thoại hợp lệ."; return; }
  $("leadErr").textContent=""; submitLead(v, (lastResult&&lastResult.score)||0);
  if(bestMilestone){ $("reward").classList.remove("locked"); }
  $("leadForm").style.display="none";
  $("oRank").textContent="#"+provisionalRank((lastResult&&lastResult.score)||0);
  toast("Đã lưu điểm!");
});

// ---- boot ----
loadTheme().then(()=>{ resize(); render(); show("start"); });

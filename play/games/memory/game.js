/* =====================================================================
   Lật thẻ thương hiệu — game marketing tự chứa (offline, không phụ thuộc).
   - Theme tách rời: nạp ./theme.json khi có; nếu không, dùng THEME mặc định.
   - Lead + leaderboard: lưu localStorage (prototype). Production → đổi sang
     submitLead()/saveScore() gọi API Supabase.
   ===================================================================== */

// -------- Theme mặc định (demo cà phê). Ghi đè bằng theme.json --------
const THEME = {
  brand: "BrewLab",
  logo: "☕",
  name: "Lật thẻ — Đoán sản phẩm",
  tagline: "Tìm hết các cặp để mở mã giảm giá. Càng ít lượt & càng nhanh, điểm càng cao!",
  colors: { primary:"#6F4E37", accent:"#C8A06B", bg:"#FFF8F0", card:"#ffffff", ink:"#2b231c", muted:"#8a7d6e", bd:"#e7dccd", gold:"#e0b015" },
  reward: { code:"BREW10", label:"Giảm 10% cho đơn tiếp theo" },
  goldenPair: true,
  // Mỗi phần tử = 1 loại thẻ (1 cặp). img có thể là emoji hoặc URL ảnh.
  pairs: [
    { img:"☕", usp:"Espresso — 100% Arabica, đậm vị" },
    { img:"🥛", usp:"Latte — sữa tươi mịn, ít đắng" },
    { img:"🧊", usp:"Cold Brew — ủ lạnh 18h, êm dịu" },
    { img:"🍫", usp:"Mocha — cacao Bỉ nguyên chất" },
    { img:"🍮", usp:"Affogato — kem vani + shot nóng" },
    { img:"🥐", usp:"Croissant — bơ Pháp, nướng mỗi sáng" },
    { img:"🫖", usp:"Trà Ô Long — hái tay Bảo Lộc" },
    { img:"🍰", usp:"Tiramisu — công thức Ý chuẩn vị" },
    { img:"🧇", usp:"Waffle — giòn ngoài, mềm trong" },
    { img:"🍪", usp:"Cookie — socola chip nhập khẩu" },
    { img:"🥧", usp:"Apple Pie — táo nướng quế" },
    { img:"🍵", usp:"Matcha — bột trà xanh Uji" },
    { img:"🧁", usp:"Cupcake — kem tươi không béo ngậy" },
    { img:"🍩", usp:"Donut — phủ đường tự nhiên" },
    { img:"🥤", usp:"Soda Ý — vị trái cây thật" },
    { img:"🍯", usp:"Honey Latte — mật ong rừng" },
    { img:"🌰", usp:"Hazelnut — hạt dẻ rang thơm" },
    { img:"🫐", usp:"Blueberry — việt quất tươi" }
  ]
};

const LEVELS = {
  easy:   { cols:4, rows:4, base:1000 },   // 8 cặp
  medium: { cols:4, rows:6, base:2000 },   // 12 cặp
  hard:   { cols:6, rows:6, base:4000 },   // 18 cặp
};
const MOVE_PENALTY = 15, TIME_PENALTY = 4, COMBO_BONUS = 120;

// -------- State --------
let cfg = THEME;
let diff = "easy";
let deck = [];            // {pairId, img, usp, gold}
let first = null;         // index of first flipped card
let busy = false;         // locked during mismatch flip-back
let moves = 0, combo = 0, maxCombo = 0, matched = 0;
let t0 = 0, tick = null;
let lastResult = null;    // {score, time, moves}

const $ = id => document.getElementById(id);
const screens = ["start","game","win","lb"];
function show(name){ screens.forEach(s=>$("s-"+s).classList.toggle("on", s===name)); }

// -------- Theme apply --------
async function loadTheme(){
  try{
    const r = await fetch("./theme.json", {cache:"no-store"});
    if(r.ok) cfg = Object.assign({}, THEME, await r.json());
  }catch(_){ /* dùng mặc định */ }
  const c = cfg.colors||{};
  for(const [k,v] of Object.entries(c)) document.documentElement.style.setProperty("--"+k, v);
  $("brandLogo").textContent = cfg.logo || "🎴";
  $("brandName").textContent = cfg.name || "Lật thẻ";
  $("brandTagline").textContent = cfg.tagline || "";
  $("brandFoot").textContent = cfg.brand || "YourBrand";
  $("rCode").textContent = (cfg.reward && cfg.reward.code) || "REWARD";
  $("rLabel").textContent = (cfg.reward && cfg.reward.label) || "";
}

// -------- Build & start a round --------
function startGame(){
  const L = LEVELS[diff];
  const need = (L.cols*L.rows)/2;
  const pool = cfg.pairs.slice(0, need);
  if(pool.length < need){ // không đủ thẻ → lặp lại cho đủ
    while(pool.length < need) pool.push(cfg.pairs[pool.length % cfg.pairs.length]);
  }
  deck = [];
  pool.forEach((p,i)=>{ for(let k=0;k<2;k++) deck.push({pairId:i, img:p.img, usp:p.usp, gold:false}); });
  // chọn 1 cặp vàng
  if(cfg.goldenPair){
    const gp = Math.floor(rnd()*need);
    deck.forEach(d=>{ if(d.pairId===gp) d.gold=true; });
  }
  shuffle(deck);

  first=null; busy=false; moves=0; combo=0; maxCombo=0; matched=0;
  renderGrid(L);
  setToast("Lật 2 thẻ để tìm cặp giống nhau.");
  $("hMoves").textContent = "0";
  $("hCombo").textContent = "Combo ×0";
  t0 = now(); $("hTime").textContent="00:00";
  clearInterval(tick); tick = setInterval(()=>{ $("hTime").textContent = fmt(elapsed()); }, 250);
  show("game");
}

function renderGrid(L){
  const g = $("grid");
  g.style.gridTemplateColumns = `repeat(${L.cols},1fr)`;
  g.innerHTML = "";
  deck.forEach((d,i)=>{
    const card = document.createElement("div");
    card.className = "card" + (d.gold ? " gold":"");
    card.dataset.i = i;
    const back = document.createElement("div");
    back.className = "face back";
    back.textContent = cfg.logo || "★";
    const front = document.createElement("div");
    front.className = "face front";
    front.textContent = d.img;
    card.appendChild(back); card.appendChild(front);
    card.addEventListener("click", ()=>flip(i));
    g.appendChild(card);
  });
}

function cardEl(i){ return $("grid").children[i]; }

function flip(i){
  if(busy) return;
  const d = deck[i], el = cardEl(i);
  if(el.classList.contains("matched") || el.classList.contains("flip")) return;
  el.classList.add("flip");

  if(first===null){ first = i; return; }
  if(first===i) return;

  moves++; $("hMoves").textContent = String(moves);
  const a = deck[first], b = deck[i];

  if(a.pairId === b.pairId){
    // trùng
    combo++; maxCombo = Math.max(maxCombo, combo);
    $("hCombo").textContent = "Combo ×" + combo;
    cardEl(first).classList.add("matched");
    el.classList.add("matched");
    setToast(`💡 <b>${b.usp}</b>`);
    matched++;
    const wasGold = a.gold;
    first = null;
    if(wasGold) setToast("⭐ <b>Cặp vàng!</b> Mã giảm giá đã được mở khóa.");
    if(matched === deck.length/2) setTimeout(win, 450);
  }else{
    // sai → úp lại
    combo = 0; $("hCombo").textContent = "Combo ×0";
    busy = true;
    const f = first; first = null;
    setTimeout(()=>{
      cardEl(f).classList.remove("flip");
      el.classList.remove("flip");
      busy = false;
    }, 850);
  }
}

function win(){
  clearInterval(tick);
  const L = LEVELS[diff];
  const secs = Math.round(elapsed()/1000);
  const minMoves = deck.length/2;
  let score = L.base
    - MOVE_PENALTY * Math.max(0, moves - minMoves)
    - TIME_PENALTY * secs
    + COMBO_BONUS * maxCombo;
  score = Math.max(0, Math.round(score));
  lastResult = { score, time:secs, moves };

  $("wScore").textContent = score.toLocaleString("vi-VN");
  $("wTime").textContent = fmt(secs*1000);
  $("wMoves").textContent = String(moves);
  // reset form/reward về trạng thái khóa
  $("reward").classList.add("locked");
  $("leadForm").style.display = "flex";
  $("leadInput").value = ""; $("leadErr").textContent = "";
  show("win");
}

// -------- Lead capture (prototype: localStorage) --------
function submitLead(contact, score){
  // PRODUCTION: thay bằng POST tới Supabase (bảng leads + scores).
  const leads = JSON.parse(localStorage.getItem("mem.leads")||"[]");
  leads.push({ contact, score, at: nowISO() });
  localStorage.setItem("mem.leads", JSON.stringify(leads));
  saveScore(nameFrom(contact), score);
}
function nameFrom(contact){
  // ẩn bớt thông tin để hiển thị trên bảng xếp hạng
  const s = String(contact).trim();
  if(s.includes("@")) return s.split("@")[0].slice(0,3) + "***";
  return s.slice(0,3) + "***" + s.slice(-2);
}
function saveScore(name, score){
  const wk = weekKey();
  const all = JSON.parse(localStorage.getItem("mem.scores")||"{}");
  const arr = all[wk] || [];
  arr.push({ name, score, me:true });
  arr.forEach(x=>{ if(x!==arr[arr.length-1]) x.me=false; });
  all[wk] = arr;
  localStorage.setItem("mem.scores", JSON.stringify(all));
}

// -------- Leaderboard --------
function seedIfEmpty(){
  // Seed demo competitors once per week (independent of the player's own scores),
  // so the board never looks empty in a demo. PRODUCTION: drop this — real scores
  // come from the backend.
  const wk = weekKey();
  const seeded = JSON.parse(localStorage.getItem("mem.seeded")||"{}");
  if(seeded[wk]) return;
  const all = JSON.parse(localStorage.getItem("mem.scores")||"{}");
  const names = ["Minh","Lan","Huy","Tú","Vy","Nam","An","Bảo","Chi","Đạt"];
  const bots = names.map((n,i)=>({ name:n+"***", score: 4800 - i*230 - (i*i*7), me:false }));
  all[wk] = (all[wk]||[]).concat(bots);
  localStorage.setItem("mem.scores", JSON.stringify(all));
  seeded[wk] = true;
  localStorage.setItem("mem.seeded", JSON.stringify(seeded));
}
function renderLb(){
  seedIfEmpty();
  const wk = weekKey();
  const all = JSON.parse(localStorage.getItem("mem.scores")||"{}");
  const arr = (all[wk]||[]).slice().sort((a,b)=>b.score-a.score);
  const list = $("lbList"); list.innerHTML = "";
  if(!arr.length){ list.innerHTML = '<div class="empty">Chưa có ai chơi tuần này. Bạn là người đầu tiên!</div>'; return; }
  const medal = ["🥇","🥈","🥉"];
  arr.slice(0,12).forEach((x,i)=>{
    const r = document.createElement("div");
    r.className = "r" + (x.me?" me":"");
    r.innerHTML = `<span class="rk">${medal[i]||("#"+(i+1))}</span>
      <span class="nm">${x.me?"BẠN":esc(x.name)}</span>
      <span class="sc">${x.score.toLocaleString("vi-VN")}</span>`;
    list.appendChild(r);
  });
  $("lbReset").textContent = `Reset mỗi thứ Hai • Top 3 nhận quà thật • ${arr.length} người chơi`;
}

// -------- Share --------
async function share(){
  const sc = (lastResult && lastResult.score) || 0;
  const text = `Mình vừa được ${sc.toLocaleString("vi-VN")} điểm ở game Lật thẻ ${cfg.brand}! Thử vượt qua mình nhé 👇`;
  const url = location.href;
  try{
    if(navigator.share){ await navigator.share({title:cfg.name, text, url}); return; }
  }catch(_){}
  try{ await navigator.clipboard.writeText(text+" "+url); setToastOn("Đã copy link thách đấu!"); }
  catch(_){ alert(text+"\n"+url); }
}

// -------- Helpers --------
function now(){ return performance.now(); }
function nowISO(){ const d=new Date(); return d.toISOString(); }
function elapsed(){ return now()-t0; }
function fmt(ms){ const s=Math.floor(ms/1000); return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0"); }
function rnd(){ return Math.random(); }
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(rnd()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } }
function esc(s){ return String(s).replace(/[<>&]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;"}[c])); }
function weekKey(){ const d=new Date(); const onejan=new Date(d.getFullYear(),0,1);
  const wk=Math.ceil((((d-onejan)/86400000)+onejan.getDay()+1)/7); return d.getFullYear()+"-W"+wk; }
let toastTimer=null;
function setToast(html){ const t=$("toast"); t.innerHTML=html; t.classList.add("on"); }
function setToastOn(msg){ setToast(msg); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$("toast").classList.remove("on"),2200); }

// -------- Tutorial --------
const TUT_STEPS = [
  { emoji:"🃏", title:"Lật & ghép cặp", text:"Chạm để lật thẻ. Tìm <b>2 thẻ giống nhau</b> để ghép thành một cặp. Lật sai sẽ tự úp lại." },
  { emoji:"⚡", title:"Ghi điểm cao", text:"Càng <b>ít lượt</b> và càng <b>nhanh</b>, điểm càng cao. Ghép đúng liên tiếp để cộng <b>Combo</b>!" },
  { emoji:"🎁", title:"Mở quà & lên top", text:"Tìm hết các cặp (và <b>cặp vàng ⭐</b>) để mở <b>mã giảm giá</b>, rồi leo <b>bảng xếp hạng tuần</b>." },
];
let tutStep = 0, tutThenStart = false;
function buildDots(){
  $("tutDots").innerHTML = TUT_STEPS.map((_,i)=>`<i class="${i===tutStep?'on':''}"></i>`).join("");
}
function renderTut(){
  const s = TUT_STEPS[tutStep];
  $("tutEmoji").textContent = s.emoji;
  $("tutTitle").textContent = s.title;
  $("tutText").innerHTML = s.text;
  $("tutNext").textContent = tutStep === TUT_STEPS.length-1
    ? (tutThenStart ? "▶ Bắt đầu chơi" : "Đã hiểu!") : "Tiếp →";
  buildDots();
}
function openTutorial(thenStart){
  tutThenStart = thenStart; tutStep = 0; renderTut();
  $("tut").classList.add("on"); $("tut").setAttribute("aria-hidden","false");
}
function closeTutorial(){
  $("tut").classList.remove("on"); $("tut").setAttribute("aria-hidden","true");
  localStorage.setItem("mem.tutSeen","1");
  if(tutThenStart){ tutThenStart = false; startGame(); }
}
$("tutNext").onclick = ()=>{ if(tutStep < TUT_STEPS.length-1){ tutStep++; renderTut(); } else closeTutorial(); };
$("tutSkip").onclick = closeTutorial;
function playOrTutor(){
  if(localStorage.getItem("mem.tutSeen")) startGame();
  else openTutorial(true);   // lần đầu: hiện tutorial rồi vào game
}

// -------- Wire up UI --------
$("diffs").addEventListener("click", e=>{
  const el = e.target.closest(".diff"); if(!el) return;
  diff = el.dataset.k;
  [...$("diffs").children].forEach(c=>c.classList.toggle("sel", c===el));
});
$("btnPlay").onclick = playOrTutor;
$("btnHowTo").onclick = ()=> openTutorial(false);   // mở lại tutorial, không tự vào game
$("btnPlayFromLb").onclick = startGame;
$("btnReplay").onclick = startGame;
$("btnQuit").onclick = ()=>{ clearInterval(tick); show("start"); };
$("btnBack").onclick = ()=> show("start");
$("btnLbFromStart").onclick = ()=>{ renderLb(); show("lb"); };
$("btnLbFromWin").onclick = ()=>{ renderLb(); show("lb"); };
$("btnShare").onclick = share;
$("leadForm").addEventListener("submit", e=>{
  e.preventDefault();
  const v = $("leadInput").value.trim();
  const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const okPhone = /^[0-9+\-\s]{8,}$/.test(v);
  if(!okEmail && !okPhone){ $("leadErr").textContent = "Nhập email hoặc số điện thoại hợp lệ."; return; }
  $("leadErr").textContent = "";
  submitLead(v, (lastResult && lastResult.score) || 0);
  $("reward").classList.remove("locked");      // mở khóa mã
  $("leadForm").style.display = "none";
  setToastOn("Đã lưu! Mã giảm giá của bạn đã mở khóa.");
});

// -------- Boot --------
loadTheme().then(()=> show("start"));

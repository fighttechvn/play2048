const KEY = "sudoku.save";
const DIFFS = ["easy","medium","hard","expert"];
const LABEL = {easy:"Easy",medium:"Medium",hard:"Hard",expert:"Expert"};
// Minimal embedded fallback (one per tier) so the game still runs if levels.json
// can't be fetched (e.g. opened from file://). Real pool comes from levels.json.
const FALLBACK = { levels: { easy:[{
  g:"530070000600195000098000060800060003400803001700020006060000280000419005000080079",
  s:"534678912672195348198342567859761423426853791713924856961537284287419635345286179"}] }};

let DB = null;                                  // loaded levels.json
let diff = "easy", idx = 0;                     // current selection
let sol = "";                                   // 81-char solution
let cells = [];                                 // [{v,given,notes:Set}]
let sel = -1, notesMode = false;
let history = [];                               // undo stack
let mistakes = 0, elapsed = 0, tickStart = 0, timer = null, solved = false;

const $ = (id) => document.getElementById(id);
const boardEl = $("board"), padEl = $("pad");
const peers = buildPeers();

fetch("./levels.json").then(r => r.ok ? r.json() : Promise.reject())
  .then(d => start(d)).catch(() => start(FALLBACK));

function start(db){
  DB = db;
  buildPad(); buildDiffs(); bind();
  const saved = load();
  if (saved && DB.levels[saved.diff]) restore(saved);
  else deal(diff, 0);
}

// ---- puzzle setup ----------------------------------------------------------
function pool(d){ return (DB.levels[d] && DB.levels[d].length) ? DB.levels[d] : FALLBACK.levels.easy; }

function deal(d, i){
  diff = d; const p = pool(d); idx = ((i % p.length) + p.length) % p.length;
  const pz = p[idx]; sol = pz.s;
  cells = [...pz.g].map(ch => ({ v:+ch, given: ch!=="0", notes:new Set() }));
  sel = -1; history = []; mistakes = 0; elapsed = 0; solved = false;
  startTimer(); render(); save();
}

function restore(s){
  diff = s.diff; idx = s.idx; sol = s.sol;
  cells = s.cells.map(c => ({ v:c.v, given:c.given, notes:new Set(c.notes||[]) }));
  sel = -1; history = []; mistakes = s.mistakes||0; elapsed = s.elapsed||0; solved = false;
  startTimer(); render();
}

// ---- rendering -------------------------------------------------------------
function buildPeers(){
  const P = Array.from({length:81}, () => new Set());
  for (let i=0;i<81;i++){
    const r=(i/9|0), c=i%9, br=(r/3|0)*3, bc=(c/3|0)*3;
    for (let k=0;k<9;k++){ P[i].add(r*9+k); P[i].add(k*9+c); }
    for (let dr=0;dr<3;dr++) for (let dc=0;dc<3;dc++) P[i].add((br+dr)*9+bc+dc);
    P[i].delete(i);
  }
  return P;
}

function conflict(i){
  const v = cells[i].v; if (!v) return false;
  for (const j of peers[i]) if (cells[j].v === v) return true;
  return false;
}

function render(){
  // group rows so we can thicken the 3×3 horizontal separators
  if (!boardEl.children.length){
    for (let i=0;i<81;i++){
      const d = document.createElement("div");
      d.className = "cell"; d.dataset.i = i;
      boardEl.appendChild(d);
    }
  }
  const selV = sel>=0 ? cells[sel].v : 0;
  for (let i=0;i<81;i++){
    const cell = cells[i], el = boardEl.children[i];
    let cls = "cell";
    if ((((i/9|0)%3)===2)) cls += " row3";
    if (cell.given) cls += " given";
    if (i===sel) cls += " sel";
    else if (sel>=0 && peers[sel].has(i)) cls += " peer";
    if (selV && cell.v===selV && i!==sel) cls += " same";
    if (cell.v && conflict(i)) cls += " bad";
    el.className = cls;
    if (cell.v){
      el.textContent = cell.v;
    } else if (cell.notes.size){
      el.textContent = "";
      const n = document.createElement("div"); n.className="notes";
      for (let d=1;d<=9;d++){ const s=document.createElement("span"); s.textContent = cell.notes.has(d)?d:""; n.appendChild(s); }
      el.appendChild(n);
    } else el.textContent = "";
  }
  // pad remaining counts
  for (let d=1;d<=9;d++){
    let placed=0; for (let i=0;i<81;i++) if (cells[i].v===d) placed++;
    const b = padEl.querySelector('[data-d="'+d+'"]');
    b.querySelector(".rem").textContent = placed>=9 ? "" : (9-placed);
    b.classList.toggle("done", placed>=9);
  }
  $("lvl").textContent = "Sudoku · " + LABEL[diff];
  $("miss").textContent = "✗ " + mistakes;
  $("miss").classList.toggle("warn", mistakes>0);
  $("undo").disabled = history.length===0;
  $("notes").classList.toggle("on", notesMode);
  DIFFS.forEach(d => $("d_"+d).classList.toggle("on", d===diff));
}

// ---- input -----------------------------------------------------------------
function input(d){
  if (sel<0 || solved) return;
  const cell = cells[sel]; if (cell.given) return;
  if (notesMode && d>0){
    push(); if (cell.notes.has(d)) cell.notes.delete(d); else cell.notes.add(d);
    cell.v = 0; render(); save(); return;
  }
  push();
  if (d===0){ cell.v = 0; cell.notes.clear(); }
  else {
    cell.v = d; cell.notes.clear();
    // clear this digit from peers' notes (quality-of-life)
    for (const j of peers[sel]) cells[j].notes.delete(d);
    if (sol && d !== +sol[sel]) mistakes++;
  }
  flash(sel); render(); save(); checkWin();
}

function push(){
  history.push(cells.map(c => ({v:c.v, given:c.given, notes:[...c.notes]})));
  if (history.length>200) history.shift();
}
function undo(){
  if (!history.length) return;
  const prev = history.pop();
  cells = prev.map(c => ({v:c.v, given:c.given, notes:new Set(c.notes)}));
  render(); save();
}
function hint(){
  if (solved) return;
  let t = (sel>=0 && !cells[sel].given && cells[sel].v!==+sol[sel]) ? sel : -1;
  if (t<0){ const empt=[]; for(let i=0;i<81;i++) if(!cells[i].given && cells[i].v!==+sol[i]) empt.push(i);
    if (!empt.length) return; t = empt[(Math.random()*empt.length)|0]; }
  push(); sel = t; cells[t].v = +sol[t]; cells[t].notes.clear();
  for (const j of peers[t]) cells[j].notes.delete(cells[t].v);
  flash(t); render(); save(); checkWin();
}
function flash(i){ const el=boardEl.children[i]; el.classList.remove("hl"); void el.offsetWidth; el.classList.add("hl"); }

function checkWin(){
  for (let i=0;i<81;i++) if (cells[i].v!==+sol[i]) return;
  solved = true; stopTimer();
  $("wdiff").textContent = LABEL[diff];
  $("wtime").textContent = fmt(elapsed);
  $("wmiss").textContent = mistakes;
  $("wino").classList.add("show"); save();
}

// ---- timer -----------------------------------------------------------------
function startTimer(){ stopTimer(); tickStart = Date.now() - elapsed*1000;
  timer = setInterval(() => { elapsed = ((Date.now()-tickStart)/1000)|0; $("time").textContent = fmt(elapsed); }, 1000);
  $("time").textContent = fmt(elapsed); }
function stopTimer(){ if (timer){ clearInterval(timer); timer=null; } }
function fmt(s){ const m=(s/60|0); return String(m).padStart(2,"0")+":"+String(s%60).padStart(2,"0"); }

// ---- persistence -----------------------------------------------------------
function save(){
  try{ localStorage.setItem(KEY, JSON.stringify({
    diff, idx, sol, mistakes, elapsed, solved,
    cells: cells.map(c => ({v:c.v, given:c.given, notes:[...c.notes]}))
  })); }catch(e){}
}
function load(){ try{ return JSON.parse(localStorage.getItem(KEY)); }catch(e){ return null; } }

// ---- UI wiring -------------------------------------------------------------
function buildPad(){
  for (let d=1;d<=9;d++){
    const b=document.createElement("button"); b.dataset.d=d;
    b.innerHTML = d+'<span class="rem"></span>'; b.onclick=()=>input(d); padEl.appendChild(b);
  }
  // erase button reuses pad styling but spans implicitly via the controls row
}
function buildDiffs(){
  const wrap=$("diffs");
  DIFFS.forEach(d => { const b=document.createElement("button"); b.id="d_"+d; b.textContent=LABEL[d];
    b.onclick=()=>{ if(d!==diff || confirmNew()) deal(d,0); }; wrap.appendChild(b); });
}
function confirmNew(){ return true; }

function bind(){
  boardEl.addEventListener("pointerdown", e => {
    const t = e.target.closest(".cell"); if (!t) return;
    sel = +t.dataset.i; render();
  });
  $("notes").onclick = () => { notesMode=!notesMode; render(); };
  $("erase").onclick = () => input(0);
  $("hint").onclick = hint;
  $("undo").onclick = undo;
  $("newg").onclick = () => deal(diff, idx+1);
  $("wnext").onclick = () => { $("wino").classList.remove("show"); deal(diff, idx+1); };
  window.addEventListener("keydown", e => {
    if (e.key>="1" && e.key<="9") input(+e.key);
    else if (e.key==="Backspace"||e.key==="Delete"||e.key==="0") input(0);
    else if (e.key==="n"||e.key==="N"){ notesMode=!notesMode; render(); }
    else if (sel>=0 && ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)){
      const r=(sel/9|0), c=sel%9;
      if (e.key==="ArrowUp") sel=((r+8)%9)*9+c;
      if (e.key==="ArrowDown") sel=((r+1)%9)*9+c;
      if (e.key==="ArrowLeft") sel=r*9+(c+8)%9;
      if (e.key==="ArrowRight") sel=r*9+(c+1)%9;
      render(); e.preventDefault();
    }
  });
}

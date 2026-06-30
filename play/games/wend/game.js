const KEY="wend.level";
const COLORS=["#e8654a","#2f9e6f","#3f6fd1","#b070c8"]; // by word index (len 3,4,5,6)
let DATA=null, lvl=0, L=null, lset=null, blockedSet=null;
let found=new Map(), order=[], sel=[], drawing=false, cell=0, ox=0, oy=0;
const cv=document.getElementById('cv'), ctx=cv.getContext('2d');
const $=id=>document.getElementById(id);
const ck=(r,c)=>r+','+c;

fetch('./levels.json').then(r=>r.json()).then(d=>{DATA=d; lvl=Math.min(+(localStorage.getItem(KEY)||0), d.levels.length-1); load(lvl);});

function load(i){
  L=DATA.levels[i]; found=new Map(); order=[]; sel=[];
  lset=new Map(); for(const t of L.letters) lset.set(ck(t.r,t.c), t.ch);
  blockedSet=new Set(L.blocked.map(b=>ck(b.r,b.c)));
  layout(); draw(); buildSlots(); $('lvl').textContent='Wend · Level '+(i+1); upd();
}
function layout(){
  const wrap=document.getElementById('wrap');
  const W=Math.min(wrap.clientWidth-60, 312);
  cell=Math.floor(W/L.cols);
  const pw=cell*L.cols, ph=cell*L.rows; ox=0; oy=0;
  cv.width=pw*devicePixelRatio; cv.height=ph*devicePixelRatio; cv.style.width=pw+'px'; cv.style.height=ph+'px';
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
function getCss(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim();}
function cellColor(r,c){ for(const k of found.keys()){ if(found.get(k).some(p=>p[0]===r&&p[1]===c)) return COLORS[k]; } return null; }

function draw(){
  ctx.clearRect(0,0,cv.width,cv.height);
  const R=cell*0.16;
  for(let r=0;r<L.rows;r++)for(let c=0;c<L.cols;c++){
    const x=ox+c*cell+3,y=oy+r*cell+3,w=cell-6;
    if(blockedSet.has(ck(r,c))){ roundRect(x,y,w,w,R);ctx.fillStyle=getCss('--blocked');ctx.fill();continue; }
    const col=cellColor(r,c);
    roundRect(x,y,w,w,R);
    ctx.fillStyle=col?col:'#fff'; ctx.fill();
    ctx.lineWidth=2; ctx.strokeStyle=col?col:getCss('--tilebd'); ctx.stroke();
    ctx.fillStyle=col?'#fff':'#1a1a1a';
    ctx.font='bold '+Math.round(cell*0.42)+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(lset.get(ck(r,c)), x+w/2, y+w/2+1);
  }
  // current selection band
  if(sel.length){
    ctx.strokeStyle=getCss('--sel'); ctx.lineWidth=cell*0.34; ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.beginPath();
    sel.forEach(([r,c],i)=>{const x=ox+c*cell+cell/2,y=oy+r*cell+cell/2;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});
    ctx.stroke();
    ctx.fillStyle=getCss('--sel');
    for(const [r,c] of sel){const x=ox+c*cell+cell/2,y=oy+r*cell+cell/2;ctx.beginPath();ctx.arc(x,y,cell*0.14,0,7);ctx.fill();}
  }
}
function roundRect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}

function cellAt(ev){
  const rect=cv.getBoundingClientRect();
  const c=Math.floor((ev.clientX-rect.left-ox)/cell), r=Math.floor((ev.clientY-rect.top-oy)/cell);
  if(r<0||c<0||r>=L.rows||c>=L.cols)return null; return [r,c];
}
const isLetter=(r,c)=>lset.has(ck(r,c));
const inFound=(r,c)=>cellColor(r,c)!==null;
const inSel=(r,c)=>sel.findIndex(p=>p[0]===r&&p[1]===c);

function tryExtend(r,c){
  if(!isLetter(r,c)||inFound(r,c))return;
  if(!sel.length){sel.push([r,c]);return;}
  const idx=inSel(r,c);
  if(idx!==-1){ if(idx===sel.length-2)sel.pop(); return; } // backtrack
  const last=sel[sel.length-1];
  if(Math.abs(r-last[0])+Math.abs(c-last[1])!==1)return;
  sel.push([r,c]);
}
function down(ev){ev.preventDefault();try{cv.setPointerCapture(ev.pointerId);}catch(e){}
  const cl=cellAt(ev);if(!cl)return;if(isLetter(cl[0],cl[1])&&!inFound(cl[0],cl[1])){sel=[[cl[0],cl[1]]];drawing=true;draw();}}
function move(ev){if(!drawing)return;ev.preventDefault();const cl=cellAt(ev);if(!cl)return;tryExtend(cl[0],cl[1]);draw();}
function up(ev){if(!drawing)return;drawing=false;try{cv.releasePointerCapture(ev.pointerId);}catch(e){}evaluate();}
cv.addEventListener('pointerdown',down);cv.addEventListener('pointermove',move);
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);window.addEventListener('pointerup',up);

const samePath=(a,b)=>a.length===b.length&&a.every((p,i)=>p[0]===b[i][0]&&p[1]===b[i][1]);
function evaluate(){
  if(sel.length>=3){
    for(let k=0;k<4;k++){ if(found.has(k))continue;
      const p=L.paths[k], rev=[...p].reverse();
      if(samePath(sel,p)||samePath(sel,rev)){ found.set(k,p.map(x=>x.slice())); order.push(k); break; }
    }
  }
  sel=[]; draw(); buildSlots(); upd(); checkWin();
}

function buildSlots(){
  const host=$('slots'); host.innerHTML='';
  for(let k=0;k<4;k++){
    const row=document.createElement('div'); row.className='slotrow';
    const len=k+3, w=L.words[k];
    for(let j=0;j<len;j++){
      const b=document.createElement('div'); b.className='slot';
      if(found.has(k)){ b.style.background=COLORS[k]; b.textContent=w[j]; }
      row.appendChild(b);
    }
    host.appendChild(row);
  }
}
function upd(){ $('undo').disabled=order.length===0; $('status').textContent=`Found ${found.size}/4`; }
function checkWin(){
  if(found.size!==4)return;
  $('winmsg').textContent='Level '+(lvl+1)+' of '+DATA.count+' complete.';
  $('wino').style.display='grid';
}
$('undo').onclick=()=>{const k=order.pop();if(k===undefined)return;found.delete(k);draw();buildSlots();upd();};
$('reset').onclick=()=>{found=new Map();order=[];sel=[];draw();buildSlots();upd();};
$('hint').onclick=()=>{
  for(let k=0;k<4;k++)if(!found.has(k)){found.set(k,L.paths[k].map(x=>x.slice()));order.push(k);break;}
  draw();buildSlots();upd();checkWin();
};
$('next').onclick=()=>{$('wino').style.display='none';lvl=Math.min(lvl+1,DATA.levels.length-1);localStorage.setItem(KEY,lvl);load(lvl);};
addEventListener('resize',()=>{if(L){layout();draw();}});

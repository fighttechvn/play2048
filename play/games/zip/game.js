const KEY="zip.level";
let DATA=null, lvl=0, L=null, path=[], drawing=false, cell=0, ox=0, oy=0;
const cv=document.getElementById('cv'), ctx=cv.getContext('2d');
const $=id=>document.getElementById(id);

fetch('./levels.json').then(r=>r.json()).then(d=>{DATA=d; lvl=Math.min(+(localStorage.getItem(KEY)||0), d.levels.length-1); load(lvl);});

function load(i){ L=DATA.levels[i]; path=[]; layout(); draw(); $('lvl').textContent='Zip · Level '+(i+1); upd(); }
function key(r,c){return r*L.cols+c;}
function numAt(r,c){const n=L.numbers.find(n=>n.r===r&&n.c===c);return n?n.n:0;}
function wallBetween(a,b){const[r1,c1]=a,[r2,c2]=b;return L.walls.some(w=>(w.r===r1&&w.c===c1&&w.r2===r2&&w.c2===c2)||(w.r===r2&&w.c===c2&&w.r2===r1&&w.c2===c1));}

function layout(){
  const wrap=document.getElementById('wrap');
  const W=Math.min(wrap.clientWidth-60, 520);
  cell=Math.floor((W)/L.cols); ox=Math.floor((W-cell*L.cols)/2)+0; oy=ox;
  const px=cell*L.cols+2*ox;
  cv.width=px*devicePixelRatio; cv.height=px*devicePixelRatio; cv.style.width=px+'px'; cv.style.height=px+'px';
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
function cc(r,c){return [ox+c*cell+cell/2, oy+r*cell+cell/2];}

function draw(){
  ctx.clearRect(0,0,cv.width,cv.height);
  // grid
  ctx.strokeStyle=getCss('--grid'); ctx.lineWidth=1;
  for(let r=0;r<=L.rows;r++){ctx.beginPath();ctx.moveTo(ox,oy+r*cell);ctx.lineTo(ox+cell*L.cols,oy+r*cell);ctx.stroke();}
  for(let c=0;c<=L.cols;c++){ctx.beginPath();ctx.moveTo(ox+c*cell,oy);ctx.lineTo(ox+c*cell,oy+cell*L.rows);ctx.stroke();}
  // path fill — fill each cell (so even a 1-cell start shows) + connecting band
  if(path.length){
    ctx.fillStyle=getCss('--pathbg');
    for(const [r,c] of path){const[x,y]=cc(r,c);ctx.beginPath();ctx.arc(x,y,cell*0.41,0,7);ctx.fill();}
    ctx.strokeStyle=getCss('--pathbg'); ctx.lineWidth=cell*0.82; ctx.lineCap='round'; ctx.lineJoin='round';
    line(path);
    ctx.strokeStyle=getCss('--path'); ctx.lineWidth=cell*0.34; line(path);
    // a dot at the current head for clear feedback
    const[hx,hy]=cc(path[path.length-1][0],path[path.length-1][1]);
    ctx.fillStyle=getCss('--path');ctx.beginPath();ctx.arc(hx,hy,cell*0.17,0,7);ctx.fill();
  }
  // walls
  ctx.strokeStyle='#111'; ctx.lineWidth=Math.max(4,cell*0.10); ctx.lineCap='round';
  for(const w of L.walls){
    const a=[w.r,w.c], b=[w.r2,w.c2];
    if(a[0]===b[0]){ // horizontal neighbors → vertical wall between
      const x=ox+Math.max(a[1],b[1])*cell; ctx.beginPath();ctx.moveTo(x,oy+a[0]*cell+cell*0.12);ctx.lineTo(x,oy+a[0]*cell+cell*0.88);ctx.stroke();
    } else {
      const y=oy+Math.max(a[0],b[0])*cell; ctx.beginPath();ctx.moveTo(ox+a[1]*cell+cell*0.12,y);ctx.lineTo(ox+a[1]*cell+cell*0.88,y);ctx.stroke();
    }
  }
  // numbers
  for(const n of L.numbers){
    const [x,y]=cc(n.r,n.c); const r=cell*0.30;
    ctx.fillStyle='#111';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='bold '+Math.round(cell*0.40)+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(n.n, x, y+1);
  }
}
function line(p){ctx.beginPath();const[x0,y0]=cc(p[0][0],p[0][1]);ctx.moveTo(x0,y0);for(let i=1;i<p.length;i++){const[x,y]=cc(p[i][0],p[i][1]);ctx.lineTo(x,y);}ctx.stroke();}
function getCss(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim();}

function cellAt(ev){
  const rect=cv.getBoundingClientRect();
  const px=(ev.clientX-rect.left), py=(ev.clientY-rect.top);
  const c=Math.floor((px-ox)/cell), r=Math.floor((py-oy)/cell);
  if(r<0||c<0||r>=L.rows||c>=L.cols) return null; return [r,c];
}
function inPath(r,c){return path.findIndex(p=>p[0]===r&&p[1]===c);}
function tryExtend(r,c){
  if(!path.length){ if(numAt(r,c)===1){path.push([r,c]); return true;} return false; }
  const idx=inPath(r,c);
  const last=path[path.length-1];
  if(idx!==-1 && idx===path.length-2){ path.pop(); return true; } // backtrack (idx>=0 guard:
  // inPath returns -1 for a new cell, and path.length-2 is also -1 when only the
  // start is placed — without this guard the very first swipe step popped the start)
  if(idx!==-1) return false;
  const dr=Math.abs(r-last[0]), dc=Math.abs(c-last[1]);
  if(dr+dc!==1) return false;
  if(wallBetween(last,[r,c])) return false;
  // can't pass a number out of order
  const nv=numAt(r,c);
  if(nv){ const have=path.filter(p=>numAt(p[0],p[1])).length; if(nv!==have+1) return false; }
  path.push([r,c]); return true;
}
function down(ev){ev.preventDefault();
  // Capture the pointer so pointermove keeps firing during a touch swipe even if
  // the finger drifts slightly off the canvas (the main reason swipe "did nothing").
  try{cv.setPointerCapture(ev.pointerId);}catch(e){}
  const cl=cellAt(ev);if(!cl)return;const i=inPath(cl[0],cl[1]);
  if(path.length&&i===path.length-1){drawing=true;} // continue from end
  else if(tryExtend(cl[0],cl[1])){drawing=true;draw();upd();}
}
function move(ev){if(!drawing)return;ev.preventDefault();const cl=cellAt(ev);if(!cl)return;if(tryExtend(cl[0],cl[1])){draw();upd();checkWin();}}
function up(ev){drawing=false;try{cv.releasePointerCapture(ev.pointerId);}catch(e){}}
cv.addEventListener('pointerdown',down);cv.addEventListener('pointermove',move);
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);window.addEventListener('pointerup',up);

function upd(){$('undo').disabled=path.length===0;
  const have=path.filter(p=>numAt(p[0],p[1])).length, tot=L.numbers.length;
  const total=L.rows*L.cols, left=total-path.length, st=$('status');
  // All dots are linked but the path doesn't cover every cell yet — that's NOT a
  // solved level, so surface it as an error instead of silently doing nothing.
  if(have===tot && left>0){
    st.textContent=`Link every cell — ${left} left`; st.classList.add('err');
  } else {
    st.textContent=path.length? `Filled ${path.length}/${total} · dot ${have}/${tot}` : 'Connect 1 → …';
    st.classList.remove('err');
  }}
function checkWin(){
  if(path.length!==L.rows*L.cols) return;
  const have=path.filter(p=>numAt(p[0],p[1])).length;
  if(have!==L.numbers.length) return;
  // numbers in order is guaranteed by tryExtend; we win
  $('winmsg').textContent='Level '+(lvl+1)+' of '+DATA.count+' complete.';
  $('wino').style.display='grid';
}
$('undo').onclick=()=>{path.pop();draw();upd();};
$('reset').onclick=()=>{path=[];draw();upd();};
$('hint').onclick=()=>{ // extend the path one correct step from the solution
  const sol=L.solution;
  let k=path.length; if(k===0){path.push(sol[0]);} else {
    // find current end in solution; if it matches prefix, append next
    let match=path.every((p,i)=>p[0]===sol[i][0]&&p[1]===sol[i][1]);
    if(!match){path=[];} else if(k<sol.length){path.push(sol[k]);}
  }
  draw();upd();checkWin();
};
$('next').onclick=()=>{$('wino').style.display='none';lvl=Math.min(lvl+1,DATA.levels.length-1);localStorage.setItem(KEY,lvl);load(lvl);};
addEventListener('resize',()=>{if(L){layout();draw();}});

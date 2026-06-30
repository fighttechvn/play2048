const KEY="tango.level";
let DATA=null, lvl=0, L=null, g=null, givenSet=null, history=[], cell=0, ox=0, oy=0;
const cv=document.getElementById('cv'), ctx=cv.getContext('2d');
const $=id=>document.getElementById(id);
const ckey=(r,c)=>r+','+c;
const ekey=(r,c,r2,c2)=>(r<r2||(r===r2&&c<c2))?`${r},${c},${r2},${c2}`:`${r2},${c2},${r},${c}`;

fetch('./levels.json').then(r=>r.json()).then(d=>{DATA=d; lvl=Math.min(+(localStorage.getItem(KEY)||0), d.levels.length-1); load(lvl);});

function load(i){
  L=DATA.levels[i]; history=[];
  g=Array.from({length:L.size},()=>Array(L.size).fill(-1));
  givenSet=new Set();
  for(const c of L.given){ g[c.r][c.c]=c.v; givenSet.add(ckey(c.r,c.c)); }
  L.eqSet=new Set(L.equals.map(e=>ekey(e.r,e.c,e.r2,e.c2)));
  L.neSet=new Set(L.crosses.map(e=>ekey(e.r,e.c,e.r2,e.c2)));
  layout(); draw(); $('lvl').textContent='Tango · Level '+(i+1); upd();
}
function layout(){
  const wrap=document.getElementById('wrap');
  const W=Math.min(wrap.clientWidth-60, 480);
  cell=Math.floor(W/L.size); ox=Math.floor((W-cell*L.size)/2); oy=ox;
  const px=cell*L.size+2*ox;
  cv.width=px*devicePixelRatio; cv.height=px*devicePixelRatio; cv.style.width=px+'px'; cv.style.height=px+'px';
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
function getCss(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim();}

function violations(){
  const bad=new Set(); const S=L.size;
  // triples
  for(let r=0;r<S;r++)for(let c=0;c<S;c++){const v=g[r][c]; if(v===-1)continue;
    if(c>=2&&g[r][c-1]===v&&g[r][c-2]===v){bad.add(ckey(r,c));bad.add(ckey(r,c-1));bad.add(ckey(r,c-2));}
    if(r>=2&&g[r-1][c]===v&&g[r-2][c]===v){bad.add(ckey(r,c));bad.add(ckey(r-1,c));bad.add(ckey(r-2,c));}
  }
  // counts (>3 of a symbol in a row/col)
  for(let r=0;r<S;r++){const cnt=[0,0];for(let c=0;c<S;c++)if(g[r][c]!==-1)cnt[g[r][c]]++;
    for(const v of [0,1])if(cnt[v]>S/2)for(let c=0;c<S;c++)if(g[r][c]===v)bad.add(ckey(r,c));}
  for(let c=0;c<S;c++){const cnt=[0,0];for(let r=0;r<S;r++)if(g[r][c]!==-1)cnt[g[r][c]]++;
    for(const v of [0,1])if(cnt[v]>S/2)for(let r=0;r<S;r++)if(g[r][c]===v)bad.add(ckey(r,c));}
  // sign clues
  for(const e of L.equals){const a=g[e.r][e.c],b=g[e.r2][e.c2];if(a!==-1&&b!==-1&&a!==b){bad.add(ckey(e.r,e.c));bad.add(ckey(e.r2,e.c2));}}
  for(const e of L.crosses){const a=g[e.r][e.c],b=g[e.r2][e.c2];if(a!==-1&&b!==-1&&a===b){bad.add(ckey(e.r,e.c));bad.add(ckey(e.r2,e.c2));}}
  return bad;
}

function drawSun(x,y,rad){
  ctx.fillStyle=getCss('--sun'); ctx.beginPath(); ctx.arc(x,y,rad,0,7); ctx.fill();
  ctx.strokeStyle=getCss('--sund'); ctx.lineWidth=Math.max(2,rad*0.10); ctx.beginPath(); ctx.arc(x,y,rad,0,7); ctx.stroke();
}
function drawMoon(x,y,rad){
  ctx.fillStyle=getCss('--moon');
  ctx.beginPath();
  ctx.arc(x,y,rad,0,Math.PI*2,false);                    // outer
  ctx.arc(x+rad*0.55,y-rad*0.18,rad*0.92,0,Math.PI*2,true); // carve (reverse winding)
  ctx.fill('evenodd');
}

function draw(){
  const S=L.size; ctx.clearRect(0,0,cv.width,cv.height);
  const bad=violations();
  // cells
  for(let r=0;r<S;r++)for(let c=0;c<S;c++){
    const x=ox+c*cell,y=oy+r*cell;
    ctx.fillStyle=givenSet.has(ckey(r,c))?getCss('--given'):'#fff';
    ctx.fillRect(x,y,cell,cell);
    if(bad.has(ckey(r,c))){ctx.fillStyle='rgba(226,72,58,.16)';ctx.fillRect(x,y,cell,cell);}
    const v=g[r][c]; const cx=x+cell/2, cy=y+cell/2, rad=cell*0.30;
    if(v===0)drawSun(cx,cy,rad); else if(v===1)drawMoon(cx,cy,rad);
  }
  // grid lines
  ctx.strokeStyle=getCss('--grid'); ctx.lineWidth=1;
  for(let r=0;r<=S;r++){ctx.beginPath();ctx.moveTo(ox,oy+r*cell);ctx.lineTo(ox+cell*S,oy+r*cell);ctx.stroke();}
  for(let c=0;c<=S;c++){ctx.beginPath();ctx.moveTo(ox+c*cell,oy);ctx.lineTo(ox+c*cell,oy+cell*S);ctx.stroke();}
  // outer border
  ctx.strokeStyle='#9a9486'; ctx.lineWidth=2; ctx.strokeRect(ox,oy,cell*S,cell*S);
  // sign clues on edges
  for(const e of L.equals) drawSign(e,'=');
  for(const e of L.crosses) drawSign(e,'x');
}
function drawSign(e,t){
  const x1=ox+e.c*cell+cell/2, y1=oy+e.r*cell+cell/2;
  const x2=ox+e.c2*cell+cell/2, y2=oy+e.r2*cell+cell/2;
  const mx=(x1+x2)/2, my=(y1+y2)/2, s=cell*0.13;
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(mx,my,s+5,0,7); ctx.fill();
  ctx.strokeStyle='#4a4439'; ctx.lineWidth=Math.max(2.4,cell*0.035); ctx.lineCap='round';
  if(t==='='){
    ctx.beginPath();ctx.moveTo(mx-s,my-s*0.5);ctx.lineTo(mx+s,my-s*0.5);ctx.stroke();
    ctx.beginPath();ctx.moveTo(mx-s,my+s*0.5);ctx.lineTo(mx+s,my+s*0.5);ctx.stroke();
  } else {
    ctx.beginPath();ctx.moveTo(mx-s,my-s);ctx.lineTo(mx+s,my+s);ctx.stroke();
    ctx.beginPath();ctx.moveTo(mx+s,my-s);ctx.lineTo(mx-s,my+s);ctx.stroke();
  }
}

function cellAt(ev){
  const rect=cv.getBoundingClientRect();
  const c=Math.floor((ev.clientX-rect.left-ox)/cell), r=Math.floor((ev.clientY-rect.top-oy)/cell);
  if(r<0||c<0||r>=L.size||c>=L.size)return null; return [r,c];
}
let downCell=null;
cv.addEventListener('pointerdown',ev=>{ev.preventDefault();downCell=cellAt(ev);});
cv.addEventListener('pointerup',ev=>{ev.preventDefault();const cl=cellAt(ev);
  if(cl&&downCell&&cl[0]===downCell[0]&&cl[1]===downCell[1])tap(cl[0],cl[1]);downCell=null;});

function tap(r,c){
  if(givenSet.has(ckey(r,c)))return;
  history.push({r,c,v:g[r][c]});
  g[r][c]=g[r][c]===-1?0:g[r][c]===0?1:-1;
  draw();upd();checkWin();
}
function upd(){
  $('undo').disabled=history.length===0;
  let filled=0;const S=L.size;for(let r=0;r<S;r++)for(let c=0;c<S;c++)if(g[r][c]!==-1)filled++;
  const bad=violations();
  $('status').textContent=bad.size?`${bad.size/1|0} conflict${bad.size>1?'s':''}`:`Filled ${filled}/${S*S}`;
}
function checkWin(){
  const S=L.size;for(let r=0;r<S;r++)for(let c=0;c<S;c++)if(g[r][c]===-1)return;
  if(violations().size)return;
  $('winmsg').textContent='Level '+(lvl+1)+' of '+DATA.count+' complete.';
  $('wino').style.display='grid';
}
$('undo').onclick=()=>{const m=history.pop();if(!m)return;g[m.r][m.c]=m.v;draw();upd();};
$('reset').onclick=()=>{for(let r=0;r<L.size;r++)for(let c=0;c<L.size;c++)if(!givenSet.has(ckey(r,c)))g[r][c]=-1;history=[];draw();upd();};
$('hint').onclick=()=>{
  const S=L.size;const opts=[];
  for(let r=0;r<S;r++)for(let c=0;c<S;c++)if(g[r][c]!==L.solution[r][c]&&!givenSet.has(ckey(r,c)))opts.push([r,c]);
  if(!opts.length)return;const [r,c]=opts[(Math.random()*opts.length)|0];
  history.push({r,c,v:g[r][c]});g[r][c]=L.solution[r][c];draw();upd();checkWin();
};
$('next').onclick=()=>{$('wino').style.display='none';lvl=Math.min(lvl+1,DATA.levels.length-1);localStorage.setItem(KEY,lvl);load(lvl);};
addEventListener('resize',()=>{if(L){layout();draw();}});

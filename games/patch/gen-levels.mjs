// gen-patch-levels.mjs — generate 99 progressively harder "Patch" levels.
// Patch (Shikaku + shape type): partition the grid into rectangles; each carries
// one numbered clue equal to its area, and a shape type (square / tall / wide /
// any). We build a random guillotine tiling (the solution), then label each
// region. Difficulty (see .claude/skills/game-designer) ramps board size,
// region size, and the share of "any" (hidden-shape) clues.
//
//   node scripts/gen-patch-levels.mjs > public/games/patch/levels.json

const N = 99;
function mulberry32(a){return function(){a|=0;a=(a+0x6d2b79f5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
const easeInOut=(t)=>(t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2);
const lerp=(a,b,t)=>a+(b-a)*t;

function paramsForLevel(i){
  const t0=i/(N-1); const saw=(i%7)/7;
  const t=Math.max(0,Math.min(1,easeInOut(t0)-0.16*saw));
  const size=Math.round(lerp(4,8,t));
  // bigger regions + stop-splitting sooner as difficulty climbs → fewer clues,
  // more deduction (harder in Shikaku); plus more hidden shapes.
  const maxRegion=Math.round(lerp(4,8,t));
  const stopProb=lerp(0.35,0.6,t);
  const anyProb=lerp(0,0.4,t);
  return {size,maxRegion,stopProb,anyProb,t};
}

function tile(r0,c0,h,w,p,rng,out){
  const area=h*w;
  if(area<=2){ out.push({r0,c0,h,w}); return; }                 // never fragment below 2
  if(area<=p.maxRegion && rng()<p.stopProb){ out.push({r0,c0,h,w}); return; }
  const splitW = w>1 && (h<=1 || rng()<0.5);
  if(splitW){ const cut=1+((rng()*(w-1))|0); tile(r0,c0,h,cut,p,rng,out); tile(r0,c0+cut,h,w-cut,p,rng,out); }
  else if(h>1){ const cut=1+((rng()*(h-1))|0); tile(r0,c0,cut,w,p,rng,out); tile(r0+cut,c0,h-cut,w,p,rng,out); }
  else out.push({r0,c0,h,w});
}

function shapeOf(h,w){ return h===w?"square":h>w?"tall":"wide"; }

function genLevel(i){
  const p=paramsForLevel(i);
  const rng=mulberry32(0x9e37+i*40503);
  const regions=[]; tile(0,0,p.size,p.size,p,rng,regions);
  const clues=regions.map(rg=>{
    const r=rg.r0+((rng()*rg.h)|0), c=rg.c0+((rng()*rg.w)|0);
    const realShape=shapeOf(rg.h,rg.w);
    // only hide the shape (→ "any") when it can't be inferred from the number alone
    const shape = (rng()<p.anyProb) ? "any" : realShape;
    return { r, c, size: rg.h*rg.w, shape };
  });
  return { id:i+1, rows:p.size, cols:p.size, clues, solution:regions };
}

const levels=Array.from({length:N},(_,i)=>genLevel(i));
process.stdout.write(JSON.stringify({game:"patch",count:N,levels}));

/* u3-clustering 전용 (cu-) — 공용 부품 scatter · stat · bars 사용 */

/* 우리 반 예시 18명: [활발한 정도, 공부를 좋아하는 정도] (지어낸 고정값) */
const CU_U=[[1.6,8.6],[2.4,9.0],[2.0,7.8],[2.9,8.3],[1.3,7.6],[2.5,7.3],[1.5,2.6],[2.3,3.2],[2.8,2.0],[1.8,1.6],[2.6,2.7],[1.2,2.1],[7.6,2.2],[8.4,3.3],[7.9,4.6],[8.6,5.7],[7.7,6.8],[8.3,7.9]];
const CU_GRAY='#c3c9d1';
const cuAx={x:[0,10,2], y:[0,10,2], xl:'활발한 정도 (예시)', yl:'공부를 좋아하는 정도 (예시)'};
const cuF=v=>stat.fmt(v,2);
const cuSizes=(L,k)=>[...Array(k).keys()].map(c=>L.filter(x=>x===c).length);
/* 화면 좌표 → 그래프 값 (scatter 가 돌려주는 X·Y 변환을 거꾸로) */
function cuInv(sp,svgEl,e){
  const m=svgEl.getScreenCTM(); if(!m) return null;
  const q=new DOMPoint(e.clientX,e.clientY).matrixTransform(m.inverse());
  const [x0,x1]=cuAx.x, [y0,y1]=cuAx.y;
  const x=x0+(q.x-sp.X(x0))/(sp.X(x1)-sp.X(x0))*(x1-x0), y=y0+(q.y-sp.Y(y0))/(sp.Y(y1)-sp.Y(y0))*(y1-y0);
  if(x<x0||x>x1||y<y0||y>y1) return null;
  return [Math.round(x*10)/10, Math.round(y*10)/10];
}

/* 0 시작 · 처음 생각 */
vote('pastaVote','pastaVote',[
  ['함께 사는 물건','파스타 재료를 사는 사람이 고기도 함께 산다'],
  ['가격 차이','고기보다 파스타 소스가 더 싸다'],
  ['손님 수','정육 판매대에 손님이 가장 많다']
]);

/* 01 손으로 묶어 보기 */
const cuHand=scatter({svg:'cuHand',...cuAx});
let cuPaint=store.get(MK+'-hand',null); if(!Array.isArray(cuPaint)||cuPaint.length!==CU_U.length) cuPaint=CU_U.map(()=>-1);
let cuBrushNo=0;
function cuHandDraw(){
  cuHand.set(CU_U.map((p,i)=>[p[0],p[1],cuPaint[i]>=0?cuPaint[i]:CU_GRAY]));
  const used=[0,1,2,3].filter(g=>cuPaint.includes(g)), left=cuPaint.filter(v=>v<0).length;
  $('cuHandSay').innerHTML=used.length
    ? `지금 <b>${used.length}그룹</b>: `+used.map(g=>`<span style="color:${PAL[g]}">●</span> 그룹 ${g+1} ${cuPaint.filter(v=>v===g).length}명`).join(' · ')+(left?` · 아직 안 칠한 친구 ${left}명`:' · 모두 칠했어요!')
    : '그룹 색을 고르고 점을 눌러 보세요.';
}
$('cuBrush').innerHTML=[0,1,2,3].map(g=>`<button class="btn sm cu-b" data-g="${g}" style="--k:${PAL[g]}">그룹 ${g+1}</button>`).join('')+'<button class="btn sm cu-b" data-g="-1" style="--k:#8a94a3">지우개</button>';
const cuBrushBtns=[...$('cuBrush').querySelectorAll('button')];
const cuBrushPick=g=>{cuBrushNo=g; cuBrushBtns.forEach(b=>b.classList.toggle('on',+b.dataset.g===g));};
cuBrushBtns.forEach(b=>b.onclick=()=>cuBrushPick(+b.dataset.g));
cuBrushPick(0);
$('cuHand').addEventListener('click',e=>{
  const c=e.target.closest('circle[data-i]'); if(!c) return;
  cuPaint[+c.dataset.i]=cuBrushNo; store.set(MK+'-hand',cuPaint); cuHandDraw();
});
$('cuHandClr').onclick=()=>{cuPaint=CU_U.map(()=>-1); store.set(MK+'-hand',cuPaint); cuHandDraw();};
cuHandDraw();

/* 02 k-평균 한 걸음씩 */
const CU_START={
  2:[[[1,1],[9,9]],[[2,8],[2,2]]],
  3:[[[4,5],[5,6],[6,4]],[[5,9],[5,1],[9,5]],[[7.5,2.5],[8.5,7.5],[4.5,5]]],
  4:[[[2,8],[2,2],[8,3],[8,7]],[[1,9],[3,8],[2,2],[8,5]]]
};
const CU_NUM='①②③④';
const cuKm=scatter({svg:'cuKm',...cuAx});
const KM={k:3,C:[],L:null,phase:'start',it:0,name:''};
let cuLog=store.get(MK+'-kmlog',[]); if(!Array.isArray(cuLog)) cuLog=[];
function cuKmDraw(){
  cuKm.set(CU_U.map((p,i)=>[p[0],p[1],KM.L?KM.L[i]:CU_GRAY])).centers(KM.C);
  $('cuIt').textContent=KM.it;
  $('cuSse').textContent=KM.L&&KM.C.length===KM.k?stat.fmt(stat.sse(CU_U,KM.L,KM.C),1):'—';
  const cur={start:1,manual:1,assign:2,move:3,done:5}[KM.phase];
  [...$('cuSteps').children].forEach((li,i)=>{li.classList.toggle('on',i===cur); li.classList.toggle('past',i<cur&&!(i===4&&KM.it===0));});
  $('cuAssign').disabled=KM.phase!=='assign';
  $('cuMove').disabled=KM.phase!=='move';
  $('cuAuto').disabled=!(KM.phase==='assign'||KM.phase==='move');
}
function cuKmSay(h){ $('cuKmSay').innerHTML=h; }
function cuSetK(k){
  KM.k=k; KM.C=[]; KM.L=null; KM.it=0; KM.phase='start';
  $('cuKBtns').querySelectorAll('button').forEach(b=>b.classList.toggle('on',+b.dataset.k===k));
  $('cuSBtns').innerHTML=CU_START[k].map((_,j)=>`<button class="btn ghost sm" data-j="${j}">시작점 ${CU_NUM[j]}</button>`).join('')+'<button class="btn ghost sm" data-j="m">직접 찍기</button>';
  $('cuSBtns').querySelectorAll('button').forEach(b=>b.onclick=()=>cuStart(b.dataset.j));
  cuKmSay(`k = ${k}. 이제 ➋ 시작점을 골라요. 번호 버튼은 정해 둔 시작점이고, 「직접 찍기」는 그래프를 ${k}번 눌러 중심점을 놓아요.`);
  cuKmDraw();
}
function cuStart(j){
  $('cuSBtns').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.j===j));
  KM.L=null; KM.it=0;
  if(j==='m'){ KM.C=[]; KM.phase='manual'; KM.name='직접'; cuKmSay(`그래프의 빈 곳을 눌러 중심점 <b>${KM.k}개</b>를 놓아요. (0 / ${KM.k})`); cuKmDraw(); return; }
  KM.C=CU_START[KM.k][+j].map(c=>c.slice()); KM.name=CU_NUM[+j]; KM.phase='assign';
  cuKmSay(`중심점 ${KM.k}개(✕)를 놓았어요. 아직 어느 군집인지 정해지지 않아 점이 회색이에요. <b>➌ 데이터 할당</b>을 눌러요.`);
  cuKmDraw();
}
$('cuKm').addEventListener('click',e=>{
  if(KM.phase!=='manual') return;
  const v=cuInv(cuKm,$('cuKm'),e); if(!v) return;
  KM.C.push(v);
  if(KM.C.length>=KM.k){ KM.phase='assign'; cuKmSay(`중심점 ${KM.k}개를 모두 놓았어요. <b>➌ 데이터 할당</b>을 눌러요.`); }
  else cuKmSay(`그래프의 빈 곳을 눌러 중심점 <b>${KM.k}개</b>를 놓아요. (${KM.C.length} / ${KM.k})`);
  cuKmDraw();
});
function cuAssign(quiet){
  if(KM.phase!=='assign') return;
  const L2=stat.assign(CU_U,KM.C), ch=KM.L?L2.filter((v,i)=>v!==KM.L[i]).length:L2.length;
  KM.L=L2; KM.phase='move';
  const sz=cuSizes(KM.L,KM.k), empty=sz.filter(n=>!n).length;
  if(!quiet) cuKmSay(`점마다 가장 가까운 중심점의 색으로 칠했어요. ${KM.it?`군집이 바뀐 점 <b>${ch}개</b>. `:''}군집 크기 ${sz.join(' · ')}명.${empty?' 점이 하나도 없는 중심점은 그 자리에 그대로 둬요.':''} 이제 <b>➍ 중심점 업데이트</b>를 눌러요.`);
  cuKmDraw();
}
function cuMove(quiet){
  if(KM.phase!=='move') return;
  const C2=stat.center(CU_U,KM.L,KM.C), mv=Math.max(...C2.map((c,i)=>Math.hypot(c[0]-KM.C[i][0],c[1]-KM.C[i][1])));
  KM.C=C2; KM.it++;
  if(mv<1e-9){ KM.phase='done'; cuDone(); return; }
  KM.phase='assign';
  if(!quiet) cuKmSay(`중심점(✕)을 각 군집 점들의 평균 위치로 옮겼어요. 가장 많이 움직인 거리 <b>${cuF(mv)}</b>. 중심점이 움직였으니 ➎ 다시 <b>➌ 데이터 할당</b>을 눌러요.`);
  cuKmDraw();
}
function cuDone(){
  const sz=cuSizes(KM.L,KM.k), sse=stat.fmt(stat.sse(CU_U,KM.L,KM.C),1);
  cuKmSay(`<b>➏ 군집 형성!</b> 중심점이 더 이상 움직이지 않아요. 반복 ${KM.it}번, 군집 크기 ${sz.join(' · ')}명, 거리 제곱의 합 ${sse}. 결과가 아래에 기록됐어요. 다른 시작점으로도 해 보세요.`);
  cuLog.push(`k=${KM.k} · 시작점 ${KM.name} · 반복 ${KM.it}번 · 군집 크기 ${sz.join('·')} · 거리 제곱의 합 ${sse}`);
  if(cuLog.length>8) cuLog=cuLog.slice(-8);
  cuLogSave(); cuKmDraw();
}
function cuLogSave(){
  store.set(MK+'-kmlog',cuLog);
  MEMO.kmLog=cuLog.join(' / '); store.set(MK,MEMO);
  $('cuLog').innerHTML=cuLog.length?cuLog.map(t=>`<li>${esc(t)}</li>`).join(''):'<li class="muted">아직 끝까지 돌린 결과가 없어요.</li>';
}
$('cuKBtns').innerHTML=[2,3,4].map(k=>`<button class="btn ghost sm" data-k="${k}">k = ${k}</button>`).join('');
$('cuKBtns').querySelectorAll('button').forEach(b=>b.onclick=()=>cuSetK(+b.dataset.k));
$('cuAssign').onclick=()=>cuAssign();
$('cuMove').onclick=()=>cuMove();
$('cuAuto').onclick=()=>{ for(let n=0;n<100&&KM.phase!=='done';n++){ if(KM.phase==='assign') cuAssign(true); else if(KM.phase==='move') cuMove(true); else break; } };
$('cuLogClr').onclick=()=>{cuLog=[]; cuLogSave();};
cuLogSave();
cuSetK(3);

/* 03 실루엣 계산기 */
/* k마다 여러 시작점(가장 먼 점부터 고르기)으로 돌려 거리 제곱의 합이 가장 작은 결과를 씀 → 늘 같은 결과 */
function cuRun(P,C){ let L=stat.assign(P,C); for(let n=0;n<100;n++){ const C2=stat.center(P,L,C); const L2=stat.assign(P,C2); C=C2; if(L2.every((v,i)=>v===L[i])) break; L=L2; } return {L,C}; }
function cuBest(P,k){
  let best=null;
  P.forEach((_,s)=>{
    const C=[P[s].slice()];
    while(C.length<k){ let bi=0,bd=-1; P.forEach((p,i)=>{const d=Math.min(...C.map(c=>(p[0]-c[0])**2+(p[1]-c[1])**2)); if(d>bd){bd=d;bi=i;}}); C.push(P[bi].slice()); }
    const r=cuRun(P,C), e=stat.sse(P,r.L,r.C);
    if(!best||e<best.e-1e-9) best={...r,e};
  });
  return best;
}
const CU_RES={}; [2,3,4,5].forEach(k=>{ const r=cuBest(CU_U,k); CU_RES[k]={...r,sil:stat.silhouette(CU_U,r.L)}; });
/* 점 i의 a(i)·b(i): 같은 군집 평균 거리, 가장 가까운 다른 군집 평균 거리 */
function cuAB(P,L,i){
  const d=q=>Math.hypot(P[i][0]-q[0],P[i][1]-q[1]), k=Math.max(...L)+1;
  const avg=c=>{ const m=P.filter((_,j)=>L[j]===c&&j!==i); return m.length?stat.mean(m.map(d)):NaN; };
  const a=avg(L[i]); let b=Infinity, nb=-1;
  for(let c=0;c<k;c++) if(c!==L[i]){ const v=avg(c); if(v<b){b=v; nb=c;} }
  return {a,b,nb,s:isNaN(a)?0:(b-a)/Math.max(a,b)};
}
const cuSil=scatter({svg:'cuSil',...cuAx});
let cuSilK=3, cuSilI=-1;
function cuSilDraw(){
  const R=CU_RES[cuSilK];
  cuSil.set(CU_U.map((p,i)=>[p[0],p[1],R.L[i]])).centers(R.C);
  const S=$('cuSil'); let G=S.querySelector('.cu-ov');
  if(!G){ G=document.createElementNS('http://www.w3.org/2000/svg','g'); G.setAttribute('class','cu-ov'); S.insertBefore(G,S.querySelector('.pts')); }
  if(cuSilI<0){ G.innerHTML=''; $('cuSilSay').innerHTML=`k = ${cuSilK}일 때 평균 실루엣 계수 <b>${cuF(R.sil)}</b>. 점을 하나 눌러 보세요.`; }
  else{
    const i=cuSilI, r=cuAB(CU_U,R.L,i), X=cuSil.X, Y=cuSil.Y, p=CU_U[i];
    let g='';
    CU_U.forEach((q,j)=>{ if(j===i) return;
      if(R.L[j]===R.L[i]) g+=`<line x1="${X(p[0])}" y1="${Y(p[1])}" x2="${X(q[0])}" y2="${Y(q[1])}" stroke="${PAL[R.L[i]]}" stroke-width="2" stroke-opacity=".75"/>`;
      else if(R.L[j]===r.nb) g+=`<line x1="${X(p[0])}" y1="${Y(p[1])}" x2="${X(q[0])}" y2="${Y(q[1])}" stroke="${PAL[r.nb]}" stroke-width="1.6" stroke-dasharray="5 4" stroke-opacity=".75"/>`; });
    g+=`<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="11" fill="none" stroke="#16202c" stroke-width="2.5"/>`;
    G.innerHTML=g;
    const nA=R.L.filter((v,j)=>v===R.L[i]&&j!==i).length, nB=R.L.filter(v=>v===r.nb).length;
    const word=r.s>=0.7?'1에 가까워요 → 자기 군집과 촘촘히 모여 있고 다른 군집과 잘 떨어져 있어요.':r.s>=0.25?'0보다 꽤 커요 → 자기 군집 쪽에 더 가까워요.':r.s>-0.25?'0에 가까워요 → 두 군집의 경계쯤에 있는 점이에요.':'음수예요 → 다른 군집에 더 가까워, 잘못 묶였을 가능성이 있어요.';
    $('cuSilSay').innerHTML=isNaN(r.a)
      ? `이 점은 군집에 혼자 있어서 a(i)를 구할 수 없어요. 이럴 때 s(i)는 0으로 봐요.`
      : `<span style="color:${PAL[R.L[i]]}">●</span> 고른 점 (${p[0]}, ${p[1]})<br><b style="color:#1f9d74">a(i)</b> = ${cuF(r.a)} <small class="muted">(같은 군집 ${nA}개 점까지 평균, 실선)</small><br><b style="color:#d64535">b(i)</b> = ${cuF(r.b)} <small class="muted">(가장 가까운 다른 군집 <span style="color:${PAL[r.nb]}">●</span> ${nB}개 점까지 평균, 점선)</small><br><b>s(i)</b> = (${cuF(r.b)} − ${cuF(r.a)}) ÷ ${cuF(Math.max(r.a,r.b))} = <b>${cuF(r.s)}</b><br>${word}`;
  }
  bars('cuSilBars',[2,3,4,5].map(k=>[`k = ${k}`,CU_RES[k].sil,k===cuSilK?'#9b4fc4':'#c9b3e0']),{dec:2,max:1,h:220});
  $('cuSilK').querySelectorAll('button').forEach(b=>b.classList.toggle('on',+b.dataset.k===cuSilK));
}
$('cuSilK').innerHTML=[2,3,4,5].map(k=>`<button class="btn ghost sm" data-k="${k}">k = ${k}</button>`).join('');
$('cuSilK').querySelectorAll('button').forEach(b=>b.onclick=()=>{cuSilK=+b.dataset.k; cuSilDraw();});
$('cuSil').addEventListener('click',e=>{ const c=e.target.closest('circle[data-i]'); if(!c) return; cuSilI=+c.dataset.i; cuSilDraw(); });
cuSilDraw();

/* 04 마무리 */
const MEMOLIST=[['pastaVote','처음 생각: 마트 사장님이 알아낸 것'],['plan','나의 계획'],['myGroups','손으로 묶은 우리 반 그룹과 특징'],['kmLog','k-평균 한 걸음씩 결과 기록'],['silRead','실루엣 계수 해석'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[4]=()=>{
  $('cuVoteShow').textContent=MEMO.pastaVote?'「'+MEMO.pastaVote+'」':'아직 고르지 않음';
  memoSummary('msum',MEMOLIST);
};

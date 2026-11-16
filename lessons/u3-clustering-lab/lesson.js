/* u3-clustering-lab 전용 (cl-) — 공용 부품 orangeFlow · scatter · stat · bars 사용 */

/* 0 시작 · 처음 생각 */
chips('clBy','divideBy',['나이','성별','연간 소득','지출 점수','사는 지역','자주 사는 물건','방문 횟수'],true);

/* 01 역할 정하기 */
sorter('clRoleSort',{
  cats:[{n:'meta',k:'#5b6776'},{n:'feature',k:'#2f6fd0'},{n:'target',k:'#d64535'}],
  items:[
    {t:'고객 쇼핑 데이터의 <b>CustomerID</b> (고객 ID)',short:'CustomerID',c:0,ic:'🔢',w:'고객마다 1부터 차례로 붙인 번호일 뿐 크기에 뜻이 없어, 분석에는 넣지 않고 표에서 참고로만 봐요.'},
    {t:'고객 쇼핑 데이터의 <b>Age</b> (나이)',short:'Age',c:0,ic:'🎂',w:'오늘은 소득과 지출 두 속성으로만 고객을 묶기로 해서, 나이는 군집을 해석할 때 참고하려고 표에 남겨 둬요.'},
    {t:'고객 쇼핑 데이터의 <b>Annual Income (k$)</b> (연간 소득)',short:'Annual Income',c:1,ic:'💰',w:'지출 점수와 함께 고객끼리 얼마나 비슷한지 거리를 재는 데 쓰는 속성이라 분석에 들어가요.'},
    {t:'아파트 가격 예측 데이터의 <b>방의 개수</b>',short:'방의 개수',c:1,ic:'🚪',w:'집값에 영향을 주는 원인 쪽 속성이라 분석에 넣어요.'},
    {t:'아파트 가격 예측 데이터의 <b>집값</b>',short:'집값',c:2,ic:'🏠',w:'모델이 맞히려는 결과라서 target이에요. 군집 분석은 맞힐 결과가 없는 분석이라 target을 두지 않아요.'}
  ],
  end:'<b>정리</b> 분석에 쓰는 속성은 feature, 참고로만 보는 속성은 meta, 맞히려는 결과는 target이에요. 오늘 고객 군집 분석에는 맞힐 결과가 없어서 <b>feature 2개와 meta 3개</b>로 정해요.'
});

/* 02 오렌지3 흐름도 + 설정 표 + 진행 칩 */
orangeFlow({svg:'clFlow', table:'clSet',
  nodes:[
    {s:1,t:'File',sub:'Mall_Customers.csv',c:'Data',x:10,y:120},
    {s:2,t:'Data Table',sub:'결측치 · 막대 보기',c:'Data',x:240,y:120},
    {s:3,t:'k-Means',sub:'From 2 to 8',c:'Unsupervised',x:470,y:120},
    {s:4,t:'Scatter Plot',sub:'소득 × 지출 점수',c:'Visualize',x:700,y:20},
    {s:5,t:'Silhouette Plot',sub:'Euclidean · Cluster',c:'Visualize',x:700,y:120},
    {s:6,t:'Data Table (1)',sub:'Cluster · Silhouette 열',c:'Data',x:700,y:220}
  ],
  edges:[[1,2],[2,3],[3,4],[3,5],[3,6]]});
chips('clDone','kmDone',['파일 열기 · Role 정하기','결측치 확인','실루엣 점수로 k 고르기','Scatter Plot 색 보기','Silhouette Plot 보기','18번 · 188번 고객 비교','k 바꿔 보기'],true);

/* 02 막혔을 때 · 고객 군집 체험: 예시 고객 52명 [연간 소득(천 달러), 지출 점수] (지어낸 고정값) */
const CL_M=[
  [42,48],[45,55],[47,42],[50,51],[52,58],[54,45],[56,50],[58,54],[60,41],[61,57],[63,47],[65,52],[48,61],[57,39],[44,44],[62,60],
  [17,78],[20,92],[23,73],[25,85],[28,77],[30,94],[33,81],[21,66],
  [16,12],[19,30],[22,6],[25,22],[28,15],[31,34],[34,9],[20,20],
  [72,88],[76,75],[79,95],[83,82],[87,91],[91,73],[96,86],[101,93],[108,79],[118,90],
  [73,10],[77,25],[80,5],[85,18],[88,32],[93,12],[98,27],[104,8],[112,20],[126,14]
];
/* k마다 여러 시작점(가장 먼 점부터 고르기)으로 돌려 거리 제곱의 합이 가장 작은 결과를 씀 → 늘 같은 결과 */
function clRun(P,C){ let L=stat.assign(P,C); for(let n=0;n<100;n++){ const C2=stat.center(P,L,C); const L2=stat.assign(P,C2); C=C2; if(L2.every((v,i)=>v===L[i])) break; L=L2; } return {L,C}; }
function clBest(P,k){
  let best=null;
  P.forEach((_,s)=>{
    const C=[P[s].slice()];
    while(C.length<k){ let bi=0,bd=-1; P.forEach((p,i)=>{const d=Math.min(...C.map(c=>(p[0]-c[0])**2+(p[1]-c[1])**2)); if(d>bd){bd=d;bi=i;}}); C.push(P[bi].slice()); }
    const r=clRun(P,C), e=stat.sse(P,r.L,r.C);
    if(!best||e<best.e-1e-9) best={...r,e};
  });
  /* 군집 번호를 중심의 (소득, 지출 점수) 순서로 다시 붙여 k가 바뀌어도 색이 덜 뒤섞이게 */
  const ord=best.C.map((c,i)=>i).sort((a,b)=>best.C[a][0]-best.C[b][0]||best.C[b][1]-best.C[a][1]), re={}; ord.forEach((o,n)=>re[o]=n);
  return {L:best.L.map(v=>re[v]), C:ord.map(o=>best.C[o])};
}
const CL_RES={}; for(let k=2;k<=8;k++){ const r=clBest(CL_M,k); CL_RES[k]={...r,sil:stat.silhouette(CL_M,r.L)}; }
const clPlot=scatter({svg:'clPlot', x:[0,140,20], y:[0,100,20], xl:'연간 소득 (천 달러, 예시)', yl:'지출 점수 (예시)'});
const clWord=(inc,sp)=>`소득 ${inc<40?'낮음':inc<70?'중간':'높음'} · 지출 ${sp<40?'낮음':sp<65?'중간':'높음'}`;
let clKNow=5;
function clDraw(){
  const R=CL_RES[clKNow], best=Object.keys(CL_RES).reduce((a,b)=>CL_RES[b].sil>CL_RES[a].sil?b:a);
  clPlot.set(CL_M.map((p,i)=>[p[0],p[1],R.L[i]])).centers(R.C);
  bars('clBars',Object.keys(CL_RES).map(k=>[`k=${k}`,CL_RES[k].sil,+k===clKNow?'#1f9d74':'#a9dcc8']),{dec:2,max:1,h:210});
  const rows=R.C.map((c,i)=>`<li><span style="color:${PAL[i%PAL.length]}">●</span> ${R.L.filter(v=>v===i).length}명 · 평균 (${Math.round(c[0])}, ${Math.round(c[1])}) · ${clWord(c[0],c[1])}</li>`).join('');
  $('clSay').innerHTML=`k = ${clKNow}일 때 평균 실루엣 점수 <b>${stat.fmt(R.sil,3)}</b>${+best===clKNow?' — 가장 커요!':` (가장 큰 것은 k = ${best})`}<ul class="cl-gl">${rows}</ul>`;
  $('clK').querySelectorAll('button').forEach(b=>b.classList.toggle('on',+b.dataset.k===clKNow));
}
$('clK').innerHTML=[2,3,4,5,6,7,8].map(k=>`<button class="btn ghost sm" data-k="${k}">k = ${k}</button>`).join('');
$('clK').querySelectorAll('button').forEach(b=>b.onclick=()=>{clKNow=+b.dataset.k; clDraw();});
clDraw();

/* 05 마무리 */
const MEMOLIST=[['divideBy','처음 생각: 고객을 나눌 기준'],['kmDone','오렌지3 진행 체크'],['kmBest','실루엣 점수가 가장 큰 k와 점수'],['kmEach','(선택) 군집별 실루엣 계수'],['kmBig','(선택) 사람이 가장 많은 군집'],['km18','CustomerID 18과 188 비교 · Age를 더하면'],['kmRec','k를 바꿔 본 결과와 k를 고른 까닭'],['plan2','군집별 마케팅 전략(나와 친구)'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[5]=()=>{
  $('clByShow').textContent=MEMO.divideBy?'「'+MEMO.divideBy+'」':'아직 고르지 않음';
  memoSummary('msum',MEMOLIST.filter(([k,l])=>!l.startsWith('(선택)')||String(MEMO[k]||'').trim()));
};

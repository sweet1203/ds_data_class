/* u4-country-2 전용 (c2-) — 공용 부품 vote · sorter · flipCards · chips · scatter · stat · bars · orangeFlow 사용 */

/* 0 시작 · 처음 생각 */
vote('c2First','c2First',[['바로 정해도 돼요','비슷한 나라끼리 묶었으니까'],['더 확인해야 해요','군집만으로는 부족할 것 같아요'],['잘 모르겠어요','해 보고 정할래요']]);

/* 01 k 비교 탐색기 — 예시 나라 24개 [건강지표, 금융지표] (0~1, 지어낸 고정값) */
const C2_P=[
  [0.12,0.10],[0.15,0.18],[0.18,0.12],[0.20,0.22],[0.22,0.09],[0.25,0.16],[0.14,0.24],[0.28,0.20],[0.17,0.07],[0.24,0.26],[0.30,0.12],[0.11,0.16],
  [0.52,0.08],[0.58,0.04],[0.63,0.12],[0.68,0.06],[0.72,0.10],[0.78,0.03],[0.60,0.14],
  [0.10,0.55],[0.15,0.70],[0.08,0.48],[0.20,0.62],[0.13,0.80]
];
const C2_KS=[2,3,4,5,6];
/* 시작 중심을 「가장 먼 점부터 고르기」로 점마다 한 번씩 정해 돌리고, SSE가 가장 작은 결과를 씀 → 늘 같은 결과 */
function c2Run(P,C){ let L=stat.assign(P,C); for(let n=0;n<100;n++){ const C2=stat.center(P,L,C), L2=stat.assign(P,C2); C=C2; if(L2.every((v,i)=>v===L[i])) break; L=L2; } return {L,C}; }
function c2Best(P,k){
  let best=null;
  P.forEach((_,s)=>{
    const C=[P[s].slice(0,2)];
    while(C.length<k){ let bi=0,bd=-1; P.forEach((p,i)=>{const d=Math.min(...C.map(c=>(p[0]-c[0])**2+(p[1]-c[1])**2)); if(d>bd){bd=d;bi=i;}}); C.push(P[bi].slice(0,2)); }
    const r=c2Run(P,C), e=stat.sse(P,r.L,r.C);
    if(!best||e<best.e-1e-12) best={...r,e};
  });
  /* 군집 번호를 중심의 (건강지표, 금융지표) 순서로 다시 붙여 k가 바뀌어도 색이 덜 뒤섞이게 */
  const ord=best.C.map((c,i)=>i).sort((a,b)=>best.C[a][0]-best.C[b][0]||best.C[b][1]-best.C[a][1]), re={}; ord.forEach((o,n)=>re[o]=n);
  return {L:best.L.map(v=>re[v]), C:ord.map(o=>best.C[o]), e:best.e};
}
let c2Pts=C2_P.map(p=>p.slice()), c2KNow=3, c2Res={}, c2Busy=false;
function c2Compute(){
  c2Res={};
  if(c2Pts.length<7){ return; }
  C2_KS.forEach(k=>{ const r=c2Best(c2Pts,k); c2Res[k]={...r,sil:stat.silhouette(c2Pts,r.L)}; });
}
function c2Draw(){
  const R=c2Res[c2KNow];
  $('c2K').querySelectorAll('button').forEach(b=>b.classList.toggle('on',+b.dataset.k===c2KNow));
  if(!R){ c2Busy=true; c2Plot.set(c2Pts.map(p=>[p[0],p[1]])).centers([]); c2Busy=false; $('c2Say').innerHTML='점이 7개 이상 있어야 k = 2~6을 비교할 수 있어요. 빈 곳을 눌러 점을 더해 보세요.'; return; }
  c2Busy=true; c2Plot.set(c2Pts.map((p,i)=>[p[0],p[1],R.L[i]])).centers(R.C); c2Busy=false;
  const bestSil=C2_KS.reduce((a,b)=>c2Res[b].sil>c2Res[a].sil?b:a);
  bars('c2Sse',C2_KS.map(k=>[`k=${k}`,c2Res[k].e,k===c2KNow?'#c98a00':'#ecd9a6']),{dec:3,h:190});
  bars('c2Sil',C2_KS.map(k=>[`k=${k}`,Math.max(0,c2Res[k].sil),k===c2KNow?'#1f9d74':'#a9dcc8']),{dec:3,max:1,h:190});
  const prev=c2Res[c2KNow-1], drop=prev?prev.e-R.e:null;
  const sizes=R.C.map((c,i)=>`<span style="color:${PAL[i%PAL.length]}">●</span> ${R.L.filter(v=>v===i).length}개`).join(' · ');
  $('c2Say').innerHTML=`k = ${c2KNow} · SSE <b>${stat.fmt(R.e,3)}</b>${drop!=null?` (k = ${c2KNow-1}보다 ${stat.fmt(drop,3)} 줄어듦)`:''} · 평균 실루엣 계수 <b>${stat.fmt(R.sil,3)}</b>${bestSil===c2KNow?' — 지금 점들에서 가장 커요!':` (가장 큰 것은 k = ${bestSil})`}<br>군집별 나라 수: ${sizes}`;
}
const c2Plot=scatter({svg:'c2Plot', x:[0,1,0.2], y:[0,1,0.2], xl:'건강지표 (0~1, 예시)', yl:'금융지표 (0~1, 예시)', edit:true, max:40, dec:2,
  onChange(P,fin){ if(c2Busy||!fin) return; c2Pts=P.map(p=>[p[0],p[1]]); c2Compute(); c2Draw(); }});  /* 손을 뗄 때만 다시 계산(처음 만들 때 부르는 onChange는 fin이 없어 건너뜀) */
$('c2K').innerHTML=C2_KS.map(k=>`<button class="btn ghost sm" data-k="${k}">k = ${k}</button>`).join('');
$('c2K').querySelectorAll('button').forEach(b=>b.onclick=()=>{c2KNow=+b.dataset.k; c2Draw();});
$('c2Reset').onclick=()=>{c2Pts=C2_P.map(p=>p.slice()); c2Compute(); c2Draw();};
c2Compute(); c2Draw();

/* 02 오렌지3 흐름도 + 설정 표 + 진행 칩 */
orangeFlow({svg:'c2Flow', table:'c2Set',
  nodes:[
    {s:1,t:'File',sub:'Country-data.csv',c:'Data',x:10,y:70},
    {s:2,t:'Formula',sub:'Health · Trade · Finance',c:'Transform',x:230,y:70},
    {s:3,t:'Select Columns',sub:'feature 3개',c:'Transform',x:450,y:70},
    {s:4,t:'Preprocess',sub:'[0, 1] 정규화',c:'Transform',x:670,y:70},
    {s:5,t:'k-Means',sub:'From 2 to 9 · k 고르기',c:'Unsupervised',x:890,y:70},
    {s:6,t:'Box Plot',sub:'Subgroups: Cluster',c:'Visualize',x:1110,y:20},
    {s:7,t:'Distributions',sub:'Cluster별 나라 수',c:'Visualize',x:1110,y:120}
  ],
  edges:[[1,2],[2,3],[3,4],[4,5],[5,6],[5,7]],
  done:{box:'c2Done', key:'c2Done', items:['세 지표 만들기','0~1 정규화','실루엣 목록에서 k 고르기','child_mort 상자 그림','income 상자 그림','군집별 나라 수','이름 붙여 기록']}});

/* 02 군집에 이름 붙이기 — 실제 167개 나라를 세 지표로 k = 3 묶은 요약값(집계값) */
sorter('c2Name',{
  cats:[{n:'사망률 높고 소득 낮은 무리',k:'#d64535'},{n:'사망률·소득이 중간인 무리',k:'#c98a00'},{n:'사망률 낮고 소득 높은 무리',k:'#1f9d74'}],
  items:[
    {t:'군집 ㉠ · 102개 나라 · child_mort 중앙값 <b>18.4</b> · income 중앙값 <b>11150</b>',short:'㉠ 102개',c:1,ic:'🟡',w:'child_mort와 income이 모두 다른 두 무리의 사이에 있어요. 나라 수가 가장 많아 안쪽 차이도 커서, 지원을 검토할 때 원래 속성을 나라마다 더 살펴봐야 해요.'},
    {t:'군집 ㉡ · 36개 나라 · child_mort 중앙값 <b>95.5</b> · income 중앙값 <b>1695</b>',short:'㉡ 36개',c:0,ic:'🔴',w:'5세 미만 사망률이 가장 높고 1인당 소득이 가장 낮은 무리예요. 지원 검토는 이 특성과 함께 기대 수명 같은 원래 속성, 인구·최근 상황을 더 보고 판단해요.'},
    {t:'군집 ㉢ · 29개 나라 · child_mort 중앙값 <b>4.8</b> · income 중앙값 <b>43200</b>',short:'㉢ 29개',c:2,ic:'🟢',w:'사망률이 가장 낮고 소득이 가장 높은 무리예요. 다만 이것도 이 자료가 모인 때의 모습이라, 지원 여부는 원래 속성과 함께 판단해요.'}
  ],
  end:'<b>정리</b> 이름은 군집 번호가 아니라 <b>요약값</b>을 보고 특성대로 붙였어요. 군집 이름이 곧 지원 순위는 아니에요. 내 오렌지3의 군집도 나라 수와 중앙값을 견주어 어느 무리인지 찾아요.'
});

/* 03 병합적 군집 흐름도 */
orangeFlow({svg:'c2Flow2', table:'c2Set2',
  nodes:[
    {s:1,t:'Preprocess',sub:'02의 4번',c:'Transform',x:10,y:10},
    {s:2,t:'Distances',sub:'Rows · Euclidean',c:'Unsupervised',x:230,y:10},
    {s:3,t:'Hierarchical Clustering',sub:'Ward · Top N 3',c:'Unsupervised',x:450,y:10},
    {s:4,t:'Box Plot (1)',sub:'Subgroups: Cluster',c:'Visualize',x:670,y:10}
  ],
  edges:[[1,2],[2,3],[3,4]],
  done:{box:'c2Done2', key:'c2Done2', items:['거리 재기','Ward · Top N 3','상자 그림 비교']}});

/* 03 교과서 지도 코드 점검 카드 */
flipCards('c2Bug',[
  {ic:'🔢',f:'번호 → 이름 짝짓기',s:'224쪽은 1을 무엇으로 바꿨나?',b:'223쪽 병합적 군집에서는 <b>1번이 「도움이 필요함」</b>인데, 224쪽 코드는 1을 \'Might Need Help\'로 바꿔요. 손으로 짝지으면 지도가 엉뚱하게 칠해져요.',x:'고치기 · 군집별 중앙값을 보고 이름 붙이기'},
  {ic:'🎨',f:'색 이름표',s:'바꾼 이름과 색을 지정한 이름은 같을까?',b:'값은 \'No Need Help\'로 바꾸고, 색은 \'No Help Needed\'에 지정했어요. 이름이 달라서 그 무리에 <b>초록색이 칠해지지 않아요</b>.',x:'고치기 · 이름을 하나로 통일하기'},
  {ic:'🏷️',f:'군집 번호의 뜻',s:'0·1·2는 순위일까?',b:'번호는 실행·모델마다 바뀌는 <b>이름표</b>일 뿐이에요. k-평균과 병합적 군집은 같은 무리에도 다른 번호를 붙였어요.',x:'고치기 · 번호 대신 특성으로 말하기'}
]);

/* 05 마무리 · 프로젝트 되돌아보기(교과서 225쪽 평가 과정) */
chips('c2Eval','c2Eval',['문제 정의','데이터 수집','데이터 전처리','데이터 시각화와 분석','데이터 모델링','평가'],true);
const MEMOLIST=[['c2First','처음 생각: 군집만으로 정해도 될까'],['c2K','탐구 기록 ① 군집 수와 근거'],['c2Done','오렌지3 진행 체크 (k-Means)'],['c2Res','탐구 기록 ② 군집별 특성과 이름'],['c2Done2','오렌지3 진행 체크 (병합적 군집)'],['c2Limit','탐구 기록 ③ 두 모델 비교와 더 확인할 것'],['c2Eval','잘 해낸 프로젝트 과정'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[5]=()=>{
  $('c2FirstShow').textContent=MEMO.c2First?'「'+MEMO.c2First+'」':'아직 고르지 않음';
  memoSummary('msum',MEMOLIST);
};

/* u4-country-1 전용 (c1-) — 공용 부품 sorter · flipCards · chips · miniTable · bars · orangeFlow 사용 */

/* 0 시작 · 문제 정의 */
chips('c1Need','c1Need',['5세 미만 사망률','기대 수명','1인당 소득','의료비 지출','물가 상승','수출·수입','인구 수','최근 재난 소식'],true);

/* 01 클수록 좋은 값일까? */
sorter('c1Dir',{
  cats:[{n:'클수록 형편이 좋은 쪽',k:'#1f9d74'},{n:'클수록 형편이 어려운 쪽',k:'#d64535'},{n:'크기만으로 말하기 어려움',k:'#5b6776'}],
  items:[
    {t:'<b>life_expec</b> · 새로 태어난 아이가 살 것으로 보는 평균 나이',short:'life_expec',c:0,ic:'🧓',w:'오래 살 수 있다는 뜻이라 값이 클수록 건강 형편이 좋은 쪽으로 읽어요.'},
    {t:'<b>gdpp</b> · 총 GDP를 총인구수로 나눈 값',short:'gdpp',c:0,ic:'🏦',w:'한 사람에게 돌아가는 생산의 크기라서 값이 클수록 경제 형편이 좋은 쪽으로 읽어요.'},
    {t:'<b>child_mort</b> · 출생아 1,000명당 5세 미만 사망 수',short:'child_mort',c:1,ic:'👶',w:'어린이가 일찍 숨지는 수라서 값이 클수록 형편이 어려운 쪽이에요.'},
    {t:'<b>inflation</b> · 물가가 오른 정도',short:'inflation',c:1,ic:'📈',w:'물가가 크게 오르면 같은 돈으로 살 수 있는 것이 줄어 생활이 어려워져요. 값이 아주 클수록 어려운 쪽으로 읽어요.'},
    {t:'<b>exports</b> · 1인당 GDP에 대한 수출의 비율',short:'exports',c:2,ic:'🚢',w:'경제에서 수출이 차지하는 몫이라, 크다고 잘사는 나라라고도, 작다고 어려운 나라라고도 바로 말할 수 없어요.'},
    {t:'<b>total_fer</b> · 여성 1명이 낳을 것으로 보는 자녀 수',short:'total_fer',c:2,ic:'👨‍👩‍👧',w:'아이가 많고 적음은 좋고 나쁨의 문제가 아니에요. 다른 속성과 함께 볼 때 뜻이 생겨요.'}
  ],
  end:'<b>정리</b> 같은 「크다」라도 속성마다 뜻하는 방향이 달라요. 다음 화면에서 이런 속성들을 <b>더해서</b> 지표 하나로 만들면 어떤 일이 생기는지 확인해요.'
});

/* 02 지표 만들기 체험 — 나누는 평균은 교과서 216쪽 인쇄값(반올림), 예시 나라 5개는 지어낸 고정값 */
const C1_MEAN={child_mort:38.27,health:6.8157,life_expec:70.5557,total_fer:2.948,imports:46.89,exports:41.109,income:17144.69,inflation:7.7818,gdpp:12964.16};
const C1_IDX=[
  {n:'건강지표 Health',ic:'🩺',cols:['child_mort','health','life_expec','total_fer']},
  {n:'무역지표 Trade',ic:'🚢',cols:['imports','exports']},
  {n:'금융지표 Finance',ic:'💰',cols:['income','inflation','gdpp']}
];
const C1_BASE=[
  {n:'가 나라',child_mort:90,health:5,life_expec:60,total_fer:5.2,imports:40,exports:25,income:2000,inflation:9,gdpp:800},
  {n:'나 나라',child_mort:20,health:6.5,life_expec:73,total_fer:2.3,imports:50,exports:40,income:12000,inflation:4,gdpp:6000},
  {n:'다 나라',child_mort:4,health:10,life_expec:81,total_fer:1.6,imports:35,exports:30,income:42000,inflation:1.5,gdpp:45000},
  {n:'라 나라',child_mort:45,health:4,life_expec:66,total_fer:3.5,imports:70,exports:65,income:9000,inflation:20,gdpp:4000},
  {n:'마 나라',child_mort:6,health:3.5,life_expec:80,total_fer:1.3,imports:150,exports:170,income:60000,inflation:2.5,gdpp:52000}
];
let c1Now=C1_BASE.map(r=>({...r})), c1I=0, c1Tbl=null;
const c1f=(v,d=2)=>isFinite(v)?(+v).toFixed(d):'—';
function c1Calc(){
  const cols=C1_IDX[c1I].cols;
  const part=c1Now.map(r=>cols.map(c=>(+r[c])/C1_MEAN[c]));
  const sum=part.map(p=>p.reduce((a,b)=>a+b,0));
  const ok=sum.filter(isFinite), lo=Math.min(...ok), hi=Math.max(...ok);
  const mm=sum.map(s=>isFinite(s)?(hi>lo?(s-lo)/(hi-lo):0):NaN);
  return {cols,part,sum,mm};
}
function c1Draw(){
  const R=c1Calc(), nm=C1_IDX[c1I].n.split(' ')[1];
  $('c1Calc').innerHTML=`<table class="tbl c1-calc"><tr><th>나라</th>${R.cols.map(c=>`<th><span class="mono">${c}</span> ÷ ${C1_MEAN[c]}</th>`).join('')}<th>합 = ${nm}</th><th>0~1로 바꾼 ${nm}</th></tr>`+
    c1Now.map((r,i)=>`<tr><td>${r.n}</td>${R.part[i].map(v=>`<td>${c1f(v)}</td>`).join('')}<td><b>${c1f(R.sum[i])}</b></td><td><b>${c1f(R.mm[i],3)}</b></td></tr>`).join('')+`</table>`;
  bars('c1Bars',c1Now.map((r,i)=>[r.n,isFinite(R.mm[i])?R.mm[i]:0,PAL[c1I===0?1:c1I===1?0:3]]),{dec:3,max:1,horiz:true,left:70});
  const top=R.sum.indexOf(Math.max(...R.sum.filter(isFinite)));
  let say=`${C1_IDX[c1I].ic} <b>${nm}</b>가 가장 큰 나라는 <b>${c1Now[top]?c1Now[top].n:'—'}</b>, 0~1로 바꾸면 가장 큰 나라가 1, 가장 작은 나라가 0이에요.`;
  if(c1I===0){const cm=c1Now.map(r=>+r.child_mort), w=cm.indexOf(Math.max(...cm)); say+=`<br>5세 미만 사망률이 가장 높은 나라는 <b>${c1Now[w].n}</b>예요. ${w===top?'건강지표가 가장 큰 나라와 같아요. 그렇다면 건강지표가 크다는 건 건강 형편이 좋다는 뜻일까요?':'건강지표가 가장 큰 나라와 달라요. 어떤 속성이 지표를 키웠는지 ② 표에서 찾아보세요.'}`;}
  if(c1I===1) say+='<br>imports·exports는 GDP에 대한 비율이라, 무역지표는 「경제에서 무역이 차지하는 몫」이 큰 나라일수록 커요.';
  if(c1I===2){const inf=c1Now.map(r=>+r.inflation), w=inf.indexOf(Math.max(...inf)); say+=`<br>물가가 가장 많이 오른 나라는 <b>${c1Now[w].n}</b>예요. inflation도 더하기 때문에 물가가 많이 오를수록 금융지표가 커져요.`;}
  $('c1Say').innerHTML=say;
}
function c1Table(){
  const cols=C1_IDX[c1I].cols;
  c1Tbl=miniTable('c1Raw',{cols:['나라',...cols],rows:c1Now.map(r=>[r.n,...cols.map(c=>r[c])]),edit:cols.map((_,j)=>j+1),
    onChange(rows){rows.forEach((row,i)=>cols.forEach((c,j)=>{c1Now[i][c]=row[j+1];})); c1Draw();}});
  c1Draw();
}
$('c1Pick').innerHTML=C1_IDX.map((x,i)=>`<button class="btn ghost sm" data-i="${i}">${x.ic} ${x.n}</button>`).join('');
const c1Btns=[...$('c1Pick').querySelectorAll('button')];
c1Btns.forEach(b=>b.onclick=()=>{c1I=+b.dataset.i; c1Btns.forEach(x=>x.classList.toggle('on',x===b)); c1Table();});
c1Btns[0].classList.add('on');
$('c1Reset').onclick=()=>{c1Now=C1_BASE.map(r=>({...r})); c1Table();};
c1Table();

/* 03 오렌지3 흐름도 + 설정 표 + 진행 칩 */
orangeFlow({svg:'c1Flow', table:'c1Set',
  nodes:[
    {s:1,t:'File',sub:'Country-data.csv',c:'Data',x:10,y:160},
    {s:2,t:'Data Table',sub:'결측치 확인',c:'Data',x:240,y:0},
    {s:3,t:'Column Statistics',sub:'Mean · Median',c:'Data',x:240,y:64},
    {s:4,t:'Distributions',sub:'몰린 쪽 · 꼬리',c:'Visualize',x:240,y:128},
    {s:5,t:'Correlations',sub:'Pearson',c:'Unsupervised',x:240,y:192},
    {s:6,t:'Box Plot',sub:'child_mort · income',c:'Visualize',x:240,y:256},
    {s:7,t:'Formula',sub:'Health · Trade · Finance',c:'Transform',x:240,y:320},
    {s:8,t:'Select Columns',sub:'feature 3개',c:'Transform',x:470,y:320},
    {s:9,t:'Preprocess',sub:'[0, 1] 정규화',c:'Transform',x:700,y:320},
    {s:10,t:'Data Table (1)',sub:'215쪽과 비교',c:'Data',x:930,y:320}
  ],
  edges:[[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[7,8],[8,9],[9,10]],
  done:{box:'c1Done', key:'c1Done', items:['파일 열기 · 결측치 확인','평균 비교','분포 보기','상관관계 보기','결과 기록','(선택) 상자 그림 보기','Formula 세 지표','0~1 정규화 · 저장']}});

/* 03 분포 모양 예상 카드 — 뒷면은 실제 167개 나라 자료로 계산해 확인한 모양(왜도) */
flipCards('c1Shape',[
  {ic:'🧓',f:'life_expec',s:'값이 어느 쪽에 몰려 있을까?',b:'<b>높은 쪽(오른쪽)</b>에 많이 몰려 있고, 꼬리는 <b>낮은 쪽(왼쪽)</b>으로 길게 뻗어요.'},
  {ic:'🏥',f:'health',s:'값이 어느 쪽에 몰려 있을까?',b:'다른 속성보다 <b>좌우가 비교적 고른</b> 모양이에요. 그래도 높은 쪽으로 꼬리가 조금 있어요.'},
  {ic:'💰',f:'income · gdpp · child_mort 등',s:'나머지 7개는?',b:'<b>낮은 쪽(왼쪽)</b>에 많이 몰려 있고, 꼬리는 <b>높은 쪽(오른쪽)</b>으로 길게 뻗어요. 그래서 평균이 중앙값보다 커요.'}
]);

/* 03 child_mort와의 상관계수 (교과서 214쪽 히트맵 인쇄값) */
bars('c1Corr',[['life_expec (−)',0.89,'#2f6fd0'],['total_fer (+)',0.85,'#d64535'],['income (−)',0.52,'#2f6fd0'],['gdpp (−)',0.48,'#2f6fd0'],['exports (−)',0.32,'#2f6fd0'],['inflation (+)',0.29,'#d64535'],['health (−)',0.20,'#2f6fd0'],['imports (−)',0.13,'#2f6fd0']],{dec:2,max:1,horiz:true,left:110});

/* 04 마무리 */
const MEMOLIST=[['c1Need','처음 생각: 필요한 정보'],['c1Unit','탐구 기록 ① 단위 · 결측치 · country'],['c1Index','탐구 기록 ② 지표 계산과 한계'],['c1Done','오렌지3 진행 체크'],['c1Corr','가장 강한 상관관계'],['c1Dist','분포 모양'],['c1Vis','그래프에서 본 것과 부족한 점'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[4]=()=>{
  $('c1NeedShow').textContent=MEMO.c1Need?'「'+MEMO.c1Need+'」':'아직 고르지 않음';
  memoSummary('msum',MEMOLIST);
};

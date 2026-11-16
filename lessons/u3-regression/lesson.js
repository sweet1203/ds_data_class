/* u3-regression 전용 (rg-) — 산점도·계산은 공용 부품(scatter·stat) */

/* 0 시작 · 처음 생각 */
chips('hitPick','hitPick',['주연 배우의 인기','감독의 인지도','영화 예산','개봉일','홍보 비용','장르','SNS 입소문','상영 시간'],true);

/* 01 직선 맞추기 (예시 값) */
const RG_SET={
  A:{pts:[[1,52],[2,55],[2.5,63],[3,60],[4,70],[4.5,68],[5,76],[6,75],[6.5,84],[7,82],[8,88],[9,95]],
     x:[0,10,1],y:[0,100,20],xl:'공부 시간 (시간, 예시)',yl:'시험 점수 (점, 예시)',w0:0,b0:50,
     wtxt:'공부를 1시간 더 할 때 늘어나는 점수',btxt:'공부 시간이 0일 때의 예상 점수'},
  B:{pts:[[4,35],[4.5,45],[5,55],[5.5,62],[6,70],[6.5,76],[7,80],[7.5,82],[8,80],[8.5,75],[9,68],[9.5,60],[10,50]],
     x:[3,11,1],y:[0,100,20],xl:'하루 수면 시간 (시간, 예시)',yl:'집중도 점수 (점, 예시)',w0:0,b0:50,
     wtxt:'수면을 1시간 더 할 때 늘어나는 집중도',btxt:'수면 시간이 0일 때의 예상 집중도'}
};
let rgKey='A', rgBest=false, rgPeek=false,  /* rgPeek: 데이터 A에서 가장 잘 맞는 직선을 본 뒤(다시 하기 전까지 aBest 미션 인정 안 함) */
    rgRes=true, rgPlot=null;
let rgLog=store.get(MK+'-fit',{});
const RG_MIS=[
  {k:'a20',t:'데이터 A에서 MSE를 <b>20 아래</b>로 만들기'},
  {k:'aBest',t:'데이터 A에서 가장 잘 맞는 직선의 MSE <b>1.2배 안</b>으로 다가가기 (가장 잘 맞는 직선을 보기 전에 · 보았다면 「다시 하기」 뒤에)'},
  {k:'bBest',t:'데이터 B에서 <b>가장 잘 맞는 직선</b>을 보고 MSE 확인하기'}
];
function rgMisDraw(){
  $('fitMis').innerHTML=RG_MIS.map(m=>`<li class="${rgLog[m.k]?'ok':''}">${rgLog[m.k]?'✓':'○'} ${m.t}${rgLog[m.k]?` <span class="muted">(${esc(rgLog[m.k])})</span>`:''}</li>`).join('');
  MEMO.fitLog=RG_MIS.filter(m=>rgLog[m.k]).map(m=>m.t.replace(/<[^>]+>/g,'')+' ✓ '+rgLog[m.k]).join(' / ');
  store.set(MK,MEMO);
}
function rgSave(k,v){ if(rgLog[k]) return; rgLog[k]=v; store.set(MK+'-fit',rgLog); rgMisDraw(); }
function rgBuild(){
  const S=RG_SET[rgKey];
  rgPlot=scatter({svg:'fitPlot',x:S.x,y:S.y,xl:S.xl,yl:S.yl,color:rgKey==='A'?'#2f6fd0':'#e0702b'});
  rgPlot.set(S.pts);
  $('slW').value=S.w0; $('slB').value=S.b0;
  $('dataA').classList.toggle('on',rgKey==='A'); $('dataB').classList.toggle('on',rgKey==='B');
  rgDraw(false);
}
function rgDraw(user){
  const S=RG_SET[rgKey], w=+$('slW').value, b=+$('slB').value, P=S.pts, f=stat.fit(P), my=stat.err(P,b,w).mse;
  const L=[{a:b,b:w,c:'#d64535'}]; if(rgBest) L.push({a:f.a,b:f.b,c:'#1f9d74',dash:true});
  rgPlot.lines(L).resid(rgRes);
  $('slWv').textContent=stat.fmt(w,1); $('slBv').textContent=stat.fmt(b,0);
  $('eqW').textContent=stat.fmt(w,1); $('eqB').textContent=stat.fmt(b,0);
  $('myMse').textContent=stat.fmt(my,1);
  $('bestMse').textContent=rgBest?stat.fmt(f.mse,1):'?';
  let say=`<b>w</b>는 ${S.wtxt}, <b>b</b>는 ${S.btxt}예요. `;
  if(rgBest) say+=`초록 점선이 가장 잘 맞는 직선이에요: y = ${stat.fmt(f.b,1)} x + ${stat.fmt(f.a,1)}, MSE ${stat.fmt(f.mse,1)}. `+(rgKey==='A'?'점들이 이 직선 가까이 모여 있어 오차가 작아요.':'가장 잘 맞는 직선인데도 MSE가 커요. 점들이 <b>산 모양(곡선)</b>이라 직선 하나로는 가운데와 양 끝을 함께 맞출 수 없어요 → <b>비선형 회귀</b>가 필요한 경우예요.');
  else say+=my<=f.mse*1.2?'아주 잘 맞췄어요! 「가장 잘 맞는 직선 보기」로 비교해 보세요.'+(rgPeek&&rgKey==='A'?' (가장 잘 맞는 직선을 이미 봐서 이번에는 미션으로 기록되지 않아요. 「다시 하기」 뒤에 다시 도전해요.)':''):my<=f.mse*2?'거의 다 왔어요. 오차 점선이 위아래로 고르게 나뉘도록 조금씩 옮겨 보세요.':'직선이 점들에서 멀어요. 점들이 올라가는 정도에 맞춰 w를, 높이에 맞춰 b를 바꿔 보세요.';
  $('fitSay').innerHTML=say;
  if(user&&rgKey==='A'){
    if(my<20) rgSave('a20',`w=${stat.fmt(w,1)}, b=${stat.fmt(b,0)}, MSE=${stat.fmt(my,1)}`);
    if(!rgPeek&&my<=f.mse*1.2) rgSave('aBest',`w=${stat.fmt(w,1)}, b=${stat.fmt(b,0)}, MSE=${stat.fmt(my,1)} (가장 잘 맞는 직선 ${stat.fmt(f.mse,1)})`);
  }
}
$('slW').oninput=()=>rgDraw(true); $('slB').oninput=()=>rgDraw(true);
$('dataA').onclick=()=>{rgKey='A'; rgBest=false; rgBuild();};
$('dataB').onclick=()=>{rgKey='B'; rgBest=false; rgBuild();};
$('bestBtn').onclick=()=>{rgBest=true; if(rgKey==='A') rgPeek=true; rgDraw(false); if(rgKey==='B'){const f=stat.fit(RG_SET.B.pts); rgSave('bBest',`가장 잘 맞는 직선 MSE=${stat.fmt(f.mse,1)}`);}};
$('resBtn').onclick=()=>{rgRes=!rgRes; $('resBtn').textContent='오차 보기: '+(rgRes?'켜짐':'꺼짐'); $('resBtn').classList.toggle('on',rgRes); rgDraw(false);};
$('fitReset').onclick=()=>{rgBest=false; rgPeek=false; rgBuild();};
$('misReset').onclick=()=>{rgLog={}; store.set(MK+'-fit',rgLog); rgMisDraw();};
rgMisDraw();
rgBuild();

/* 02 통계학일까, 기계학습일까? */
flipCards('histCards',[
  {ic:'🏛️',f:'고대 로마의 인구 조사',s:'통계학? 기계학습?',b:'아우구스투스 황제가 군사력을 정확히 알려고 17세 이상 남자를 조사해 징병과 징세를 했어요. 인구 데이터로 국가 정책을 정한 초기 통계적 접근이에요.',x:'통계학'},
  {ic:'📜',f:'핼리의 생명표',s:'통계학? 기계학습?',b:'천문학자 핼리가 출생·사망 데이터로 평균 기대 수명을 정리했어요. 오늘날 보험 같은 위험 관리의 기초가 되었어요.',x:'통계학'},
  {ic:'🗺️',f:'존 스노우의 콜레라 지도',s:'통계학? 기계학습?',b:'의학자 존 스노우가 사망자의 주소를 지도에 표시해 공용 펌프를 중심으로 콜레라가 퍼졌다는 것을 밝혔어요.',x:'통계학'},
  {ic:'🚦',f:'실시간 도시 계획',s:'통계학? 기계학습?',b:'인구 데이터, 이동 패턴, 소셜 미디어 글, CCTV 영상을 실시간으로 모아 분석하고 교통 혼잡 지역을 찾아 해결 방안을 세워요.',x:'기계학습'},
  {ic:'⌚',f:'맞춤형 보험 서비스',s:'통계학? 기계학습?',b:'건강·재정 데이터와 웨어러블 기기 센서 데이터, 글과 사진을 함께 분석해 고객의 위험도를 평가하고 보험료를 조정해요.',x:'기계학습'},
  {ic:'🩺',f:'질병 예측',s:'통계학? 기계학습?',b:'의료 영상, 유전자 정보, 환자의 실시간 모니터링 데이터로 질병의 위험 요인을 찾아요. 당뇨병 조기 발견에도 쓰여요.',x:'기계학습'}
]);

/* 03 어느 모델이 알맞을까? (새로 만든 상황) */
sorter('chooseSort',{
  cats:[{n:'통계적 회귀 모델',k:'#c98a00'},{n:'기계학습 회귀 모델',k:'#2f6fd0'}],
  items:[
    {t:'구청이 동네별 공원 면적과 주민 운동 시간 자료 30줄로, 공원을 넓히면 운동 시간이 얼마나 느는지 예측값과 그 근거를 함께 내놓으려 한다.',short:'공원 면적과 운동 시간',c:0,ic:'🌳',w:'관계를 해석해 설명하는 것이 목적이고, 결과를 쉽게 설명할 수 있어야 해요.'},
    {t:'학교가 급식 잔반 양에 영향을 주는 원인으로 메뉴 종류와 기온 가운데 어느 쪽이 우연이 아닌 의미 있는 관계인지 확인하려 한다.',short:'잔반 양의 원인',c:0,ic:'🍱',w:'관계가 통계적으로 의미 있는지 검정하는 것이 목적이에요.'},
    {t:'농업 연구소가 시험 밭 20곳의 기록으로 「비료를 늘리면 수확량이 는다」는 가설을 검정하려 한다.',short:'비료와 수확량 가설',c:0,ic:'🌾',w:'가설을 세우고 검정하며, 데이터 양도 적어요.'},
    {t:'시청이 정류장 수로 주변 상가 매출을 예측하되, 어느 요인이 매출과 어떻게 이어지는지 시민이 알아볼 수 있게 보여 줘야 한다.',short:'정류장과 상가 매출',c:0,ic:'🚏',w:'예측도 하지만 요인과 결과의 관계를 시민이 이해해야 해서 해석하기 쉬운 모델이 알맞아요.'},
    {t:'배달 앱이 날씨·시간대·과거 주문 기록으로 음식 도착 시각을 알려 주려 한다. 왜 그 시각인지 설명하는 것보다 오차가 작은 것이 중요하다.',short:'배달 도착 시각',c:1,ic:'🛵',w:'원인 해석보다 예측의 정확도가 목적이에요.'},
    {t:'쇼핑몰이 상품 사진과 후기 글을 함께 학습시켜 새 상품의 다음 달 판매량을 내다보려 한다.',short:'사진·후기로 판매량',c:1,ic:'🛍️',w:'이미지와 텍스트처럼 다양한 형태의 데이터를 다뤄요.'},
    {t:'전력 회사가 기온·요일·지난 사용량 기록으로 내일 지역별 전력 사용량을 정해 둔다. 어떤 변수가 왜 중요한지는 따지지 않아도 된다.',short:'내일 전력 사용량',c:1,ic:'⚡',w:'원인을 설명할 필요 없이 정확하게 맞히는 것이 목적이에요.'},
    {t:'음원 앱이 사용자 재생 기록과 노래의 소리 데이터를 학습해 새 노래가 한 달 동안 몇 번 재생될지 맞히려 한다.',short:'새 노래 재생 횟수',c:1,ic:'🎵',w:'소리 같은 복잡한 데이터로 맞히는 것이 목적이라 이유를 설명하기는 어려워도 괜찮아요.'}
  ],
  end:'<b>정리</b> 「왜 그런지, 우연은 아닌지」를 설명해야 하면 통계적 회귀 모델, 「크고 복잡한 데이터로 얼마나 정확히 맞히는지」가 중요하면 기계학습 회귀 모델이 알맞아요. 결국 목적과 데이터에 맞게 골라요.'
});

/* 04 마무리 */
const MEMOLIST=[['hitPick','처음 생각: 흥행 예측에 넣을 요소'],['plan','나의 계획'],['fitLog','직선 맞추기 미션 기록'],['fitW','직선 맞추기: 찾은 값과 w·b의 뜻'],['choose','어느 회귀 모델을 고를까: 까닭'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[4]=()=>{
  $('hitShow').textContent=MEMO.hitPick?'「'+MEMO.hitPick+'」':'아직 고르지 않음';
  memoSummary('msum',MEMOLIST);
};

/* u3-model 전용 (md-) — 그림·계산은 공용 부품(scatter·stat·miniTable·orangeFlow) */

/* 0 시작 · 처음 생각 */
chips('orderPick','orderPick',['일기예보(기온)','광고하는 연예인','가게 위치(학교 앞)','지난주 판매량','시험·방학 일정','요일','근처 가게 할인'],true);

/* 01 모델 고르기 (새로 만든 상황) */
sorter('modelSort',{
  cats:[{n:'회귀분석',k:'#2f6fd0'},{n:'분류',k:'#c98a00'},{n:'군집 분석',k:'#1f9d74'},{n:'연관분석',k:'#9b4fc4'}],
  items:[
    {t:'지난 3년의 날짜별 기온과 판매 기록으로 다음 주 생수가 몇 병 팔릴지 예상한다.',short:'생수 판매 병 수',c:0,ic:'💧',w:'판매 기록이라는 정답이 있고, 알고 싶은 값이 병 수(연속형 숫자)예요.'},
    {t:'중고 자전거의 사용 기간·브랜드·상태와 실제 거래 가격 자료로 새 매물의 알맞은 가격(원)을 정한다.',short:'중고 자전거 가격',c:0,ic:'🚲',w:'실제 거래 가격이 정답이고, 알고 싶은 가격이 이어지는 숫자예요.'},
    {t:'「스팸」「정상」 표시가 붙은 지난 메일들로 배워, 새로 온 메일이 스팸인지 가려낸다.',short:'스팸 메일 가려내기',c:1,ic:'📧',w:'표시(정답)가 있고, 알고 싶은 값이 스팸/정상 두 가지 범주예요.'},
    {t:'작년 학생들의 출결·과제 기록과 「통과·미통과」 결과로 올해 학생이 통과할지 미리 알아본다.',short:'통과·미통과 예상',c:1,ic:'🎓',w:'결과가 정답으로 있고, 알고 싶은 값이 통과/미통과라는 범주예요.'},
    {t:'정답 표시가 없는 도서관 대출 기록에서, 즐겨 빌리는 책 종류와 시간대가 닮은 학생끼리 몇 무리로 나눈다.',short:'도서관 이용자 무리',c:2,ic:'📚',w:'정답이 없고, 닮은 데이터끼리 묶는 일이에요.'},
    {t:'음원 앱이 듣는 장르와 시간대가 닮은 사용자를 모아, 무리마다 다른 첫 화면을 보여 준다.',short:'음원 앱 사용자 무리',c:2,ic:'🎧',w:'미리 정한 정답 없이 비슷한 사용자끼리 묶어요.'},
    {t:'편의점 영수증 기록에서 컵라면을 산 손님이 삼각김밥도 같이 사는지 찾는다.',short:'컵라면과 삼각김밥',c:3,ic:'🍙',w:'한 번의 거래에 함께 나타나는 항목 사이의 관계를 찾아요.'},
    {t:'온라인 서점 주문 기록에서 한 주문에 자주 함께 담기는 책의 짝을 찾아 「같이 보면 좋은 책」을 고른다.',short:'함께 담기는 책',c:3,ic:'📦',w:'주문(거래)마다 함께 나타나는 항목의 규칙을 찾아요.'}
  ],
  end:'<b>정리</b> ① 정답(레이블)이 있나? ② 있다면 알고 싶은 값이 숫자인가(회귀분석) 범주인가(분류)? ③ 없다면 비슷한 것끼리 묶나(군집 분석) 함께 나타나는 관계를 찾나(연관분석)?'
});

/* 02 같은 데이터, 네 가지 도구 (교과서 126쪽 연도별 사용량) */
const MD_USE=[[2019,5],[2020,7],[2021,6],[2022,9],[2023,11]];
const usePts=()=>useTbl.rows().filter(r=>typeof r[1]==='number').map(r=>[r[0],Math.max(0,Math.min(16,r[1]))]);  /* 0~16로 제한: 그림·MSE 표가 같은 값을 씀 */
const usePlot=scatter({svg:'usePlot',x:[2018,2024,1],y:[0,16,2],xl:'연도',yl:'사용량',color:'#2f6fd0'});
function useDraw(){
  const P=usePts(), f=stat.fit(P);
  usePlot.set(P);
  if(f){ usePlot.line(f.a,f.b,'#d64535',true); $('useB').textContent=stat.fmt(f.b,2); $('useB2').textContent=stat.fmt(f.b,2); }
  else { usePlot.line(null); $('useB').textContent='–'; $('useB2').textContent='–'; }
}
const useTbl=miniTable('useTbl',{cols:['연도','사용량'],rows:MD_USE,edit:[1],onChange:useDraw});
$('useReset').onclick=()=>{useTbl.set(MD_USE); useDraw();};
useDraw();

const MD_TOOLS=[
  {n:'스프레드시트',ic:'📊',h:`<ol class="vsteps"><li><b>데이터를 입력해요.</b><p>A열에 연도, B열에 사용량을 적어요.</p></li><li><b>차트를 만들어요.</b><p>두 열을 골라 분산형(점) 차트를 넣어요.</p></li><li><b>차트 요소에서 추세선을 넣어요.</b><p>점들 사이를 지나는 직선이 생겨요. 이 화면의 빨간 점선과 같은 직선이에요.</p></li></ol>`},
  {n:'오렌지3',ic:'🍊',h:`<ol class="vsteps"><li><b>File 위젯으로 CSV 파일을 불러와요.</b><p>선생님이 알려 주는 폴더의 CSV, 또는 스프레드시트에서 CSV로 저장한 파일이에요.</p></li><li><b>Data Table 위젯으로 내용을 확인해요.</b></li><li><b>Scatter Plot 위젯에서 X축 연도, Y축 사용량을 고르고 「Show regression line」을 체크해요.</b><p>코드를 한 줄도 쓰지 않고 위젯을 이어서 해요. 아래 「오렌지3로 해 보기」에서 직접 해 봐요.</p></li></ol>`},
  {n:'파이썬',ic:'🐍',h:`<pre class="md-code">import pandas as pd
import matplotlib.pyplot as plt
import statsmodels.api as sm
data = {'year': [2019, 2020, 2021, 2022, 2023],
        'count': [5, 7, 6, 9, 11]}
df = pd.DataFrame(data)
x = sm.add_constant(df[['year']])        # 상수항(절편) 추가
model = sm.OLS(df[['count']], x).fit()   # 선형 회귀 모델 학습
plt.plot(df['year'], df['count'], marker = 'o', label = 'count')
plt.plot(df['year'], model.predict(x), linestyle = '--', label = 'predict')
plt.legend(); plt.show()</pre><p class="note">교과서 127쪽 코드를 줄여 옮겼어요. 코드를 다 이해하기보다 <b>데이터 → 모델 학습 → 그림</b> 순서와 결과 그림을 봐요.</p>`},
  {n:'R',ic:'📐',h:`<pre class="md-code">library(ggplot2)
data &lt;- data.frame(
  year = c(2019, 2020, 2021, 2022, 2023),
  count = c(5, 7, 6, 9, 11))
model &lt;- lm(count ~ year, data = data)   # 선형 회귀 모델 학습
summary(model)                            # 결과 출력
ggplot(data, aes(x = year, y = count)) +
  geom_point() +
  geom_smooth(method = 'lm', se = FALSE)</pre><p class="note">교과서 127쪽 코드를 줄여 옮겼어요(패키지 설치 줄은 뺐어요). 파이썬과 같은 직선이 그려져요.</p>`}
];
tabs('toolTabs','toolView',MD_TOOLS,it=>it.h);

orangeFlow({svg:'useFlow',table:'useSet',minw:520,
  nodes:[{s:1,t:'File',sub:'연도별_사용량.csv',c:'Data',x:10,y:60},{s:2,t:'Data Table',sub:'내용 확인',c:'Data',x:260,y:6},{s:3,t:'Scatter Plot',sub:'연도 × 사용량 · 회귀선',c:'Visualize',x:260,y:110}],
  edges:[[1,2],[1,3]]});
chips('toolDone','toolDone',['CSV 파일 내려받기','File로 열기','Data Table 확인','Scatter Plot 회귀선 보기','(선택) 스프레드시트 추세선'],true);

/* 03 평가 지표 카드 */
flipCards('metricCards',[
  {ic:'📉',f:'평균 제곱 오차 (MSE)',s:'회귀분석',b:'실젯값과 예측값의 차이(오차)를 제곱해 평균 낸 값이에요.',x:'<b>작을수록</b> 예측이 정확해요.'},
  {ic:'🎯',f:'정확도',s:'분류 분석',b:'예: 메일 100통을 「스팸/정상」으로 가려냈더니 90통을 맞혔다면 정확도는 0.9예요. 분류 모델이 맞힌 비율이에요.',x:'<b>1에 가까울수록</b> 예측이 정확해요.'},
  {ic:'🫧',f:'실루엣 계수',s:'군집 분석',b:'정답이 없으니 묶인 데이터 사이의 거리로 평가해요. 같은 군집끼리는 가깝고 다른 군집과는 먼지 봐요.',x:'<b>1에 가까울수록</b> 군집이 잘 만들어졌어요.'},
  {ic:'🛒',f:'지지도 · 신뢰도 · 향상도',s:'연관분석',b:'지지도는 규칙이 얼마나 자주 나타나는지, 신뢰도는 앞 항목이 있을 때 뒤 항목도 있을 확률, 향상도는 신뢰도를 뒤 항목이 나타날 확률로 나눈 값이에요.',x:'지지도·신뢰도는 <b>클수록</b> 함께 나타날 가능성이 크고, 향상도가 <b>1보다 크면</b> 관련이 있어요.'}
]);

/* 03 오차를 눈으로 보기: 02 표의 값으로 */
const msePlot=scatter({svg:'msePlot',x:[2018,2024,1],y:[0,16,2],xl:'연도',yl:'사용량',color:'#2f6fd0'});
function mseDraw(){
  const P=usePts(), f=stat.fit(P);
  msePlot.set(P);
  if(!f){ msePlot.line(null); $('mseV').textContent='–'; $('mseTbl').innerHTML=''; return; }
  msePlot.line(f.a,f.b,'#d64535').resid(true);
  $('mseV').textContent=stat.fmt(f.mse,2);
  $('mseTbl').innerHTML='<table class="tbl md-mt"><tr><th>연도</th><th>실젯값</th><th>예측값</th><th>오차</th><th>오차²</th></tr>'+
    P.map(([x,y])=>{const h=f.a+f.b*x, e=y-h; return `<tr><td>${x}</td><td>${y}</td><td>${stat.fmt(h,1)}</td><td>${stat.fmt(e,1)}</td><td>${stat.fmt(e*e,2)}</td></tr>`;}).join('')+'</table>';
}
onShow[3]=mseDraw;
mseDraw();

/* 04 (선택) 붓꽃 흐름도 */
orangeFlow({svg:'irisFlow',table:'irisSet',
  nodes:[{s:1,t:'Datasets',sub:'Iris',c:'Data',x:10,y:90},{s:2,t:'Data Table',sub:'내용 확인',c:'Data',x:240,y:6},
    {s:3,t:'Select Columns',sub:'petal width → sepal length',c:'Transform',x:240,y:110},{s:4,t:'Data Sampler',sub:'70%',c:'Transform',x:470,y:110},
    {s:5,t:'Linear Regression',sub:'기본 설정',c:'Model',x:470,y:214},{s:6,t:'Test and Score',sub:'Test on test data',c:'Evaluate',x:720,y:150}],
  edges:[[1,2],[1,3],[3,4],[4,6,'Data Sample · Remaining Data'],[5,6]]});

/* 05 마무리 */
const MEMOLIST=[['orderPick','처음 생각: 주문량을 정할 때 볼 데이터'],['plan','나의 계획'],['modelWhy','모델 고르기: 헷갈린 상황과 까닭'],['toolDone','오렌지3 진행 체크'],['toolDiff','노코딩 도구와 코딩 도구 비교'],['irisOr','(선택) 붓꽃 오렌지3 MSE'],['irisPy','(선택) 붓꽃 파이썬 MSE'],['irisNote','(선택) 두 도구 결과 비교'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[5]=()=>{
  $('orderShow').textContent=MEMO.orderPick?'「'+MEMO.orderPick+'」':'아직 고르지 않음';
  memoSummary('msum',MEMOLIST.filter(([k,l])=>!l.startsWith('(선택)')||String(MEMO[k]||'').trim()));
};

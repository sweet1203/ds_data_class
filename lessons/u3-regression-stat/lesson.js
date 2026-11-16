/* u3-regression-stat 전용 (rs-) */

/* 0 시작 · 처음 생각 */
chips('rsGuess','rsGuess',['중간 소득','방 개수','침실 개수','집의 나이','인구수','가구 수','위치(경도·위도)','바다와의 거리'],true);

/* 01 귀무가설·대립가설 분류 (새로 만든 주제) */
sorter('rsHypoSort',{
  cats:[{n:'귀무가설',k:'#5b6776'},{n:'대립가설',k:'#d64535'}],
  items:[
    {t:'하루 운동 시간은 학생의 수면 시간에 영향을 주지 않는다.',short:'운동 시간 → 수면 시간 (영향 없음)',c:0,ic:'🏃',w:'「영향을 주지 않는다」는 아무 관계가 없다는 기본 주장이에요.'},
    {t:'휴대폰 사용 시간이 길수록 수면 시간이 줄어든다.',short:'휴대폰 → 수면 (줄어듦)',c:1,ic:'📱',w:'「줄어든다」도 영향이 있다는 주장이에요. 방향이 감소여도 관계가 있다고 주장하면 대립가설이에요.'},
    {t:'급식 메뉴가 바뀌어도 잔반의 양은 그대로이다.',short:'급식 메뉴 → 잔반 (그대로)',c:0,ic:'🍱',w:'메뉴가 바뀌어도 변화가 없다는 주장이라, 변화나 차이가 없음을 전제로 한 가설이에요.'},
    {t:'주말과 평일의 도서관 방문자 수는 같지 않다.',short:'주말·평일 → 방문자 수 (같지 않음)',c:1,ic:'📖',w:'「같지 않다」처럼 부정어가 들어 있어도 차이가 있다고 주장하므로 대립가설이에요.'},
    {t:'비 오는 날과 맑은 날의 매점 매출은 같다.',short:'날씨 → 매점 매출 (같음)',c:0,ic:'🌧️',w:'두 경우에 차이가 없다는 것을 전제로 하는 기본 가설이에요.'},
    {t:'공부 시간과 수면 시간 가운데 적어도 하나는 시험 점수에 영향을 준다.',short:'공부·수면 → 점수 (적어도 하나)',c:1,ic:'📚',w:'독립 변수 가운데 적어도 하나가 영향을 준다는 주장으로, 표 Ⅲ-4의 집값 대립가설과 같은 꼴이에요.'},
    {t:'교실 밝기가 어떻든 학생들의 문제 풀이 속도는 같다.',short:'교실 밝기 → 풀이 속도 (같음)',c:0,ic:'💡',w:'밝기와 상관없이 같다는, 아무런 효과가 없다는 주장이에요.'},
    {t:'버스 정류장에서 가까운 상가일수록 임대료가 높다.',short:'정류장 거리 → 임대료 (높아짐)',c:1,ic:'🚌',w:'거리에 따라 임대료가 달라진다는, 관계가 있다는 주장이에요.'}
  ],
  end:'귀무가설은 「변화·차이·영향이 없다(같다)」, 대립가설은 「영향이나 관계·차이가 있다」는 주장이에요. 부정어가 있는지가 아니라, <b>달라진다</b>고 주장하는지를 봐요.'
});

/* 02 코랩 진행 · 코드 짝짓기 */
chips('rsPrepDone','rsPrepDone',['노트북 사본 만들기','housing.csv 올리기','info()로 결측치 찾기','전처리 셀 실행 (16512 4128)'],true);
sorter('rsCodeSort',{
  cats:[{n:'범주형 변수 빼기',k:'#e0702b'},{n:'결측치 채우기',k:'#2f6fd0'},{n:'독립·종속 변수 정하기',k:'#1f9d74'},{n:'훈련용·테스트용 나누기',k:'#9b4fc4'}],
  items:[
    {t:'<span class="mono">data_clean = data.drop(columns = [\'ocean_proximity\'])</span>',short:'drop ocean_proximity',c:0,ic:'🧾',w:'글자로 된 범주 열(바다와의 거리)을 지워요.'},
    {t:'<span class="mono">data_clean = data_clean.fillna(data_clean.median())</span>',short:'fillna(median)',c:1,ic:'🧾',w:'fillna는 빈칸을 채우는 함수예요. 괄호 안 median()은 열마다의 중앙값이에요.'},
    {t:'<span class="mono">X = data_clean.drop(columns = [\'median_house_value\'])</span>',short:'X = drop 집값',c:2,ic:'🧾',w:'같은 drop이지만 집값 열을 뺀 나머지를 X(독립 변수)로 만드는 줄이에요.'},
    {t:'<span class="mono">train_test_split(X, y, test_size = 0.2, random_state = 42)</span>',short:'test_size = 0.2',c:3,ic:'🧾',w:'20%를 떼어 두고 80%로 학습하게 나눠요. random_state = 42로 매번 같게 나뉘어요.'},
    {t:'(다른 데이터) <span class="mono">df = df.drop(columns = [\'학교 이름\'])</span><br><small>학교 이름은 「○○고」처럼 글자로 된 열이에요.</small>',short:'drop 학교 이름',c:0,ic:'🏫',w:'글자로 된 범주 열을 회귀분석에서 빼는 줄이에요.'}
  ],
  end:'코랩의 전처리 셀이 이 네 가지 일을 차례로 해요. 실행 뒤 <span class="mono">16512 4128</span>이 나오면 80%·20%로 잘 나뉜 거예요.'
});

/* 03 최소제곱 탐색기 (예시 점) */
const RS_P0=[[1.5,9],[2,14],[2.8,12],[3.2,19],[4,17],[4.5,24],[5.5,23],[6,30],[7,29],[8,38]];
const RS_W0=2, RS_B0=10;
let rsW=RS_W0, rsB=RS_B0, rsSq=true, rsShow=false, rsPlot=null, rsG=null;
rsPlot=scatter({svg:'rsPlot', x:[0,10,1], y:[0,50,10], xl:'중간 소득 (예시, 만 달러)', yl:'집값 (예시, 만 달러)', edit:true, max:20, color:'#2f6fd0',
  onChange(){ if(rsPlot&&rsG) rsDraw(); }});
rsG=document.createElementNS('http://www.w3.org/2000/svg','g');
rsG.setAttribute('clip-path','url(#rsPlotC)');
$('rsPlot').insertBefore(rsG,$('rsPlot').querySelector('.pts'));
const rsN=(v,d=1)=>stat.fmt(v,d);
function rsDraw(){
  const P=rsPlot.points(), X=rsPlot.X, Y=rsPlot.Y, f=stat.fit(P);
  if(rsShow&&f) rsPlot.lines([{a:rsB,b:rsW,c:'#d64535'},{a:f.a,b:f.b,c:'#16202c',dash:true}]); else rsPlot.line(rsB,rsW,'#d64535');
  let g='';
  if(rsSq) P.forEach(([x,y])=>{const yh=rsB+rsW*x, py=Y(y), ph=Y(yh), s=Math.abs(ph-py); if(s<0.5) return;
    const left=X(x)+s>X(10)?X(x)-s:X(x);
    g+=`<rect x="${left}" y="${Math.min(py,ph)}" width="${s}" height="${s}" fill="#d64535" fill-opacity=".13" stroke="#d64535" stroke-opacity=".55" stroke-width="1"/>`;});
  rsG.innerHTML=g;
  const sse=P.reduce((s,[x,y])=>s+(y-(rsB+rsW*x))**2,0), mn=f?f.mse*P.length:NaN;
  $('rsSse').textContent=P.length?rsN(sse,1):'–';
  $('rsEq').textContent=`y = ${rsN(rsW,1)}x ${rsB<0?'−':'+'} ${Math.abs(rsB).toFixed(1)}`;
  $('rsMin').textContent=rsShow&&f?rsN(mn,1):'?';
  const ratio=f&&sse>0?Math.min(1,mn/sse):0;
  $('rsBarI').style.width=(ratio*100)+'%';
  let w;
  if(!f) w='점이 2개 이상이고 가로 값이 모두 같지 않아야 직선을 계산할 수 있어요.';
  else if(sse<=mn*1.05) w='🎉 가장 작은 합에 아주 가까워요! 정사각형들이 전체적으로 가장 작아졌어요.';
  else if(sse<=mn*1.5) w='거의 다 왔어요. 기울기와 절편을 조금씩 더 바꿔 보세요.';
  else w='정사각형이 큰 점이 있어요. 그 점들 쪽으로 직선을 옮겨 보세요.';
  $('rsWord').innerHTML=w+' <span class="muted">(막대가 오른쪽 끝에 가까울수록 가장 작은 합에 가까워요)</span>';
  const orig=JSON.stringify(P.map(p=>[p[0],p[1]]))===JSON.stringify(RS_P0);
  if(f&&sse<=mn*1.05&&!rsShow&&orig){
    const rec=`기울기 ${rsN(rsW,1)}, 절편 ${rsN(rsB,1)} → 오차 제곱의 합 ${rsN(sse,1)} (가장 작은 합 ${rsN(mn,1)})`;
    if(MEMO.lsqBest!==rec){ MEMO.lsqBest=rec; store.set(MK,MEMO); }
  }
  $('rsMis').innerHTML=!orig&&!MEMO.lsqBest?'점을 옮긴 상태에서는 미션이 기록되지 않아요. 「점 처음대로」를 누르고 해 보세요.':MEMO.lsqBest?`✓ 기록: ${esc(MEMO.lsqBest)}`:'미션: 「가장 잘 맞는 직선 보기」를 누르기 전에, 슬라이더로 오차 제곱의 합을 가장 작은 합의 1.05배 안으로 줄여 보세요. 이루면 여기에 기록돼요.';
  $('rsMis').classList.toggle('ok',!!MEMO.lsqBest);
}
function rsSet(w,b){ rsW=w; rsB=b; $('rsW').value=w; $('rsB').value=b; $('rsWv').textContent=rsN(w,1); $('rsBv').textContent=rsN(b,1); rsDraw(); }
$('rsW').oninput=e=>rsSet(+e.target.value,rsB);
$('rsB').oninput=e=>rsSet(rsW,+e.target.value);
$('rsBest').onclick=()=>{ rsShow=!rsShow; $('rsBest').textContent=rsShow?'가장 잘 맞는 직선 숨기기':'가장 잘 맞는 직선 보기';
  const f=stat.fit(rsPlot.points());
  rsDraw();
  if(rsShow&&f) $('rsWord').innerHTML=`검은 점선이 최소제곱법으로 찾은 직선이에요: <b>y = ${rsN(f.b,2)}x ${f.a<0?'−':'+'} ${Math.abs(f.a).toFixed(2)}</b>. 오차 제곱의 합 ${rsN(f.mse*rsPlot.points().length,1)}보다 작은 직선은 없어요. 내 빨간 직선과 비교해 보세요.`; };
$('rsSqBtn').onclick=()=>{ rsSq=!rsSq; $('rsSqBtn').textContent=rsSq?'정사각형 숨기기':'정사각형 보기'; rsDraw(); };
$('rsAgain').onclick=()=>{ delete MEMO.lsqBest; store.set(MK,MEMO); rsShow=false; $('rsBest').textContent='가장 잘 맞는 직선 보기'; rsSet(RS_W0,RS_B0); };
$('rsPts').onclick=()=>{ rsPlot.set(RS_P0); };
rsPlot.resid(true);
rsPlot.set(RS_P0);
rsSet(RS_W0,RS_B0);

/* 04 OLS 결과표 읽기 (교과서 136쪽 출력값) */
chips('rsOlsDone','rsOlsDone',['summary 출력하기','R-squared 0.640 찾기','median_income 줄 찾기'],true);
const RS_OLS=[
  ['h','모델 전체'],
  ['Dep. Variable','median_house_value','<b>종속 변수</b>예요. 회귀분석에서 예측하려는 변수의 이름으로, 여기서는 지역의 집값(중앙값)이에요.'],
  ['Model','OLS','<b>최소제곱법</b>(Ordinary Least Squares)으로 만든 선형 회귀 모델이라는 뜻이에요. 03 탐색기에서 해 본 방법이에요.'],
  ['No. Observations','16512','학습에 쓴 데이터 수예요. 전체 20,640개 가운데 <b>훈련용 80%</b>예요.'],
  ['R-squared','0.640','<b>결정 계수</b>예요. 0에서 1 사이 값으로, 모델이 데이터를 얼마나 잘 설명하는지 나타내요. 0.640은 독립 변수들이 집값 변동의 <b>약 64%</b>를 설명한다는 뜻이에요.'],
  ['Adj. R-squared','0.640','<b>수정된 결정 계수</b>예요. 독립 변수의 개수를 고려해 조정한 값이에요. 독립 변수가 많아질수록 R-squared가 실제보다 크게 나올 수 있어서, 변수를 더했을 때 정말 성능이 나아졌는지 판단할 때 함께 봐요.'],
  ['Prob (F-statistic)','0.00','모델 전체에 대한 <b>p-값</b>이에요. 0.00은 유의 수준 0.05보다 작으니 <b>모델 전체가 통계적으로 의미가 있다</b>고 판단해요.'],
  ['h','회귀계수 (coef · P>|t|)'],
  ['const','−3.578e+06 · 0.000','<b>상수항</b>이에요. 모든 독립 변수가 0일 때의 기본값(절편)이에요. 실제로 경도·위도·소득이 모두 0인 지역은 없어서, 이 값은 직선의 높이를 맞추는 역할로 봐요.'],
  ['longitude','−4.263e+04 · 0.000','<b>경도</b>. <b>다른 변수가 같을 때</b> 경도가 1도 커지면 집값이 약 42,630달러 낮아지는 관계예요. P>|t|가 0.05보다 작아요.'],
  ['latitude','−4.245e+04 · 0.000','<b>위도</b>. <b>다른 변수가 같을 때</b> 위도가 1도 커지면 집값이 약 42,450달러 낮아지는 관계예요.'],
  ['housing_median_age','1182.8096 · 0.000','<b>주택 나이(중앙값)</b>. <b>다른 변수가 같을 때</b> 주택 나이가 1년 늘면 집값이 약 1,183달러 높아지는 관계예요.'],
  ['total_rooms','−8.1880 · 0.000','<b>방 개수</b>. <b>다른 변수가 같을 때</b> 방이 1개 늘면 집값이 약 8.19달러 낮아지는 관계예요. 방 1개라는 단위가 작아서 계수도 작게 나와요. 부호만 떼어 읽기 어려운 까닭은 표 아래 접힌 설명을 보세요.'],
  ['total_bedrooms','116.2601 · 0.000','<b>침실 개수</b>. <b>다른 변수가 같을 때</b> 침실이 1개 늘면 집값이 약 116.26달러 높아지는 관계예요.'],
  ['population','−38.4922 · 0.000','<b>인구수</b>. <b>다른 변수가 같을 때</b> 인구가 1명 늘면 집값이 약 38.49달러 낮아지는 관계예요.'],
  ['households','46.3426 · 0.000','<b>가구 수</b>. <b>다른 변수가 같을 때</b> 가구가 1개 늘면 집값이 약 46.34달러 높아지는 관계예요.'],
  ['median_income','4.054e+04 · 0.000','<b>중간 소득</b>. <b>다른 변수가 같을 때</b> 1 단위(약 만 달러) 늘면 집값이 약 <b>40,540달러 높아지는</b> 관계예요. 계수가 양수이고 P>|t|가 0.05보다 작아, 소득이 높은 지역일수록 집값이 높은 경향이 통계적으로 의미 있어요.']
];
$('rsOls').innerHTML='<tr><th>항목</th><th>값 (coef · P&gt;|t|)</th></tr>'+RS_OLS.map((r,i)=>r[0]==='h'?`<tr class="rs-h"><td colspan="2">${r[1]}</td></tr>`:`<tr data-i="${i}" tabindex="0"><td class="mono">${r[0]}</td><td class="mono">${r[1]}</td></tr>`).join('');
$('rsOls').querySelectorAll('tr[data-i]').forEach(tr=>{const f=()=>{
  $('rsOls').querySelectorAll('tr.on').forEach(x=>x.classList.remove('on')); tr.classList.add('on');
  const r=RS_OLS[+tr.dataset.i]; $('rsOlsSay').innerHTML=`<span class="mono">${r[0]}</span> = <span class="mono">${r[1]}</span><br>${r[2]}`;};
  tr.onclick=f; tr.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f();}};});

/* 05 마무리 */
const MEMOLIST=[['rsGuess','처음 생각: 집값과 관계가 클 것 같은 것'],['hypo','나의 귀무가설·대립가설과 p-값 0.02일 때'],['rsPrepDone','코랩 데이터 준비 진행'],['lsqBest','최소제곱 탐색기 기록'],['lsqHow','오차 제곱의 합을 줄인 방법'],['rsOlsDone','코랩 결과표 확인'],['olsRead','OLS 결과표 해석'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[5]=()=>{
  $('rsGuessShow').textContent=MEMO.rsGuess?'「'+MEMO.rsGuess+'」':'아직 고르지 않음';
  memoSummary('msum',MEMOLIST);
};

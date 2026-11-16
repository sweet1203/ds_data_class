/* u3-regression-ml 전용 (rm-) */

/* 0 시작 · 처음 생각 */
vote('mlPredict','mlPredict',[['선형 회귀','직선으로 예측해요'],['랜덤 포레스트','여러 결정 트리의 결과를 결합해요'],['인공신경망','여러 은닉층으로 복잡한 관계를 학습해요']]);

/* 01 지난 시간 메모 · Min-Max 스케일링 체험 (예시 값) */
(()=>{ const t=memoOf('u3-regression-stat','olsRead');
  $('rmPrev').innerHTML=t?`<b>지난 시간 내가 쓴 OLS 결과표 해석</b><p>${esc(t)}</p><small>통계적 회귀는 이렇게 p-값과 계수를 해석했어요. 오늘은 예측이 얼마나 정확한지를 비교해요.</small>`:'';
  $('rmPrev').style.display=t?'':'none'; })();
const RM_RAW=[['A',880,8.3],['B',2100,3.1],['C',1467,7.3],['D',3200,2.4],['E',2600,5.0]];
const rmF=v=>(Math.round(v*100)/100).toFixed(2);
function rmScale(rows){
  const cols=[1,2], mm=cols.map(j=>{const v=rows.map(r=>r[j]).filter(x=>typeof x==='number'); return [Math.min(...v),Math.max(...v),v.length===rows.length];});
  if(mm.some(m=>!m[2])){ $('rmScaled').innerHTML='<tr><td>칸에 숫자를 넣어 주세요.</td></tr>'; $('rmSay').textContent=''; return; }
  const sc=(v,[lo,hi])=>hi>lo?(v-lo)/(hi-lo):0;
  $('rmScaled').innerHTML='<tr><th>지역</th><th>방 개수 → 0~1</th><th>중간 소득 → 0~1</th></tr>'+
    rows.map(r=>`<tr><td>${esc(r[0])}</td>${cols.map((j,k)=>{const s=sc(r[j],mm[k]);return `<td><span class="rm-cell"><i style="width:${s*100}%"></i><b>${rmF(s)}</b></span></td>`;}).join('')}</tr>`).join('')+
    `<tr class="rm-mm"><td>최솟값 · 최댓값</td>${mm.map(m=>`<td>${m[0]} · ${m[1]}</td>`).join('')}</tr>`;
  const roomS=rows.map(r=>sc(r[1],mm[0])).sort((a,b)=>a-b);
  $('rmSay').innerHTML=roomS[roomS.length-2]<0.2
    ?'⚠️ 방 개수 하나가 아주 커서 <b>나머지 지역의 값이 모두 0 쪽으로 몰렸어요</b>. Min-Max 스케일링은 최솟값과 최댓값을 기준으로 계산해서 <b>이상치에 민감</b>하고 값이 왜곡될 수 있어요.'
    :'두 변수 모두 가장 작은 값은 <b>0</b>, 가장 큰 값은 <b>1</b>이 되었어요. 수천 단위의 방 개수와 한 자리 수의 중간 소득이 같은 범위에서 비교돼요.';
}
const rmMt=miniTable('rmRaw',{cols:['지역','방 개수','중간 소득 (만 달러)'],rows:RM_RAW,edit:[1,2],onChange:rmScale});
$('rmOut').onclick=()=>{ const r=rmMt.rows(); r[3][1]=39320; rmMt.set(r); rmScale(r); };
$('rmReset').onclick=()=>{ rmMt.set(RM_RAW); rmScale(RM_RAW); };
rmScale(RM_RAW);

/* 02 실젯값–예측값 산점도 (예시: 교과서 139쪽 R²와 비슷하게 새로 만든 값) */
const RM_ACT=[19.6,12.3,33.3,9.0,28.5,21.4,8.4,27.3,7.6,24.2,8.9,9.8,23.8,40.7,11.2,15.4,32.4,45.8,30.2,22.7,47.0,8.0,42.1,18.2,12.1,10.9,19.0,40.3,13.6,30.4,32.8,21.6,29.0,8.6,8.5,14.7];
const RM_M=[
  {n:'선형 회귀',ic:'📈',k:'#2f6fd0',p:[23.1,9.6,40.3,9.1,26.8,20.0,14.8,34.7,3,34.6,15.4,14.1,23.6,39.4,10.9,12.9,26.9,29.4,20.3,37.7,36.8,17.7,36.7,27.8,23.5,10.3,22.2,25.3,16.7,29.1,26.6,11.5,24.5,10.7,7.3,23.9],
   say:'직선 하나로 예측해서, 비싼 집은 실제보다 <b>낮게</b>, 싼 집은 <b>높게</b> 예측한 점이 많아요. 점들이 대각선 주변에 넓게 퍼져 있어요.'},
  {n:'랜덤 포레스트',ic:'🌲',k:'#1f9d74',p:[24.5,15.9,39.7,4.9,26.8,22.0,7.1,26.4,3,18.4,12.3,11.4,18.9,34.9,15.4,24.7,39.3,41.0,23.9,24.0,52,12.9,38.6,20.2,11.1,16.7,27.1,37.5,16.6,34.3,22.9,27.7,24.1,10.2,20.0,17.6],
   say:'여러 결정 트리의 예측을 결합해서, 점들이 <b>대각선에 가장 가깝게</b> 모여 있어요. 세 모델 가운데 R²가 가장 높아요.'},
  {n:'인공신경망',ic:'🧠',k:'#9b4fc4',p:[4.3,14.1,32.0,18.2,27.6,29.0,22.5,27.4,20.1,13.5,16.5,17.3,25.3,43.2,5.8,19.5,37.9,41.9,37.1,16.1,32.2,15.7,43.2,21.6,14.9,15.3,15.1,44.4,22.3,20.8,22.5,17.7,23.5,13.1,18.0,14.4],
   say:'은닉층으로 복잡한 관계를 학습하지만, 이 예시에서는 크게 빗나간 점이 꽤 있어 R²가 선형 회귀와 <b>비슷해요</b>. 데이터의 양이 적고 정형화되어 있으면 인공신경망이 꼭 유리하지는 않아요.'}
];
function rmR2(a,p){ const m=stat.mean(a); let se=0,st=0; a.forEach((v,i)=>{se+=(v-p[i])**2; st+=(v-m)**2;}); return 1-se/st; }
let rmPlot=null, rmErrOn=false; const rmSeen={};
rmPlot=scatter({svg:'rmPlot', x:[0,55,10], y:[0,55,10], xl:'실제 집값 (예시, 만 달러)', yl:'예측한 집값 (만 달러)'});
rmPlot.line(0,1,'#16202c',true);
function rmShow(i){
  const M=RM_M[i], r2=rmR2(RM_ACT,M.p);
  rmPlot.set(RM_ACT.map((v,j)=>[v,M.p[j],M.k])).line(0,1,'#16202c',true).resid(rmErrOn);
  $('rmR2').textContent=stat.fmt(r2,3); $('rmR2').style.color=M.k;
  rmSeen[i]=r2;
  bars('rmBars',RM_M.map((m,j)=>[m.n,rmSeen[j],m.k]).filter(d=>d[1]!=null),{dec:3,horiz:true,max:1,h:Object.keys(rmSeen).length*30+20});
  const left=RM_M.filter((_,j)=>rmSeen[j]==null).map(m=>m.n);
  return `<b>${M.n}</b> · ${M.say}`+(left.length?` <span class="muted">아직 안 본 모델: ${left.join(', ')}</span>`:' <span class="muted">세 모델을 모두 봤어요. 아래 메모에 비교를 적어 보세요.</span>');
}
tabs('rmTabs','rmView',RM_M,(m,i)=>rmShow(i));
$('rmErr').onclick=()=>{ rmErrOn=!rmErrOn; $('rmErr').textContent=rmErrOn?'오차 선 숨기기':'오차 선 보기'; rmPlot.resid(rmErrOn); };

/* 03 오렌지3 흐름도 (교과서 139쪽 ows: 139쪽_3단원_기계학습을 통한 회귀 분석.ows) */
orangeFlow({svg:'rmFlow', table:'rmSet',
  nodes:[
    {s:1,t:'File',sub:'housing.csv',c:'Data',x:10,y:80},
    {s:2,t:'Data Table',sub:'(선택) 보기만',c:'Data',x:220,y:0},
    {s:3,t:'Column Statistics',sub:'(선택) 결측치 확인',c:'Data',x:220,y:70},
    {s:4,t:'Impute',sub:'Average/Most frequent',c:'Transform',x:220,y:150},
    {s:5,t:'Column Statistics (1)',sub:'(선택) 채워짐 확인',c:'Data',x:430,y:110},
    {s:6,t:'Preprocess',sub:'Normalize [0, 1]',c:'Transform',x:430,y:190},
    {s:7,t:'Select Columns',sub:'target 집값',c:'Transform',x:640,y:190},
    {s:8,t:'Data Sampler',sub:'80 % · Replicable',c:'Transform',x:10,y:320},
    {s:9,t:'Neural Network',sub:'100,50 · 500번',c:'Model',x:220,y:400},
    {s:10,t:'Random Forest',sub:'트리 100개',c:'Model',x:220,y:470},
    {s:11,t:'Linear Regression',sub:'No regularization',c:'Model',x:220,y:540},
    {s:12,t:'Test and Score',sub:'Test on test data',c:'Evaluate',x:430,y:320}
  ],
  edges:[[1,2],[1,3],[1,4],[4,5],[4,6],[6,7],[7,8],[8,12,'Data Sample · Remaining Data'],[8,9],[8,10],[8,11],[9,12],[10,12],[11,12]]});
chips('rmDone','rmDone',['housing.csv 열기','Impute로 결측치 채우기','Preprocess로 0~1','Select Columns·Data Sampler','세 모델 연결','Test on test data로 R2 보기'],true);

/* 04 회귀분석 정리 */
sorter('rmVarSort',{
  cats:[{n:'독립 변수',k:'#2f6fd0'},{n:'종속 변수',k:'#d64535'}],
  items:[
    {t:'카페의 「아메리카노 판매량 예측」 회귀 모델에 들어가는 「내일 최고 기온」',short:'카페 · 최고 기온',c:0,ic:'☕',w:'판매량을 설명하는 데 쓰는 값이라 독립 변수예요.'},
    {t:'택배 회사의 「배송 시간 예측」 회귀 모델에 들어가는 「배송에 걸린 시간」',short:'택배 · 배송 시간',c:1,ic:'📦',w:'모델이 나타내려는 결과라 종속 변수예요.'},
    {t:'도서관의 「주말 방문자 수 예측」 회귀 모델에 들어가는 「시험 기간인지 여부」',short:'도서관 · 시험 기간 여부',c:0,ic:'📚',w:'방문자 수에 영향을 줄 수 있는 값이라 독립 변수예요.'},
    {t:'농장의 「사과 수확량 예측」 회귀 모델에 들어가는 「올해 사과 수확량」',short:'농장 · 사과 수확량',c:1,ic:'🍎',w:'모델이 나타내려는 결과라 종속 변수예요.'},
    {t:'택배 회사의 「배송 시간 예측」 회귀 모델에 들어가는 「한 번에 싣는 물건 개수」',short:'택배 · 물건 개수',c:0,ic:'🚚',w:'배송 시간을 설명하는 쪽의 값이라 독립 변수예요.'},
    {t:'카페의 「아메리카노 판매량 예측」 회귀 모델에 들어가는 「내일 아메리카노 판매량」',short:'카페 · 판매량',c:1,ic:'🥤',w:'모델이 나타내려는 결과라 종속 변수예요.'},
    {t:'농장의 「사과 수확량 예측」 회귀 모델에 들어가는 「여름철 일조 시간」',short:'농장 · 일조 시간',c:0,ic:'☀️',w:'수확량을 설명하는 값이라 독립 변수예요.'},
    {t:'도서관의 「주말 방문자 수 예측」 회귀 모델에 들어가는 「주말 방문자 수」',short:'도서관 · 방문자 수',c:1,ic:'🧑‍🤝‍🧑',w:'모델이 나타내려는 결과라 종속 변수예요.'}
  ],
  end:'예측하거나 설명하려는 결과가 <b>종속 변수</b>(y), 그 결과에 영향을 줄 수 있는 값이 <b>독립 변수</b>(x)예요. 회귀 모델은 독립 변수로 종속 변수를 나타내는 식이에요.'
});
chips('mlSelf','mlSelf',['자료에서 예측할 값과 쓰는 값을 나누어 회귀 모델을 세울 수 있다','통계적 회귀와 기계학습 회귀의 결과를 각각 읽고 해석할 수 있다','친구의 다른 해석을 듣고 내 분석을 고쳐 나갈 수 있다'],true);

/* 04 나의 계획 점검 */
function rmPlans(){ const p1=memoOf('u3-model','plan'), p2=memoOf('u3-regression','plan'), none='(이 기기에 적어 둔 계획이 없어요. 떠올려서 아래에 적어요.)';
  $('rmPlan1').textContent=p1||none; $('rmPlan2').textContent=p2||none; }
rmPlans(); onShow[4]=rmPlans;

/* 05 마무리 */
const MEMOLIST=[['mlPredict','처음 생각: 예측을 가장 잘할 모델'],['mlCompare','실젯값–예측값 산점도 비교'],['rmDone','오렌지3 진행 체크'],['mlR2Lin','오렌지3 R2: 선형 회귀'],['mlR2Rf','오렌지3 R2: 랜덤 포레스트'],['mlR2Nn','오렌지3 R2: 인공신경망'],['mlBest','가장 높은 모델과 해석'],['planCheck','나의 계획 점검 · 두 회귀분석 비교'],['mlSelf','내 실력 점검'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[5]=()=>{
  $('rmPredShow').textContent=MEMO.mlPredict?'「'+MEMO.mlPredict+'」':'아직 고르지 않음';
  memoSummary('msum',MEMOLIST);
};

/* u4-movie-2 전용 (mv2-) — 공용 부품 orangeFlow · scatter · miniTable · sorter · vote · chips 사용 */

/* 0 시작 · 언제 예측할까 */
vote('m2When','m2When',[['개봉 전','홍보·상영관 계획에 쓰기'],['개봉 첫 주 뒤','상영을 늘릴지 정하기'],['상영이 끝난 뒤','결과를 정리하고 비교하기']]);

/* 01 그 속성, 언제 알 수 있을까 */
sorter('m2TimeSort',{
  cats:[{n:'개봉 전에 알 수 있음',k:'#1f9d74'},{n:'개봉한 뒤에 쌓임',k:'#d64535'}],
  items:[
    {t:'영화가 극장에 걸리는 <b>개봉일</b>',short:'개봉일',c:0,ic:'📅',w:'개봉일은 홍보를 시작할 때 이미 정해져 있어요.'},
    {t:'영화를 극장에 공급하는 <b>배급사</b>',short:'배급사',c:0,ic:'🏢',w:'배급사는 개봉 전에 계약으로 정해져요.'},
    {t:'영화를 만든 나라를 나타내는 <b>대표 국적</b>',short:'대표 국적',c:0,ic:'🌏',w:'제작 단계에서 정해지는 정보라 개봉 전에 알 수 있어요.'},
    {t:'관람한 사람이 매긴 <b>실관람객 평점 참여자 수</b>',short:'실관람객 평점 참여자 수',c:1,ic:'🙋',w:'영화를 본 관객이 평점을 매겨야 늘어나므로 상영이 이어질수록 쌓여요.'},
    {t:'극장에서 영화를 튼 <b>상영 횟수</b>',short:'상영 횟수',c:1,ic:'🎞️',w:'상영 횟수는 상영 기간 동안 더해지는 기록이에요. 관객이 많을수록 상영도 늘어나요.'},
    {t:'표를 판 금액을 모은 <b>매출액</b>',short:'매출액',c:1,ic:'💰',w:'관객이 표를 사야 생기는 값이라 관객 수와 거의 같은 정보를 담고 있어요.'}
  ],
  end:'<b>정리</b> 개봉 전에 예측하려면 그때 알 수 있는 속성만 써야 해요. 상영 뒤에 쌓이는 기록을 넣으면 숫자는 좋아 보여도, 정작 필요한 때에는 쓸 수 없는 모델이 돼요.'
});

/* 02 관객 수 예측 평가실 — 지어낸 예시 영화 8편 (만 명) */
const M2_NAME=['가','나','다','라','마','바','사','아'].map(s=>'예시 영화 '+s);
const M2_Y=[18,42,65,96,130,210,340,620];
const M2_PRE={
  '예측 A':[30,35,80,110,120,250,300,560],
  '예측 B':[60,70,40,150,90,180,420,450],
  '모두 평균으로':null
};
const m2Plot=scatter({svg:'m2Plot', x:[0,700,100], y:[0,700,100], xl:'실젯값 (만 명)', yl:'예측값 (만 명)', dec:0, color:'#2f6fd0'});
m2Plot.line(0,1,'#8a94a3',true);
const m2Tbl=miniTable('m2Tbl',{cols:['영화','실젯값 (만 명)','예측값 (만 명)'], rows:M2_NAME.map((n,i)=>[n,M2_Y[i],M2_PRE['예측 A'][i]]), edit:[1,2], onChange:m2Calc});
function m2Rows(name){
  const p=M2_PRE[name]||M2_Y.map(()=>Math.round(stat.mean(M2_Y)*1000)/1000);
  return M2_NAME.map((n,i)=>[n,M2_Y[i],p[i]]);
}
function m2Calc(rows){
  const R=rows.filter(r=>typeof r[1]==='number'&&typeof r[2]==='number');
  const y=R.map(r=>r[1]), p=R.map(r=>r[2]), n=R.length;
  m2Plot.set(R.map(r=>[r[1],r[2]]));
  if(n<2){ $('m2Met').innerHTML='<div>숫자를 두 개 이상 넣어 주세요.</div>'; $('m2Err').innerHTML=''; $('m2Say').innerHTML=''; return; }
  const e=y.map((v,i)=>v-p[i]), mse=stat.mean(e.map(v=>v*v)), my=stat.mean(y), st=y.reduce((s,v)=>s+(v-my)**2,0);
  const mae=stat.mean(e.map(Math.abs)), r2=st?1-mse*n/st:NaN, zero=y.some(v=>v===0), mape=zero?NaN:stat.mean(e.map((v,i)=>Math.abs(v)/Math.abs(y[i])));
  const f1=v=>stat.fmt(v,1);
  $('m2Err').innerHTML='<tr><th>영화</th><th>오차 (실젯값−예측값)</th><th>오차²</th><th>|오차| ÷ 실젯값</th></tr>'+R.map((r,i)=>`<tr><td>${esc(r[0])}</td><td>${f1(e[i])}</td><td>${f1(e[i]*e[i])}</td><td>${y[i]===0?'나눌 수 없음':stat.fmt(Math.abs(e[i])/Math.abs(y[i]),3)}</td></tr>`).join('');
  $('m2Met').innerHTML=`<div>MSE <b>${f1(mse)}</b> <small>(만 명)²</small></div><div>RMSE <b>${stat.fmt(Math.sqrt(mse),2)}</b> <small>만 명</small></div><div>MAE <b>${stat.fmt(mae,2)}</b> <small>만 명</small></div><div>MAPE <b>${zero?'계산 불가':stat.fmt(mape,3)}</b>${zero?' <small>실젯값 0</small>':` <small>약 ${(mape*100).toFixed(1)}%</small>`}</div><div>R² <b>${stat.fmt(r2,3)}</b></div>`;
  let say='';
  if(zero) say='실젯값이 0인 영화가 있어서 MAPE는 나눗셈을 할 수 없어요. 다른 지표는 그대로 계산돼요.';
  else if(!isNaN(r2)&&Math.abs(r2)<1e-9) say='모든 예측값이 실젯값의 평균과 같으면 R²는 0이에요. R²는 「평균으로만 찍는 것」보다 얼마나 나은지를 보여 줘요.';
  else if(!isNaN(r2)&&r2>0.9&&mape>0.15) say=`R²는 ${stat.fmt(r2,3)}로 1에 가깝지만, 예측값은 실젯값에서 평균 약 ${(mape*100).toFixed(0)}% 벗어나 있어요. R²를 「${(r2*100).toFixed(1)}% 맞혔다」로 읽으면 안 되는 까닭이에요.`;
  else if(!isNaN(r2)&&r2<0) say='R²가 0보다 작아요. 모든 영화를 평균값으로 예측하는 것보다도 못한 예측이라는 뜻이에요.';
  $('m2Say').innerHTML=say;
}
$('m2Preset').innerHTML=Object.keys(M2_PRE).map(k=>`<button class="btn ghost sm" data-k="${k}">${k}</button>`).join('')+'<button class="btn ghost sm" data-k="small">예측 A · 가 영화 실젯값 2로</button>';
$('m2Preset').querySelectorAll('button').forEach(b=>b.onclick=()=>{
  let rows;
  if(b.dataset.k==='small'){ rows=m2Rows('예측 A'); rows[0][1]=2; }   /* 예측 A 기준으로 고정 */
  else rows=m2Rows(b.dataset.k);
  m2Tbl.set(rows); m2Calc(rows);
  $('m2Preset').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
});
$('m2Preset').querySelector('button').classList.add('on');
m2Calc(m2Tbl.rows());

/* 03 오렌지3 흐름도 + 설정 표 + 진행 칩 */
orangeFlow({svg:'m2Flow', table:'m2Set',
  nodes:[
    {s:1,t:'File',sub:'영화 데이터.xlsx',c:'Data',x:10,y:100},
    {s:2,t:'Group by',sub:'영화명 → 143',c:'Transform',x:220,y:100},
    {s:3,t:'Select Columns',sub:'Target 관객 수',c:'Transform',x:430,y:100},
    {s:4,t:'Data Sampler',sub:'80 % · Replicable',c:'Transform',x:640,y:100},
    {s:5,t:'Linear Regression',sub:'No regularization',c:'Model',x:870,y:10},
    {s:6,t:'Predictions',sub:'평가 지표 보기',c:'Evaluate',x:1100,y:100}
  ],
  edges:[[1,2],[2,3],[3,4],[4,5,'Data Sample'],[4,6,'Remaining Data'],[5,6,'Model']],
  done:{box:'m2Done', key:'m2Done', items:['Group by 143','Select Columns Target','Data Sampler 115 | 28','Linear Regression','Predictions 지표 보기','상영 횟수 빼고 다시 보기']}});

/* 04 프로젝트 정리 (교과서 209쪽 과정) */
chips('m2Self','m2Self',['문제 정의','데이터 수집','데이터 전처리','데이터 시각화와 분석','데이터 모델링','평가'],true);

/* 05 마무리 */
const MEMOLIST=[['m2When','처음 생각: 관객 수를 예측하고 싶은 때'],['m2Attr','예측 시점에 쓸 수 있는 속성 · 쓸 수 없는 속성'],['m2Eval','평가실 지표 비교와 해석'],['m2Done','오렌지3 진행 체크'],['m2Run','오렌지3 평가 지표 · 상영 횟수를 뺀 결과'],['m2Self','프로젝트에서 잘 기여한 단계'],['m2Look','배운 점 · 느낀 점 · 더 알아보고 싶은 질문'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[1]=()=>{ $('m2WhenShow').textContent=MEMO.m2When?'「'+MEMO.m2When+'」':'아직 고르지 않음 — 시작 화면에서 골라요'; };
onShow[5]=()=>memoSummary('msum',MEMOLIST);

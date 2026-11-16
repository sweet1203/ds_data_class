/* u4-stress-2 전용 (st2-) — 공용 부품 orangeFlow · scatter · bars · stat · sorter · vote 사용 */

/* 0 시작 · 처음 생각 */
const S2_GUESS=[['sleep','수면 시간'],['exercise','운동 시간'],['electronic_device_usage','전자 기기 사용 시간']];
vote('s2Guess','s2Guess',S2_GUESS);

/* 01 오렌지3 흐름도 A: 분포 · 상관 */
orangeFlow({svg:'s2FlowA', table:'s2SetA',
  nodes:[
    {s:1,t:'Select Rows',sub:'지난 시간 · 65개',c:'Transform',x:10,y:80},
    {s:2,t:'Preprocess',sub:'Normalize [0, 1]',c:'Transform',x:240,y:80},
    {s:3,t:'Distributions',sub:'속성별 분포',c:'Visualize',x:470,y:20},
    {s:4,t:'Correlations',sub:'Pearson',c:'Unsupervised',x:470,y:140}
  ],
  edges:[[1,2,'Matching Data'],[2,3],[2,4]],
  done:{box:'s2DoneA', key:'s2DoneA', items:['지난 흐름도 열기','Distributions 네 속성','Correlations 순서 확인']}});

/* 01 확인용 집계값 — 교과서 예제 데이터(이상치 처리 후 65개, 0~1 정규화)로 계산한 값. 행 데이터는 싣지 않음 */
const S2_DIST={
  stress:{c:[13,23,18,11],say:'0.25~0.5 구간이 가장 많고, 0.25~0.75 구간에 41명으로 절반이 넘어요.'},
  sleep:{c:[21,18,19,7],say:'0~0.5 구간 39명이 0.5~1 구간 26명보다 많아요.'},
  exercise:{c:[21,18,18,8],say:'0~0.5 구간 39명이 0.5~1 구간 26명보다 많아요.'},
  electronic_device_usage:{c:[10,42,7,6],say:'0~0.5 구간 52명이 0.5~1 구간 13명보다 훨씬 많아요.'}
};
const S2_CORR=[['stress · sleep',-0.622],['stress · exercise',-0.490],['sleep · exercise',0.229],['sleep · e_d_usage',-0.167],['stress · e_d_usage',0.076],['exercise · e_d_usage',-0.008]];
let s2DistNow='stress';
function s2DrawDist(){
  const D=S2_DIST[s2DistNow];
  bars('s2Dist',['0~0.25','0.25~0.5','0.5~0.75','0.75~1'].map((k,i)=>[k,D.c[i],'#c98a00']),{dec:0,max:45,h:220});
  $('s2DistSay').innerHTML=`<b>${s2DistNow}</b> · ${D.say}`;
  $('s2DistBtn').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.k===s2DistNow));
}
$('s2DistBtn').innerHTML=Object.keys(S2_DIST).map(k=>`<button class="btn ghost sm" data-k="${k}">${k}</button>`).join('');
$('s2DistBtn').querySelectorAll('button').forEach(b=>b.onclick=()=>{s2DistNow=b.dataset.k; s2DrawDist();});
s2DrawDist();
bars('s2Corr',S2_CORR.map(([k,v])=>[`${k} (${v<0?'−':'+'})`,Math.abs(v),v<0?'#2f6fd0':'#d64535']),{dec:3,horiz:true,max:1,left:190,w:480});

/* 01 이 데이터로 말할 수 있을까? */
sorter('s2Claim',{
  cats:[{n:'이 데이터로 말할 수 있어요',k:'#1f9d74'},{n:'더 확인해야 해요',k:'#d64535'}],
  items:[
    {t:'수면 시간과 스트레스 지수의 상관계수는 음수이다.',short:'상관계수 부호',c:0,ic:'📉',w:'Correlations에서 −0.622로 계산된 값이라 이 데이터에서 확인한 사실이에요.'},
    {t:'이 65명 자료에서 전자 기기 사용 시간과 스트레스 지수의 상관계수는 0에 가깝다.',short:'전자 기기와 스트레스',c:0,ic:'📱',w:'0.076으로 계산되어 이 자료 안에서는 함께 움직이는 경향이 거의 없다고 말할 수 있어요.'},
    {t:'잠을 한 시간 더 자게 하면 스트레스 지수가 내려간다.',short:'잠을 늘리면?',c:1,ic:'😴',w:'함께 움직이는 경향은 원인을 알려 주지 않아요. 직접 바꿔 보는 실험처럼 다른 근거가 더 필요해요.'},
    {t:'운동 시간을 늘리면 스트레스가 줄어든다.',short:'운동을 늘리면?',c:1,ic:'🏃',w:'운동을 많이 하는 학생이 원래 여유 시간이 많을 수도 있어요. 상관계수만으로는 영향을 단정할 수 없어요.'},
    {t:'이 결과는 전국의 고등학생에게 그대로 들어맞는다.',short:'전국 고등학생에게?',c:1,ic:'🗺️',w:'특정 학생들에게 모은 자료라서, 다른 집단에 넓혀 말하려면 더 넓게 모은 데이터가 필요해요.'},
    {t:'스트레스가 높아서 잠을 못 자는 것인지, 잠이 부족해서 스트레스가 높은 것인지 이 계수로 가릴 수 있다.',short:'어느 쪽이 먼저?',c:1,ic:'🔁',w:'상관계수는 방향(무엇이 먼저인지)을 알려 주지 않아요. 같은 −0.622가 두 경우 모두에서 나올 수 있어요.'}
  ],
  end:'<b>정리</b> 상관계수로는 <b>함께 움직이는 경향</b>까지 말할 수 있어요. 무엇이 원인인지, 다른 학생들에게도 맞는지는 <b>더 확인</b>해야 해요.'
});

/* 02 모델 비교실 — 예시 학생 8명 (지어낸 고정값). 두 평가 자료에서 모델의 오차(예측값 − 실젯값)는 같게 둠 */
const S2_SETS=[
  {n:'㉮ 넓게 퍼진 평가 자료',y:[6,10,14,17,21,25,30,35]},
  {n:'㉯ 좁게 퍼진 평가 자료',y:[12,14,15,17,18,20,21,23]}
];
const S2_ERR={A:[3,-2,4,-3,2,-4,3,-2], B:[5,3,2,-1,-2,-3,-4,-5], C:[0,1,-1,9,0,-1,1,-10]};
const S2_MODELS=[
  {k:'A',n:'모델 A',col:'#1f9d74'},{k:'B',n:'모델 B',col:'#2f6fd0'},{k:'C',n:'모델 C',col:'#9b4fc4'},
  {k:'M',n:'평균만 말하기',col:'#5b6776'},{k:'U',n:'내 예측',col:'#e0702b'}
];
let s2SetNow=0, s2Now='A', s2Mine=[];
const s2Y=()=>S2_SETS[s2SetNow].y;
function s2Pred(k){
  const y=s2Y();
  if(k==='M'){ const m=stat.mean(y); return y.map(()=>m); }
  if(k==='U') return s2Mine.slice();
  return y.map((v,i)=>v+S2_ERR[k][i]);
}
function s2Score(k){
  const y=s2Y(), p=s2Pred(k);
  if(p.some(v=>v===''||isNaN(v))) return null;
  const e=stat.err(p.map((v,i)=>[v,y[i]]),0,1);   /* 점 [예측값, 실젯값], 직선 y = x → 실젯값과 예측값의 오차 */
  const sse=e.mse*y.length, my=stat.mean(y), sst=y.reduce((s,v)=>s+(v-my)**2,0), mae=stat.mean(p.map((v,i)=>Math.abs(v-y[i])));
  return {...e,sse,sst,mae};
}
const s2N=(v,d=2)=>stat.fmt(v,d);
const s2Plot=scatter({svg:'s2Plot', x:[0,40,10], y:[0,40,10], xl:'실젯값 (스트레스 지수, 예시)', yl:'예측값 (예시)'});
function s2Draw(){
  const y=s2Y(), M=S2_MODELS.find(m=>m.k===s2Now), p=s2Pred(s2Now), S=s2Score(s2Now);
  s2Plot.set(y.map((v,i)=>[v,p[i],M.col]).filter(q=>!isNaN(q[1])&&q[1]!=='')); s2Plot.line(0,1,'#8a94a3',true); s2Plot.resid(true);
  if(S){
    $('s2Mse').textContent=s2N(S.mse); $('s2Rmse').textContent=s2N(S.rmse); $('s2R2').textContent=s2N(S.r2,3);
    $('s2Calc').innerHTML=`<b>${M.n}</b> · 오차 제곱의 합 <b>${s2N(S.sse)}</b> ÷ ${y.length}명 = MSE <b>${s2N(S.mse)}</b><br>`+
      `실젯값 평균 ${s2N(stat.mean(y))}, 평균에서 떨어진 거리 제곱의 합 <b>${s2N(S.sst)}</b><br>R² = 1 − ${s2N(S.sse)} ÷ ${s2N(S.sst)} = <b>${s2N(S.r2,3)}</b>`+
      (S.r2<-1e-9?'<br>R²가 0보다 작아요. 평균만 말하는 것보다 오차가 더 크다는 뜻이에요.':Math.abs(S.r2)<1e-9?'<br>평균만 말하면 오차 제곱의 합이 평균에서 떨어진 거리 제곱의 합과 같아서 R²가 0이에요.':'');
  }else{ $('s2Mse').textContent=$('s2Rmse').textContent=$('s2R2').textContent='—'; $('s2Calc').textContent='「내 예측」 칸을 숫자로 모두 채워 주세요.'; }
  /* 값 표 */
  const cols=S2_MODELS, cell=v=>Number.isInteger(v)?v:s2N(v);
  $('s2Tbl').innerHTML=`<tr><th>예시 학생</th>${y.map((_,i)=>`<th>${i+1}</th>`).join('')}</tr>`+
    `<tr class="act"><td>실젯값</td>${y.map(v=>`<td>${v}</td>`).join('')}</tr>`+
    cols.map(m=>`<tr class="${m.k===s2Now?'cur':''}"><td style="color:${m.col}">${m.n}</td>${s2Pred(m.k).map((v,i)=>m.k==='U'?`<td><input type="number" class="st2-in" data-i="${i}" value="${v}" aria-label="내 예측 ${i+1}번"></td>`:`<td>${cell(v)}</td>`).join('')}</tr>`).join('')+
    (s2Now!=='U'&&S?`<tr class="err"><td>${M.n} 오차</td>${p.map((v,i)=>`<td>${(v-y[i]>0?'+':v-y[i]<0?'−':'')+s2N(Math.abs(v-y[i]),s2Now==='M'?2:0)}</td>`).join('')}</tr>`:'');
  $('s2Tbl').querySelectorAll('.st2-in').forEach(inp=>inp.oninput=()=>{const v=inp.value.trim(); s2Mine[+inp.dataset.i]=v===''?'':+v; s2Side();});
  s2Side();
}
function s2Side(){
  /* 내 예측만 바뀔 때는 표를 다시 그리지 않음(입력 중 커서 유지) */
  const y=s2Y(), M=S2_MODELS.find(m=>m.k===s2Now);
  if(s2Now==='U'){ const p=s2Pred('U'), S=s2Score('U');
    s2Plot.set(y.map((v,i)=>[v,p[i],M.col]).filter(q=>q[1]!==''&&!isNaN(q[1])));
    if(S){ $('s2Mse').textContent=s2N(S.mse); $('s2Rmse').textContent=s2N(S.rmse); $('s2R2').textContent=s2N(S.r2,3);
      $('s2Calc').innerHTML=`<b>내 예측</b> · 오차 제곱의 합 <b>${s2N(S.sse)}</b> ÷ ${y.length}명 = MSE <b>${s2N(S.mse)}</b><br>R² = 1 − ${s2N(S.sse)} ÷ ${s2N(S.sst)} = <b>${s2N(S.r2,3)}</b>`; }
    else{ $('s2Mse').textContent=$('s2Rmse').textContent=$('s2R2').textContent='—'; $('s2Calc').textContent='「내 예측」 칸을 숫자로 모두 채워 주세요.'; }
  }
  const all=S2_MODELS.map(m=>({m,S:s2Score(m.k)})), ok=all.filter(x=>x.S);
  /* 가장 좋은 값(같으면 모두)에 ★ */
  const best=(f,dir)=>{ if(!ok.length) return []; const v=dir>0?Math.max(...ok.map(x=>x.S[f])):Math.min(...ok.map(x=>x.S[f])); return ok.filter(x=>Math.abs(x.S[f]-v)<1e-9).map(x=>x.m.k); };
  const bm=best('mse',-1), br=best('rmse',-1), ba=best('mae',-1), b2=best('r2',1);
  $('s2Score').innerHTML=`<tr><th>${S2_SETS[s2SetNow].n}</th><th>MSE</th><th>RMSE</th><th>MAE</th><th>R²</th></tr>`+
    all.map(({m,S})=>`<tr class="${m.k===s2Now?'cur':''}"><td style="color:${m.col};font-weight:900">${m.n}</td>`+
      (S?`<td>${s2N(S.mse)}${bm.includes(m.k)?' ★':''}</td><td>${s2N(S.rmse)}${br.includes(m.k)?' ★':''}</td><td>${s2N(S.mae)}${ba.includes(m.k)?' ★':''}</td><td>${s2N(S.r2,3)}${b2.includes(m.k)?' ★':''}</td>`:'<td colspan="4">칸을 채우면 계산돼요</td>')+'</tr>').join('');
}
function s2Reset(){ const m=Math.round(stat.mean(s2Y())); s2Mine=s2Y().map(()=>m); }
$('s2Set').innerHTML=S2_SETS.map((s,i)=>`<button class="btn ghost sm" data-i="${i}">${s.n}</button>`).join('');
$('s2Set').querySelectorAll('button').forEach(b=>b.onclick=()=>{s2SetNow=+b.dataset.i; s2Reset(); s2Btns(); s2Draw();});
$('s2Pick').innerHTML=S2_MODELS.map(m=>`<button class="btn ghost sm" data-k="${m.k}">${m.n}</button>`).join('');
$('s2Pick').querySelectorAll('button').forEach(b=>b.onclick=()=>{s2Now=b.dataset.k; s2Btns(); s2Draw();});
function s2Btns(){
  $('s2Set').querySelectorAll('button').forEach((b,i)=>b.classList.toggle('on',i===s2SetNow));
  $('s2Pick').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.k===s2Now));
}
s2Reset(); s2Btns(); s2Draw();

/* 03 오렌지3 흐름도 B: 모델링 · 평가 */
orangeFlow({svg:'s2FlowB', table:'s2SetB',
  nodes:[
    {s:1,t:'Select Rows',sub:'65개',c:'Transform',x:10,y:150},
    {s:2,t:'Preprocess',sub:'Normalize [0, 1]',c:'Transform',x:240,y:10},
    {s:3,t:'Select Columns',sub:'feature 3 · target stress',c:'Transform',x:240,y:150},
    {s:4,t:'Data Sampler',sub:'70% · Replicable',c:'Transform',x:470,y:150},
    {s:5,t:'Linear Regression',sub:'',c:'Model',x:700,y:10},
    {s:6,t:'Random Forest',sub:'Replicable training',c:'Model',x:700,y:80},
    {s:7,t:'kNN',sub:'',c:'Model',x:700,y:220},
    {s:8,t:'SVM',sub:'',c:'Model',x:700,y:290},
    {s:9,t:'Test and Score',sub:'Test on test data',c:'Evaluate',x:950,y:150}
  ],
  edges:[[1,2],[1,3],[3,4],[4,9,'Data Sample · Remaining Data'],[2,9,'Preprocessor'],[5,9],[6,9],[7,9],[8,9]],
  done:{box:'s2DoneB', key:'s2DoneB', items:['Select Columns','Data Sampler 70%','모델 4개 잇기','Test Data · Preprocessor 잇기','Test on test data','결과 기록']}});

/* 06 마무리 */
const MEMOLIST=[['s2Guess','처음 생각: 스트레스 지수와 가장 관계가 클 것 같은 속성'],['s2DoneA','오렌지3 진행 체크(분포 · 상관)'],['s2Corr','상관관계 해석과 한계'],['s2Pick','모델 비교실: 고른 모델과 근거'],['s2Spread','모델 비교실: ㉮ → ㉯에서 달라진 것'],['s2DoneB','오렌지3 진행 체크(모델링 · 평가)'],['s2Best','MSE가 가장 작은 모델'],['s2R2','Linear Regression의 R²'],['s2Eval','평가 결과 해석'],['s2Reflect','프로젝트 되돌아보기'],['s2KeyQ','오늘의 질문에 대한 내 답']];
const s2GuessText=()=>{const g=S2_GUESS.find(x=>x[0]===MEMO.s2Guess); return g?`「${g[0]} (${g[1]})」`:'아직 고르지 않음';};
onShow[1]=()=>{ $('s2GuessShow1').textContent=s2GuessText(); };
onShow[6]=()=>{
  $('s2GuessShow').textContent=s2GuessText();
  memoSummary('msum',MEMOLIST);
};

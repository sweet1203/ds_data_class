/* u3-review 전용 (rv-) — 그림·계산은 공용 부품(scatter·stat·bars·miniTable·orangeFlow) */

/* 0 시작 · 역할 */
chips('myRole','myRole',['팀장','기술자','기록자','발표 담당'],false);

/* 01 문제 정의 */
chips('method','method',['회귀분석','군집 분석','연관분석'],false);

/* 가상 성적 20명 (지어낸 예시): [공통 과목1, 공통 과목2], 선택 과목 물리학·화학·경제·세계사 (1 선택, 0 안 함) */
const RV_SUB=['물리학','화학','경제','세계사'];
const RV_P=[[88,92],[92,85],[85,88],[95,94],[90,90],[83,86],[89,95],[70,68],[65,72],[72,75],[68,64],[75,70],[62,66],[70,61],[45,52],[52,48],[40,45],[55,58],[48,40],[50,55]];
const RV_S=['1100','1100','1110','1100','0011','1100','0011','0011','1010','0011','1100','0111','0011','1100','0011','0101','1100','0011','1001','0011'].map(s=>s.split('').map(Number));

/* 02 가상 성적표 일부 → 연관분석용 1/0 표 */
const RV_RAW=[[85,90,'',''],[78,88,'',''],[70,82,75,''],[96,93,'',''],['','',84,88]];
miniTable('rawTbl',{cols:['학생','공통 과목1','공통 과목2',...RV_SUB],rows:RV_RAW.map((r,i)=>[i+1+'번',RV_P[i][0],RV_P[i][1],...r.map(v=>v===''?'<span class="rv-blank">빈칸</span>':v)])});
const RV_BIN0=RV_RAW.map((_,i)=>[i+1+'번','','','','']);
const binTbl=miniTable('binTbl',{cols:['학생',...RV_SUB],rows:RV_BIN0,edit:[1,2,3,4]});
$('binCheck').onclick=()=>{
  const rows=binTbl.rows(); let ok=0, empty=0; const bad=[];
  $('binTbl').querySelectorAll('tr[data-i]').forEach(tr=>{const i=+tr.dataset.i;
    tr.querySelectorAll('.mt-in').forEach(inp=>{const j=+inp.dataset.j, v=rows[i][j], want=RV_RAW[i][j-1]===''?0:1;
      if(v===''){empty++; inp.classList.remove('rv-ok','rv-ng'); return;}
      const right=v===want; if(right) ok++; else bad.push(`${i+1}번 ${RV_SUB[j-1]}`);
      inp.classList.toggle('rv-ok',right); inp.classList.toggle('rv-ng',!right);});});
  $('binSay').innerHTML=`20칸 중 <b>${ok}칸</b> 맞았어요.`+(empty?` 빈칸이 ${empty}개 남았어요.`:'')+(bad.length?` 다시 볼 칸: ${bad.join(', ')}. 점수가 있으면 1, 빈칸이면 0이에요.`:ok===20?' 모두 맞았어요! 이 표가 연관분석에 쓰는 거래 데이터 모양이에요.':'');
};
$('binReset').onclick=()=>{binTbl.set(RV_BIN0); $('binSay').textContent='20칸을 모두 채우고 확인을 눌러 보세요.';};

/* 03 세 분석 한눈에 */
/* 회귀 */
const regPlot=scatter({svg:'regPlot',x:[30,100,10],y:[30,100,10],xl:'공통 과목1 (점, 예시)',yl:'공통 과목2 (점, 예시)',color:'#2f6fd0'});
const RV_FIT=stat.fit(RV_P);
regPlot.set(RV_P).line(RV_FIT.a,RV_FIT.b,'#d64535');
$('regEq').innerHTML=`공통 과목2 = <b>${stat.fmt(RV_FIT.b,2)}</b> × 공통 과목1 + <b>${stat.fmt(RV_FIT.a,1)}</b>`;
$('regR2').textContent=stat.fmt(RV_FIT.r2,2); $('regMse').textContent=stat.fmt(RV_FIT.mse,1);
function regPred(){const x=+$('regX').value, y=RV_FIT.a+RV_FIT.b*x; $('regXv').textContent=x; regPlot.centers([[x,y]]);
  $('regPred').innerHTML=`공통 과목1이 <b>${x}점</b>인 학생의 공통 과목2 예측 점수는 약 <b>${stat.fmt(y,1)}점</b>이에요.`;}
$('regX').oninput=regPred; regPred();
/* 군집: 고정된 시작 중심 20벌(정해진 수열로 고름)마다 할당·중심 이동을 멈출 때까지 반복 → 군집 안 거리 제곱합(SSE)이 가장 작은 결과.
   군집 번호는 중심의 점수 합 순서로 다시 붙임(늘 같은 결과) */
function rvRun(P,C){let L=stat.assign(P,C); for(let t=0;t<50;t++){C=stat.center(P,L,C); const L2=stat.assign(P,C); if(L2.every((v,i)=>v===L[i])) break; L=L2;} return {L,C,sse:stat.sse(P,L,C)};}
function rvKmeans(P,k){
  let best=null;
  for(let s=1;s<=20;s++){let h=s*2654435761>>>0; const pick=[];
    while(pick.length<k){h=(Math.imul(h,1103515245)+12345)>>>0; const i=h%P.length; if(!pick.includes(i)) pick.push(i);}
    const r=rvRun(P,pick.map(i=>P[i].slice())); if(!best||r.sse<best.sse-1e-9) best=r;}
  const o=best.C.map((_,i)=>i).sort((a,b)=>(best.C[a][0]+best.C[a][1])-(best.C[b][0]+best.C[b][1])), m=[]; o.forEach((j,n)=>m[j]=n);
  const L=best.L.map(v=>m[v]);
  return {L,C:o.map(j=>best.C[j]),s:stat.silhouette(P,L)};
}
const RV_KM={}; [2,3,4,5].forEach(k=>RV_KM[k]=rvKmeans(RV_P,k));
const cluPlot=scatter({svg:'cluPlot',x:[30,100,10],y:[30,100,10],xl:'공통 과목1 (점, 예시)',yl:'공통 과목2 (점, 예시)'});
$('kBtns').innerHTML=[2,3,4,5].map(k=>`<button class="btn ghost sm" data-k="${k}">k = ${k}</button>`).join('');
function cluShow(k){
  const r=RV_KM[k];
  cluPlot.set(RV_P.map((p,i)=>[p[0],p[1],r.L[i]])).centers(r.C);
  $('kBtns').querySelectorAll('button').forEach(b=>b.classList.toggle('on',+b.dataset.k===k));
  $('cluK').textContent=k; $('cluSil').textContent=stat.fmt(r.s,2);
  bars('silBars',[2,3,4,5].map(j=>['k='+j,+RV_KM[j].s.toFixed(2),j===k?'#e0702b':'#c8ccd3']),{dec:2,max:1,h:200});
  $('cluGrp').innerHTML=r.C.map((c,i)=>`<span style="--k:${PAL[i%PAL.length]}"><b>군집 ${i+1}</b> ${r.L.filter(v=>v===i).length}명 · 평균 (${stat.fmt(c[0],0)}, ${stat.fmt(c[1],0)})</span>`).join('');
}
$('kBtns').querySelectorAll('button').forEach(b=>b.onclick=()=>cluShow(+b.dataset.k));
cluShow(2);
/* 연관: 선택 과목 두 개짜리 규칙 A → B */
const RV_N=RV_S.length;
const RV_RULES=[]; for(let i=0;i<4;i++)for(let j=0;j<4;j++)if(i!==j){
  const ab=RV_S.filter(r=>r[i]&&r[j]).length, a=RV_S.filter(r=>r[i]).length, b=RV_S.filter(r=>r[j]).length;
  if(ab) RV_RULES.push({t:`${RV_SUB[i]} → ${RV_SUB[j]}`,s:ab/RV_N,c:ab/a,l:(ab/a)/(b/RV_N)});}
let ruleTbl=null;
function ascShow(){
  const ms=+$('minS').value, mc=+$('minC').value;
  $('minSv').textContent=stat.fmt(ms,2); $('minCv').textContent=stat.fmt(mc,2);
  const R=RV_RULES.filter(r=>r.s>=ms-1e-9&&r.c>=mc-1e-9).sort((x,y)=>y.l-x.l||y.c-x.c);
  const rows=R.length?R.map(r=>[r.t,stat.fmt(r.s,2),stat.fmt(r.c,2),stat.fmt(r.l,2)]):[['기준을 넘는 규칙이 없어요','–','–','–']];
  if(!ruleTbl) ruleTbl=miniTable('ruleTbl',{cols:['규칙','지지도','신뢰도','향상도'],rows}); else ruleTbl.set(rows);
  $('ascSay').innerHTML=`전체 규칙 ${RV_RULES.length}개 가운데 <b>${R.length}개</b>가 남았어요.`+(R.length?` 향상도가 가장 큰 규칙 「${R[0].t}」의 향상도는 ${stat.fmt(R[0].l,2)}이에요. ${R[0].l>1?'1보다 커서 두 과목을 함께 고르는 경향이 있어요':'1 이하라 함께 고르는 경향이 약해요'}.`:'');
}
$('minS').oninput=ascShow; $('minC').oninput=ascShow; ascShow();
/* 탭 */
const RV_TABS=[
  {n:'회귀분석',ic:'📈',p:'pnReg',say:'<b>회귀분석</b> · 공통 과목1(독립 변수)로 공통 과목2(종속 변수)를 예측해요. 슬라이더로 점수를 바꿔 예측값을 보세요.'},
  {n:'군집 분석',ic:'🫧',p:'pnClu',say:'<b>군집 분석</b> · 공통 과목 두 점수로 학생들을 k개의 무리로 묶어요. k를 바꾸며 평균 실루엣 계수를 비교해 보세요.'},
  {n:'연관분석',ic:'🛒',p:'pnAsc',say:'<b>연관분석</b> · 선택 과목 1/0 표에서 「A를 고른 학생은 B도 고른다」는 규칙을 찾아요. 기준을 바꿔 보세요.'}
];
tabs('anaTabs','anaSay',RV_TABS,it=>{RV_TABS.forEach(t=>$(t.p).classList.toggle('on',t===it)); return it.say;});
miniTable('allTbl',{cols:['번호','공통 과목1','공통 과목2',...RV_SUB],rows:RV_P.map((p,i)=>[i+1,p[0],p[1],...RV_S[i]])});

/* 03 오렌지3 흐름 (교과서 168~169쪽 ows) */
orangeFlow({svg:'labFlow',table:'labSet',bw:170,minw:760,
  nodes:[{s:1,t:'File',sub:'score.csv',c:'Data',x:10,y:215},
    {s:2,t:'Select Columns',sub:'회귀분석',c:'Transform',x:215,y:70},{s:3,t:'Data Sampler',sub:'70%',c:'Transform',x:420,y:30},
    {s:4,t:'Linear Regression',sub:'기본 설정',c:'Model',x:625,y:0},{s:5,t:'Predictions',sub:'예측값 비교',c:'Evaluate',x:830,y:50},
    {s:6,t:'Scatter Plot',sub:'회귀선',c:'Visualize',x:420,y:110},
    {s:7,t:'Select Columns',sub:'군집분석',c:'Transform',x:215,y:215},{s:8,t:'k-Means',sub:'k = 2~4',c:'Unsupervised',x:420,y:215},
    {s:9,t:'Scatter Plot',sub:'군집 색',c:'Visualize',x:625,y:180},{s:10,t:'Silhouette Plot',sub:'실루엣',c:'Visualize',x:625,y:250},
    {s:11,t:'Select Columns',sub:'연관분석',c:'Transform',x:215,y:360},{s:12,t:'Edit Domain',sub:'점수 → 1',c:'Data',x:420,y:360},
    {s:13,t:'Frequent Itemsets',sub:'',c:'Associate',x:625,y:325},{s:14,t:'Association Rules',sub:'지지도 2% · 신뢰도 70%',c:'Associate',x:625,y:395}],
  edges:[[1,2],[2,3],[3,4],[4,5],[3,5],[2,6],[1,7],[7,8],[8,9],[8,10],[1,11],[11,12],[12,13],[12,14]]});
chips('labDone','labDone',['파일 열기','회귀 흐름','군집 흐름','연관 흐름','결과 기록'],true);

/* 04 돌아보기 */
chips('selfCheck','selfCheck',['정확한 자료를 준비했다','토론에 적극 참여했다','사례를 정확히 분석했다','평가 지표를 알맞게 썼다','생각을 논리적으로 발표했다'],true);

/* 05 단원 정리 · 나의 계획 다시 보기 */
onShow[5]=()=>{
  const P=[['u3-model','단원 시작 때'],['u3-regression','회귀분석을 시작할 때'],['u3-clustering','군집 분석을 시작할 때'],['u3-association','연관분석을 시작할 때']].map(([id,t])=>[t,memoOf(id,'plan')]).filter(x=>x[1]);
  $('planBack').innerHTML=P.length?P.map(([t,v])=>`<div><b>${t}</b>${esc(v)}</div>`).join(''):'<div class="muted">이 기기에 적어 둔 나의 계획이 없어요. 지금 떠올려 보세요.</div>';
};

/* 06 마무리 */
const MEMOLIST=[['myRole','나의 역할'],['method','우리 모둠의 분석 방법'],['problem','우리 모둠의 문제'],['prep','데이터 처리: 고른 열과 빈칸 처리'],['result','결과 해석'],['labDone','오렌지3 진행 체크'],['selfCheck','돌아보기: 잘한 것'],['reflect','아쉬운 점·앞으로의 계획·민감한 데이터를 다룰 때 지킬 점'],['keyQ','단원 질문에 대한 내 답']];
onShow[6]=()=>memoSummary('msum',MEMOLIST);

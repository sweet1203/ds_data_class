/* u4-stress-1 전용 (st1-) — 공용 부품 orangeFlow · boxes · stat · sorter · flipCards · chips 사용 */

/* 0 시작 · 처음 생각 */
chips('s1Guess','s1Guess',['수면 시간','운동 시간','전자 기기 사용 시간','공부 시간','식사량','학년','친구와 보내는 시간'],true);

/* 01 설문 문항 고치기 (새로 만든 예시 문항) */
sorter('s1Survey',{
  cats:[{n:'선택지 주기',k:'#2f6fd0'},{n:'단위 밝히기',k:'#1f9d74'},{n:'묻지 않기',k:'#d64535'}],
  items:[
    {t:'「평소 등교할 때 주로 이용하는 방법은?」',short:'등교 방법',c:0,ic:'🚌',w:'「버스」, 「버스 타고 가요」, 「대중교통」처럼 같은 답도 여러 표현으로 나와요. 걷기·버스·지하철·자전거·기타처럼 골라서 답하게 해요.'},
    {t:'「아침 식사를 얼마나 자주 하나요?」',short:'아침 식사 횟수',c:0,ic:'🍚',w:'「가끔」, 「주 2번」, 「거의」처럼 답이 제각각이 돼요. 매일·주 3~4회·주 1~2회·거의 안 함처럼 정해 둬요.'},
    {t:'「하루에 물을 얼마나 마시나요?」',short:'마시는 물의 양',c:1,ic:'💧',w:'컵, 잔, 리터, 밀리리터처럼 단위가 섞일 수 있어요. 「(단위: 컵, 200mL 기준)」처럼 입력 단위를 정해 줘요.'},
    {t:'「주말에 공부하는 시간은?」',short:'주말 공부 시간',c:1,ic:'📚',w:'「3시간」과 「180분」이 섞이지 않게 「(단위: 시간)」을 밝혀요.'},
    {t:'「보호자의 휴대 전화 번호를 적어 주세요.」',short:'보호자 전화번호',c:2,ic:'📱',w:'스트레스 지수 예측에 쓰지 않는 개인 정보예요. 모으지 않는 것이 응답자를 지키는 방법이에요.'},
    {t:'「사는 아파트 이름과 동·호수를 적어 주세요.」',short:'아파트 동·호수',c:2,ic:'🏢',w:'누구인지 알아볼 수 있는 정보라서, 분석에 꼭 필요하지 않다면 묻지 않아요.'}
  ],
  end:'<b>정리</b> 답이 여러 형식으로 나올 문항은 <b>선택지</b>를, 단위가 섞일 문항은 <b>입력 단위</b>를 주고, 분석에 필요 없는 <b>개인 정보는 묻지 않아요</b>.'
});

/* 02 오렌지3 흐름도 A: 불러오기 · 결측치 */
orangeFlow({svg:'s1FlowA', table:'s1SetA',
  nodes:[
    {s:1,t:'File',sub:'daily_data.csv',c:'Data',x:10,y:100},
    {s:2,t:'Data Table',sub:'Info 읽기',c:'Data',x:260,y:10},
    {s:3,t:'Column Statistics',sub:'Missing 칸',c:'Data',x:260,y:100},
    {s:4,t:'Impute',sub:'빈 칸 있는 행 지우기',c:'Transform',x:260,y:190}
  ],
  edges:[[1,2],[1,3],[1,4]],
  done:{box:'s1DoneA', key:'s1DoneA', items:['파일 열기 · grade 범주형','Info 확인','빈 칸 속성 찾기','Impute로 행 지우기']}});

/* 02 결측치 처리 방법 카드 */
flipCards('s1Impute',[
  {ic:'➗',f:'Average/Most frequent',s:'평균 · 가장 흔한 값',b:'숫자 속성은 평균값, 범주 속성은 가장 흔한 값으로 빈 칸을 채워요.',x:'행을 잃지 않지만, 채운 값이 평균 쪽으로 몰려요.'},
  {ic:'🤖',f:'Model-based imputer',s:'모델로 예측해 채우기',b:'다른 속성값을 바탕으로 빈 칸의 값을 예측해 채워요.',x:'속성끼리 관계가 있을 때 쓸 만해요.'},
  {ic:'🎲',f:'Random values',s:'분포에서 무작위로',b:'속성값의 분포를 계산한 뒤, 그 안에서 무작위로 고른 값을 넣어요.',x:'실행할 때마다 채운 값이 달라질 수 있어요.'},
  {ic:'🗑️',f:'Remove instances with unknown values',s:'빈 칸 있는 행 지우기',b:'빈 칸이 하나라도 있는 행을 통째로 지워요.',x:'오늘 쓴 방법. 그 행의 다른 값도 함께 사라져요.'}
]);

/* 03 이상치 기준 탐색기 — 예시 학생 17명 (지어낸 고정값) [stress, sleep, exercise, electronic_device_usage] */
const S1_ROWS=[
  [40,5,0,6],[2,8,90,2],[30,3,10,5],[5,9,120,2.5],[15,6.5,200,3],[18,6,30,13],[12,15,45,3],[26,4.5,0,5],[8,7.5,60,1],
  [22,5,5,4.5],[10,7,60,2],[17,6,20,4],[21,5.5,15,8],[9,7,40,3.5],[14,6.5,30,4],[20,6,0,3],[16,7,60,4]
];
const S1_ATTR=[
  {k:'stress',sh:'스트레스',n:'stress (스트레스 지수)',u:'점',poss:'설문 범위 0~40점',ax:[0,40,10]},
  {k:'sleep',sh:'수면',n:'sleep (수면 시간)',u:'시간',poss:'하루 0~24시간',ax:[0,16,4]},
  {k:'exercise',sh:'운동',n:'exercise (운동 시간)',u:'분',poss:'0분 이상 (음수 없음)',ax:[0,200,50]},
  {k:'electronic_device_usage',sh:'전자 기기',n:'electronic_device_usage (전자 기기 사용 시간)',u:'시간',poss:'하루 0~24시간',ax:[0,14,2]}
];
const s1Num=v=>(v<0?'−':'')+String(+Math.abs(v).toFixed(2));
const s1Col=j=>S1_ROWS.map(r=>r[j]);
function s1Fence(j){ const a=s1Col(j), q1=stat.q(a,.25), q3=stat.q(a,.75), iq=q3-q1; return {q1,q3,iq,lo:q1-1.5*iq,hi:q3+1.5*iq}; }
const s1Default=()=>S1_ATTR.map((_,j)=>{const f=s1Fence(j); return {on:true,lo:f.lo,hi:f.hi};});
let s1Cond=s1Default(), s1J=0, s1Src=0;
const s1Out=(i,j)=>{const c=s1Cond[j], v=S1_ROWS[i][j]; return c.on&&(v<c.lo||v>c.hi);};
const s1Kept=()=>S1_ROWS.map((_,i)=>i).filter(i=>!S1_ATTR.some((_,j)=>s1Out(i,j)));

function s1DrawAttr(){
  const A=S1_ATTR[s1J], a=s1Col(s1J), f=s1Fence(s1J), s=a.slice().sort((x,y)=>x-y);
  $('s1AttrName').textContent=A.n;
  boxes('s1Box',[[A.sh,a,'#e0702b']],{min:A.ax[0],max:A.ax[1],step:A.ax[2],left:80});
  $('s1Sorted').innerHTML=s.map((v,i)=>`<span class="${i===4||i===12?'q':''}${v<f.lo||v>f.hi?' o':''}">${s1Num(v)}</span>`).join('');
  const outs=a.filter(v=>v<f.lo||v>f.hi).sort((x,y)=>x-y);
  $('s1Calc').innerHTML=`<tr><th colspan="2">${A.n} · 단위: ${A.u}</th></tr>
    <tr><td>Q1 (5번째 값)</td><td><b>${s1Num(f.q1)}</b></td></tr>
    <tr><td>Q3 (13번째 값)</td><td><b>${s1Num(f.q3)}</b></td></tr>
    <tr><td>IQR = Q3 − Q1</td><td>${s1Num(f.q3)} − ${s1Num(f.q1)} = <b>${s1Num(f.iq)}</b></td></tr>
    <tr><td>IQR × 1.5</td><td><b>${s1Num(f.iq*1.5)}</b></td></tr>
    <tr><td>아래 기준선 = Q1 − IQR×1.5</td><td><b>${s1Num(f.lo)}</b></td></tr>
    <tr><td>위 기준선 = Q3 + IQR×1.5</td><td><b>${s1Num(f.hi)}</b></td></tr>
    <tr><td>기준선 밖의 값</td><td>${outs.length?outs.map(s1Num).join(', '):'없음'}</td></tr>
    <tr><td>있을 수 있는 값</td><td>${A.poss}</td></tr>`;
  $('s1CondName').textContent=A.k;
  $('s1On').checked=s1Cond[s1J].on;
  $('s1Lo').value=+s1Cond[s1J].lo.toFixed(2); $('s1Hi').value=+s1Cond[s1J].hi.toFixed(2);
  $('s1Lo').disabled=$('s1Hi').disabled=!s1Cond[s1J].on;
  $('s1Attr').querySelectorAll('button').forEach((b,i)=>b.classList.toggle('on',i===s1J));
}
function s1DrawRows(){
  const kept=s1Kept(), n=S1_ROWS.length;
  $('s1Status').innerHTML=`들어온 <b>${n}</b>개 → 남은 <b>${kept.length}</b>개 | 빠진 <b>${n-kept.length}</b>개`+
    `<div class="st1-conds">${S1_ATTR.map((A,j)=>{const c=s1Cond[j]; return `<span class="${c.on?'':'off'}">${A.k} ${c.on?`${s1Num(c.lo)} ~ ${s1Num(c.hi)}`:'(조건 끔)'}</span>`;}).join('')}</div>`;
  $('s1Rows').innerHTML=`<tr><th>예시 학생</th>${S1_ATTR.map((A,j)=>`<th class="${j===s1J?'cur':''}">${A.k}<br><small>(${A.u})</small></th>`).join('')}<th>결과</th></tr>`+
    S1_ROWS.map((r,i)=>{const drop=!kept.includes(i); return `<tr class="${drop?'drop':''}"><td>${i+1}</td>${r.map((v,j)=>`<td class="${s1Out(i,j)?'out':''}${j===s1J?' cur':''}">${s1Num(v)}</td>`).join('')}<td>${drop?'빠짐':'남음'}</td></tr>`;}).join('');
  s1DrawNorm();
}
function s1DrawNorm(){
  const A=S1_ATTR[s1J], kept=s1Kept(), idx=s1Src===0?kept:S1_ROWS.map((_,i)=>i), a=idx.map(i=>S1_ROWS[i][s1J]);
  $('s1NormSrc').querySelectorAll('button').forEach((b,i)=>{b.classList.toggle('on',i===s1Src); if(i===0) b.textContent=`Select Rows 뒤 (남은 ${kept.length}명)`;});
  if(a.length<2){ $('s1NormSay').innerHTML='남은 데이터가 너무 적어요. 조건을 넓혀 보세요.'; $('s1NBox1').innerHTML=$('s1NBox2').innerHTML=''; return; }
  const mn=Math.min(...a), mx=Math.max(...a);
  if(mx===mn){ $('s1NormSay').innerHTML='남은 값이 모두 같아 정규화할 수 없어요.'; return; }
  const nv=a.map(v=>(v-mn)/(mx-mn)), lab=A.sh;
  boxes('s1NBox1',[[lab,a,'#9b4fc4']],{min:A.ax[0],max:A.ax[1],step:A.ax[2],left:80});
  boxes('s1NBox2',[[lab,nv,'#9b4fc4']],{min:0,max:1,step:.25,left:80});
  const outN=arr=>{const q1=stat.q(arr,.25),q3=stat.q(arr,.75),iq=q3-q1; return arr.filter(v=>v<q1-1.5*iq-1e-9||v>q3+1.5*iq+1e-9).length;};
  const o1=outN(a), o2=outN(nv), ex=idx[0], xv=S1_ROWS[ex][s1J];
  $('s1NormSay').innerHTML=`최솟값 <b>${s1Num(mn)}</b> → 0, 최댓값 <b>${s1Num(mx)}</b> → 1. 예: 예시 학생 ${ex+1}의 ${s1Num(xv)} → (${s1Num(xv)} − ${s1Num(mn)}) ÷ (${s1Num(mx)} − ${s1Num(mn)}) = <b>${stat.fmt((xv-mn)/(mx-mn),2)}</b><br>`+
    `빈 점(이상치): 원래 값 <b>${o1}</b>개 · 정규화한 값 <b>${o2}</b>개 — `+
    (o1?'정규화는 눈금만 바꿀 뿐, 이상치를 없애지는 않아요.':s1Src===0&&s1Cond[s1J].on?'빈 점이 없는 것은 앞에서 Select Rows로 걸렀기 때문이에요. 정규화가 지운 것이 아니에요.':'지금 고른 값들에는 기준선 밖의 값이 없어요.');
}
$('s1Attr').innerHTML=S1_ATTR.map((A,i)=>`<button class="btn ghost sm" data-i="${i}">${A.k}</button>`).join('');
$('s1Attr').querySelectorAll('button').forEach(b=>b.onclick=()=>{s1J=+b.dataset.i; s1DrawAttr(); s1DrawRows();});
$('s1NormSrc').innerHTML='<button class="btn ghost sm">Select Rows 뒤</button><button class="btn ghost sm">Select Rows 앞 (17명 모두)</button>';
$('s1NormSrc').querySelectorAll('button').forEach((b,i)=>b.onclick=()=>{s1Src=i; s1DrawNorm();});
$('s1On').onchange=()=>{s1Cond[s1J].on=$('s1On').checked; s1DrawAttr(); s1DrawRows();};
[['s1Lo','lo'],['s1Hi','hi']].forEach(([id,k])=>$(id).oninput=()=>{const v=parseFloat($(id).value); if(!isNaN(v)){s1Cond[s1J][k]=v; s1DrawRows();}});
$('s1Fill').onclick=()=>{const f=s1Fence(s1J); s1Cond[s1J]={on:true,lo:f.lo,hi:f.hi}; s1DrawAttr(); s1DrawRows();};
$('s1Reset').onclick=()=>{s1Cond=s1Default(); s1Src=0; s1DrawAttr(); s1DrawRows();};
s1DrawAttr(); s1DrawRows();

/* 04 오렌지3 흐름도 B: 이상치 처리 · 정규화 */
orangeFlow({svg:'s1FlowB', table:'s1SetB',
  nodes:[
    {s:1,t:'File',sub:'daily_data.csv',c:'Data',x:10,y:110},
    {s:2,t:'Scatter Plot',sub:'산점도로 이상치 찾기',c:'Visualize',x:240,y:10},
    {s:3,t:'Box Plot',sub:'Q1 · Q3 확인',c:'Visualize',x:240,y:210},
    {s:4,t:'Impute',sub:'81개',c:'Transform',x:240,y:110},
    {s:5,t:'Select Rows',sub:'이상치 확인 범위',c:'Transform',x:470,y:110},
    {s:6,t:'Preprocess',sub:'Normalize [0, 1]',c:'Transform',x:700,y:110},
    {s:7,t:'Data Table (1)',sub:'정규화한 값',c:'Data',x:930,y:40},
    {s:8,t:'Box Plot (1)',sub:'0~1 눈금',c:'Visualize',x:930,y:180}
  ],
  edges:[[1,2],[1,3],[1,4],[4,5],[5,6,'Matching Data'],[6,7],[6,8]],
  done:{box:'s1DoneB', key:'s1DoneB', items:['Scatter Plot 두 가지','Box Plot 사분위수','Select Rows 네 조건','남은 수 확인','Normalize [0, 1]','정규화 결과 확인']}});

/* 05 마무리 */
const MEMOLIST=[['s1Guess','처음 생각: 스트레스에 영향을 줄 것 같은 데이터'],['s1Survey','내가 만든 설문 문항과 수집 목적'],['s1DoneA','오렌지3 진행 체크(불러오기 · 결측치)'],['s1Miss','결측치 기록'],['s1DoneB','오렌지3 진행 체크(이상치 · 정규화)'],['s1Rows','Select Rows 상태 줄'],['s1Norm','(선택) 정규화한 stress의 Q1 · Q3'],['s1Rule','처리 기준과 이유'],['s1KeyQ','오늘의 질문에 대한 내 답']];
onShow[5]=()=>{
  $('s1GuessShow').textContent=MEMO.s1Guess?'「'+MEMO.s1Guess+'」':'아직 고르지 않음';
  memoSummary('msum',MEMOLIST.filter(([k,l])=>!l.startsWith('(선택)')||String(MEMO[k]||'').trim()));
};

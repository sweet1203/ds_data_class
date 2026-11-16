/* u3-association 전용 (as-) */

/* 0 시작 · 함께 사는 물건 */
chips('pairPick','pairPick',['라면 · 달걀','우유 · 시리얼','과자 · 음료수','삼겹살 · 상추','떡볶이 떡 · 어묵','식빵 · 잼','잘 모르겠다'],true);

/* 01 연관분석의 종류 (새로 만든 사례) */
sorter('kindSort',{
  cats:[{n:'장바구니 분석',k:'#0f8b8d'},{n:'서열 분석',k:'#e0702b'},{n:'추천 서비스',k:'#9b4fc4'}],
  items:[
    {t:'편의점이 같은 영수증에 김밥과 컵라면이 자주 찍히는 것을 보고 두 상품을 나란히 진열했다.',short:'김밥 · 컵라면 진열',c:0,ic:'🍙',w:'한 번에 같이 산 상품을 찾은 경우라, 사는 때의 앞뒤보다 동시에 구매된 것이 중요해요.'},
    {t:'문구점이 연필을 사는 손님이 지우개도 자주 집어 가는 것을 보고 두 개를 묶음 상품으로 만들었다.',short:'연필 · 지우개 묶음',c:0,ic:'✏️',w:'같은 계산에 담기는 두 상품을 찾아 묶음 판매에 쓴 경우예요.'},
    {t:'신발 가게가 고객들의 구매 기록을 날짜 순서로 늘어놓아 보니, 운동화를 먼저 사고 한 달쯤 뒤에 양말을 사러 오는 순서가 많았다.',short:'운동화 → 한 달 뒤 양말',c:1,ic:'👟',w:'운동화를 먼저, 양말을 나중에 사는 시간의 흐름을 찾은 경우예요.'},
    {t:'서점이 독자들의 구매 기록을 시간 순서로 정리해 보니, 소설 1권을 산 독자가 몇 주 뒤에 2권을 사는 순서가 자주 나타났다.',short:'1권 → 몇 주 뒤 2권',c:1,ic:'📚',w:'무엇을 먼저 사고 무엇을 나중에 사는지가 핵심이라 서열 분석이에요.'},
    {t:'휴대폰을 개통한 고객이 며칠 뒤 보호 필름을, 그다음 달에 무선 이어폰을 사는 경향을 찾았다.',short:'개통 → 필름 → 이어폰',c:1,ic:'📱',w:'구매가 일어난 시간의 앞뒤를 따라가며 찾은 패턴이에요.'},
    {t:'음악 앱이 내가 지난주에 자주 들은 노래와 분위기가 비슷한 노래 목록을 첫 화면에 띄워 준다.',short:'비슷한 노래 목록',c:2,ic:'🎧',w:'한 사용자의 과거 행동과 선호도를 바탕으로 맞춤형 콘텐츠를 골라 준 경우예요.'},
    {t:'동영상 사이트가 시청 기록을 바탕으로 내가 좋아할 만한 요리 영상을 골라 보여 준다.',short:'요리 영상 골라 주기',c:2,ic:'🎬',w:'과거 시청 기록으로 관심 가질 만한 콘텐츠를 찾아 준 경우예요.'}
  ],
  end:'<b>정리</b> 같은 영수증 안의 조합이 중요하면 <b>장바구니 분석</b>, 사는 때의 앞뒤가 중요하면 <b>서열 분석</b>, 한 사람의 과거 행동으로 맞춤 콘텐츠를 고르면 <b>추천 서비스</b>예요.'
});

/* 02 표 Ⅲ-7·8 고객의 구매 내역 (교과서 158쪽) */
const AS_ITEMS=['삼겹살','식빵','쌈장','콜라','우유','상추'];
const AS_TX=[[1,0,1,1,0,0],[0,1,0,1,1,0],[1,0,1,1,0,1],[1,0,0,0,0,1],[1,1,1,1,0,0],[0,1,0,0,1,0],[1,0,1,0,0,1]];
const asN=AS_TX.length;
miniTable('asTbl',{cols:['고객',...AS_ITEMS],rows:AS_TX.map((r,i)=>[i+1,...r.map(v=>v?'○':'')])});
const asF=(a,b)=>`<span class="as-frac"><b>${a}</b><b>${b}</b></span>`;
const asD=v=>v==null||isNaN(v)?'–':(+v).toFixed(2);
function asCalc(a,b){
  const nA=AS_TX.filter(r=>r[a]).length, nB=AS_TX.filter(r=>r[b]).length, nAB=AS_TX.filter(r=>r[a]&&r[b]).length;
  const sup=nAB/asN, conf=nA?nAB/nA:null, pB=nB/asN, lift=conf!=null&&pB?conf/pB:null;
  return {nA,nB,nAB,sup,conf,pB,lift};
}
const asWord=L=>L==null?'계산할 수 없어요.'
  :L===0?'두 상품을 함께 산 고객이 없어요. 향상도 0이에요.'
  :Math.abs(L-1)<1e-9?'향상도 = 1 → A를 사든 안 사든 B를 사는 비율이 같아요. <b>연관성이 없어요</b>.'
  :L>1?'향상도 &gt; 1 → A를 산 고객이 전체 고객보다 B를 <b>더 자주</b> 사요. 함께 사는 경향이 있어요. 1에 얼마나 가까운지도 함께 봐요.'
  :'향상도 &lt; 1 → A를 산 고객은 오히려 B를 <b>덜</b> 사요. 1에 얼마나 가까운지도 함께 봐요.';
let asA=0, asB=3, asLock=!store.get(MK+'-self',false);
const AS_LOCK=2;   /* 쌈장: 스스로 해결하기를 마치기 전에는 잠금 */
function asBtns(){
  const lk=i=>asLock&&i===AS_LOCK, lab=(t,i)=>lk(i)?t+' 🔒':t, tip=i=>lk(i)?' title="스스로 해결하기를 마치면 열려요"':'';
  $('asA').innerHTML=AS_ITEMS.map((t,i)=>`<button class="btn ghost sm${i===asA?' on':''}" data-i="${i}"${lk(i)?' disabled':''}${tip(i)}>${lab(t,i)}</button>`).join('');
  $('asB').innerHTML=AS_ITEMS.map((t,i)=>`<button class="btn ghost sm${i===asB?' on':''}" data-i="${i}"${i===asA||lk(i)?' disabled':''}${tip(i)}>${lab(t,i)}</button>`).join('');
  $('asA').querySelectorAll('button').forEach(b=>b.onclick=()=>{asA=+b.dataset.i; if(asB===asA||(asLock&&asB===AS_LOCK)){ asB=(asA+1)%AS_ITEMS.length; if(asLock&&asB===AS_LOCK) asB=(asB+1)%AS_ITEMS.length; } asDraw();});
  $('asB').querySelectorAll('button').forEach(b=>b.onclick=()=>{asB=+b.dataset.i; asDraw();});
}
function asDraw(){
  asBtns();
  const A=AS_ITEMS[asA], B=AS_ITEMS[asB], r=asCalc(asA,asB);
  $('asTbl').querySelectorAll('tr[data-i]').forEach(tr=>{const x=AS_TX[+tr.dataset.i]; tr.className=x[asA]&&x[asB]?'as-ab':x[asA]?'as-a':x[asB]?'as-b':'';});
  $('asTbl').querySelectorAll('tr:first-child th').forEach((th,j)=>th.classList.toggle('as-hd',j===asA+1||j===asB+1));
  $('asOut').innerHTML=`<div class="as-rl"><b>${A}</b> → <b>${B}</b></div>
    <div>P(A) = P(${A}) = ${asF(r.nA,asN)} &nbsp; P(B) = P(${B}) = ${asF(r.nB,asN)} &nbsp; P(A∩B) = ${asF(r.nAB,asN)}</div>
    <div class="as-v" style="--k:#0f8b8d"><span>지지도</span> P(A∩B) = ${asF(r.nAB,asN)} = <b>${asD(r.sup)}</b></div>
    <div class="as-v" style="--k:#e0702b"><span>신뢰도</span> ${asF('P(A∩B)','P(A)')} = ${asF(r.nAB+'/'+asN,r.nA+'/'+asN)} = <b>${asD(r.conf)}</b></div>
    <div class="as-v" style="--k:#9b4fc4"><span>향상도</span> ${asF('신뢰도','P(B)')} = ${asF(asD(r.conf),r.nB+'/'+asN)} = <b>${asD(r.lift)}</b></div>
    <p class="as-w">${asWord(r.lift)}</p>`;
  bars('asBar',[[`전체 고객 중 ${B}`,r.pB,'#9aa5b1'],[`${A} 고객 중 ${B}`,r.conf||0,'#e0702b']],{dec:2,horiz:true,max:1,left:150});
}
asDraw();
/* 계산 결과 기록 */
const asLogArr=()=>String(MEMO.calcLog||'').split(' / ').filter(Boolean);
function asLogDraw(){ $('asLog').innerHTML=asLogArr().map(s=>`<li>${esc(s)}</li>`).join('')||'<li class="muted">아직 기록한 규칙이 없어요.</li>'; }
$('asSave').onclick=()=>{
  const r=asCalc(asA,asB), s=`${AS_ITEMS[asA]} → ${AS_ITEMS[asB]}: 지지도 ${asD(r.sup)} · 신뢰도 ${asD(r.conf)} · 향상도 ${asD(r.lift)}`;
  const L=asLogArr().filter(x=>x!==s); L.push(s); MEMO.calcLog=L.slice(-6).join(' / '); store.set(MK,MEMO); asLogDraw();
};
$('asClear').onclick=()=>{MEMO.calcLog=''; store.set(MK,MEMO); asLogDraw();};
asLogDraw();

/* 02 스스로 해결하기 확인 (정답은 표에서 계산) */
function asNum(s){
  s=String(s||'').trim().replace(/\s/g,''); if(!s) return NaN;
  const pct=s.endsWith('%'); if(pct) s=s.slice(0,-1);
  let v=s.includes('/')?(([p,q])=>+p/+q)(s.split('/')):+s;
  return pct?v/100:v;
}
let asTries=0;
$('selfCheck').onclick=()=>{
  asTries++;
  const r=asCalc(0,2);
  const T=[['지지도','selfS',r.sup,0.006,'전체 거래 7개 가운데 삼겹살과 쌈장이 <b>모두</b> 있는 거래를 세어요.'],
           ['신뢰도','selfC',r.conf,0.006,'분모는 전체 거래가 아니라 <b>삼겹살을 산 거래 수</b>예요.'],
           ['향상도','selfL',r.lift,0.015,'신뢰도를 <b>P(쌈장)</b>, 곧 쌈장을 산 거래의 비율로 나눠요.']];
  let ok=0;
  const out=T.map(([n,k,e,tol,hint])=>{const v=asNum(document.querySelector(`[data-memo="${k}"]`).value);
    if(isNaN(v)) return `<li>○ ${n}: 아직 비어 있거나 숫자가 아니에요.</li>`;
    if(Math.abs(v-e)<=tol){ok++; return `<li class="ok">✓ ${n} 맞아요.</li>`;}
    return `<li class="ng">✗ ${n}: 다시 세어 봐요. ${hint} 소수는 둘째 자리까지 적어요.</li>`;}).join('');
  const open=ok===3||asTries>=3;
  if(open&&asLock){ asLock=false; store.set(MK+'-self',true); asDraw(); }
  $('selfSay').innerHTML=`<b>3개 중 ${ok}개 맞았어요.</b><ul class="as-chk">${out}</ul>`+(open?'계산기의 쌈장 잠금이 풀렸어요. A = 삼겹살, B = 쌈장을 골라 내 계산과 비교해 보세요.':'계산기의 쌈장은 세 칸을 다 맞히거나 세 번 확인하면 열려요.');
};

/* 03 Apriori 따라가기 */
const AP_DS=[
  {n:'문구점 (예시)',items:['연필','지우개','공책','자','풀'],tx:[['연필','지우개','공책'],['연필','지우개','자'],['공책','풀'],['연필','지우개','공책','풀'],['지우개','공책']]},
  {n:'교과서 160쪽 예',items:['A','B','C','D','E'],tx:[['A','C','D'],['B','C','E'],['A','B','C','E'],['B','E']]}
];
let ap={ds:0,ms:2};
const apSet=s=>'{'+s.join(', ')+'}';
const apCount=s=>AP_DS[ap.ds].tx.filter(t=>s.every(i=>t.includes(i))).length;
function apCombos(arr,k){ const out=[]; (function rec(st,cur){ if(cur.length===k){out.push(cur.slice());return;} for(let i=st;i<arr.length;i++){cur.push(arr[i]);rec(i+1,cur);cur.pop();} })(0,[]); return out; }
let apRec=store.get(MK+'-ap',{});
function apStart(){
  const D=AP_DS[ap.ds];
  ap.k=1; ap.cand=D.items.map(i=>[i]); ap.guess={}; ap.checked=false; ap.log=[]; ap.lastF=[]; ap.score=[0,0]; ap.tot=0;
  miniTable('apTbl',{cols:['거래','구매한 항목'],rows:D.tx.map((t,i)=>[i+1,t.join(', ')])});
  document.querySelectorAll('[data-ds]').forEach(b=>b.classList.toggle('on',+b.dataset.ds===ap.ds));
  document.querySelectorAll('[data-ms]').forEach(b=>b.classList.toggle('on',+b.dataset.ms===ap.ms));
  apStage();
}
function apHL(s){ const D=AP_DS[ap.ds]; $('apTbl').querySelectorAll('tr[data-i]').forEach(tr=>tr.classList.toggle('on',!!s&&s.every(i=>D.tx[+tr.dataset.i].includes(i)))); }
function apStage(){
  $('apStage').textContent=`${ap.k}-항목 후보 집합 · 최소 지지도 ${ap.ms}번 이상`;
  $('apCand').innerHTML=ap.cand.map((c,i)=>`<div class="as-cd" data-i="${i}"><button class="as-nm">${apSet(c)}</button><button class="as-g" data-g="o" aria-label="${apSet(c)} 최소 지지도를 만족">○</button><button class="as-g" data-g="x" aria-label="${apSet(c)} 최소 지지도를 만족하지 않음">×</button><span class="as-ct"></span></div>`).join('');
  $('apCand').querySelectorAll('.as-cd').forEach(row=>{const i=+row.dataset.i;
    row.querySelector('.as-nm').onclick=()=>{ $('apCand').querySelectorAll('.as-cd').forEach(x=>x.classList.toggle('sel',x===row)); apHL(ap.cand[i]); };
    row.querySelectorAll('.as-g').forEach(b=>b.onclick=()=>{ if(ap.checked) return; ap.guess[i]=b.dataset.g; row.querySelectorAll('.as-g').forEach(x=>x.classList.toggle('on',x===b)); });
  });
  ap.checked=false; ap.guess={}; apHL(null);
  $('apCheck').disabled=false; $('apNext').disabled=true;
  $('apBar').setAttribute('viewBox','0 0 460 40'); $('apBar').innerHTML='<text x="230" y="25" text-anchor="middle" font-size="13" fill="#5b6776">「확인」을 누르면 후보별 등장 횟수가 막대로 나와요</text>';
  $('apSay').innerHTML=`후보마다 등장 횟수가 <b>${ap.ms}번 이상</b>이면 ○, 아니면 ×를 눌러 예상하고 「확인」을 눌러요.`;
  apLogDraw();
}
function apNextCand(F){
  const D=AP_DS[ap.ds], els=D.items.filter(i=>F.some(s=>s.includes(i)));
  return els.length>ap.k?apCombos(els,ap.k+1):[];
}
$('apCheck').onclick=()=>{
  if(ap.checked) return;
  const miss=ap.cand.filter((_,i)=>!ap.guess[i]).length;
  if(miss){ $('apSay').innerHTML=`아직 ○/×를 고르지 않은 후보가 <b>${miss}개</b> 있어요.`; return; }
  ap.checked=true; $('apCheck').disabled=true;
  let ok=0; const cnt=ap.cand.map(apCount), F=ap.cand.filter((_,i)=>cnt[i]>=ap.ms);
  $('apCand').querySelectorAll('.as-cd').forEach(row=>{const i=+row.dataset.i, real=cnt[i]>=ap.ms?'o':'x', right=ap.guess[i]===real; if(right) ok++;
    row.classList.add(right?'ok':'ng'); row.querySelector('.as-ct').innerHTML=`${cnt[i]}번 ${real==='o'?'○':'×'}${right?'':' (예상과 달라요)'}`;});
  ap.score[0]+=ok; ap.score[1]+=ap.cand.length;
  bars('apBar',ap.cand.map((c,i)=>[apSet(c),cnt[i],cnt[i]>=ap.ms?'#2f6fd0':'#c3cad3']),{horiz:true,max:AP_DS[ap.ds].tx.length,dec:0,left:Math.min(190,40+ap.k*46)});
  ap.log.push(`${ap.k}-항목 후보 ${ap.cand.length}개 중 ${ok}개 예상 맞힘 → ${ap.k}-항목 빈번 집합 ${F.length?F.map(apSet).join(' '):'없음'}`);
  const nx=F.length?apNextCand(F):[];
  if(F.length) ap.lastF=F;
  ap.tot+=F.length;
  if(nx.length){
    ap.nx=nx; $('apNext').disabled=false;
    $('apSay').innerHTML=`<b>${ap.cand.length}개 중 ${ok}개</b>를 맞혔어요. 파란 막대(${ap.ms}번 이상)만 <b>${ap.k}-항목 빈번 집합</b>으로 남겨요. 「다음 단계」에서 남은 항목으로 ${ap.k+1}-항목 후보를 만들어요.`;
  }else{
    const fin=ap.lastF.map(apSet).join(' ');
    ap.log.push(`최종 선택: ${fin}`);
    $('apSay').innerHTML=`<b>${ap.cand.length}개 중 ${ok}개</b>를 맞혔어요. ${F.length?'더 큰 후보를 만들 수 없어서':`${ap.k}-항목 빈번 집합이 하나도 없어서`} 여기서 멈춰요. <b>최종 선택: ${fin}</b> · 모든 단계의 빈번 집합을 합치면 <b>${ap.tot}개</b> (전체 예상 ${ap.score[1]}개 중 ${ap.score[0]}개 맞힘)`;
    apRec[`${AP_DS[ap.ds].n} · 최소 지지도 ${ap.ms}`]=`최종 선택 ${fin} · 모든 단계 빈번 집합 ${ap.tot}개 (예상 ${ap.score[1]}개 중 ${ap.score[0]}개 맞힘)`;
    store.set(MK+'-ap',apRec);
    MEMO.apLog=Object.entries(apRec).map(([k,v])=>k+': '+v).join(' / '); store.set(MK,MEMO);
  }
  apLogDraw();
};
$('apNext').onclick=()=>{ if(!ap.nx) return; ap.k++; ap.cand=ap.nx; ap.nx=null; apStage(); };
$('apReset').onclick=apStart;
document.querySelectorAll('[data-ds]').forEach(b=>b.onclick=()=>{ap.ds=+b.dataset.ds; apStart();});
document.querySelectorAll('[data-ms]').forEach(b=>b.onclick=()=>{ap.ms=+b.dataset.ms; apStart();});
function apLogDraw(){
  const done=Object.entries(apRec).map(([k,v])=>`<li class="ok">✓ ${esc(k)}: ${esc(v)}</li>`).join('');
  $('apLogView').innerHTML=ap.log.map(s=>`<li>${esc(s)}</li>`).join('')+(done?`<li class="muted">끝까지 해 본 기록</li>${done}`:'');
}
apStart();

/* 04 마무리 */
const MEMOLIST=[['pairPick','함께 사는 물건'],['plan','나의 계획'],['selfS','스스로 해결하기: 삼겹살 → 쌈장 지지도'],['selfC','스스로 해결하기: 신뢰도'],['selfL','스스로 해결하기: 향상도'],['calcLog','지표 계산기에서 기록한 규칙'],['liftNote','향상도가 1보다 큰 규칙과 작은 규칙'],['apLog','Apriori 따라가기 기록'],['apNote','최소 지지도를 바꾸었을 때'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[4]=()=>memoSummary('msum',MEMOLIST);

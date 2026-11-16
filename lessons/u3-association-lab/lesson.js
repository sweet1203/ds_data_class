/* u3-association-lab 전용 (al-) */

/* 표 Ⅲ-7·8 고객의 구매 내역 (교과서 158·161쪽) */
const AL_ITEMS=['삼겹살','식빵','쌈장','콜라','우유','상추'];
const AL_TX=[[1,0,1,1,0,0],[0,1,0,1,1,0],[1,0,1,1,0,1],[1,0,0,0,0,1],[1,1,1,1,0,0],[0,1,0,0,1,0],[1,0,1,0,0,1]];
const alEdit=AL_ITEMS.map((_,j)=>j+1);

/* 0 시작 · 규칙은 몇 개? (6가지 상품: 3^6 − 2·2^6 + 1 = 602) */
vote('guessVote','guessCount',[['10개쯤',''],['50개쯤',''],['600개쯤','']],()=>{
  const s=$('guessSay'); s.style.display='';
  s.innerHTML='상품마다 「조건에 넣기 · 결과에 넣기 · 넣지 않기」 세 가지가 있어서, 겹치지 않는 A → B는 모두 <b>602개</b>예요. 규칙마다 지표를 손으로 계산하기는 어려워서 알고리즘과 도구를 써요.';
});

/* 01 구매 목록 → 0/1 표 */
miniTable('alList',{cols:['고객','구매 상품'],rows:AL_TX.map((r,i)=>[i+1,AL_ITEMS.filter((_,j)=>r[j]).join(', ')])});
const binT=miniTable('alBin',{cols:['고객',...AL_ITEMS],rows:AL_TX.map((_,i)=>[i+1,'','','','','','']),edit:alEdit});
$('binZero').onclick=()=>{ binT.set(binT.rows().map(r=>r.map((v,j)=>j&&String(v).trim()===''?0:v))); };
$('binClear').onclick=()=>{ binT.set(AL_TX.map((_,i)=>[i+1,'','','','','',''])); $('binSay').textContent='표를 지웠어요. 다시 적어 보세요.'; };
$('binCheck').onclick=()=>{
  const R=binT.rows(); let ok=0, empty=0; const all=AL_TX.length*AL_ITEMS.length;
  $('alBin').querySelectorAll('.mt-in').forEach(inp=>{
    const i=+inp.closest('tr').dataset.i, j=+inp.dataset.j, v=String(R[i][j]).trim();
    const right=v!==''&&+v===AL_TX[i][j-1]; if(v==='') empty++; if(right) ok++;
    inp.classList.toggle('al-ok',right); inp.classList.toggle('al-ng',!right&&v!=='');
  });
  $('binSay').innerHTML=`<b>${all}칸 중 ${ok}칸</b>이 맞았어요.`+(empty?` 빈칸이 ${empty}개 있어요. 안 산 상품은 0이에요.`:'')+(ok===all?' 표 Ⅲ-8과 같은 0/1 표가 되었어요. 이제 스프레드시트에 옮겨 저장해요.':' 빨간 칸을 왼쪽 목록과 다시 비교해 봐요.');
  MEMO.binLog=`${all}칸 중 ${ok}칸 맞힘`; store.set(MK,MEMO);
};

/* 02 오렌지3 흐름도 (161쪽 ows: File → Data Table, File → Association Rules) */
orangeFlow({svg:'alFlow',table:'alSet',
  nodes:[{s:1,t:'File',sub:'association_rules.csv',c:'Data',x:10,y:60},{s:2,t:'Data Table',sub:'값 확인',c:'Data',x:260,y:6},{s:3,t:'Association Rules',sub:'supp 3 % · conf 70 %',c:'Associate',x:260,y:114}],
  edges:[[1,2],[1,3]]});
chips('alDone','alDonePick',['애드온 설치','파일 열기 · 고객 meta','Data Table 확인','Find Rules (3 %)','Lift 순서 정렬','30 %로 다시','결과 기록'],true);

/* 02 연관 규칙 찾기 체험: Apriori로 빈번 항목 집합 → 규칙 (supp·conf·lift) */
function alMine(rows,ms,mc,zero){
  const n=rows.length, items=[];
  AL_ITEMS.forEach((nm,j)=>{ items.push({j,v:1,t:zero?nm+'=1':nm}); if(zero) items.push({j,v:0,t:nm+'=0'}); });
  const bit=items.map(it=>rows.reduce((m,r,i)=>((r[it.j]===1)===(it.v===1))?m|(1<<i):m,0));
  const pop=x=>{let c=0;while(x){x&=x-1;c++;}return c;};
  const need=ms*n-1e-9, SUP=new Map(), key=s=>s.join(',');
  let L=[]; items.forEach((_,i)=>{const c=pop(bit[i]); if(c>0&&c>=need){SUP.set(key([i]),{c,m:bit[i]}); L.push([i]);}});
  while(L.length){
    const next=[], seen=new Set();
    for(let a=0;a<L.length;a++) for(let b=a+1;b<L.length;b++){
      const A=L[a], B=L[b]; if(A.slice(0,-1).join()!==B.slice(0,-1).join()) continue;
      const S=[...A,B[B.length-1]].sort((x,y)=>x-y), k=key(S);
      if(seen.has(k)) continue; seen.add(k);
      if(new Set(S.map(i=>items[i].j)).size<S.length) continue;
      const m=SUP.get(key(A)).m&bit[B[B.length-1]], c=pop(m);
      if(c>0&&c>=need){SUP.set(k,{c,m}); next.push(S);}
    }
    L=next;
  }
  const rules=[];
  SUP.forEach((v,k)=>{ const S=k.split(',').map(Number); if(S.length<2) return;
    for(let mask=1;mask<(1<<S.length)-1;mask++){
      const A=S.filter((_,i)=>mask>>i&1), C=S.filter((_,i)=>!(mask>>i&1));
      const conf=v.c/SUP.get(key(A)).c; if(conf<mc-1e-9) continue;
      rules.push({A:A.map(i=>items[i].t).join(', '),C:C.map(i=>items[i].t).join(', '),s:v.c/n,conf,lift:conf/(SUP.get(key(C)).c/n)});
    }});
  rules.sort((p,q)=>q.lift-p.lift||q.s-p.s||q.conf-p.conf||p.A.localeCompare(q.A));
  return {nf:SUP.size,rules};
}
const alT=miniTable('alTbl',{cols:['고객',...AL_ITEMS],rows:AL_TX.map((r,i)=>[i+1,...r]),edit:alEdit,onChange:()=>alRun()});
const alClean=()=>alT.rows().map(r=>r.slice(1).map(v=>+v===1?1:0));
const alSame=()=>JSON.stringify(alClean())===JSON.stringify(AL_TX);
let alLast=null;
function alRun(){
  const ms=+$('alMs').value, mc=+$('alMc').value, zero=$('alZero').checked, R=alT.rows();
  $('alMsV').textContent=`${ms.toFixed(2)} (${Math.round(ms*100)} %)`; $('alMcV').textContent=`${mc.toFixed(2)} (${Math.round(mc*100)} %)`;
  const bad=R.reduce((s,r)=>s+r.slice(1).filter(v=>v!==0&&v!==1).length,0);
  $('alWarn').innerHTML=bad?`⚠️ 0이나 1이 아닌 칸이 ${bad}개 있어요. 그 칸은 0(안 삼)으로 보고 계산해요.`:`고객 ${R.length}명 · 칸을 눌러 0과 1을 바꿔 적을 수 있어요.`;
  const res=alMine(alClean(),ms,mc,zero); alLast={ms,mc,zero,n:R.length,res};
  $('alNf').textContent=res.nf+'개'; $('alNr').textContent=res.rules.length+'개';
  const show=res.rules.slice(0,20);
  $('alRules').innerHTML='<tr><th>조건 (Antecedent)</th><th></th><th>결과 (Consequent)</th><th>지지도 supp</th><th>신뢰도 conf</th><th>향상도 lift</th></tr>'+
    (show.length?show.map(r=>`<tr class="${r.lift>1+1e-9?'up':r.lift<1-1e-9?'dn':''}"><td>${esc(r.A)}</td><td>→</td><td>${esc(r.C)}</td><td>${r.s.toFixed(3)}</td><td>${r.conf.toFixed(3)}</td><td><b>${r.lift.toFixed(3)}</b></td></tr>`).join('')
      :'<tr><td colspan="6" class="muted">기준을 넘는 규칙이 없어요. 최소 지지도나 최소 신뢰도를 낮춰 보세요.</td></tr>');
  $('alMore').textContent=(res.rules.length>20?`규칙 ${res.rules.length}개 가운데 20개만 보여요. `:'')+'향상도가 큰 순서, 같으면 지지도가 큰 순서예요. 초록 줄은 향상도 > 1, 빨간 줄은 향상도 < 1이에요.';
}
['alMs','alMc','alZero'].forEach(id=>$(id).addEventListener('input',alRun));
$('alAdd').onclick=()=>{ const R=alT.rows(); if(R.length>=20) return; R.push([R.length+1,0,0,0,0,0,0]); alT.set(R); alRun(); };
$('alDel').onclick=()=>{ const R=alT.rows(); if(R.length<=2) return; R.pop(); alT.set(R); alRun(); };
$('alBack').onclick=()=>{ alT.set(AL_TX.map((r,i)=>[i+1,...r])); alRun(); };
const alLogArr=()=>String(MEMO.ruleLog||'').split(' / ').filter(Boolean);
function alLogDraw(){ $('alLog').innerHTML=alLogArr().map(s=>`<li>${esc(s)}</li>`).join('')||'<li class="muted">아직 기록이 없어요.</li>'; }
$('alSave').onclick=()=>{
  if(!alLast) return; const {ms,mc,zero,n,res}=alLast, top=res.rules[0];
  const s=`지지도 ${ms.toFixed(2)} · 신뢰도 ${mc.toFixed(2)} · ${zero?'=0 포함':'산 것만'} · 고객 ${n}명${alSame()?'':'(표 고침)'} → 규칙 ${res.rules.length}개`+(top?`, 향상도 1위 ${top.A} → ${top.C} (${top.lift.toFixed(2)})`:'');
  const L=alLogArr().filter(x=>x!==s); L.push(s); MEMO.ruleLog=L.slice(-5).join(' / '); store.set(MK,MEMO); alLogDraw();
};
$('alClr').onclick=()=>{ MEMO.ruleLog=''; store.set(MK,MEMO); alLogDraw(); };
alRun(); alLogDraw();

/* 04 정리 · 내 실력 점검하기 (166쪽 평가 기준) */
chips('skillChk','skillCheck',['군집 분석을 설명할 수 있다','여러 속성의 유사성으로 군집을 만들 수 있다','분석 결과의 의미를 비판적으로 해석할 수 있다'],true);

/* 05 마무리 */
const MEMOLIST=[['guessCount','처음 예상: 만들 수 있는 규칙 수'],['binLog','0/1 표 만들기 확인'],['alDonePick','오렌지3 진행 체크'],['arN1','규칙 수 (3 % · 70 %)'],['arN2','규칙 수 (30 % · 70 %)'],['arTop2','고른 규칙 (30 % · 70 %)'],['arMean','오렌지3 결과 해석'],['ruleLog','연관 규칙 찾기 체험 기록'],['ruleNote','구매 항목을 바꾸었을 때'],['pyNote','(선택) 파이썬 함께 해결하기'],['clusterNote','군집 분석 돌아보기'],['skillCheck','내 실력 점검'],['extraNote','(선택) 광고 데이터 활동'],['planCheck','나의 계획 점검 · 새롭게 알게 된 점'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[5]=()=>{
  $('planCl').textContent=memoOf('u3-clustering','plan')||'(적어 둔 계획이 없어요)';
  $('planAs').textContent=memoOf('u3-association','plan')||'(적어 둔 계획이 없어요)';
  memoSummary('msum',MEMOLIST.filter(([k,l])=>!l.startsWith('(선택)')||String(MEMO[k]||'').trim()));
};

/* 01 표 Ⅰ-10: 칸을 누르면 데이터와 데이터셋 */
(function(){
  const T=$('bookTbl'), cap=$('bookCap'), head=[...T.rows[0].cells].map(c=>c.textContent);
  T.querySelectorAll('td').forEach(td=>td.onclick=()=>{
    T.querySelectorAll('td.on').forEach(x=>x.classList.remove('on'));
    td.classList.add('on'); T.classList.add('all');
    const col=head[td.cellIndex], id=td.parentElement.cells[0].textContent;
    cap.innerHTML=`ID ${id}번 책의 「${esc(col)}」 칸 값 <b>${esc(td.textContent)}</b> 하나하나가 <b>데이터</b>예요. 이런 데이터를 정해진 항목(필드)에 맞춰 묶은 <b>표 전체</b>(테두리 상자)가 <b>데이터셋</b>이에요.`;
  });
})();

/* 01 스스로 해결하기 · 21세기 다산 되기 (36쪽 실습 데이터의 수원·광주 시트) */
(function(){
  const KIND=['소나무','잣나무','단풍나무','뽕나무'], YEARS=[2019,2020,2021,2022];
  const TOWN=[
    {n:'수원',rows:[['2019-04-05',[4,0,0,0]],['2019-05-15',[4,0,5,0]],['2020-02-11',[0,4,0,0]],['2020-09-14',[1,0,0,5]],['2021-04-05',[0,4,2,0]],['2021-10-11',[0,3,0,5]],['2022-04-19',[0,0,6,0]]]},
    {n:'광주',rows:[['2019-03-15',[2,3,0,0]],['2019-05-26',[0,1,0,3]],['2020-07-18',[0,4,3,0]],['2020-11-21',[2,0,1,3]],['2021-10-05',[1,1,3,0]],['2022-03-24',[0,2,4,5]],['2022-04-19',[1,0,0,5]]]},
  ];
  const sum=a=>a.reduce((x,y)=>x+y,0);
  const B=$('dasanSim'); let tab, pick, done, agg, cnt, miss, msg;
  function reset(){tab=0; pick=null; done=TOWN.map(t=>t.rows.map(()=>false)); agg=YEARS.map(()=>[0,0]); cnt=YEARS.map(()=>[0,0]); miss=0;
    msg='시트에서 기록 한 줄을 눌러 고르세요.'; draw();}
  function left(){return done.flat().filter(x=>!x).length;}
  function place(t,r,y){const rec=TOWN[t].rows[r]; done[t][r]=true; agg[y][t]+=sum(rec[1]); cnt[y][t]++;}
  function draw(){
    const L=left(), T=TOWN[tab];
    const parts=p=>p[1].map((v,k)=>v?`${KIND[k]} ${v}`:'').filter(Boolean).join(' + ');
    B.innerHTML=`<div class="db-ds">
      <div class="db-ds-l">
        <div class="db-tabs">${TOWN.map((t,i)=>`<button data-t="${i}" class="${i===tab?'on':''}">${t.n} 시트 <small>${t.rows.filter((_,r)=>!done[i][r]).length}줄 남음</small></button>`).join('')}</div>
        <div class="db-scroll"><table class="db-tbl db-sheet">
          <tr><th>날짜</th>${KIND.map(k=>`<th>${k}</th>`).join('')}</tr>
          ${T.rows.map((r,i)=>`<tr data-r="${i}" class="${done[tab][i]?'done':''} ${pick&&pick[0]===tab&&pick[1]===i?'pick':''}"><td class="mono">${r[0]}</td>${r[1].map(v=>`<td>${v||''}</td>`).join('')}</tr>`).join('')}
        </table></div>
        <p class="note">빈칸은 그날 심지 않은 나무예요. 한 줄에 여러 종류가 있으면 모두 더해서 집계해요.</p>
      </div>
      <div class="db-ds-r">
        <b class="db-agt">총 식수량 데이터셋</b>
        <div class="db-scroll"><table class="db-tbl db-agg">
          <tr><th>연도</th><th>수원</th><th>광주</th></tr>
          ${YEARS.map((y,i)=>`<tr><th>${y}</th>${[0,1].map(t=>`<td data-y="${i}" data-t="${t}" class="${pick?'can':''}">${cnt[i][t]?`<b>${agg[i][t]}</b><small>${cnt[i][t]}건</small>`:'<span class="muted">·</span>'}</td>`).join('')}</tr>`).join('')}
          ${L===0?`<tr class="sum"><th>합계</th>${[0,1].map(t=>`<td><b>${sum(agg.map(a=>a[t]))}</b></td>`).join('')}</tr>`:''}
        </table></div>
        <div class="db-stat">남은 기록 <b>${L}</b>줄 · 잘못 넣으려 한 횟수 <b class="${miss?'ng':''}">${miss}</b></div>
      </div>
    </div>
    <div class="db-fb">${msg}</div>
    <div class="row" style="margin-top:8px"><button class="btn ghost sm" data-k="all" ${L?'':'disabled'}>남은 기록 한 번에 넣기</button><button class="btn ghost sm" data-k="re">처음부터 다시</button></div>`;
    B.querySelectorAll('[data-t]').forEach(b=>{ if(b.tagName==='BUTTON') b.onclick=()=>{tab=+b.dataset.t; draw();}; });
    B.querySelectorAll('.db-sheet tr[data-r]').forEach(tr=>tr.onclick=()=>{const r=+tr.dataset.r;
      if(done[tab][r]){msg='이 기록은 이미 집계 표에 넣었어요. 아직 흐린 색이 아닌 줄을 골라요.'; draw(); return;}
      pick=[tab,r]; const rec=TOWN[tab].rows[r];
      msg=`<b>${TOWN[tab].n} · ${rec[0]}</b> 기록을 골랐어요(${parts(rec)} = ${sum(rec[1])}그루). 이제 오른쪽 집계 표에서 이 기록이 들어갈 칸을 눌러요.`; draw();});
    B.querySelectorAll('.db-agg td[data-y]').forEach(td=>td.onclick=()=>{
      if(!pick){msg='먼저 왼쪽 시트에서 기록 한 줄을 골라요.'; draw(); return;}
      const [t,r]=pick, rec=TOWN[t].rows[r], y=+td.dataset.y, tt=+td.dataset.t, ry=YEARS.indexOf(+rec[0].slice(0,4));
      if(y===ry && tt===t){place(t,r,y); pick=null;
        msg=left()?`<span class="ok">맞아요!</span> ${YEARS[y]}년 ${TOWN[t].n} 칸에 <b>${sum(rec[1])}그루</b>(${parts(rec)})를 더했어요. 다음 기록을 골라요.`
          :`<span class="ok">완성!</span> 흩어진 기록 14줄이 <b>연도 × 고을</b> 표 하나로 모였어요. 교과서 36쪽의 총 식수량 데이터셋과 비교해 보고, 맨 아래 <b>합계</b> 줄로 4년 동안 더 많이 심은 고을을 찾아보세요.`;}
      else{miss++; const why=[]; if(tt!==t) why.push(`이 기록은 <b>${TOWN[t].n}</b> 시트에 있어요`); if(y!==ry) why.push(`날짜의 연도가 <b>${YEARS[ry]}</b>년이에요`);
        msg=`<span class="ng">다른 칸이에요.</span> ${why.join(', ')}. 고을과 연도를 함께 확인해요.`;}
      draw();});
    B.querySelector('[data-k=all]').onclick=()=>{TOWN.forEach((T2,t)=>T2.rows.forEach((rec,r)=>{if(!done[t][r]) place(t,r,YEARS.indexOf(+rec[0].slice(0,4)));})); pick=null;
      msg='남은 기록을 모두 넣었어요. 표 맨 아래 <b>합계</b> 줄로 4년 동안 더 많이 심은 고을을 찾아보세요. (스프레드시트에서는 함수를 써서 이런 집계를 한 번에 할 수도 있어요.)'; draw();};
    B.querySelector('[data-k=re]').onclick=reset;
  }
  reset();
})();

/* 02 데이터셋일까, 데이터베이스일까? */
sorter('dsdbGame',{
  cats:[{n:'📊 데이터셋',k:'#1f9d74'},{n:'🗄️ 데이터베이스',k:'#e0702b'}],
  items:[
    {t:'기계학습 훈련에 쓰려고 고양이 사진 파일 이름과 이름표를 CSV 파일 하나에 정리한다',c:0,ic:'🐱',w:'기계학습 훈련이라는 특정 용도로, CSV 파일 형식에 모은 데이터의 집합이에요.'},
    {t:'학교 전체 기록 가운데 우리 반 체육 측정 결과만 뽑아 스프레드시트 한 장에 옮겼다',c:0,ic:'🏃',w:'더 큰 데이터에서 추출한 하위 집합을 분석에 쓰고 있어요.'},
    {t:'지역 기온 관측 기록에서 지난여름 값만 골라 그래프용 표를 만들었다',c:0,ic:'🌡️',w:'그래프를 그리는 특정 분석 목적으로 골라 모은 데이터예요.'},
    {t:'온라인 쇼핑몰이 몇 년 동안 쌓은 상품·주문·회원 정보를 앱과 누리집에서 함께 꺼내 썼다',c:1,ic:'🛒',w:'조직의 운영을 위해 대량의 데이터를 장기적으로 저장하고 여러 응용 프로그램이 함께 써요.'},
    {t:'학교가 전교생의 출결·성적 정보를 오랫동안 보관하고, 여러 선생님이 동시에 조회한다',c:1,ic:'🏫',w:'여러 사용자가 동시에 접근하고, 장기적인 저장과 활용이 목적이에요.'},
    {t:'병원이 여러 진료과에서 꺼내 볼 수 있도록 진료 기록, 엑스레이 사진, 처방 정보를 함께 저장했다',c:1,ic:'🏥',w:'텍스트·숫자·이미지 등 다양한 유형의 데이터를 저장하고 여러 곳에서 활용해요.'},
  ],
  end:'<b>정리</b> 특정 용도로 모은 데이터의 집합은 <b>데이터셋</b>, 여러 데이터셋을 컴퓨터로 체계적으로 저장해 여럿이 오래 함께 쓰는 것은 <b>데이터베이스</b>예요.'
});

/* 02 은행 업무를 스프레드시트로? */
vote('bankVote','bankSheet',[['🙆 가능할 것 같다'],['🙅 어려울 것 같다'],['🤔 잘 모르겠다']],()=>{
  $('bankWhy').innerHTML=`<b>교과서 38쪽에서는 이렇게 말해요.</b> 하나의 스프레드시트를 <b>여러 명이 동시에 접속</b>해서 쓰는 것은 쉽지 않아요. 또 <b>수백만 건 이상</b>의 데이터를 하나의 시트에 저장하는 것도 사실상 불가능해요. 이런 문제를 해결하려고 등장한 것이 다음 화면의 <b>데이터베이스 관리 시스템</b>이에요.`;
});

/* 03 더 알아보기 · ATM 트랜잭션 실험 */
(function(){
  const WHEN=[['pin','① 비밀번호 입력 때'],['ok','② 인출 승인 때'],['late','③ 현금 지급 뒤'],['tx','④ 트랜잭션으로 묶기']];
  const EV=[['none','😊 아무 일 없음'],['power','⚡ 현금 지급 직전 정전'],['both','👥 동시 요청']];
  const STEPS=['인출 요청 70,000원','비밀번호 입력','인출 승인','현금 지급'];
  const won=n=>n.toLocaleString('ko-KR')+'원';
  const B=$('atmSim'); let w=null, e=null, log=null, res=null, rec={};
  function run(){
    const L=[], early=(w==='pin'||w==='ok'); let bal=100000, cash=0, other=0, ok=true, why='';
    const at=w==='pin'?1:w==='ok'?2:-1;
    L.push(['💳','내 ATM: <b>인출 요청 70,000원</b> (계좌 잔액 100,000원)']);
    for(let s=1;s<=3;s++){
      if(s===3 && e==='power'){
        L.push(['⚡','<b>정전!</b> 현금이 나오기 직전에 ATM이 꺼졌어요.']);
        if(early){ok=false; why='계좌에서는 돈이 빠진 것으로 기록되었는데, 실제로는 현금을 받지 못했어요. <b>너무 일찍 기록</b>한 탓이에요.';}
        else if(w==='tx'){L.push(['↩️','트랜잭션이 끝나지 않았으니 <b>기록하지 않고 취소</b>해요. 처음 상태 그대로예요.']); why='트랜잭션이 완료되지 않아 아무것도 기록되지 않았어요. 잔액도 현금도 처음 그대로라서 다시 시도하면 돼요.';}
        else {why='현금 지급 전에 멈췄고 아직 기록하지 않았으니 잔액도 그대로예요. 정전에는 괜찮았지만, <b>늦게 기록해도 동시 요청에는 위험해요.</b> 같은 시점(③)으로 👥 동시 요청을 실행해 보세요.';}
        break;
      }
      L.push(['▶️',`내 ATM: ${STEPS[s]}`+(s===3?' — 현금 70,000원이 나왔어요':'')]);
      if(s===3) cash+=70000;
      if(s===at){bal-=70000; L.push(['📝',`<b>계좌에 기록</b>: 잔액 ${won(bal)}`]);}
      if(s===2 && e==='both'){
        if(w==='tx'){L.push(['⏳','어머니가 다른 ATM에서 같은 계좌로 70,000원 인출 요청 → 내 트랜잭션이 끝날 때까지 <b>기다려요</b>.']);}
        else{
          L.push(['👩',`어머니가 다른 ATM에서 같은 계좌로 70,000원 인출 요청 → 지금 기록된 잔액은 <b>${won(bal)}</b>`]);
          if(bal>=70000){other=70000; L.push(['💸','잔액이 충분해 보여서 <b>어머니의 인출도 승인</b>, 현금 70,000원이 나갔어요.']);}
          else L.push(['🙅','잔액이 부족해서 어머니의 인출은 <b>거절</b>돼요.']);
        }
      }
    }
    if(e!=='power' || early){
      if(w==='late' && !(e==='power')){bal=100000-70000; L.push(['📝',`현금 지급 뒤 <b>계좌에 기록</b>: 잔액 ${won(bal)}`]);
        if(other){L.push(['📝',`어머니 ATM도 처음 본 잔액 100,000원에서 빼서 기록: 잔액 ${won(100000-70000)}`]); ok=false; why='두 요청 모두 기록 전의 잔액 100,000원을 보고 승인되어 <b>140,000원</b>이 나갔는데, 계좌에는 30,000원이 남은 것으로 기록되었어요. <b>기록이 늦어</b> 계좌에 없는 돈까지 인출됐어요.';}
      }
      if(w==='tx' && e!=='power'){bal=30000; L.push(['✅','모든 과정이 끝났으니 <b>트랜잭션을 한 번에 기록</b>: 잔액 30,000원']);
        if(e==='both'){L.push(['👩','이제 어머니의 요청을 처리해요. 기록된 잔액은 30,000원 → 잔액이 부족해 <b>거절</b>돼요.']);}
      }
    }
    if(!why) why=e==='both'?'먼저 기록된 잔액을 보고 어머니의 요청이 거절되어 계좌에 있는 돈만큼만 나갔어요.':'잔액 기록과 실제로 나간 현금이 서로 맞아요.';
    const out=cash+other;
    if(ok && out!==100000-bal) ok=false;
    log=L; res={ok,why,bal,out}; rec[w+'|'+e]=ok;
  }
  function draw(){
    const n=Object.keys(rec).length;
    B.innerHTML=`<div class="db-atm-story">🏦 어머니 계좌에 <b>100,000원</b>이 있어요. 내가 ATM에서 <b>70,000원</b>을 찾으려고 해요. <span class="muted">(금액은 예시)</span></div>
      <div class="db-atm-steps">${STEPS.map((s,i)=>`<span>${s}</span>${i<3?'<i>→</i>':''}`).join('')}</div>
      <div class="db-atm-pick"><b>계좌에 기록하는 시점</b><div class="row">${WHEN.map(x=>`<button class="db-opt ${w===x[0]?'on':''}" data-w="${x[0]}">${x[1]}</button>`).join('')}</div></div>
      <div class="db-atm-pick"><b>일어날 일</b><div class="row">${EV.map(x=>`<button class="db-opt ${e===x[0]?'on':''}" data-e="${x[0]}">${x[1]}</button>`).join('')}</div>
        <small class="muted">동시 요청: 내가 돈을 찾는 동안, 어머니도 다른 ATM에서 같은 계좌로 70,000원을 찾으려고 해요.</small></div>
      <div class="row"><button class="btn sm" data-k="run" ${w&&e?'':'disabled'}>실행 ▶</button><button class="btn ghost sm" data-k="clr">기록표 지우기</button></div>
      ${log?`<div class="db-atm-out ${res.ok?'good':'bad'}"><ol class="db-log">${log.map(l=>`<li><i>${l[0]}</i><span>${l[1]}</span></li>`).join('')}</ol>
        <div class="db-atm-res"><span>계좌에 기록된 잔액 <b>${won(res.bal)}</b></span><span>실제로 나간 현금 <b>${won(res.out)}</b></span><span class="${res.ok?'ok':'ng'}">${res.ok?'✅ 기록과 현금이 맞아요':'⚠️ 기록과 현금이 어긋났어요'}</span></div>
        <p>${res.why}</p></div>`:''}
      <div class="db-scroll"><table class="db-tbl db-atm-tbl"><tr><th>기록 시점 \\ 일어날 일</th>${EV.map(x=>`<th>${x[1]}</th>`).join('')}</tr>
        ${WHEN.map(x=>`<tr><th>${x[1]}</th>${EV.map(y=>{const v=rec[x[0]+'|'+y[0]];return `<td>${v==null?'<span class="muted">·</span>':v?'✅':'⚠️'}</td>`;}).join('')}</tr>`).join('')}</table></div>
      <p class="note">실험 기록표 ${n} / 12칸. ⚠️가 나온 칸을 보고 그 까닭을 생각해 보세요.</p>`;
    B.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{w=b.dataset.w; log=null; draw();});
    B.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>{e=b.dataset.e; log=null; draw();});
    B.querySelector('[data-k=run]').onclick=()=>{run(); draw();};
    B.querySelector('[data-k=clr]').onclick=()=>{rec={}; log=null; draw();};
  }
  draw();
})();

/* 04 마무리 */
const MEMOLIST=[['whyDiff','생각 정리하기 · 두 신하가 다르게 해석한 이유'],['planDasan','나의 계획 · 내가 다산이라면'],['dasanNote','21세기 다산 · 더 많이 심은 고을과 모은 기준'],['bankSheet','은행 업무를 스프레드시트로?'],['bankNote','스프레드시트 한 장으로 하면 생길 문제'],['atmNote','ATM 트랜잭션 실험에서 알게 된 것'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[4]=()=>memoSummary('msum',MEMOLIST);

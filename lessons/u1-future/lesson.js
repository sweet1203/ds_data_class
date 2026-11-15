
/* 0 시작 · 상식 문제(교과서 48쪽): 한 번 고르면 잠그고 정답 공개 */
vote('q48Vote','guess48',[['① 20%'],['② 40%'],['③ 60%']],i=>{
  $('q48Vote').querySelectorAll('button').forEach(b=>b.disabled=true);
  $('q48Mine').innerHTML=i===2?'내가 고른 답도 ③이에요. 맞혔어요!':`내가 고른 답은 ${['①','②'][i]}이었어요.`;
  $('q48Reveal').classList.add('on');
});

/* 01 머니볼 지표 카드 (교과서 49쪽 설명 범위) */
flipCards('mbCards',[
  {ic:'🏃',f:'OBP',s:'눌러서 뜻 보기',b:'<b>출루율</b><br>머니볼 전략에서 선수의 가치를 평가하는 주요 지표 중 하나예요.'},
  {ic:'💥',f:'SLG',s:'눌러서 뜻 보기',b:'<b>장타율</b><br>머니볼 전략에서 선수의 가치를 평가하는 주요 지표 중 하나예요.'},
  {ic:'➕',f:'OPS',s:'눌러서 뜻 보기',b:'<b>출루율 + 장타율</b><br>OBP와 SLG를 더한 값으로 선수의 가치를 평가해요.'},
  {ic:'🏆',f:'WAR',s:'눌러서 뜻 보기',b:'<b>대체 선수 대비 승리 기여도</b><br>머니볼 전략에서 선수의 가치를 평가하는 주요 지표 중 하나예요.'},
]);

/* 02 데이터 시대의 미래 직업 (교과서 50~51쪽) */
const FIELDS=[
  {ic:'💰',n:'금융 분야',k:'#2f6fd0',jobs:[
    {n:'데이터 분석 전문가',d:'금융 기관의 방대한 데이터를 분석하여 의사 결정을 지원한다.',t:['고객 행동 패턴 분석을 통한 맞춤형 금융 상품 개발','리스크 관리 모델 구축','부정 거래 탐지 시스템 개발']},
    {n:'퀀트 애널리스트',d:'수학적 모델을 사용하여 금융 시장을 분석하고 투자 전략을 수립한다.',t:['알고리즘 트레이딩 전략 개발','포트폴리오 최적화 모델 구축','금융 상품 가격 결정 모델 개발']}]},
  {ic:'🏥',n:'의료 분야',k:'#d64535',jobs:[
    {n:'의료 데이터 사이언티스트',d:'환자 데이터를 분석하여 진단과 치료를 지원한다.',t:['의료 영상(X-ray, MRI 등) 분석 인공지능 모델 개발','환자 데이터 기반 질병 예측 모델 구축','개인화된 치료법 추천 시스템 개발']},
    {n:'바이오인포매틱스 전문가',d:'유전체 데이터를 분석하여 질병의 원인을 규명하고 신약 개발을 지원한다.',t:['유전체 서열 분석 알고리즘 개발','단백질 구조 예측 모델 구축','약물 반응성 예측 시스템 개발']}]},
  {ic:'📚',n:'교육 분야',k:'#1f9d74',jobs:[
    {n:'교육 데이터 분석가',d:'학생들의 학습 데이터를 분석하여 개인화된 학습 경험을 제공한다.',t:['학생 성취도 예측 모델 개발','맞춤형 학습 콘텐츠 추천 시스템 구축','학습 패턴 분석을 통한 교육 과정 최적화']},
    {n:'에듀테크 데이터 사이언티스트',d:'온라인 학습 플랫폼의 데이터를 활용하여 학습 효과를 극대화한다.',t:['학습자 행동 분석을 통한 웹 사이트 디자인 최적화','실시간 학습 진도 모니터링 시스템 개발','자연어 처리를 활용한 자동 채점 시스템 구축']}]},
  {ic:'🚦',n:'교통 분야',k:'#e0702b',jobs:[
    {n:'교통 데이터 분석가',d:'실시간 교통 데이터를 분석하여 교통 흐름을 최적화한다.',t:['실시간 교통량 예측 모델 개발','신호 체계 최적화 알고리즘 구축','대중교통 노선 최적화 시스템 개발']},
    {n:'자율주행 자동차 과학자',d:'차량 센서 데이터를 분석하여 안전하고 효율적인 자율주행 시스템을 개발한다.',t:['객체 인식 및 추적 알고리즘 개발','경로 계획 및 의사 결정 모델 구축','차량 간 통신 시스템 최적화']}]},
];
tabs('jobTabs','jobView',FIELDS,f=>`<div class="cards2">${f.jobs.map(j=>`<div class="kc" style="--k:${f.k}"><h4>◆ ${j.n}</h4><p>${j.d}</p><div class="uf-task"><b>주요 업무</b><ul>${j.t.map(x=>`<li>${x}</li>`).join('')}</ul></div></div>`).join('')}</div>`);
const WEF=['분석적 사고와 혁신','복잡한 문제 해결','비판적 사고와 분석','창의성, 독창성, 주도성','활동적 학습과 학습 전략','회복력, 스트레스 내성, 유연성','리더십과 사회적 영향력','기술 사용, 모니터링, 통제','기술 설계와 프로그래밍'];
chips('compHave','compHave',WEF,true);
chips('compGrow','compGrow',WEF,true);
chips('jobPickChips','jobPick',FIELDS.flatMap(f=>f.jobs.map(j=>j.n)),false);

/* 03 정리 (선택) · 1 데이터·데이터셋·데이터베이스 */
sorter('dsSort',{
  cats:[{n:'데이터',k:'#2f6fd0'},{n:'데이터셋',k:'#1f9d74'},{n:'데이터베이스',k:'#9b4fc4'}],
  items:[
    {t:'반납함에 들어온 책 한 권의 반납 시각 「08:42」',c:0,ic:'⏰',short:'반납 시각 08:42',w:'관찰하고 측정해 얻은 하나하나의 실질적인 값이에요.'},
    {t:'출입문 온도계가 잰 오늘 아침 도서관 기온 21.5℃',c:0,ic:'🌡️',short:'오늘 아침 기온 21.5℃',w:'측정해서 얻은 값 하나, 개별적인 정보의 단위예요.'},
    {t:'한 달 동안의 대출 기록을 학생 ID·도서명·대출일 칸에 맞춰 모은 CSV 파일',c:1,ic:'📄',short:'한 달 대출 기록 CSV',w:'분석하기 쉽게 특정한 형식으로 모아 구조화한 집합이에요.'},
    {t:'독서 동아리 설문 응답을 분석하려고 한 장의 스프레드시트로 정리한 것',c:1,ic:'📊',short:'독서 동아리 설문 시트',w:'특정 용도(설문 분석)를 위해 한 가지 형식으로 정리한 집합이에요.'},
    {t:'학생 명부·도서 목록·대출 기록을 컴퓨터에 함께 저장해, 사서 선생님과 학생 여러 명이 동시에 검색하고 고치는 것',c:2,ic:'🗄️',short:'학교 도서관 시스템',w:'여러 묶음을 체계적으로 저장하고 여러 사용자가 동시에 접근해 관리해요.'},
    {t:'전국 공공 도서관의 소장 도서 정보를 오랫동안 저장해 여러 앱이 함께 꺼내 쓰는 것',c:2,ic:'🌐',short:'전국 공공 도서관 정보',w:'장기적으로 저장하고 다양한 응용 프로그램에서 활용하도록 구성했어요.'},
  ],
  end:'<b>정리</b> 하나하나의 값은 <b>데이터</b>, 분석하기 쉽게 한 형식으로 모은 것은 <b>데이터셋</b>, 여러 사용자가 컴퓨터로 편리하게 저장·접근하도록 체계적으로 구성한 것은 <b>데이터베이스</b>예요.'
});

/* 03 정리 (선택) · 2 도서 대출 정보 통합 (교과서 52쪽 표 값) */
(function(){
  const LOAN=[['S001','데미안','2024-05-10','2024-05-15'],['S002','이방인','2024-05-12','2024-05-16'],['S003','진달래꽃','2024-05-13','2024-05-19'],['S002','이방인','2024-05-15','2024-05-20']];
  const STU_BOOK=[['S001','김소영','1','3'],['S002','이영준','2','1'],['S002','박민수','3','2']];
  const LH=['학생 ID','도서명','대출일','반납일'], SH=['학생 ID','이름','학년','반'], ADD=['이름','학년','반'], COL='ABCDEFG';
  const STEPS=['잘못된 곳 찾기','이대로 통합하면?','고치기','한 칸씩 통합하기'];
  const B=$('lnSim');
  let st, stu, hint, tries, fixTries, msg, fill, cur, wrongNow, first, wrong, auto, manual;
  function reset(){st=0; stu=STU_BOOK.map(r=>r.slice()); hint=false; tries=0; fixTries=0; msg=''; fill=LOAN.map(()=>[null,null,null]); cur=0; wrongNow=false; first=0; wrong=0; auto=false; manual=0; draw();}
  const look=id=>stu.find(r=>r[0]===id);
  /* 스프레드시트 모양 표: 열 문자 + 행 번호 */
  function sheet(name,head,rows,cellCls,extra){
    const n=head.length+(extra?extra.head.length:0);
    let h=`<div class="uf-sheet"><div class="uf-sname">📄 ${name}</div><div style="overflow-x:auto"><table><tr><th class="rn"></th>${[...COL.slice(0,n)].map(c=>`<th class="cl">${c}</th>`).join('')}</tr>`;
    h+=`<tr><th class="rn">1</th>${head.map(x=>`<th>${x}</th>`).join('')}${extra?extra.head.map(x=>`<th class="add">${x}</th>`).join(''):''}</tr>`;
    rows.forEach((r,i)=>{h+=`<tr><th class="rn">${i+2}</th>${r.map((v,j)=>{const c=cellCls(i,j,v); return `<td class="${c.cls||''}" ${c.k?`data-t="${c.k}" data-r="${i}" data-c="${j}"`:''}>${c.v!=null?c.v:v}</td>`;}).join('')}${extra?extra.cells(i):''}</tr>`;});
    return h+'</table></div></div>';
  }
  function steps(){return `<div class="uf-steps">${STEPS.map((s,i)=>`<span class="${i===st?'on':i<st?'done':''}">${'①②③④'[i]} ${s}</span>`).join('')}</div>`;}
  function draw(){
    let h=steps(), body='', side='';
    if(st===0){
      body=sheet('도서 대출 정보',LH,LOAN,()=>({k:'loan',cls:'k'}))+sheet('학생',SH,stu,()=>({k:'stu',cls:'k'}));
      side=`<p><b>두 표의 칸을 눌러 잘못된 곳을 찾아요.</b> <span class="muted">누른 횟수 ${tries}번</span></p>
        <button class="btn ghost sm" data-k="hint">${hint?'힌트 닫기':'💡 힌트'}</button>
        ${hint?'<div class="callout" style="margin-bottom:0"><b>기본키</b>는 각 테이블 안에서 데이터를 고유하게 식별하는 키예요. 그래서 <b>중복되는 값이 없어야</b> 해요. 학생 테이블의 기본키는 무엇일까요?</div>':''}`;
    } else if(st===1){
      body=sheet('학생 (교과서 그대로)',SH,stu,(i,j)=>({cls:j===0&&i>0?'bad':''}))+sheet('도서 대출 정보 + 통합 결과',LH,LOAN,()=>({}),{head:ADD,cells:i=>{const r=STU_BOOK.find(x=>x[0]===LOAN[i][0]); return r?r.slice(1).map(v=>`<td class="${LOAN[i][0]==='S002'?'dup':''}">${v}</td>`).join(''):'<td class="na">#N/A</td>'.repeat(3);}});
      side=`<p><b>고치기 전에 이대로 VLOOKUP으로 통합하면 이렇게 돼요.</b></p>
        <ul class="uf-ul"><li><span class="na">#N/A</span> 학생 테이블에 <b>S003이 없어서</b> 진달래꽃을 빌린 학생을 찾지 못해요.</li>
        <li><span class="dup">이영준</span> S002를 찾으면 <b>위쪽에서 먼저 만난 이영준 행</b>의 값만 나와요. 박민수의 정보는 가져올 수 없고, 이 기록을 누가 빌렸는지도 확실하지 않아요.</li></ul>
        <button class="btn sm" data-k="next">③ 고치러 가기 →</button>`;
    } else if(st===2){
      body=sheet('학생',SH,stu,(i,j)=>i===2&&j===0?{cls:'act',v:'?'}:{});
      side=`<p><b>박민수의 학생 ID를 무엇으로 고칠까요?</b> <span class="muted">도서 대출 정보 테이블을 함께 떠올려 봐요.</span></p>
        <div class="row">${['S001','S002','S003','S004'].map(x=>`<button class="btn ghost sm" data-fix="${x}">${x}${x==='S002'?' (그대로)':''}</button>`).join('')}</div>`;
    } else {
      const done=cur>=12;
      body=sheet('학생',SH,stu,(i,j)=>({k:done?'':'pick',cls:(done?'':'k ')+(i===2&&j===0?'fixed':'')}))
        +sheet('도서 대출 정보',LH,LOAN,(i,j)=>({cls:!done&&j===0&&i===Math.floor(cur/3)?'look':''}),{head:ADD,cells:i=>[0,1,2].map(c=>{const v=fill[i][c]; const on=!done&&cur===i*3+c; return `<td class="tg ${on?'act':''} ${v!=null?'okc':''}">${v!=null?v:''}</td>`;}).join('')});
      if(!done){
        const r=Math.floor(cur/3), c=cur%3, addr=COL[4+c]+(r+2), id=LOAN[r][0];
        side=`<div class="uf-fx"><span class="addr">${addr}</span><code>=VLOOKUP(A${r+2}, 학생!A:D, ${c+2}, FALSE)</code></div>
          <div class="uf-arg"><span><b>A${r+2}</b> 찾을 값 <em>${id}</em></span><span><b>학생!A:D</b> 학생 시트의 A~D열</span><span><b>${c+2}</b> ${c+2}번째 열(${SH[c+1]})</span><span><b>FALSE</b> 정확히 같은 값</span></div>
          <p><b>학생 시트에서 ${addr}에 가져올 칸을 눌러요.</b> <span class="muted">채운 칸 ${cur} / 12 · 한 번에 맞힌 칸 ${first}</span></p>
          ${cur>=3&&!auto?'<button class="btn ghost sm" data-k="auto">남은 칸 한꺼번에 채우기 (수식을 아래로 복사)</button>':''}`;
      } else {
        side=`<p class="ok">🎉 통합 완료!</p><p>${auto?`직접 채운 ${manual}칸 가운데`:'12칸 가운데'} <b>${first}칸</b>을 한 번에 맞혔어요. 잘못 누른 횟수 ${wrong}번.</p>
          <p>학생 ID를 기준으로 흩어져 있던 두 테이블이 하나가 되었어요. 이제 「몇 학년이 책을 많이 빌렸을까?」처럼 두 테이블의 속성을 함께 분석할 수 있어요.</p>`;
      }
    }
    h+=`<div class="uf-ln"><div class="uf-tabs">${body}</div><div class="uf-side">${side}<div class="uf-msg">${msg}</div><div class="row" style="margin-top:8px"><button class="btn ghost sm" data-k="reset">처음부터 다시</button></div></div></div>`;
    B.innerHTML=h;
  }
  function pickFind(t,r,c){
    tries++;
    if(t==='stu'&&c===0&&r>0){st=1; msg=`<span class="ok">찾았어요!</span> (${tries}번 만에) 학생 ID <b>S002</b>가 이영준과 박민수 <b>두 명</b>에게 붙어 있어요. 학생 ID는 학생 테이블의 <b>기본키</b>라서 중복되는 값이 없어야 해요.`; return;}
    const v=(t==='stu'?stu:LOAN)[r][c];
    if(t==='stu') msg=c===0?'S001은 한 번만 나와요. 다른 학생 ID도 살펴봐요.':`「${v}」 자체는 이상하지 않아요. 학생 한 명을 다른 학생과 구별해 주는 칸을 살펴봐요.`;
    else if(c===0&&v==='S002') msg='도서 대출 정보에는 S002가 두 번 나오지만 괜찮아요. 한 학생이 책을 여러 번 빌릴 수 있으니까요. 여기의 학생 ID는 학생 테이블을 가리키는 <b>외래키</b> 역할이에요.';
    else if(c===0&&v==='S003') msg='좋은 단서예요. 학생 테이블에 S003이 있나요? 이번에는 <b>학생 테이블</b>을 살펴봐요.';
    else msg='대출 기록의 값은 이상하지 않아요. <b>학생 테이블</b>도 살펴봐요.';
  }
  function doFix(x){
    fixTries++;
    if(x==='S003'){stu[2][0]='S003'; st=3; msg=`<span class="ok">맞아요.</span> 도서 대출 정보에는 S003(진달래꽃)이 있는데 학생 테이블에는 없었어요. 박민수를 <b>S003</b>으로 고치면 중복도 없어지고 모든 대출 기록의 주인을 찾을 수 있어요. 이제 한 칸씩 통합해요.`; return;}
    msg={S001:'S001은 이미 김소영의 학생 ID예요. 또 중복이 생겨요.',S002:'그대로 두면 이영준과 겹쳐서 기본키가 될 수 없어요.',S004:'중복은 없어지지만, 도서 대출 정보의 S003(진달래꽃)을 빌린 학생을 학생 테이블에서 찾을 수 없어요. 대출 기록과 맞는 ID를 골라 봐요.'}[x];
  }
  function pickCell(r2,c2){
    const r=Math.floor(cur/3), c=cur%3, id=LOAN[r][0], tr=stu.findIndex(x=>x[0]===id), tc=c+1;
    if(r2===tr&&c2===tc){
      fill[r][c]=stu[tr][tc]; if(!wrongNow) first++; wrongNow=false; cur++;
      msg=`<span class="ok">맞아요.</span> ${COL[4+c]}${r+2} 칸을 채웠어요 → 「${stu[tr][tc]}」`;
      if(cur>=12) msg='';
      return;
    }
    wrong++; wrongNow=true;
    if(r2!==tr) msg=`<span class="ng">다시 찾아요.</span> 누른 칸은 학생 ID 「${stu[r2][0]}」 행에 있어요. A${r+2}의 찾을 값은 「<b>${id}</b>」. 학생 시트 A열에서 같은 값을 찾아 그 행으로 가요.`;
    else if(c2===0) msg=`<span class="ng">행은 맞아요.</span> A열은 찾을 값(학생 ID)이 있는 열이에요. 열 번호 <b>${tc+1}</b> → A열부터 세어 ${tc+1}번째 열(${COL[tc]}열: ${SH[tc]})로 가요.`;
    else msg=`<span class="ng">행은 맞아요.</span> 열 번호 <b>${tc+1}</b> → 학생 시트의 ${tc+1}번째 열(${COL[tc]}열: ${SH[tc]})로 가요.`;
  }
  B.addEventListener('click',e=>{
    const k=e.target.closest('[data-k]'), f=e.target.closest('[data-fix]'), td=e.target.closest('td[data-t]');
    if(k){const a=k.dataset.k;
      if(a==='reset'){reset(); return;}
      if(a==='hint') hint=!hint;
      if(a==='next'){st=2; msg='';}
      if(a==='auto'){auto=true; manual=cur; for(let i=cur;i<12;i++){const r=Math.floor(i/3), c=i%3; fill[r][c]=look(LOAN[r][0])[c+1];} cur=12; msg='스프레드시트에서는 E2:G2의 수식을 아래로 끌어 복사하면 A2가 A3, A4, A5로 저절로 바뀌어요.';}
    }
    else if(f) doFix(f.dataset.fix);
    else if(td){const t=td.dataset.t, r=+td.dataset.r, c=+td.dataset.c;
      if(st===0) pickFind(t,r,c); else if(st===3&&t==='pick'&&cur<12) pickCell(r,c); else return;}
    else return;
    draw();
  });
  reset();
})();

chips('selfCheck52','selfCheck52',['데이터베이스의 기능과 필요성을 설명할 수 있다','공통된 속성을 기준으로 서로 다른 데이터셋을 통합할 수 있다','데이터를 선입견과 편견 없이 탐색하고 통합하려는 태도를 갖게 되었다'],true);

/* 04 마무리 */
const MEMOLIST=[['guess48','상식 문제 · 내가 고른 답'],['gapWhy','많은 사람이 틀린 까닭 · 내 근거'],['planFuture','나의 계획'],['relayData','계주 선수를 뽑을 데이터'],['compHave','나에게 있는 역량'],['compGrow','더 기르고 싶은 역량'],['jobPick','고른 직업'],['jobComp','고른 직업에 필요한 역량'],['dbNeed','(선택) 데이터베이스가 필요한 까닭'],['birthView','(선택) 1960년대 출산율 데이터를 보는 시각'],['extraAct','(선택) 보충·심화 활동'],['selfCheck52','(선택) 내 실력 점검'],['keyQ','오늘의 질문에 대한 내 답'],['planCheck','나의 계획 점검'],['planNew','(선택) 새롭게 알게 된 점']];
onShow[4]=()=>memoSummary('msum',MEMOLIST.filter(([k,l])=>!l.startsWith('(선택)')||String(MEMO[k]||'').trim()));

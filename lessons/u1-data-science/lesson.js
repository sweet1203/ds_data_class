
/* 0 시작 · 마시멜로 실험 */
vote('mallowVote','mallowPick',[['😊 믿을 수 있어요','실험으로 나온 결과니까'],['🤔 잘 모르겠어요','더 알아봐야 할 것 같아요'],['🙅 믿기 어려워요','따져 볼 점이 있어요']],()=>$('mallowMore').classList.add('on'));

/* 01 원 궤도 가정 → 관측 데이터 → 타원 궤도 */
(function(){
  const S=$('orbitSvg'), cx=170, cy=115, rx=120, ry=100, sx=cx+Math.sqrt(rx*rx-ry*ry), sy=cy;
  const L=[el('g',{},S),el('g',{},S),el('g',{},S)];
  el('circle',{cx:sx,cy:sy,r:104,fill:'none',stroke:'#8a94a3','stroke-width':2.5,'stroke-dasharray':'7 6'},L[0]);
  el('ellipse',{cx,cy,rx,ry,fill:'none',stroke:'#1f9d74','stroke-width':3},L[2]);
  for(let i=0;i<12;i++){const t=i/12*Math.PI*2+.2; el('circle',{cx:(cx+rx*Math.cos(t)).toFixed(1),cy:(cy+ry*Math.sin(t)).toFixed(1),r:5,fill:'#f2a516',stroke:'#0f2742','stroke-width':1},L[1]);}
  el('circle',{cx:sx,cy:sy,r:11,fill:'#f2a516'},S); el('text',{x:sx,y:sy+28,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#0f2742'},S,'태양');
  const STEP=[
    ['① 코페르니쿠스의 가정','코페르니쿠스는 지구가 태양을 중심으로 돈다고 했지만, 천체가 <b>원운동</b>을 한다고 가정했어요(회색 점선).'],
    ['② 브라헤의 관측 데이터','브라헤가 맨눈으로 정밀하게 관측한 위치(노란 점)를 찍어 보면, 원과 잘 맞지 않아요.'],
    ['③ 케플러 제1법칙','케플러는 이 관측 데이터를 바탕으로 천체가 태양을 중심으로 한 <b>타원 궤도</b>를 따라 움직인다는 법칙을 찾았어요(초록 선).'],
  ];
  $('orbitBtns').innerHTML=STEP.map((s,i)=>`<button class="btn sm ghost" data-i="${i}">${s[0]}</button>`).join('');
  const bs=[...$('orbitBtns').querySelectorAll('button')];
  const show=k=>{
    L[0].style.opacity=k===2?.25:1; L[1].style.display=k>=1?'':'none'; L[2].style.display=k===2?'':'none';
    bs.forEach((b,j)=>{b.classList.toggle('ghost',j!==k);});
    $('orbitCap').innerHTML=STEP[k][1];
  };
  bs.forEach(b=>b.onclick=()=>show(+b.dataset.i)); show(0);
})();

/* 조각을 순서대로 눌러 완성하기 */
function sciOrder(box,cfg){
  const B=$(box);
  function start(){
    const pool=shuffle([...cfg.parts.map((t,i)=>({t,i})),...(cfg.decoys||[]).map(t=>({t,i:-1}))]);
    let pos=0, miss=0; const wrong=[];
    if(cfg.onStart) cfg.onStart();
    B.innerHTML=`<div class="sci-built">${cfg.parts.map(()=>'<span class="slot">?</span>').join('')}</div><div class="sci-next"></div><div class="sci-pool">${pool.map((p,j)=>`<button class="btn sm ghost" data-j="${j}">${p.t}</button>`).join('')}</div><div class="sci-fb"></div><div class="row sci-again"></div>`;
    const slots=[...B.querySelectorAll('.slot')], nx=B.querySelector('.sci-next'), fb=B.querySelector('.sci-fb'), ag=B.querySelector('.sci-again');
    const hint=()=>{nx.innerHTML=pos<cfg.parts.length?`다음 조각 <b>${pos+1} / ${cfg.parts.length}</b> · ${cfg.hints[pos]}`:'';};
    B.querySelectorAll('.sci-pool button').forEach(b=>b.onclick=()=>{
      const p=pool[+b.dataset.j];
      if(p.i===pos){
        slots[pos].textContent=p.t; slots[pos].classList.add('on'); b.remove(); pos++; fb.innerHTML='<span class="ok">좋아요!</span>'; hint();
        if(pos===cfg.parts.length){
          B.querySelectorAll('.sci-pool button').forEach(x=>x.disabled=true);
          fb.innerHTML=`<span class="ok">완성!</span> 틀리게 누른 횟수 <b>${miss}번</b>${wrong.length?` · 헷갈린 조각: ${[...new Set(wrong)].map(esc).join(', ')}`:''}<br>${cfg.done||''}`;
          ag.innerHTML='<button class="btn ghost sm">처음부터 다시</button>'; ag.firstChild.onclick=start;
          if(cfg.onDone) cfg.onDone();
        }
      }else{
        miss++; wrong.push(p.t); b.classList.add('shake'); setTimeout(()=>b.classList.remove('shake'),400);
        if(p.i<0){ b.disabled=true; fb.innerHTML=`<span class="ng">「${esc(p.t)}」</span>는 정의에 없는 조각이에요.`; }
        else fb.innerHTML=`<span class="ng">아직 이 조각의 차례가 아니에요.</span> ${cfg.hints[pos]}`;
      }
    });
    hint();
  }
  B.innerHTML=`<button class="btn sm">정의를 가리고 시작하기</button>`; B.firstChild.onclick=start;
}
sciOrder('defGame',{
  parts:['과학적 방법으로','데이터를 분석하여','보편적 진리나 법칙을 발견하고','유의미한 지식과 통찰을 얻어','미래를 예측하는','학문'],
  decoys:['느낌과 경험에 따라','데이터를 보관만 하여'],
  hints:['어떤 방법으로?','무엇을 하여?','무엇을 발견하고?','무엇을 얻어?','무엇을 하는?','데이터 과학은 무엇일까?'],
  onStart:()=>$('defText').classList.add('sci-hide'),
  onDone:()=>$('defText').classList.remove('sci-hide'),
  done:'케플러는 데이터를 분석해 <b>법칙</b>을 발견했어요. 데이터 과학은 여기서 더 나아가 <b>지식과 통찰</b>을 얻고 <b>미래를 예측</b>하는 데까지 이어져요.'
});

/* 02 어느 패러다임의 연구일까? */
sorter('paraGame',{
  cats:[{n:'실험 과학',k:'#e0702b'},{n:'이론 과학',k:'#2f6fd0'},{n:'계산 과학',k:'#1f9d74'},{n:'데이터 과학',k:'#9b4fc4'}],
  items:[
    {t:'공을 여러 번 굴려 보며 굴러가는 모습을 눈으로 살펴본다',short:'공 굴리며 관찰하기',c:0,ic:'⚽',w:'직접 해 보고 눈으로 관찰해 자연 현상을 설명하는 방식이에요.'},
    {t:'같은 씨앗을 햇빛이 드는 곳과 그늘에 나누어 심고 자라는 모습을 비교한다',short:'씨앗 나누어 심기',c:0,ic:'🌱',w:'조건을 바꿔 직접 해 보고 관찰하는 연구예요.'},
    {t:'사과가 떨어지는 것과 달이 지구 둘레를 도는 것을 하나의 공식으로 설명한다',short:'만유인력의 법칙',c:1,ic:'🍎',w:'뉴턴의 만유인력의 법칙처럼 현상을 수학적 모델로 일반화한 거예요.'},
    {t:'자연 현상을 수학식으로 나타내 다른 상황에도 맞도록 일반화한다',short:'수학식으로 일반화',c:1,ic:'📐',w:'수학적 모델로 표현하고 추론해 설명·예측하는 방식이에요.'},
    {t:'실제로 일으킬 수 없는 태풍의 움직임을 컴퓨터 시뮬레이션으로 가상 공간에 만들어 본다',short:'태풍 시뮬레이션',c:2,ic:'🌀',w:'실험하기 어려운 복잡한 현상을 컴퓨터로 가상화하는 연구예요.'},
    {t:'컴퓨터 속에서 수많은 공기 흐름을 가상으로 움직여 보며 내일 날씨를 미리 본다',short:'날씨 시뮬레이션',c:2,ic:'🌦️',w:'미래를 내다보지만, 쌓인 기록을 분석하는 게 아니라 시뮬레이션으로 가상화한다는 점이 핵심이에요(15쪽 기상 예측).'},
    {t:'사람들이 남긴 엄청난 양의 검색 기록을 인공지능으로 분석해 독감이 언제 유행할지 내다본다',short:'검색 기록으로 유행 예측',c:3,ic:'🔎',w:'폭발적으로 쌓인 기록을 중심에 두고 현상을 분석하고 미래를 예측해요.'},
    {t:'쉬지 않고 쌓이는 온라인 쇼핑 기록에서 사람들이 함께 사는 상품의 규칙을 찾아낸다',short:'쇼핑 기록에서 규칙 찾기',c:3,ic:'🛒',w:'빠르게 쌓이는 많은 기록을 분석해 규칙을 찾는 방식이에요.'},
  ],
  end:'<b>정리</b> 눈과 손으로 관찰하면 <b>실험</b>, 수학 공식으로 일반화하면 <b>이론</b>, 컴퓨터 속 가상 세계로 재현하면 <b>계산</b>, 쌓인 기록을 분석하면 <b>데이터 과학</b>이에요. 날씨처럼 같은 대상도 연구하는 방법에 따라 패러다임이 달라져요. 새 패러다임이 나와도 앞의 방법은 사라지지 않고 함께 쓰여요.'
});

/* 03 데이터 과학의 관련 분야(그림 Ⅰ-1) */
(function(){
  const S=$('vennSvg');
  const C=[{k:'t',x:180,y:108,c:'#f4a6b8'},{k:'l',x:128,y:192,c:'#9fb6ea'},{k:'r',x:232,y:192,c:'#8fd3bb'}], R=84;
  C.forEach(c=>el('circle',{cx:c.x,cy:c.y,r:R,fill:c.c,'fill-opacity':.55,stroke:'#fff','stroke-width':2},S));
  const REG={
    t:{n:'연구 분야의 전문 지식',x:180,y:62,d:'각 연구 분야의 전문 지식이에요. 데이터 과학의 각 단계마다 전문 지식, 수학 및 통계학, 컴퓨터 과학 같은 이론과 기술이 알맞게 쓰여요.'},
    l:{n:'수학과 통계',x:92,y:222,d:'모은 데이터를 분석하는 데 필요한 학문이에요. 스마트 농업 사례에서는 데이터를 수학과 통계 방법으로 검증했어요.'},
    r:{n:'컴퓨터 과학/IT',x:268,y:222,d:'프로그래밍 언어와 알고리즘처럼 데이터를 효과적으로 다루는 기술이에요.'},
    tl:{n:'통계적 연구',x:138,y:138,d:'<b>연구 분야의 전문 지식</b>과 <b>수학과 통계</b>가 겹치는 곳이에요.'},
    tr:{n:'데이터 처리',x:222,y:138,d:'<b>연구 분야의 전문 지식</b>과 <b>컴퓨터 과학/IT</b>가 겹치는 곳이에요.'},
    lr:{n:'기계학습',x:180,y:240,d:'<b>컴퓨터 과학</b>과 <b>수학과 통계</b>가 결합해 생겨난 분야예요. 여러 분야가 겹치면서 새로운 분야가 만들어지는 거예요.'},
    tlr:{n:'데이터 과학',x:180,y:175,d:'세 분야가 <b>모두 겹치는 한가운데</b>예요. 데이터 과학은 어느 한 분야만으로는 할 수 없고, 여러 학문이 함께 쓰여요.'},
  };
  const T={};
  for(const k in REG){const g=REG[k]; const w=k==='t'?['연구 분야의','전문 지식']:[g.n];
    const t=el('text',{x:g.x,y:g.y-(w.length-1)*8,'text-anchor':'middle','font-size':k==='tlr'?15:13,'font-weight':700,fill:'#16202c','pointer-events':'none'},S);
    w.forEach((s,i)=>el('tspan',{x:g.x,dy:i?17:0},t,s)); T[k]=t;}
  $('vennBtns').innerHTML=Object.keys(REG).map(k=>`<button data-k="${k}">${REG[k].n}</button>`).join('');
  const bs=[...$('vennBtns').querySelectorAll('button')];
  const pick=k=>{for(const j in T) T[j].setAttribute('fill',j===k?'#0f2742':'#16202c'), T[j].setAttribute('font-size',j===k?(j==='tlr'?17:15):(j==='tlr'?15:13));
    bs.forEach(b=>b.classList.toggle('on',b.dataset.k===k));
    $('vennInfo').innerHTML=`<b>${REG[k].n}</b><p>${REG[k].d}</p>`;};
  S.addEventListener('click',e=>{
    const p=S.createSVGPoint(); p.x=e.clientX; p.y=e.clientY; const q=p.matrixTransform(S.getScreenCTM().inverse());
    const k=C.filter(c=>(q.x-c.x)**2+(q.y-c.y)**2<=R*R).map(c=>c.k).join('');
    if(REG[k]) pick(k);
  });
  bs.forEach(b=>b.onclick=()=>pick(b.dataset.k));
  $('vennInfo').innerHTML='<p class="muted" style="margin:0">원이나 겹친 곳을 누르면 설명이 나와요. 아래 버튼을 눌러도 돼요.</p>';
})();

/* 03 데이터와 해결할 문제 짝짓기(표 Ⅰ-2) */
(function(){
  const P=[
    ['확진자 데이터','전염병 감염 패턴 파악 및 확진자 수 예측'],
    ['질병의 원인과 진행 과정 데이터','새로운 약물이나 백신 개발'],
    ['위성 데이터와 지상 센서 데이터','대기 오염원 추적 및 기후 변화 예측'],
    ['기상 데이터와 지형 데이터','지진, 홍수, 태풍 등의 자연재해 예측'],
    ['태양 및 풍력 데이터','재생 에너지 시설 설치 장소 추천'],
    ['건물 및 가전 제품의 에너지 사용 데이터','사용 패턴 식별을 통한 에너지 절약 방법 안내'],
  ];
  const COL=['#d64535','#9b4fc4','#2f6fd0','#e0702b','#1f9d74','#b07600'];
  const B=$('pairGame');
  function start(){
    const L=shuffle(P.map((_,i)=>i)), Rr=shuffle(P.map((_,i)=>i)); let sel=-1, done=0, miss=0; const wrong=[];
    B.innerHTML=`<div class="sci-pair"><div class="l"><h5>📦 데이터</h5>${L.map(i=>`<button data-i="${i}">${P[i][0]}</button>`).join('')}</div><div class="r"><h5>🛠️ 문제 해결</h5>${Rr.map(i=>`<button data-i="${i}">${P[i][1]}</button>`).join('')}</div></div><div class="sci-fb"></div><div class="row sci-again"></div>`;
    const lb=[...B.querySelectorAll('.l button')], rb=[...B.querySelectorAll('.r button')], fb=B.querySelector('.sci-fb'), ag=B.querySelector('.sci-again');
    const status=()=>`짝 <b>${done} / ${P.length}</b> · 틀린 시도 <b>${miss}번</b>`;
    fb.innerHTML=status();
    lb.forEach(b=>b.onclick=()=>{ if(b.classList.contains('done')) return; sel=+b.dataset.i; lb.forEach(x=>x.classList.toggle('sel',x===b)); });
    rb.forEach(b=>b.onclick=()=>{
      if(b.classList.contains('done')) return;
      if(sel<0){ fb.innerHTML='먼저 왼쪽에서 데이터를 하나 골라요. · '+status(); return; }
      const j=+b.dataset.i, lsel=lb.find(x=>+x.dataset.i===sel);
      if(j===sel){
        done++; const n=done; [lsel,b].forEach(x=>{x.classList.remove('sel'); x.classList.add('done'); x.style.setProperty('--pc',COL[sel]); x.dataset.n=n;});
        sel=-1; fb.innerHTML='<span class="ok">맞아요!</span> '+status();
        if(done===P.length){ fb.innerHTML=`<span class="ok">6쌍을 모두 이었어요!</span> 틀린 시도 <b>${miss}번</b>${wrong.length?`<br>헷갈린 짝: ${wrong.map(w=>`${esc(w[0])} → <s>${esc(w[1])}</s>`).join(' · ')}`:''}`;
          ag.innerHTML='<button class="btn ghost sm">처음부터 다시</button>'; ag.firstChild.onclick=start; }
      }else{
        miss++; wrong.push([P[sel][0],P[j][1]]); b.classList.add('bad','shake'); setTimeout(()=>b.classList.remove('bad','shake'),500);
        fb.innerHTML=`<span class="ng">다시 생각해 봐요.</span> 「${esc(P[sel][0])}」로 풀 수 있는 문제는 무엇일까요? · `+status();
      }
    });
  }
  start();
})();

/* 04 스스로 점검 */
chips('selfCheck','selfCheckPick',['데이터 과학의 개념을 설명할 수 있다','과학 연구의 네 가지 패러다임을 말할 수 있다','데이터 과학과 관련된 분야를 말할 수 있다','데이터 과학의 가치를 사례로 설명할 수 있다'],true);

/* 05 마무리 */
const MEMOLIST=[['planLearn','나의 계획 · 이 단원에서 배우고 싶은 것'],['mallowPick','마시멜로 실험 결론을 믿을 수 있을까'],['mallowWhy','분석 결과가 옳지 않은 이유'],['paraNote','기억에 남는 패러다임 카드'],['insD','내 데이터 · 데이터'],['insI','내 데이터 · 정보'],['insK','내 데이터 · 지식'],['insW','내 데이터 · 통찰'],['valData','실종 아동 사례 · 쓰인 데이터와 한 일'],['valWorth','실종 아동 사례 · 데이터 과학의 가치'],['valCare','실종 아동 사례 · 함께 생각할 점'],['selfCheckPick','스스로 점검: 할 수 있게 된 것'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[5]=()=>memoSummary('msum',MEMOLIST);

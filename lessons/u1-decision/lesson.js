
/* 01 느낌일까, 기록일까? */
sorter('gutGame',{
  cats:[{n:'💭 직관에 의한 결정',k:'#e0702b'},{n:'📈 데이터 기반 결정',k:'#2f6fd0'}],
  items:[
    {t:'창밖 하늘이 맑아 보여서 오늘은 우산 없이 아침 7시 30분에 집을 나선다',short:'하늘만 보고 우산 두기',c:0,ic:'☂️',w:'하늘을 본 느낌으로 정했어요. 강수 확률 같은 자료는 확인하지 않았지요.'},
    {t:'친한 친구가 재미있다고 추천해서 그 동아리로 바로 정한다',short:'친구 추천으로 동아리',c:0,ic:'🗣️',w:'교과서 만화의 「친구에게 자문 구하기」처럼 다른 사람의 말과 느낌에 기댄 결정이에요.'},
    {t:'늘 해 오던 대로 시험 전날 밤에 여러 과목을 몰아서 공부한다',short:'하던 대로 몰아서 공부',c:0,ic:'🌙',w:'지난 경험과 습관에 기댄 결정이에요. 그 방법이 효과가 있었는지 따져 본 기록은 없어요.'},
    {t:'최근 한 달 쪽지 시험 점수를 과목별로 정리해 가장 낮은 과목부터 공부한다',short:'점수 정리 후 공부 순서',c:1,ic:'📝',w:'내 점수 기록을 정리해 어디가 약한지 객관적으로 확인하고 정했어요.'},
    {t:'우리 반 30명에게 설문해 가장 많이 고른 곳을 체험 학습 장소로 정한다',short:'설문으로 장소 정하기',c:1,ic:'📋',w:'설문으로 모은 응답을 세어 보고 정했어요.'},
    {t:'지난 2주 동안 버스가 도착한 시각 기록을 보고 평소보다 10분 일찍 나간다',short:'도착 기록 보고 출발',c:1,ic:'🚌',w:'실제로 쌓인 도착 기록을 보고 판단했어요.'},
  ],
  end:'<b>생각해 보기</b> 직관이 늘 틀리는 건 아니에요. 하지만 데이터는 현실적이고 객관적인 정보를 주어 <b>결정의 오류를 줄여</b> 줘요. 사소한 일상 결정도 데이터로 더 나은 판단을 할 수 있어요.'
});

/* 02 나이팅게일 데이터 그래프(표 Ⅰ-3) */
(function(){
  const NG=[
    {d:'1854.5',m:[12,0,9],c:[13,0,14],r:[57,48]},
    {d:'1854.6',m:[11,0,6],c:[24,0,20],r:[65,55]},
    {d:'1855.11',m:[178,33,32],c:[14304,1738,1581],r:[73,81]},
    {d:'1855.12',m:[91,18,28],c:[14395,1756,1609],r:[66,81]},
    {d:'1856.2',m:[24,0,19],c:[14461,1758,1676],r:[56,81]},
  ];
  const CA=[['전염병','#d64535'],['부상','#2f6fd0'],['기타','#8a94a3']];
  let row=0, mode=0;   // row 5 = 다섯 달 한눈에, mode 0 = 그달(기초), 1 = 누적
  $('ngRows').innerHTML=NG.map((r,i)=>`<button data-i="${i}">${r.d}</button>`).join('')+'<button data-i="5">다섯 달 한눈에</button>';
  $('ngMode').innerHTML='<button data-m="0">그달 (기초 데이터)</button><button data-m="1">누적</button>';
  const rb=[...$('ngRows').querySelectorAll('button')], mb=[...$('ngMode').querySelectorAll('button')];
  const val=r=>mode?r.c:r.m, sum=a=>a.reduce((x,y)=>x+y,0);
  const bar=(name,col,v,max)=>`<div class="dec-bar"><span class="lb">${name}</span><div class="tr"><i style="width:${max?v/max*100:0}%;background:${col}"></i></div><b>${fmt(v)}</b></div>`;
  function draw(){
    rb.forEach(b=>b.classList.toggle('on',+b.dataset.i===row)); mb.forEach(b=>b.classList.toggle('on',+b.dataset.m===mode));
    document.querySelectorAll('#ngTable tr[data-r]').forEach(tr=>tr.classList.toggle('on',+tr.dataset.r===row));
    const what=mode?'누적':'그달';
    if(row<5){
      const r=NG[row], v=val(r), max=Math.max(...v), tot=sum(v), pct=Math.round(v[0]/tot*100);
      $('ngChart').innerHTML=`<h5>${r.d} · ${what} 사망 원인</h5>`+CA.map((c,i)=>bar(c[0],c[1],v[i],max)).join('')+
        `<p class="dec-sum">합계 <b>${fmt(tot)}</b>명 가운데 전염병 <b>${fmt(v[0])}</b>명 → 약 <b>${pct}%</b> <span class="muted">· 표의 비율 「${mode?'누적기준':'월별'}」 칸은 ${r.r[mode]}%</span></p><p class="note">막대 길이는 이 화면에서 가장 큰 값을 기준으로 그렸어요.</p>`;
    }else{
      const max=Math.max(...NG.map(r=>Math.max(...val(r))));
      $('ngChart').innerHTML=`<h5>다섯 달 한눈에 · ${what} (같은 눈금)</h5><div class="dec-lg">${CA.map(c=>`<span><i style="background:${c[1]}"></i>${c[0]}</span>`).join('')}</div>`+
        NG.map(r=>`<div class="dec-grp"><span class="lb">${r.d}</span><div>${val(r).map((v,i)=>`<div class="dec-mini"><i style="width:${v/max*100}%;background:${CA[i][1]}"></i><b>${fmt(v)}</b></div>`).join('')}</div></div>`).join('')+
        `<p class="note">${mode?'누적은 표에 없는 달까지 모두 더한 값이라 1855.11부터 크게 늘어나 있어요. 1854.5·1854.6처럼 값이 작은 달은 막대가 짧게 보여요. 수치를 함께 읽어요.':'1854.5와 1856.2처럼 값이 작은 달은 막대가 짧게 보여요. 수치를 함께 읽어요.'}</p>`;
    }
  }
  rb.forEach(b=>b.onclick=()=>{row=+b.dataset.i; draw();});
  mb.forEach(b=>b.onclick=()=>{mode=+b.dataset.m; draw();});
  document.querySelectorAll('#ngTable tr[data-r]').forEach(tr=>tr.onclick=()=>{row=+tr.dataset.r; draw();});
  draw();
})();

/* 02 순서대로 놓아 보기 (예시: 급식 잔반) */
(function(){
  const STEPS=[['계획','#2f6fd0','「잔반은 몇몇 반찬에서 특히 많이 나올 것이다」라는 가설을 세우고, 무엇을 얼마 동안 기록할지 정한다'],
    ['수집','#9b4fc4','2주 동안 메뉴별로 배식한 양과 남은 양을 저울로 재어 표로 정리한다'],
    ['분석','#1f9d74','정리한 표를 메뉴별로 비교해 보니 나물 반찬에서 남은 양이 가장 많았다'],
    ['적용','#e0702b','나물 반찬의 조리법을 바꾸자고 건의했고, 그 뒤 잔반이 줄었다']];
  const B=$('stepGame');
  function start(){
    const order=shuffle(STEPS.map((_,i)=>i)); let pos=0, miss=0; const wrong=[];
    B.innerHTML=`<div class="dec-slots">${STEPS.map(s=>`<div style="--k:${s[1]}"><span class="n">${s[0]}</span><p>?</p></div>`).join('')}</div><div class="dec-cards">${order.map(i=>`<button data-i="${i}">${STEPS[i][2]}</button>`).join('')}</div><div class="dec-fb"></div><div class="row dec-again"></div>`;
    const slots=[...B.querySelectorAll('.dec-slots>div')], fb=B.querySelector('.dec-fb'), ag=B.querySelector('.dec-again');
    const tell=()=>`지금은 <b>${STEPS[pos][0]}</b> 단계 카드를 찾을 차례예요.`;
    fb.innerHTML=tell();
    B.querySelectorAll('.dec-cards button').forEach(b=>b.onclick=()=>{
      const i=+b.dataset.i;
      if(i===pos){
        slots[pos].querySelector('p').textContent=STEPS[i][2]; slots[pos].classList.add('on'); b.remove(); pos++;
        if(pos===STEPS.length){
          fb.innerHTML=`<span class="ok">네 단계를 모두 놓았어요!</span> 틀리게 누른 횟수 <b>${miss}번</b>${wrong.length?` · 헷갈린 단계: ${[...new Set(wrong)].join(', ')}`:''}<br>나이팅게일도 같은 순서로 가설 → 의무 기록표 → 원인 분석 → 병원 환경 개선을 거쳤어요.`;
          ag.innerHTML='<button class="btn ghost sm">처음부터 다시</button>'; ag.firstChild.onclick=start;
        }else fb.innerHTML='<span class="ok">맞아요!</span> '+tell();
      }else{
        miss++; wrong.push(STEPS[i][0]+' 카드'); b.classList.add('shake','bad'); setTimeout(()=>b.classList.remove('shake','bad'),450);
        fb.innerHTML=`<span class="ng">아직 이 카드의 차례가 아니에요.</span> `+tell();
      }
    });
  }
  start();
})();

/* 03 이 분석의 목적은? (20쪽 학습 데이터 예시를 바꿔 씀) */
sorter('purposeGame',{
  cats:[{n:'설명',k:'#2b9bb5'},{n:'진단',k:'#2f6fd0'},{n:'예측',k:'#9b4fc4'},{n:'처방',k:'#1f9d74'}],
  items:[
    {t:'로그인 기록·과제 제출 여부·강의 시청 기록 ▶ 학생들이 수업에 얼마나 참여하고 있는지 파악한다',short:'참여 정도 파악',c:0,ic:'🖥️',w:'지금 어떤 상태인지, 무슨 일이 일어났는지 확인하는 거예요.'},
    {t:'과제 수행 시간·문제 풀이 시도 횟수·정답률 ▶ 학생들이 어느 부분에서 어려움을 겪고 있는지 알아본다',short:'어려운 부분 확인',c:0,ic:'🧩',w:'어디에서 막히는지 현재 상황을 정확히 파악하는 거예요. 왜 막히는지는 아직 따지지 않아요.'},
    {t:'학습 만족도 설문·학습 성취도 결과·친구 및 교우 관계 ▶ 흥미가 줄어든 원인이 내용이 어려워서인지 개인적인 이유인지 찾는다',short:'흥미가 줄어든 원인',c:1,ic:'🔍',w:'이미 일어난 일(흥미 감소)이 왜 생겼는지 이유를 찾는 거예요.'},
    {t:'과제 수행 시간·문제 풀이 시도 횟수·정답률 ▶ 성적이 떨어진 것이 학습 시간 부족 때문인지 개념 이해 부족 때문인지 따진다',short:'성적이 떨어진 원인',c:1,ic:'📉',w:'「어려운 부분 확인」과 같은 데이터지만, 여기서는 왜 그런지를 따져요.'},
    {t:'과거 학업 성적·학습 동기·불안 ▶ 다음 시험에서 얼마나 성취할지 미리 내다본다',short:'다음 시험 성취도',c:2,ic:'🔮',w:'지나간 결과로 앞으로 일어날 일을 내다봐요.'},
    {t:'학습 기록·학습 자료 이용 기록·과거 설문 조사 결과 ▶ 다음 학기에 학생들이 수업에 얼마나 만족할지 가늠한다',short:'다음 학기 만족도',c:2,ic:'📅',w:'아직 일어나지 않은 일을 데이터로 가늠해요.'},
    {t:'과거 학업 성적·개인 특성·외부 요소 ▶ 학생마다 알맞은 학습 방법을 골라 준다',short:'맞춤형 학습 방법',c:3,ic:'💊',w:'목표(성적 향상)를 이루려고 무엇을 어떻게 바꿀지 방법을 정해요.'},
    {t:'학습 기록·학습 자료 이용 기록·과거 설문 조사 결과 ▶ 학습 환경을 어떻게 바꿀지 계획한다',short:'학습 환경 바꾸기',c:3,ic:'🛠️',w:'「다음 학기 만족도」와 같은 데이터지만, 여기서는 원하는 결과를 만들 방법을 찾아요.'},
  ],
  end:'<b>정리</b> 같은 데이터라도 <b>무엇을 알고 싶은지</b>(무슨 일이? 왜? 앞으로? 어떻게?)에 따라 목적이 달라져요.<br><b>같은 데이터가 두 번 나온 짝</b><br>· 과제 수행 시간·문제 풀이 시도 횟수·정답률 → 「어려운 부분 확인」(설명) / 「성적이 떨어진 원인」(진단)<br>· 학습 기록·학습 자료 이용 기록·과거 설문 조사 결과 → 「다음 학기 만족도」(예측) / 「학습 환경 바꾸기」(처방)'
});

/* 04 함께 해결하기 */
chips('fieldChips','caseField',['경제','스포츠','그 밖의 분야']);
chips('selfCheck','selfCheckPick',['데이터 기반 의사 결정의 뜻과 중요성을 설명할 수 있다','의사 결정 과정 네 단계를 사례에 맞게 말할 수 있다','설명·진단·예측·처방을 구별할 수 있다','사례를 찾고 어떤 데이터가 쓰였는지 설명할 수 있다'],true);

/* 05 마무리 */
const MEMOLIST=[['myGut','최근 내가 직관으로 한 결정'],['gutRedo','그 결정을 데이터로 다시 한다면'],['ngNote','나이팅게일 그래프에서 알게 된 사실'],['caseField','조사한 분야'],['caseName','조사한 사례'],['caseData','사례에 활용된 데이터'],['caseE','사례 · 설명'],['caseD','사례 · 진단'],['caseP','사례 · 예측'],['caseR','사례 · 처방'],['samePair','같은 데이터, 다른 목적 · 내가 고른 짝과 차이'],['selfCheckPick','스스로 점검: 할 수 있게 된 것'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[5]=()=>memoSummary('msum',MEMOLIST);

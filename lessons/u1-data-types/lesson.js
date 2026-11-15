/* 교과서 24쪽 표 Ⅰ-4 급식 메뉴 · 표 Ⅰ-5 날짜별 사용된 고기 종류 */
const DT_MENU=[
  ['25-03-04','차조밥','전주식 콩나물국','도토리묵 양념장','돈육 고추장볶음','총각김치'],
  ['25-03-05','잡곡밥','마라탕','찜닭','홀그레인 콘샐러드','크랜베리 견과류 멸치볶음'],
  ['25-03-06','발아 현미밥','김치 어묵국','볶음우동','돈마호크','섞박지'],
  ['25-03-07','치킨마요덮밥','팽이버섯 미소국','게맛살 오이 생채','소떡소떡','깍두기'],
  ['25-03-08','5색 발아 현미밥','해물 순두부찌개','부추 상추 겉절이','꼬마 김말이','닭마늘 소스 구이'],
  ['25-03-11','찰보리밥','우렁 된장찌개','김치만두','닭볶음탕','배추김치']
];
const DT_MEAT=['쇠고기','돼지고기','닭고기','오리고기'];
/* 표 Ⅰ-5 값(교과서): 메뉴 이름에 고기가 드러난 칸만 1 */
const DT_ANS=[[0,1,0,0],[0,0,1,0],[0,1,0,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]];
/* 1이 분명한 칸: 근거 메뉴 */
const DT_WHY={'0-1':['돈육 고추장볶음','「돈육」은 돼지고기예요'],'1-2':['찜닭',''],'2-1':['돈마호크','「돈(豚)」은 돼지를 뜻해요'],'3-2':['치킨마요덮밥','「치킨」은 닭고기예요'],'4-2':['닭마늘 소스 구이',''],'5-2':['닭볶음탕','']};
/* 메뉴 이름만으로는 판단이 갈리는 칸: 채점하지 않음 */
const DT_AMB={
  '1-0':'마라탕','1-1':'마라탕',
  '3-0':'소떡소떡','3-1':'소떡소떡',
  '5-1':'김치만두'
};
const DT_AMBNOTE={
  '마라탕':'마라탕에는 고기를 넣기도 하지만, 어떤 고기인지는 메뉴 이름에 없어요.',
  '소떡소떡':'소떡소떡의 「소」는 소고기가 아니라 소시지예요. 소시지에 어떤 고기가 들어갔는지는 이름만으로 알 수 없어요.',
  '김치만두':'만두소에 돼지고기를 넣는 경우가 많지만, 메뉴 이름만으로는 알 수 없어요.'
};

/* 01 투표: 사진만으로 닭고기 사용 빈도를 알 수 있을까? */
vote('dtVote','photoVote',[['알 수 있다','사진을 보면 닭고기가 보이니까'],['알기 어렵다','사진만으로는 확실하지 않으니까']],()=>$('dtVoteAns').classList.add('on'));

/* 02 직접 구조화하기 */
(function(){
  const menu=$('dtMenu'), grid=$('dtGrid');
  menu.innerHTML='<tr><th>날짜</th><th>밥</th><th>국</th><th>반찬1</th><th>반찬2</th><th>반찬3</th></tr>'+
    DT_MENU.map((r,i)=>`<tr data-r="${i}">${r.map((c,j)=>`<td${j?'':' class="dt-d"'}>${c}</td>`).join('')}</tr>`).join('');
  let V, checked=false, base='', days=null;
  const saveMeal=()=>{MEMO.mealResult=base+(days!=null?` · 닭고기가 나온 날: ${days}일`:''); store.set(MK,MEMO);};
  function draw(){
    let h='<tr><th>날짜</th>'+DT_MEAT.map(m=>`<th>${m}</th>`).join('')+'</tr>';
    h+=DT_MENU.map((r,i)=>`<tr data-r="${i}"><td class="dt-d">${r[0]}</td>`+DT_MEAT.map((m,j)=>{
      const k=i+'-'+j; let cls='dt-c';
      if(checked){ if(DT_AMB[k]) cls+=' amb'; else cls+=(V[i][j]===DT_ANS[i][j]?' good':' bad'); }
      return `<td><button class="${cls}" data-v="${V[i][j]}" data-i="${i}" data-j="${j}" aria-label="${r[0]} ${m}">${V[i][j]}</button></td>`;
    }).join('')+'</tr>').join('');
    if(checked) h+='<tr class="dt-sum"><td class="dt-d">합계</td>'+DT_MEAT.map((m,j)=>`<td>${V.reduce((s,r)=>s+r[j],0)}</td>`).join('')+'</tr>';
    grid.innerHTML=h;
    grid.querySelectorAll('button').forEach(b=>b.onclick=()=>{
      const i=+b.dataset.i, j=+b.dataset.j;
      V[i][j]=V[i][j]?0:1;
      if(checked){checked=false; $('dtMsg').textContent='값을 바꿨어요. 다 고쳤으면 다시 「확인하기」를 눌러요.'; $('dtCount').classList.remove('on');}
      draw(); light(i);
    });
  }
  function light(i){ menu.querySelectorAll('tr').forEach(t=>t.classList.toggle('on',t.dataset.r===String(i))); }
  function reset(){
    V=DT_MENU.map(()=>[0,0,0,0]); checked=false; days=null; draw(); light(-1);
    $('dtMsg').textContent='메뉴 이름에서 고기를 찾아 1로 바꿔 보세요.';
    $('dtCount').classList.remove('on'); $('dtDays').value=''; $('dtDaysMsg').textContent='';
  }
  $('dtCheck').onclick=()=>{
    checked=true; draw(); light(-1);
    let ok=0, n=0; const miss=[], ambSeen=new Set();
    DT_MENU.forEach((r,i)=>DT_MEAT.forEach((m,j)=>{
      const k=i+'-'+j;
      if(DT_AMB[k]){ambSeen.add(DT_AMB[k]); return;}
      n++; if(V[i][j]===DT_ANS[i][j]) ok++;
      else miss.push(DT_ANS[i][j]?`${r[0]} ${m} → 1 (메뉴 「${DT_WHY[k][0]}」${DT_WHY[k][1]?' · '+DT_WHY[k][1]:''})`:`${r[0]} ${m} → 0 (메뉴 이름에서 ${m}를 찾을 수 없어요)`);
    }));
    $('dtMsg').innerHTML=`<b>${n}칸 중 ${ok}칸</b>을 맞혔어요.`+(miss.length?` <span class="ng">빨간 칸</span>을 다시 보세요.<ul>${miss.map(x=>`<li>${x}</li>`).join('')}</ul>`:' <span class="ok">모두 맞았어요!</span>')+
      `<div class="dt-amb"><b>노란 칸은 판단이 갈리는 칸이라 맞고 틀림을 따지지 않았어요.</b><ul>${[...ambSeen].map(x=>`<li><b>${x}</b> · ${DT_AMBNOTE[x]}</li>`).join('')}</ul>교과서 표 Ⅰ-5는 메뉴 이름에 고기가 드러난 칸만 1로 적었어요. 이처럼 구조화할 때는 <b>어떤 기준으로 0과 1을 정할지</b>부터 정해야 해요.</div>`;
    $('dtCount').classList.add('on');
    base=`확인한 ${n}칸 중 ${ok}칸 맞힘`; saveMeal();
  };
  $('dtReset').onclick=reset;
  $('dtDaysOk').onclick=()=>{
    const v=parseInt($('dtDays').value,10), mine=V.reduce((s,r)=>s+r[2],0);
    if(isNaN(v)){$('dtDaysMsg').textContent='숫자를 넣어 주세요.';return;}
    if(v===4) $('dtDaysMsg').innerHTML='<span class="ok">맞아요! 4일이에요.</span> 사진 365장을 한 장씩 넘겨 볼 필요 없이, 닭고기 열의 1만 더하면 돼요(합계 줄을 보세요). 데이터가 1년 치로 늘어나도 컴퓨터는 이 열을 순식간에 더할 수 있어요.';
    else $('dtDaysMsg').innerHTML=`<span class="ng">다시 세어 봐요.</span> 닭고기 열에서 1인 칸이 몇 개인지 보면 돼요.`+(mine!==4?' 내 표의 닭고기 열부터 확인해 보세요.':'');
    days=v; saveMeal();
  };
  reset();
})();

/* 03 표 Ⅰ-5로 해 보기: 검색 · 재정렬 · 합계 · CSV */
(function(){
  const view=$('dtOpView'), msg=$('dtOpMsg');
  const rows=DT_MENU.map((r,i)=>[r[0],...DT_ANS[i]]);
  const table=(rs,sum)=>'<table class="dt-tbl"><tr><th>날짜</th>'+DT_MEAT.map(m=>`<th>${m}</th>`).join('')+'</tr>'+
    rs.map(r=>`<tr><td class="dt-d">${r[0]}</td>${r.slice(1).map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')+
    (sum?'<tr class="dt-sum"><td class="dt-d">합계</td>'+DT_MEAT.map((m,j)=>`<td>${rows.reduce((s,r)=>s+r[j+1],0)}</td>`).join('')+'</tr>':'')+'</table>';
  const OPS={
    reset:()=>{view.innerHTML=table(rows); msg.textContent='표 Ⅰ-5(교과서 24쪽)예요. 버튼을 눌러 보세요.';},
    find:()=>{view.innerHTML=table(rows.filter(r=>r[3]===1)); msg.innerHTML='<b>검색</b> 닭고기 열이 1인 행만 남겼어요. 사진이었다면 한 장씩 보며 골라내야 해요.';},
    sum:()=>{view.innerHTML=table(rows,true); msg.innerHTML='<b>통계 분석</b> 열마다 1을 더하면 고기 종류별로 며칠 쓰였는지 바로 나와요. 이 표에서는 닭고기가 가장 많아요.';},
    csv:()=>{view.innerHTML=`<pre class="dt-csv">날짜,${DT_MEAT.join(',')}\n${rows.map(r=>r.join(',')).join('\n')}</pre>`; msg.innerHTML='<b>CSV 형식</b> 같은 표를 쉼표(,)로 열을 나누어 글자로 저장한 모습이에요. 스프레드시트 프로그램에서 열면 다시 표가 돼요.';}
  };
  /* 02에서 「확인하기」를 누르기 전에는 표 Ⅰ-5 값(02 체험의 답)을 보이지 않음 */
  const opened=()=>!!MEMO.mealResult;
  const lock=()=>{view.innerHTML=''; msg.innerHTML='02 「직접 구조화하기」에서 표 Ⅰ-5를 채우고 <b>「확인하기」</b>를 먼저 눌러요. 그러면 이 표가 열려요. <button class="btn ghost sm" onclick="go(2)">02로 가기</button>';};
  document.querySelectorAll('.dt-ops button').forEach(b=>b.onclick=()=>{
    if(!opened()) return lock();
    document.querySelectorAll('.dt-ops button').forEach(x=>x.classList.toggle('on',x===b&&b.dataset.op!=='reset'));
    OPS[b.dataset.op]();
  });
  onShow[3]=()=>{ if(!opened()) lock(); else if(!view.innerHTML) OPS.reset(); };
  opened()?OPS.reset():lock();
})();

/* 04 네 가지 데이터 구분하기 (교과서 25쪽 자료를 HTML로 다시 그림) */
(function(){
  const hand=()=>{let s='';for(let r=0;r<4;r++){s+='<div>';for(let c=0;c<12;c++){const k=(r*12+c)*37%17;s+=`<span style="transform:rotate(${((k%9)-4)*3}deg) translateY(${(k%3)-1}px) scale(${.8+(k%5)*.1});font-weight:${k%2?700:400}">${r}</span>`;}s+='</div>';}return s;};
  const F=[
    {n:'기대 수명 데이터',a:0,html:`<pre class="dt-df"><b>   Country      Year  Life expectancy        GDP</b>\n0  Afghanistan  2015             65.0  584.259210\n1  Afghanistan  2014             59.9  612.696514</pre>`,
     w:'나라·연도·기대 수명·GDP 열에 값이 규칙대로 들어 있어 바로 정렬하거나 평균을 낼 수 있어요.'},
    {n:'댓글 데이터',a:1,html:`<div class="dt-cm"><p><b>○○○</b> 오늘 경기 마지막 골 진짜 멋있었어요!! 👏👏 다음에도 꼭 보러 갈게요</p><p><b>△△△</b> 3분쯤부터 소리가 좀 작아요ㅠ 그래도 재밌게 봤습니다~</p><small>글 내용은 예시</small></div>`,
     w:'사람마다 길이와 표현이 제각각인 글이라, 그대로는 속성을 한눈에 파악하기 어려워요.'},
    {n:'손 글씨 데이터',a:1,html:`<div class="dt-hand">${hand()}</div>`,
     w:'같은 숫자도 사람마다 모양이 달라요. 이미지에서 속성을 뽑아내야 분석할 수 있어요.'},
    {n:'제주도 해수면 데이터',a:0,html:`<div class="dt-scroll"><table class="dt-sheet"><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th><th>G</th></tr><tr><th>1</th><td>측정 일자</td><td>정점명</td><td>정점 코드</td><td>위도</td><td>경도</td><td>평균 풍속</td><td>평균 기압</td></tr>${[['2016-01-01','3.8','1031.6'],['2016-01-02','2.8','1023.9'],['2016-01-03','3.9','1020.5'],['2016-01-04','7.7','1021.9'],['2016-01-05','10','1023.4']].map((r,i)=>`<tr><th>${i+2}</th><td>${r[0]}</td><td>마라도</td><td>22107</td><td>33.08333</td><td>126.0333</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table></div>`,
     w:'측정 일자·정점명·위도·경도·풍속·기압 열로 정리된 스프레드시트라서 검색과 계산이 쉬워요.'}
  ];
  const T=['정형 데이터','비정형 데이터'];
  let pick, done;
  const box=$('dtFour');
  function draw(){
    box.innerHTML=F.map((f,i)=>`<div class="dt-fc${done?(pick[i]===f.a?' good':' bad'):''}"><h4>${f.n}</h4><div class="dt-mock">${f.html}</div>
      <div class="row">${T.map((t,j)=>`<button class="btn ghost sm${pick[i]===j?' on':''}" data-i="${i}" data-j="${j}"${done?' disabled':''}>${t}</button>`).join('')}</div>
      ${done?`<p class="dt-fw">${pick[i]===f.a?'<span class="ok">맞아요.</span>':`<span class="ng">정답은 ${T[f.a]}.</span>`} ${f.w}</p>`:''}</div>`).join('');
    box.querySelectorAll('button').forEach(b=>b.onclick=()=>{pick[+b.dataset.i]=+b.dataset.j; draw();});
  }
  function start(){ pick=F.map(()=>null); done=false; draw(); $('dtFourMsg').textContent='네 가지를 모두 고르면 확인할 수 있어요.'; }
  $('dtFourOk').onclick=()=>{
    if(pick.some(p=>p===null)){$('dtFourMsg').textContent='아직 고르지 않은 데이터가 있어요.';return;}
    done=true; draw();
    const ok=F.filter((f,i)=>pick[i]===f.a).length;
    $('dtFourMsg').innerHTML=`<b>4개 중 ${ok}개</b>를 맞혔어요. 표처럼 보이는 두 데이터는 열마다 같은 종류의 값이 규칙대로 들어 있고, 나머지 둘은 글과 그림이라 형식이 제각각이에요.`;
    MEMO.fourPick=F.map((f,i)=>`${f.n}: ${T[pick[i]]}`).join(' · '); store.set(MK,MEMO);
  };
  $('dtFourRe').onclick=start;
  start();
})();

/* 04 한 걸음 더: 분류 게임 (새로 만든 예시) */
sorter('dtSort',{
  cats:[{n:'정형 데이터',k:'#9b4fc4'},{n:'비정형 데이터',k:'#e0702b'}],
  items:[
    {t:'도서관 대출 기록을 대출일·학번·책 제목·반납일 칸에 맞춰 쌓아 둔 파일',short:'도서관 대출 기록',c:0,ic:'📚',w:'칸(속성)이 정해져 있고 한 줄에 대출 한 건씩 들어가니 검색과 정렬이 쉬워요.'},
    {t:'반 단체 대화방에 올라온 체육 대회 응원·결승전·시상식 영상',short:'응원 영상',c:1,ic:'🎬',w:'영상에는 일정한 형식이나 규칙이 없어 그대로는 속성을 파악하기 어려워요.'},
    {t:'교실 온도계 값을 날짜·시각·온도 순서로 한 줄씩 적어 둔 기록표',short:'교실 온도 기록표',c:0,ic:'🌡️',w:'같은 항목 순서로 값이 한 줄씩 정리되어 있어 평균이나 최고 온도를 바로 구할 수 있어요.'},
    {t:'수학 시간에 칠판을 찍어 둔 사진',short:'칠판 사진',c:1,ic:'📷',w:'사진 속 글씨와 그림은 정해진 구조가 없어 컴퓨터가 바로 계산하기 어려워요.'},
    {t:'음성 메모 앱에 녹음해 둔 영어 말하기 연습',short:'말하기 연습 녹음',c:1,ic:'🎙️',w:'녹음된 소리는 형식이 정해져 있지 않아요. 분석하려면 말한 시간, 틀린 단어 수 같은 속성을 뽑아야 해요.'},
    {t:'급식 만족도 조사 결과를 학번·문항 1·문항 2 점수로 한 줄씩 모은 CSV 파일',short:'만족도 조사 CSV',c:0,ic:'📊',w:'CSV 파일은 쉼표로 열을 나눈 표 형태라 스프레드시트에서 바로 열어 분석할 수 있어요.'},
    {t:'학교 누리집 건의 게시판에 학생들이 급식·체육복·축제에 대해 자유롭게 남긴 글',short:'건의 게시판 글',c:1,ic:'💬',w:'글의 길이와 내용이 제각각이라 「무엇을 건의했는지」를 세려면 먼저 속성을 뽑아야 해요.'},
    {t:'동아리 회원의 이름·학년·반·연락처를 열마다 나누어 적은 명단',short:'동아리 명단',c:0,ic:'🗒️',w:'열마다 같은 종류의 값이 들어 있어 학년별로 정렬하거나 인원을 세기 쉬워요.'}
  ],
  end:'<b>정리</b> 「컴퓨터가 바로 검색·정렬·계산할 수 있게 규칙대로 정리되어 있는가」로 판단해요. 비정형 데이터도 필요한 속성을 뽑아 표로 만들면 정형 데이터가 돼요.'
});

/* 04 개념 빈칸 · 성취도 평가 */
document.querySelectorAll('.dt-blanks .blank').forEach(b=>b.onclick=()=>{b.textContent=b.dataset.a; b.classList.add('on');});
chips('dtSelf','selfCheckPick',['데이터의 뜻을 설명할 수 있다','정형·비정형 데이터를 구분할 수 있다','비정형 데이터를 표로 구조화할 수 있다','정형 데이터의 장점을 말할 수 있다'],true);

/* 05 마무리 */
const MEMOLIST=[['plan','나의 계획: 이 단원에서 배우고 싶은 것'],['photoVote','사진만으로 닭고기 사용 빈도를 알 수 있을까(투표)'],['photoIdea','사진 365장을 빠르게 세는 방법(처음 생각)'],['mealResult','직접 구조화하기 결과'],['myData','내 비정형 데이터와 알고 싶은 것'],['myCols','표로 정리할 열(속성) 이름'],['fourPick','교과서 25쪽 데이터 구분'],['whyType','그렇게 구분한 이유'],['selfCheckPick','성취도 평가: 할 수 있게 된 것'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[5]=()=>memoSummary('msum',MEMOLIST);

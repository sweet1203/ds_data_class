/* 교과서 26쪽 표 Ⅰ-6 학생 수강 데이터 */
const AT_COLS=['이름','성별','성취도','등급','출석 일수','출석률','이수 여부'];
const AT_ROWS=[
  ['유선재','남','A','1','64','1.00','이수'],
  ['이나은','남','C','3','52','0.81','이수'],
  ['김소희','여','B','1','58','0.91','이수'],
  ['최영현','여','I','5','43','0.67','미이수'],
  ['정세영','남','E','5','25','0.39','미이수']
];
const AT_TY=['범주형-명목형','범주형-순서형','수치형-연속형','수치형-이산형'];
const AT_TYS=['범주 · 명목','범주 · 순서','수치 · 연속','수치 · 이산'];
/* 받침에 따라 조사 고르기: josa('등급','은','는') */
const josa=(w,a,b)=>{const c=w.charCodeAt(w.length-1)-0xAC00; if(c<0||c>11171) return a+'('+b+')'; const j=c%28; if(a==='으로') return (j===0||j===8)?'로':'으로'; return j?a:b;};

/* 0 시작 · 05 정리: 앞 차시에 적은 나의 계획 보여 주기 (u1-data-science 14쪽, u1-data-types 22쪽) — 읽기만 함 */
(function(){
  const rd=(lid,key)=>{ try{ return String((store.get('ds-'+lid+'-memo'+WHO.sfx,{})||{})[key]||'').trim(); }catch(e){ return ''; } };
  const p14=rd('u1-data-science','planLearn'), p22=rd('u1-data-types','plan');
  const box=(t,v)=>v?`<b>${t}</b><span>${esc(v)}</span>`:'';
  const h1=box('지난 시간(22쪽)에 적은 나의 계획',p22);
  const h2=box('「데이터 과학의 이해」 처음(14쪽)에 적은 나의 계획',p14)+box('「데이터의 형태와 속성」 처음(22쪽)에 적은 나의 계획',p22);
  $('atPrev').innerHTML=h1; $('atPrev').style.display=h1?'':'none';
  $('atPrev2').innerHTML=h2||'<span class="muted">이 기기에 저장된 앞 시간 계획 메모가 없어요. 기억나는 대로 떠올려 점검해요.</span>';
})();

/* 01 표 Ⅰ-6 누르기 */
(function(){
  const T=$('atT6'), info=$('atInfo'); let added=false;
  const EXTRA={cols:['학년','반','번호'],vals:[['2','3','11'],['2','3','15'],['2','3','4'],['2','3','19'],['2','3','23']]};
  function draw(){
    const cols=added?[...EXTRA.cols,...AT_COLS]:AT_COLS;
    const rows=AT_ROWS.map((r,i)=>added?[...EXTRA.vals[i],...r]:r);
    T.innerHTML='<tr>'+cols.map((c,j)=>`<th data-j="${j}" class="${added&&j<3?'new':''}" tabindex="0">${c}</th>`).join('')+'</tr>'+
      rows.map((r,i)=>'<tr>'+r.map((v,j)=>`<td data-i="${i}" data-j="${j}" class="${added&&j<3?'new':''}" tabindex="0">${v}</td>`).join('')+'</tr>').join('');
    const clear=()=>T.querySelectorAll('.hl,.hh').forEach(x=>x.classList.remove('hl','hh'));
    const head=j=>T.querySelector(`th[data-j="${j}"]`);
    T.querySelectorAll('th').forEach(th=>{const f=()=>{
      clear(); const j=+th.dataset.j; th.classList.add('hh'); T.querySelectorAll(`td[data-j="${j}"]`).forEach(td=>td.classList.add('hl'));
      info.innerHTML=`<b>속성명</b> 「${cols[j]}」 · 이 속성의 <b>속성값</b>: ${rows.map(r=>`<span class="at-v">${r[j]}</span>`).join(' ')}`+(added&&j<3?' <span class="muted">(예시 값)</span>':'');
    }; th.onclick=f; th.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f();}};});
    T.querySelectorAll('td').forEach(td=>{const f=()=>{
      clear(); const i=+td.dataset.i, j=+td.dataset.j; td.classList.add('hl'); head(j).classList.add('hh');
      info.innerHTML=`<b>${rows[i][added?3:0]}</b> 학생의 <b>「${cols[j]}」</b> 속성의 속성값은 <span class="at-v">${rows[i][j]}</span>이에요.`+(added&&j<3?' <span class="muted">(예시 값)</span>':'');
    }; td.onclick=f; td.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f();}};});
  }
  $('atAdd').onclick=()=>{
    added=!added; draw();
    $('atAdd').textContent=added?'원래 표로 돌아가기':'속성 추가해 보기';
    info.innerHTML=added?'<b>학년 · 반 · 번호</b> 속성을 앞에 추가했어요(값은 예시). 학급 단위로 이수 여부를 확인하려면 학생이 어느 학급의 누구인지 알아야 하니까요. 이처럼 데이터의 속성은 <b>수집 목적</b>에 따라 골라요.':'표의 이름이나 칸을 눌러 보세요.';
  };
  draw();
})();

/* 02 속성 형태 판별기 (27쪽 Q1~Q6) */
(function(){
  const A=[
    {n:'이름',t:0,w:'서로 다른 사람을 구별하기 위한 고윳값을 사용해요. 순서나 위계가 없어요.'},
    {n:'성별',t:0,w:'「남」, 「여」 중 한 가지를 사용하고, 순서나 위계의 개념이 없어요.'},
    {n:'성취도',t:1,w:'A, B, C, D, E, I의 6개 문자를 사용하고, 성취도 B보다 A가 더 높다는 위계가 있어요.'},
    {n:'등급',t:1,w:'1~5 숫자를 쓰지만 숫자 사이 간격이 일정하지 않고, 등급을 구분하는 데 써요. 2등급보다 1등급의 성적이 더 높아요.'},
    {n:'출석 일수',t:3,w:'양을 나타내는 값으로 1보다 2는 정확히 1만큼 많지만 1.5 같은 중간값이 없어요.'},
    {n:'출석률',t:2,w:'양을 나타내는 값으로 소수점을 사용해 중간값을 표현해요.'},
    {n:'이수 여부',t:0,w:'「이수」, 「미이수」 중 한 가지를 사용하고, 순서나 위계의 개념이 없어요.'}
  ];
  const B=$('atJudge'); let done, jc=-1;
  function pickBar(){
    return `<div class="at-jpick">${A.map((a,i)=>`<button class="${i===jc?'on':''}${done[i]?' ok':''}" data-i="${i}">${done[i]?'✓ ':''}${a.n}</button>`).join('')}</div>`;
  }
  function home(msg){
    const n=done.filter(Boolean).length;
    B.innerHTML=pickBar()+`<div class="at-jbox">${msg||'판별할 속성을 위에서 골라요.'}<div class="at-jcnt">${n} / 7 판별 완료${n===7?' · <button class="btn ghost sm" id="atJAll">처음부터 다시</button>':''}</div></div>`;
    bindPick(); const r=$('atJAll'); if(r) r.onclick=()=>{done=A.map(()=>false);jc=-1;home();};
  }
  function bindPick(){ B.querySelectorAll('.at-jpick button').forEach(b=>b.onclick=()=>{jc=+b.dataset.i; step1();}); }
  const vals=i=>`<div class="at-jvals"><b>${A[i].n}</b>의 속성값: ${AT_ROWS.map(r=>`<span class="at-v">${r[AT_COLS.indexOf(A[i].n)]}</span>`).join(' ')}</div>`;
  function ask(q,opts,fn){
    B.innerHTML=pickBar()+`<div class="at-jbox">${vals(jc)}<p class="at-jq">${q}</p><div class="row">${opts.map((o,k)=>`<button class="btn ghost sm" data-k="${k}">${o}</button>`).join('')}</div></div>`;
    bindPick(); B.querySelectorAll('.at-jbox .btn').forEach(b=>b.onclick=()=>fn(+b.dataset.k));
  }
  function step1(){
    ask('<b>Q1 · Q4</b> 이 속성값은 숫자로 표기하면서 <b>양</b>을 의미하나요, 아니면 <b>질(분류)</b>을 의미하나요?',['양을 의미해요 → 수치형','질(분류)을 의미해요 → 범주형'],k=>{
      const isNum=k===0, right=(A[jc].t>=2)===isNum;
      const numVals=AT_ROWS.every(r=>!isNaN(parseFloat(r[AT_COLS.indexOf(A[jc].n)])));
      if(!right) return result(isNum?'수치형':'범주형',false,isNum?(numVals?'숫자로 적혀 있어도 개수나 비율 같은 <b>양</b>을 나타내는지 따져 봐요. 이 값은 무언가를 구분하는 데 쓰여요.':'이 속성값은 <b>문자</b>예요. Q1은 「숫자로 표기하면서 양을 의미하는가」를 물어요. 문자는 더하거나 평균을 낼 수 있는 양이 아니에요.'):'이 값은 개수나 비율처럼 <b>양</b>을 나타내요. 크고 작음을 계산할 수 있는지 생각해 봐요.');
      if(isNum) ask('<b>Q2 · Q3</b> 수치형이에요. 속성값을 <b>실수(소수점)</b>로 표현하나요, <b>정수</b>로 표현하나요?',['실수로 표현해요 → 연속형','정수로 표현해요 → 이산형'],k2=>{const t=k2===0?2:3; result(AT_TY[t],t===A[jc].t,t===A[jc].t?'':'값에 소수점이 있는지 다시 살펴봐요.');});
      else ask('<b>Q5 · Q6</b> 범주형이에요. 분류에 <b>위계나 좋고 나쁨</b>의 의미가 포함되어 있나요?',['없어요, 단순히 분류만 해요 → 명목형','있어요 → 순서형'],k2=>{const t=k2===0?0:1; result(AT_TY[t],t===A[jc].t,t===A[jc].t?'':(t===0?'값 사이에 「더 높다·더 좋다」 같은 순서가 있는지 생각해 봐요.':'값을 바꿔 적어도 높고 낮음이 생기는지 생각해 봐요.'));});
    });
  }
  function result(name,ok,hint){
    const a=A[jc];
    if(ok){ done[jc]=true;
      const n=done.filter(Boolean).length;
      home(`${vals(jc)}<p class="at-jr ok">✓ 「${a.n}」${josa(a.n,'은','는')} <b>${AT_TY[a.t]}</b></p><p class="at-jw">${a.w}</p>${n===7?'<p class="at-jw"><b>모두 판별했어요!</b> 아래 「표 Ⅰ-7과 표 Ⅰ-8로 확인하기」를 열어 비교해 보세요. 숫자로 적힌 등급이 범주형인 것을 놓치지 않았나요?</p>':'<p class="at-jw muted">다음 속성을 골라요.</p>'}`);
    } else {
      B.innerHTML=pickBar()+`<div class="at-jbox">${vals(jc)}<p class="at-jr ng">✗ ${name}${josa(name,'으로','로')} 판별했어요. 다시 생각해 봐요.</p><p class="at-jw">${hint}</p><button class="btn sm" id="atJRe">다시 판별하기</button></div>`;
      bindPick(); $('atJRe').onclick=step1;
    }
  }
  done=A.map(()=>false); home();
})();

/* 02 같은 1, 다른 의미 (그림 Ⅰ-3) */
(function(){
  const O=[
    {h:['불량품 개수','라인','월','담당'],r:[['0','A','9','홍'],['1','B','9','김'],['2','C','9','박']],hl:[1,0],a:3,w:'불량품을 센 개수라 1과 2 사이의 중간값이 없어요.'},
    {h:['종류','성별','몸무게','서식지'],r:[['젠투','0','4500','●●'],['아델리','1','3750','▲▲']],hl:[1,1],a:0,w:'0과 1은 펭귄의 성별을 구분하는 기호예요. 1이 0보다 크다는 뜻이 없어요.'},
    {h:['제출일','제목','일치도'],r:[['25-01-04','●●●','1.00'],['25-01-03','▲▲▲▲','0.23'],['25-01-05','◆◆◆','0.95']],hl:[0,2],a:2,w:'얼마나 일치하는지를 소수로 나타낸 양이라 0.95처럼 중간값이 있어요.'},
    {h:['가공일','등급','장소','종류','검사'],r:[['0926','1','★★','안심','합격'],['0926','2','◇◇','등심','합격']],hl:[0,1],a:1,w:'고기의 등급을 나타내는 1이라, 2등급보다 높다는 순서가 있어요.'}
  ];
  let pick;
  const card=(o,i)=>`<div class="at-oc${pick[i]==null?'':(pick[i]===o.a?' good':' bad')}"><div class="at-scroll"><table class="at-mini"><tr>${o.h.map(x=>`<th>${x}</th>`).join('')}</tr>${o.r.map((r,ri)=>`<tr>${r.map((v,ci)=>`<td class="${ri===o.hl[0]&&ci===o.hl[1]?'one':''}">${v}</td>`).join('')}</tr>`).join('')}</table></div>
      <div class="at-ob">${AT_TYS.map((t,j)=>`<button class="${pick[i]===j?'on':''}" data-i="${i}" data-j="${j}"${pick[i]!=null?' disabled':''}>${t}</button>`).join('')}</div>
      ${pick[i]==null?'':`<p class="at-jw">${pick[i]===o.a?'<span class="ok">맞아요.</span>':`<span class="ng">정답은 ${AT_TY[o.a]}.</span>`} ${o.w}</p>`}</div>`;
  function draw(){
    $('atOne').innerHTML=O.slice(0,2).map((o,i)=>card(o,i)).join('');
    $('atOneMore').innerHTML=O.slice(2).map((o,i)=>card(o,i+2)).join('');
    ['atOne','atOneMore'].forEach(id=>$(id).querySelectorAll('button').forEach(b=>b.onclick=()=>{pick[+b.dataset.i]=+b.dataset.j; draw();}));
  }
  $('atOneRe').onclick=()=>{pick=O.map(()=>null); draw();};
  pick=O.map(()=>null); draw();
})();

/* 03 출석률 계산기 · 점그래프 */
(function(){
  const days=AT_ROWS.map(r=>+r[4]), rate=AT_ROWS.map(r=>r[5]);
  function calc(){
    const N=+$('atDays').value; $('atDaysOut').textContent=N;
    let ok=0;
    $('atCalc').innerHTML='<tr><th>이름</th><th>출석 일수</th><th>출석 일수 ÷ '+N+'</th><th>표의 출석률</th><th></th></tr>'+
      AT_ROWS.map((r,i)=>{const c=(days[i]/N).toFixed(2), m=c===rate[i]; if(m) ok++; return `<tr><td>${r[0]}</td><td>${days[i]}</td><td>${c}</td><td>${rate[i]}</td><td class="${m?'ok':'ng'}">${m?'✓':'✗'}</td></tr>`;}).join('');
    $('atCalcMsg').innerHTML=ok===5?`<span class="ok">5명 모두 맞았어요!</span> 전체 수업 일수는 <b>${N}일</b>로 보여요. 출석률 = 출석 일수 ÷ ${N}. 출석 일수가 늘면 출석률도 같은 비율로 늘어나는 <b>정비례</b> 관계예요.`:`${ok}명이 맞아요. 막대를 움직여 5명이 모두 맞는 수업 일수를 찾아보세요.`;
  }
  $('atDays').oninput=calc; calc();
  /* 점그래프: 가로 출석 일수(0~70), 세로 출석률(0~1) */
  const S=$('atScatter'), X=d=>40+d/70*265, Y=v=>180-v*160;
  for(let v=0;v<=1.001;v+=.25){el('line',{x1:40,x2:305,y1:Y(v),y2:Y(v),class:'gl'},S); el('text',{x:34,y:Y(v)+4,class:'tk','text-anchor':'end'},S,v.toFixed(2));}
  for(let d=0;d<=70;d+=10){el('text',{x:X(d),y:196,class:'tk','text-anchor':'middle'},S,d);}
  el('line',{x1:X(0),y1:Y(0),x2:X(70),y2:Y(70/64),class:'at-ln'},S);
  el('text',{x:172,y:208,class:'axl','text-anchor':'middle'},S,'출석 일수');
  el('text',{x:44,y:14,class:'axl'},S,'출석률');
  AT_ROWS.forEach((r,i)=>{el('circle',{cx:X(days[i]),cy:Y(+rate[i]),r:5.5,class:'at-pt'},S); const far=days[i]>55; el('text',{x:X(days[i])+(far?-8:8),y:Y(+rate[i])+(far?4:12),class:'tk','text-anchor':far?'end':'start'},S,r[0]);});
})();

/* 03 투표: 5명으로 관계를 말할 수 있을까? */
vote('atVote','sexVote',[['관계가 있다','남학생이 이수한 비율이 더 높으니까'],['아직 알 수 없다','5명은 너무 적으니까']],()=>$('atVoteAns').classList.add('on'));

/* 04 수면·건강 데이터 속성 판별 (교과서 29쪽) — a: 맞는 답(판단이 갈리면 두 개) */
(function(){
  const S=[
    {n:'성별',v:'남성',a:[0],w:'남성·여성을 구분하는 값이고 순서나 위계가 없어요.'},
    {n:'나이',v:'27, 28',a:[3],w:'나이는 몇 해를 살았는지 <b>햇수를 센 값</b>이라 Q3대로 이산형이에요. 혈압이나 활동 시간은 「재는 양」이라 판단이 갈리지만, 나이는 「세는 값」이라 이산형 하나로 봐요.'},
    {n:'직업',v:'소프트웨어 엔지니어, 의사, 영업 사원',a:[0],w:'직업을 분류하는 이름이고 좋고 나쁨의 순서가 없어요(Q5).'},
    {n:'수면 시간(시)',v:'6.1, 6.2, 5.9',a:[2],w:'잠을 잔 시간의 양을 소수점이 있는 실수로 나타내 중간값을 표현해요(Q2).'},
    {n:'수면 질(1-10)',v:'6, 6, 4',a:[3,1],w:'<b>판단이 갈리는 속성</b>이에요. 1~10을 정수 점수로 보면 수치형-이산형, 만족도처럼 「좋고 나쁨의 단계」로 보면 범주형-순서형이에요. 어느 쪽인지보다 왜 그렇게 보았는지가 중요해요.'},
    {n:'신체 활동 수준(분)',v:'42, 60, 30',a:[3,2],w:'<b>판단이 갈리는 속성</b>이에요. 분 단위 정수로 적혀 있으니 이산형(Q3)으로 볼 수 있고, 활동한 시간은 본래 연속된 양이라 연속형으로 볼 수도 있어요.'},
    {n:'스트레스 지수(1-10)',v:'6, 8, 8',a:[3,1],w:'<b>판단이 갈리는 속성</b>이에요. 수면 질처럼 1~10 점수예요. 정수 점수로 보면 이산형, 높고 낮음의 단계로 보면 순서형이에요.'},
    {n:'체질량 지수',v:'과체중, 정상, 비만',a:[1],w:'숫자가 아니라 정상, 과체중, 비만처럼 위계가 있는 문자로 분류했어요(Q6).'},
    {n:'혈압',v:'126/83, 125/80, 140/90',a:[2,3],w:'<b>판단이 갈리는 속성</b>이에요. 수축기 혈압과 이완기 혈압 두 수치를 「/」로 함께 적은 값이에요. 혈압은 연속된 양을 재는 값이라 연속형으로 볼 수 있고, 정수로 적혀 있어 이산형으로 볼 수도 있어요. 분석할 때는 두 수치를 나누어 두 속성으로 저장하면 편해요.'},
    {n:'심박수',v:'77, 75, 85',a:[3],w:'1분 동안 심장이 뛴 횟수를 정수로 나타내요(Q3).'},
    {n:'일일 걸음 수',v:'4200, 10000, 3000',a:[3],w:'걸음의 개수를 센 값이라 중간값이 없어요(Q3).'},
    {n:'수면 장애',v:'없음, 수면 무호흡',a:[0],w:'수면 장애의 종류를 분류하는 값이고 순서가 없어요(Q5).'}
  ];
  const B=$('atSleep'); let pick, done;
  function draw(){
    B.innerHTML='<div class="at-srows">'+S.map((s,i)=>{
      const st=done?(pick[i]==null?' bad':(s.a.includes(pick[i])?(s.a.length>1?' amb':' good'):' bad')):'';
      return `<div class="at-sr${st}"><div class="at-sn"><b>${s.n}</b><small>${s.v}</small></div><div class="at-ob">${AT_TYS.map((t,j)=>`<button class="${pick[i]===j?'on':''}" data-i="${i}" data-j="${j}"${done?' disabled':''}>${t}</button>`).join('')}</div>${done?`<p class="at-jw">${pick[i]!=null&&s.a.includes(pick[i])?'<span class="ok">맞아요.</span>':`<span class="ng">${s.a.map(x=>AT_TY[x]).join(' 또는 ')}</span>`} ${s.w}</p>`:''}</div>`;
    }).join('')+'</div>';
    B.querySelectorAll('button').forEach(b=>b.onclick=()=>{pick[+b.dataset.i]=+b.dataset.j; draw();});
  }
  function start(){ pick=S.map(()=>null); done=false; draw(); $('atSleepMsg').textContent='12개를 모두 고르면 확인할 수 있어요.'; }
  $('atSleepOk').onclick=()=>{
    const left=pick.filter(p=>p==null).length;
    if(left){ $('atSleepMsg').textContent=`아직 ${left}개를 고르지 않았어요.`; return; }
    done=true; draw();
    const ok=S.filter((s,i)=>s.a.includes(pick[i])).length;
    $('atSleepMsg').innerHTML=`<b>12개 중 ${ok}개</b>가 맞아요. <span class="at-key amb">노란 줄</span>은 판단이 갈리는 속성이에요. 친구와 「왜 그렇게 보았는지」 이야기해 보고, 질문폼 3번에 활용해요.`;
    MEMO.sleepTypes=S.map((s,i)=>`${s.n}: ${AT_TY[pick[i]]}`).join(' · '); store.set(MK,MEMO);
  };
  $('atSleepRe').onclick=start;
  start();
})();

/* 04 개념 빈칸 · 성취도 평가 */
document.querySelectorAll('.at-blanks .blank').forEach(b=>b.onclick=()=>{b.textContent=b.dataset.a; b.classList.add('on');});
chips('atSelf','selfCheckPick',['속성명과 속성값을 구분할 수 있다','범주형과 수치형을 구분할 수 있다','명목형·순서형·연속형·이산형을 판별할 수 있다','두 속성의 관계를 근거와 함께 말할 수 있다'],true);

/* 05 정리 (선택): 자전거 대여 데이터 (새로 만든 예시) */
sorter('atBike',{
  cats:[{n:'수치형',k:'#2f6fd0'},{n:'범주형',k:'#e0702b'}],
  items:[
    {t:'대여 번호 (예: B-0412, B-0413)',short:'대여 번호',c:1,ic:'🔖',w:'대여 건을 구별하는 고윳값이라 크기를 비교하거나 계산하지 않아요.'},
    {t:'이동 거리 (예: 3.2km, 7.8km)',short:'이동 거리',c:0,ic:'📏',w:'거리라는 양을 소수점이 있는 숫자로 나타내요.'},
    {t:'대여소 이름 (예: 정문 앞, 체육관 옆)',short:'대여소 이름',c:1,ic:'📍',w:'대여소를 구분하는 이름이에요.'},
    {t:'이용 시간 (예: 25분, 48분)',short:'이용 시간',c:0,ic:'⏱️',w:'시간의 양을 숫자로 나타내요.'},
    {t:'요금제 (예: 일반, 정기권)',short:'요금제',c:1,ic:'💳',w:'요금제의 종류를 나누는 값이에요.'},
    {t:'이용자 연령대 (예: 10대, 20대, 30대)',short:'이용자 연령대',c:1,ic:'👥',w:'나이를 구간으로 묶어 몇 개의 항목으로 나누었어요. 순서가 있는 범주예요(표 Ⅰ-9의 고객 연령처럼).'},
    {t:'하루 대여 횟수 (예: 3회, 5회)',short:'하루 대여 횟수',c:0,ic:'🔁',w:'횟수를 센 값이라 계산할 수 있어요.'},
    {t:'헬멧 착용 여부 (예: 0, 1)',short:'헬멧 착용 여부',c:1,ic:'⛑️',w:'숫자로 적었지만 착용했는지 아닌지를 나누는 기호예요. 그림 Ⅰ-3의 펭귄 성별 0, 1과 같아요.'}
  ],
  end:'<b>정리</b> 숫자로 적혀 있어도 <b>구분하는 기호</b>면 범주형이고, 구간으로 묶은 값도 범주형으로 다뤄요. 양을 재거나 센 값이 수치형이에요.'
});
chips('atLevel','levelPick',['정형 데이터와 비정형 데이터의 개념을 설명할 수 있다','데이터에서 수치형 데이터와 범주형 데이터를 구분할 수 있다','데이터를 기반으로 합리적 의사 결정을 하려는 태도를 가지고 있다'],true);

/* 06 마무리 */
const MEMOLIST=[['planGuess','처음 생각: 같은 「1」이 다른 뜻이 되는 예'],['numTrap','숫자라고 계산해도 될까(등급의 평균)'],['sexVote','5명으로 성별과 이수 여부의 관계를 말할 수 있을까(투표)'],['sleepTypes','수면·건강 데이터 속성 판별'],['relMemo','속성 간의 관계와 근거'],['valueMemo','데이터 분석의 잠재적 가치(한 문장)'],['selfCheckPick','성취도 평가: 할 수 있게 된 것'],['capDiff','(선택) 정형·비정형 데이터의 차이'],['capCar','(선택) 중고차 데이터 수치형·범주형'],['capEthics','(선택) 데이터 기반 의사 결정과 윤리'],['levelPick','(선택) 내 실력 점검'],['boothData','(선택) 보충: 축제 음식 부스 데이터'],['deepData','(선택) 심화: 공개 데이터 분석'],['planCheck','(선택) 나의 계획 점검'],['newLearn','(선택) 새롭게 알게 된 점'],['keyQ','오늘의 질문에 대한 내 답']];
/* (선택) 항목은 쓴 것만 모아 보기에 보이기 */
onShow[6]=()=>memoSummary('msum',MEMOLIST.filter(([k,l])=>!l.startsWith('(선택)')||String(MEMO[k]||'').trim()));

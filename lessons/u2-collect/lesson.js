/* u2-collect 데이터 수집과 편향 (교과서 58~66쪽) */

/* 0 시작 · 급식 메뉴 정하기 (60~61쪽 과정을 새 예시 답으로) */
(function(){
  const FR=['딸기','바나나','키위','귤','포도'];
  const ANS=['딸기','바나나','딸기','귤','포도','바나나','딸기','피자','키위','바나나','딸기','포도','없음','귤','바나나','딸기','키위','','바나나','딸기'];
  let step=0;
  function draw(){
    const B=$('coLunch');
    if(step===0){ B.innerHTML='<p class="muted" style="margin:0">「① 설문 답 모으기」를 눌러 시작해요.</p>'; }
    else{
      const off=ANS.filter(a=>!FR.includes(a));
      const keep=step>=2?ANS.filter(a=>FR.includes(a)):ANS;
      let h=`<div class="co-slips"><b>📮 모은 답 ${keep.length}장</b><div>${keep.map(a=>`<span class="${FR.includes(a)?'':'off'}">${a?esc(a):'(빈칸)'}</span>`).join('')}</div></div>`;
      if(step>=2) h+=`<div class="co-slips co-off"><b>✂️ 따로 나눈 답 ${off.length}장</b><div>${off.map(a=>`<span>${a?esc(a):'(빈칸)'}</span>`).join('')}</div><small>과일 목록에 없는 메뉴를 쓰거나 비워 낸 답처럼 질문에서 벗어난 답이에요.</small></div>`;
      if(step>=3){
        const cnt=FR.map(f=>[f,ANS.filter(a=>a===f).length]), n=cnt.reduce((s,c)=>s+c[1],0), mx=Math.max(...cnt.map(c=>c[1]));
        h+=`<div class="co-bars"><b>📊 가장 좋아하는 과일 (${n}명)</b>${cnt.map(([f,c])=>`<div class="co-bar"><span>${f}</span><i style="width:${c/mx*100}%"></i><em>${c}명</em></div>`).join('')}<small>그래프로 정리하니 좋아하는 메뉴가 한눈에 보여요. 영양사 선생님은 여기에 영양소와 식비를 더 확인해 메뉴를 정해요.</small></div>`;
      }
      B.innerHTML=h;
    }
    $('coL1').disabled=step>=1; $('coL2').disabled=step!==1; $('coL3').disabled=step!==2;
  }
  $('coL1').onclick=()=>{step=1;draw();}; $('coL2').onclick=()=>{step=2;draw();}; $('coL3').onclick=()=>{step=3;draw();}; $('coL0').onclick=()=>{step=0;draw();};
  draw();
})();
vote('coTrust','trustPick',[['누가 만든 데이터인가','출처'],['언제 모은 데이터인가','최신 정보'],['어떻게 모은 데이터인가','수집 방법'],['얼마나 많이 모았나','데이터의 양']],()=>$('coTrustMore').classList.add('on'));

/* 01 변수 역할 정하기 (새 가설 4개) — p: 가설 조각, ind/dep: 독립·종속 변수 조각 번호 */
(function(){
  const H=[
    {p:['아침을 거르면','오전 수업 집중력이','떨어질까?'],ind:0,dep:1,iv:'아침 식사 여부',dv:'오전 수업 집중력'},
    {p:['체육 시간 달리기 기록은','전날 잠을 잔 시간에 따라','달라질까?'],ind:1,dep:0,iv:'수면 시간',dv:'달리기 기록'},
    {p:['운동을 많이 하면','그날 밤 잠을 자는 시간이','길어질까?'],ind:0,dep:1,iv:'운동량',dv:'수면 시간'},
    {p:['밤에 잠을 적게 자면','다음 날 운동량이','줄어들까?'],ind:0,dep:1,iv:'수면 시간',dv:'운동량'}
  ];
  const PEN=[['ind','🔧 독립 변수 (영향을 주는 쪽)'],['dep','🎯 종속 변수 (영향을 받는 쪽)'],['','🧽 지우개']];
  let pen='ind', mark, checked;
  function draw(){
    $('coPens').innerHTML=PEN.map(([k,t])=>`<button class="co-pen ${k||'er'}${pen===k?' on':''}" data-k="${k}">${t}</button>`).join('');
    $('coPens').querySelectorAll('button').forEach(b=>b.onclick=()=>{pen=b.dataset.k; draw();});
    $('coHyp').innerHTML=H.map((h,i)=>{
      const ok=checked&&mark[i][h.ind]==='ind'&&mark[i][h.dep]==='dep'&&mark[i].filter(Boolean).length===2;
      return `<div class="co-hyp${checked?(ok?' good':' bad'):''}"><span class="co-hn">${'ABCD'[i]}</span><div class="co-hp">${h.p.map((t,j)=>`<button class="${mark[i][j]||''}" data-i="${i}" data-j="${j}"${checked?' disabled':''}>${t}</button>`).join(' ')}</div>${checked?`<p class="co-hw">${ok?'<span class="ok">맞아요.</span>':'<span class="ng">다시 볼까요?</span>'} 독립 변수 <b>${h.iv}</b> → 종속 변수 <b>${h.dv}</b></p>`:''}</div>`;
    }).join('');
    $('coHyp').querySelectorAll('.co-hp button').forEach(b=>b.onclick=()=>{mark[+b.dataset.i][+b.dataset.j]=pen; draw();});
  }
  function start(){ mark=H.map(h=>h.p.map(()=>'')); checked=false; $('coHypMsg').textContent=''; draw(); }
  $('coHypOk').onclick=()=>{
    const left=mark.filter(m=>m.filter(Boolean).length<2).length;
    if(left){ $('coHypMsg').innerHTML=`아직 독립 변수와 종속 변수를 모두 칠하지 않은 가설이 <b>${left}개</b> 있어요.`; return; }
    checked=true; draw();
    const ok=H.filter((h,i)=>mark[i][h.ind]==='ind'&&mark[i][h.dep]==='dep'&&mark[i].filter(Boolean).length===2).length;
    $('coHypMsg').innerHTML=`<b>4개 중 ${ok}개</b>를 맞혔어요. B는 결과(달리기 기록)가 문장 앞에 나와도 원인은 잠잔 시간이에요. 그리고 <b>C와 D</b>를 견주어 보세요. 같은 <b>수면 시간</b>이 C에서는 종속 변수, D에서는 독립 변수예요. 변수의 역할은 <b>가설에 따라</b> 달라져요.`;
  };
  $('coHypRe').onclick=start;
  start();
})();

/* 02 어떤 방법으로 모은 데이터일까? (새 상황 — 카드에 묶음 이름 낱말을 넣지 않음) */
sorter('coWay',{
  cats:[{n:'직접 수집',k:'#e0702b'},{n:'센서·온라인 서비스에 쌓인 데이터',k:'#2f6fd0'},{n:'기관·기업이 공개한 데이터',k:'#1f9d74'}],
  items:[
    {t:'급식실 앞에서 반별 잔반 무게를 저울로 재어 기록표에 적었다.',short:'잔반 무게 재기',c:0,ic:'⚖️',w:'사람이 저울로 측정해 모은 데이터라 어떻게 재고 적을지 정할 수 있어요.'},
    {t:'쉬는 시간마다 매점 앞에 줄 선 학생 수를 세어 두었다.',short:'매점 줄 세기',c:0,ic:'👀',w:'사람이 지켜보며 세는 관찰로 모은 데이터예요.'},
    {t:'손목에 찬 시계가 하루 동안 심박수를 1분마다 남겼다.',short:'시계의 심박수 기록',c:1,ic:'⌚',w:'생체 센서가 사람이 손대지 않아도 기록을 쌓아요. 앱을 쓰는 동안 기록이 쌓이는 온라인 서비스도 같은 묶음이에요.'},
    {t:'교문 위 카메라가 드나드는 사람 수를 세어 서버로 보낸다.',short:'교문 카메라',c:1,ic:'📷',w:'같은 「세기」라도 사람이 아니라 카메라 센서가 기록을 쌓아요. 매점 줄을 사람이 센 것과 견주어 보세요.'},
    {t:'시청이 누리집에 올려 둔 공원별 방문자 수 파일로 공원 이용을 분석했다.',short:'시청의 공원 방문자 수',c:2,ic:'🏛️',w:'공공 기관이 공개한 데이터예요. 출처가 명확해 믿고 쓸 수 있어요.'},
    {t:'데이터 공유 사이트에 한 기업이 올려 둔 영화 평점 파일을 분석에 썼다.',short:'영화 평점 파일',c:2,ic:'🎬',w:'출처가 명확한 민간 기업이 공개한 데이터를 썼어요.'}
  ],
  end:'<b>정리</b> 사람이 관찰·측정·설문으로 모으면 <b>직접 수집</b>, 기기나 앱이 쓰는 동안 저절로 쌓으면 <b>센서·온라인 서비스</b>, 기관이나 기업이 올려 둔 파일을 쓰면 <b>기관·기업이 공개한 데이터</b>예요. 같은 「세기」라도 누가(무엇이) 기록하는지 보세요.'
});

/* 03 편향 표본 뽑기 실험 — 가상의 학교 200명(값은 예시, 시드로 고정) */
(function(){
  let s=20260058;
  const R=()=>{s|=0; s=s+0x6D2B79F5|0; let t=Math.imul(s^s>>>15,1|s); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296;};
  const G=()=>{let u=0; while(!u) u=R(); const v=R(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);};
  const P=[];
  for(let i=0;i<200;i++){
    const city=i<120, k=city?i:i-120, cols=city?12:8;
    let t=Math.round((city?38:56)+G()*16); t=Math.max(0,Math.min(120,t));
    const x=(city?28:418)+(k%cols)*26+(R()-.5)*8, y=40+Math.floor(k/cols)*22+(R()-.5)*8;
    P.push({i,city,t,x,y});
  }
  const avg=a=>a.reduce((p,c)=>p+c,0)/a.length;
  const MU=avg(P.map(p=>p.t));
  const f1=v=>v.toFixed(1);
  const pickU=pool=>shuffle(pool).slice(0,30);
  const pickW=(pool,wf)=>{ const rest=pool.slice(), out=[];
    while(out.length<30){ const w=rest.map(wf), tot=w.reduce((a,b)=>a+b,0); let r=Math.random()*tot, j=0; while(j<rest.length-1&&r>=w[j]){r-=w[j];j++;} out.push(rest.splice(j,1)[0]); }
    return out; };
  const M=[
    {k:'gym',n:'체육관 앞에서 30명',ic:'🏀',c:'#e0702b',d:'방과 후 체육관 앞을 지나는 학생에게 물어요.',pick:()=>pickW(P,p=>Math.pow(p.t+5,3))},
    {k:'city',n:'A 동네 학생만 30명',ic:'🏘️',c:'#9b4fc4',d:'A 동네 학생 120명 가운데서만 무작위로 뽑아요.',pick:()=>pickU(P.filter(p=>p.city))},
    {k:'rand',n:'전교생에서 무작위 30명',ic:'🎲',c:'#2f6fd0',d:'200명 모두에게 번호를 주고 제비뽑기로 뽑아요.',pick:()=>pickU(P)}
  ];
  const MAX=10, SK=MK+'-co-bias';
  let runs=store.get(SK,null); if(!runs||typeof runs!=='object') runs={};
  M.forEach(m=>{ if(!Array.isArray(runs[m.k])) runs[m.k]=[]; runs[m.k]=runs[m.k].filter(v=>typeof v==='number').slice(0,MAX); });
  let last=null;
  const col=t=>t<30?'#d7efe5':t<60?'#6cc3a0':'#1f7a5a';

  function drawSchool(){
    const S=$('coSchool'); S.setAttribute('viewBox','0 0 640 280'); S.innerHTML='';
    el('rect',{x:10,y:8,width:330,height:262,rx:12,class:'co-zone'},S); el('rect',{x:400,y:8,width:228,height:262,rx:12,class:'co-zone'},S);
    el('text',{x:20,y:26,class:'co-zt'},S,'🏘️ A 동네 학생 120명'); el('text',{x:410,y:26,class:'co-zt'},S,'🏡 B 동네 학생 80명');
    const picked=new Set(last?last.ids:[]);
    P.forEach(p=>{ el('circle',{cx:p.x,cy:p.y,r:7,fill:col(p.t),class:picked.has(p.i)?'co-dot on':'co-dot'},S); });
    el('text',{x:370,y:150,class:'co-zt','text-anchor':'middle'},S,'🏫');
  }
  function drawStrip(){
    const S=$('coStrip'); S.setAttribute('viewBox','0 0 640 210'); S.innerHTML='';
    const lo=25, hi=75, X=v=>170+(Math.max(lo,Math.min(hi,v))-lo)/(hi-lo)*430;
    for(let v=lo;v<=hi;v+=5){ el('line',{x1:X(v),x2:X(v),y1:20,y2:180,class:'co-gl'},S); el('text',{x:X(v),y:198,class:'co-tk','text-anchor':'middle'},S,v); }
    el("text",{x:638,y:198,class:"co-tk","text-anchor":"end"},S,"(분)");
    el('line',{x1:X(MU),x2:X(MU),y1:12,y2:182,class:'co-mu'},S);
    el('text',{x:X(MU),y:10,class:'co-mut','text-anchor':'middle'},S,`전체 평균 ${f1(MU)}분`);
    M.forEach((m,r)=>{
      const y=50+r*55;
      el('text',{x:8,y:y+4,class:'co-rl'},S,`${m.ic} ${m.n}`);
      runs[m.k].forEach((v,j)=>{ const isLast=last&&last.k===m.k&&j===runs[m.k].length-1;
        el('circle',{cx:X(v),cy:y+((j%3)-1)*7,r:isLast?8:6,fill:m.c,class:isLast?'co-sd last':'co-sd'},S); });
    });
  }
  function drawTable(){
    let h='<tr><th class="l">뽑는 방법</th><th>뽑은 횟수</th><th>표본 평균들의 평균</th><th>전체 평균과의 차이</th><th>전체 평균보다 큰 횟수</th></tr>';
    M.forEach(m=>{ const a=runs[m.k];
      if(!a.length){ h+=`<tr><td class="l">${m.ic} ${m.n}</td><td>0</td><td colspan="3" class="muted">아직 안 뽑음</td></tr>`; return; }
      const mm=avg(a), d=mm-MU;
      h+=`<tr><td class="l">${m.ic} ${m.n}</td><td>${a.length}</td><td>${f1(mm)}분</td><td class="${Math.abs(d)>=5?'ng':''}">${d>=0?'+':''}${f1(d)}분</td><td>${a.filter(v=>v>MU).length} / ${a.length}</td></tr>`; });
    $('coRunTbl').innerHTML=h;
  }
  function log(){
    MEMO.biasLog=M.filter(m=>runs[m.k].length).map(m=>{const a=runs[m.k], d=avg(a)-MU; return `${m.n} ${a.length}번: 표본 평균들의 평균 ${f1(avg(a))}분(전체 평균 ${f1(MU)}분과 ${d>=0?'+':''}${f1(d)}분), 전체 평균보다 큰 횟수 ${a.filter(v=>v>MU).length}번`;}).join('\n');
    store.set(MK,MEMO); store.set(SK,runs);
  }
  function drawMethods(){
    $('coMethods').innerHTML=M.map(m=>`<div class="co-m" style="--k:${m.c}"><b>${m.ic} ${m.n}</b><small>${m.d}</small><button class="btn sm" data-k="${m.k}"${runs[m.k].length>=MAX?' disabled':''}>${runs[m.k].length>=MAX?'10번 다 뽑았어요':`한 번 뽑기 (${runs[m.k].length}/${MAX})`}</button></div>`).join('');
    $('coMethods').querySelectorAll('button').forEach(b=>b.onclick=()=>run(b.dataset.k,true));
  }
  function run(k,show){
    const m=M.find(x=>x.k===k); if(runs[k].length>=MAX) return;
    const smp=m.pick(), v=avg(smp.map(p=>p.t)); runs[k].push(v); last={k,ids:smp.map(p=>p.i)};
    if(show){ const d=v-MU;
      $('coRunMsg').innerHTML=`${m.ic} <b>${m.n}</b>의 평균 운동 시간은 <b>${f1(v)}분</b>이에요. 전체 평균 ${f1(MU)}분보다 <b>${f1(Math.abs(d))}분 ${d>=0?'많아요':'적어요'}</b>. 위 그림에서 테두리가 굵은 점이 이번에 뽑힌 30명이에요.`+(runs[k].length===1?' 같은 방법으로 몇 번 더 뽑아 보세요.':''); }
    redraw();
  }
  function redraw(){ drawSchool(); drawStrip(); drawTable(); drawMethods(); log(); }
  $('coRunAll').onclick=()=>{
    M.forEach(m=>{ while(runs[m.k].length<MAX) run(m.k,false); });
    $('coRunMsg').innerHTML='세 방법 모두 10번씩 뽑았어요. 아래 그림에서 점들이 <b>전체 평균 선</b>의 어느 쪽에 모였는지 비교해 보세요. 치우친 방법은 다시 뽑아도 <b>같은 쪽으로</b> 빗나가고, 무작위로 뽑으면 선의 <b>양쪽에 흩어지며</b> 표의 「전체 평균과의 차이」가 <b>작아요</b>. 표의 차이 값을 세 방법끼리 비교해 보세요.';
  };
  $('coRunReset').onclick=()=>{ M.forEach(m=>runs[m.k]=[]); last=null; $('coRunMsg').innerHTML='기록을 지웠어요. 방법마다 「한 번 뽑기」를 눌러 다시 시작해요.'; delete MEMO.biasLog; redraw(); };
  $('coRunMsg').innerHTML=M.some(m=>runs[m.k].length)?'지난번 기록을 불러왔어요. 이어서 뽑거나 「기록 지우기」로 처음부터 할 수 있어요.':'방법마다 「한 번 뽑기」를 눌러 보세요. 전체 평균은 실제 조사에서는 모르는 값이지만, 실험이라 미리 보여 줘요.';
  drawSchool(); drawStrip(); drawTable(); drawMethods();
})();

/* 03 돌아온 전투기 (65쪽 사례 — 점 위치는 설명을 위해 새로 그린 예시) */
(function(){
  const S=$('coPlane');
  const body='<path d="M150 10 C158 10 162 22 162 40 L162 120 L190 150 L190 158 L162 150 L160 162 L140 162 L138 150 L110 158 L110 150 L138 120 L138 40 C138 22 142 10 150 10Z" class="co-pb"/><path d="M138 62 L18 92 L18 104 L138 88Z M162 62 L282 92 L282 104 L162 88Z" class="co-pb"/><circle cx="92" cy="80" r="9" class="co-eng"/><circle cx="208" cy="80" r="9" class="co-eng"/><ellipse cx="150" cy="38" rx="8" ry="12" class="co-cock"/>';
  const HIT=[[40,96],[55,93],[70,90],[100,88],[118,86],[230,88],[245,92],[262,96],[270,98],[180,86],[150,100],[146,112],[154,124],[150,136],[120,154],[180,154],[44,100],[256,99]];
  const draw=b=>{
    S.innerHTML=body+HIT.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.6" class="co-hit"/>`).join('')+(b?'<text x="92" y="66" class="co-q" text-anchor="middle">?</text><text x="208" y="66" class="co-q" text-anchor="middle">?</text><text x="150" y="20" class="co-q" text-anchor="middle" dy="-2">?</text>':'');
    $('coPlaneA').classList.toggle('on',!b); $('coPlaneB').classList.toggle('on',b);
    $('coPlaneMsg').innerHTML=b?'<b>추락한 비행기는 어디를 맞았을까요?</b> 돌아온 비행기에 자국이 <b>거의 없는 곳</b>(그림의 ?)을 맞은 비행기는 돌아오지 못했을 수 있어요. 돌아온 비행기만 살펴보면 정말 위험한 곳을 놓쳐요. 살아남은 데이터만 모인 <b>선택 편향</b>이에요.':'빨간 점은 무사히 돌아온 비행기에서 찾은 총알 자국이에요(예시). 이 자국이 많은 곳을 보강하면 될까요?';
  };
  $('coPlaneA').onclick=()=>draw(false); $('coPlaneB').onclick=()=>draw(true);
  draw(false);
})();

/* 03 어떤 편향일까? (새 사례 — 카드에 묶음 이름 낱말을 넣지 않음) */
sorter('coBias',{
  cats:[{n:'확증 편향',k:'#d64535'},{n:'사회적 편향',k:'#9b4fc4'},{n:'선택 편향',k:'#1f9d74'}],
  items:[
    {t:'「게임을 하면 시력이 나빠진다」고 굳게 생각하는 사람이, 게임을 많이 해도 눈이 좋은 친구 이야기는 예외라며 넘겼다.',short:'게임과 시력',c:0,ic:'🎮',w:'자기 생각과 반대되는 정보를 무시했어요.'},
    {t:'새 문제집 덕분에 성적이 오른다고 믿는 학생이, 문제집을 다 푼 뒤 떨어진 과목 점수는 「그날 컨디션 탓」이라며 따져 보지 않았다.',short:'문제집 효과',c:0,ic:'📚',w:'점수 기록은 모두 있었지만, 믿음과 반대되는 결과를 해석에서 무시했어요.'},
    {t:'번역 앱이 성별이 드러나지 않은 문장에서 「의사」는 남자로, 「간호사」는 여자로 바꿔 옮겼다.',short:'번역 앱의 성별',c:1,ic:'🌐',w:'특정 성별에 대한 사회적 관념이 학습 데이터에 담겨 결과에 나타났어요.'},
    {t:'면접관이 지원자가 사는 동네를 보고 「그 동네 학생들은 공부를 덜 한다」며 낮은 점수를 매겼다.',short:'사는 동네로 판단',c:1,ic:'🏘️',w:'경제적 지위 같은 특정 집단에 대해 불공정하게 판단했어요.'},
    {t:'학교 앱 만족도를 앱 알림으로만 물어서, 앱을 지운 학생들의 생각은 조사에 들어오지 않았다.',short:'앱 알림 설문',c:2,ic:'📱',w:'앱을 쓰는 학생이라는 조건의 데이터만 모여 전체를 대표하지 못해요.'},
    {t:'청소년의 평균 수면 시간을 알아보려고 밤 10시 학원가 앞에서만 설문했다.',short:'학원가 앞 설문',c:2,ic:'🌙',w:'늦게까지 학원에 있는 학생만 모여 청소년 전체를 대표하지 못해요.'}
  ],
  end:'<b>정리</b> 믿음에 맞는 정보만 보고 반대되는 정보를 무시하면 <b>확증 편향</b>, 특정 집단을 불공정하게 판단하면 <b>사회적 편향</b>, 어떤 조건의 데이터만 모여 전체를 대표하지 못하면 <b>선택 편향</b>이에요.'
});

/* 04 잔반 조사 계획 점검 (66쪽 스스로 해결하기의 수집 방법·점검 7항목을 새 문제로) */
(function(){
  const WAYS=['관찰','측정','설문 조사','공공 데이터','센서 수집','자동화','기타'];
  const NEED=['측정','설문 조사'], OKX=['관찰'];
  const IT=[
    {q:'가설의 목표를 명확히 하였는가?',a:1,w:'「튀김 메뉴가 나온 날은 잔반이 적을 것」처럼 무엇과 무엇을 비교할지 분명해요.'},
    {q:'일관된 방법으로 데이터를 수집하였는가?',a:0,w:'첫날은 저울, 다음 날부터는 눈대중이라 날마다 재는 방법이 달라요. 모든 날을 저울로 재야 해요.'},
    {q:'데이터 수집 대상을 무작위로 추출하였는가?',a:0,w:'급식실에 먼저 온 학생만 물으면 빨리 먹으러 오는 학생에게 치우쳐요. 명단에서 무작위로 뽑아야 해요.'},
    {q:'편견이 내재된 데이터가 포함되었는지 확인하였는가?',a:0,w:'「더 맛있지 않나요?」처럼 원하는 답을 이끄는 질문은 조사하는 사람의 믿음이 응답에 섞이게 해요.'},
    {q:'인구 통계학적 비율에 따라 표본 대상이 선택되었는가?',a:1,w:'학년별 학생 수 비율에 맞춰 7·7·6명을 정했어요.'},
    {q:'예측 결과에 따른 데이터의 비율이 균등한가?',a:0,w:'이 항목은 「비교하려는 경우마다 데이터 양이 고른지」로 풀어 읽었어요. 튀김이 나온 날·안 나온 날이 2일 대 8일이라 한쪽 데이터가 너무 적어요.'},
    {q:'이상치 및 결측치 데이터를 확인하였는가?',a:1,w:'급식이 없던 날과 빈칸 기록을 따로 표시해 확인해요.'}
  ];
  const B=$('coCheck'); let ways, pick, done;
  function draw(){
    const wayRes=done?(()=>{const miss=NEED.filter(w=>!ways.includes(w)), extra=ways.filter(w=>!NEED.includes(w)&&!OKX.includes(w));
      return `<p class="co-hw">${!miss.length&&!extra.length?'<span class="ok">맞아요.</span>':'<span class="ng">다시 볼까요?</span>'} 저울로 잰 <b>측정</b>과 학생에게 묻는 <b>설문 조사</b>를 썼어요. 잔반 통을 보고 적은 것은 관찰로 볼 수도 있어요.${extra.length?` <b>${extra.join(', ')}</b>${josaK(extra[extra.length-1])} 이 계획에 없어요.`:''}</p>`;})():'';
    B.innerHTML=`<div class="co-step"><b>① 이 계획에 쓰인 수집 방법을 모두 골라요.</b><div class="co-ways">${WAYS.map(w=>`<button class="${ways.includes(w)?'on':''}" data-w="${w}"${done?' disabled':''}>${w}</button>`).join('')}</div>${wayRes}</div>
      <div class="co-step"><b>② 편향 최소화를 위해 고려할 점 · 이 계획은 어떤가요?</b>
      <div class="co-items">${IT.map((it,i)=>{const st=done?(pick[i]===it.a?' good':' bad'):'';
        return `<div class="co-it${st}"><span class="co-iq">${i+1}. ${it.q}</span><span class="co-yn"><button class="${pick[i]===1?'on':''}" data-i="${i}" data-v="1"${done?' disabled':''}>예</button><button class="${pick[i]===0?'on':''}" data-i="${i}" data-v="0"${done?' disabled':''}>아니요</button></span>${done?`<p class="co-hw">${pick[i]===it.a?'<span class="ok">맞아요.</span>':`<span class="ng">「${it.a?'예':'아니요'}」로 보아요.</span>`} ${it.w}</p>`:''}</div>`;}).join('')}</div></div>
      <div class="row"><button class="btn sm" id="coChkOk"${done?' disabled':''}>확인하기</button><button class="btn ghost sm" id="coChkRe">다시 하기</button></div><div class="co-msg" id="coChkMsg"></div>`;
    B.querySelectorAll('.co-ways button').forEach(b=>b.onclick=()=>{const w=b.dataset.w; ways=ways.includes(w)?ways.filter(x=>x!==w):[...ways,w]; draw();});
    B.querySelectorAll('.co-yn button').forEach(b=>b.onclick=()=>{pick[+b.dataset.i]=+b.dataset.v; draw();});
    $('coChkOk').onclick=check; $('coChkRe').onclick=start;
    if(done) $('coChkMsg').innerHTML=summary();
  }
  const josaK=w=>{const c=w.charCodeAt(w.length-1)-0xAC00; return (c>=0&&c<=11171&&c%28)?'은':'는';};
  const wayOk=()=>NEED.every(w=>ways.includes(w))&&ways.every(w=>NEED.includes(w)||OKX.includes(w));
  const summary=()=>{const ok=IT.filter((it,i)=>pick[i]===it.a).length; return `① 수집 방법은 ${wayOk()?'<b>맞게</b> 골랐어요':'<b>다시 볼 곳</b>이 있어요'}. ② <b>7개 중 ${ok}개</b>를 맞혔어요. 「아니요」인 항목이 <b>4개</b>예요. 아래 칸에 두 가지 이상을 골라 고칠 방법을 적어요.`;};
  function check(){
    if(!ways.length){ $('coChkMsg').textContent='① 수집 방법을 먼저 골라요.'; return; }
    const left=pick.filter(p=>p==null).length;
    if(left){ $('coChkMsg').textContent=`② 아직 ${left}개 항목을 고르지 않았어요.`; return; }
    done=true; draw();
    MEMO.checkLog='① 수집 방법: '+ways.join(', ')+(wayOk()?'':' (다시 볼 것: 측정·설문 조사, 관찰은 인정)')+'\n② '+IT.filter((it,i)=>pick[i]===it.a).length+'/7 맞음\n'+IT.map((it,i)=>`${i+1}. ${it.q} → ${pick[i]?'예':'아니요'}${pick[i]===it.a?'':' (다시 볼 것)'}`).join('\n');
    store.set(MK,MEMO);
  }
  function start(){ ways=[]; pick=IT.map(()=>null); done=false; draw(); }
  start();
})();
chips('coSelf','selfCheckPick',['가설에서 종속 변수와 독립 변수를 구분할 수 있다','상황에 맞는 수집 방법을 고를 수 있다','세 가지 편향을 사례로 설명할 수 있다','조사 계획에서 편향이 생길 곳을 찾아 고칠 수 있다'],true);

/* 05 마무리 */
const MEMOLIST=[['planGuess','처음 생각: 민혁이는 무엇을, 누구에게서 조사할까'],['trustPick','믿을 만한 데이터인지 볼 때 가장 먼저 볼 것(투표)'],['planLearn','(선택) 나의 계획 · 이 단원에서 배우고 싶은 것'],['biasLog','편향 표본 뽑기 실험 기록'],['biasWhy','실험 결과 정리: 치우친 방법이 빗나간 까닭'],['biasNew','내 주변에서 찾은 편향 상황(새 사례)'],['biasMine','(선택) 헷갈린 편향 카드와 그 까닭'],['checkLog','잔반 조사 계획 점검 결과'],['fixPlan','「아니요」 항목을 고치는 방법'],['selfCheckPick','성취도 평가: 할 수 있게 된 것'],['keyQ','오늘의 질문에 대한 내 답']];
/* (선택) 항목은 쓴 것만 모아 보기에 보이기 */
onShow[5]=()=>memoSummary('msum',MEMOLIST.filter(([k,l])=>!l.startsWith('(선택)')||String(MEMO[k]||'').trim()));

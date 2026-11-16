/* u2-summary 요약 통계량으로 데이터 파악하기 (교과서 67~69쪽) */

/* 0 시작 · 지난 시간(u2-collect)에 적은 처음 생각 보여 주기 — 읽기만 함 */
(function(){
  let v=''; try{ v=String((store.get('ds-u2-collect-memo'+WHO.sfx,{})||{}).planGuess||'').trim(); }catch(e){}
  $('suPrev').innerHTML=v?`<b>지난 시간에 적은 처음 생각 · 민혁이는 무엇을 조사할까</b><span>${esc(v)}</span>`:'';
  $('suPrev').style.display=v?'':'none';
})();

/* 01 이 속성은 어떤 형일까? — t: 0 수치형, 1 범주형 (오렌지3 3.40이 obesity_level.csv를 읽은 형), both: 두 답 인정 */
(function(){
  const A=[
    {n:'id',k:'아이디',v:'0, 1, 2, … 20757',t:0,both:true,w:'오렌지3는 숫자라서 numeric으로 읽고, 교과서도 수치형에 넣어요. 하지만 아이디는 사람을 구별하는 번호라 평균을 내도 뜻이 없어요. 그래서 두 답 모두 인정하고, 분석할 때는 빼고 봐요.'},
    {n:'Gender',k:'성별',v:'Male, Female',t:1,w:'남녀를 나누는 문자 값이에요.'},
    {n:'Age',k:'나이',v:'16, 16, 17',t:0,w:'살아온 햇수를 잰 양이에요.'},
    {n:'Height',k:'키(m)',v:'1.74, 1.63, 1.83',t:0,w:'키를 잰 양이에요.'},
    {n:'Weight',k:'몸무게(kg)',v:'76, 59, 105',t:0,w:'몸무게를 잰 양이에요.'},
    {n:'family_history_with_overweight',k:'가족력 과체중 여부',v:'1, 0, 1',t:1,w:'1(있음)과 0(없음)은 양이 아니라 「있다·없다」를 나누는 기호예요.'},
    {n:'FAVC',k:'고칼로리 음식의 빈번한 섭취',v:'0, 1',t:1,w:'0과 1은 고칼로리 음식을 자주 먹는지(1) 아닌지(0)를 나누는 값이에요. 교과서 본문은 범주형으로 세 속성만 들었지만, 오렌지3는 FAVC도 categorical로 읽어요(67쪽 File 창 그림에서도 categorical).'},
    {n:'FCVC',k:'채소 섭취 빈도',v:'1~3 사이의 값 (소수 포함)',t:0,w:'1~3 사이에 2.39처럼 소수가 섞인 값이라 오렌지3는 numeric으로 읽어요.'},
    {n:'NCP',k:'일일 식사 횟수',v:'2, 3, 2',t:0,w:'하루에 먹은 끼니를 센 값이에요.'},
    {n:'CH2O',k:'일일 물 소비량',v:'1~3 사이의 값 (소수 포함)',t:0,w:'마신 물의 양을 나타내는 값이에요.'},
    {n:'FAF',k:'신체 활동 빈도',v:'0~3 사이의 값 (소수 포함)',t:0,w:'신체 활동을 얼마나 하는지를 나타내는 값이에요.'},
    {n:'TUE',k:'기술 기기 사용 시간',v:'0~2 사이의 값 (소수 포함)',t:0,w:'기기를 쓴 시간의 양을 나타내는 값이에요.'},
    {n:'0be1dad',k:'비만도 등급',v:'과체중 1단계, 저체중, 비만 1단계',t:1,w:'몸 상태를 단계로 나눈 값이에요. 교과서의 「0BE1DAD」는 원래 열 이름 NObeyesdad가 깨져 들어간 이름이에요.'}
  ];
  const TY=['수치형','범주형'], OR=['N numeric','C categorical'];
  const B=$('suType'); let pick, done;
  const okAt=(a,p)=>p!=null&&(a.both||p===a.t);
  function draw(){
    B.innerHTML='<div class="su-trows">'+A.map((a,i)=>{
      const st=done?(okAt(a,pick[i])?(a.both?' amb':' good'):' bad'):'';
      return `<div class="su-tr${st}"><div class="su-tn"><b>${a.n}</b><span>${a.k}</span><small>값의 예: ${a.v}</small></div><div class="su-tb">${TY.map((t,j)=>`<button class="${pick[i]===j?'on':''}" data-i="${i}" data-j="${j}"${done?' disabled':''}>${t}</button>`).join('')}</div>${done?`<p class="su-tw2"><span class="${a.t?'su-c':'su-n'}">${OR[a.t].split(' ')[0]}</span> 오렌지3: <b>${OR[a.t].split(' ')[1]}</b> · ${okAt(a,pick[i])?'<span class="ok">맞아요.</span>':'<span class="ng">다시 볼까요?</span>'} ${a.w}</p>`:''}</div>`;
    }).join('')+'</div>';
    B.querySelectorAll('button').forEach(b=>b.onclick=()=>{pick[+b.dataset.i]=+b.dataset.j; draw();});
  }
  function start(){ pick=A.map(()=>null); done=false; draw(); $('suTypeMsg').textContent='13개를 모두 고르면 확인할 수 있어요.'; }
  $('suTypeOk').onclick=()=>{
    const left=pick.filter(p=>p==null).length;
    if(left){ $('suTypeMsg').textContent=`아직 ${left}개를 고르지 않았어요.`; return; }
    done=true; draw();
    const ok=A.filter((a,i)=>okAt(a,pick[i])).length;
    $('suTypeMsg').innerHTML=`<b>13개 중 ${ok}개</b>가 오렌지3와 같아요. 오렌지3는 <b>범주형 4개</b>(Gender, family_history_with_overweight, FAVC, 0be1dad), 나머지 9개를 수치형으로 읽어요. 숫자로 적힌 <b>family_history_with_overweight와 FAVC</b>도 범주형인 것을 놓치지 않았나요? <span class="su-key amb">노란 줄</span>은 두 답을 모두 인정한 속성이에요.`;
    MEMO.typeLog=A.map((a,i)=>`${a.n}: ${TY[pick[i]]}${okAt(a,pick[i])?'':' (다시 볼 것)'}`).join(' · '); store.set(MK,MEMO);
  };
  $('suTypeRe').onclick=start;
  start();
})();

/* 02 요약 통계량 계산기 (15명의 나이 — 새로 만든 예시) */
(function(){
  const INIT=[16,17,17,18,18,19,19,20,21,21,22,23,25,27,31], LO=10, HI=70, MAXN=20;
  let A, sel, back;
  const S=$('suBars');
  const vals=()=>A.filter(v=>v!=null);
  const mean=a=>a.reduce((p,c)=>p+c,0)/a.length;
  const median=a=>{const b=a.slice().sort((x,y)=>x-y), n=b.length; return n%2?b[(n-1)/2]:(b[n/2-1]+b[n/2])/2;};
  const r2=v=>Math.round(v*100)/100;
  const fmt2=v=>String(r2(v));
  const W=600, H=250, L=40, T=14, B0=220;
  const Y=v=>B0-(v-0)/(HI)*(B0-T);
  const vFromY=y=>Math.max(LO,Math.min(HI,Math.round((B0-y)/(B0-T)*HI)));
  function slot(){ return (W-L-84)/A.length; }
  function drawBars(){
    S.setAttribute('viewBox',`0 0 ${W} ${H}`);
    let g='';
    for(let v=0;v<=HI;v+=10){ g+=`<line x1="${L}" x2="${W-80}" y1="${Y(v)}" y2="${Y(v)}" class="su-gl"/><text x="${L-6}" y="${Y(v)+4}" class="su-tk" text-anchor="end">${v}</text>`; }
    const w=slot();
    A.forEach((v,i)=>{
      const x=L+i*w+w*.15, bw=w*.7;
      g+=`<g class="su-b${i===sel?' on':''}${v==null?' miss':''}" data-i="${i}" tabindex="0" role="button" aria-label="${i+1}번째 사람 ${v==null?'빈칸':v+'살'}"><rect x="${L+i*w}" y="${T}" width="${w}" height="${B0-T}" class="su-hit"/>`+
        (v==null?`<rect x="${x}" y="${Y(20)}" width="${bw}" height="${B0-Y(20)}" class="su-mb"/><text x="${x+bw/2}" y="${Y(10)}" class="su-q" text-anchor="middle">?</text>`
                :`<rect x="${x}" y="${Y(v)}" width="${bw}" height="${B0-Y(v)}" rx="3" class="su-bar"/><text x="${x+bw/2}" y="${Y(v)-4}" class="su-bv" text-anchor="middle">${v}</text>`)+
        `<text x="${x+bw/2}" y="${B0+14}" class="su-tk" text-anchor="middle">${i+1}</text></g>`;
    });
    const a=vals();
    if(a.length){ const m=mean(a), md=median(a);
      g+=`<line x1="${L}" x2="${W-80}" y1="${Y(m)}" y2="${Y(m)}" class="su-mean"/><line x1="${L}" x2="${W-80}" y1="${Y(md)}" y2="${Y(md)}" class="su-med"/>`;
      const close=Math.abs(Y(m)-Y(md))<14;
      const up=m>=md, ym=Y(m)+(close?(up?-5:9):4), yd=Y(md)+(close?(up?9:-5):4);
      g+=`<text x="${W-76}" y="${ym}" class="su-ml">평균 ${fmt2(m)}</text><text x="${W-76}" y="${yd}" class="su-dl">중앙값 ${fmt2(md)}</text>`;
    }
    g+=`<text x="${L}" y="${H-2}" class="su-tk">사람 번호 →</text><text x="4" y="${T+4}" class="su-tk">(살)</text>`;
    S.innerHTML=g;
    S.querySelectorAll('.su-b').forEach(b=>{
      const i=+b.dataset.i;
      b.addEventListener('pointerdown',e=>{ e.preventDefault(); sel=i; drag=A[i]!=null?{i,y0:e.clientY,on:false}:null; update(); });
      b.addEventListener('keydown',e=>{ if(e.key==='ArrowUp'||e.key==='ArrowDown'){ e.preventDefault(); sel=i; if(A[i]!=null){A[i]=Math.max(LO,Math.min(HI,A[i]+(e.key==='ArrowUp'?1:-1)));} update(); focusSel(); } else if(e.key==='Enter'||e.key===' '){ e.preventDefault(); sel=i; update(); focusSel(); } });
    });
  }
  let drag=null;
  function setFrom(e,i){ const pt=S.createSVGPoint(); pt.x=e.clientX; pt.y=e.clientY; const ctm=S.getScreenCTM(); if(!ctm) return; const p=pt.matrixTransform(ctm.inverse()); A[i]=vFromY(p.y); }
  /* 누르기만 하면 고르기만 하고, 6픽셀 넘게 끌 때부터 값을 바꿈 */
  window.addEventListener('pointermove',e=>{ if(drag==null||A[drag.i]==null) return; if(!drag.on){ if(Math.abs(e.clientY-drag.y0)<6) return; drag.on=true; } setFrom(e,drag.i); update(); });
  const end=()=>{ if(drag!=null){ drag=null; } };
  window.addEventListener('pointerup',end); window.addEventListener('pointercancel',end);
  const focusSel=()=>{ const g=S.querySelector(`.su-b[data-i="${sel}"]`); if(g) g.focus(); };
  function drawStats(){
    const a=vals(), miss=A.length-a.length;
    const row=(k,v,c)=>`<div class="${c||''}"><span>${k}</span><b>${v}</b></div>`;
    if(!a.length){ $('suStats').innerHTML=row('사람 수',A.length)+row('결측치',miss,'mi')+'<p class="muted">값이 하나도 없어요.</p>'; return; }
    const m=mean(a), sd=Math.sqrt(mean(a.map(v=>(v-m)*(v-m))));
    $('suStats').innerHTML=row('사람 수',`${A.length}명 <small>(값 있음 ${a.length})</small>`)+row('평균 Mean',fmt2(m),'me')+row('중앙값 Median',fmt2(median(a)),'md')+row('최솟값 Min',Math.min(...a))+row('최댓값 Max',Math.max(...a))+row('결측치 Missing',miss,'mi')+row('흩어진 정도 Dispersion',(sd/m).toFixed(2),'di')+'<p class="su-note">평균·중앙값은 빈칸(결측치)을 빼고 계산해요. 오렌지3도 같아요.</p>';
  }
  function drawHist(){
    const a=vals(), bins=[10,20,30,40,50,60], c=bins.map(b=>a.filter(v=>v>=b&&(b===60?v<=70:v<b+10)).length), mx=Math.max(1,...c);
    $('suHist').innerHTML='<div class="su-hb">'+bins.map((b,i)=>`<div><i style="height:${c[i]/mx*60}px"></i><b>${c[i]}</b><small>${b===60?'60~70':b+'대'}</small></div>`).join('')+'</div>';
  }
  const MIS=[['m1','한 사람의 나이를 빈칸으로 만들어 결측치 바꿔 보기'],['m2','나이 많은 사람(50세 이상)을 넣고 평균과 중앙값 비교하기'],['m3','(도전) 평균과 중앙값이 같아지게 값 바꿔 보기']];
  let got={};
  function drawMis(){
    const a=vals();
    if(A.some(v=>v==null)) got.m1=true;
    if(a.some(v=>v>=50)) got.m2=true;
    if(a.length>=3&&Math.abs(mean(a)-median(a))<0.005&&A.join()!==INIT.join()) got.m3=true;
    $('suMis').innerHTML='<b>해 볼 것</b>'+MIS.map(([k,t])=>`<span class="${got[k]?'ok':''}">${got[k]?'✓':'○'} ${t}</span>`).join('');
  }
  function drawCtl(){
    const has=sel!=null&&sel<A.length;
    $('suSel').innerHTML=has?`<b>${sel+1}번째 사람</b> · ${A[sel]==null?'빈칸':A[sel]+'살'}`:'막대를 하나 눌러요';
    $('suUp').disabled=$('suDn').disabled=!has||A[sel]==null; $('suMiss').disabled=!has;
    $('suMiss').textContent=has&&A[sel]==null?'값 되돌리기':'빈칸으로 만들기';
    $('suOld').disabled=A.length>=MAXN; $('suPop').disabled=A.length<=2;
  }
  function update(){ drawBars(); drawStats(); drawHist(); drawMis(); drawCtl(); }
  $('suUp').onclick=()=>{ if(sel!=null&&A[sel]!=null){A[sel]=Math.min(HI,A[sel]+1); update();} };
  $('suDn').onclick=()=>{ if(sel!=null&&A[sel]!=null){A[sel]=Math.max(LO,A[sel]-1); update();} };
  $('suMiss').onclick=()=>{ if(sel==null) return; if(A[sel]==null){A[sel]=back[sel]!=null?back[sel]:20;} else {back[sel]=A[sel]; A[sel]=null;} update(); };
  $('suOld').onclick=()=>{ if(A.length>=MAXN) return; A.push(58); back.push(null); sel=A.length-1; update(); };
  $('suPop').onclick=()=>{ if(A.length<=2) return; A.pop(); back.pop(); if(sel!=null&&sel>=A.length) sel=null; update(); };
  $('suReset').onclick=()=>{ A=INIT.slice(); back=A.map(()=>null); sel=null; update(); };
  A=INIT.slice(); back=A.map(()=>null); sel=null; update();
})();

/* 03 위젯 연결 흐름도 (오렌지3 화면을 캡처하지 않고 새로 그림 — 교과서 67·69쪽 ows와 같은 연결) */
(function(){
  const col={D:'#f2b84b'}, BW=190, BH=50;
  const nodes=[{s:1,t:'File',sub:'obesity_level.csv',c:'D',x:20,y:62},{s:2,t:'Column Statistics',sub:'기초 통계량 (교과서: Feature Statistics)',c:'D',x:330,y:20},{s:3,t:'Data Table',sub:'(선택) 표로 보기',c:'D',x:330,y:110}];
  const edges=[[1,2],[1,3]], N={}; nodes.forEach(n=>N[n.s]=n);
  let g='<defs><marker id="suFlowA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#8a94a3"/></marker></defs>';
  edges.forEach(([a,b])=>{ const p=N[a], q=N[b], x1=p.x+BW, y1=p.y+BH/2, x2=q.x-2, y2=q.y+BH/2;
    g+=`<path d="M${x1} ${y1}C${x1+50} ${y1} ${x2-50} ${y2} ${x2} ${y2}" class="fe${b===3?' opt':''}" marker-end="url(#suFlowA)"/>`; });
  g+=`<text x="280" y="${N[1].y+BH/2-26}" class="fl" text-anchor="middle">Data</text>`;
  nodes.forEach(n=>{ g+=`<g class="fn" data-s="${n.s}" tabindex="0"><rect x="${n.x}" y="${n.y}" width="${BW}" height="${BH}" rx="10" class="fb" style="stroke:${col[n.c]}"/><rect x="${n.x}" y="${n.y}" width="28" height="${BH}" rx="10" fill="${col[n.c]}"/><rect x="${n.x+18}" y="${n.y}" width="10" height="${BH}" fill="${col[n.c]}"/><text x="${n.x+14}" y="${n.y+30}" class="fnum" text-anchor="middle">${n.s}</text><text x="${n.x+36}" y="${n.y+21}" class="ft">${n.t}</text><text x="${n.x+36}" y="${n.y+39}" class="fs">${n.sub}</text></g>`; });
  const S=$('suFlow'); S.setAttribute('viewBox','0 0 560 175'); S.innerHTML=g;
  const pick=s=>{ S.querySelectorAll('.fn').forEach(x=>x.classList.toggle('on',x.dataset.s===s)); $('suSet').querySelectorAll('tr[data-s]').forEach(tr=>tr.classList.toggle('hl',tr.dataset.s===s)); };
  S.querySelectorAll('.fn').forEach(x=>{ x.onclick=()=>pick(x.dataset.s); x.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(x.dataset.s);}}; });
  $('suSet').querySelectorAll('tr[data-s]').forEach(tr=>tr.onclick=()=>pick(tr.dataset.s));
})();
chips('suDone','suDonePick',['오렌지3 실행','obesity_level.csv 열기','Type 열에서 형 확인','Column Statistics 연결','Age 줄 읽기'],true);

/* 03 결과 읽기 연습 — 교과서 68쪽 통계 창(Feature Statistics) 그림의 값(분포 막대는 구간별 개수로 모양만) */
(function(){
  const COLS=['Name','Distribution','Mean','Mode','Median','Dispersion','Min.','Max.','Missing'];
  const ROWS=[
    {n:'Age',d:[1056,8299,5574,2933,1569,593,552,100,12,7,61,2],v:['23.8418','18','22.8154','0.23857','14','61','0 (0 %)']},
    {n:'Height',d:[22,560,1173,2782,3542,3455,3615,3081,1454,865,197,12],v:['1.70024','1.7','1.7','0.0513513','1.45','1.97566','0 (0 %)']},
    {n:'Weight',d:[556,2179,2030,1916,3825,1530,2029,3103,2051,1254,155,103,23],v:['87.8878','80','84.0649','0.300162','39','165.057','0 (0 %)']}
  ];
  const ASK=[['나이의 <b>평균</b>을',2],['나이의 <b>중앙값</b>을',4],['나이의 <b>최솟값</b>을',6],['나이의 <b>최댓값</b>을',7],['나이의 <b>결측치</b> 수를',8]];
  let k, miss;
  const spark=d=>{const mx=Math.max(...d); return `<svg viewBox="0 0 ${d.length*6} 24" class="su-sp" aria-hidden="true">${d.map((c,i)=>`<rect x="${i*6}" y="${24-c/mx*22}" width="5" height="${c/mx*22}"/>`).join('')}</svg>`;};
  function draw(msg){
    $('suFs').innerHTML='<tr>'+COLS.map(c=>`<th>${c}</th>`).join('')+'</tr>'+ROWS.map((r,ri)=>`<tr><td class="nm"><span class="su-n">N</span> ${r.n}</td><td>${spark(r.d)}</td>${r.v.map((v,ci)=>`<td class="cl" data-r="${ri}" data-c="${ci+2}" tabindex="0">${v}</td>`).join('')}</tr>`).join('');
    $('suFs').querySelectorAll('td.cl').forEach(td=>{ const f=()=>hit(+td.dataset.r,+td.dataset.c,td); td.onclick=f; td.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f();}}; });
    $('suAsk').innerHTML=k<ASK.length?`<span class="su-qn">${k+1} / ${ASK.length}</span> ${ASK[k][0]} 찾아 눌러요. ${msg||''}`:`<span class="ok">다섯 개를 모두 찾았어요!</span> (헷갈린 횟수 ${miss}번) 평균(23.8418)이 중앙값(22.8154)보다 조금 크고, 나이는 14세부터 61세까지 퍼져 있으며 결측치가 없어요. Weight 줄도 평균과 중앙값을 비교해 보세요. <button class="btn ghost sm" id="suAskRe">다시 하기</button>`;
    const re=$('suAskRe'); if(re) re.onclick=()=>{k=0;miss=0;draw();};
  }
  function hit(r,c,td){
    if(k>=ASK.length) return;
    if(r===0&&c===ASK[k][1]){ k++; td.classList.add('good'); setTimeout(()=>draw('<span class="ok">맞아요.</span>'),250); }
    else{ miss++; td.classList.add('bad'); setTimeout(()=>td.classList.remove('bad'),500);
      const hint=r!==0?'<span class="ng">Age 줄에서 찾아요.</span>':`<span class="ng">그 칸은 ${COLS[c]} 열이에요.</span>`;
      $('suAsk').innerHTML=`<span class="su-qn">${k+1} / ${ASK.length}</span> ${ASK[k][0]} 찾아 눌러요. ${hint}`; }
  }
  k=0; miss=0; draw();
})();

/* 04 함께 해결하기 · 특성 분석 표 (입력칸을 한 메모로 모아 저장) */
(function(){
  const ins=[...document.querySelectorAll('.su-mq .su-in')];
  let cells=MEMO.mosqCells; if(!cells||typeof cells!=='object') cells={};
  ins.forEach(i=>{ if(cells[i.dataset.c]!=null) i.value=cells[i.dataset.c]; });
  const g=c=>String(cells[c]||'').trim();
  const compose=()=>{
    const row=(nm,p)=>[nm,['분포',p+'shape'],['평균',p+'mean'],['중앙값',p+'med'],['흩어진 정도',p+'disp'],['최솟값',p+'min'],['최댓값',p+'max'],['결측치',p+'miss']];
    const line=([nm,...fs])=>{ const t=fs.filter(([,c])=>g(c)).map(([l,c])=>`${l} ${g(c)}`).join(', '); return t?`${nm}: ${t}`:''; };
    return [ (g('rows')||g('cols'))?`크기: 행 ${g('rows')}, 열 ${g('cols')}`:'', (g('num')||g('cat'))?`속성: 수치형 ${g('num')}, 범주형 ${g('cat')}`:'',
      line(row('평균 모기 활동 지수','a_')), line(row(g('b_name')||'고른 속성','b_')) ].filter(Boolean).join('\n');
  };
  let tm;
  ins.forEach(i=>i.addEventListener('input',()=>{ cells[i.dataset.c]=i.value; clearTimeout(tm); tm=setTimeout(()=>{ MEMO['mosqCells']=cells; MEMO.mosqTable=compose(); store.set(MK,MEMO); const s=$('suMqSaved'); s.textContent='이 기기에 저장됨'; setTimeout(()=>s.textContent='',1400); },300); }));
})();
chips('suSelf','selfCheckPick',['속성을 수치형과 범주형으로 나눌 수 있다','평균과 중앙값을 비교해 해석할 수 있다','결측치가 있는지 확인할 수 있다','오렌지3로 기초 통계량을 확인할 수 있다'],true);

/* 05 마무리 */
const MEMOLIST=[['planStat','처음 생각: 2만 명의 나이를 한눈에 보려면'],['typeLog','비만 데이터 속성 13개 형 판단'],['typeWhy','숫자인데 범주형인 속성과 그 까닭'],['calcNote','계산기: 나이 많은 사람을 더했을 때 평균과 중앙값'],['suDonePick','오렌지3 실습 진행'],['ageRead','Age 줄의 기초 통계량으로 본 나이 특성'],['myProblem','우리 학교 문제'],['myHypo','문제 해결을 위한 가설'],['myCollect','수집 방법과 편향 점검'],['mosqTable','예시 데이터 특성 분석 표'],['mosqTalk','특성 분석 결과 이야기 나누기'],['selfCheckPick','성취도 평가: 할 수 있게 된 것'],['keyQ','오늘의 질문에 대한 내 답']];
/* 04는 시간이 모자라면 1·2 메모까지만 하므로, 그 뒤 칸은 쓴 것만 모아 보기에 보이기 */
const SU_LATE=['myCollect','mosqTable','mosqTalk'];
onShow[5]=()=>memoSummary('msum',MEMOLIST.filter(([k])=>!SU_LATE.includes(k)||String(MEMO[k]||'').trim()));

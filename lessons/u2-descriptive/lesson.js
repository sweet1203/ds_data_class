/* u2-descriptive — 기술 통계: 대푯값과 산포도 (교과서 86~95쪽) */
const dvMean=a=>a.reduce((s,x)=>s+x,0)/a.length;
const dvVar=a=>{const m=dvMean(a); return dvMean(a.map(x=>(x-m)*(x-m)));};   /* 교과서 정의: 편차 제곱의 평균(÷n) */
const dvQ=(a,p)=>{const s=a.slice().sort((x,y)=>x-y), h=(s.length-1)*p, lo=Math.floor(h); return s[lo]+(h-lo)*((s[lo+1]??s[lo])-s[lo]);};
const dvMed=a=>dvQ(a,.5);
const dvR=(x,d=1)=>{const v=Math.round(x*Math.pow(10,d))/Math.pow(10,d); return (Object.is(v,-0)?0:v).toLocaleString('ko-KR',{maximumFractionDigits:d});};

/* 01 어느 분석일까? (새 상황 카드) */
sorter('dvSort',{
  cats:[{n:'기술 통계',k:'#2f6fd0'},{n:'상관분석',k:'#e0702b'}],
  items:[
    {t:'우리 반 학생들의 키를 모아 평균과 표준편차를 알아본다.',short:'키의 평균·표준편차',c:0,ic:'📏',w:'키라는 속성 하나의 중심과 흩어진 정도를 보는 일이에요.'},
    {t:'공부 시간이 긴 학생일수록 시험 점수도 높은 편인지 확인한다.',short:'공부 시간과 시험 점수',c:1,ic:'📚',w:'공부 시간과 시험 점수, 두 속성이 함께 변하는지 보는 일이에요.'},
    {t:'하루 스마트폰 사용 시간의 중앙값과 사분위수 범위를 살펴본다.',short:'사용 시간의 중앙값',c:0,ic:'📱',w:'속성 하나의 대푯값과 산포도를 구하는 일이에요.'},
    {t:'운동을 오래 한 날일수록 그날 밤 잠도 오래 자는 편인지 살펴본다.',short:'운동 시간과 수면 시간',c:1,ic:'🏃',w:'두 속성 사이의 연관을 보는 일이에요.'},
    {t:'급식 설문에서 가장 많은 학생이 고른 메뉴를 확인한다.',short:'가장 많이 고른 메뉴',c:0,ic:'🍱',w:'범주형 속성 하나의 최빈값을 구하는 일이에요.'},
    {t:'하루 걸음 수가 많은 사람일수록 심박수가 낮은 편인지 알아본다.',short:'걸음 수와 심박수',c:1,ic:'❤️',w:'걸음 수와 심박수, 두 속성이 함께 변하는지 보는 일이에요.'}
  ],
  end:'<b>정리</b> 속성 <b>하나</b>의 중심과 흩어짐을 보면 기술 통계, 속성 <b>두 개</b>가 함께 변하는지 보면 상관분석이에요.'
});

/* 02 대푯값 계산기 */
(function(){
  const BASE=[30,30,31,31,31,32,32,33];
  let extra=[];
  const tabs=$('dvRepTab').querySelectorAll('button');
  tabs.forEach(b=>b.onclick=()=>{ const t=+b.dataset.t; tabs.forEach(x=>x.classList.toggle('ghost',x!==b)); $('dvRepNum').style.display=t?'none':''; $('dvRepCat').style.display=t?'':'none'; });
  function vals(){ return [...BASE,+$('dvNine').value,...extra]; }
  function draw(){
    const v=vals(), n=v.length, m=dvMean(v), md=dvMed(v), s=v.slice().sort((a,b)=>a-b);
    $('dvNineOut').textContent=$('dvNine').value;
    const S=$('dvRepSvg'); S.innerHTML=''; const X=x=>30+x/250*590;
    for(let t=0;t<=250;t+=25){ el('line',{x1:X(t),x2:X(t),y1:20,y2:105,class:'gl'},S); el('text',{x:X(t),y:120,class:'tk','text-anchor':'middle'},S,t); }
    el('text',{x:620,y:138,class:'axl','text-anchor':'end'},S,'1일 SNS 앱 사용 시간(분)');
    const cnt={}, tot={}; v.forEach(x=>{const k=Math.round(x/4); tot[k]=(tot[k]||0)+1;});
    const gapY=Math.min(9,70/Math.max(1,Math.max(...Object.values(tot))-1));   /* 쌓인 점이 많아도 그림 위로 넘치지 않게 */
    v.forEach((x,i)=>{ const k=Math.round(x/4); cnt[k]=(cnt[k]||0)+1; el('circle',{cx:X(x),cy:98-(cnt[k]-1)*gapY,r:4.5,class:i===8?'dv-nine':(i>8?'dv-new':'dv-pt')},S); });
    el('line',{x1:X(md),x2:X(md),y1:14,y2:106,class:'dv-mdl'},S); el('text',{x:X(md)+(md>m?6:-6),y:22,class:'dv-mdt','text-anchor':md>m?'start':'end'},S,'중앙값 '+dvR(md));
    el('line',{x1:X(m),x2:X(m),y1:30,y2:106,class:'dv-mnl'},S); el('text',{x:X(m)+(m>=md?6:-6),y:38,class:'dv-mnt','text-anchor':m>=md?'start':'end'},S,'평균 '+dvR(m));
    const mid=n%2?[(n-1)/2]:[n/2-1,n/2];
    $('dvSorted').innerHTML=`<span class="muted">크기 순서 (${n}명, ${n%2?'홀수 → 가운데 값':'짝수 → 가운데 두 값의 평균'})</span> `+s.map((x,i)=>`<span class="dv-chip${mid.includes(i)?' mid':''}">${x}</span>`).join('');
    const gap=m-md;
    $('dvRepMsg').innerHTML=`평균 <b>${dvR(m)}분</b> · 중앙값 <b>${dvR(md)}분</b> · 차이 ${dvR(Math.abs(gap))}분. `+(gap>5?'평균이 큰 값 쪽으로 끌려가 대부분 학생의 사용 시간(30분대)과 멀어졌어요. 중앙값은 거의 그대로예요.':gap<-5?'이번에는 평균이 작은 값 쪽으로 끌려가 중앙값보다 작아졌어요. 동떨어진 값이 작은 쪽에 있어도 평균은 그쪽으로 끌려가요.':'두 대푯값이 비슷해요. 9번 학생의 값을 아주 크게 하면 어떻게 될까요?');
  }
  $('dvNine').oninput=draw;
  $('dvAdd').onclick=()=>{ const x=Math.max(0,Math.min(240,Math.round(+$('dvAddV').value||0))); if(extra.length<6){extra.push(x); draw();} else $('dvRepMsg').textContent='학생은 6명까지 더할 수 있어요.'; };
  $('dvDel').onclick=()=>{ extra.pop(); draw(); };
  $('dvRepReset').onclick=()=>{ extra=[]; $('dvNine').value=200; draw(); };
  draw();

  /* 범주 데이터: 표 Ⅱ-9 희망 진로 (91쪽) */
  const F=['인문 사회 분야','이학 공학 분야','예술 체육 분야'], T9=[[2,6,1],[5,1,3]];
  let g=0, C=T9.map(r=>r.slice());
  const gb=$('dvGrp').querySelectorAll('button');
  gb.forEach(b=>b.onclick=()=>{ g=+b.dataset.g; gb.forEach(x=>x.classList.toggle('ghost',x!==b)); cat(); });
  function cat(){
    const c=C[g], mx=Math.max(...c), modes=F.filter((_,i)=>c[i]===mx&&mx>0);
    $('dvCat').innerHTML=F.map((f,i)=>`<div class="dv-crow${c[i]===mx&&mx>0?' top':''}"><span>${f}</span><div class="dv-cbar"><i style="width:${c[i]/10*100}%"></i></div><b>${c[i]}명</b><button class="btn sm ghost" data-i="${i}" data-d="-1">−</button><button class="btn sm ghost" data-i="${i}" data-d="1">＋</button></div>`).join('')+`<div class="row" style="margin-top:6px"><button class="btn sm ghost" id="dvCatReset">표 Ⅱ-9로 되돌리기</button></div>`;
    $('dvCat').querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; C[g][i]=Math.max(0,Math.min(10,C[g][i]+(+b.dataset.d))); cat(); });
    $('dvCatReset').onclick=()=>{ C=T9.map(r=>r.slice()); cat(); };
    $('dvCatMsg').innerHTML=!modes.length?'아직 아무도 없어요.':`${g?'B':'A'}그룹의 최빈값: <b>${modes.join(', ')}</b>`+(modes.length>1?' · 가장 많은 값이 둘 이상이면 최빈값도 둘 이상이에요.':'')+' · 범주형 데이터는 평균을 낼 수 없으니 가장 자주 나온 값으로 그룹의 특징을 봐요.';
  }
  cat();
})();

/* 02 함께 해결하기: 평균 50점인데 51점이 탈락? */
(function(){
  const NAMES=['가온','나래','다솜','라온','마루','바다','새롬','아라','자람'];
  const START=[55,55,55,50,50,45,45,40,35];
  let sc=START.slice();
  const B=$('dvEv');
  function build(){
    B.innerHTML=`<div class="dv-evg">${NAMES.map((n,i)=>`<label class="dv-evr"><span>${n}</span><input type="range" min="0" max="100" value="${sc[i]}" data-i="${i}"><input type="number" min="0" max="100" value="${sc[i]}" data-n="${i}"></label>`).join('')}<label class="dv-evr gd"><span>길동</span><input type="range" min="0" max="100" value="51" disabled><input type="number" value="51" disabled></label></div><svg viewBox="0 0 640 190" class="dv-svg" id="dvEvSvg" role="img" aria-label="10명의 점수 막대그래프"></svg>`;
    B.querySelectorAll('[data-i]').forEach(r=>r.oninput=()=>{ const i=+r.dataset.i; sc[i]=+r.value; B.querySelector(`[data-n="${i}"]`).value=sc[i]; draw(); });
    B.querySelectorAll('[data-n]').forEach(r=>{ r.oninput=()=>{ const i=+r.dataset.n; sc[i]=Math.max(0,Math.min(100,Math.round(+r.value||0))); B.querySelector(`[data-i="${i}"]`).value=sc[i]; if(r.value!==''&&+r.value!==sc[i]) r.value=sc[i]; draw(); }; r.onblur=()=>{ r.value=sc[+r.dataset.n]; }; });
    draw();
  }
  function draw(){
    const all=[...sc.map((s,i)=>({n:NAMES[i],s})),{n:'길동',s:51,g:1}].sort((a,b)=>b.s-a.s||(a.g?-1:b.g?1:0));
    const sum=all.reduce((t,x)=>t+x.s,0), m=sum/10, md=dvMed(all.map(x=>x.s)), higher=sc.filter(x=>x>51).length, same=sc.filter(x=>x===51).length;
    const S=$('dvEvSvg'); S.innerHTML=''; const Y=v=>160-v*1.4, W=56;
    [0,25,50,75,100].forEach(t=>{ el('line',{x1:30,x2:630,y1:Y(t),y2:Y(t),class:'gl'},S); el('text',{x:24,y:Y(t)+4,class:'tk','text-anchor':'end'},S,t); });
    all.forEach((x,i)=>{ const cx=40+i*W+W/2; el('rect',{x:cx-20,y:Y(x.s),width:40,height:x.s*1.4,class:x.g?'dv-gd':(i<5?'dv-top':'dv-bar')},S); el('text',{x:cx,y:Y(x.s)-4,class:'tk','text-anchor':'middle'},S,x.s); el('text',{x:cx,y:176,class:'tk','text-anchor':'middle'},S,x.n); });
    el('line',{x1:40+5*W,x2:40+5*W,y1:10,y2:162,class:'dv-cut'},S); el('text',{x:40+5*W-4,y:14,class:'dv-cutt','text-anchor':'end'},S,'← 상위 50% (상품)');
    el('line',{x1:30,x2:630,y1:Y(m),y2:Y(m),class:'dv-mnl'},S); el('text',{x:628,y:Y(m)-4,class:'dv-mnt','text-anchor':'end'},S,'평균 '+dvR(m));
    let msg=`합계 <b>${sum}</b>점 · 평균 <b>${dvR(m)}</b>점 · 중앙값 <b>${dvR(md)}</b>점 · 길동이보다 점수가 높은 사람 <b>${higher}명</b>. `;
    if(sum!==500) msg+=`평균을 50점으로 맞춰 보세요(10명 합계가 500점이 되어야 해요. 지금 ${sum>500?sum-500+'점 많아요':500-sum+'점 모자라요'}).`;
    else if(higher>=5) msg+='<span class="ok">성공!</span> 평균은 50점인데 길동이는 상위 50%에 들지 못했어요. 평균과 중앙값을 비교해 보고, 왜 그런지 아래에 적어요.';
    else msg+=same?'점수가 51점으로 같은 사람이 있으면 순위가 애매해요. 다른 점수로 바꿔 보세요.':'평균은 50점이지만 아직 길동이가 상위 50% 안에 있어요. 점수를 더 바꿔 보세요.';
    $('dvEvMsg').innerHTML=msg;
  }
  $('dvEvReset').onclick=()=>{ sc=START.slice(); $('dvEvHintBox').style.display='none'; build(); };
  $('dvEvHint').onclick=()=>{ $('dvEvHintBox').style.display=''; };
  build();
})();

/* 03 그림 Ⅱ-5 다시 그리기 (점은 예시) */
(function(){
  let seed=7; const rnd=()=>{seed=(seed*16807)%2147483647; return seed/2147483647;};
  const gauss=()=>{let s=0; for(let i=0;i<6;i++) s+=rnd(); return s-3;};
  [['dvFigA',3.2],['dvFigB',.35]].forEach(([id,sp])=>{
    const S=$(id), X=i=>20+i*1.6, Y=v=>100-v*4.5;
    [0,5,10,15,20].forEach(t=>{ el('line',{x1:20,x2:310,y1:Y(t),y2:Y(t),class:'gl'},S); el('text',{x:14,y:Y(t)+3,class:'tk','text-anchor':'end'},S,t); });
    el('line',{x1:20,x2:310,y1:Y(10),y2:Y(10),class:'dv-mnl'},S); el('text',{x:312,y:Y(10)-3,class:'dv-mnt','text-anchor':'end'},S,'평균');
    for(let i=0;i<180;i++){ const v=Math.max(0.5,Math.min(19.5,10+gauss()*sp)); el('circle',{cx:X(i),cy:Y(v),r:1.8,class:'dv-pt'},S); }
  });
})();

/* 03 A반·B반 박스 플롯 (교과서 95쪽 값, 수염 끝은 대략) */
(function(){
  const S=$('dvAB'), X=v=>70+(v-40)/60*550;
  for(let t=40;t<=100;t+=10){ el('line',{x1:X(t),x2:X(t),y1:10,y2:140,class:'gl'},S); el('text',{x:X(t),y:156,class:'tk','text-anchor':'middle'},S,t); }
  el('text',{x:620,y:168,class:'axl','text-anchor':'end'},S,'점수');
  [['A반',43,60,70,85,100,45,'#2f6fd0'],['B반',41,55,75,95,100,105,'#1f9d74']].forEach(([n,lo,q1,md,q3,hi,y,c])=>{
    el('text',{x:58,y:y+5,class:'axl','text-anchor':'end'},S,n);
    el('line',{x1:X(lo),x2:X(hi),y1:y,y2:y,class:'dv-wh'},S);
    el('rect',{x:X(q1),y:y-16,width:X(q3)-X(q1),height:32,fill:c,'fill-opacity':.25,stroke:c,'stroke-width':2},S);
    el('line',{x1:X(md),x2:X(md),y1:y-16,y2:y+16,class:'dv-mdl'},S);
    el('text',{x:(X(q1)+X(q3))/2,y:y-21,class:'tk','text-anchor':'middle'},S,`IQR ${q3-q1} (Q1 ${q1} · 중앙값 ${md} · Q3 ${q3})`);
  });
})();

/* 03 산포도 비교기 (점 끌기) */
(function(){
  const A0=[62,65,68,70,70,70,72,75,78,80], B0=[40,50,58,65,70,75,80,88,92,92];
  let D={A:A0.slice(),B:B0.slice()}, drag=null;
  const S=$('dvSp'), X=v=>60+v/100*580, XV=x=>Math.max(0,Math.min(100,Math.round((x-60)/580*100)));
  const ROW={A:{y:20,c:'#2f6fd0'},B:{y:155,c:'#1f9d74'}};
  const st=a=>({m:dvMean(a),v:dvVar(a),sd:Math.sqrt(dvVar(a)),q1:dvQ(a,.25),md:dvMed(a),q3:dvQ(a,.75)});
  function draw(){
    S.innerHTML='';
    for(let t=0;t<=100;t+=10){ el('line',{x1:X(t),x2:X(t),y1:8,y2:282,class:'gl'},S); el('text',{x:X(t),y:296,class:'tk','text-anchor':'middle'},S,t); }
    ['A','B'].forEach(k=>{
      const a=D[k], s=st(a), r=ROW[k], ord=a.map((v,i)=>[v,i]).sort((p,q)=>p[0]-q[0]);
      el('text',{x:10,y:r.y+40,class:'axl'},S,k+'반');
      el('line',{x1:X(s.m),x2:X(s.m),y1:r.y-4,y2:r.y+84,class:'dv-mnl'},S); el('text',{x:X(s.m)+4,y:r.y+4,class:'dv-mnt'},S,'평균 '+dvR(s.m));
      ord.forEach(([v,i],j)=>{ const y=r.y+10+j*6.5; el('line',{x1:X(s.m),x2:X(v),y1:y,y2:y,class:'dv-dev'},S); const c=el('circle',{cx:X(v),cy:y,r:6,fill:r.c,class:'dv-dd','data-k':k,'data-i':i},S); });
      const by=r.y+100;
      el('line',{x1:X(Math.min(...a)),x2:X(Math.max(...a)),y1:by,y2:by,class:'dv-wh'},S);
      el('rect',{x:X(s.q1),y:by-11,width:Math.max(2,X(s.q3)-X(s.q1)),height:22,fill:r.c,'fill-opacity':.22,stroke:r.c,'stroke-width':2},S);
      el('line',{x1:X(s.md),x2:X(s.md),y1:by-11,y2:by+11,class:'dv-mdl'},S);
    });
    const a=st(D.A), b=st(D.B);
    const row=(n,s)=>`<tr><th>${n}</th><td>${dvR(s.m)}</td><td>${dvR(s.v)}</td><td><b>${dvR(s.sd)}</b></td><td>${dvR(s.q1,2)}</td><td>${dvR(s.md)}</td><td>${dvR(s.q3,2)}</td><td><b>${dvR(s.q3-s.q1,2)}</b></td></tr>`;
    $('dvSpTbl').innerHTML='<tr><th></th><th>평균</th><th>분산</th><th>표준편차</th><th>제1사분위수</th><th>중앙값</th><th>제3사분위수</th><th>사분위수 범위</th></tr>'+row('A반',a)+row('B반',b);
    const b0=st(B0); let msg;
    const bChangedOnlyLow=D.B.slice(1).every((v,i)=>v===B0[i+1]) && D.B[0]!==B0[0];
    if(a.sd>b.sd) msg='<span class="ok">미션 3 성공!</span> 이제 A반이 B반보다 평균에서 더 흩어져 있어요. 표준편차와 사분위수 범위를 함께 보세요.';
    else if(bChangedOnlyLow&&D.B[0]<=10) msg=`<span class="ok">미션 2</span> 40점을 ${D.B[0]}점으로 옮기자 B반 표준편차는 ${dvR(b0.sd)} → <b>${dvR(b.sd)}</b>로 커졌지만, 사분위수 범위는 ${dvR(b0.q3-b0.q1,2)} → <b>${dvR(b.q3-b.q1,2)}</b>예요. 끝에 있는 값 하나가 어느 쪽을 더 많이 움직이나요?`;
    else if(Math.abs(a.m-b.m)<0.05) msg=`두 반의 평균은 <b>${dvR(a.m)}점</b>으로 같아요. 그런데 표준편차는 A반 ${dvR(a.sd)}, B반 ${dvR(b.sd)}이에요. 점그림에서 편차 선의 길이를 비교해 보세요.`;
    else msg=`평균이 A반 ${dvR(a.m)}, B반 ${dvR(b.m)}로 달라졌어요. 표준편차는 A반 ${dvR(a.sd)}, B반 ${dvR(b.sd)}이에요.`;
    $('dvSpMsg').innerHTML=msg;
  }
  const pt=e=>{ const p=S.createSVGPoint(); p.x=e.clientX; p.y=e.clientY; return p.matrixTransform(S.getScreenCTM().inverse()); };
  S.addEventListener('pointerdown',e=>{ const t=e.target; if(!t.dataset||!t.dataset.k) return; drag={k:t.dataset.k,i:+t.dataset.i}; S.setPointerCapture(e.pointerId); e.preventDefault(); });
  S.addEventListener('pointermove',e=>{ if(!drag) return; const v=XV(pt(e).x); if(v!==D[drag.k][drag.i]){ D[drag.k][drag.i]=v; draw(); } });
  const end=e=>{ if(drag){ drag=null; try{S.releasePointerCapture(e.pointerId);}catch(_){} } };
  S.addEventListener('pointerup',end); S.addEventListener('pointercancel',end);
  $('dvSpReset').onclick=()=>{ D={A:A0.slice(),B:B0.slice()}; draw(); };
  draw();
})();

/* 04 흐름도 (오렌지3 화면을 캡처하지 않고 새로 그림) — 교과서 92쪽 ows의 위젯·연결을 바탕으로 */
(function(){
  const col={D:'#f2b84b',T:'#f0875a',V:'#ef8fa0'}, BW=174, BH=48, W=880, H=400, N={};
  const nodes=[
    {s:1,t:'File',sub:'Sleep_Health_merge.csv',c:'D',x:10,y:170},
    {s:2,t:'Group by',sub:'Occupation · Count',c:'T',x:235,y:20},{s:3,t:'Data Table',sub:'직업별 개수',c:'D',x:460,y:20},
    {s:4,t:'Select Rows',sub:'4개 직업 제외',c:'T',x:235,y:215},
    {s:5,t:'Group by (평균)',sub:'Stress Level · Mean',c:'T',x:460,y:100},{s:6,t:'Bar Plot-평균',c:'V',x:690,y:100},
    {s:7,t:'Group by (중앙값)',sub:'Stress Level · Median',c:'T',x:460,y:180},{s:8,t:'Bar Plot-중앙값',c:'V',x:690,y:180},
    {s:9,t:'Box Plot',sub:'(선택) 직업별 흩어짐',c:'V',x:460,y:265,opt:1},{s:10,t:'Violin Plot',sub:'(선택) 분포 모양',c:'V',x:460,y:340,opt:1}
  ];
  nodes.forEach(n=>N[n.s]=n);
  let g=`<defs><marker id="dvFlowA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#8a94a3"/></marker></defs>`;
  [[1,2],[2,3],[1,4],[4,5],[5,6],[4,7],[7,8],[4,9],[4,10]].forEach(([a,b])=>{ const p=N[a],q=N[b],x1=p.x+BW,y1=p.y+BH/2,x2=q.x-2,y2=q.y+BH/2; g+=`<path d="M${x1} ${y1}C${x1+40} ${y1} ${x2-40} ${y2} ${x2} ${y2}" class="fe" marker-end="url(#dvFlowA)"/>`; });
  nodes.forEach(n=>{ g+=`<g class="fn" data-s="${n.s}" tabindex="0"><rect x="${n.x}" y="${n.y}" width="${BW}" height="${BH}" rx="10" class="fb${n.opt?' opt':''}" style="stroke:${col[n.c]}"/><rect x="${n.x}" y="${n.y}" width="28" height="${BH}" rx="10" fill="${col[n.c]}"/><rect x="${n.x+18}" y="${n.y}" width="10" height="${BH}" fill="${col[n.c]}"/><text x="${n.x+14}" y="${n.y+29}" class="fnum">${n.s}</text><text x="${n.x+36}" y="${n.y+(n.sub?20:29)}" class="ft">${n.t}</text>${n.sub?`<text x="${n.x+36}" y="${n.y+37}" class="fs">${n.sub}</text>`:''}</g>`; });
  const S=$('dvFlow'); S.setAttribute('viewBox',`0 0 ${W} ${H}`); S.style.maxWidth=Math.round(W*1.1)+'px'; S.innerHTML=g;
  const T=$('dvSet');
  const pick=s=>{ S.querySelectorAll('.fn').forEach(x=>x.classList.toggle('on',x.dataset.s===s)); T.querySelectorAll('tr[data-s]').forEach(tr=>tr.classList.toggle('hl',tr.dataset.s===s)); const tr=T.querySelector(`tr[data-s="${s}"]`); if(tr) tr.scrollIntoView({behavior:'smooth',block:'nearest'}); };
  S.querySelectorAll('.fn').forEach(x=>{ x.onclick=()=>pick(x.dataset.s); x.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(x.dataset.s);}}; });
  T.querySelectorAll('tr[data-s]').forEach(tr=>tr.onclick=()=>pick(tr.dataset.s));
})();
chips('dvDone','jobDonePick',['파일 불러오기','Group by로 직업별 개수 세기','Select Rows로 4개 직업 빼기','평균 막대그래프','중앙값 막대그래프','(선택) 박스 플롯','(선택) 바이올린 플롯'],true);

/* 04 막혔을 때: 직업별 스트레스 대푯값 탐색기 (1~10 점수로 지어낸 예시 데이터) */
(function(){
  const J=[
    ['회계사',[3,4,4,4,4,4,4,4,4,4,7,7]],['의사',[3,5,6,6,6,6,6,6,8,8,8,8]],['엔지니어',[3,3,3,3,3,3,4,4,5,5,6,7]],
    ['변호사',[5,5,5,5,5,5,5,5,5,5,6,6]],['간호사',[3,3,3,3,3,7,8,8,8,8,8,8]],['영업 사원',[7,7,7,7,7,7,7,7,7,7]],['교사',[4,4,4,4,4,4,4,4,5,6,7,7]]
  ];
  const all=J.flatMap(j=>j[1]), M=dvMean(all);
  let view='mean';
  const tb=$('dvJobTab').querySelectorAll('button');
  tb.forEach(b=>b.onclick=()=>{ view=b.dataset.t; tb.forEach(x=>x.classList.toggle('ghost',x!==b)); draw(); });
  function draw(){
    const S=$('dvJob'); S.innerHTML=''; const X=v=>110+(v)/10*520, y0=20, H=40;
    for(let t=0;t<=10;t++){ el('line',{x1:X(t),x2:X(t),y1:10,y2:y0+J.length*H,class:'gl'},S); el('text',{x:X(t),y:y0+J.length*H+16,class:'tk','text-anchor':'middle'},S,t); }
    el('text',{x:630,y:y0+J.length*H+32,class:'axl','text-anchor':'end'},S,'스트레스 수준 (1~10 점수, 예시)');
    J.forEach(([n,a],i)=>{
      const y=y0+i*H+H/2; el('text',{x:102,y:y+4,class:'axl','text-anchor':'end'},S,n);
      if(view==='box'){
        const q1=dvQ(a,.25), q3=dvQ(a,.75), md=dvMed(a);
        el('line',{x1:X(Math.min(...a)),x2:X(Math.max(...a)),y1:y,y2:y,class:'dv-wh'},S);
        el('rect',{x:X(q1),y:y-11,width:Math.max(2,X(q3)-X(q1)),height:22,class:'dv-jbx'},S);
        el('line',{x1:X(md),x2:X(md),y1:y-11,y2:y+11,class:'dv-mdl'},S);
        const cnt={}; a.forEach(v=>{cnt[v]=(cnt[v]||0)+1; el('circle',{cx:X(v)+(cnt[v]-1)%6*3-7,cy:y+15,r:2,class:'dv-pt'},S);});
      } else {
        const v=view==='mean'?dvMean(a):dvMed(a);
        el('rect',{x:X(0),y:y-12,width:X(v)-X(0),height:24,class:v>M?'dv-hi':'dv-lo'},S);
        el('text',{x:X(v)+5,y:y+4,class:'tk'},S,dvR(v,2));
      }
    });
    if(view!=='box'){ el('line',{x1:X(M),x2:X(M),y1:10,y2:y0+J.length*H,class:'dv-mnl'},S); el('text',{x:X(M)+4,y:16,class:'dv-mnt'},S,'전체 평균 '+dvR(M,2)); }
    $('dvJobMsg').innerHTML={mean:'<b>평균 막대</b> · 전체 평균선보다 긴 막대(진한 색)와 짧은 막대를 찾아요. 그다음 「중앙값 막대」로 바꾸어 높낮이가 크게 달라지는 직업을 찾아요.',med:'<b>중앙값 막대</b> · 평균 막대와 비교해 전체 평균선 위아래가 바뀌거나 크게 달라진 직업은 어디인가요? 「박스 플롯」에서 그 직업의 점들이 어떻게 놓여 있는지 확인해요.',box:'<b>박스 플롯</b> · 상자(제1~제3사분위수)가 넓은 직업, 선처럼 좁은 직업을 찾아요. 아래 작은 점은 한 사람 한 사람의 점수예요. 점이 두 곳에 몰린 직업은 평균과 중앙값이 어떻게 달랐나요?'}[view];
  }
  draw();
})();

/* 05 (선택) 성취도 평가 */
chips('dvSelf','selfCheckPick',['데이터 분석 방법의 차이를 설명할 수 있다','평균·중앙값·최빈값을 구하고 알맞게 고를 수 있다','분산·표준편차·사분위수 범위를 구할 수 있다','박스 플롯으로 흩어진 정도를 비교할 수 있다'],true);

/* 06 마무리 */
const MEMOLIST=[['planGuess','처음 생각: 평균보다 낮다고 느낀 까닭'],['plan','나의 계획'],['repMemo','대푯값 계산기: 200분을 바꾸었을 때'],['eventMemo','함께 해결하기: 51점 길동이가 탈락한 까닭'],['spreadMemo','산포도 비교기: 분산·표준편차·사분위수 범위'],['jobDonePick','진행 체크: 오렌지3 직업별 스트레스'],['jobMemo','직업별 스트레스 그래프에서 찾은 것'],['gradeMemo','(선택) Course Grades 영어 과목'],['selfCheckPick','(선택) 성취도 평가'],['keyQ','오늘의 질문에 대한 내 답']];
/* (선택) 항목은 쓴 것만 모아 보기에 보이기 */
onShow[6]=()=>memoSummary('msum',MEMOLIST.filter(([k,l])=>!l.startsWith('(선택)')||String(MEMO[k]||'').trim()));

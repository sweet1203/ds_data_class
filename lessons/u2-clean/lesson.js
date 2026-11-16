/* u2-clean 결측치와 이상치 처리 (교과서 70~73쪽) */
/* 숫자 표시: 마이너스는 「−」, 소수 셋째 자리까지(끝의 0은 지움) */
const clN=v=>{const r=Math.round(v*1000)/1000; return String(Object.is(r,-0)?0:r).replace('-','−');};
const clF=(v,d)=>{const s=(Math.round(v*10**d)/10**d).toFixed(d); return (/^-0\.?0*$/.test(s)?s.slice(1):s).replace('-','−');};
const clMean=a=>a.reduce((s,x)=>s+x,0)/a.length;
/* 사분위수: 교과서·pandas와 같은 선형 보간 */
function clQ(a,p){const s=[...a].sort((x,y)=>x-y), pos=(s.length-1)*p, lo=Math.floor(pos), f=pos-lo; return lo+1<s.length? s[lo]+(s[lo+1]-s[lo])*f : s[lo];}
const clClear=g=>{while(g.firstChild) g.removeChild(g.firstChild);};

/* 0 시작: 수면 기록 그대로 평균 내기 */
$('clLogAvg').onclick=()=>{
  const m=$('clLogMsg');
  m.innerHTML='빈칸인 화요일을 빼고 6일의 값으로 계산하면 (6.5 + 7.0 + 65 + 6.0 + 9.5 + 8.0) ÷ 6 = <b>17.0시간</b>이에요. 하루에 평균 17시간을 잤다고요? <b>빈칸 하나</b>와 <b>동떨어진 값 하나</b> 때문에 계산 결과를 믿을 수 없게 되었어요.';
  m.classList.add('on');
};

/* 01 어떤 전처리일까? (새로 만든 상황) */
sorter('clSort',{
  cats:[{n:'데이터 정제',k:'#1f9d74'},{n:'데이터 통합',k:'#2f6fd0'},{n:'데이터 축소',k:'#9b4fc4'},{n:'데이터 변환',k:'#e0702b'}],
  items:[
    {t:'설문의 「나이」 칸에 152처럼 잘못 입력된 값을 찾아 바로잡는다',short:'잘못 입력된 나이 바로잡기',c:0,ic:'✍️',w:'데이터의 오류를 찾아 수정하는 일이에요(이상치 처리).'},
    {t:'센서가 잠깐 꺼져 비어 버린 기록을 알맞은 값으로 채운다',short:'비어 버린 센서 기록 채우기',c:0,ic:'📟',w:'누락된 데이터를 수정하는 일이에요(결측치 처리).'},
    {t:'작년 축제 만족도 응답과 올해 축제 만족도 응답(같은 문항)을 한 표로 이어 붙인다',short:'작년·올해 축제 응답 한 표로',c:1,ic:'🎪',w:'형식이 같은 두 데이터를 하나의 데이터로 합쳤어요.'},
    {t:'날씨 데이터와 교통사고 데이터를 날짜를 기준으로 한 표에 모은다',short:'날씨·교통사고를 날짜로 모으기',c:1,ic:'🌧️',w:'서로 다른 정보를 담은 두 데이터를 공통된 날짜로 연결해 합쳤어요.'},
    {t:'100만 건의 앱 사용 기록 가운데 1만 건만 무작위로 뽑아 분석한다',short:'100만 건 중 1만 건 뽑기',c:2,ic:'🎲',w:'데이터가 너무 크면 일부를 뽑아 분석해요(샘플링).'},
    {t:'속성 40개 가운데 분석에 필요한 속성 5개만 남긴다',short:'속성 40개 → 5개',c:2,ic:'🧺',w:'분석에 필요한 속성만 골라 데이터의 크기를 줄였어요(속성 선택).'},
    {t:'날마다 기록한 매점 판매량을 달마다의 합계 값으로 다시 계산한다',short:'날마다 → 달마다 합계',c:3,ic:'🧮',w:'여러 줄의 값을 모아 합계나 평균 같은 값으로 다시 계산하는 일을 집계라고 해요. 값을 버린 것이 아니라 분석에 알맞은 형태로 바꾸어 요약한 것이라 데이터 변환이에요.'},
    {t:'단위가 다른 키(cm)와 몸무게(kg)를 모두 0~1 사이의 값으로 맞춘다',short:'키·몸무게를 0~1로',c:3,ic:'📐',w:'값의 범위를 같게 바꾸어 비교하기 쉽게 했어요(정규화, 다음 시간에 배워요).'}
  ],
  end:'<b>정리</b> 틀린 값·빈칸을 고치면 <b>정제</b>, 여러 데이터를 합치면 <b>통합</b>, 크기를 줄이면 <b>축소</b>, 분석하기 좋은 형태로 바꾸면 <b>변환</b>이에요. 오늘은 이 가운데 <b>정제</b>(결측치·이상치 처리)를 자세히 배워요.'
});

/* 02 결측치 처리 실험: 12가구 월 소득(지어낸 예시, 만 원) */
(function(){
  const INC=[430,210,350,520,180,380,610,290,240,470,320,400];
  const LOW=[1,4,8];                 /* 소득이 낮은 3가구(2·5·9번) */
  const TRUE_MEAN=clMean(INC), TRUE_MED=clQ(INC,.5);
  const METH=['그대로 보기','결측치 삭제','평균값으로 대체','중앙값으로 대체'];
  let scen=0, miss=LOW.slice(), meth=0, shown=false;
  const S=$('clMissSvg');
  const X=i=>66+i*47, BW=30, Y=v=>230-v/700*200;
  function pickRandom(){
    let m; do{ m=shuffle(INC.map((_,i)=>i)).slice(0,3).sort((a,b)=>a-b); }while(m.join()===LOW.join());
    return m;
  }
  function calc(){
    const obs=INC.filter((_,i)=>!miss.includes(i)), mo=clMean(obs), md=clQ(obs,.5);
    return {obs,mo,md,rows:[
      {n:METH[1],k:1,vals:obs},
      {n:METH[2],k:2,vals:obs.concat([mo,mo,mo])},
      {n:METH[3],k:3,vals:obs.concat([md,md,md])}
    ]};
  }
  function draw(){
    const C=calc(); clClear(S);
    for(let v=0;v<=700;v+=100){ el('line',{x1:60,x2:622,y1:Y(v),y2:Y(v),class:'gl'},S); el('text',{x:54,y:Y(v)+4,class:'tk','text-anchor':'end'},S,v); }
    el('text',{x:8,y:16,class:'axl'},S,'월 소득(만 원)');
    el('text',{x:341,y:266,class:'axl','text-anchor':'middle'},S,'가구 번호');
    const fill=meth===2?C.mo:meth===3?C.md:null;
    INC.forEach((v,i)=>{
      const x=X(i), isM=miss.includes(i);
      el('text',{x:x+BW/2,y:248,class:'tk','text-anchor':'middle'},S,i+1);
      if(isM && shown) el('rect',{x,y:Y(v),width:BW,height:230-Y(v),class:'bar true'},S);
      if(!isM){
        el('rect',{x,y:Y(v),width:BW,height:230-Y(v),class:'bar'},S);
        el('text',{x:x+BW/2,y:Y(v)-4,class:'bv','text-anchor':'middle'},S,v);
      } else if(meth===0){
        el('rect',{x,y:190,width:BW,height:40,class:'bar ghost'},S);
        el('text',{x:x+BW/2,y:216,class:'bq','text-anchor':'middle'},S,'?');
        if(shown) el('text',{x:x+BW/2,y:Y(v)-4,class:'tl','text-anchor':'middle'},S,v);
      } else if(meth===1){
        el('text',{x:x+BW/2,y:224,class:'bq','text-anchor':'middle',style:'font-size:12px'},S,'삭제');
        if(shown) el('text',{x:x+BW/2,y:Y(v)-4,class:'tl','text-anchor':'middle'},S,v);
      } else {
        el('rect',{x,y:Y(fill),width:BW,height:230-Y(fill),class:'bar fill'},S);
        el('text',{x:x+BW/2,y:Y(fill)-4,class:'bv','text-anchor':'middle'},S,clF(fill,1));
        if(shown) el('text',{x:x+BW/2,y:Math.max(Y(v)+14,Y(fill)+16),class:'tl','text-anchor':'middle'},S,'실제 '+v);
      }
    });
    /* 평균선 */
    const cur=meth===0?null:C.rows[meth-1].vals;
    if(cur){
      const m=clMean(cur), up=!shown||m>=TRUE_MEAN;
      el('line',{x1:60,x2:622,y1:Y(m),y2:Y(m),class:'mline'},S);
      el('text',{x:628,y:up?Y(m)-2:Y(m)+12,class:'ml'},S,'처리 후 평균 '+clF(m,1));
    }
    if(shown){
      const up=cur?clMean(cur)<TRUE_MEAN:true;
      el('line',{x1:60,x2:622,y1:Y(TRUE_MEAN),y2:Y(TRUE_MEAN),class:'tline'},S);
      el('text',{x:628,y:up?Y(TRUE_MEAN)-2:Y(TRUE_MEAN)+12,class:'tl'},S,'실제 평균 '+clF(TRUE_MEAN,1));
    }
    /* 결과표 */
    let h='<tr><th>처리 방법</th><th>계산에 쓴 행</th><th>평균</th><th>중앙값</th><th>실제 평균과 차이</th></tr>';
    C.rows.forEach(r=>{
      const m=clMean(r.vals), d=m-TRUE_MEAN;
      h+=`<tr class="${r.k===meth?'on':''}"><td>${r.n}</td><td>${r.vals.length}</td><td>${clF(m,1)}</td><td>${clF(clQ(r.vals,.5),1)}</td><td>${shown?`<span class="${Math.abs(d)>25?'up':'near'}">${d>=0?'+':'−'}${clF(Math.abs(d),1)}</span>`:'?'}</td></tr>`;
    });
    h+=`<tr><td><b>실제(숨긴 값 포함)</b></td><td>12</td><td>${shown?clF(TRUE_MEAN,1):'?'}</td><td>${shown?clF(TRUE_MED,1):'?'}</td><td>–</td></tr>`;
    $('clMissTbl').innerHTML=h;
    /* 안내 */
    const missName=miss.map(i=>(i+1)+'번').join('·');
    let msg=[
      `${missName} 가구가 답하지 않았어요. 빈칸에는 값이 없어서 「?」로 보여요. 위 단추로 처리 방법을 골라 보세요.`,
      `결측치가 있는 3가구(행)를 지우고 <b>9가구</b>로 계산했어요. 행이 12개에서 9개로 줄었어요.`,
      `빈칸을 남은 9가구의 평균 <b>${clF(C.mo,1)}</b>로 채웠어요. 행은 12개 그대로이고, 평균은 삭제했을 때와 같아요.`,
      `빈칸을 남은 9가구의 중앙값 <b>${clF(C.md,1)}</b>로 채웠어요. 행은 12개 그대로예요.`
    ][meth];
    if(shown){
      const dd=clMean(C.rows[0].vals)-TRUE_MEAN;
      msg+=scen===0
        ? ' <br><b>실제 평균은 '+clF(TRUE_MEAN,1)+'</b>이에요. 소득이 낮은 가구만 빠져서 <b>세 방법 모두 실제보다 높게</b> 나왔어요. 채운 값도 중간쯤의 소득이라 저소득 가구의 소득이 반영되지 않았어요.'
        : (Math.abs(dd)<=25
          ? ' <br><b>실제 평균은 '+clF(TRUE_MEAN,1)+'</b>이에요. 이번에는 남은 9가구가 전체와 비슷해서(<b>대표성 유지</b>) 삭제해도 실제와의 차이가 작아요. 다른 3가구를 여러 번 뽑아 보세요.'
          : ' <br><b>실제 평균은 '+clF(TRUE_MEAN,1)+'</b>이에요. 이번에는 우연히 소득이 '+(dd>0?'낮은':'높은')+' 쪽 가구가 몰려 빠져서 차이가 커요. 여러 번 뽑아 보면 대체로 실제와 가까워요.');
    }
    $('clMissMsg').innerHTML=msg;
    $('clReveal').textContent=shown?'실제 소득 다시 숨기기':'숨긴 실제 소득 보기';
  }
  $('clScen').querySelectorAll('.cl-pill').forEach(b=>b.onclick=()=>{
    scen=+b.dataset.s; $('clScen').querySelectorAll('.cl-pill').forEach(x=>x.classList.toggle('on',x===b));
    miss=scen===0?LOW.slice():pickRandom(); shown=false; $('clReroll').style.display=scen?'':'none'; draw();
  });
  $('clReroll').onclick=()=>{miss=pickRandom(); shown=false; draw();};
  $('clMeth').querySelectorAll('.cl-pill').forEach(b=>b.onclick=()=>{
    meth=+b.dataset.m; $('clMeth').querySelectorAll('.cl-pill').forEach(x=>x.classList.toggle('on',x===b)); draw();
  });
  $('clReveal').onclick=()=>{shown=!shown; draw();};
  draw();
})();

/* 03 박스 플롯 그림 (그림 Ⅱ-2를 다시 그림) */
(function(){
  const S=$('clBoxFig');
  el('line',{x1:28,x2:420,y1:75,y2:75,class:'gl'},S);
  el('line',{x1:120,x2:170,y1:75,y2:75,class:'wh'},S); el('line',{x1:270,x2:320,y1:75,y2:75,class:'wh'},S);
  el('line',{x1:120,x2:120,y1:65,y2:85,class:'wh'},S); el('line',{x1:320,x2:320,y1:65,y2:85,class:'wh'},S);
  el('rect',{x:170,y:57,width:100,height:36,class:'box'},S);
  el('line',{x1:212,x2:212,y1:57,y2:93,class:'med'},S);
  [[100,'하한값'],[340,'상한값']].forEach(([x,t])=>{
    el('line',{x1:x,x2:x,y1:40,y2:108,class:'fence'},S);
    el('text',{x,y:124,class:'fl','text-anchor':'middle'},S,t);
    el('text',{x,y:138,class:'tk','text-anchor':'middle'},S,x<200?'Q1 − 1.5 × IQR':'Q3 + 1.5 × IQR');
  });
  [[52,75],[68,75],[378,75],[400,75]].forEach(([x,y])=>el('circle',{cx:x,cy:y,r:5,class:'dot out'},S));
  el('text',{x:60,y:58,class:'fl','text-anchor':'middle'},S,'이상치'); el('text',{x:389,y:58,class:'fl','text-anchor':'middle'},S,'이상치');
  el('line',{x1:170,x2:270,y1:30,y2:30,class:'wh'},S); el('line',{x1:170,x2:170,y1:25,y2:35,class:'wh'},S); el('line',{x1:270,x2:270,y1:25,y2:35,class:'wh'},S);
  el('text',{x:220,y:20,class:'ql','text-anchor':'middle'},S,'IQR (사분위수 범위)');
  el('text',{x:212,y:51,class:'ql','text-anchor':'middle'},S,'중앙값');
  el('text',{x:170,y:108,class:'ql','text-anchor':'middle'},S,'Q1'); el('text',{x:270,y:108,class:'ql','text-anchor':'middle'},S,'Q3');
})();

/* 03 IQR 이상치 탐지기: 15명의 수면 시간(예시) */
(function(){
  const INIT=[4.5,5.5,6,6,6.5,6.5,7,7,7,7.5,7.5,8,8.5,9,13];
  const MIN=0, MAX=16, S=$('clIqrSvg'), X=v=>40+(v-MIN)/(MAX-MIN)*600, cx=x=>Math.max(40,Math.min(640,x));
  let V=INIT.slice(), done=[false,false,false], m3txt='', before=null;
  /* 미션 3: 옮기기 직전 값을 기억했다가 「끌기 전 → 후」로 비교 */
  const snap=()=>({mean:clMean(V),q3:clQ(V,.75),max:Math.max(...V)});
  /* 눈금 (한 번만) */
  el('line',{x1:40,x2:640,y1:212,y2:212,class:'ax'},S);
  for(let v=MIN;v<=MAX;v++){ el('line',{x1:X(v),x2:X(v),y1:212,y2:v%2?216:219,class:'ax'},S); if(v%2===0) el('text',{x:X(v),y:232,class:'tk','text-anchor':'middle'},S,v); }
  el('text',{x:640,y:248,class:'axl','text-anchor':'end'},S,'수면 시간(시간)');
  const G=el('g',{},S);
  const dots=V.map((_,i)=>el('circle',{r:7,class:'dot',tabindex:0,'data-i':i,'aria-label':'수면 시간 점'},S));
  const toVal=e=>{const pt=S.createSVGPoint(); pt.x=e.clientX; pt.y=e.clientY; const p=pt.matrixTransform(S.getScreenCTM().inverse()); return Math.max(MIN,Math.min(MAX,Math.round((p.x-40)/600*(MAX-MIN)*2)/2+MIN));};
  let drag=-1;
  dots.forEach((c,i)=>{
    c.addEventListener('pointerdown',e=>{drag=i; before=snap(); try{c.setPointerCapture(e.pointerId);}catch(_){} e.preventDefault(); if(c.focus) c.focus();});
    c.addEventListener('pointermove',e=>{ if(drag!==i) return; const v=toVal(e); if(v!==V[i]){V[i]=v; update();} });
    const end=()=>{drag=-1;}; c.addEventListener('pointerup',end); c.addEventListener('pointercancel',end);
    c.addEventListener('focus',()=>{ if(drag!==i) before=snap(); });
    c.addEventListener('keydown',e=>{ if(e.key==='ArrowLeft'||e.key==='ArrowRight'){ e.preventDefault(); if(!before) before=snap(); V[i]=Math.max(MIN,Math.min(MAX,V[i]+(e.key==='ArrowRight'?.5:-.5))); update(); } });
  });
  function update(){
    const q1=clQ(V,.25), q2=clQ(V,.5), q3=clQ(V,.75), iqr=q3-q1, lo=q1-1.5*iqr, hi=q3+1.5*iqr;
    const isOut=v=>v<lo-1e-9||v>hi+1e-9, inV=V.filter(v=>!isOut(v)), outV=V.filter(isOut).sort((a,b)=>a-b);
    const wlo=Math.min(...inV), whi=Math.max(...inV), mean=clMean(V);
    clClear(G);
    /* 경계선 */
    [[lo,'하한값 '+clN(lo)],[hi,'상한값 '+clN(hi)]].forEach(([v,t],k)=>{
      const x=cx(X(v)); el('line',{x1:x,x2:x,y1:40,y2:205,class:'fence'},G);
      el('text',{x:x+(k?-4:4),y:34,class:'fl','text-anchor':k?'end':'start'},G,t+((v<MIN||v>MAX)?' (화면 밖)':''));
    });
    /* 박스 플롯 */
    el('line',{x1:X(wlo),x2:X(q1),y1:75,y2:75,class:'wh'},G); el('line',{x1:X(q3),x2:X(whi),y1:75,y2:75,class:'wh'},G);
    el('line',{x1:X(wlo),x2:X(wlo),y1:65,y2:85,class:'wh'},G); el('line',{x1:X(whi),x2:X(whi),y1:65,y2:85,class:'wh'},G);
    el('rect',{x:X(q1),y:58,width:Math.max(1,X(q3)-X(q1)),height:34,class:'box'},G);
    el('line',{x1:X(q2),x2:X(q2),y1:58,y2:92,class:'med'},G);
    el('text',{x:X(q1),y:108,class:'ql','text-anchor':'end'},G,'Q1 ');
    el('text',{x:X(q3),y:108,class:'ql','text-anchor':'start'},G,' Q3');
    el('text',{x:X(q2),y:52,class:'ql','text-anchor':'middle'},G,'중앙값');
    /* 점 (같은 값은 위로 쌓기) */
    const cnt={};
    dots.forEach((c,i)=>{const v=V[i], lv=cnt[v]=(cnt[v]||0)+1; c.setAttribute('cx',X(v)); c.setAttribute('cy',200-Math.min(lv-1,6)*15); c.setAttribute('class','dot'+(isOut(v)?' out':'')); c.setAttribute('aria-label',`수면 시간 ${clN(v)}시간${isOut(v)?', 이상치':''}`);});
    /* 수치 */
    const box=(t,v,k,s)=>`<div style="--k:${k}"><small>${t}</small><b>${v}</b>${s?`<small>${s}</small>`:''}</div>`;
    $('clIqrStats').innerHTML=box('Q1 (하위 25%)',clN(q1),'#e0702b')+box('중앙값 (Q2)',clN(q2),'#0f2742')+box('Q3 (하위 75%)',clN(q3),'#e0702b')+box('IQR = Q3 − Q1',clN(iqr),'#e0702b')
      +box('하한값 = Q1 − 1.5 × IQR',clN(lo),'#d64535')+box('상한값 = Q3 + 1.5 × IQR',clN(hi),'#d64535')+box('평균',clF(mean,2),'#2f6fd0','모든 값을 더해 15로 나눔')
      +box('이상치',outV.length?outV.map(clN).join(', '):'없음','#d64535',outV.length+'개');
    /* 미션 */
    if(outV.length===0) done[0]=true;
    if(V.some(v=>v<lo-1e-9)) done[1]=true;
    if(Math.max(...V)===MAX && !done[2] && before && before.max<MAX){
      done[2]=true;
      const sameQ3=Math.abs(q3-before.q3)<1e-9, up=mean>before.mean+1e-9;
      m3txt=`끌기 전(가장 큰 값 ${clN(before.max)}) 평균 ${clF(before.mean,2)}, Q3 ${clN(before.q3)} → 16일 때 평균 ${clF(mean,2)}, Q3 ${clN(q3)}. `
        +(sameQ3&&up?'평균은 커졌는데 Q3는 그대로예요.':up?'평균이 커졌어요. Q3도 바뀌었다면, 가장 큰 점이 아닌 다른 점을 끌었는지 살펴보세요.':'값을 비교해 보세요.');
    }
    const M=[['미션 1','이상치가 하나도 없게 만들기','멀리 있는 점을 다른 점들 쪽으로 끌어 보세요.'],
             ['미션 2','작은 쪽(하한값 아래)에도 이상치 만들기','작은 값을 왼쪽 끝으로 끌어 보세요.'],
             ['미션 3','가장 큰 값을 16까지 끌기','가장 오른쪽 점을 오른쪽 끝(16)까지 끌어요. 끌기 전과 후의 평균·Q3를 비교해 줘요.']];
    $('clMission').innerHTML=M.map((m,k)=>`<div class="${done[k]?'ok':''}"><b>${done[k]?'✓ ':''}${m[0]} · ${m[1]}</b>${done[k]?(k===2?m3txt:'성공!'):m[2]}</div>`).join('');
  }
  $('clIqrReset').onclick=()=>{V=INIT.slice(); done=[false,false,false]; m3txt=''; before=null; update();};
  update();
})();

/* 03 교과서 73쪽 값으로 계산하기 */
(function(){
  const ANS={clT73iqr:4.45,clT73lo:-6.55,clT73hi:11.25};
  const J=[{v:-2.5,s:'1993년',a:false},{v:19.1,s:'2020년',a:true},{v:0.5,s:'1992년',a:false},{v:-6.7,s:'2012년',a:true}];
  let pick=J.map(()=>null);
  function draw(res){
    $('clT73judge').innerHTML=J.map((j,i)=>`<div class="cl-jv${res?(pick[i]===j.a?' good':' bad'):''}"><b>${clN(j.v)}</b><small>${j.s}</small><div class="row"><button data-i="${i}" data-v="1" class="${pick[i]===true?'on':''}">이상치</button><button data-i="${i}" data-v="0" class="${pick[i]===false?'on':''}">아니에요</button></div></div>`).join('');
    $('clT73judge').querySelectorAll('button').forEach(b=>b.onclick=()=>{pick[+b.dataset.i]=b.dataset.v==='1'; draw();});
  }
  $('clT73ok').onclick=()=>{
    const ids=Object.keys(ANS); let c=0, empty=0;
    ids.forEach(id=>{const t=$(id), raw=t.value.trim().replace('−','-'), v=parseFloat(raw); t.classList.remove('ok','ng'); if(raw===''||isNaN(v)){empty++; return;} const ok=Math.abs(v-ANS[id])<0.006; if(ok) c++; t.classList.add(ok?'ok':'ng');});
    const left=pick.filter(p=>p==null).length;
    if(empty||left){ $('clT73msg').innerHTML=`아직 ${empty?`빈칸 ${empty}개`:''}${empty&&left?', ':''}${left?`고르지 않은 값 ${left}개`:''}가 있어요.`; $('clT73msg').classList.add('on'); return; }
    draw(true);
    const j=J.filter((x,i)=>pick[i]===x.a).length;
    MEMO.iqrCheck=`IQR·하한값·상한값 ${c}/3 맞힘, 이상치 판정 ${j}/4 맞힘`; store.set(MK,MEMO);
    const sol='<b>풀이</b> IQR = 4.575 − 0.125 = <b>4.45</b> · 하한값 = 0.125 − 1.5 × 4.45 = <b>−6.55</b> · 상한값 = 4.575 + 1.5 × 4.45 = <b>11.25</b>. 그래서 −6.55보다 작은 <b>−6.7(2012년)</b>과 11.25보다 큰 <b>19.1(2020년)</b>이 이상치예요.<br><span class="muted">교과서 73쪽 옆 설명의 「4.57 − 0.125」는 4.575 − 0.125를 잘못 적은 것이에요(결과 4.450은 맞아요).</span>';
    $('clT73msg').innerHTML=(c===3&&j===4?'<span class="ok">모두 맞았어요!</span> ':`계산 <b>${c}/3</b> · 판정 <b>${j}/4</b> 맞았어요. 빨간 칸과 테두리를 다시 살펴봐요. `)+(c===3&&j===4?sol:'<span id="clT73solBox"><button class="btn ghost sm" id="clT73sol">풀이 보기</button></span>');
    $('clT73msg').classList.add('on');
    const sb=$('clT73sol'); if(sb) sb.onclick=()=>{$('clT73solBox').innerHTML='<div style="margin-top:6px">'+sol+'</div>';};
  };
  $('clT73re').onclick=()=>{Object.keys(ANS).forEach(id=>{$(id).value=''; $(id).classList.remove('ok','ng');}); pick=J.map(()=>null); draw(); $('clT73msg').classList.remove('on'); $('clT73msg').innerHTML='';};
  draw();
})();

/* 03 (선택) 추세선 실험: 1989~2022년 예시 값 (2012년 −6.7, 2020년 19.1만 교과서 73쪽과 같음) */
(function(){
  const YR=[], VAL=[-0.1,-0.8,0.3,1.2,-0.5,1.1,0.3,1.1,2.3,2.9,2.0,3.0,2.8,2.1,4.0,3.9,3.4,4.9,3.8,4.8,4.9,4.7,6.3,-6.7,5.7,7.5,5.8,7.4,6.9,7.8,7.9,19.1,8.9,8.5];
  for(let y=1989;y<=2022;y++) YR.push(y);
  const q1=clQ(VAL,.25), q3=clQ(VAL,.75), lo=q1-1.5*(q3-q1), hi=q3+1.5*(q3-q1), isOut=v=>v<lo||v>hi;
  const MED=clQ(VAL,.5);
  const S=$('clTrendSvg'), X=y=>56+(y-1988)/64*600, Y=v=>228-(v+8)/29*206;
  function fit(xs,ys){const mx=clMean(xs), my=clMean(ys); let a=0,b=0; xs.forEach((x,i)=>{a+=(x-mx)*(ys[i]-my); b+=(x-mx)**2;}); const k=a/b; return {k,c:my-k*mx,at:x=>k*x+my-k*mx};}
  const pred=[];
  [0,1,2].forEach(t=>{const xs=[],ys=[]; YR.forEach((y,i)=>{const v=VAL[i]; if(t===1&&isOut(v)) return; xs.push(y); ys.push(t===2&&isOut(v)?MED:v);}); pred[t]=fit(xs,ys);});
  let mode=0;
  function draw(){
    clClear(S);
    for(let v=-8;v<=20;v+=4){ el('line',{x1:56,x2:660,y1:Y(v),y2:Y(v),class:'gl'},S); el('text',{x:50,y:Y(v)+4,class:'tk','text-anchor':'end'},S,clN(v)); }
    for(let y=1990;y<=2050;y+=10) el('text',{x:X(y),y:246,class:'tk','text-anchor':'middle'},S,y);
    el('text',{x:8,y:14,class:'axl'},S,'해수면 높이 편차(예시)');
    el('text',{x:660,y:259,class:'axl','text-anchor':'end'},S,'연도');
    el('line',{x1:X(2050),x2:X(2050),y1:Y(20),y2:Y(-8),class:'y50'},S);
    const pts=YR.map((y,i)=>{const v=VAL[i], o=isOut(v); if(mode===1&&o) return null; return [y,mode===2&&o?MED:v,o];}).filter(Boolean);
    el('path',{d:'M'+pts.map(p=>X(p[0])+','+Y(p[1])).join(' L'),class:'conn'},S);
    YR.forEach((y,i)=>{const v=VAL[i], o=isOut(v);
      if(o&&mode===1){ el('circle',{cx:X(y),cy:Y(v),r:4,class:'tp gone'},S); return; }
      if(o&&mode===2){ el('circle',{cx:X(y),cy:Y(v),r:4,class:'tp gone'},S); el('circle',{cx:X(y),cy:Y(MED),r:4.5,class:'tp rep'},S); return; }
      el('circle',{cx:X(y),cy:Y(v),r:o?5:3.5,class:'tp'+(o?' out':'')},S);
    });
    const f=pred[mode], p=f.at(2050);
    el('line',{x1:X(1989),x2:X(2050),y1:Y(f.at(1989)),y2:Y(p),class:'tline2'},S);
    el('circle',{cx:X(2050),cy:Y(p),r:5,class:'tp',style:'fill:#9b4fc4'},S);
    el('text',{x:X(2050)-8,y:Y(p)-8,class:'pl','text-anchor':'end'},S,'2050년 예측 '+clF(p,2));
    const d=['',
      ` 이상치 2개(2012년, 2020년)를 지우고 ${YR.length-2}개로 추세선을 그었어요. 포함했을 때보다 ${clF(pred[0].at(2050)-p,2)} 작아요.`,
      ` 이상치 2개를 전체 값의 중앙값(${clN(MED)})으로 바꾸었어요(빈 원 → 노란 점). 2020년의 큰 값이 중간값으로 바뀌면서 추세선의 끝이 더 내려갔어요. 대체한 값은 실제 분포를 반영하지 못할 수 있어요.`][mode];
    $('clTrendMsg').innerHTML=`<b>2050년 예측값 ${clF(p,2)}</b> · ${['이상치를 포함해 34개 값 모두로 추세선을 그었어요.','',''][mode]}${d}`;
  }
  $('clTrBtn').querySelectorAll('.cl-pill').forEach(b=>b.onclick=()=>{mode=+b.dataset.t; $('clTrBtn').querySelectorAll('.cl-pill').forEach(x=>x.classList.toggle('on',x===b)); draw();});
  draw();
})();

/* 03 이 이상치, 어떻게 할까? (새로 만든 사례) */
(function(){
  const OPTS=['제거','대체','남겨 두고 살펴보기'];
  const C=[
    {s:'수면 시간 65시간',t:'수면 시간 설문에서 한 학생의 답이 「65시간」이에요. 이 학생의 다른 날은 6~7시간이에요.',good:[0,1],w:'하루는 24시간이라 65시간은 있을 수 없는 잘못 입력된 값이에요. 지우거나(제거), 평균값·중앙값 같은 값으로 바꾸어(대체) 처리해요. 학생에게 물어 6.5를 잘못 쓴 것이 확인되면 바로잡을 수도 있어요.'},
    {s:'교실 온도 −40℃',t:'교실 온도 센서가 잠깐 고장 나서, 한낮 기록 하나가 「−40℃」로 찍혔어요.',good:[0,1],w:'센서 고장으로 생긴 잘못된 값이에요. 지우거나, 앞뒤 시각의 온도처럼 알맞은 값으로 바꾸어요. 그대로 두면 하루 평균 온도가 크게 낮아져요.'},
    {s:'체육 대회 날 물 사용량',t:'체육 대회 날, 학교 정수기의 물 사용량이 평소의 3배로 기록되었어요.',good:[2],w:'실제로 일어난 일이라 잘못된 값이 아니에요. 행사 날 물이 얼마나 더 필요한지 알고 싶다면 꼭 남겨서 살펴봐야 해요. 「평소」 사용량을 알고 싶다면 따로 떼어 분석할 수도 있어요.'}
  ];
  let pick=C.map(()=>null);
  function draw(){
    $('clCases').innerHTML='<div class="cl-cases">'+C.map((c,i)=>`<div class="cl-case${pick[i]==null?'':(c.good.includes(pick[i])?' good':' bad')}"><p class="t">${c.t}</p><div class="row">${OPTS.map((o,j)=>`<button data-i="${i}" data-j="${j}" class="${pick[i]===j?'on':''}">${o}</button>`).join('')}</div>${pick[i]==null?'':`<p class="w">${c.good.includes(pick[i])?'<span class="ok">알맞은 선택이에요.</span>':'<span class="ng" style="color:#8a5a00">다시 생각해 볼까요?</span>'} ${c.w}</p>`}</div>`).join('')+'</div>';
    $('clCases').querySelectorAll('button').forEach(b=>b.onclick=()=>{pick[+b.dataset.i]=+b.dataset.j; MEMO.casePick=C.map((c,k)=>`${c.s}: ${pick[k]==null?'(안 고름)':OPTS[pick[k]]}`).join(' · '); store.set(MK,MEMO); draw();});
  }
  draw();
})();

/* 04 마무리 */
const MEMOLIST=[['plan','나의 계획(70쪽)'],['firstThought','처음 생각: 수면 기록의 이상한 곳'],['missMemo','결측치 처리 실험 정리'],['iqrMemo','이상치를 찾는 순서와 평균·Q3의 변화'],['casePick','이 이상치, 어떻게 할까? (고른 방법)'],['caseMemo','이상치 처리 방법과 까닭'],['iqrCheck','73쪽 IQR 계산과 이상치 판정 결과'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[4]=()=>{
  const v=String(MEMO.firstThought||'').trim();
  $('clPrev').innerHTML=v?`<b>시작 화면에 적은 처음 생각</b><span>${esc(v)}</span>`:'';
  $('clPrev').style.display=v?'':'none';
  memoSummary('msum',MEMOLIST);
};

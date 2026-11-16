/* u2-preprocess-lab — 전처리 실습과 시각화 (교과서 78~85쪽) */

/* ───────── 화면 안 작은 수면 표 (지어낸 예시 20명, 실제 데이터 아님) ─────────
   열: ID, 직업, 수면 시간, 수면의 질(1~10), 신체 활동 수준(분), 스트레스 수준(1~10), 걸음 수
   ID 8·9는 수면 시간이 빈칸(결측치), ID 17은 신체 활동 수준 240(이상치) */
const PL_RAW=[
  [1,'간호사',6.1,5,30,8,3500],[2,'의사',6.4,6,45,8,5000],[3,'교사',7.4,8,60,5,7000],[4,'엔지니어',7.9,9,75,3,8000],
  [5,'변호사',7.1,7,60,5,7500],[6,'회계사',7.2,8,50,4,6500],[7,'영업 사원',6.0,5,40,7,4500],[8,'간호사',null,6,75,6,8000],
  [9,'의사',null,7,90,5,9000],[10,'엔지니어',8.1,9,75,3,7800],[11,'교사',6.8,7,35,4,5200],[12,'변호사',7.0,7,70,6,7200],
  [13,'영업 사원',5.9,4,30,8,3200],[14,'회계사',7.5,8,60,4,6800],[15,'간호사',6.3,5,55,6,6000],[16,'의사',7.6,8,90,4,9500],
  [17,'엔지니어',7.8,8,240,4,8500],[18,'교사',6.6,6,45,4,5500],[19,'간호사',5.8,4,65,8,6200],[20,'변호사',7.3,8,80,3,8200]
];
/* 작은 건강 표: ID 17은 없음(교과서 Health.csv에도 이상치였던 사람이 빠져 있는 것과 같게) */
const PL_BMI={1:'과체중',2:'정상',3:'정상',4:'정상',5:'정상',6:'정상',7:'과체중',8:'과체중',9:'정상',10:'정상',11:'과체중',12:'정상',13:'비만',14:'정상',15:'과체중',16:'정상',18:'과체중',19:'비만',20:'정상'};
const PL_COLS=['ID','직업','수면 시간','수면의 질','신체 활동 수준','스트레스 수준','걸음 수'];
const PL_UNIT=['','','시간','점','분','점','걸음'];
const PL_NUM=[2,3,4,5,6];
const PL_STEP={1:'① 살펴보기',2:'② 결측치 채우기 · Impute',3:'③ 박스 플롯 · Box Plot',4:'④ 이상치 표시 · Formula',5:'⑤ N만 남기기 · Select Rows',6:'⑥ 표준화 · Preprocess',7:'⑦ 건강 표와 합치기 · Merge Data',8:'⑧ 그래프 · Scatter Plot · Box Plot'};
const PL_BOX={plA:[1,2],plB:[3,5],plC:[6,6],plD:[7,8]};

const plMean=a=>a.reduce((s,x)=>s+x,0)/a.length;
const plSd=a=>{const m=plMean(a); return Math.sqrt(plMean(a.map(x=>(x-m)*(x-m))));};   /* 모집단 표준편차(÷n) — 오렌지3·StandardScaler와 같음 */
const plQ=(a,p)=>{const s=a.slice().sort((x,y)=>x-y), h=(s.length-1)*p, lo=Math.floor(h); return s[lo]+(h-lo)*((s[lo+1]??s[lo])-s[lo]);};
const plF=(x,d)=>(Math.round(x*Math.pow(10,d))/Math.pow(10,d)).toFixed(d);

let PL;
function plReset(){
  PL={done:0, rows:PL_RAW.map(r=>({id:r[0],v:r.slice(),fill:false,out:null,raw:null})), snap:{}, fillVal:null, box:null, before:null, after:null, std:null, pick:4, match:'id', shuf:false, horder:Object.keys(PL_BMI).map(Number), bmi:{}, auto:''};
  PL.snap[0]=plCopy();
}
function plCopy(){ return {rows:PL.rows.map(r=>({id:r.id,v:r.v.slice(),fill:r.fill,out:r.out,raw:r.raw&&r.raw.slice()}))}; }
function plStep(n){
  const R=PL.rows;
  if(n===2){ const vals=R.map(r=>r.v[2]).filter(x=>x!=null); PL.fillVal=plMean(vals); R.forEach(r=>{if(r.v[2]==null){r.v[2]=PL.fillVal; r.fill=true;}}); }
  if(n===3){ const a=R.map(r=>r.v[4]), q1=plQ(a,.25), q3=plQ(a,.75), iqr=q3-q1; PL.box={q1,q3,med:plQ(a,.5),iqr,lo:q1-1.5*iqr,hi:q3+1.5*iqr}; }
  if(n===4){ R.forEach(r=>r.out=r.v[4]>120?'Y':'N'); }
  if(n===5){ const a=R.map(r=>r.v[4]); PL.before={n:a.length,m:plMean(a),d:plSd(a)/plMean(a)};
    PL.rows=R.filter(r=>r.out==='N'); const b=PL.rows.map(r=>r.v[4]); PL.after={n:b.length,m:plMean(b),d:plSd(b)/plMean(b)}; }
  if(n===6){ PL.std={}; PL_NUM.forEach(k=>{const a=PL.rows.map(r=>r.v[k]); PL.std[k]={m:plMean(a),sd:plSd(a),min:Math.min(...a),max:Math.max(...a)};});
    PL.rows.forEach(r=>{r.raw=r.v.slice(); PL_NUM.forEach(k=>r.v[k]=(r.v[k]-PL.std[k].m)/PL.std[k].sd);}); }
  if(n===7){ plMerge(); }
  PL.done=n; PL.snap[n]=plCopy();
}
function plMerge(){
  /* Person ID로 맞추기 또는 Row index(줄 순서)로 맞추기 */
  PL.bmi={}; PL.bad=0;
  PL.rows.forEach((r,i)=>{ const b=PL.match==='id'?PL_BMI[r.id]:PL_BMI[PL.horder[i]]; PL.bmi[r.id]=b; if(b!==PL_BMI[r.id]) PL.bad++; });
}
function plRunTo(n){ const from=PL.done; while(PL.done<n) plStep(PL.done+1); return from; }

/* 표 그리기 (스냅숏 기준) */
function plTable(sn,lv){
  const outCol=lv>=4, bmiCol=lv>=7, std=lv>=6;
  let h='<tr>'+PL_COLS.map((c,j)=>`<th class="${std&&PL_NUM.includes(j)?'z':''}">${c}</th>`).join('')+(outCol?'<th>outlier</th>':'')+(bmiCol?'<th>BMI 범주</th>':'')+'</tr>';
  sn.rows.forEach(r=>{
    h+=`<tr class="${r.out==='Y'?'outrow':''}">`+r.v.map((x,j)=>{
      if(j===2&&x==null) return '<td class="miss">?</td>';
      if(std&&PL_NUM.includes(j)) return `<td class="z${j===2&&r.fill?' fill':''}">${plF(x,3)}</td>`;
      if(j===2) return `<td class="${r.fill?'fill':''}">${r.fill?plF(x,2):plF(x,1)}</td>`;
      if(j===4&&r.out==='Y') return `<td class="ycell">${x}</td>`;
      return `<td>${x}</td>`;
    }).join('')+(outCol?`<td class="${r.out==='Y'?'ycell':''}">${r.out}</td>`:'')+(bmiCol?`<td class="${PL.bmi[r.id]!==PL_BMI[r.id]?'ycell':''}">${PL.bmi[r.id]||'?'}</td>`:'')+'</tr>';
  });
  return `<div class="pl-tscroll"><table class="pl-tbl pl-mini">${h}</table></div>`;
}

/* 단계별 결과 설명 */
function plPanel(n,id){
  const sn=PL.snap[Math.min(PL.done,PL_BOX[id][1])];
  if(n===1){
    const R=PL.snap[0].rows, miss=R.filter(r=>r.v[2]==null).length;
    let t='<tr><th>속성</th><th>평균</th><th>중앙값</th><th>최솟값</th><th>최댓값</th><th>결측치</th></tr>';
    PL_NUM.forEach(k=>{const a=R.map(r=>r.v[k]).filter(x=>x!=null); t+=`<tr><td>${PL_COLS[k]}</td><td>${plF(plMean(a),2)}</td><td>${+plQ(a,.5).toFixed(2)}</td><td>${Math.min(...a)}</td><td>${Math.max(...a)}</td><td class="${k===2?'ng':''}">${R.length-a.length}</td></tr>`;});
    return `<p><b>20개 행 · 7개 속성 · 결측치 ${miss}칸</b> (140칸 중 ${plF(miss/140*100,1)}%). 오렌지3의 <b>Column Statistics</b>(교과서·옛 버전 이름은 Feature Statistics)도 이렇게 속성마다 평균·중앙값·최솟값·최댓값·결측치(Missing)를 보여 줘요.</p><div class="pl-tscroll"><table class="pl-tbl pl-stat">${t}</table></div><p class="muted">아래 표에서 <span class="pl-k miss">?</span> 칸을 찾아보세요.</p>`;
  }
  if(n===2) return `<p>수면 시간의 빈칸 ${PL.snap[0].rows.filter(r=>r.v[2]==null).length}개를, 빈칸을 뺀 18명의 <b>평균 ${plF(PL.fillVal,2)}</b>시간으로 채웠어요 <span class="pl-k fill">노란 칸</span>. 오렌지3의 <b>Impute</b>(Average/Most frequent)가 하는 일과 같아요.</p><p class="muted">만약 결측치가 있는 줄을 지웠다면 20명이 18명이 되고, 그 두 사람의 수면의 질·스트레스 수준·걸음 수도 함께 사라져요.</p>`;
  if(n===3){ const b=PL.box; return `<p>신체 활동 수준의 <b>Q1 = ${plF(b.q1,0)}</b>, 중앙값 = ${plF(b.med,0)}, <b>Q3 = ${plF(b.q3,0)}</b> → IQR = ${plF(b.iqr,0)}<br>하한값 = ${plF(b.q1,0)} − ${plF(b.iqr,0)} × 1.5 = <b>${plF(b.lo,0)}</b>, 상한값 = ${plF(b.q3,0)} + ${plF(b.iqr,0)} × 1.5 = <b>${plF(b.hi,0)}</b></p><svg viewBox="0 0 560 120" class="pl-svg" id="${id}Box" role="img" aria-label="신체 활동 수준 박스 플롯"></svg><p class="muted">예시 표의 값도 교과서 데이터처럼 Q1 45, Q3 75가 되게 만들었어요. 빨간 점이 범위를 벗어난 값이에요. 오렌지3 Box Plot은 이런 값을 점 대신 <b>점선</b>으로 길게 이어 보여 줘요.</p>`; }
  if(n===4){ const ys=PL.snap[4].rows.filter(r=>r.out==='Y'); return `<p>식 <span class="mono">0 if 신체 활동 수준 &gt; 120 else 1</span>을 줄마다 계산해 outlier 열을 붙였어요. 120을 넘는 <b>${ys.map(r=>'ID '+r.id+'('+r.v[4]+'분)').join(', ')}</b>만 0번 값 <b>Y</b>, 나머지 ${PL.snap[4].rows.length-ys.length}줄은 1번 값 <b>N</b>이에요 <span class="pl-k out">빨간 줄</span>.</p>`; }
  if(n===5){ const a=PL.before, b=PL.after; const bar=(v,mx)=>`<i style="width:${Math.min(100,v/mx*100)}%"></i>`;
    return `<p><b>outlier is N</b>인 ${b.n}줄만 남겼어요(${a.n} → ${b.n}). 신체 활동 수준의 통계값이 이렇게 바뀌었어요.</p>
      <div class="pl-cmp"><div><span>평균</span><b>${plF(a.m,2)} → ${plF(b.m,2)}</b><div class="pl-bars"><em>전</em>${bar(a.m,80)}<em>후</em>${bar(b.m,80)}</div></div>
      <div><span>흩어진 정도(Dispersion)</span><b>${plF(a.d,2)} → ${plF(b.d,2)}</b><div class="pl-bars"><em>전</em>${bar(a.d,.8)}<em>후</em>${bar(b.d,.8)}</div></div></div>
      <p class="muted">Dispersion은 오렌지3처럼 표준편차 ÷ 평균으로 계산했어요. 큰 이상치 하나가 평균과 흩어진 정도를 함께 부풀리고 있었어요.</p>`; }
  if(n===6){
    let t='<tr><th>속성</th><th>표준화 전 평균</th><th>표준화 전 표준편차</th><th>표준화 전 범위</th><th>표준화 후 평균</th><th>표준화 후 표준편차</th></tr>';
    PL_NUM.forEach(k=>{const s=PL.std[k], z=PL.snap[6].rows.map(r=>r.v[k]); t+=`<tr><td>${PL_COLS[k]}</td><td>${plF(s.m,2)}</td><td>${plF(s.sd,2)}</td><td>${s.min} ~ ${s.max} ${PL_UNIT[k]}</td><td class="z">${plF(Math.abs(plMean(z))<5e-4?0:plMean(z),2)}</td><td class="z">${plF(plSd(z),2)}</td></tr>`;});
    const ids=PL.snap[6].rows.map(r=>r.id);
    return `<p>다섯 속성을 <b>(값 − 평균) ÷ 표준편차</b>로 바꾸었어요. 이제 모든 속성의 평균은 0, 표준편차는 1이에요.</p><div class="pl-tscroll"><table class="pl-tbl pl-stat">${t}</table></div>
      <div class="pl-person"><label>한 사람 골라 보기 <select id="${id}Pick">${ids.map(i=>`<option value="${i}"${i===PL.pick?' selected':''}>ID ${i}</option>`).join('')}</select></label><div id="${id}PBox"></div></div>`;
  }
  if(n===7){
    const ho=PL.horder.map(i=>`<tr><td>${i}</td><td>${PL_BMI[i]}</td></tr>`).join('');
    return `<div class="pl-merge"><div><b>작은 건강 표</b> <small class="muted">(ID 17은 없음)</small><div class="pl-tscroll pl-hsc"><table class="pl-tbl pl-mini"><tr><th>ID</th><th>BMI 범주</th></tr>${ho}</table></div>
      <button class="btn ghost sm" id="${id}Shuf">${PL.shuf?'건강 표 원래 순서로':'건강 표 줄 순서 섞기'}</button></div>
      <div><b>맞추는 기준 (Row matching)</b><div class="row pl-mbtn"><button class="btn sm ${PL.match==='id'?'':'ghost'}" data-m="id">Person ID ↔ Person ID</button><button class="btn sm ${PL.match==='row'?'':'ghost'}" data-m="row">Row index (줄 순서)</button></div>
      <p>${PL.bad?`<span class="ng">${PL.bad}줄에 다른 사람의 BMI가 붙었어요.</span> 줄 순서로 맞추면 두 표의 순서가 다를 때 엉뚱한 값이 붙어요. Person ID로 맞춰 보세요.`:`<span class="ok">19줄 모두 같은 사람의 BMI가 붙었어요.</span> ${PL.match==='row'?'지금은 두 표의 줄 순서가 같아서 Row index로도 맞았어요. 건강 표의 줄 순서를 섞어 보세요.':'Person ID로 맞추면 줄 순서가 달라도 같은 사람끼리 이어져요.'}`}</p></div></div>`;
  }
  if(n===8) return `<div class="grid2 even pl-plots"><div><b>수면의 질 × 스트레스 수준 (산점도)</b><svg viewBox="0 0 300 250" class="pl-svg" id="${id}Sc" role="img" aria-label="수면의 질과 스트레스 수준 산점도"></svg></div><div><b>BMI 범주별 수면의 질 (박스 플롯)</b><svg viewBox="0 0 300 250" class="pl-svg" id="${id}Bp" role="img" aria-label="BMI 범주별 수면의 질 박스 플롯"></svg></div></div><p class="muted">두 그래프 모두 표준화한 값이에요. 0보다 크면 19명 평균보다 높다는 뜻이에요. 겹친 점은 조금씩 비켜 그렸어요.</p>${PL.bad?'<p class="ng">지금은 잘못 붙은 BMI가 있어 박스 플롯이 정확하지 않아요.</p>':''}`;
  return '';
}

/* 상자 하나 그리기 */
function plRender(id){
  const [a,b]=PL_BOX[id], B=$(id); if(!B) return;
  const lv=Math.min(PL.done,b), sn=PL.snap[lv];
  let btns='';
  for(let n=a;n<=b;n++){ const ok=PL.done>=n; btns+=`<button class="btn sm ${ok?'ghost pl-ok':''}" data-n="${n}"${ok?' disabled':''}>${ok?'✓ ':''}${PL_STEP[n]}</button>`; }
  const show=PL.done>=a?Math.min(PL.done,b):0;
  const intro={plA:'<b>① 살펴보기</b>부터 눌러 시작해요. 표의 <span class="pl-k miss">?</span>는 비어 있는 칸이에요.',plB:'01에서 결측치를 채운 표로 이어서 해요. <b>③ 박스 플롯</b>부터 눌러요.',plC:'이상치를 뺀 19줄로 이어서 해요. <b>⑥ 표준화</b>를 눌러요.',plD:'표준화한 표로 이어서 해요. <b>⑦ 건강 표와 합치기</b>를 눌러요.'}[id];
  B.innerHTML=`<div class="row pl-steps">${btns}<button class="btn ghost sm" data-r="1">처음부터 다시</button></div>
    ${PL.auto&&PL.auto===id?`<p class="pl-auto">앞 화면의 단계는 자동으로 해 두었어요.</p>`:''}
    <div class="pl-out">${show?(id==='plD'&&show===8?plPanel(7,id)+plPanel(8,id):plPanel(show,id)):`<p>${intro}</p>`}</div>
    ${plTable(sn,lv)}`;
  B.querySelectorAll('[data-n]').forEach(x=>x.onclick=()=>{ const n=+x.dataset.n; const from=plRunTo(n-1); PL.auto=(from<a-1)?id:''; plStep(n); plAll(); });
  B.querySelector('[data-r]').onclick=()=>{ plReset(); plAll(); };
  if(show===3) plBoxSvg($(id+'Box'));
  if(show===6){ const s=$(id+'Pick'); s.onchange=()=>{PL.pick=+s.value; plPerson(id);}; if(!PL.snap[6].rows.some(r=>r.id===PL.pick)) PL.pick=PL.snap[6].rows[0].id; plPerson(id); }
  if(show>=7){ plBindMerge(id); }   /* 합치는 기준은 ⑧ 뒤에도 바꿀 수 있게 */
  if(show===8){ plPlots(id); }
}
function plBindMerge(id){
  const B=$(id);
  const sh=$(id+'Shuf'); if(sh) sh.onclick=()=>{ PL.shuf=!PL.shuf; PL.horder=Object.keys(PL_BMI).map(Number); if(PL.shuf){ PL.horder=[12,3,19,7,1,15,20,5,9,13,2,18,10,6,16,4,8,14,11]; } plMerge(); PL.snap[PL.done]=plCopy(); plAll(); };
  B.querySelectorAll('[data-m]').forEach(x=>x.onclick=()=>{ PL.match=x.dataset.m; plMerge(); PL.snap[PL.done]=plCopy(); plAll(); });
}

/* ③ 박스 플롯 (가로, 0~250분) */
function plBoxSvg(S){
  if(!S) return; const b=PL.box, vals=PL.snap[3].rows.map(r=>r.v[4]);
  const X=v=>30+v/250*500, y=48;
  for(let v=0;v<=250;v+=50){ el('line',{x1:X(v),x2:X(v),y1:16,y2:86,class:'gl'},S); el('text',{x:X(v),y:102,class:'tk','text-anchor':'middle'},S,v); }
  el('text',{x:530,y:116,class:'tk','text-anchor':'end'},S,'신체 활동 수준(분)');
  [b.lo,b.hi].forEach((v,i)=>{ el('line',{x1:X(v),x2:X(v),y1:12,y2:88,class:'pl-bound'},S); el('text',{x:X(v)+(i?4:4),y:12,class:'pl-bl'},S,(i?'상한 ':'하한 ')+plF(v,0)); });
  const inn=vals.filter(v=>v>=b.lo&&v<=b.hi), wl=Math.min(...inn), wh=Math.max(...inn);
  el('line',{x1:X(wl),x2:X(b.q1),y1:y,y2:y,class:'pl-wh'},S); el('line',{x1:X(b.q3),x2:X(wh),y1:y,y2:y,class:'pl-wh'},S);
  el('rect',{x:X(b.q1),y:y-16,width:X(b.q3)-X(b.q1),height:32,class:'pl-bx'},S);
  el('line',{x1:X(b.med),x2:X(b.med),y1:y-16,y2:y+16,class:'pl-md'},S);
  vals.filter(v=>v<b.lo||v>b.hi).forEach(v=>{ el('circle',{cx:X(v),cy:y,r:6,class:'pl-op'},S); el('text',{x:X(v),y:y-12,class:'pl-bl','text-anchor':'middle'},S,v); });
}
/* ⑥ 한 사람 비교 */
function plPerson(id){
  const raw=PL.snap[6].rows.find(r=>r.id===PL.pick); if(!raw) return;
  const row=k=>{ const z=raw.v[k], w=Math.min(Math.abs(z),2.5)/2.5*50; return `<div class="pl-pr"><span>${PL_COLS[k]}</span><b>${k===2?plF(raw.raw[k],2):raw.raw[k]} ${PL_UNIT[k]}</b><div class="pl-zb"><i class="${z<0?'neg':''}" style="${z<0?`right:50%;width:${w}%`:`left:50%;width:${w}%`}"></i><em></em></div><b class="z">${z>0?'+':''}${plF(z,2)}</b></div>`; };
  $(id+'PBox').innerHTML=`<div class="pl-ph"><span>속성</span><span>원래 값</span><span>표준화 값 (가운데 = 평균 0)</span><span></span></div>${PL_NUM.map(row).join('')}<p class="muted" style="margin:6px 0 0">원래 값은 단위가 달라 「9점」과 「8000걸음」 중 무엇이 더 높은 편인지 바로 알 수 없어요. 표준화 값은 모두 「평균에서 표준편차 몇 개만큼 떨어졌는지」라 나란히 견줄 수 있어요.</p>`;
}
/* ⑧ 산점도 · 박스 플롯 */
function plPlots(id){
  const rows=PL.snap[Math.min(PL.done,8)].rows;
  const S=$(id+'Sc'), X=v=>40+(v+2.5)/5*245, Y=v=>215-(v+2.5)/5*200;
  for(let v=-2;v<=2;v++){ el('line',{x1:X(v),x2:X(v),y1:15,y2:215,class:'gl'},S); el('line',{x1:40,x2:285,y1:Y(v),y2:Y(v),class:'gl'},S); el('text',{x:X(v),y:230,class:'tk','text-anchor':'middle'},S,v); el('text',{x:34,y:Y(v)+4,class:'tk','text-anchor':'end'},S,v); }
  el('text',{x:162,y:246,class:'axl','text-anchor':'middle'},S,'수면의 질 (표준화)'); el('text',{x:44,y:12,class:'axl'},S,'스트레스 수준 (표준화)');
  const seen={};
  rows.forEach(r=>{ const k=r.v[3].toFixed(3)+'|'+r.v[5].toFixed(3); const n=seen[k]=(seen[k]||0)+1; const dx=((n-1)%3-1)*5, dy=Math.floor((n-1)/3)*5; el('circle',{cx:X(r.v[3])+dx,cy:Y(r.v[5])+dy,r:5,class:'pl-pt'},S); });
  const P=$(id+'Bp'), G=['정상','과체중','비만'], BX=v=>70+(v+2.5)/5*215;
  for(let v=-2;v<=2;v++){ el('line',{x1:BX(v),x2:BX(v),y1:15,y2:200,class:'gl'},P); el('text',{x:BX(v),y:216,class:'tk','text-anchor':'middle'},P,v); }
  el('text',{x:178,y:236,class:'axl','text-anchor':'middle'},P,'수면의 질 (표준화)');
  G.forEach((g,i)=>{ const a=rows.filter(r=>PL.bmi[r.id]===g).map(r=>r.v[3]); const y=45+i*60; el('text',{x:62,y:y+4,class:'tk','text-anchor':'end'},P,g+` (${a.length})`); if(!a.length) return;
    const q1=plQ(a,.25), q3=plQ(a,.75), md=plQ(a,.5);
    el('line',{x1:BX(Math.min(...a)),x2:BX(Math.max(...a)),y1:y,y2:y,class:'pl-wh'},P);
    el('rect',{x:BX(q1),y:y-13,width:Math.max(2,BX(q3)-BX(q1)),height:26,class:'pl-bx'},P);
    el('line',{x1:BX(md),x2:BX(md),y1:y-13,y2:y+13,class:'pl-md'},P);
    a.forEach((v,j)=>el('circle',{cx:BX(v),cy:y+18+(j%3)*3,r:2.5,class:'pl-dot'},P));
  });
}
function plAll(){ Object.keys(PL_BOX).forEach(plRender); }
plReset(); plAll();

/* 02 Formula 식 읽기 */
(function(){
  const r=$('plFx'), o=$('plFxOut'), B=$('plFxBox');
  function draw(){
    const v=+r.value, c=v>120; o.textContent=v;
    B.innerHTML=`<div class="pl-fxr"><span>조건</span><b>${v} &gt; 120</b><em class="${c?'t':'f'}">${c?'참':'거짓'}</em></div>
      <div class="pl-fxr"><span>식의 결과</span><b>${c?'0':'1'}</b><em>${c?'조건이 참이면 if 앞의 값':'조건이 거짓이면 else 뒤의 값'}</em></div>
      <div class="pl-fxr"><span>outlier 값</span><b class="${c?'ng':'ok'}">${c?'Y':'N'}</b><em>Values의 ${c?'0번':'1번'} 값 → ${c?'이상치':'이상치 아님'}</em></div>`;
  }
  r.oninput=draw; draw();
})();

/* 흐름도 (오렌지3 화면을 캡처하지 않고 새로 그림) — 교과서 78쪽 ows의 위젯·연결을 바탕으로 */
function plFlow(svgId,tblId,W,H,nodes,edges){
  const col={D:'#f2b84b',T:'#f0875a',V:'#ef8fa0',P:'#c4c9d1'}, BW=174, BH=48, N={};
  nodes.forEach(n=>N[n.s]=n);
  let g=`<defs><marker id="${svgId}A" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#8a94a3"/></marker></defs>`;
  edges.forEach(([a,b,lab,dy])=>{
    const p=N[a], q=N[b], x1=p.x+BW, y1=p.y+BH/2, x2=q.x-2, y2=q.y+BH/2+(dy||0);
    g+=`<path d="M${x1} ${y1}C${x1+40} ${y1} ${x2-40} ${y2} ${x2} ${y2}" class="fe" marker-end="url(#${svgId}A)"/>`;
    if(lab) g+=`<text x="${x2-12}" y="${dy>0?y2+15:y2-7}" class="fl">${lab}</text>`;
  });
  nodes.forEach(n=>{
    const num=n.c==='P'?'':n.s;
    g+=`<g class="fn${n.c==='P'?' prev':''}" data-s="${n.s}" tabindex="0"><rect x="${n.x}" y="${n.y}" width="${BW}" height="${BH}" rx="10" class="fb" style="stroke:${col[n.c]}"/><rect x="${n.x}" y="${n.y}" width="28" height="${BH}" rx="10" fill="${col[n.c]}"/><rect x="${n.x+18}" y="${n.y}" width="10" height="${BH}" fill="${col[n.c]}"/><text x="${n.x+14}" y="${n.y+29}" class="fnum">${num}</text><text x="${n.x+36}" y="${n.y+(n.sub?20:29)}" class="ft">${n.t}</text>${n.sub?`<text x="${n.x+36}" y="${n.y+37}" class="fs">${n.sub}</text>`:''}</g>`;
  });
  const S=$(svgId); S.setAttribute('viewBox',`0 0 ${W} ${H}`); S.style.minWidth=Math.min(W,860)+'px'; S.style.maxWidth=Math.round(W*1.1)+'px'; S.innerHTML=g;
  const pick=s=>{
    S.querySelectorAll('.fn').forEach(x=>x.classList.toggle('on',x.dataset.s===s));
    $(tblId).querySelectorAll('tr[data-s]').forEach(tr=>tr.classList.toggle('hl',tr.dataset.s===s));
    const tr=$(tblId).querySelector(`tr[data-s="${s}"]`); if(tr) tr.scrollIntoView({behavior:'smooth',block:'nearest'});
  };
  S.querySelectorAll('.fn:not(.prev)').forEach(x=>{x.onclick=()=>pick(x.dataset.s); x.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(x.dataset.s);}};});
  $(tblId).querySelectorAll('tr[data-s]').forEach(tr=>tr.onclick=()=>pick(tr.dataset.s));
}
plFlow('plFlow1','plSet1',650,240,[
  {s:1,t:'File',sub:'Sleep.csv',c:'D',x:10,y:96},
  {s:2,t:'Data Table',sub:'? 칸 찾기',c:'D',x:240,y:12},{s:3,t:'Column Statistics',sub:'결측치 확인',c:'D',x:240,y:96},{s:4,t:'Impute',sub:'평균으로 채우기',c:'T',x:240,y:180},
  {s:5,t:'Data Table (1)',sub:'7.132 확인',c:'D',x:466,y:180}
],[[1,2],[1,3],[1,4],[4,5]]);
plFlow('plFlow2','plSet2',870,300,[
  {s:'p',t:'Impute',sub:'① 흐름도에서',c:'P',x:10,y:120},
  {s:1,t:'Box Plot',sub:'상한값 120 확인',c:'V',x:230,y:20},
  {s:2,t:'Formula',sub:'outlier Y/N 표시',c:'T',x:230,y:160},
  {s:3,t:'Data Table (2)',sub:'Y 1개 확인',c:'D',x:450,y:100},{s:4,t:'Select Rows',sub:'outlier is N',c:'T',x:450,y:200},
  {s:5,t:'Data Table (3)',sub:'373줄',c:'D',x:680,y:160},{s:6,t:'Column Statistics (1)',sub:'전후 비교',c:'D',x:680,y:240}
],[['p',1],['p',2],[2,3],[2,4],[4,5],[4,6]]);
plFlow('plFlow3','plSet3',1080,320,[
  {s:'p',t:'Select Rows',sub:'② 흐름도에서',c:'P',x:10,y:130},
  {s:1,t:'Select Columns',sub:'표준화할 5개',c:'T',x:230,y:40},{s:2,t:'Preprocess',sub:'Standardize',c:'T',x:450,y:40},{s:3,t:'Data Table (4)',sub:'표준화 결과',c:'D',x:670,y:10},
  {s:4,t:'Select Columns (1)',sub:'나머지 6개',c:'T',x:230,y:220},{s:5,t:'Merge Data',sub:'Row index 그대로',c:'T',x:670,y:170},
  {s:6,t:'Data Table (5)',sub:'11개 속성',c:'D',x:895,y:100},{s:7,t:'Save Data',sub:'Sleep_clean.csv',c:'D',x:895,y:180},{s:8,t:'Column Statistics (2)',sub:'평균 0 확인',c:'D',x:895,y:260}
],[['p',1],['p',4],[1,2],[2,3],[4,5,'Data',10],[2,5,'Extra Data',-10],[5,6],[5,7],[5,8]]);
plFlow('plFlow4','plSet4',700,320,[
  {s:1,t:'수면',sub:'File · Sleep_clean.csv',c:'D',x:10,y:50},{s:2,t:'건강',sub:'File · Health.csv',c:'D',x:10,y:200},
  {s:3,t:'Merge Data (1)',sub:'Person ID 기준',c:'T',x:250,y:125},
  {s:4,t:'Data Table (6)',sub:'14개 속성',c:'D',x:500,y:12},{s:5,t:'Scatter Plot',sub:'수면의 질 × 스트레스',c:'V',x:500,y:90},{s:6,t:'Box Plot (1)',sub:'BMI별 수면의 질',c:'V',x:500,y:168},{s:7,t:'Save Data (1)',sub:'Sleep_Health_merge.csv',c:'D',x:500,y:246}
],[[1,3,'Data',-10],[2,3,'Extra Data',10],[3,4],[3,5],[3,6],[3,7]]);

/* 진행 체크 · 준비 */
chips('plReady','readyPick',['오렌지3 실행','Sleep.csv 내려받기','Health.csv 내려받기'],true);
chips('plDone1','done1Pick',['File로 불러오기','결측치 ? 찾기','Impute로 평균 채우기','7.132 확인'],true);
chips('plDone2','done2Pick',['Box Plot으로 상한값 확인','Formula로 outlier 만들기','Select Rows로 N만 남기기','Column Statistics로 전후 비교'],true);
chips('plDone3','done3Pick',['Select Columns 두 개로 나누기','5개 속성 표준화','Merge Data로 다시 합치기','Sleep_clean.csv 저장'],true);
chips('plDone4','done4Pick',['건강 데이터와 Person ID로 합치기','산점도·박스 플롯 그리기','Sleep_Health_merge.csv 저장'],true);

/* 04 (선택) 코드 줄 ↔ 오렌지3 위젯 */
sorter('plPair',{
  cats:[{n:'File',k:'#c98a00'},{n:'Impute',k:'#e0702b'},{n:'Select Rows',k:'#d64535'},{n:'Preprocess',k:'#9b4fc4'},{n:'Merge Data',k:'#2f6fd0'},{n:'그래프 위젯',k:'#1f9d74'}],
  items:[
    {t:'<span class="mono">data = pd.read_csv(\'/content/Sleep.csv\')</span>',short:'read_csv',c:0,ic:'📂',w:'파일을 읽어 표(데이터프레임)로 만들어요.'},
    {t:'<span class="mono">data[\'Sleep Duration\'].fillna(data[\'Sleep Duration\'].mean())</span>',short:'fillna(mean)',c:1,ic:'🩹',w:'빈칸(NaN)을 평균값으로 채워요. Impute의 Average/Most frequent와 같아요.'},
    {t:'<span class="mono">data = data[data[\'Physical Activity Level\'] &lt;= 120]</span>',short:'조건으로 줄 고르기',c:2,ic:'🔎',w:'조건에 맞는 줄만 남겨요. 오렌지3에서는 Formula로 표시한 뒤 Select Rows로 골랐어요.'},
    {t:'<span class="mono">scaler.fit_transform(data[columns_to_standardize])</span>',short:'StandardScaler',c:3,ic:'⚖️',w:'평균 0, 표준편차 1이 되도록 바꾸는 표준화예요. Preprocess의 Standardize와 같아요.'},
    {t:'<span class="mono">pd.merge(data, data_health, on=\'Person ID\')</span>',short:'pd.merge',c:4,ic:'🔗',w:'Person ID가 같은 줄끼리 이어 붙여요.'},
    {t:'<span class="mono">plt.scatter(merged_data[\'Quality of Sleep\'], merged_data[\'Stress Level\'])</span>',short:'plt.scatter',c:5,ic:'📈',w:'두 수치형 속성의 산점도를 그려요. Scatter Plot 위젯과 같아요.'},
    {t:'<span class="mono">merged_data.boxplot(column=\'Sleep Duration\', by=\'BMI Category\')</span>',short:'boxplot',c:5,ic:'📦',w:'범주별 박스 플롯을 그려요. Box Plot 위젯과 같아요.'}
  ],
  end:'<b>정리</b> 오렌지3는 위젯을 이어서, 파이썬은 코드 줄을 이어서 같은 순서(불러오기 → 결측치 → 이상치 → 표준화 → 통합 → 시각화)로 데이터를 준비해요.'
});

/* 05 (선택) 개념 빈칸 · 성취도 · 실력 점검 */
document.querySelectorAll('.pl-blanks .blank').forEach(b=>b.onclick=()=>{b.textContent=b.dataset.a; b.classList.add('on');});
chips('plSelf','selfCheckPick',['이상치와 결측치를 찾아 처리할 수 있다','단위가 다른 속성을 표준화할 수 있다','두 데이터를 같은 열 기준으로 합칠 수 있다','목적에 맞는 그래프로 시각화할 수 있다'],true);
chips('plLevel','levelPick',['데이터 전처리의 개념과 필요성을 이해하였다','데이터를 전처리하고 분석을 위해 시각화할 수 있다','데이터를 편향되지 않게 수집하는 자세와 그 중요성을 알게 되었다'],true);

/* 05 내 계획 점검: 이 단원 처음(62쪽 u2-collect, 70쪽 u2-clean)에 적은 나의 계획 — 읽기만 함 */
(function(){
  const rd=(lid,key)=>{ try{ return String((store.get('ds-'+lid+'-memo'+WHO.sfx,{})||{})[key]||'').trim(); }catch(e){ return ''; } };
  const p62=rd('u2-collect','planLearn'), p70=rd('u2-clean','plan');
  const box=(t,v)=>v?`<b>${t}</b><span>${esc(v)}</span>`:'';
  $('plPrev').innerHTML=(box('「데이터 준비」 처음(62쪽)에 적은 나의 계획',p62)+box('「데이터 전처리와 시각화」 처음(70쪽)에 적은 나의 계획',p70))||'<span class="muted">이 기기에 저장된 62·70쪽 계획 메모가 없어요. 기억나는 대로 떠올려 점검해요.</span>';
})();

/* 06 마무리 */
const MEMOLIST=[['planOrder','처음 생각: 손볼 순서'],['readyPick','실습 준비'],['missWhy','결측치를 평균으로 채운 과정과 지우는 방법과의 차이'],['done1Pick','진행 체크 ① 불러오기 · 결측치'],['outlierSteps','이상치 기준 · Formula · 전후 통계값'],['done2Pick','진행 체크 ② 이상치'],['stdWhy','표준화 전과 후 비교'],['vizMemo','그래프에서 알게 된 점'],['done3Pick','진행 체크 ③-1 표준화 후 통합 · 저장'],['done4Pick','(선택) 진행 체크 ③-2 건강 데이터와 합쳐 시각화'],['pyNote','(선택) 파이썬으로 해 보니'],['teamInfo','(선택) 함께 해결하기 1 데이터 정보'],['teamClean','(선택) 함께 해결하기 2 결측치·이상치 처리'],['teamViz','(선택) 함께 해결하기 3 목적과 시각화'],['teamCompare','(선택) 함께 해결하기 4 짝과 비교'],['selfCheckPick','(선택) 성취도 평가'],['capPre','(선택) 역량 키우기 1 전처리와 중요성'],['capClean','(선택) 역량 키우기 2 결측치·이상치 처리 방법'],['capBias','(선택) 역량 키우기 3 편향 없는 수집'],['levelPick','(선택) 내 실력 점검'],['supMemo','(선택) 보충: 성별·BMI별 수면 장애'],['advMemo','(선택) 심화: 심박수와 수면 장애'],['planCheck','(선택) 나의 계획 점검'],['newLearn','(선택) 새롭게 알게 된 점'],['keyQ','오늘의 질문에 대한 내 답']];
/* (선택) 항목은 쓴 것만 모아 보기에 보이기 */
onShow[6]=()=>memoSummary('msum',MEMOLIST.filter(([k,l])=>!l.startsWith('(선택)')||String(MEMO[k]||'').trim()));

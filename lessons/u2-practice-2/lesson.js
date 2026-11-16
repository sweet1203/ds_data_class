/* u2-practice-2 데이터 분석의 실제 ② 분석과 해석 · 정리 (교과서 108~115쪽) */

/* 도시별 평균 — 캐글 「Airbnb Prices European Cities(Merged)」 51,707개 숙소를 도시별로 묶은 집계값(오렌지3 파이썬으로 원본 csv에서 계산, 교과서 106·112쪽 값과 대조함).
   lat·lon: 도시 중심의 위도·경도(널리 알려진 공개값). 생활비(NUMBEO) 값은 싣지 않고 학생이 입력한다. */
const PB_ATTR=[
  {k:'charge',ko:'1인당 숙박비',en:'charge - Mean',up:false},
  {k:'realSum',ko:'총 숙박비',en:'realSum - Mean',up:false},
  {k:'person_capacity',ko:'숙박 인원',en:'person_capacity - Mean',up:true},
  {k:'cleanliness_rating',ko:'청결도',en:'cleanliness_rating - Mean',up:true},
  {k:'guest_satisfaction_overall',ko:'고객 만족도',en:'guest_satisfaction_overall - Mean',up:true},
  {k:'bedrooms',ko:'침실 수',en:'bedrooms - Mean',up:true},
  {k:'dist',ko:'도심 거리',en:'dist - Mean',up:false},
  {k:'metro_dist',ko:'지하철 거리',en:'metro_dist - Mean',up:false},
  {k:'col',ko:'생활비 지수',en:'Cost of Living Index (내가 입력)',up:false}
];
const PB_CITY=[
  {k:'Amsterdam',ko:'암스테르담',country:'Netherlands',lat:52.3676,lon:4.9041,realSum:573.1128,person_capacity:2.7817,cleanliness_rating:9.4659,guest_satisfaction_overall:94.5144,bedrooms:1.2923,dist:2.8251,metro_dist:1.0894,charge:205.7859},
  {k:'Athens',ko:'아테네',country:'Greece',lat:37.9838,lon:23.7275,realSum:151.7441,person_capacity:3.6981,cleanliness_rating:9.6384,guest_satisfaction_overall:95.0036,bedrooms:1.2714,dist:1.8031,metro_dist:0.4787,charge:44.6259},
  {k:'Barcelona',ko:'바르셀로나',country:'Spain',lat:41.3874,lon:2.1686,realSum:293.7537,person_capacity:2.6167,cleanliness_rating:9.2916,guest_satisfaction_overall:91.1091,bedrooms:1.1613,dist:2.117,metro_dist:0.4412,charge:112.1393},
  {k:'Berlin',ko:'베를린',country:'Germany',lat:52.52,lon:13.405,realSum:244.5838,person_capacity:2.775,cleanliness_rating:9.4618,guest_satisfaction_overall:94.3237,bedrooms:1.0705,dist:5.2571,metro_dist:0.8361,charge:92.3438},
  {k:'Budapest',ko:'부다페스트',country:'Hungary',lat:47.4979,lon:19.0402,realSum:176.5135,person_capacity:3.5408,cleanliness_rating:9.4774,guest_satisfaction_overall:94.5853,bedrooms:1.1057,dist:1.8728,metro_dist:0.5441,charge:53.5769},
  {k:'Lisbon',ko:'리스본',country:'Portugal',lat:38.7223,lon:-9.1393,realSum:238.2105,person_capacity:3.3434,cleanliness_rating:9.3706,guest_satisfaction_overall:91.0939,bedrooms:1.2724,dist:1.9669,metro_dist:0.7115,charge:75.274},
  {k:'London',ko:'런던',country:'UnitedKingdom',lat:51.5072,lon:-0.1276,realSum:362.4693,person_capacity:2.8462,cleanliness_rating:9.175,guest_satisfaction_overall:90.6457,bedrooms:1.1288,dist:5.3264,metro_dist:1.0055,charge:126.6715},
  {k:'Paris',ko:'파리',country:'France',lat:48.8566,lon:2.3522,realSum:392.5314,person_capacity:2.9536,cleanliness_rating:9.2636,guest_satisfaction_overall:92.0375,bedrooms:0.9728,dist:2.9958,metro_dist:0.2273,charge:137.5011},
  {k:'Rome',ko:'로마',country:'Italy',lat:41.9028,lon:12.4964,realSum:205.3919,person_capacity:3.3574,cleanliness_rating:9.5147,guest_satisfaction_overall:93.1223,bedrooms:1.2298,dist:3.027,metro_dist:0.8198,charge:65.3534},
  {k:'Vienna',ko:'비엔나',country:'Austria',lat:48.2082,lon:16.3738,realSum:241.5825,person_capacity:3.3503,cleanliness_rating:9.4724,guest_satisfaction_overall:93.7311,bedrooms:1.1023,dist:3.1395,metro_dist:0.5267,charge:78.8134}
];
const pbFix=(v,d)=>Number(v).toLocaleString('ko-KR',{minimumFractionDigits:d,maximumFractionDigits:d});

/* 학생이 입력한 생활비 지수 (02에서 입력, 03·04·05에서 씀) */
function pbColGet(){
  const o={}; String(MEMO.colVals||'').split(' · ').forEach(p=>{const m=p.match(/^([A-Za-z]+) (.+)$/); if(m) o[m[1]]=m[2];});
  return o;
}
const pbNum=s=>{const t=String(s==null?'':s).replace(/,/g,'').trim(); return t===''?NaN:Number(t);};
function pbVal(c,k){ if(k==='col') return pbNum(pbColGet()[c.k]); return c[k]; }
const pbColCount=()=>PB_CITY.filter(c=>!isNaN(pbVal(c,'col'))).length;
let pbOnCol=[];   /* 생활비 지수가 바뀌면 다시 그릴 체험들 */

/* 0 시작: 지난 시간(u2-practice-1)에 적은 기준 보여 주기 — 읽기만 함 */
(function(){
  let m={}; try{ m=store.get('ds-u2-practice-1-memo'+WHO.sfx,{})||{}; }catch(e){ m={}; }
  const a=String(m.planCrit||'').trim(), b=String(m.planTrip||'').trim();
  const h=(a?`<b>지난 시간에 고른 나의 기준</b><span>${esc(a)}</span>`:'')+(b?`<b>가장 중요한 기준</b><span>${esc(b)}</span>`:'');
  $('pbPrev').innerHTML=h; $('pbPrev').style.display=h?'':'none';
})();

/* 위젯 연결 흐름도 (오렌지3 화면을 캡처하지 않고 새로 그림) — 교과서 ows 「데이터 분석의 실제(103쪽)」의 연결과 같게 */
function pbDrawFlow(svgId,tblId,W,H,nodes,edges){
  const col={D:'#f2b84b',T:'#f0875a',V:'#ef8fa0',U:'#8fb4e8'}, BW=176, BH=48, N={};
  nodes.forEach(n=>N[n.s]=n);
  let g=`<defs><marker id="${svgId}A" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#8a94a3"/></marker></defs>`;
  edges.forEach(([a,b,lab,dy])=>{
    const p=N[a], q=N[b], x1=p.x+BW, y1=p.y+BH/2, x2=q.x-2, y2=q.y+BH/2+(dy||0);
    g+=`<path d="M${x1} ${y1}C${x1+40} ${y1} ${x2-40} ${y2} ${x2} ${y2}" class="fe" marker-end="url(#${svgId}A)"/>`;
    if(lab) g+=`<text x="${x2-12}" y="${dy>0?y2+15:y2-7}" class="fl">${lab}</text>`;
  });
  nodes.forEach(n=>{
    g+=`<g class="fn${n.done?' dn':''}" data-s="${n.s}" tabindex="0"><rect x="${n.x}" y="${n.y}" width="${BW}" height="${BH}" rx="10" class="fb" style="stroke:${col[n.c]}"/><rect x="${n.x}" y="${n.y}" width="28" height="${BH}" rx="10" fill="${col[n.c]}"/><rect x="${n.x+18}" y="${n.y}" width="10" height="${BH}" fill="${col[n.c]}"/><text x="${n.x+14}" y="${n.y+29}" class="fnum">${n.s}</text><text x="${n.x+36}" y="${n.y+(n.sub?20:29)}" class="ft">${n.t}</text>${n.sub?`<text x="${n.x+36}" y="${n.y+37}" class="fs">${n.sub}</text>`:''}</g>`;
  });
  const S=$(svgId); S.setAttribute('viewBox',`0 0 ${W} ${H}`); S.innerHTML=g;
  const T=$(tblId);
  const pick=s=>{
    S.querySelectorAll('.fn').forEach(x=>x.classList.toggle('on',x.dataset.s===s));
    T.querySelectorAll('tr[data-s]').forEach(tr=>tr.classList.toggle('hl',tr.dataset.s===s));
    const tr=T.querySelector(`tr[data-s="${s}"]`); if(tr) tr.scrollIntoView({behavior:'smooth',block:'nearest'});
  };
  S.querySelectorAll('.fn').forEach(x=>{x.onclick=()=>pick(x.dataset.s); x.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(x.dataset.s);}};});
  T.querySelectorAll('tr[data-s]').forEach(tr=>tr.onclick=()=>pick(tr.dataset.s));
}
pbDrawFlow('pbFlow1','pbSet1',480,180,[
  {s:10,t:'생활비',sub:'File (1)',c:'D',x:10,y:66},
  {s:11,t:'Data Table (3)',c:'D',x:290,y:10},{s:12,t:'Box Plot (1)',sub:'(선택) 나라별 분포',c:'V',x:290,y:120}
],[[10,11],[10,12]]);
pbDrawFlow('pbFlow2','pbSet2',700,200,[
  {s:7,t:'Group by',sub:'지난 시간 · 도시별 평균',c:'T',x:10,y:20,done:true},{s:10,t:'생활비',sub:'File (1)',c:'D',x:10,y:128,done:true},
  {s:13,t:'Merge Data',sub:'city ↔ City',c:'T',x:270,y:74},{s:14,t:'Data Table (4)',sub:'10줄 · 15속성(Mode 열 빼고)',c:'D',x:514,y:74}
],[[7,13,'Data',-8],[10,13,'Extra Data',8],[13,14]]);
pbDrawFlow('pbFlow3','pbSet3',520,190,[
  {s:13,t:'Merge Data',c:'T',x:10,y:70,done:true},
  {s:15,t:'Scatter Plot',sub:'charge × 생활비 지수',c:'V',x:320,y:12},{s:16,t:'Correlations',sub:'고객 만족도 기준',c:'U',x:320,y:128}
],[[13,15],[13,16]]);
pbDrawFlow('pbFlow4','pbSet4',720,80,[
  {s:13,t:'Merge Data',c:'T',x:10,y:16,done:true},{s:17,t:'Preprocess',sub:'Normalize [0, 1]',c:'T',x:262,y:16},{s:18,t:'Heat Map',sub:'Row Annotations: city',c:'V',x:530,y:16}
],[[13,17],[17,18]]);
chips('pbDone1','done1Pick',['생활비 파일 불러오기','이름을 생활비로','Country를 categorical로','Data Table로 174행 확인','(선택) Box Plot'],true);
chips('pbDone2','done2Pick',['Merge Data 연결(Data · Extra Data)','Find matching pairs of rows','city ↔ City로 맞추기','Data Table로 10줄 확인'],true);
chips('pbDone3','done3Pick',['Scatter Plot 축 정하기','Label을 city로','Correlations 연결','만족도 기준 막대 읽기','charge 기준으로 바꿔 읽기'],true);
chips('pbDone4','done4Pick',['Preprocess로 0~1 정규화','Heat Map 연결','Row Annotations를 city로','저장하기(File → Save)'],true);

/* 01 지수 읽기 연습 (예시 값) */
flipCards('pbIdx',[
  {ic:'📈',f:'생활비 지수 120',s:'(예시)',b:'기준 도시(뉴욕)를 100으로 볼 때 생활비가 20%쯤 비싼 편이에요.'},
  {ic:'🏅',f:'Rank 1',s:'순위',b:'174개 도시 가운데 생활비 지수가 가장 높은 도시예요. Rank가 클수록 생활비 지수는 낮아요.',x:'순위는 크기를 재는 값이 아니에요.'}
]);

/* 02 통합 따라 해 보기 */
(function(){
  const EXTRA=[['Dublin','Ireland'],['Madrid','Spain'],['Munich','Germany'],['Oslo','Norway'],['Prague','CzechRepublic'],['Zurich','Switzerland']];
  const RIGHT=PB_CITY.map(c=>({name:c.k,country:c.country,mine:true})).concat(EXTRA.map(e=>({name:e[0],country:e[1],mine:false}))).sort((a,b)=>a.name<b.name?-1:1);
  const ALIAS={Rome:'Roma',Vienna:'Wien'};
  let mode='match', merged=false;
  const nameOf=r=>$('pbMgName').checked&&ALIAS[r.name]?ALIAS[r.name]:r.name;
  function saveCol(o){ MEMO.colVals=PB_CITY.filter(c=>String(o[c.k]||'').trim()!=='').map(c=>`${c.k} ${String(o[c.k]).trim()}`).join(' · '); store.set(MK,MEMO); }
  function drawTables(){
    const col=pbColGet();
    const L=`<div class="pb-mt"><b>🏠 숙소 정보 (Group by 결과)</b><table><tr><th>city</th><th>charge - Mean</th><th>guest_satisfaction<br>_overall - Mean</th></tr>${PB_CITY.map(c=>`<tr><td>${c.k}</td><td>${pbFix(c.charge,2)}</td><td>${pbFix(c.guest_satisfaction_overall,2)}</td></tr>`).join('')}</table></div>`;
    const R=`<div class="pb-mt"><b>🛒 생활비 (174줄 중 일부)</b><table><tr><th>City</th><th>Country</th><th>Cost of Living Index</th></tr>${RIGHT.map(r=>{const nm=nameOf(r), alias=nm!==r.name;
      return `<tr class="${r.mine?'':'ex'}"><td class="${alias?'al':''}">${nm}</td><td>${r.country}</td><td>${r.mine?`<input type="text" inputmode="decimal" data-c="${r.name}" value="${esc(col[r.name]||'')}" placeholder="?" aria-label="${r.name} 생활비 지수">`:'<span class="muted">…</span>'}</td></tr>`;}).join('')}</table></div>`;
    $('pbMg').innerHTML=L+R;
    $('pbMg').querySelectorAll('input[data-c]').forEach(inp=>inp.oninput=()=>{const o=pbColGet(); o[inp.dataset.c]=inp.value; saveCol(o); if(merged) doMerge(true); pbOnCol.forEach(f=>f());});
  }
  function doMerge(quiet){
    merged=true;
    const col=pbColGet(), names=new Map(RIGHT.map(r=>[nameOf(r),r]));
    const rows=[]; const miss=[];
    PB_CITY.forEach(c=>{const r=names.get(c.k); if(r) rows.push([c,r]); else { miss.push(c); if(mode==='append') rows.push([c,null]); }});
    $('pbMgOut').innerHTML=`<table class="pb-mres"><tr><th>city</th><th>charge - Mean</th><th>guest_satisfaction_overall - Mean</th><th>Country</th><th>Cost of Living Index</th></tr>${rows.map(([c,r])=>`<tr class="${r?'':'nm'}"><td>${c.k}</td><td>${pbFix(c.charge,2)}</td><td>${pbFix(c.guest_satisfaction_overall,2)}</td><td>${r?r.country:'?'}</td><td>${r?(String(col[c.k]||'').trim()?esc(col[c.k]):'<span class="muted">(빈칸)</span>'):'?'}</td></tr>`).join('')}</table>`;
    const how=mode==='match'?'<b>Find matching pairs of rows</b>':'<b>Append columns from Extra data</b>';
    let msg=`${how} · 숙소 10줄과 생활비 174줄을 합쳐 <b>${rows.length}줄</b>이 되었어요. `;
    if(miss.length) msg+=mode==='match'?`<span class="ng">${miss.map(c=>c.k).join(', ')}</span>는 생활비 표에서 같은 이름을 찾지 못해 <b>빠졌어요</b>. `:`<span class="ng">${miss.map(c=>c.k).join(', ')}</span>는 짝을 못 찾아 생활비 칸이 <b>?</b>(결측치)가 되었어요. `;
    else msg+=mode==='match'?'두 표에 <b>모두 있는 도시</b>만 짝지어 남고, 생활비 표에만 있는 164개 도시는 들어오지 않아요.':'숙소 표의 줄은 모두 남고, 짝을 찾은 생활비 값이 옆에 붙어요.';
    const blanks=PB_CITY.filter(c=>String(col[c.k]||'').trim()==='').length;
    if(blanks&&!miss.length) msg+=` <span class="muted">(생활비 지수 빈칸 ${blanks}개는 오렌지3 Data Table (4)에서 찾아 채워요)</span>`;
    $('pbMgMsg').innerHTML=msg;
    $('pbMgFix').disabled=!miss.length;
    if(!quiet) $('pbMgOut').scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  $('pbMgMode').innerHTML='<button data-v="match">Find matching pairs of rows</button><button data-v="append">Append columns from Extra data</button>';
  const segDraw=()=>$('pbMgMode').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.v===mode));
  $('pbMgMode').querySelectorAll('button').forEach(b=>b.onclick=()=>{mode=b.dataset.v; segDraw(); if(merged) doMerge(true);});
  $('pbMgName').onchange=()=>{drawTables(); if(merged) doMerge(true);};
  $('pbMgDo').onclick=()=>doMerge(false);
  $('pbMgFix').onclick=()=>{$('pbMgName').checked=false; drawTables(); doMerge(true); $('pbMgMsg').innerHTML+=' <b>도시 이름 표기를 하나로 맞추니 다시 짝을 찾았어요.</b> 연도를 YYYY 형식으로 맞추었던 것(74쪽)처럼, 통합 전에 기준 속성의 형식을 맞춰야 해요.';};
  $('pbMgReset').onclick=()=>{merged=false; $('pbMgOut').innerHTML=''; $('pbMgMsg').innerHTML=''; $('pbMgFix').disabled=true;};
  segDraw(); drawTables();
})();

/* 피어슨 상관계수 */
function pbCorr(xs,ys){
  const n=xs.length; if(n<3) return NaN;
  const mx=xs.reduce((a,b)=>a+b,0)/n, my=ys.reduce((a,b)=>a+b,0)/n;
  let sxy=0,sxx=0,syy=0; for(let i=0;i<n;i++){const dx=xs[i]-mx, dy=ys[i]-my; sxy+=dx*dy; sxx+=dx*dx; syy+=dy*dy;}
  return sxx&&syy?sxy/Math.sqrt(sxx*syy):NaN;
}
const pbRWord=r=>{const a=Math.abs(r); const dir=r>0?'양의 상관관계':'음의 상관관계'; if(a<0.3) return '0에 가까운 편이라 뚜렷한 상관관계가 보이지 않아요'; return dir+(a>=0.7?`예요. ${r>0?'1':'−1'}에 가까운 편이에요`:'예요. 0과 '+(r>0?'1':'−1')+' 사이 중간쯤이에요');};

/* 03 화면 안 산점도 */
(function(){
  const S=$('pbSc'), W=520, H=330, L=64, R=20, T=16, B=48;
  const opt=PB_ATTR.map(a=>`<option value="${a.k}">${a.ko} (${a.en})</option>`).join('');
  $('pbSx').innerHTML=opt; $('pbSy').innerHTML=opt;
  const useCol=()=>{$('pbSx').value='charge'; $('pbSy').value='col';};
  if(pbColCount()>=3) useCol(); else { $('pbSx').value='dist'; $('pbSy').value='charge'; }
  function draw(){
    const kx=$('pbSx').value, ky=$('pbSy').value, ax=PB_ATTR.find(a=>a.k===kx), ay=PB_ATTR.find(a=>a.k===ky);
    const pts=PB_CITY.map(c=>({c,x:pbVal(c,kx),y:pbVal(c,ky)})).filter(p=>!isNaN(p.x)&&!isNaN(p.y));
    S.setAttribute('viewBox',`0 0 ${W} ${H}`); S.innerHTML='';
    if(pts.length<3){
      el('text',{x:W/2,y:H/2,class:'axl','text-anchor':'middle'},S,'생활비 지수를 02에서 3개 도시 이상 입력하면 그려져요');
      $('pbRbar').innerHTML=''; $('pbScMsg').innerHTML='y축이나 x축에 「생활비 지수」를 고르려면 <b>02 통합 따라 해 보기</b>의 빈칸을 먼저 채워요.'; return;
    }
    const xs=pts.map(p=>p.x), ys=pts.map(p=>p.y);
    const pad=(a,b)=>{const d=(b-a)||1; return [a-d*0.08,b+d*0.08];};
    const [x0,x1]=pad(Math.min(...xs),Math.max(...xs)), [y0,y1]=pad(Math.min(...ys),Math.max(...ys));
    const X=v=>L+(v-x0)/(x1-x0)*(W-L-R), Y=v=>H-B-(v-y0)/(y1-y0)*(H-B-T);
    for(let i=0;i<=4;i++){const vx=x0+(x1-x0)*i/4, vy=y0+(y1-y0)*i/4;
      el('line',{x1:X(vx),x2:X(vx),y1:T,y2:H-B,class:'gl'},S); el('text',{x:X(vx),y:H-B+15,class:'tk','text-anchor':'middle'},S,pbFix(vx,vx>=100?0:2));
      el('line',{x1:L,x2:W-R,y1:Y(vy),y2:Y(vy),class:'gl'},S); el('text',{x:L-6,y:Y(vy)+4,class:'tk','text-anchor':'end'},S,pbFix(vy,vy>=100?0:2));}
    el('text',{x:(L+W-R)/2,y:H-10,class:'axl','text-anchor':'middle'},S,ax.en);
    const ty=el('text',{x:14,y:(T+H-B)/2,class:'axl','text-anchor':'middle',transform:`rotate(-90 14 ${(T+H-B)/2})`},S,ay.en);
    pts.forEach(p=>{el('circle',{cx:X(p.x),cy:Y(p.y),r:6,class:'pt'},S); const right=X(p.x)>W-110; el('text',{x:X(p.x)+(right?-9:9),y:Y(p.y)+4,class:'lb','text-anchor':right?'end':'start'},S,p.c.k);});
    const r=pbCorr(xs,ys);
    $('pbRbar').innerHTML=isNaN(r)?'':`<div class="pb-rline"><span>−1</span><div><i style="left:${((r+1)/2*100).toFixed(1)}%"></i><em style="left:50%"></em></div><span>1</span></div>`;
    $('pbScMsg').innerHTML=isNaN(r)?'값이 모두 같아 상관계수를 구할 수 없어요.':`<b>r = ${r.toFixed(2).replace('-','−')}</b> (${pts.length}개 도시) · ${pbRWord(r)}. <span class="muted">(말로 푼 부분은 대략적인 표현이에요)</span>`+(kx===ky?' 같은 속성끼리는 r이 1이에요. 다른 속성을 골라 보세요.':'')+(pts.length<10?' <span class="muted">생활비 지수를 넣은 도시만 그렸어요.</span>':'');
  }
  $('pbSx').onchange=draw; $('pbSy').onchange=draw;
  let touched=false;
  pbOnCol.push(draw); onShow[3]=()=>{ if(pbColCount()>=3&&!touched) useCol(); draw(); };
  $('pbSx').addEventListener('change',()=>{touched=true;}); $('pbSy').addEventListener('change',()=>{touched=true;});
  draw();
})();

/* 04 여행지 히트맵 만들기 */
const PB_HEAT={sel:['cleanliness_rating','guest_satisfaction_overall','dist','charge'],up:{},mode:'norm'};
PB_ATTR.forEach(a=>PB_HEAT.up[a.k]=a.up);
function pbHeatScores(){
  const sel=PB_HEAT.sel.filter(k=>k!=='col'||pbColCount()===10);
  const rng={}; sel.forEach(k=>{const v=PB_CITY.map(c=>pbVal(c,k)); rng[k]=[Math.min(...v),Math.max(...v)];});
  const norm=(c,k)=>{const [a,b]=rng[k]; return b>a?(pbVal(c,k)-a)/(b-a):0;};
  const good=(c,k)=>PB_HEAT.up[k]?norm(c,k):1-norm(c,k);
  const score=c=>sel.length?sel.reduce((s,k)=>s+good(c,k),0)/sel.length:0;
  return {sel,norm,good,score};
}
(function(){
  const pal=['#1f2f86','#2a6fb8','#33a39a','#8fd16a','#f4ee5a'];
  const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
  const colorOf=t=>{t=Math.max(0,Math.min(1,t)); const p=t*(pal.length-1), i=Math.min(pal.length-2,Math.floor(p)), f=p-i, a=hex(pal[i]), b=hex(pal[i+1]); return `rgb(${a.map((v,j)=>Math.round(v+(b[j]-v)*f)).join(',')})`;};
  const MODES=[['raw','정규화 전 값'],['norm','정규화 (0~1)'],['good','좋은 쪽으로 맞추기']];
  $('pbHMode').innerHTML=MODES.map(m=>`<button data-v="${m[0]}">${m[1]}</button>`).join('');
  $('pbHMode').querySelectorAll('button').forEach(b=>b.onclick=()=>{PB_HEAT.mode=b.dataset.v; draw();});
  function pickDraw(){
    const full=pbColCount()===10;
    if(!full) PB_HEAT.sel=PB_HEAT.sel.filter(k=>k!=='col');   /* 02 입력을 지우면 생활비 지수 선택도 풀기 */
    $('pbHPick').innerHTML=PB_ATTR.map(a=>{const dis=a.k==='col'&&!full; return `<label class="${PB_HEAT.sel.includes(a.k)?'on':''}${dis?' dis':''}"><input type="checkbox" data-k="${a.k}" ${PB_HEAT.sel.includes(a.k)?'checked':''} ${dis?'disabled':''}> ${a.ko}${a.k==='col'?(full?' <small>(내가 입력)</small>':' <small>(02에서 10개 도시를 모두 입력하면 쓸 수 있어요)</small>'):''}</label>`;}).join('');
    $('pbHPick').querySelectorAll('input').forEach(i=>i.onchange=()=>{const k=i.dataset.k; PB_HEAT.sel=i.checked?[...PB_HEAT.sel,k]:PB_HEAT.sel.filter(x=>x!==k); PB_HEAT.sel=PB_ATTR.map(a=>a.k).filter(x=>PB_HEAT.sel.includes(x)); draw();});
  }
  function draw(){
    pickDraw();
    $('pbHMode').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.v===PB_HEAT.mode));
    const {sel,norm,good,score}=pbHeatScores(), mode=PB_HEAT.mode;
    if(!sel.length){ $('pbHeat').innerHTML=''; $('pbHLegend').innerHTML=''; $('pbHMsg').innerHTML='속성을 하나 이상 골라요.'; return; }
    let rows=PB_CITY.slice(); if(mode==='good') rows.sort((a,b)=>score(b)-score(a));
    const all=[]; sel.forEach(k=>PB_CITY.forEach(c=>all.push(pbVal(c,k)))); const gmin=Math.min(...all), gmax=Math.max(...all);
    const cell=(c,k)=>{
      let t,txt; const v=pbVal(c,k);
      if(mode==='raw'){ t=gmax>gmin?(v-gmin)/(gmax-gmin):0; txt=pbFix(v,v>=100?1:2); }
      else if(mode==='norm'){ t=norm(c,k); txt=t.toFixed(2); }
      else { t=good(c,k); txt=t.toFixed(2); }
      return `<td style="background:${colorOf(t)};color:${t>0.55?'#16202c':'#fff'}">${txt}</td>`;
    };
    const head=sel.map(k=>{const a=PB_ATTR.find(x=>x.k===k); return `<th>${a.ko}<small>${k==='col'?'Cost of Living Index':a.en.replace(' - Mean','')}</small>${mode==='good'?`<button data-k="${k}" class="pb-dir">${PB_HEAT.up[k]?'클수록 좋음 ↑':'작을수록 좋음 ↓'}</button>`:''}</th>`;}).join('');
    $('pbHeat').innerHTML=`<tr><th>${mode==='good'?'순위 · ':''}city</th>${head}${mode==='good'?'<th>점수<small>평균</small></th>':''}</tr>`+rows.map((c,i)=>`<tr><th>${mode==='good'?(i+1)+'. ':''}${c.ko} <small>${c.k}</small></th>${sel.map(k=>cell(c,k)).join('')}${mode==='good'?`<td class="sc">${score(c).toFixed(2)}</td>`:''}</tr>`).join('');
    $('pbHeat').querySelectorAll('.pb-dir').forEach(b=>b.onclick=()=>{PB_HEAT.up[b.dataset.k]=!PB_HEAT.up[b.dataset.k]; draw();});
    $('pbHLegend').innerHTML=`<span>${mode==='raw'?pbFix(gmin,2):'0'}</span><i style="background:linear-gradient(90deg,${pal.join(',')})"></i><span>${mode==='raw'?pbFix(gmax,2):'1'}</span>`;
    $('pbHMsg').innerHTML=mode==='raw'?'<b>정규화 전 값</b>으로 칠하면 값이 큰 속성(숙박비 등)만 밝고, 청결도처럼 값이 작은 속성은 도시끼리 달라도 모두 같은 색으로 보여요. 「정규화 (0~1)」로 바꿔 보세요.'
      :mode==='norm'?'<b>정규화</b>: 속성마다 (값 − 최솟값) ÷ (최댓값 − 최솟값). 10개 도시 중 가장 작은 값은 0, 가장 큰 값은 1이 돼요. 오렌지3 Heat Map과 같은 방식이에요.'
      :'<b>좋은 쪽으로 맞추기</b>: 「작을수록 좋음」 속성은 1 − 정규화 값으로 바꿔 모든 칸에서 1에 가까울수록 좋게 했어요. 점수는 고른 속성의 평균이에요. 머리글 단추로 방향을 바꿔 보세요.';
  }
  $('pbHSave').onclick=()=>{
    const {sel,score}=pbHeatScores(); if(!sel.length) return;
    const top=PB_CITY.slice().sort((a,b)=>score(b)-score(a)).slice(0,3);
    MEMO.heatRank='기준: '+sel.map(k=>PB_ATTR.find(a=>a.k===k).ko+(PB_HEAT.up[k]?'↑':'↓')).join(' · ')+' → '+top.map((c,i)=>`${i+1}위 ${c.ko}(${score(c).toFixed(2)})`).join(' · ');
    store.set(MK,MEMO);
    $('pbHMsg').innerHTML=`메모에 담았어요: ${esc(MEMO.heatRank)}`;
  };
  pbOnCol.push(draw); onShow[4]=draw;
  draw();
})();

/* 05 (선택) 화면 안 좌표 지도 */
(function(){
  const S=$('pbGeo'), W=620, H=440, lon0=-12, lon1=27, lat0=36, lat1=55, kx=Math.cos(46*Math.PI/180);
  const sx=(W-40)/((lon1-lon0)*kx), sy=(H-40)/(lat1-lat0), s=Math.min(sx,sy);
  const X=lon=>20+(lon-lon0)*kx*s, Y=lat=>20+(lat1-lat)*s;
  const opts=[['none','같게'],['charge','1인당 숙박비'],['cleanliness_rating','청결도'],['guest_satisfaction_overall','고객 만족도'],['dist','도심 거리'],['col','생활비 지수(내가 입력)']];
  $('pbGeoSize').innerHTML=opts.map(o=>`<option value="${o[0]}">${o[1]}</option>`).join('');
  let picked=[];
  const hav=(a,b)=>{const R=6371, r=Math.PI/180, dl=(b.lat-a.lat)*r, dn=(b.lon-a.lon)*r; const h=Math.sin(dl/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dn/2)**2; return 2*R*Math.asin(Math.sqrt(h));};
  function draw(){
    const k=$('pbGeoSize').value;
    S.setAttribute('viewBox',`0 0 ${Math.round(X(lon1)+20)} ${H}`); S.innerHTML='';
    for(let lo=-10;lo<=25;lo+=5){el('line',{x1:X(lo),x2:X(lo),y1:Y(lat1),y2:Y(lat0),class:'gl'},S); el('text',{x:X(lo),y:H-4,class:'tk','text-anchor':'middle'},S,(lo<0?'서경 '+(-lo):'동경 '+lo)+'°');}
    for(let la=40;la<=55;la+=5){el('line',{x1:X(lon0),x2:X(lon1),y1:Y(la),y2:Y(la),class:'gl'},S); el('text',{x:X(lon0)+2,y:Y(la)-3,class:'tk'},S,'북위 '+la+'°');}
    const vals=PB_CITY.map(c=>k==='none'?NaN:pbVal(c,k)), ok=vals.filter(v=>!isNaN(v)), mn=Math.min(...ok), mx=Math.max(...ok);
    if(picked.length>1) for(let i=0;i<picked.length;i++) for(let j=i+1;j<picked.length;j++){const a=PB_CITY[picked[i]], b=PB_CITY[picked[j]]; el('line',{x1:X(a.lon),y1:Y(a.lat),x2:X(b.lon),y2:Y(b.lat),class:'lk'},S);}
    PB_CITY.forEach((c,i)=>{
      const v=vals[i], r=isNaN(v)?7:(mx>mn?7+(v-mn)/(mx-mn)*15:12);
      const g=el('g',{class:'ct'+(picked.includes(i)?' on':''),tabindex:0,role:'button','aria-label':c.ko},S);
      el('circle',{cx:X(c.lon),cy:Y(c.lat),r},g);
      const lp=c.k==='Vienna'?'t':c.k==='London'?'l':'r', lt=c.ko+(isNaN(v)?'':` ${pbFix(v,v>=100?0:1)}`);
      el('text',lp==='t'?{x:X(c.lon),y:Y(c.lat)-r-4,class:'lb','text-anchor':'middle'}:lp==='l'?{x:X(c.lon)-r-3,y:Y(c.lat)+4,class:'lb','text-anchor':'end'}:{x:X(c.lon)+r+3,y:Y(c.lat)+4,class:'lb'},g,lt);
      const f=()=>{picked=picked.includes(i)?picked.filter(x=>x!==i):[...picked,i].slice(-3); draw();};
      g.addEventListener('click',f); g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f();}});
    });
    let msg=k==='col'&&!ok.length?'생활비 지수는 02에서 입력한 도시만 크기가 달라져요. ':'';
    if(picked.length<2) msg+='도시를 눌러 두세 곳을 골라 보세요.';
    else { const pr=[]; for(let i=0;i<picked.length;i++) for(let j=i+1;j<picked.length;j++){const a=PB_CITY[picked[i]], b=PB_CITY[picked[j]]; pr.push(`${a.ko}–${b.ko} 약 ${fmt(Math.round(hav(a,b)/10)*10)}km`);} msg+=`고른 도시: <b>${picked.map(i=>PB_CITY[i].ko).join(', ')}</b> · 직선거리 ${pr.join(' · ')}`; }
    $('pbGeoMsg').innerHTML=msg;
  }
  $('pbGeoSize').onchange=draw;
  pbOnCol.push(draw); onShow[5]=draw;
  draw();
})();

/* 05 (선택) 내 실력 점검 */
chips('pbLevel','levelPick',['탐색적 데이터 분석 방법을 설명할 수 있다','데이터에서 두 속성 간의 상관관계를 분석할 수 있다','데이터의 특성에 따라 알맞은 방식으로 분석하는 태도를 가지고 있다'],true);

/* 06 마무리 */
const MEMOLIST=[['planToday','오늘 확인하고 싶은 질문'],['done1Pick','진행 체크 ③ 생활비 데이터'],['swissNote','(선택) 스위스 도시들의 생활비 지수'],['colVals','오렌지3에서 읽어 입력한 생활비 지수'],['done2Pick','진행 체크 ④ 통합'],['mergeNote','10줄만 남은 까닭과 이름 표기 문제'],['done3Pick','진행 체크 ⑤ 관계 시각화'],['scatterNote','Scatter Plot에서 본 관계'],['corrNote','고객 만족도와 상관이 뚜렷한 속성'],['rCol','스스로 해결하기: charge와 생활비 지수의 상관계수'],['rSat','스스로 해결하기: charge와 고객 만족도의 상관계수'],['selfCorr','스스로 해결하기: 상관관계 분석'],['heatRank','히트맵: 내 기준과 순위'],['heatWhy','히트맵: 1~3위 도시와 판단한 까닭'],['done4Pick','진행 체크 ⑥ 정규화와 히트맵'],['geoCrit','(선택) 모둠원의 기준과 이유'],['geoPick','(선택) 모둠이 정한 여행지 3곳'],['capEda','(선택) 탐색적 분석·기술 통계·상관분석 단계'],['capCorr','(선택) 두 속성의 상관관계 분석'],['capMean','(선택) 평균만으로 비교할 때 놓치는 것'],['levelPick','(선택) 내 실력 점검'],['extraHeart','(선택) 보충: 심장 질환 데이터'],['extraMap','(선택) 심화: 나라별 물가 지도'],['planCheck','(선택) 나의 계획 점검'],['newLearn','(선택) 새롭게 알게 된 점'],['keyQ','오늘의 질문에 대한 내 답']];
/* (선택) 항목은 쓴 것만 모아 보기에 보이기 */
onShow[6]=()=>memoSummary('msum',MEMOLIST.filter(([k,l])=>!l.startsWith('(선택)')||String(MEMO[k]||'').trim()));

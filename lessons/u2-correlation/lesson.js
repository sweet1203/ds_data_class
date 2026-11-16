/* u2-correlation 전용 (co-) */

/* 피어슨 상관계수: 점 [x,y]의 목록 → r (계산할 수 없으면 null) */
function coR(P){
  const n=P.length; if(n<2) return null;
  let mx=0,my=0; P.forEach(p=>{mx+=p[0];my+=p[1];}); mx/=n; my/=n;
  let sxy=0,sxx=0,syy=0;
  P.forEach(p=>{const dx=p[0]-mx, dy=p[1]-my; sxy+=dx*dy; sxx+=dx*dx; syy+=dy*dy;});
  if(sxx<1e-9||syy<1e-9) return null;
  return Math.max(-1,Math.min(1,sxy/Math.sqrt(sxx*syy)));
}
const coFmt=r=>r==null?'–':(r<-0.0049?'−':'')+Math.abs(r).toFixed(2);
const coWord=r=>r==null?'계산할 수 없어요. 점이 2개 이상이고, 가로 값이나 세로 값이 모두 같지 않아야 해요.'
  :r>=0.7?'1에 가까워요 → 뚜렷한 <b>양의 상관관계</b>'
  :r>=0.3?'<b>양의 상관관계</b>가 보여요'
  :r>-0.3?'0에 가까워요 → <b>상관관계가 거의 없어요</b>'
  :r>-0.7?'<b>음의 상관관계</b>가 보여요'
  :'−1에 가까워요 → 뚜렷한 <b>음의 상관관계</b>';

/* 산점도 탐색기: 빈 곳을 누르면 점 추가, 점을 끌면 이동, 지우기 모드에서 누르면 삭제 */
function coPlot(o){
  const S=$(o.svg), W=460, H=340, L=50, R=14, T=12, B=46, pw=W-L-R, ph=H-T-B;
  const X=v=>L+(v-o.x0)/(o.x1-o.x0)*pw, Y=v=>T+ph-(v-o.y0)/(o.y1-o.y0)*ph;
  const IX=x=>o.x0+(x-L)/pw*(o.x1-o.x0), IY=y=>o.y0+(T+ph-y)/ph*(o.y1-o.y0);
  const cl=(v,a,b)=>Math.max(a,Math.min(b,v)), rd=v=>Math.round(v*10)/10;
  let P=[], drag=-1, del=false;
  S.setAttribute('viewBox',`0 0 ${W} ${H}`);
  function frame(){
    let g=`<rect class="bg" x="${L}" y="${T}" width="${pw}" height="${ph}" fill="#fbfaf7"/>`;
    for(let v=o.x0; v<=o.x1+1e-9; v+=o.xs) g+=`<line x1="${X(v)}" y1="${T}" x2="${X(v)}" y2="${T+ph}" stroke="#eceae4"/><text x="${X(v)}" y="${T+ph+16}" text-anchor="middle" font-size="11" fill="#5b6776">${String(+v.toFixed(1)).replace('-','−')}</text>`;
    for(let v=o.y0; v<=o.y1+1e-9; v+=o.ys) g+=`<line x1="${L}" y1="${Y(v)}" x2="${L+pw}" y2="${Y(v)}" stroke="#eceae4"/><text x="${L-6}" y="${Y(v)+4}" text-anchor="end" font-size="11" fill="#5b6776">${String(+v.toFixed(1)).replace('-','−')}</text>`;
    g+=`<path d="M${L} ${T}V${T+ph}H${L+pw}" fill="none" stroke="#16202c" stroke-width="2"/>`;
    g+=`<text x="${L+pw/2}" y="${H-6}" text-anchor="middle" font-size="12.5" font-weight="700" fill="#16202c">${o.xl} →</text>`;
    g+=`<text x="14" y="${T+ph/2}" text-anchor="middle" font-size="12.5" font-weight="700" fill="#16202c" transform="rotate(-90 14 ${T+ph/2})">${o.yl} →</text>`;
    g+='<g class="pts"></g>';
    S.innerHTML=g;
  }
  function draw(fin){
    const G=S.querySelector('.pts');
    G.innerHTML=P.map((p,i)=>`<circle data-i="${i}" cx="${X(p[0])}" cy="${Y(p[1])}" r="${o.edit?7:6}" fill="${p[2]||o.color||'#1f9d74'}" fill-opacity=".8" stroke="#fff" stroke-width="1.5" class="${o.edit?'co-pt':''}"/>`).join('');
    const r=coR(P);
    $(o.out+'R').textContent=coFmt(r);
    $(o.out+'N').textContent=`점 ${P.length}개`;
    $(o.out+'W').innerHTML=coWord(r);
    const gi=$(o.out+'G'); gi.style.left=r==null?'50%':((r+1)/2*100)+'%'; gi.style.opacity=r==null?.3:1;
    if(fin&&o.onChange) o.onChange(r,P);
  }
  const pt=e=>{const m=S.getScreenCTM(); if(!m) return [0,0]; const q=new DOMPoint(e.clientX,e.clientY).matrixTransform(m.inverse()); return [q.x,q.y];};
  if(o.edit){
    S.style.touchAction='none';
    S.addEventListener('pointerdown',e=>{
      const c=e.target.closest('circle[data-i]');
      if(c){ const i=+c.dataset.i;
        if(del){ P.splice(i,1); draw(true); return; }
        drag=i; S.setPointerCapture(e.pointerId); return; }
      if(del) return;
      const [x,y]=pt(e); if(x<L||x>L+pw||y<T||y>T+ph) return;
      if(P.length>=(o.max||40)){ $(o.out+'W').innerHTML='점은 '+(o.max||40)+'개까지 놓을 수 있어요. 몇 개를 지워 보세요.'; return; }
      P.push([rd(cl(IX(x),o.x0,o.x1)),rd(cl(IY(y),o.y0,o.y1))]); draw(true);
    });
    S.addEventListener('pointermove',e=>{ if(drag<0) return; const [x,y]=pt(e); P[drag]=[rd(cl(IX(x),o.x0,o.x1)),rd(cl(IY(y),o.y0,o.y1)),P[drag][2]]; draw(false); });
    const up=()=>{ if(drag>=0){ drag=-1; draw(true); } }; S.addEventListener('pointerup',up); S.addEventListener('pointercancel',up);
  }
  frame();
  return {
    set(pts){ P=pts.map(p=>p.slice()); drag=-1; draw(false); },
    toggleDel(btn){ del=!del; btn.textContent='점 지우기: '+(del?'켜짐':'꺼짐'); btn.classList.toggle('on',del); S.classList.toggle('co-del',del); }
  };
}

/* 0 시작 · 처음 생각 */
const CO_PRED=[['같이 높아진다','스트레스가 높을수록 수면의 질도 높다'],['낮아진다','스트레스가 높을수록 수면의 질은 낮다'],['관계없다','뚜렷한 경향이 없다']];
vote('predictVote','predict',CO_PRED);

/* 01 상관계수 탐색기 (예시 값) */
const CO_EX={
  neg:[[2,8.5],[3,8],[3.5,7],[4,7.5],[5,6.5],[5.5,5.5],[6,6],[7,4.5],[7.5,4],[8,3.5],[9,2.5]],
  pos:[[1.5,2],[2.5,3],[3,2.5],[4,4],[4.5,5],[5.5,4.5],[6,6.5],[7,6],[7.5,7.5],[8.5,8],[9,9]],
  none:[[1.5,6],[2,2.5],[3,8],[3.5,4],[4.5,6.5],[5,1.5],[6,7.5],[6.5,3],[7.5,5],[8.5,8.5],[9,2.5]]
};
const CO_MIS=[
  {k:'m8',t:'r을 <b>0.8쯤</b>(0.75~0.85)으로 만들기',ok:(r,n)=>n>=5&&r>=0.75&&r<=0.85},
  {k:'m5',t:'r을 <b>−0.5쯤</b>(−0.55~−0.45)으로 만들기',ok:(r,n)=>n>=5&&r>=-0.55&&r<=-0.45},
  {k:'m1',t:'점 5개 이상을 한 줄로 세워 r을 <b>1 또는 −1</b>로 만들기',ok:(r,n)=>n>=5&&Math.abs(r)>=0.995},
  {k:'m0',t:'점 8개 이상으로 r을 <b>0에 가깝게</b>(−0.05~0.05) 만들기',ok:(r,n)=>n>=8&&Math.abs(r)<=0.05}
];
let coMis=store.get(MK+'-mis',{});
function coMisDraw(){
  $('exMis').innerHTML=CO_MIS.map(m=>`<li class="${coMis[m.k]!=null?'ok':''}">${coMis[m.k]!=null?'✓':'○'} ${m.t}${coMis[m.k]!=null?` <span class="muted">(r = ${esc(coMis[m.k])})</span>`:''}</li>`).join('');
  const done=CO_MIS.filter(m=>coMis[m.k]!=null).map(m=>m.t.replace(/<[^>]+>/g,'')+' ✓ r='+coMis[m.k]);
  MEMO.corrMission=done.join(' / '); store.set(MK,MEMO);
}
const exPlot=coPlot({svg:'exPlot',out:'ex',x0:0,x1:10,xs:1,y0:0,y1:10,ys:1,xl:'스트레스 수준 (예시)',yl:'수면의 질 (예시)',edit:true,max:40,
  onChange:(r,P)=>{ if(r==null) return; let ch=false; CO_MIS.forEach(m=>{ if(coMis[m.k]==null&&m.ok(r,P.length)){ coMis[m.k]=coFmt(r); ch=true; } }); if(ch){ store.set(MK+'-mis',coMis); coMisDraw(); } }});
$('exNeg').onclick=()=>exPlot.set(CO_EX.neg);
$('exPos').onclick=()=>exPlot.set(CO_EX.pos);
$('exNone').onclick=()=>exPlot.set(CO_EX.none);
$('exClear').onclick=()=>exPlot.set([]);
$('exDel').onclick=()=>exPlot.toggleDel($('exDel'));
$('exMisReset').onclick=()=>{coMis={}; store.set(MK+'-mis',coMis); coMisDraw();};
coMisDraw();
exPlot.set(CO_EX.neg);

/* 02 그림 Ⅱ-9를 닮은 A·B (새로 만든 점) */
const CO_A=[[2,.3],[-2.6,.7],[.4,-.4],[-.6,-1.1],[-.5,0],[-.2,-.1],[-2,1.4],[-.2,.7],[-.9,.2],[2.8,1.1],[.2,-.2],[-.4,-.9],[-.3,.6],[-.7,.6],[-1.1,-.2],[-.4,-.8],[.5,.2],[-.2,-2.5],[1,.7],[-.2,.5],[0,-1.6],[1.5,.1],[.5,-1],[-.5,.8],[-.2,-2],[.5,-.9],[1.9,.7],[-.3,1.2],[-.2,-2.2],[1,-.5],[-.9,.3],[-.3,-.6],[.9,1.6],[.6,-1.2],[.1,.4],[.7,-1],[-2.8,1.4],[1,0],[-1,-.4],[-1.7,-1.7]];
const CO_B=[[-2.2,-1.4],[-2,-1.8],[-1.8,-.4],[-1.6,-.1],[-1.4,.4],[-1.2,.9],[-1,.8],[-.8,1.6],[-.6,1.7],[-.4,2.9],[-.2,2.2],[0,2.1],[.2,2.1],[.4,1.9],[.6,1.6],[.8,1.6],[1,1.5],[1.2,.9],[1.4,.8],[1.6,0],[1.8,-.5],[2,-.8],[2.2,-1.8]];
const abPlot=coPlot({svg:'abPlot',out:'ab',x0:-3,x1:3,xs:1,y0:-3,y1:3,ys:1,xl:'가로축 속성',yl:'세로축 속성',edit:true,max:50,color:'#e0702b'});
const AB_SAY={
  A:'<b>A</b>는 점들이 가운데에 흩어져 있을 뿐 어느 쪽으로도 기울어지지 않았어요. 두 속성 사이에 관계가 없어요.',
  B:'<b>B</b>도 r은 0에 가깝지만, 가로 값이 −3에서 0까지는 <b>양의 상관관계</b>, 0에서 3까지는 <b>음의 상관관계</b>를 보이는 산 모양이에요. 관계가 <b>곡선</b>이라 직선을 가정한 상관계수로는 잡히지 않아요.'
};
$('abA').onclick=()=>{abPlot.set(CO_A); $('abSay').innerHTML=AB_SAY.A;};
$('abB').onclick=()=>{abPlot.set(CO_B); $('abSay').innerHTML=AB_SAY.B;};
$('abDel').onclick=()=>abPlot.toggleDel($('abDel'));
abPlot.set(CO_A); $('abSay').innerHTML=AB_SAY.A+' 이제 B를 눌러 비교해 보세요.';

sorter('causeSort',{
  cats:[{n:'함께 변한 것뿐 (다른 까닭)',k:'#e0702b'},{n:'원인과 결과',k:'#1f9d74'}],
  items:[
    {t:'겨울이 되자 핫팩 판매량과 귤 판매량이 함께 늘었다.',short:'핫팩 · 귤',c:0,ic:'🧤',w:'추운 날씨가 두 판매량을 함께 늘렸다고 보는 것이 자연스러워요. 핫팩을 사서 귤을 더 사는 것은 아니에요.'},
    {t:'수영장 입장객이 많은 날일수록 선크림도 많이 팔렸다.',short:'수영장 · 선크림',c:0,ic:'🏊',w:'덥고 맑은 날씨가 두 값을 함께 늘렸을 수 있어요.'},
    {t:'같은 학교 초등학생 가운데 신발 크기가 큰 학생일수록 받아쓰기 점수가 높았다.',short:'신발 크기 · 받아쓰기',c:0,ic:'👟',w:'학년이 높을수록 발도 크고 받아쓰기도 잘해요. 발이 커서 글씨를 잘 쓰는 것이 아니에요.'},
    {t:'출동한 소방관 수가 많은 화재일수록 피해 금액도 컸다.',short:'소방관 수 · 피해 금액',c:0,ic:'🚒',w:'불이 클수록 소방관도 많이 출동하고 피해도 커요. 소방관이 피해를 키운 것이 아니에요.'},
    {t:'자전거 페달을 빨리 돌릴수록 뒷바퀴도 빨리 돈다.',short:'페달 · 바퀴',c:1,ic:'🚲',w:'페달이 체인으로 뒷바퀴를 돌리므로, 페달을 돌리는 빠르기가 바퀴의 빠르기를 바꿔요.'},
    {t:'흙과 햇빛은 똑같이 하고 물만 주지 않은 화분의 강낭콩이 시들어 버렸다.',short:'물 · 강낭콩',c:1,ic:'🌱',w:'다른 조건을 같게 하고 물만 다르게 했으므로, 물이 없던 것이 시든 까닭이라고 볼 수 있어요.'},
    {t:'줄넘기를 오래 할수록 그날 몸이 쓴 열량이 늘었다.',short:'줄넘기 · 열량',c:1,ic:'🪢',w:'운동을 더 하면 몸이 에너지를 더 써요. 줄넘기 시간이 쓴 열량을 바꿔요.'}
  ],
  end:'<b>정리</b> 두 값이 함께 변한다고(상관관계) 해서 한쪽이 다른 쪽을 바꾼다(인과관계)고 바로 말할 수는 없어요. 두 값을 함께 움직이게 한 <b>다른 까닭</b>이 없는지, <b>다른 조건을 같게</b> 하고 비교했는지 따져 봐요.'
});

/* 03 위젯 연결 흐름도 (오렌지3 화면을 캡처하지 않고 새로 그림) */
function coFlow(svgId,tblId,W,H,nodes,edges){
  const col={D:'#f2b84b',T:'#f0875a',U:'#7fb2e0'}, BW=180, BH=48, N={};
  nodes.forEach(n=>N[n.s]=n);
  let g=`<defs><marker id="${svgId}A" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#8a94a3"/></marker></defs>`;
  edges.forEach(([a,b])=>{
    const p=N[a], q=N[b], x1=p.x+BW, y1=p.y+BH/2, x2=q.x-2, y2=q.y+BH/2;
    g+=`<path d="M${x1} ${y1}C${x1+40} ${y1} ${x2-40} ${y2} ${x2} ${y2}" class="fe" marker-end="url(#${svgId}A)"/>`;
  });
  nodes.forEach(n=>{
    g+=`<g class="fn" data-s="${n.s}" tabindex="0"><rect x="${n.x}" y="${n.y}" width="${BW}" height="${BH}" rx="10" class="fb" style="stroke:${col[n.c]}"/><rect x="${n.x}" y="${n.y}" width="28" height="${BH}" rx="10" fill="${col[n.c]}"/><rect x="${n.x+18}" y="${n.y}" width="10" height="${BH}" fill="${col[n.c]}"/><text x="${n.x+14}" y="${n.y+29}" class="fnum">${n.s}</text><text x="${n.x+36}" y="${n.y+(n.sub?20:29)}" class="ft">${n.t}</text>${n.sub?`<text x="${n.x+36}" y="${n.y+37}" class="fs">${n.sub}</text>`:''}</g>`;
  });
  const S=$(svgId); S.setAttribute('viewBox',`0 0 ${W} ${H}`); S.innerHTML=g;
  const pick=s=>{
    S.querySelectorAll('.fn').forEach(x=>x.classList.toggle('on',x.dataset.s===s));
    $(tblId).querySelectorAll('tr[data-s]').forEach(tr=>tr.classList.toggle('hl',tr.dataset.s===s));
    const tr=$(tblId).querySelector(`tr[data-s="${s}"]`); if(tr) tr.scrollIntoView({behavior:'smooth',block:'nearest'});
  };
  S.querySelectorAll('.fn').forEach(x=>{x.onclick=()=>pick(x.dataset.s); x.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(x.dataset.s);}};});
  $(tblId).querySelectorAll('tr[data-s]').forEach(tr=>tr.onclick=()=>pick(tr.dataset.s));
}
coFlow('coFlow','coSet',680,250,[
  {s:1,t:'File',sub:'Sleep_Health_merge.csv',c:'D',x:10,y:100},
  {s:2,t:'Correlations',sub:'전체 · Stress Level',c:'U',x:250,y:10},
  {s:3,t:'Select Rows',sub:'간호사 (Nurse)',c:'T',x:250,y:100},{s:4,t:'Correlations (1)',sub:'간호사',c:'U',x:490,y:100},
  {s:5,t:'Select Rows',sub:'회계사 (Accountant)',c:'T',x:250,y:190},{s:6,t:'Correlations (2)',sub:'회계사',c:'U',x:490,y:190}
],[[1,2],[1,3],[1,5],[3,4],[5,6]]);
chips('coDone','coDonePick',['파일 열기','Person ID를 skip으로','전체 상관계수 확인','간호사 고르기','회계사 고르기','직업별 결과 기록'],true);

/* 03 막혔을 때: 직업별로 나누어 보기 (모양을 닮게 새로 만든 예시 값) */
const CO_NUR=[[5.2,4],[5.8,5],[6.1,3],[6.6,5],[7,6],[7.4,4],[7.9,6],[8.3,7],[8.6,5],[9,7],[9.4,8],[9.8,6],[10,8]];
const CO_ACC=[[3.2,7],[3.6,8],[4,6],[4.5,8],[4.9,5],[5.3,7],[5.8,4],[6.2,6],[6.7,5],[7.1,3],[7.6,5],[8,3]];
const jobPlot=coPlot({svg:'jobPlot',out:'job',x0:2,x1:11,xs:1,y0:0,y1:10,ys:2,xl:'일일 걸음 수 (천 걸음, 예시)',yl:'스트레스 수준 (예시)',edit:false});
const JOBS=[
  {n:'간호사',ic:'🩺',pts:CO_NUR.map(p=>[...p,'#d64535']),say:'간호사(예시)는 걸음 수가 많을수록 스트레스도 높은 쪽으로 점이 올라가요.'},
  {n:'회계사',ic:'🧮',pts:CO_ACC.map(p=>[...p,'#2f6fd0']),say:'회계사(예시)는 걸음 수가 많을수록 스트레스가 낮은 쪽으로 점이 내려가요.'},
  {n:'두 직업 함께',ic:'👥',pts:[...CO_NUR.map(p=>[...p,'#d64535']),...CO_ACC.map(p=>[...p,'#2f6fd0'])],say:'두 직업을 합치면 서로 반대 방향의 경향이 섞여 r이 0에 가까워져요. 전체만 보면 「관계가 거의 없다」고 생각하기 쉬워요. <span style="color:#d64535">●</span> 간호사 <span style="color:#2f6fd0">●</span> 회계사'}
];
tabs('jobTabs','jobSay',JOBS,(it)=>{ jobPlot.set(it.pts); return it.say; });

/* 04 (선택) 히트맵 읽기: 교과서 100쪽 히트맵의 값 */
const HM_N=['사람 번호 (Person ID)','나이 (Age)','수면 시간','수면의 질','신체 활동 수준','스트레스 수준','일일 걸음 수','심박수'];
const HM_S=['Person ID','Age','Sleep Duration','Quality of Sleep','Physical Activity Level','Stress Level','Daily Steps','Heart Rate'];
const HM=[
  [1,.99,.29,.43,.15,-.39,.044,-.22],
  [.99,1,.34,.47,.18,-.42,.058,-.22],
  [.29,.34,1,.88,.21,-.81,-.04,-.52],
  [.43,.47,.88,1,.19,-.9,.016,-.66],
  [.15,.18,.21,.19,1,-.032,.77,.14],
  [-.39,-.42,-.81,-.9,-.032,1,.19,.67],
  [.044,.058,-.04,.016,.77,.19,1,-.03],
  [-.22,-.22,-.52,-.66,.14,.67,-.03,1]
];
let hmPid=false;
const hmCol=v=>{const a=[221,221,221], b=v>=0?[180,4,38]:[59,76,192], t=Math.min(1,Math.abs(v)); return `rgb(${a.map((c,i)=>Math.round(c+(b[i]-c)*t)).join(',')})`;};
const hmNum=v=>(v<0?'−':'')+String(Math.abs(v)).replace(/^0\./,'0.');
function hmDraw(){
  const idx=[...Array(8).keys()].filter(i=>hmPid||i>0);
  $('heat').innerHTML='<tr><th></th>'+idx.map(j=>`<th class="v"><span>${HM_S[j]}</span></th>`).join('')+'</tr>'+
    idx.map(i=>`<tr><th class="r">${HM_S[i]}</th>`+idx.map(j=>`<td data-i="${i}" data-j="${j}" tabindex="0" style="background:${hmCol(HM[i][j])};color:${Math.abs(HM[i][j])>0.6?'#fff':'#16202c'}">${hmNum(HM[i][j])}</td>`).join('')+'</tr>').join('');
  $('heat').querySelectorAll('td').forEach(td=>{const f=()=>{
    $('heat').querySelectorAll('td.on').forEach(x=>x.classList.remove('on')); td.classList.add('on');
    const i=+td.dataset.i, j=+td.dataset.j, v=HM[i][j];
    let s;
    if(i===j) s=`<b>${HM_N[i]}</b>와 자기 자신의 상관계수는 늘 1이에요. 대각선 칸은 모두 1이라 읽지 않아요.`;
    else if(i===0||j===0) s=`<b>${HM_N[i]}</b> × <b>${HM_N[j]}</b> : r = ${hmNum(v)}. 사람 번호는 사람을 구별하려고 붙인 값이라 크기에 뜻이 없어요. 이 자료는 번호가 대체로 나이 순서로 붙어 있어서 나이와 0.99가 나왔을 뿐이에요. 이런 칸은 해석하지 않아요.`;
    else s=`<b>${HM_N[i]}</b> × <b>${HM_N[j]}</b> : r = ${hmNum(v)}. ${coWord(v)}. ${v>=0.3?'한쪽이 클수록 다른 쪽도 큰 경향이에요.':v<=-0.3?'한쪽이 클수록 다른 쪽은 작은 경향이에요.':'한쪽이 커져도 다른 쪽이 뚜렷하게 변하지 않아요.'}`;
    $('heatSay').innerHTML=s;
  }; td.onclick=f; td.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f();}};});
}
$('heatPid').onclick=()=>{hmPid=!hmPid; $('heatPid').textContent=hmPid?'Person ID 빼기':'Person ID 넣어 보기'; hmDraw(); $('heatSay').innerHTML=hmPid?'교과서 100쪽 히트맵처럼 <b>Person ID</b>가 들어갔어요. 맨 위 줄의 칸을 눌러 보세요.':'Person ID를 뺐어요. 칸을 눌러 보세요.';};
hmDraw();

/* 05 마무리 */
const MEMOLIST=[['predict','처음 생각: 스트레스가 높을수록 수면의 질은'],['myPair','궁금한 두 속성'],['corrMission','상관계수 탐색기 미션 기록'],['missionHow','r을 0.8쯤·−0.5쯤으로 만든 방법'],['shapeNote','r이 0에 가까운 A와 B의 차이'],['causeNote','상관관계와 인과관계: 나의 새 예'],['coDonePick','오렌지3 진행 체크'],['rAll','전체: 스트레스와 걸음 수 r'],['rNurse','간호사: 스트레스와 걸음 수 r'],['rAcc','회계사: 스트레스와 걸음 수 r'],['coCompare','오렌지3 결과 해석'],['heatNote','(선택) 히트맵에서 찾은 관계'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[5]=()=>{
  $('predShow').textContent=MEMO.predict?'「'+MEMO.predict+'」':'아직 고르지 않음';
  memoSummary('msum',MEMOLIST.filter(([k,l])=>!l.startsWith('(선택)')||String(MEMO[k]||'').trim()));
};

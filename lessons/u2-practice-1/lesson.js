/* u2-practice-1 데이터 분석의 실제 ① 데이터 준비 (교과서 102~107쪽) */

/* 도시별 집계값 — 캐글 「Airbnb Prices European Cities(Merged)」 51,707개 숙소를 도시별로 묶어 계산(오렌지3 파이썬으로 원본 csv에서 계산, 교과서 104~107쪽 값과 대조함).
   n: 숙소 수 · m: 평균 · d: 중앙값 · pc: 숙박 인원 [최솟값, Q1, 중앙값, Q3, 최댓값] */
const PA_ATTR=[
  {k:'n',ko:'숙소 수',en:'데이터 개수',dec:0,noMed:true},
  {k:'charge',ko:'1인당 숙박비',en:'charge',dec:2},
  {k:'realSum',ko:'총 숙박비',en:'realSum',dec:2},
  {k:'person_capacity',ko:'숙박 가능 인원',en:'person_capacity',dec:2},
  {k:'cleanliness_rating',ko:'청결도',en:'cleanliness_rating',dec:2},
  {k:'guest_satisfaction_overall',ko:'고객 만족도',en:'guest_satisfaction_overall',dec:2},
  {k:'bedrooms',ko:'침실 수',en:'bedrooms',dec:2},
  {k:'dist',ko:'도심 거리',en:'dist',dec:2},
  {k:'metro_dist',ko:'지하철 거리',en:'metro_dist',dec:2}
];
const PA_CITY=[
  {k:'Amsterdam',ko:'암스테르담',n:2080,m:{realSum:573.1128,person_capacity:2.7817,cleanliness_rating:9.4659,guest_satisfaction_overall:94.5144,bedrooms:1.2923,dist:2.8251,metro_dist:1.0894,charge:205.7859},d:{realSum:460.2442,person_capacity:2,cleanliness_rating:10,guest_satisfaction_overall:96,bedrooms:1,dist:2.33,metro_dist:0.8619,charge:184.3086},pc:[2,2,2,4,6]},
  {k:'Athens',ko:'아테네',n:5280,m:{realSum:151.7441,person_capacity:3.6981,cleanliness_rating:9.6384,guest_satisfaction_overall:95.0036,bedrooms:1.2714,dist:1.8031,metro_dist:0.4787,charge:44.6259},d:{realSum:127.7154,person_capacity:4,cleanliness_rating:10,guest_satisfaction_overall:97,bedrooms:1,dist:1.6616,metro_dist:0.4183,charge:37.0941},pc:[2,3,4,4,6]},
  {k:'Barcelona',ko:'바르셀로나',n:2833,m:{realSum:293.7537,person_capacity:2.6167,cleanliness_rating:9.2916,guest_satisfaction_overall:91.1091,bedrooms:1.1613,dist:2.117,metro_dist:0.4412,charge:112.1393},d:{realSum:208.2994,person_capacity:2,cleanliness_rating:10,guest_satisfaction_overall:93,bedrooms:1,dist:1.732,metro_dist:0.377,charge:94.2584},pc:[2,2,2,3,6]},
  {k:'Berlin',ko:'베를린',n:2484,m:{realSum:244.5838,person_capacity:2.775,cleanliness_rating:9.4618,guest_satisfaction_overall:94.3237,bedrooms:1.0705,dist:5.2571,metro_dist:0.8361,charge:92.3438},d:{realSum:191.1751,person_capacity:2,cleanliness_rating:10,guest_satisfaction_overall:96,bedrooms:1,dist:4.2829,metro_dist:0.4505,charge:78.7604},pc:[2,2,2,3,6]},
  {k:'Budapest',ko:'부다페스트',n:4022,m:{realSum:176.5135,person_capacity:3.5408,cleanliness_rating:9.4774,guest_satisfaction_overall:94.5853,bedrooms:1.1057,dist:1.8728,metro_dist:0.5441,charge:53.5769},d:{realSum:152.9821,person_capacity:4,cleanliness_rating:10,guest_satisfaction_overall:96,bedrooms:1,dist:1.4902,metro_dist:0.3455,charge:45.8241},pc:[2,2,4,4,6]},
  {k:'Lisbon',ko:'리스본',n:5763,m:{realSum:238.2105,person_capacity:3.3434,cleanliness_rating:9.3706,guest_satisfaction_overall:91.0939,bedrooms:1.2724,dist:1.9669,metro_dist:0.7115,charge:75.274},d:{realSum:225.3752,person_capacity:3,cleanliness_rating:10,guest_satisfaction_overall:93,bedrooms:1,dist:1.3877,metro_dist:0.4476,charge:68.4803},pc:[2,2,3,4,6]},
  {k:'London',ko:'런던',n:9993,m:{realSum:362.4693,person_capacity:2.8462,cleanliness_rating:9.175,guest_satisfaction_overall:90.6457,bedrooms:1.1288,dist:5.3264,metro_dist:1.0055,charge:126.6715},d:{realSum:261.295,person_capacity:2,cleanliness_rating:10,guest_satisfaction_overall:94,bedrooms:1,dist:4.9241,metro_dist:0.5308,charge:103.3656},pc:[2,2,2,4,6]},
  {k:'Paris',ko:'파리',n:6688,m:{realSum:392.5314,person_capacity:2.9536,cleanliness_rating:9.2636,guest_satisfaction_overall:92.0375,bedrooms:0.9728,dist:2.9958,metro_dist:0.2273,charge:137.5011},d:{realSum:317.5972,person_capacity:2,cleanliness_rating:9,guest_satisfaction_overall:94,bedrooms:1,dist:2.997,metro_dist:0.2073,charge:121.633},pc:[2,2,2,4,6]},
  {k:'Rome',ko:'로마',n:9027,m:{realSum:205.3919,person_capacity:3.3574,cleanliness_rating:9.5147,guest_satisfaction_overall:93.1223,bedrooms:1.2298,dist:3.027,metro_dist:0.8198,charge:65.3534},d:{realSum:182.5918,person_capacity:3,cleanliness_rating:10,guest_satisfaction_overall:95,bedrooms:1,dist:2.8157,metro_dist:0.6216,charge:57.7935},pc:[2,2,3,4,6]},
  {k:'Vienna',ko:'비엔나',n:3537,m:{realSum:241.5825,person_capacity:3.3503,cleanliness_rating:9.4724,guest_satisfaction_overall:93.7311,bedrooms:1.1023,dist:3.1395,metro_dist:0.5267,charge:78.8134},d:{realSum:208.494,person_capacity:3,cleanliness_rating:10,guest_satisfaction_overall:96,bedrooms:1,dist:2.7601,metro_dist:0.3763,charge:66.6152},pc:[2,2,3,4,6]}
];
const paFix=(v,d)=>Number(v).toLocaleString('ko-KR',{minimumFractionDigits:d,maximumFractionDigits:d});

/* 위젯 연결 흐름도 (오렌지3 화면을 캡처하지 않고 새로 그림) — 교과서 ows 「데이터 분석의 실제(103쪽)」의 연결과 같게 */
function paDrawFlow(svgId,tblId,W,H,nodes,edges){
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
paDrawFlow('paFlow1','paSet1',470,180,[
  {s:1,t:'File',sub:'숙소 정보',c:'D',x:10,y:66},
  {s:2,t:'Data Table',c:'D',x:280,y:10},{s:3,t:'Column Statistics',sub:'(Feature Statistics)',c:'D',x:280,y:120}
],[[1,2],[1,3]]);
paDrawFlow('paFlow2','paSet2',700,80,[
  {s:1,t:'File',sub:'숙소 정보',c:'D',x:10,y:16,done:true},{s:4,t:'Formula',sub:'charge 만들기',c:'T',x:262,y:16},{s:5,t:'Data Table (1)',sub:'charge 정렬',c:'D',x:514,y:16}
],[[1,4],[4,5]]);
paDrawFlow('paFlow3','paSet3',860,390,[
  {s:1,t:'File',sub:'숙소 정보',c:'D',x:10,y:150,done:true},
  {s:2,t:'Data Table',c:'D',x:228,y:10,done:true},{s:3,t:'Column Statistics',sub:'(Feature Statistics)',c:'D',x:228,y:80,done:true},{s:4,t:'Formula',sub:'charge',c:'T',x:228,y:220,done:true},
  {s:5,t:'Data Table (1)',c:'D',x:448,y:150,done:true},{s:6,t:'Box Plot',sub:'도시별 개수 · 숙박 인원',c:'V',x:448,y:222},{s:7,t:'Group by',sub:'city · Mean (Mode 풀기)',c:'T',x:448,y:296},
  {s:8,t:'Data Table (2)',sub:'도시별 평균 10줄',c:'D',x:670,y:258},{s:9,t:'Bar Plot',sub:'charge - Mean',c:'V',x:670,y:332}
],[[1,2],[1,3],[1,4],[4,5],[4,6],[4,7],[7,8],[7,9]]);
chips('paDone1','done1Pick',['파일 불러오기','이름을 숙소 정보로','Data Table로 행·속성 수 보기','Column Statistics로 대푯값 보기'],true);
chips('paDone2','done2Pick',['Box Plot ① 도시별 개수','Box Plot ② 숙박 인원','Group by로 도시별 평균(Mode 풀기)','Bar Plot으로 charge 비교','여행지 분석으로 저장하기'],true);

/* 0 시작: 여행지를 고르는 나의 기준 */
chips('paCrit','planCrit',['숙박비','현지 물가','숙소 청결','손님 평가','도심과의 거리','교통','볼거리·체험','날씨','안전'],true);

/* 01 이 질문엔 어느 데이터? */
sorter('paWhich',{
  cats:[{n:'숙소 정보 데이터',k:'#e0702b'},{n:'생활비 데이터',k:'#9b4fc4'},{n:'두 데이터를 합쳐야',k:'#1f9d74'}],
  items:[
    {t:'리스본에서 방 하나만 빌리는 개인실은 얼마나 많을까?',short:'개인실이 얼마나 많을까',c:0,ic:'🛏️',w:'객실 타입(room_type)은 공유 숙박 플랫폼이 공개한 데이터에 있어요.'},
    {t:'손님들이 남긴 청결도 점수가 높은 도시는 어디일까?',short:'청결도 점수가 높은 도시',c:0,ic:'🧽',w:'청결도(cleanliness_rating)는 손님이 남긴 평가라 공유 숙박 데이터에 있어요.'},
    {t:'묵는 곳에서 지하철역까지 거리가 가장 가까운 도시는?',short:'지하철역까지의 거리',c:0,ic:'🚇',w:'지하철 거리(metro_dist)는 공유 숙박 데이터의 속성이에요.'},
    {t:'슈퍼마켓에서 장을 볼 때 식료품값이 싼 도시는?',short:'식료품값이 싼 도시',c:1,ic:'🥖',w:'식료품 지수(Groceries Index)는 NUMBEO 자료에 있어요.'},
    {t:'식당에서 한 끼를 사 먹는 값이 비싼 도시는?',short:'한 끼 사 먹는 값',c:1,ic:'🍝',w:'레스토랑 가격 지수(Restaurant Price Index)는 NUMBEO 자료에 있어요.'},
    {t:'그 도시 사람들의 소득으로 물건을 얼마나 살 수 있을까?',short:'소득으로 살 수 있는 양',c:1,ic:'💶',w:'지역 구매력 지수(Local Purchasing Power Index)는 NUMBEO 자료에 있어요.'},
    {t:'1인당 숙박비가 비싼 도시는 물가도 비쌀까?',short:'숙박비와 물가의 관계',c:2,ic:'⚖️',w:'숙박비는 공유 숙박 데이터에, 물가는 생활비 데이터에 있어서 두 데이터를 도시 기준으로 합쳐야 비교할 수 있어요.'},
    {t:'그 도시의 집 임대료 수준이 높을수록 손님 만족도가 낮을까?',short:'임대료 수준과 손님 만족도',c:2,ic:'🔗',w:'임대료 지수와 고객 만족도는 서로 다른 데이터에 있어요. 다음 시간에 두 데이터를 합쳐 확인해요.'}
  ],
  end:'<b>정리</b> 한 데이터에 있는 속성으로 답할 수 있는 질문도 있지만, 숙박비와 물가처럼 <b>서로 다른 데이터의 속성</b>을 함께 봐야 하는 질문은 공통 속성(도시)으로 두 데이터를 합쳐야 해요.'
});

/* 02 속성 15개와 오렌지3가 읽은 형 */
(function(){
  const A=[['총 숙박비','realSum',1],['객실 타입','room_type',0],['방 공유','room_shared',0],['개인실','room_private',0],['숙박 가능 인원','person_capacity',1],['슈퍼호스트','host_is_superhost',0],['다중 객실 운영 여부','multi',0],['비즈니스 시설','biz',0],['청결도','cleanliness_rating',1],['고객 만족도','guest_satisfaction_overall',1],['침실 수','bedrooms',1],['도심 거리','dist',1],['지하철 거리','metro_dist',1],['도시','city',0],['주말 숙박','weekends',0]];
  let show=false;
  function draw(){
    $('paAttrs').innerHTML=A.map(a=>`<div class="pa-at${show?(a[2]?' num':' cat'):''}"><b>${a[0]}</b><span class="mono">${a[1]}</span>${show?`<i>${a[2]?'numeric':'categorical'}</i>`:''}</div>`).join('');
    $('paAttrBtn').textContent=show?'형 숨기기':'오렌지3가 읽은 형 보기';
    $('paAttrMsg').innerHTML=show?'수치형(numeric) <b>7개</b>, 범주형(categorical) <b>8개</b>예요. multi와 biz는 0과 1로 적혀 있지만 「그렇다 · 아니다」를 나누는 값이라 범주형으로 읽혀요.':'어느 속성이 수치형(numeric)으로 읽힐지 먼저 짐작해 보세요.';
  }
  $('paAttrBtn').onclick=()=>{show=!show; draw();};
  draw();
})();

/* 값 읽기 확인 칸: 오렌지3 창에서 찾은 값을 적고 확인 (맞힌 개수·틀린 곳 표시) */
function paCheck(boxId,items,save){
  const B=$(boxId), raw=boxId+'Raw';
  let vals=(MEMO[raw]||'').split('|'); let shown=false, checked=false;
  const num=s=>{const t=String(s).replace(/,/g,'').trim(); return t===''?NaN:Number(t);};
  const ok=(it,v)=>!isNaN(v)&&Math.abs(v-it.a)<=(it.tol||0);
  function draw(){
    B.innerHTML=`<div class="pa-chk">${items.map((it,i)=>{
      const v=num(vals[i]||''), st=checked?(ok(it,v)?'good':'bad'):'';
      return `<label class="pa-ci ${st}"><span>${it.l}</span><input type="text" inputmode="decimal" data-i="${i}" value="${esc(vals[i]||'')}" autocomplete="off"><em>${checked?(ok(it,v)?'✓':(shown?'→ '+it.show:'✗')):''}</em></label>`;}).join('')}</div>
      <div class="row" style="margin-top:8px"><button class="btn sm" data-a="ok">확인하기</button>${checked?'<button class="btn ghost sm" data-a="show">틀린 칸 값 보기</button>':''}<button class="btn ghost sm" data-a="re">지우고 다시</button></div><div class="pa-msg"></div>`;
    B.querySelectorAll('input').forEach(inp=>inp.oninput=()=>{vals[+inp.dataset.i]=inp.value; MEMO[raw]=vals.join('|'); store.set(MK,MEMO);});
    B.querySelector('[data-a="ok"]').onclick=()=>{checked=true; shown=false; result();};
    const sb=B.querySelector('[data-a="show"]'); if(sb) sb.onclick=()=>{shown=true; result();};
    B.querySelector('[data-a="re"]').onclick=()=>{vals=[]; checked=false; shown=false; MEMO[raw]=''; save(''); store.set(MK,MEMO); draw();};
  }
  function result(){
    const empty=items.filter((_,i)=>String(vals[i]||'').trim()==='').length;
    const good=items.filter((it,i)=>ok(it,num(vals[i]||''))).length;
    draw();
    const m=B.querySelector('.pa-msg');
    m.innerHTML=`<b>${items.length}칸 중 ${good}칸</b>이 맞아요.`+(empty?` 빈칸 ${empty}개가 있어요.`:'')+(good<items.length&&!shown?' 빨간 칸은 다시 찾아보고, 그래도 어려우면 「틀린 칸 값 보기」를 눌러요.':'')+(good===items.length?' 모두 찾았어요!':'');
    save(items.map((it,i)=>`${it.l} ${String(vals[i]||'').trim()||'(빈칸)'}${ok(it,num(vals[i]||''))?' ✓':''}`).join(' · '));
  }
  draw();
}
paCheck('paRead',[
  {l:'데이터 행 수',a:51707,show:'51,707'},
  {l:'속성 수',a:15,show:'15'},
  {l:'총 숙박비(realSum) Mean',a:279.88,tol:0.06,show:'279.88'},
  {l:'총 숙박비(realSum) Median',a:211.34,tol:0.06,show:'211.34'},
  {l:'청결도 Median',a:10,show:'10'},
  {l:'청결도 Max.',a:10,show:'10'}
],s=>{MEMO.readVals=s; store.set(MK,MEMO);});

/* 02 (막혔을 때) 요약 통계 표 — 51,707개 전체의 집계값 */
(function(){
  const R=[['realSum','총 숙박비',279.8796,184.4622,211.3431,34.7793,18545.4503],['person_capacity','숙박 가능 인원',3.1617,2,3,2,6],['cleanliness_rating','청결도',9.3906,10,10,2,10],['guest_satisfaction_overall','고객 만족도',92.6282,100,95,20,100],['bedrooms','침실 수',1.1588,1,1,0,10],['dist','도심 거리',3.1913,2.8021,2.6135,0.015,25.2846],['metro_dist','지하철 거리',0.6815,0.5084,0.4133,0.0023,14.2736]];
  const f=v=>Number.isInteger(v)?String(v):(Math.abs(v)<1?String(Number(v.toPrecision(3))):paFix(v,2));
  $('paStatTbl').innerHTML='<tr><th>속성</th><th>Mean</th><th>Mode</th><th>Median</th><th>Min.</th><th>Max.</th><th>Missing</th></tr>'+R.map(r=>`<tr><td><b>${r[1]}</b> <span class="mono">${r[0]}</span></td>${r.slice(2).map(v=>`<td>${f(v)}</td>`).join('')}<td>0</td></tr>`).join('');
})();

/* 02 함께 해결하기: 결측치 2개 */
vote('paMissVote','missPick',[['2개 줄을 삭제','결측치가 있는 숙소를 지워요'],['평균으로 대체','realSum의 평균으로 채워요'],['중앙값으로 대체','realSum의 중앙값으로 채워요']],()=>$('paMissMore').classList.add('on'));
$('paMissPct').textContent=(51705/51707*100).toFixed(3)+'%(지워지는 것은 '+(2/51707*100).toFixed(3)+'%)';

/* 03 Formula 미리 해 보기 (새로 만든 예시 5곳) */
(function(){
  const R=[{id:'가',city:'리스본',type:'Entire home/apt',sum:360,pc:6},{id:'나',city:'리스본',type:'Private room',sum:140,pc:2},{id:'다',city:'로마',type:'Entire home/apt',sum:420,pc:4},{id:'라',city:'로마',type:'Private room',sum:95,pc:2},{id:'마',city:'비엔나',type:'Entire home/apt',sum:255,pc:3}];
  const ch=r=>r.sum/r.pc;
  let inp, order, checked;
  const rank=(key)=>R.slice().sort((a,b)=>key(b)-key(a)).map(r=>r.id);
  function draw(){
    const rows=order.map(i=>R[i]);
    $('paCalc').innerHTML='<tr><th>숙소</th><th>city</th><th>room_type</th><th>realSum</th><th>person_capacity</th><th>charge = realSum ÷ person_capacity</th><th></th></tr>'+rows.map(r=>{
      const i=R.indexOf(r), v=Number(String(inp[i]||'').replace(/,/g,'')), good=String(inp[i]||'').trim()!==''&&Math.abs(v-ch(r))<0.006;
      return `<tr><td><b>${r.id}</b></td><td>${r.city}</td><td>${r.type}</td><td>${r.sum}</td><td>${r.pc}</td><td><input type="text" inputmode="decimal" data-i="${i}" value="${esc(inp[i]||'')}" aria-label="${r.id} 숙소 charge" autocomplete="off"></td><td class="${checked?(good?'ok':'ng'):''}">${checked?(good?'✓':'✗'):''}</td></tr>`;}).join('');
    $('paCalc').querySelectorAll('input').forEach(x=>x.oninput=()=>{inp[+x.dataset.i]=x.value; checked=false; const td=x.parentElement.nextElementSibling; td.textContent=''; td.className='';});
  }
  const allGood=()=>R.every((r,i)=>String(inp[i]||'').trim()!==''&&Math.abs(Number(String(inp[i]).replace(/,/g,''))-ch(r))<0.006);
  $('paCalcOk').onclick=()=>{
    checked=true; draw();
    const good=R.filter((r,i)=>String(inp[i]||'').trim()!==''&&Math.abs(Number(String(inp[i]).replace(/,/g,''))-ch(r))<0.006).length;
    $('paCalcMsg').innerHTML=`<b>5곳 중 ${good}곳</b>이 맞아요.`+(good===5?' 이제 두 정렬 단추를 차례로 눌러 순서를 비교해 보세요.':' ✗ 칸은 realSum을 person_capacity로 나눈 값인지 다시 계산해 보세요.');
    MEMO.chargeCalc=`5곳 중 ${good}곳 맞음`; store.set(MK,MEMO);
  };
  const sortBy=(key,label)=>{
    if(!allGood()){ $('paCalcMsg').innerHTML='charge 5칸을 모두 맞게 채운 뒤에 정렬해 보세요. (「확인하기」로 맞는지 먼저 봐요)'; return; }
    order=R.map((_,i)=>i).sort((a,b)=>key(R[b])-key(R[a])); checked=true; draw();
    const s=rank(r=>r.sum), c=rank(ch);
    const moved=R.filter(r=>s.indexOf(r.id)!==c.indexOf(r.id)).map(r=>`${r.id}(${s.indexOf(r.id)+1}위 → ${c.indexOf(r.id)+1}위)`);
    $('paCalcMsg').innerHTML=`${label} 큰 순서로 정렬했어요: <b>${(label==='총 숙박비'?s:c).join(' → ')}</b>.`+(label==='charge'?` 총 숙박비 순서(${s.join(' → ')})와 비교하면 순위가 바뀐 숙소: ${moved.join(', ')}. 어느 숙소가 왜 바뀌었는지 아래 메모에 적어요.`:' 이번에는 charge 큰 순서로도 정렬해 비교해 보세요.');
  };
  $('paSortSum').onclick=()=>sortBy(r=>r.sum,'총 숙박비');
  $('paSortCh').onclick=()=>sortBy(ch,'charge');
  const reset=()=>{inp=[]; order=R.map((_,i)=>i); checked=false; draw(); $('paCalcMsg').textContent='표의 charge 칸 5개를 채워 보세요.';};
  $('paCalcRe').onclick=()=>{reset(); MEMO.chargeCalc=''; store.set(MK,MEMO);};
  reset();
})();

/* 03 Data Table (1)에서 찾은 최솟값·최댓값 */
paCheck('paMinMax',[
  {l:'charge 최솟값',a:8.85,tol:0.006,show:'8.85 (8.8515)'},
  {l:'charge 최댓값',a:9272.73,tol:0.006,show:'9,272.73'}
],s=>{MEMO.chargeMinMax=s; store.set(MK,MEMO);});

/* 04 도시별 대푯값 탐색기 */
(function(){
  let ak='charge', stat='m', sort='name';
  const val=(c,a)=>a.k==='n'?c.n:c[stat][a.k];
  $('paAttrPick').innerHTML=PA_ATTR.map(a=>`<button data-k="${a.k}"><b>${a.ko}</b><small>${a.en}</small></button>`).join('');
  $('paStatSeg').innerHTML='<button data-v="m">평균</button><button data-v="d">중앙값</button>';
  $('paSortSeg').innerHTML='<button data-v="name">도시 이름순</button><button data-v="asc">작은 값부터</button><button data-v="desc">큰 값부터</button>';
  function draw(){
    const a=PA_ATTR.find(x=>x.k===ak);
    $('paAttrPick').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.k===ak));
    $('paStatSeg').querySelectorAll('button').forEach(b=>{b.classList.toggle('on',b.dataset.v===stat); b.disabled=!!a.noMed;});
    $('paSortSeg').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.v===sort));
    let rows=PA_CITY.slice();
    if(sort==='asc') rows.sort((x,y)=>val(x,a)-val(y,a)); else if(sort==='desc') rows.sort((x,y)=>val(y,a)-val(x,a));
    const mx=Math.max(...PA_CITY.map(c=>val(c,a)));
    $('paBars').innerHTML=rows.map(c=>{const v=val(c,a); return `<div class="pa-br"><span class="pa-bn">${c.ko}<small>${c.k}</small></span><span class="pa-bt"><i style="width:${(v/mx*100).toFixed(1)}%"></i></span><b>${paFix(v,a.dec)}</b></div>`;}).join('');
    const nm=a.k==='n'?'도시별 숙소 수(Box Plot ①과 같은 값)':`도시별 ${a.ko}(${a.en}) ${a.noMed||stat==='m'?'평균':'중앙값'}`;
    $('paBarMsg').innerHTML=`<b>${nm}</b>`+(a.k!=='n'&&stat==='d'?' · 중앙값으로 바꾸었을 때 평균과 순서가 달라지는 도시가 있는지 보세요.':'');
  }
  $('paAttrPick').querySelectorAll('button').forEach(b=>b.onclick=()=>{ak=b.dataset.k; draw();});
  $('paStatSeg').querySelectorAll('button').forEach(b=>b.onclick=()=>{stat=b.dataset.v; draw();});
  $('paSortSeg').querySelectorAll('button').forEach(b=>b.onclick=()=>{sort=b.dataset.v; draw();});
  draw();
})();

/* 04 (막혔을 때) 도시별 숙박 인원 상자 그림 */
(function(){
  const S=$('paBox'), W=560, H=36+PA_CITY.length*30, X=v=>150+(v-2)/4*380;
  S.setAttribute('viewBox',`0 0 ${W} ${H}`);
  for(let v=2;v<=6;v++){ el('line',{x1:X(v),x2:X(v),y1:20,y2:H-14,class:'gl'},S); el('text',{x:X(v),y:14,class:'tk','text-anchor':'middle'},S,v+'인'); }
  PA_CITY.forEach((c,i)=>{
    const y=34+i*30, [mn,q1,md,q3,mx]=c.pc;
    el('text',{x:140,y:y+4,class:'lb','text-anchor':'end'},S,c.ko);
    el('line',{x1:X(mn),x2:X(mx),y1:y,y2:y,class:'wh'},S);
    el('rect',{x:X(q1),y:y-9,width:Math.max(X(q3)-X(q1),2),height:18,rx:3,class:'bx'},S);
    el('line',{x1:X(md),x2:X(md),y1:y-11,y2:y+11,class:'md'},S);
    const m=c.m.person_capacity; el('path',{d:`M${X(m)} ${y-5}L${X(m)+5} ${y}L${X(m)} ${y+5}L${X(m)-5} ${y}z`,class:'mn'},S);
  });
})();

/* 05 마무리 */
const MEMOLIST=[['planCrit','여행지를 고를 때 나의 기준'],['planTrip','가장 중요한 기준과 그 까닭'],['done1Pick','진행 체크 ①'],['readVals','결과 읽기(오렌지3에서 찾은 값)'],['readNote','realSum 평균과 중앙값을 비교해 알게 된 점'],['missPick','realSum 결측치 2개 처리(고른 방법)'],['missTalk','결측치 처리 방법과 그 까닭'],['chargeCalc','Formula 미리 해 보기'],['chargeMinMax','charge 최솟값·최댓값'],['chargeWhy','1인당 숙박비로 비교하는 까닭'],['done2Pick','진행 체크 ②'],['distNear','스스로 해결하기: 도심과 가까운 곳'],['distFar','스스로 해결하기: 도심과 먼 곳'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[5]=()=>memoSummary('msum',MEMOLIST);

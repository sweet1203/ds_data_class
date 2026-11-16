/* u4-movie-1 전용 (mv1-) — 공용 부품 orangeFlow · bars · sorter · chips 사용 */

/* 0 시작 · 모둠 역할 (교과서 199쪽 역할 예시) */
chips('mvRole','mvRole',['프로젝트 기획자','데이터 수집가','데이터 분석가','모델 개발자','프로젝트 발표자'],true);

/* 01 분석 단위 고르기 */
sorter('mvUnitSort',{
  cats:[{n:'영화 한 편 = 한 줄',k:'#c98a00'},{n:'리뷰 하나 = 한 줄',k:'#1f9d74'}],
  items:[
    {t:'실관람객 평점 참여자 수와 관객 수의 관계를 산점도로 보기',short:'참여자 수 × 관객 수 산점도',c:0,ic:'📈',w:'영화마다 값이 하나인 속성끼리 견주는 그림이라, 리뷰가 많은 영화가 여러 번 찍히지 않게 묶은 표를 써요.'},
    {t:'개봉일과 관객 수 사이에 어떤 경향이 있는지 보기',short:'개봉일 × 관객 수',c:0,ic:'📅',w:'개봉일과 관객 수도 영화마다 하나씩인 값이라 영화별로 묶은 표에서 봐요.'},
    {t:'평론가 리뷰에 자주 나오는 낱말 세기',short:'리뷰 낱말 세기',c:1,ic:'🔤',w:'리뷰 글 하나하나가 분석할 문서예요. 리뷰마다 낱말을 나누어 세요.'},
    {t:'평론가 한 명 한 명이 준 평점이 어떻게 퍼져 있는지 보기',short:'평론가 평점의 퍼짐',c:1,ic:'⭐',w:'평론가 평점은 리뷰마다 달라요. 묶으면 평균 하나만 남아 퍼진 모습을 볼 수 없어요.'},
    {t:'고관객군과 저관객군 리뷰의 워드 클라우드 비교하기',short:'두 묶음 워드 클라우드',c:1,ic:'☁️',w:'관객 수로 고른 리뷰 줄들을 문서로 삼아 낱말을 세요.'}
  ],
  end:'<b>정리</b> 영화끼리 숫자를 견줄 때는 <b>영화명으로 묶은 표</b>, 리뷰 글을 분석할 때는 <b>리뷰 줄</b>을 그대로 써요. 오렌지3에서도 Scatter Plot은 Group by 뒤에, Corpus는 Select Rows 뒤에 이어요.'
});

/* 02 리뷰 전처리 체험 — 예시 리뷰는 지어낸 글, 불용어는 예시 목록 */
const MV_REV=[
  ['예시 리뷰 ①','새로운 시도가 돋보이는 영화! 그리고 배우들의 연기가 정말 좋았다. 영화가 끝나도 음악이 계속 생각난다.'],
  ['예시 리뷰 ②','액션은 화려하지만… 이야기가 너무 길다. 그래도 액션 장면은 정말 새로운 느낌! 음악도 좋았다.'],
  ['예시 리뷰 ③','가족과 함께 보기 좋은 영화. 배우들의 연기도 좋았다. 다만 (중간) 부분은 조금 지루했다…']
];
const MV_SW='그리고, 그래도, 다만, 정말, 너무, 조금, 또, 함께, 은, 는, 이, 가, 을, 를, 의, 에, 도';
/* 낱말과 문장부호를 따로 토큰으로 나눔 → Regexp는 특수 문자 패턴에 맞는 토큰을 걸러 냄 */
const MV_TOK=/[0-9A-Za-z가-힣ㄱ-ㅎㅏ-ㅣ]+|[^\s0-9A-Za-z가-힣ㄱ-ㅎㅏ-ㅣ]+/g;
const MV_RE=/^[.,:;!?()|+'"‘’“”…\-–—$&*><\/\[\]~·]+$/;
$('mvPick').innerHTML=MV_REV.map((r,i)=>`<button class="btn ghost sm" data-i="${i}">${r[0]}</button>`).join('')+'<button class="btn ghost sm" data-i="all">예시 리뷰 3개 모두</button>';
$('mvPick').querySelectorAll('button').forEach(b=>b.onclick=()=>{
  $('mvIn').value=b.dataset.i==='all'?MV_REV.map(r=>r[1]).join('\n'):MV_REV[+b.dataset.i][1];
  $('mvPick').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b)); mvRun();
});
$('mvIn').value=MV_REV[0][1]; $('mvPick').querySelector('button').classList.add('on');
$('mvSw').value=MV_SW;
function mvRun(){
  const useRe=$('mvOptRe').checked, useSw=$('mvOptSw').checked;
  const sw=new Set($('mvSw').value.split(/[,，]/).map(s=>s.trim().toLowerCase()).filter(Boolean));
  const raw=$('mvIn').value.toLowerCase().match(MV_TOK)||[];
  const keep=[]; let html='';
  raw.forEach(t=>{
    if(useRe&&MV_RE.test(t)){ html+=`<span class="x" title="특수 문자 토큰이라 걸러짐">${esc(t)}</span>`; return; }
    if(useSw&&sw.has(t)){ html+=`<span class="x" title="불용어라 빠짐">${esc(t)}</span>`; return; }
    keep.push(t); html+=`<span${/^[0-9A-Za-z가-힣ㄱ-ㅎㅏ-ㅣ]+$/.test(t)?'':' class="ch" title="특수 문자 토큰"'}>${esc(t)}</span>`;
  });
  $('mvTok').innerHTML=html||'<span class="muted">리뷰를 써 보세요.</span>';
  const cnt={}; keep.forEach(w=>cnt[w]=(cnt[w]||0)+1);
  const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'ko')).slice(0,8);
  $('mvCount').innerHTML=`<div>전 · 토큰 <b>${raw.length}</b>개 · 종류 <b>${new Set(raw).size}</b>개</div><div>후 · 토큰 <b>${keep.length}</b>개 · 종류 <b>${Object.keys(cnt).length}</b>개</div>`;
  if(top.length) bars('mvFreq',top.map(([w,n],i)=>[w,n,i?'#8fcfb8':'#1f9d74']),{horiz:true,max:Math.max(3,top[0][1]),left:100});
  else $('mvFreq').innerHTML='';
  const mx=top.length?top[0][1]:1;
  $('mvCloud').innerHTML=shuffle(Object.entries(cnt)).map(([w,n],i)=>`<span style="font-size:${(0.85+1.1*n/mx).toFixed(2)}rem;color:${PAL[i%PAL.length]}">${esc(w)}</span>`).join(' ');
}
['mvIn','mvSw'].forEach(id=>$(id).addEventListener('input',mvRun));
['mvOptRe','mvOptSw'].forEach(id=>$(id).addEventListener('change',mvRun));
mvRun();

/* 03 오렌지3 흐름도 + 설정 표 + 진행 칩 (Text 애드온 위젯은 공용 색표에 없어 이 차시에서만 색을 더함) */
OF_COL['Text Mining']=OF_COL['Text Mining']||'#9cc3e6';
orangeFlow({svg:'mvFlow', table:'mvSet',
  nodes:[
    {s:1,t:'File',sub:'영화 데이터.xlsx',c:'Data',x:10,y:150},
    {s:2,t:'Data Table',sub:'877줄 확인',c:'Data',x:230,y:10},
    {s:3,t:'Group by',sub:'영화명 → 143',c:'Transform',x:230,y:80},
    {s:4,t:'Scatter Plot',sub:'x 평점 · y 관객 수',c:'Visualize',x:450,y:80},
    {s:5,t:'Select Rows',sub:'관객 수 > 300만',c:'Transform',x:230,y:190},
    {s:6,t:'Select Rows (1)',sub:'관객 수 < 100만',c:'Transform',x:230,y:270},
    {s:7,t:'Corpus',sub:'평론가 리뷰',c:'Text Mining',x:450,y:190},
    {s:8,t:'Corpus (1)',sub:'평론가 리뷰',c:'Text Mining',x:450,y:270},
    {s:9,t:'Preprocess Text',sub:'Stopwords · Regexp',c:'Text Mining',x:670,y:190},
    {s:10,t:'Preprocess Text (1)',sub:'Stopwords · Regexp',c:'Text Mining',x:670,y:270},
    {s:11,t:'Word Cloud',sub:'고관객군 영화',c:'Text Mining',x:890,y:190},
    {s:12,t:'Word Cloud',sub:'저관객군 영화',c:'Text Mining',x:890,y:270}
  ],
  edges:[[1,2],[1,3],[3,4],[1,5],[1,6],[5,7],[6,8],[7,9],[8,10],[9,11],[10,12]],
  done:{box:'mvDone', key:'mvDone', items:['File로 877줄 확인','Group by 143개 그룹','산점도 두 개 비교','Select Rows 두 개','Text 애드온 설치','Corpus · Preprocess Text','Word Cloud 두 개 비교']}});

/* 03 개수와 비율 — 교과서 실습 파일을 집계한 값(DESIGN.md) */
$('mvRateBtn').onclick=()=>{
  const h=24/189*100, l=27/385*100;
  $('mvRateH').textContent='약 '+h.toFixed(1)+'번'; $('mvRateL').textContent='약 '+l.toFixed(1)+'번';
  $('mvRateSay').innerHTML=`나온 횟수만 보면 저관객군(27번)이 더 많지만, 리뷰 수를 맞춰 보면 고관객군(${h.toFixed(1)}번)에서 더 자주 나왔어요. 리뷰 수가 다른 묶음은 이렇게 <b>비율</b>로 견줘요. 그래도 이 차이만으로 「새로운」이라는 평이 흥행을 <b>일으켰다</b>고 말할 수는 없어요.`;
};

/* 04 마무리 */
const MEMOLIST=[['mvRole','우리 모둠에서 맡은 역할'],['mvPlan','우리 모둠의 문제와 쓰임'],['mvGroup','영화명으로 묶는 까닭 · 리뷰 줄을 쓰는 까닭'],['mvPre','리뷰 전처리 전과 후'],['mvDone','오렌지3 진행 체크'],['mvViz','산점도 · 워드 클라우드 관찰과 한계'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[4]=()=>{
  const p=String(MEMO.mvPlan||'').trim();
  $('mvPlanShow').textContent=p?'「'+(p.length>60?p.slice(0,60)+'…':p)+'」':'아직 쓰지 않음';
  memoSummary('msum',MEMOLIST);
};

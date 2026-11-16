/* u4-team-project 전용 (tp-) — 공용 부품 vote · chips · tabs · sorter · orangeFlow 사용 */

/* 세 주제 요약: 교과서 자료실 194쪽 원본 파일을 세어 정리한 값(실제 행은 싣지 않음) */
/* t: num 숫자 · cat 범주 · agg 집계해서 만들 숫자 · id 번호·이름·주소 · date 날짜 · bad 대부분 비었거나 깨짐 */
const TP_IC={num:'🔢',cat:'🏷️',agg:'🧮',id:'🪪',date:'📅',bad:'⚠️'};
const TP_T=[
 {n:'문화 · 연령대별 선호 공연 분석', ic:'🎭',
  sub:'예술의 전당 공연·전시 예매자 정보<br>3,664,663행 × 16열',
  peek:'예매 한 건이 한 행이에요. 공연명 · 공연장 · 공연일 · <b>장르</b> · 결제 금액 · 할인 내용 · 회원 등급 · <b>연령대</b> · 성별 · 지역 · 환불 여부 등. 열 이름이 영문 약어(예: GENRE_NM, BN_VALUE)라 열 설명을 먼저 맞춰 봐요.',
  check:[
   ['데이터 개수','3,664,663행 · 파일 약 1GB','오렌지3에서 한 번에 열기 어려워요. 기간을 줄인 파일이 필요해요.'],
   ['속성 개수','16열 · 공연일 2015~2023년','열 이름은 영문 약어예요. 값을 보고 뜻을 짐작했다면 제공처 설명으로 확인해요.'],
   ['결측치','지역 87,453칸(약 2.4%) · 가격 내용 19,797칸 · 성별 2칸 · 연령대 「모름」 24,905행','「모름」은 빈칸은 아니지만 연령대를 알 수 없는 값이에요.'],
   ['이상치 · 이상한 값','결제 금액 0원 37,211행 · 환불 여부 Y 약 177만 행(약 48%)','환불된 예매까지 세면 선호가 부풀 수 있어요. 0원은 무료 예매인지 확인해요.'],
   ['중복','16개 열 값이 모두 같은 줄이 되풀이되는 행 약 156만(처음 한 줄 제외)','한 번에 여러 장을 예매한 것인지, 같은 기록이 겹친 것인지 확인한 뒤 처리해요.'],
   ['출처 · 이용 조건','문화 빅데이터 플랫폼 공개 데이터(교과서 자료실 파일)','제공처의 이용 조건과 출처 표시 방법을 확인해요.'],
   ['개인정보','이름은 없고 연령대 · 성별 · 지역만 있음','아주 작은 집단으로 쪼개 발표하면 사람을 짐작할 수 있어 조심해요.']],
  attrs:[
   {n:'GENRE_NM',d:'장르',t:'cat'},{n:'BN_VALUE',d:'연령대',t:'cat'},{n:'SEXDSTN_VALUE',d:'성별',t:'cat'},{n:'OC_AREA_NM',d:'지역',t:'cat'},
   {n:'MBER_GRAD_NM',d:'회원 등급',t:'cat'},{n:'PBLPRFR_PLACE_NM',d:'공연장',t:'cat'},{n:'DSCNT_CN',d:'할인 내용',t:'cat'},{n:'RFN_AT',d:'환불 여부',t:'cat'},
   {n:'SETLE_PRICE',d:'결제 금액',t:'num'},{n:'PBLPRFR_DE',d:'공연일',t:'date'},{n:'PBLPRFR_NM',d:'공연명',t:'id'},{n:'HMPG_URL',d:'홈페이지 주소',t:'id'},
   {n:'연령대·장르별 예매 수',d:'집계',t:'agg'},{n:'공연별 예매 수',d:'집계',t:'agg'}],
  same:{},
  assoc:'예매 한 줄에 공연이 하나뿐이고 예매한 사람을 구별하는 열이 없어, 「함께 예매한 공연」 묶음을 만들 수 없어요.',
  note:'환불된 예매(환불 여부 Y)를 셀지 뺄지 먼저 정해요.'},
 {n:'반려동물 · 지역 생활 정보 분석', ic:'🐶',
  sub:'서울시 반려동물 지역 생활 정보<br>4,109행 × 15열',
  peek:'시설 한 곳이 한 행이에요. 시설 이름 · <b>시설 종류</b>(동물병원 · 동물약국 · 생활체육관 · 수영장 등 33종) · <b>주소</b> · 상태 · 입력 일시 등. 숫자 속성이 거의 없어 구별로 개수를 세어 숫자를 만들어야 해요.',
  check:[
   ['데이터 개수','4,109행 · 동물병원 1,785 · 동물약국 1,505 · 그 밖의 시설 819','파일 첫 줄은 비어 있고 둘째 줄이 열 이름이에요.'],
   ['속성 개수','15열 · 숫자 속성은 줄 번호뿐','주소에서 구 이름을 뽑아 구별 개수를 세면 숫자 속성을 만들 수 있어요.'],
   ['결측치 · 깨진 값','설명 · 위치 관련 3개 열이 3,358칸(약 82%) 비어 있음 · 값이 있어도 「com.tmax.…」처럼 내용 대신 프로그램 주소가 들어 있음','내용이 깨진 열은 분석에 쓸 수 없어요.'],
   ['이상치 · 섞인 값','상태 열에 영업 상태(정상 1,756 · 폐업 1,580 · 휴업 · 말소)와 실내 · 실외가 섞여 있음','한 열에 서로 다른 뜻이 섞여 통일성이 떨어져요. 폐업한 시설은 지금 생활 정보에서 빼야 해요.'],
   ['중복 · 최신성','이름과 주소가 같은 행 210행 · 입력 일시가 모두 2020-12-16','겹친 시설인지 확인하고, 지금 상황과 다를 수 있음을 밝혀요.'],
   ['형식','파일 확장자는 .xls인데 속은 .xlsx 형식','오렌지3 File에서 오류가 나요. 확장자를 .xlsx로 바꾼 파일을 써요.'],
   ['출처 · 이용 조건','파일 안 기록: 서울시 열린데이터광장','제공처의 이용 조건과 출처 표시 방법을 확인해요.']],
  attrs:[
   {n:'SUBJECTCATEGORY',d:'시설 종류',t:'cat'},{n:'STATE',d:'상태',t:'cat'},{n:'VENUE',d:'주소',t:'id'},{n:'TITLE',d:'시설 이름',t:'id'},{n:'RNUM',d:'줄 번호',t:'id'},
   {n:'INSERTDATE',d:'입력 일시',t:'date'},{n:'DESCRIPTION 등',d:'설명 · 위치',t:'bad'},
   {n:'구별 동물병원 수',d:'집계',t:'agg'},{n:'구별 동물약국 수',d:'집계',t:'agg'},{n:'구별 공원·체육시설 수',d:'집계',t:'agg'}],
  same:{},
  assoc:'시설 한 곳이 한 행이라, 한 번의 거래처럼 함께 나타난 항목 묶음이 없어요.',
  note:'폐업 · 말소된 시설을 뺄지 먼저 정해요.'},
 {n:'스포츠 · 세계 축구 선수 기량 분석', ic:'⚽',
  sub:'축구 게임 속 선수 기량 데이터<br>17,660행 × 29열',
  peek:'선수 한 명이 한 행이에요. 이름 · <b>나이</b> · <b>종합 능력치</b>(Overall) · <b>잠재력</b>(Potential) · 가치 · 주급 · 포지션 · 선호하는 발 · 키 · 몸무게 등. 금액 · 키 · 몸무게를 숫자로 바꾼 CLEAN 파일(31열)도 함께 있어요.',
  check:[
   ['데이터 개수','17,660행 · 같은 선수 ID 겹침 없음','선수 한 명이 한 행이에요.'],
   ['속성 개수','원본 29열 · CLEAN 파일 31열','CLEAN 파일은 금액 · 키 · 몸무게가 숫자라 다루기 쉬워요.'],
   ['결측치','임대 구단 16,966칸(약 96%) · 원본의 최고 종합 능력치 17,639칸 · 입단일 1,098칸 · 방출 조항 1,151칸','임대 선수가 아니면 임대 구단이 비는 것이 자연스러워요. CLEAN 파일은 최고 종합 능력치 빈칸을 0으로 채웠어요.'],
   ['이상치 · 이상한 값','가치 0인 선수 283명 · 나이 15~54세 · 포지션의 절반 넘게 SUB(교체) · RES(예비)','0과 SUB · RES가 실제 값인지, 기록이 없다는 뜻인지 확인해요.'],
   ['형식 · 단위','원본 금액은 「€91M」 같은 글자(유로) · CLEAN 열 이름은 £(파운드)','숫자로 바꾸면서 단위 표기가 달라졌어요. 단위를 확인하고 하나로 밝혀요.'],
   ['출처 · 이용 조건','캐글 공개 데이터(축구 게임의 능력치)','실제 경기 기록이 아니라 게임이 매긴 값이에요. 라이선스를 확인해요.'],
   ['개인정보','실제 선수 이름 · 사진 주소 포함','이름 · 사진은 분석에 쓰지 않고, 발표 자료에 실을 때 조심해요.']],
  attrs:[
   {n:'Overall',d:'종합 능력치',t:'num'},{n:'Potential',d:'잠재력',t:'num'},{n:'Age',d:'나이',t:'num'},{n:'Value(£)',d:'가치',t:'num'},{n:'Wage(£)',d:'주급',t:'num'},
   {n:'Release Clause(£)',d:'방출 조항 금액',t:'num'},{n:'Height(cm.)',d:'키',t:'num'},{n:'Weight(lbs.)',d:'몸무게',t:'num'},{n:'International Reputation',d:'국제적 명성',t:'num'},
   {n:'Skill Moves',d:'기술 동작',t:'num'},{n:'Preferred Foot',d:'선호하는 발',t:'cat'},{n:'Position',d:'포지션',t:'cat'},{n:'Name',d:'이름',t:'id'},
   {n:'Loaned From',d:'임대 구단',t:'bad'},{n:'Best Overall Rating',d:'최고 종합 능력치',t:'bad'}],
  same:{'Value(£)':['Release Clause(£)'],'Release Clause(£)':['Value(£)']},
  assoc:'선수 한 명이 한 행이라, 한 번의 거래처럼 함께 나타난 항목 묶음이 없어요.',
  note:'게임이 매긴 능력치라 실제 경기 기록과 다를 수 있어요.'}
];
const tpLab=a=>`${TP_IC[a.t]} ${a.n} (${a.d})`;
const TP_NONE='없음 (맞힐 결과 없음)';
let tpCur=null;

/* 0 시작 · 내 역할 */
chips('tpMyRole','myRole',['팀장','기술자','기록자','그 밖의 역할'],false);

/* 02 데이터 점검 카드 (탭) */
tabs('tpDsBtn','tpDsView',TP_T,T=>`<div class="tp-tw"><table class="tbl tp-ck"><tr><th>확인 사항</th><th>원본 파일 요약</th><th>생각해 볼 점</th></tr>${T.check.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table></div><p class="note">${T.n} · 교과서 자료실 194쪽 폴더의 원본 파일을 세어 정리했어요.</p>`);

/* 01 주제 고르기 → 02 탭 · 03 보드 연결 */
vote('tpTopic','topic',TP_T.map(T=>[`${T.ic} ${T.n}`,T.sub]),i=>{
  if(tpCur!==null&&tpCur!==i){ delete MEMO.bTarget; delete MEMO.bFeat; store.set(MK,MEMO); tpFbReset(); }
  tpCur=i;
  $('tpPeek').innerHTML=`<b>${TP_T[i].ic} 주요 속성</b> ${TP_T[i].peek}`;
  const tb=$('tpDsBtn').querySelectorAll('button')[i]; if(tb) tb.click();
  tpBoard();
});

/* 02 시각화 짝 짓기 */
sorter('tpVizSort',{
  cats:[{n:'막대그래프',k:'#2f6fd0'},{n:'히스토그램',k:'#1f9d74'},{n:'산점도',k:'#e0702b'},{n:'상자 그림',k:'#9b4fc4'}],
  items:[
    {t:'연령대마다 예매 수가 얼마나 다른지 견주어 보기',short:'연령대별 예매 수',c:0,ic:'🎭',w:'범주(연령대)마다 하나의 수를 나란히 비교할 때는 막대의 길이로 보는 것이 쉬워요.'},
    {t:'구마다 동물병원이 몇 곳인지 나란히 비교하기',short:'구별 동물병원 수',c:0,ic:'🐶',w:'구 이름은 범주이고 비교할 값은 개수라서 막대 길이로 비교해요.'},
    {t:'선수 나이가 어느 구간에 많이 몰려 있는지 보기',short:'선수 나이 구간',c:1,ic:'⚽',w:'숫자 하나를 구간으로 나누어 구간마다 몇 명인지 보면 몰린 곳이 드러나요.'},
    {t:'결제 금액은 얼마쯤인 예매가 가장 많은지 구간별로 보기',short:'결제 금액 구간',c:1,ic:'💳',w:'한 숫자 속성의 구간별 빈도를 보는 것이라 히스토그램이 알맞아요.'},
    {t:'잠재력이 높은 선수일수록 가치도 높은지 살펴보기',short:'잠재력과 가치',c:2,ic:'📈',w:'두 숫자 속성을 가로축 · 세로축에 두고 점이 어떤 방향으로 놓이는지 봐요.'},
    {t:'포지션마다 주급이 퍼진 정도와 튀는 값을 비교하기',short:'포지션별 주급',c:3,ic:'📦',w:'중앙값 · 사분위 범위와 튀는 값을 집단끼리 한눈에 비교할 수 있어요.'}
  ],
  end:'<b>정리</b> 범주끼리 수 비교는 막대그래프, 숫자 하나의 분포는 히스토그램, 두 숫자의 관계는 산점도, 집단마다 퍼진 정도와 튀는 값은 상자 그림으로 봐요.'
});

/* 03 프로젝트 설계 보드 */
chips('tpMethod','bMethod',['회귀분석','k-평균 군집 분석','연관분석'],false);
chips('tpMetric','bMetric',['MSE','R²','실루엣 계수','지지도·신뢰도·향상도'],true);
function tpBoard(){
  const T=TP_T[tpCur];
  if(!T){ ['tpTarget','tpFeat'].forEach(id=>$(id).innerHTML='<p class="muted" style="margin:0">01에서 주제를 고르면 속성이 보여요.</p>'); $('tpBoardTopic').textContent=''; return; }
  const labs=T.attrs.map(tpLab);
  if(MEMO.bTarget&&![TP_NONE,...labs].includes(MEMO.bTarget)) delete MEMO.bTarget;
  if(MEMO.bFeat) MEMO.bFeat=MEMO.bFeat.split(' · ').filter(x=>labs.includes(x)).join(' · ');
  chips('tpTarget','bTarget',[TP_NONE,...labs],false);
  chips('tpFeat','bFeat',labs,true);
  $('tpBoardTopic').textContent='· '+T.ic+' '+T.n;
}
function tpFbReset(){ $('tpFb').className='tp-fb'; $('tpFb').textContent='보드를 고른 뒤 「연결 점검」을 눌러요.'; }
function tpCheck(){
  const T=TP_T[tpCur], fb=$('tpFb');
  if(!T){ fb.className='tp-fb'; fb.innerHTML='01에서 모둠의 주제를 먼저 골라요.'; return; }
  const byLab={}; T.attrs.forEach(a=>byLab[tpLab(a)]=a);
  const M=MEMO.bMethod||'', tg=MEMO.bTarget&&MEMO.bTarget!==TP_NONE?byLab[MEMO.bTarget]:null;
  const F=(MEMO.bFeat||'').split(' · ').filter(Boolean).map(x=>byLab[x]).filter(Boolean);
  const met=(MEMO.bMetric||'').split(' · ').filter(Boolean);
  const R=[], inf=[], ok=t=>R.push([1,t]), ng=t=>R.push([0,t]), info=t=>inf.push(t), nm=a=>`<b>${a.n}</b>(${a.d})`;
  /* 질문 */
  if(String(MEMO.why||'').trim().length>=10) ok('01에 데이터로 확인할 질문을 적어 두었어요.'); else ng('01에서 데이터로 확인할 질문을 먼저 써요.');
  /* 결과 속성 */
  if(!M) ng('분석 방법을 하나 골라요.');
  else if(M==='회귀분석'){
    if(!tg) ng('회귀분석은 예측할 <b>숫자 결과</b>(target)가 있어야 해요. 결과 속성을 골라요.');
    else if(tg.t==='num'||tg.t==='agg') ok(`결과로 고른 ${nm(tg)} 속성은 숫자라서 회귀분석으로 예측할 수 있어요.`);
    else if(tg.t==='cat') ng(`${nm(tg)} 속성은 범주라서 회귀분석의 결과로 쓰기 어려워요. 숫자 결과를 고르거나 개수를 세어 숫자로 만들어요.`);
    else ng(`${nm(tg)} 속성은 ${tg.t==='id'?'구별용 번호 · 이름 · 주소':tg.t==='date'?'날짜':'대부분 비었거나 깨진 값'}라서 결과로 쓸 수 없어요.`);
  } else {
    if(tg) ng(`${M==='연관분석'?'연관분석':'군집 분석'}은 맞힐 결과 없이 데이터를 살펴요. 결과 속성은 「없음」으로 두고, ${nm(tg)} 속성은 결과를 해석할 때 참고해요.`);
    else ok('맞힐 결과 없이 살펴보는 방법이라 결과 속성을 비워 두었어요.');
  }
  /* 사용할 속성 */
  if(!F.length) ng('사용할 속성(feature)을 골라요.');
  else {
    let bad=0;
    if(tg&&F.includes(tg)){ bad++; ng(`결과로 고른 ${nm(tg)} 속성을 사용할 속성에도 넣었어요. 맞힐 답을 문제에 넣은 셈이에요.`); }
    F.filter(a=>a.t==='id').forEach(a=>{bad++; ng(`${nm(a)} 속성은 구별용 번호 · 이름 · 주소라서 분석 속성으로 쓰지 않아요(meta로 두기).`);});
    F.filter(a=>a.t==='bad').forEach(a=>{bad++; ng(`${nm(a)} 속성은 대부분 비었거나 값이 깨져 있어 분석에 쓰기 어려워요.`);});
    if(tg) F.filter(a=>(T.same[tg.n]||[]).includes(a.n)).forEach(a=>{bad++; ng(`${nm(a)} 속성은 결과 ${nm(tg)} 속성과 거의 같은 정보예요. 모델이 잘 맞혀 보여도 쓸모 있는 예측이 아니에요.`);});
    const all=tg?[tg,...F]:F;
    if(all.some(a=>a.t==='agg')&&all.some(a=>a.t!=='agg')){ bad++; ng('집계해서 만들 속성(🧮)과 한 행 단위 속성을 섞었어요. 집계하면 한 행의 단위가 바뀌므로(예: 시설 하나 → 구 하나) 같은 단위의 속성끼리 골라요.'); }
    if(M==='k-평균 군집 분석'){
      F.filter(a=>a.t==='cat'||a.t==='date').forEach(a=>{bad++; ng(`k-평균은 숫자 사이의 거리로 묶어요. ${nm(a)} 속성은 빼거나 개수처럼 숫자로 바꿔요.`);});
      if(F.filter(a=>a.t==='num'||a.t==='agg').length<2){ bad++; ng('거리를 재어 묶으려면 숫자 속성이 2개 이상 필요해요.'); }
    }
    if(M==='회귀분석'&&F.some(a=>a.t==='date')) info('날짜는 그대로 넣기보다 연도 · 요일처럼 바꿔 쓰는 방법을 생각해 봐요.');
    if(!bad) ok(`사용할 속성 ${F.length}개가 결과 속성 · 분석 방법과 맞아요.`);
  }
  if(M==='연관분석') ng(T.assoc);
  if((tg&&tg.t==='agg')||F.some(a=>a.t==='agg')) info('🧮 속성은 원본에 없어요. 오렌지3 Group by로 먼저 개수를 세어 새 표를 만들어요.');
  /* 평가 지표 */
  const want={'회귀분석':['MSE','R²'],'k-평균 군집 분석':['실루엣 계수'],'연관분석':['지지도·신뢰도·향상도']}[M];
  if(!met.length) ng('평가 지표를 골라요.');
  else if(want){
    const off=met.filter(x=>!want.includes(x));
    if(off.length) ng(`${off.join(', ')}은(는) ${M}의 결과를 평가하는 지표가 아니에요. ${M}에는 ${want.join(' · ')}를 써요.`);
    else ok(`${met.join(' · ')}로 ${M}의 결과를 평가할 수 있어요.`);
  }
  info(T.note);
  const wl=String(MEMO.why||'').split('\n').map(x=>x.trim()).filter(Boolean), q=(wl.find(x=>/질문/.test(x))||wl[0]||'질문 미정').replace(/^[^:：]*질문\s*[:：]\s*/,'');
  const n=R.filter(r=>r[0]).length, line=`${esc(q)} → ${tg?'결과 '+nm(tg)+' · ':''}${F.length?'사용할 속성 '+F.map(nm).join(', '):'(속성 미정)'} → ${M||'(방법 미정)'} → ${met.length?met.join(' · ')+'로 평가':'(지표 미정)'}`;
  fb.className='tp-fb '+(n===R.length?'all':'some');
  fb.innerHTML=`<div class="tp-sc">${n===R.length?'끊긴 곳이 없어요. 고른 까닭을 아래 메모에 써요.':`다시 볼 줄 <b>${R.length-n}개</b> — △ 줄을 고쳐 다시 점검해요.`}</div><ul>${R.map(r=>`<li class="${r[0]?'ok':'ng'}">${r[0]?'✓':'△'} <span>${r[1]}</span></li>`).join('')}${inf.map(t=>`<li class="in">ℹ️ <span>${t}</span></li>`).join('')}</ul><div class="tp-line"><b>우리 설계 한 줄</b> ${line}</div>`;
}
$('tpCheck').onclick=tpCheck;
$('tpReset').onclick=()=>{ ['bMethod','bTarget','bFeat','bMetric'].forEach(k=>delete MEMO[k]); store.set(MK,MEMO);
  chips('tpMethod','bMethod',['회귀분석','k-평균 군집 분석','연관분석'],false);
  chips('tpMetric','bMetric',['MSE','R²','실루엣 계수','지지도·신뢰도·향상도'],true);
  tpBoard(); tpFbReset(); };
tpBoard();
onShow[3]=()=>{
  const w=String(MEMO.why||'').trim();
  $('tpQ').innerHTML=w?esc(w).replace(/\n/g,'<br>'):'<span class="muted">01에서 아직 쓰지 않았어요. 01로 돌아가 질문을 먼저 써요.</span>';
  $('tpRoleShow').textContent=MEMO.myRole?`(내 역할: ${MEMO.myRole})`:'';
};

/* 04 과정 점검 · 확장 흐름도 */
chips('tpSelf','selfCheck',['주제에 맞게 확인할 질문을 정했다','데이터 확인 사항을 점검에 반영했다','질문에 맞는 시각화 방법을 골랐다','모델과 평가 지표를 서로 맞췄다'],true);
orangeFlow({svg:'tpFlow', table:'tpSet',
  nodes:[
    {s:1,t:'File',sub:'우리 주제 파일',c:'Data',x:10,y:150},
    {s:2,t:'Group by',sub:'집계할 때만',c:'Transform',x:220,y:40},
    {s:3,t:'Column Statistics',sub:'분포 · 빈칸',c:'Data',x:220,y:260},
    {s:4,t:'Select Columns',sub:'Target · Features',c:'Transform',x:430,y:150},
    {s:5,t:'Distributions 등',sub:'시각화 계획',c:'Visualize',x:660,y:0},
    {s:6,t:'Linear Regression',sub:'회귀분석일 때',c:'Model',x:660,y:95},
    {s:7,t:'Test and Score',sub:'MSE · R²',c:'Evaluate',x:890,y:150},
    {s:8,t:'k-Means',sub:'군집 분석일 때',c:'Unsupervised',x:660,y:215},
    {s:9,t:'Silhouette Plot',sub:'실루엣 계수',c:'Visualize',x:890,y:260}
  ],
  edges:[[1,2],[1,3],[1,4],[2,4],[4,5],[4,7],[6,7],[4,8],[8,9]],
  done:{box:'tpDone', key:'extDone', items:['파일 열기','점검 카드와 개수 비교','시각화 두 가지','Select Columns 역할','모델 만들기','평가 지표 기록']}});

/* 05 마무리 */
const MEMOLIST=[['myRole','내 역할'],['topic','우리 모둠이 고른 주제'],['why','주제 · 선정 이유 · 확인할 질문'],['dataCheck','데이터 점검 결과와 시각화 계획'],
  ['bMethod','설계 보드: 분석 방법'],['bTarget','설계 보드: 결과 속성'],['bFeat','설계 보드: 사용할 속성'],['bMetric','설계 보드: 평가 지표'],['bPlan','점검 뒤 우리 설계'],['roles','역할 나누기'],
  ['selfCheck','과정 점검'],['reflect','받은 질문 · 고칠 점 · 새롭게 알게 된 점'],['extDone','(선택) 확장 진행 체크'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[5]=()=>{
  $('tpTopicShow').textContent=MEMO.topic?'「'+MEMO.topic+'」':'아직 고르지 않음';
  memoSummary('msum',MEMOLIST.filter(([k,l])=>!l.startsWith('(선택)')||String(MEMO[k]||'').trim()));
};

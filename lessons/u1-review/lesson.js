
/* 0 시작 · 모둠 역할 */
chips('myRoleChips','myRole',['팀장','기술자','기록자'],false);

/* 01 상식 확인하기: O/X는 한 번 고르면 잠금 */
const OX=[['⭕ O','그렇다'],['❌ X','아니다']];
function oxLock(box){
  $(box).querySelectorAll('button').forEach(b=>b.disabled=true);
  const n=['ox1','ox2','ox3'].filter(k=>MEMO[k]).length;
  $('oxDone').textContent=n<3?`세 문제 가운데 ${n}문제에 답했어요.`:'세 문제에 모두 답했어요. 다음 화면에서 데이터로 확인해요.';
}
vote('ox1Vote','ox1',OX,()=>oxLock('ox1Vote'));
vote('ox2Vote','ox2',OX,()=>oxLock('ox2Vote'));
vote('ox3Vote','ox3',OX,()=>oxLock('ox3Vote'));

/* 02 데이터로 검증하기 */
chips('probChips','probPick',['질문 1: 지진에 의한 사망','질문 2: 소득과 기대수명','질문 3: GDP와 수학 성적','우리 모둠이 새로 정한 상식'],false);

/* 03 진로 · 성찰 */
const FIVE=['5','4','3','2','1'];
chips('eval1','eval1',FIVE,false);
chips('eval2','eval2',FIVE,false);
chips('eval3','eval3',FIVE,false);
flipCards('careerCards',[
  {ic:'💡',f:'이 직업을 갖게 된 계기는?',s:'눌러서 답 보기',b:'어릴 때 3D 애니메이션과 SF 영화를 좋아해 CG와 로봇 기술에 관심이 많았고, 그래서 수학과 과학을 즐겨 공부했어요. AR 글래스와 VR 기기가 발전하면서 실감형 미디어가 교육·의료 등에서 삶을 바꿀 수 있다는 가능성에 끌려 연구자가 되기로 했어요.'},
  {ic:'📡',f:'업무 중 데이터 과학과 관련된 일은?',s:'눌러서 답 보기',b:'여러 센서로 모은 대량의 데이터를 분석하고, 딥러닝으로 <b>깊이 정보</b>를 예측해 3D 장면을 만들어요. 데이터 압축·최적화 알고리즘, GPU 병렬 처리로 실시간 처리, 사람의 시각을 고려한 데이터 전송과 화질 평가도 연구해요.'},
  {ic:'🧮',f:'필요한 역량과 미래 전망은?',s:'눌러서 답 보기',b:'미적분학·선형대수·확률통계 같은 수학 지식과 C·Python 프로그래밍 능력, 컴퓨터공학 기초, 최신 기술을 익히는 능력이 필요해요. XR 콘텐츠를 2D 영상처럼 즐기는 미래가 오고, 여러 산업과 일상에서 XR을 자주 만나게 될 거래요.'},
  {ic:'🌱',f:'이 분야를 꿈꾸는 학생에게 한마디?',s:'눌러서 답 보기',b:'수학과 프로그래밍 기초를 차근차근 쌓고, <b>AI 활용 역량</b>을 기르세요. 도덕적인 태도와 넓게 보는(거시적인) 시각도 잊지 말라고 조언해요.'},
]);

/* 04 Ⅰ단원 정리 */
document.querySelectorAll('.ur-blank').forEach(b=>b.onclick=()=>{const on=!b.classList.contains('on'); b.textContent=on?b.dataset.a:'?'; b.classList.toggle('on',on);});
chips('unitComp','unitCompPick',['추상화 능력','자동화 능력','창의·융합 능력','디지털 의사소통·협업 능력','디지털 윤리 의식','디지털 기술 활용 능력','인공지능 문제 해결력','데이터 문해력','인공지능 윤리 의식'],true);

/* 05 마무리 */
const MEMOLIST=[['team','모둠명'],['myRole','나의 역할'],['ox1','질문 1 · 지진 사망 (처음 생각)'],['ox2','질문 2 · 소득과 기대수명 (처음 생각)'],['ox3','질문 3 · GDP와 수학 성적 (처음 생각)'],['oxWhy','처음 생각의 근거'],['needData','(토론) 필요한 데이터와 그래프 축'],['probPick','고른 문제'],['probText','고른 문제 문장'],['resultNote','결과 분석'],['reasonNote','이유'],['regret','아쉬운 점'],['nextPlan','앞으로의 계획'],['eval1','자기 평가 · 문제 선정'],['eval2','자기 평가 · 데이터 검증'],['eval3','자기 평가 · 데이터 과학의 필요성 이해'],['peerNote','(선택) 동료 평가'],['career','나의 진로 메모'],['unitCompPick','(선택) 길러진 역량'],['keyQ1','단원 핵심 질문 ① 내 답'],['keyQ2','(선택) 단원 핵심 질문 ② 내 답']];
onShow[5]=()=>memoSummary('msum',MEMOLIST.filter(([k,l])=>!l.startsWith('(선택)')||String(MEMO[k]||'').trim()));

# u4-stress-1 설계표 — 스트레스 지수 예측 ① 데이터 수집과 전처리 (교과서 182~189쪽)

| 화면 | 교과서 쪽 | 핵심 내용 | 체험·활동 | 퀴즈 | 메모 칸 |
|---|---|---|---|---|---|
| 0 시작 | 182쪽 | 일상 데이터로 스트레스 원인 분석 프로젝트, **예제 분석이지 개인 진단이 아님**(상담 안내 한 줄), 교과서 질문·오늘의 질문, 학습 목표 | 「스트레스에 영향을 줄 것 같은 일상 데이터」 칩(여럿) | – | `s1Guess`(칩) |
| 01 문제 정의·설문 | 183~184쪽 | 문제 정의(통계청 우울감 → 스트레스), 수집 속성 5개, 선택지 제시·입력 단위·개인 정보·수집 목적 | 설문 고치기 sorter 6장(새 예시 문항 → 선택지 주기/단위 밝히기/묻지 않기), 우리 모둠 문항 만들기 | 2 | `s1Survey` |
| 02 불러오기·결측치 | 185~186쪽 | 속성표(단위·범위), File(grade → categorical), Data Table Info, Column Statistics, Impute(Remove instances), **칸 기준 0.5% vs 행 기준 2.4%**, 두 결측 행이 모두 1학년 | orangeFlow A(4위젯)+진행 칩, Impute 방법 flipCards 4장, 결측치 기록 | 2 | `s1DoneA`(칩) · `s1Miss` |
| 03 이상치 기준 탐색기 | 187~189쪽 | 사분위수·IQR·기준선, 속성 특성으로 범위 조정, Select Rows(조건 AND, is between 양 끝 포함), Min-Max 정규화, **정규화는 이상치를 지우지 않음** | **이상치 기준 탐색기**(예시 학생 17명 × 4속성: 속성 버튼 → 상자 그림·정렬값(Q1·Q3 강조)·계산표 → Select Rows 조건 켜기/끄기·범위 고치기·IQR로 채우기·처음 설정 → 17행 표에 빠진 칸 표시와 「들어온 → 남은 \| 빠진」 → 정규화 전후 상자 그림, Select Rows 앞/뒤 바꾸기) | 3 | – |
| 04 오렌지3 이상치·정규화 | 187~189쪽 | 교과서 188쪽 이상치 확인 범위 표(「최솟값·최댓값」 → 기준선), Scatter Plot 두 설정, Box Plot, Select Rows 네 조건, Preprocess Normalize [0, 1], Data Table (1)·Box Plot (1) | orangeFlow B(8위젯)+진행 칩, 결과 기록 표, 막혔을 때 | 2 | `s1DoneB`(칩) · `s1Rows` · (선택) `s1Norm` · `s1Rule` |
| 05 마무리 | 182~189쪽 | key3(오늘 활동을 주어로 새로 쓴 문장), 오늘의 질문 답(처음 칩 다시 보여 줌), 마무리 퀴즈, 결과표, 질문폼, 메모 모아 보기((선택)은 쓴 것만) | – | 3 | `s1KeyQ` |

퀴즈 12문항(정답 위치 ①4 ②4 ③4, 정답이 가장 긴 보기 3문항). 접은 「막혔을 때」만으로 푸는 문항 없음.

질문폼(data-u4-stress-1): 1번 ← 01 `s1Survey`(~9분), 2번 ← 02 `s1Miss`(~16분), 3번 ← 03 탐색기 + 04 `s1Rows`·`s1Rule`(~28분).

**50분 흐름**
- 시작(3분, ~3) 이야기·예제 분석 안내·칩
- **01(6분, ~9)** 문제 정의 1분 → 팁 카드 1분 → sorter 6장 2분 → `s1Survey` 2분(질문폼 1번 근거) → 퀴즈는 넘어가기 전 30초
- **02(8분, ~17)** 파일 내려받기·File grade 바꾸기 2분 → Data Table·Column Statistics 2분 → Impute 1분 → 비율 카드 1분 → `s1Miss` 1.5분(~16, 질문폼 2번 근거) → 퀴즈 30초. 카드 뒤집기는 빠른 학생만
- **03(5분, ~22)** 속성 버튼으로 계산표 보기 1분 → 「해 보기」 세 가지 3분 → 정규화 앞/뒤 1분 → 퀴즈 3문항은 04 기록 뒤에 풀어도 됨
- **04(8분, ~30)** 교과서 범위 표 1분 → Scatter Plot·Box Plot 2분 → Select Rows 네 조건 2분 → 상태 줄 보고 `s1Rows`·`s1Rule` 기록 2분(~28, 질문폼 3번 근거) → Preprocess·Data Table (1)·Box Plot (1) 1분. 오렌지3가 막히면 탐색기 결과로 기록
- 마무리(20분, ~50) 03·04 퀴즈 마저 풀기, key3·오늘의 질문·마무리 퀴즈·질문폼. 오렌지3 연결이 늦는 반을 위한 여유 시간 포함

**줄인 것**
- 183쪽 그림 Ⅳ-1(청소년 우울감·고민 순위 그래프)은 옮기지 않고 문제 정의 근거 한 문장으로. 184쪽 설문지 배포 계획(링크·대상·방법·기간)과 온라인 설문 도구 Tip은 다루지 않음(이번 차시는 예제 파일로 연습). 교과서 활동지의 「예」(배포 대상·방법)는 옮기지 않음.
- 185~189쪽 오렌지3 화면 캡처는 넣지 않고 orangeFlow 흐름도·설정 표로 대신함.
- 187쪽 산점도는 그리지 않고 설정 표에 축·색 설정만(실제 행을 화면에 싣지 않으려고).
- 186쪽 Impute 방법 7가지 중 4가지만 카드로(Don't impute·As a distinct value·Fixed values 제외).

**확인할 점** (화면에서 바로잡거나 밝힘)
- **실제 수치 확인 방법**: 원본 `185쪽/daily_data.csv`(192쪽 폴더의 것과 같은 파일, cmp로 확인)를 오렌지3 3.40 파이썬(`/Applications/Orange.app/Contents/MacOS/python -I`)의 pandas·Orange API로 계산. ows는 XML properties를 pickle/literal로 풀어 위젯 설정을 읽음.
- **ows 설정**: File — grade DiscreteVariable, 나머지 Continuous(모두 feature) / Impute — `_default_method_index` 6 = 3.40 `Method.Drop`(Remove instances with unknown values) / Select Rows — stress·sleep·exercise·electronic_device_usage **is between**(연산자 6) [0, 36.5]·[2, 10]·[0, 145.5]·[0, 8] / Preprocess — `orange.preprocess.scale` method 3 = **Normalize to interval [0, 1]** / Scatter Plot — x exercise, y sleep, color stress / Box Plot — stress. 설정 표에 그대로 씀.
- **185~186쪽 결측치 비율 두 가지**(설계안): 83행 × 5속성 = 415칸 중 빈 칸 2 → 0.48%(교과서 185쪽 「0.5%」), 빈 칸이 있는 행 2/83 → 2.41%(186쪽 「약 2.4%」). 186쪽은 비율을 「전체 데이터의 약 2.4%」라고만 써서 185쪽 0.5%와 헷갈림 → 02에 칸 기준/행 기준 카드로 구분. 두 행 모두 electronic_device_usage가 빈 **1학년**(1학년 25명 → 23명). 186쪽 「분석 결과에 큰 영향을 미치지 않는다」는 단정 대신 「한 집단에 몰리면 치우칠 수 있다」를 조심할 점으로.
- **188쪽 IQR 표**: 오렌지3 3.40 Box Plot은 `np.nanquantile(…, interpolation="midpoint")`(owboxplot.py)로 사분위수를 구함. File 출력(83행, 빈 칸 무시)으로 계산하면 stress 9·20, sleep 5·7, exercise 3·60, electronic_device_usage 3·5 → 교과서 표와 모두 같음. 결측 처리 뒤 81행으로 구하면 exercise Q1이 0이 되어 위 기준선이 150(노트북 원본이 쓴 값). 교과서의 「최솟값·최댓값」은 데이터의 실제 최솟값·최댓값(예: sleep 최댓값 20, electronic_device_usage 최댓값 18)이 아니므로 화면에서는 **아래/위 기준선**으로 부르고 교과서 이름을 note로 밝힘.
- **Select Rows 결과**: 81 → 65 | 16(교과서와 같음). 조건별로 빠지는 행: stress 2(40점 두 명), sleep 4(10.5·10.5·20·20), exercise 1(240), electronic_device_usage 9(9~18) — 겹치는 행 없음. 빠진 행의 학년: 2학년 14, 1학년 2(2학년이 54/83으로 원래 가장 많음, 187쪽 「2학년 이상치가 더 많다」는 설정 표에서 「2학년 데이터가 가장 많다는 점도 함께」로 보완).
- **stress로 행을 거르는 한계**(설계안): 40점은 설문 범위 안의 값인데 기준선 36.5 밖이라 빠짐 → 스트레스가 아주 높은 학생이 빠진 분석. 탐색기 「해 보기」 2번, 퀴즈 5-3, 질문폼 3번에 반영.
- **189쪽 「이상치 범위가 축소되어」**(설계안): 정규화(Min-Max)는 순서와 간격 비율을 유지하므로 이상치를 지우지 않음. 범위가 좁아 보이는 것은 Select Rows가 거른 결과와 눈금 변화. 탐색기 정규화 카드(Select Rows 앞/뒤 바꾸기)와 퀴즈 3-3에 반영.
- **위젯 이름**: 교과서 Feature Statistics → 3.40 **Column Statistics**(owfeaturestatistics.py의 name). ows는 Data Table →(Selected Data) Feature Statistics로 이었지만 줄을 고르면 고른 줄만 넘어가므로 화면은 File → Column Statistics로 잇고 교과서 연결도 허용(줄을 고르지 말라고 안내).
- 185쪽 속성표의 exercise 예 「12초(0.2)」는 분 단위 환산(12초 = 0.2분)이라 맞음. 그대로 옮김.

**지어낸 것(예시 표시)**
- 03 탐색기의 예시 학생 17명 `[stress, sleep, exercise, electronic_device_usage]`(화면에 「교과서 데이터가 아니라 새로 만든 값」 표시). 17개라 Q1·Q3가 5·13번째 값에 딱 떨어져 오렌지3(midpoint)·`stat.q`(선형) 방식이 같음. 기준선: stress −6.5~37.5(40 밖), sleep 3.25~9.25(3·15 밖), exercise −65~135(200 밖), electronic_device_usage 0~8(13 밖, 8은 경계값으로 남음). 처음 설정 17 → 12 | 5, sleep 아래를 2로 → 13, stress 조건까지 끄면 14(node로 계산 확인).
- 01 sorter 문항 6개(등교 방법·아침 식사·물·주말 공부·보호자 전화번호·아파트 동호수), 퀴즈 상황(스마트폰 사용 시간, 데이터 120개 등).
- 화면의 예제 데이터 값은 집계값(행 수·결측 수·비율·사분위수·조건별 빠진 수·학년별 수)과 교과서 인쇄값만. 실제 행은 싣지 않음.

**선생님 준비물**
- 「선생님이 알려 주는 폴더」: `daily_data.csv`(교과서 자료실 `4단원/4-1 데이터 과학과 문제 해결/185쪽/` 원본 이름 그대로). 애드온 필요 없음(오렌지3 기본 위젯).
- (선택) 교과서 `185쪽_4-1-2_일상생활 데이터 기반 스트레스 지수 예측.ows` — 다음 차시(u4-stress-2)에서 흐름도를 저장하지 못한 학생이 열 파일. 이 파일의 Test and Score는 Cross validation으로 설정되어 있음(u4-stress-2 DESIGN 참고).
- 코랩(선택)은 u4-stress-2 (선택) 화면에서 다룸: `작업자료_데이터과학/노트북_4단원/192쪽_스트레스지수예측.ipynb`.

**검토 반영(1차)**
- 03 「해 보기」 4번과 04 `s1Rule` 안내에 「빠진 값 가운데 실제로 있을 수 있는 값은?」을 넣음(교과서 범위 sleep 2~10은 10.5시간도 거름).

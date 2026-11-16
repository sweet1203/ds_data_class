# u2-preprocess-lab 설계표 — 전처리 실습과 시각화 · 정리 (교과서 78~85쪽)

| 화면 | 교과서 쪽 | 핵심 내용 | 체험·활동 | 퀴즈 | 메모 칸 |
|---|---|---|---|---|---|
| 0 시작 | 70·78쪽 | 지난 시간(결측치·이상치·통합·스케일링 개념)과 잇기, 수현이 이야기(70쪽), 실습 순서 5단계(표지 길), 핵심 질문(58쪽 데이터 준비 Q · 70쪽 질문), 학습 목표(70쪽) | **실습 준비 칩**(오렌지3 실행 · Sleep.csv · Health.csv) + 처음 생각 메모 | – | `planOrder` · `readyPick`(칩) |
| 01 불러오기 · 결측치 | 78~79쪽 | Sleep 데이터 속성 10개와 오렌지3가 읽는 형, 374행 · 10속성 · 결측 0.1%, Impute(Average/Most frequent), Default Method 7가지·Individual Attribute Settings는 접기 | **작은 수면 표(예시 20명) ①살펴보기 ②결측치 채우기** → **흐름도 ①**(File · Data Table · Column Statistics · Impute · Data Table (1)) + 설정 표 5줄 + 진행 체크 + 막혔을 때 | 3 | `missWhy` · `done1Pick`(칩) |
| 02 이상치 | 79~80쪽 | Box Plot(Q1 45 · Q3 75 → IQR 30 · 하한 0 · 상한 120), Formula(outlier, Values Y·N), Select Rows(outlier is N), Column Statistics 전후 비교(59.61 → 59.13, Dispersion 0.38 → 0.35) | **Formula 식 읽기**(막대로 값을 바꾸면 조건 참/거짓 → 0/1 → Y/N) + 80쪽 설명 바로잡기 + **작은 표 ③박스 플롯 ④Formula ⑤Select Rows** → **흐름도 ②** + 설정 표 6줄 + Dispersion 접기 + 진행 체크 + 막혔을 때 | 3 | `outlierSteps` · `done2Pick`(칩) |
| 03 표준화 · 통합 · 시각화 | 80~81쪽 | 단위가 다른 속성 → 표준화(평균 0, 표준편차 1), Select Columns 둘로 나눠 5개만 Preprocess(Standardize) → Merge Data(Row index) → Save(Sleep_clean.csv), File 수면·건강 → Merge Data(Person ID) → Scatter Plot · Box Plot · Save(Sleep_Health_merge.csv) | **작은 표 ⑥표준화**(전후 통계 표 + 한 사람 골라 원래 값 ↔ 표준화 값 막대) → **흐름도 ③-1**(8줄, Sleep_clean.csv 저장까지 필수) + 이름·Data Table 주의 + 표준화 후 Dispersion 접기 + 진행 체크 → **작은 표 ⑦통합(Person ID ↔ Row index, 건강 표 순서 섞기) ⑧산점도·박스 플롯**(기본) + 그래프 메모 → (시간이 되면 · 다음 시간 처음에, 접기) **흐름도 ③-2**(7줄) + 진행 체크 | 3 | `stdWhy` · `vizMemo` · `done3Pick` · `done4Pick`(칩) |
| 04 (선택) 파이썬으로 | 82쪽 | 코랩 노트북 셀 안내(고친 사본 기준), 오렌지3와 다른 점 3가지 | **코드 줄 ↔ 오렌지3 위젯 짝짓기**(sorter 6묶음, 7장) | – | `pyNote` |
| 05 (선택) 정리 | 83~85쪽 | 함께 해결하기(Students Exam Scores, 접기), 개념 정리(새 상황 빈칸 4문장), 성취도 평가, 역량 키우기·내 실력 점검·보충·심화(접기), 내 계획 점검 | 메모 · 빈칸 · 칩 | – | `teamInfo` `teamClean` `teamViz` `teamCompare` · `selfCheckPick` · `capPre` `capClean` `capBias` · `levelPick` · `supMemo` `advMemo` · `planCheck` `newLearn` |
| 06 마무리 | – | key3(사례 문장), 오늘의 질문 답, 마무리 퀴즈, 결과표, 질문폼(data-u2-preprocess-lab), 메모 모아 보기((선택)은 쓴 것만) | – | 3 | `keyQ` |

퀴즈 12문항(정답 위치 ①4 ②4 ③4). 질문폼 1번 ← 01 작은 표 ①②·흐름도 ①·`missWhy`, 2번 ← 02 식 읽기·작은 표 ③~⑤·흐름도 ②·`outlierSteps`, 3번 ← 03 작은 표 ⑥·`stdWhy`(앞부분, 21~25분 무렵) + (했다면) 시각화 `vizMemo`.

**50분 흐름(검토 반영 후)** — 시작(3분) 오렌지3 실행·두 파일 내려받기, `planOrder` → 01(8분, ~11분) 작은 표 ①② 1분 → 흐름도 ① 실습 → `missWhy` → 02(10분, ~21분) 식 읽기 1분 → 작은 표 ③~⑤ 1분 → 흐름도 ② 실습 → `outlierSteps` → **03(15분, ~36분)** 작은 표 ⑥ + `stdWhy`(21~25분 무렵에 씀) → 흐름도 ③-1(Sleep_clean.csv 저장까지, 필수) → 작은 표 ⑦⑧ 2분 + `vizMemo` → 퀴즈 → 마무리(8분, 40분 무렵부터) 퀴즈·질문폼. 오렌지3 흐름도 ③-2(건강 데이터 통합·시각화·Sleep_Health_merge.csv 저장)는 접어 둔 「시간이 되면 · 다음 시간 처음에」 활동이다(다음 차시는 선생님 폴더의 Sleep_Health_merge.csv로 시작할 수 있음). 04·05는 (선택) 화면(03 끝에 「마무리로 가기」 단추). 남는 시수(설계안 「정할 것」 7: 13 차시 뒤 1시간)에 05의 83쪽 함께 해결하기.

**오렌지3 확인 결과** (교과서 78쪽 ows `데이터 전처리 시각화(78쪽).ows` 25개 위젯을 이 맥의 오렌지3 3.40 파이썬으로 풀어 보고, `Sleep.csv`·`Health.csv`로 값 계산)
- 위젯·연결: File → Data Table · Feature Statistics(오렌지3 3.40 이름은 Column Statistics) / Data Table →(Selected Data) Impute → Data Table (1) →(Selected Data) Box Plot / Impute → Formula → Data Table (2) →(Selected Data) Select Rows →(Matching Data) Data Table (3) →(Selected Data) Select Columns (6개) · Select Columns (1) (5개) → Preprocess → Data Table (4) → Merge Data(Extra Data) / Select Columns → Merge Data(Data) → Data Table (5) → Save Data(Sleep_clean.csv) · Feature Statistics (1) / File 「수면」(Data)·「건강」(Extra Data) → Merge Data (1) → Data Table (6) → Scatter Plot · Box Plot (1) · Save Data (1)(Sleep_Health_merge.csv).
- 설정: Impute 기본 방법 Average/Most frequent(Sleep Duration 평균). Box Plot Variable Physical Activity Level. Formula `outlier` 범주형, 식 `0 if Physical_Activity_Level > 120 else 1`, Values `Y, N`. Select Rows `outlier is N`. Preprocess Normalize(Standardize, method 2). Select Columns(1) = Sleep Duration·Quality of Sleep·Physical Activity Level·Stress Level·Daily Steps, Select Columns = Person ID·Gender·outlier·Occupation·Sleep Disorder·Age. 두 Merge Data 모두 **Row index**·Append columns로 저장됨. Scatter Plot x Quality of Sleep · y Stress Level(회귀선 표시). Box Plot (1) Quality of Sleep × BMI Category. Save Data는 두 개 모두 `add_type_annotations=False`.
- 값: 374행 · 결측 5칸(ID 96~100 수면 시간, 3,740칸 중 0.13%) · 평균 대체값 7.132 · 신체 활동 수준 Q1 45 · 중앙값 60 · Q3 75 → 상한 120 · 이상치 ID 361의 240 하나 · 평균 59.61 → 59.13 · 오렌지3 Dispersion(표준편차÷평균) 0.383 → 0.352 · 표준화 후 Sleep_clean 373행 11열 · 합친 파일 373행 14열. 모두 교과서와 같다.
- 흐름도는 Data Table을 거치지 않고 바로 잇게 그렸다(줄을 고르면 고른 줄만 넘어가는 문제를 피하려고). 설정 표와 「💡」 상자에 「교과서처럼 Data Table을 거쳐도 되지만 줄을 누르지 말 것」을 적었다. 81쪽 표준화 후 통합도 Data Table (4) 대신 Preprocess → Merge Data(Extra Data)로 그리고, Data Table (4)는 결과 확인용 곁가지로 두었다.
- 교과서 80쪽 ❺의 Feature Statistics (1)(화면에서는 Column Statistics (1))은 그림에서는 Select Rows 뒤에, ows에서는 Data Table (5)(통합 뒤) 뒤에 있다. 80쪽 값(59.13 · 0.35)은 Select Rows 뒤라야 나오므로 흐름도 ②에 Select Rows → Feature Statistics (1)로 두고, 통합 뒤 확인용은 흐름도 ③-1의 Column Statistics (2)로 따로 두었다.
- 표준화한 속성은 평균이 0이라 오렌지3 Dispersion이 ∞(inf)나 아주 큰 수·음수로 보인다(오렌지 소스 `coefficient_of_variation`: 평균이 0에 매우 가까우면 inf, 아니면 표준편차를 아주 작은 평균으로 나눈 값). Column Statistics에는 표준편차 열이 없어 「표준편차 1」은 Box Plot의 「평균 ± 표준편차」로 확인하라고 접기에 적었다.
- Save Data의 「Add type annotations to header」: 81쪽 그림에는 체크되어 있으나 ows는 해제. 체크하면 다음 시간 코랩(pandas)에서 머리글 아래 형식 줄이 데이터로 읽히므로 **체크 해제**로 안내했다.
- 위젯 카테고리(3.40 소스 확인): File·Data Table·Column Statistics·Save Data = Data, Impute·Formula(Feature Constructor)·Select Rows·Select Columns·Preprocess·Merge Data = Transform, Box Plot·Scatter Plot = Visualize.

**줄인 것** — 78쪽 Data Table 막대 비교(93·104번 줄)는 설정 표 한 줄로. 79쪽 Impute 방법 7가지는 목록 카드로만(실습은 Average/Most frequent). 82쪽 코드 전문은 싣지 않고 셀 안내 표 + 짝짓기로(코드는 노트북에). 83쪽 함께 해결하기는 접어 둔 선택 활동(데이터 파일만 안내), 84쪽 역량 키우기는 새 문장 메모로, 85쪽 보충·심화는 접기(보충은 ows대로 Distributions 위젯 안내, 심화는 그래프 해석 메모만 — 교과서 그림은 싣지 않음). 83쪽 「주요 개념 정리하기」 문장은 옮기지 않고 새 상황 빈칸 4문장(날씨 앱·줄넘기·키와 독서 시간·학년별 수면 시간)으로.

**확인할 점**
- **80쪽 설명 문장**: 「신체 활동 수준이 120을 넘지 않으면 0번 값으로, 그렇지 않으면 1번 값」은 식 `0 if Physical_Activity_Level > 120 else 1`과 반대다. 실제로는 120을 넘으면 0번 값(Y = 이상치), 아니면 1번 값(N). 02 화면에 「교과서 80쪽 설명 바로잡기」 상자와 식 읽기 위젯으로 바로잡음(설계안 확인할 점 7).
- **80쪽 「분산 0.38 → 0.35」**: 오렌지3 Column Statistics(교과서 Feature Statistics)의 Dispersion은 분산이 아니라 표준편차 ÷ 평균(22.79 ÷ 59.61, 20.81 ÷ 59.13). 실제 분산은 약 521 → 434. 화면은 「흩어진 정도(Dispersion)」로 쓰고 「오렌지3의 Dispersion은 표준편차를 평균으로 나눈 값이라 분산과 달라요」를 접어 둠. 「변동계수」라는 말은 쓰지 않음(설계안 확인할 점 1, 지침).
- 78쪽 「0.1%의 결측치」: 실제 5 ÷ 3,740 = 0.13%. 오렌지3 표시도 0.1%라 화면은 교과서대로 둠.
- 79~81쪽 「Transfom」「Fomula」는 오타 → 화면은 Transform·Formula.
- 81쪽 「수면의 질이 체질량 지수(BMI) 및 수면 시간에 따라」: 오렌지 Box Plot은 BMI별 **수면의 질**, 82쪽 파이썬은 BMI별 **수면 시간**이라 변수가 다르다. 화면 03은 오렌지 기준(수면의 질), 04와 고친 노트북은 두 그림을 모두 그림(확인할 점 9).
- 81쪽 Merge Data (1): ows는 Row index, 파이썬은 Person ID. Health.csv에 ID 361이 없고 줄 순서가 같아 결과는 같다(373줄). 화면은 Person ID로 바꾸게 안내하고, 작은 표 ⑦에서 「건강 표 줄 순서 섞기」로 Row index의 위험을 보여 줌.
- 81쪽 ➊ 파일 이름이 「sleep_clean.csv」(소문자)와 「Sleep_clean.csv」로 섞여 있다 → 화면은 Sleep_clean.csv.
- 82쪽 코드 주석이 「5 데이터 통합하기」「5 시각화하기」로 5가 두 번이고, 원본 노트북은 주석 번호가 깨진 글자이며 ④가 「정규화하기」(교과서는 표준화하기) → 고친 노트북에서 바로잡음.
- pandas는 Sleep Disorder의 `None`(장애 없음)을 결측치로 읽는다(Sleep.csv에서 219개, 기본 읽기로는 결측 224개). 오렌지3는 값으로 읽어 결측 5개. 고친 노트북은 `keep_default_na=False, na_values=['']`로 읽음(확인할 점 14).
- 85쪽 보충 「히스토그램으로」: 교과서 ows(선택활동(85쪽).ows)는 Distributions(Variable Sleep Disorder, Split by Gender / BMI Category)를 쓴다. 범주형 속성의 막대 분포라 엄밀히는 히스토그램보다 막대그래프에 가깝다. 화면은 「그래프로 그려 봐요」와 Distributions 위젯 이름으로 안내(확인할 점 23).

**지어낸 것(예시 표시)** — 작은 수면 표 20명(ID·직업·수면 시간·수면의 질·신체 활동 수준·스트레스 수준·걸음 수)과 작은 건강 표 19명(BMI 범주) 전부. 값의 범위·척도는 교과서 데이터와 비슷하게(수면 5.8~8.1시간, 1~10 점수, 걸음 3,200~9,500) 만들고, 신체 활동 수준은 교과서처럼 Q1 45 · Q3 75 → 상한 120이 되도록, ID 17에 이상치 240을 넣음. 결측치는 ID 8·9 두 칸. 「건강 표 줄 순서 섞기」의 섞인 순서. 05 개념 빈칸 4문장, 짝짓기 카드, 메모 자리표시. 교과서 값(78~81쪽 수치)은 쪽 표시와 함께 설정 표에 씀.

**선생님 준비물**
- 드라이브 「선생님이 알려 주는 폴더」: `Sleep.csv`, `Health.csv`(교과서 소스코드 78_82쪽), 저장 못 한 학생과 다음 시간을 위한 `Sleep_clean.csv`(③-2를 다음 시간 처음에 할 때 시작 파일)와 `Sleep_Health_merge.csv`(u2-descriptive에서 씀) — 둘 다 같은 폴더의 교과서 결과 파일. 선택 활동용 `Expanded_data_with_more_features.csv`(83쪽 폴더, 2.8MB).
- 코랩(선택): `작업자료_데이터과학/노트북_2단원/82_데이터 전처리 시각화.ipynb`를 드라이브에 올려 「사본 만들기」로 쓰게 함.
- 학생 노트북의 오렌지3 실행 확인.

**코랩 노트북 고친 사본** (`노트북_2단원/82_데이터 전처리 시각화.ipynb`, 이 맥의 오렌지3 파이썬(pandas 2.2.3·sklearn·matplotlib)으로 모든 셀 실행 확인)
- 첫 마크다운 셀에 사용법(파일 창에 두 파일 올리기, `/content/` 경로, 런타임이 끝나면 파일이 사라짐)과 고친 점 목록.
- 주석 번호를 ①~⑤로(교과서 78~81쪽 단계와 맞춤: ④-1 표준화 · ④-2 통합 · ⑤-1~3 시각화), 「정규화하기」 → 「표준화하기」.
- `read_csv(..., keep_default_na=False, na_values=[''])`로 읽어 결측치가 수면 시간 5칸만 나오게 함. 단계마다 확인 줄 추가: 결측치 개수, 평균 7.132, Q1·Q3·IQR·하한·상한과 이상치 행, (373, 10), 표준화 뒤 describe, 합친 결과 (373, 13).
- 박스 플롯: `plt.figure` 뒤 `DataFrame.boxplot`이 빈 그림을 하나 더 만들던 것을 `fig, ax = plt.subplots` + `ax=ax`로 고치고, 82쪽(수면 시간)과 81쪽 오렌지(수면의 질) 두 그림을 모두 그림.
- (선택) 합친 데이터를 `Sleep_Health_merge_python.csv`로 저장하는 셀 추가(교과서 결과 파일과 이름이 겹치지 않게).
- 코랩에서 확인 필요: 코랩의 matplotlib 3.10 이상에서는 `boxplot(vert=False)`에 사용 중단 경고가 뜰 수 있다(그림은 그려짐).

**검토 반영(1차)**
- (50분 초과) 03의 필수를 흐름도 ③-1(Sleep_clean.csv 저장)까지로 줄임. 흐름도 ③-2(건강 데이터 통합·시각화·Sleep_Health_merge.csv 저장)는 「(시간이 되면 · 다음 시간 처음에)」 접기로 내리고, 작은 표 ⑦⑧(Person ID 통합·산점도·박스 플롯)을 접기 밖 기본 활동으로 올림. `vizMemo`는 작은 표 ⑦⑧ 아래로. 진행 체크를 ③-1(`done3Pick`)과 ③-2(`done4Pick`, (선택))로 나눔. 01의 Impute 방법 7가지 카드는 한 문단 + 접기로. 선생님 준비물에 Sleep_clean.csv 추가. 50분 흐름 고침.
- (총괄 결정) 오렌지3 3.40 이름에 맞춰 Feature Statistics → **Column Statistics**. 처음 나오는 설정 표 줄과 단계 설명에 「교과서·옛 버전 이름은 Feature Statistics」, 막혔을 때에 「검색 칸에 feature라고 쳐도 나와요」. 흐름도 노드·설정 표·진행 칩·노트북 주석·이 문서 모두 바꿈.
- 흐름도 ② Box Plot 「오른쪽 멀리 떨어진 점 하나」 → 「점선이 240까지 길게 뻗음(오렌지3는 점 대신 점선)」. 작은 표 ③ 설명에도 한 줄.
- 표준화한 속성의 Dispersion 접기: 「∞(inf)나 아주 큰 수·음수로 보여요」.
- Data Table을 거치는 연결: 흐름도 ②의 Box Plot을 Impute에서 바로 잇고(교과서처럼 Data Table (1)을 거쳐도 되지만 줄을 누르지 말기), ③-1의 두 Select Columns도 Select Rows에서 바로 잇게 바꿈. 03에도 「줄을 누르면 고른 줄만 넘어가요」 상자를 넣음.
- Select Columns 이름을 교과서 80~81쪽 그림대로(표준화할 5개 = Select Columns, 나머지 6개 = Select Columns (1)) 바꾸고, 「교과서 ows 파일에는 이름이 반대로 저장되어 있다」는 한 줄을 03에 둠.
- outlierSteps 라벨에 「하한값 0 · 상한값 120」. 01 「스스로 평가한 점수」 → 「1~10까지의 척도로 매긴 점수」. 퀴즈 2-2 해설에서 「만」을 빼고, 2-3 보기의 「이상치만」·「줄만」도 고침.
- 노트북 첫 셀의 저장 파일 이름을 실제 셀(`Sleep_Health_merge_python.csv`)과 맞춤. 결측치 확인 셀 주석을 Column Statistics로.
- 05 내 계획 점검: u2-collect(62쪽, `ds-u2-collect-memo`의 `planLearn`)와 u2-clean(70쪽, `ds-u2-clean-memo`의 `plan`) 메모를 읽어 보여 줌(읽기만, 없으면 안내).

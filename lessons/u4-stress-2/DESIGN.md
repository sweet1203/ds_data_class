# u4-stress-2 설계표 — 스트레스 지수 예측 ② 분석과 모델링 · 정리 (교과서 190~193쪽)

| 화면 | 교과서 쪽 | 핵심 내용 | 체험·활동 | 퀴즈 | 메모 칸 |
|---|---|---|---|---|---|
| 0 시작 | 190쪽 | 지난 시간 전처리에서 이어 분석·모델링·평가, 예제 분석 안내, 교과서 질문(183쪽 문제 정의)·오늘의 질문, 학습 목표(182쪽) | 「스트레스 지수와 가장 관계가 클 것 같은 속성」 vote | – | `s2Guess`(vote) |
| 01 분포·상관 | 190쪽 | Preprocess → Distributions · Correlations(Unsupervised), 분포 해석, 상관계수 부호, **상관 ≠ 원인**, 특정 집단 자료의 일반화 한계 | orangeFlow A(4위젯)+진행 칩, 확인용 집계 그래프(속성별 0.25 구간 수, 상관계수 6쌍), 「이 데이터로 말할 수 있을까?」 sorter 6장 | 3 | `s2DoneA`(칩) · `s2Corr` |
| 02 모델 비교실 | 191~192쪽 | 오차·MSE·RMSE·R² 계산 약속, 평균만 말하는 모델의 R² = 0, 큰 오차와 MSE, **실젯값 퍼짐과 R²** | **모델 비교실**(예시 학생 8명, 평가 자료 ㉮/㉯ × 모델 A·B·C·평균만 말하기·내 예측: 실젯값–예측값 산점도와 대각선·오차 점선, MSE·RMSE·R² 계산 과정, 값 표·오차 줄, 모델별 MSE·RMSE·MAE·R² 표와 ★) | 3 | `s2Pick` · `s2Spread` |
| 03 오렌지3 모델링·평가 | 191~192쪽 | Select Columns(feature 3·target stress), Data Sampler 70%(Replicable, 숫자 target은 Stratify 미적용), 모델 4개, Test and Score(Data Sample → Data, Remaining Data → **Test Data**, Preprocess → **Preprocessor**, **Test on test data**), 교과서 화면(교차 검증)과 비교, 아래쪽 비교 표의 뜻 | orangeFlow B(9위젯)+진행 칩, 비교 카드, 결과 기록 표, 막혔을 때 | 2 | `s2DoneB`(칩) · `s2Best` · `s2R2` · `s2Eval` |
| 04 프로젝트 정리 | 193쪽 | 여섯 과정별 자기 평가 물음(교과서 기준을 바꿔 씀)과 이 프로젝트에서 한 일, 배운 점·느낀 점·새롭게 알게 된 점, 더 알아보고 싶은 점 | 되돌아보기 메모 | – | `s2Reflect` |
| 05 (선택) 파이썬 | 192쪽 QR 노트북 | 코랩 단계 안내, 고친 점(접기) | – | – | – |
| 06 마무리 | 190~193쪽 | key3(오늘 활동을 주어로 새로 쓴 문장), 오늘의 질문 답(처음 vote 다시 보여 줌), 마무리 퀴즈, 결과표, 질문폼, 메모 모아 보기 | – | 3 | `s2KeyQ` |

퀴즈 11문항(정답 위치 ①4 ②4 ③3, 정답이 가장 긴 보기 3문항). 05 (선택) 화면만으로 푸는 문항 없음.

질문폼(data-u4-stress-2): 1번 ← 01 `s2Corr`(~11분), 2번 ← 02 `s2Pick`(~24분), 3번 ← 02 `s2Spread`(~25분, 오렌지3 결과는 있으면 더함). 오렌지3 실습 결과(`s2Best`·`s2R2`·`s2Eval`)는 30분 뒤에 보완하는 기록이라 질문폼 필수 근거로 쓰지 않음(설계안).

**50분 흐름**
- 시작(2분, ~2) 이야기·vote
- **01(10분, ~12)** 흐름도 열기(저장 못 했으면 교과서 ows)·Preprocess 확인 1분 → Distributions 2분 → Correlations 1분 → 확인용 그래프 비교 1분 → sorter 2분 → `s2Corr` 2분(~11, 질문폼 1번 근거) → 퀴즈 1분
- **02(13분, ~25)** 계산 약속 1분 → ㉮에서 A·B·C·평균만 말하기 눌러 보기 4분 → 내 예측 고쳐 보기 2분 → ㉯로 바꾸기 2분 → `s2Pick`·`s2Spread` 3분(~25, 질문폼 2·3번 근거) → 퀴즈 1분
- **03(13분, ~38)** Select Columns·Data Sampler 3분 → 모델 4개·Test and Score 연결(Test Data·Preprocessor) 4분 → Test on test data 결과 보고 기록 3분 → 교과서 비교 카드 2분 → 퀴즈 1분
- **04(4분, ~42)** 되돌아보기 메모
- 마무리(8분, ~50) key3·오늘의 질문·마무리 퀴즈·질문폼
- 05는 남는 시간이나 집에서 선택.

**줄인 것**
- 190~192쪽 오렌지3 화면 캡처는 넣지 않고 orangeFlow·설정 표로. 190쪽 분포 그림 대신 집계값 막대(0.25 구간 수)와 상관계수 막대.
- 191쪽 Data Sampler → 각 모델 위젯의 Data 연결은 Test and Score에 필요 없어(모델 위젯은 Learner만 보내면 됨) 흐름도에서 뺌. 이어도 결과는 같음.
- 192쪽 모델별 결과 문장(교과서 해석)은 옮기지 않음. MAPE는 정규화된 target에 0이 있어 교과서 화면 값이 수십조로 커지므로 다루지 않음.
- 193쪽 자기 평가표는 「우수·보통·미흡」 체크 표 대신 기준을 물음으로 바꾼 표 + 메모 하나로. 교과서 「예」(운동 시간과 학업 성적)는 옮기지 않음.

**확인할 점** (화면에서 바로잡거나 밝힘)
- **계산 방법**: 원본 `daily_data.csv`를 오렌지3 3.40 파이썬의 Orange API(`Table`, `Values/FilterContinuous.Between`, `Normalize(NormalizeBySpan)`, `SampleRandomP(0.7, random_state=42)` — Data Sampler의 Replicable seed 42, `CrossValidation`, `TestOnTestData`, 위젯과 같은 학습기 설정)로 계산. 위젯 GUI를 직접 띄워 확인한 것은 아님(같은 코드 경로를 API로 재현).
- **190쪽 분포·상관**(이상치 처리 후 65행, 0~1 정규화): stress 구간 수 13·23·18·11(0.25~0.5가 최다, 0.25~0.75에 41명), sleep 21·18·19·7, exercise 21·18·18·8, electronic_device_usage 10·42·7·6 → 교과서 문장과 맞음. Pearson 상관계수: stress–sleep −0.622, stress–exercise −0.490, sleep–exercise 0.229, sleep–e_d_usage −0.167, stress–e_d_usage 0.076, exercise–e_d_usage −0.008(정규화 전후 같음). 190쪽 「운동이 스트레스 감소와 수면 시간에 긍정적인 영향을 줄 수 있음을 의미」는 인과 표현이라 화면에서는 「함께 움직이는 경향」까지만, sorter·퀴즈 1-1에서 원인과 구분(설계안). 이상치 처리에서 stress 40점 두 명이 빠진 자료라는 점은 u4-stress-1에서 다룸.
- **191쪽 Stratify**(설계안): 3.40 `owdatasampler.py`는 `domain.has_discrete_class`일 때만 층화 → 숫자 target stress에는 적용 안 됨. 설정 표·퀴즈 6-2에 반영.
- **192쪽 교과서 결과 재현**: ows Test and Score는 `resampling` 0(Cross validation), `n_folds` 2 → NFolds[2] = **5겹**, 입력은 Data Sample(46행)뿐(Remaining Data 19행은 미사용). 같은 방식으로 계산하면 Linear Regression MSE 0.042 · RMSE 0.204 · MAE 0.164 · R² **0.475**, kNN 0.043 · 0.207 · 0.156 · 0.461, SVM 0.045 · 0.212 · 0.166 · 0.434(교과서 MAE 0.165) → 교과서와 같음. Random Forest는 ows에 Replicable training이 꺼져 있어 실행마다 다름(random_state 0이면 0.040 · 0.201 · 0.150 · 0.493, 교과서 0.042 · 0.206 · 0.147 · 0.466).
- **192쪽 아래쪽 비교 표**(설계안): `owtestandscore.py`의 `_fill_table`은 `baycomp.two_on_single`로 **행 모델의 점수가 열 모델보다 클 확률**을 계산(창 안내 문구도 같음). 교과서 표의 LR–SVM 0.331과 SVM–LR 0.669처럼 마주 보는 칸의 합이 1. 교과서 Tip·본문의 「두 모델 간 예측 결과의 평균 제곱 오차」, 「예측 경향이 가장 유사」는 틀린 설명 → 03 비교 카드·퀴즈 3-2에서 바로잡음(MSE 기준이면 0.331은 LR의 MSE가 더 클 확률 → LR이 더 나을 가능성이 큼). 이 표는 교차 검증처럼 여러 번 나눌 때 의미가 있어 「Cross validation으로 바꾸면 나온다」로 안내.
- **평가 경로**(설계안 「Test Data·Test on test data 명시, 훈련 자료에 맞춘 전처리 우선」): 화면 흐름은 Select Rows → Select Columns → Data Sampler(Data Sample → Data, Remaining Data → Test Data), Preprocess의 **Preprocessor 출력 → Test and Score Preprocessor 입력**(정규화 기준을 훈련 데이터로만 구함; Normalize는 target을 바꾸지 않아 stress는 원래 점수), **Test on test data**. 계산 결과(Data Sample 46 · Remaining Data 19): Linear Regression MSE 28.62 · RMSE 5.35 · MAE 4.54 · R² **0.017**, Random Forest(Replicable) 27.29 · 5.22 · 4.01 · 0.063, kNN 39.04 · 6.25 · 4.67 · −0.341, SVM 22.80 · 4.77 · 3.97 · 0.217. 테스트 19명의 stress는 평균 12.8 · 표준편차 5.4로 훈련 46명(16.9 · 9.0)보다 좁게 퍼져 RMSE는 교차 검증(LR 6.54)보다 작은데 R²는 작음 → 모델 비교실 ㉮/㉯와 같은 현상이라 03 비교 카드에서 연결. 같은 경로로 Cross validation 5겹이면 LR R² 0.475(교과서와 같음), RF 0.505, kNN 0.435, SVM 0.226(target을 정규화하지 않아 SVM만 교과서와 다름). 참고로 seed를 0~29로 바꾸면 LR의 테스트 R²는 −0.34~0.68(평균 0.36)로 크게 흔들림 — 데이터 65개의 한계. **화면에는 이 수치를 정답으로 싣지 않음**(학생이 기록).
- 교과서 재현 경로(전체 정규화 후 분할 + Test on test data)는 LR 테스트 R² 0.017로 같고 MSE만 0~1 눈금(0.028). 화면은 「정규화 순서」 카드로 차이만 설명.
- 191쪽 「Unsupervised 카테고리의 Correlations」: 3.40에서도 category Unsupervised(owcorrelations.py) — 그대로.
- 192쪽 「kNN은 R2는 전반적으로 좋은 성능이나, 설명력(R2)은 약간 부족하다」는 문장이 서로 어긋남 — 화면에 옮기지 않음.

**고친 코랩 노트북** (`작업자료_데이터과학/노트북_4단원/192쪽_스트레스지수예측.ipynb`, 첫 마크다운 셀에도 같은 내용, 출력 비움)
1. 업로드 셀(`files.upload()`, 태그 upload) 추가, `read_csv(…, encoding="utf-8-sig")`.
2. 결측치 비율 두 가지(칸 0.5%, 행 2.4%) 출력 추가.
3. 이상치 조건의 exercise 0~150 → 교과서 표대로 0~**145.5**(남는 수 65 같음). IQR 표가 81행 기준이라 교과서(83행·midpoint)와 exercise만 다른 까닭을 마크다운에 씀.
4. 분석용 정규화는 `scaled_df`에 따로(원본은 `filtered_df`를 덮어씀).
5. **평가 누수 수정**: 원본은 target까지 전체에 MinMaxScaler를 맞춘 뒤 분할. 고친 사본은 `filtered_df`(원래 단위)를 먼저 7:3으로 나누고 `make_pipeline(MinMaxScaler(), model)`로 훈련 데이터에만 맞춤. target은 원래 점수.
6. 원본 5-Fold 반복문은 학습만 하고 점수를 버렸음 → `cross_validate`로 훈련 데이터 5겹 교차 검증 평균(MSE·R²)과 테스트 점수를 함께 표로.
7. 마지막 「모델 간 MSE 비교표」를 「모델끼리 예측값 차이(MSE)」로 이름과 설명을 바꾸고, 오렌지3 비교 표(확률)와 다르다고 밝힘. 히스토그램 2×3의 빈 칸 감춤.
8. `SEED = 42` 한곳에서 지정(분할·KFold·랜덤 포레스트), 원본의 `n_jobs=-1` 등 실행 환경 의존 옵션 제거. 모델 하이퍼파라미터(RF 100그루·깊이 5, kNN 3·distance, SVR C=5)는 교과서 노트북 그대로.
9. **실행 확인**: 이 맥 python3(pandas 3.0.6, scikit-learn 1.9.1, seaborn 0.13.2, matplotlib Agg)로 업로드 셀을 뺀 모든 코드 셀을 원본 `192쪽/daily_data.csv`로 실행 성공. 결측 2 → 81행, 칸 0.5%·행 2.4%, IQR 표(exercise Q1 0·위 150), 65행(제외 16), 상관계수 표(−0.622 등, 오렌지3와 같음), 훈련 45 · 테스트 20. 결과: CV R²(훈련 5겹 평균) RF 0.482 · kNN 0.520 · LR 0.422 · SVR 0.390, 테스트 R² RF 0.130 · kNN 0.076 · LR −0.124 · SVR −0.182(테스트 MSE 44.04~59.86). 테스트 R²가 낮은 것은 오렌지3와 같은 소표본 현상. `files.upload()` 셀은 코랩에서만 확인 가능(미확인).

**지어낸 것(예시 표시)**
- 02 모델 비교실: 예시 학생 8명. 실젯값 ㉮ 6·10·14·17·21·25·30·35(평균 19.75, 평균에서 떨어진 거리 제곱의 합 691.5), ㉯ 12·14·15·17·18·20·21·23(평균 17.5, 98). 오차(예측값 − 실젯값)는 두 자료에서 같게: A +3 −2 +4 −3 +2 −4 +3 −2(MSE 8.875), B +5 +3 +2 −1 −2 −3 −4 −5(11.625, 평균 쪽으로 몰린 모델), C 0 +1 −1 +9 0 −1 +1 −10(23.125, MAE는 A와 같은 2.875). R² ㉮ A 0.897 · B 0.866 · C 0.732, ㉯ A 0.276 · B 0.051 · C −0.888, 평균만 말하기 0. 브라우저에서 계산 확인. 「내 예측」 처음 값은 실젯값 평균을 반올림한 값.
- 01 sorter 문장 6개, 퀴즈 상황(실젯값 10·20 예시 등).
- 01 확인용 그래프는 예제 데이터의 집계값(구간별 수·상관계수)만. 실제 행은 싣지 않음.

**선생님 준비물**
- 「선생님이 알려 주는 폴더」: 지난 시간과 같은 `daily_data.csv`, 그리고 흐름도를 저장하지 못한 학생용 교과서 `185쪽_4-1-2_일상생활 데이터 기반 스트레스 지수 예측.ows`(교과서 자료실 185쪽 폴더 원본 이름). 이 ows는 Preprocess → Select Columns, Test and Score가 Cross validation으로 되어 있으니 03 설정 표대로 연결을 바꾸게 안내. 애드온 필요 없음.
- (선택) 코랩: 고친 노트북 `작업자료_데이터과학/노트북_4단원/192쪽_스트레스지수예측.ipynb`를 드라이브에 올려 「사본 만들기」로 배포. 저장소에는 넣지 않음.

**검토 반영(1차)**
- 질문폼 3번을 ㉮ → ㉯에서 MSE·R²가 달라진 것과 그 까닭까지로 줄이고, 오렌지3 해석은 「결과가 있으면」 덧붙이기로. 03 `s2Eval` 안내에 테스트 R²와 ㉮ → ㉯ 연결을 넣음.
- 퀴즈 3-2 문제에 「MSE를 기준으로 비교한 표」를 밝힘(R² 기준이면 해석이 반대).
- 01 메모 위 note와 03 비교 카드에 「stress 40점 두 명이 빠진(target 일부가 잘린) 65개 자료의 결과」를 밝힘.
- 퀴즈 1-1 보기를 「짧게 잘수록 스트레스가 높은 경향」으로 바꿔 무엇이 높은지 밝힘(길이 순서 유지).

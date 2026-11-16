# 공용 그림·실습 부품 (framework/charts.js · charts.css)

빌드가 모든 차시에 넣는다. 차시 `lesson.js`는 설정값만 넘긴다. 이름이 겹치지 않게 차시에서 `stat·scatter·bars·boxes·miniTable·orangeFlow·memoOf·PAL·OF_COL`을 새로 선언하지 않는다.

## orangeFlow — 오렌지3 흐름도 + 설정 표 + 진행 칩
```html
<div><svg id="kmFlow" role="img" aria-label="k-평균 군집 위젯 연결 흐름도"></svg></div>
<div class="of-tw"><table class="tbl" id="kmSet">
  <tr><th>번호</th><th>위젯 (카테고리)</th><th>어디에 연결</th><th>설정 · 할 일</th><th>확인할 것</th></tr>
  <tr data-s="1"><td>1</td><td><b>File</b> (Data)</td><td>처음 위젯</td><td>…</td><td>…</td></tr>
</table></div>
<div id="kmDone"></div>
```
```js
orangeFlow({svg:'kmFlow', table:'kmSet',
  nodes:[{s:1,t:'File',sub:'Mall_Customers.csv',c:'Data',x:10,y:60}, {s:2,t:'k-Means',sub:'k = 5',c:'Unsupervised',x:250,y:60}],
  edges:[[1,2]],                       // [보내는 번호, 받는 번호, (선택) 선 이름]
  done:{box:'kmDone', key:'kmDone', items:['파일 열기','k 정하기','결과 기록']}});   // 진행 칩(메모 키 kmDone)
```
카테고리 `c`: Data · Transform · Visualize · Model · Evaluate · Unsupervised · Associate · Explore (색 범례는 자동).

## scatter — 산점도 탐색기 (회귀 직선·잔차·군집 중심)
```js
const sp=scatter({svg:'rgPlot', x:[0,10,2], y:[0,100,20], xl:'공부 시간(시간)', yl:'점수(점)', edit:true, max:30,
  onChange(P){ const f=stat.fit(P); if(f){ sp.line(f.a,f.b,'#d64535'); $('rgR2').textContent=stat.fmt(f.r2); } }});
sp.set([[1,50],[2,55],[3,65]]);          // 점: [x, y, (선택) 색 문자열 또는 군집 번호 0·1·2…]
sp.resid(true);                          // 잔차(점↔직선 세로 점선)
sp.centers([[2,3],[7,8]]);               // 군집 중심 ✕
```
`onChange`는 `set()`과 학생이 점을 놓거나 끌 때만 불린다(두 번 누르면 점 지움). `<div class="sp-wrap"><svg id="…"></svg></div>`, 읽은 값은 `<div class="sp-read"><div>R² <b id="…"></b></div></div>`.

## stat — 계산
`stat.mean(a) · stat.sd(a, 표본?) · stat.q(a, 0.25) · stat.r(P) · stat.fit(P)→{a,b,r2,mse,rmse} · stat.err(P,a,b)`
k-평균: `L=stat.assign(P,C)`(가까운 중심 번호) → `C=stat.center(P,L,C)`(중심 옮기기) · `stat.sse(P,L,C)` · `stat.silhouette(P,L)` · 표시는 `stat.fmt(v, 자리수)`(음수 기호 −).

## bars · boxes — 막대그래프·상자 그림
```js
bars('svgId', [['우유',0.43],['콜라',0.57,'#d64535']], {dec:2, horiz:true, max:1});
boxes('svgId', [['군집 1',[…]],['군집 2',[…]]], {min:0, max:100, step:20});
```

## miniTable — 작은 표 체험 (칸 고치기·줄 고르기)
```js
const mt=miniTable('basketTbl', {cols:['거래','삼겹살','콜라'], rows:[[1,1,1],[2,0,1]], edit:[1,2], pick:true,
  onChange(rows){…}, onPick(idx){…}});
```

## memoOf — 다른 차시 메모 읽기
`memoOf('u3-model','plan')` → 그 차시에 적은 글(없으면 ''). `tools/check.py`가 차시·키가 있는지 확인한다.

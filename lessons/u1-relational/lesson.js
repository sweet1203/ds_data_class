/* 01 그림 Ⅰ-8 영화 상영 정보: 칼럼·레코드 살펴보기 / 중복 찾기 */
(function(){
  const COLS=['영화 제목','감독 이름','주연 배우 이름','장르','상영관'];
  const ROWS=[['어벤져스 엔드게임','조 루소','로버트 다우니 주니어','액션','DGV 강남1관'],
    ['어벤져스 엔드게임','조 루소','로버트 다우니 주니어','액션','DGV 강남2관'],
    ['인터스텔라','크리스토퍼 놀란','매듀 매커니히','SF','롯데 시청1관'],
    ['인터스텔라','크리스토퍼 놀란','매듀 매커니히','SF','롯데 시청2관'],
    ['타이타닉','제임스 카메룬','케이트 윈슬렛','로맨스','영화박스 신촌1관']];
  const times=(c,v)=>ROWS.filter(r=>r[c]===v).length;
  const DUP=[]; ROWS.forEach((r,i)=>r.forEach((v,c)=>{if(times(c,v)>1) DUP.push(i+'-'+c);}));
  const CELLS=ROWS.length*COLS.length;
  let mode='look', hl=null, found=new Set(), miss=null, msg='';
  function draw(){
    $('mvMode').innerHTML=`<button data-m="look" class="${mode==='look'?'on':''}">🔍 칼럼·레코드 살펴보기</button><button data-m="dup" class="${mode==='dup'?'on':''}">🔁 중복 찾기</button>`;
    $('mvMode').querySelectorAll('button').forEach(b=>b.onclick=()=>{mode=b.dataset.m; hl=null; miss=null;
      msg=mode==='dup'?'같은 칼럼 안에서 <b>같은 값이 두 번 이상</b> 나오는 칸을 찾아 눌러 보세요.':''; draw();});
    const cls=(i,c)=>{const k=i+'-'+c; let s='';
      if(mode==='look'&&hl){ if(hl.t==='col'&&hl.c===c) s+=' col'; if(hl.t==='row'&&hl.r===i) s+=' rec'; if(hl.t==='tbl') s+=' tblon'; }
      if(mode==='dup'){ if(found.has(k)) s+=' dup'; if(miss===k) s+=' uniq'; }
      return s;};
    $('mvBox').innerHTML=`${mode==='look'?`<button class="rd-tblchip ${hl&&hl.t==='tbl'?'on':''}" data-tbl="1">테이블 = 관계(relation)</button>`:`<div class="rd-dupcnt">찾은 중복 칸 <b>${found.size}</b> / ${DUP.length}</div>`}
      <div class="rd-scroll"><table class="rd-tbl rd-mv ${mode}">
        <tr>${COLS.map((h,c)=>`<th data-c="${c}" class="${mode==='look'&&hl&&hl.t==='col'&&hl.c===c?'col':''}">${h}</th>`).join('')}</tr>
        ${ROWS.map((r,i)=>`<tr>${r.map((v,c)=>`<td data-r="${i}" data-c="${c}" class="${cls(i,c)}">${v}</td>`).join('')}</tr>`).join('')}
      </table></div>
      <div class="rd-cap">${msg||(mode==='look'?'칼럼 이름(맨 윗줄)을 누르면 <b>칼럼</b>, 아래 칸을 누르면 그 칸이 속한 <b>레코드</b>가 표시돼요.':'')}</div>
      ${mode==='dup'?`<div class="row" style="margin-top:6px"><button class="btn ghost sm" data-k="all">중복 칸 모두 보기</button><button class="btn ghost sm" data-k="re">다시 찾기</button></div>`:''}`;
    const B=$('mvBox');
    if(mode==='look'){
      B.querySelector('[data-tbl]').onclick=()=>{hl={t:'tbl'}; msg='표 형식으로 되어 있는 <b>전체 데이터</b>를 <b>테이블</b> 또는 <b>관계</b>라고 불러요.'; draw();};
      B.querySelectorAll('th').forEach(th=>th.onclick=()=>{const c=+th.dataset.c; hl={t:'col',c};
        msg=`<b>칼럼</b> 「${COLS[c]}」: 테이블 안에 <b>세로로</b> 묶인 값 ${ROWS.length}개예요. 열·필드·속성이라고도 해요.`; draw();});
      B.querySelectorAll('td').forEach(td=>td.onclick=()=>{const r=+td.dataset.r; hl={t:'row',r};
        msg=`<b>레코드</b> ${r+1}번째 줄: 「${ROWS[r].join(' · ')}」처럼 각 칼럼의 값을 <b>가로로</b> 묶은 것이에요. 행 또는 튜플이라고도 해요.`; draw();});
    } else {
      B.querySelectorAll('td').forEach(td=>td.onclick=()=>{const r=+td.dataset.r, c=+td.dataset.c, k=r+'-'+c, v=ROWS[r][c], n=times(c,v);
        if(n>1){ROWS.forEach((row,i)=>{if(row[c]===v) found.add(i+'-'+c);}); miss=null;
          msg=`<span class="ok">중복!</span> 「${v}」 값은 「${COLS[c]}」 칼럼에 <b>${n}번</b> 나와요.`;}
        else{miss=k; msg=`「${v}」 값은 「${COLS[c]}」 칼럼에서 한 번만 나와요. 중복이 아니에요.`;}
        if(found.size===DUP.length) msg+=` <b>다 찾았어요!</b> ${CELLS}칸 가운데 <b>${DUP.length}칸</b>이 같은 값의 반복이에요. 상영관 칼럼만 값이 모두 달라요. 영화 한 편을 상영관마다 한 줄씩 적다 보니, 영화 제목·감독·배우·장르가 줄마다 되풀이돼요.`;
        draw();});
      B.querySelector('[data-k=all]').onclick=()=>{DUP.forEach(k=>found.add(k)); miss=null;
        msg=`${CELLS}칸 가운데 <b>${DUP.length}칸</b>이 같은 값의 반복이에요. 영화 한 편을 상영관마다 한 줄씩 적다 보니, 영화 제목·감독·배우·장르가 줄마다 되풀이돼요.`; draw();};
      B.querySelector('[data-k=re]').onclick=()=>{found=new Set(); miss=null; msg='같은 칼럼 안에서 <b>같은 값이 두 번 이상</b> 나오는 칸을 찾아 눌러 보세요.'; draw();};
    }
  }
  draw();
})();

/* 02 외래키 따라가기 (41쪽 관계형 데이터베이스 예시) */
(function(){
  const BASE={
    dir:{n:'감독 테이블',h:['감독 ID','감독 이름'],rows:[['01','조 루소'],['02','크리스토퍼 놀란'],['03','제임스 카메룬']]},
    act:{n:'배우 테이블',h:['배우 ID','배우 이름'],rows:[['A1','로버트 다우니 주니어'],['A2','매듀 매커니히'],['A3','케이트 윈슬렛']]},
    gen:{n:'장르 테이블',h:['장르 ID','장르 이름'],rows:[['G1','액션'],['G2','SF'],['G3','로맨스']]},
    the:{n:'상영관 테이블',h:['상영관 ID','상영관 이름'],rows:[['C1','DGV 강남1관'],['C2','롯데 시청1관'],['C3','영화박스 신촌1관']]},
  };
  const FK=['dir','act','gen','the'];
  const MOV={n:'영화 테이블',h:['영화 ID','영화 제목','감독 ID','배우 ID','장르 ID','상영관 ID'],rows:[['01','어벤져스 엔드게임','01','A1','G1','C1'],['02','인터스텔라','02','A2','G2','C2'],['03','타이타닉','03','A3','G3','C3']]};
  const B=$('fkSim'); let T, hit, msg, line, seen, iv={id:'',nm:''};
  function reset(){T=JSON.parse(JSON.stringify(BASE)); hit=null; line=null; seen=new Set(); iv={id:'',nm:''};
    msg='영화 테이블의 <b>외래키 칸</b>이나 <b>영화 ID</b>를 눌러 보세요.'; draw();}
  const look=(t,id)=>T[t].rows.findIndex(r=>r[0]===id);
  function small(key){const t=T[key];
    return `<div class="rd-fkt" data-t="${key}"><b>${t.n}</b><table class="rd-tbl"><tr><th>🔑 ${t.h[0]}</th><th>${t.h[1]}</th></tr>
      ${t.rows.map((r,i)=>`<tr class="${hit&&hit.some(h=>h[0]===key&&h[1]===i)?'hit':''}"><td class="pk">${esc(r[0])}</td><td>${esc(r[1])}${r[2]?' <small class="muted">(예시)</small>':''}</td></tr>`).join('')}</table><small class="muted">기본키: ${t.h[0]}</small></div>`;}
  function draw(){
    B.innerHTML=`<div class="rd-fk">
      <div class="rd-fk-top">${small('dir')}${small('act')}</div>
      <div class="rd-fkt rd-mov"><b>${MOV.n} <small class="muted">· 영화 상영 정보</small></b><div class="rd-scroll"><table class="rd-tbl">
        <tr>${MOV.h.map((h,c)=>`<th>${c===0?'🔑 ':c>1?'🧷 ':''}${h}</th>`).join('')}</tr>
        ${MOV.rows.map((r,i)=>`<tr>${r.map((v,c)=>`<td data-r="${i}" data-c="${c}" class="${c===0?'pk go':c>1?'fk go':''} ${hit&&hit.src&&hit.src.some(s=>s[0]===i&&s[1]===c)?'on':''}">${v}</td>`).join('')}</tr>`).join('')}
      </table></div><small class="muted">기본키: 영화 ID · 외래키: 감독 ID, 배우 ID, 장르 ID, 상영관 ID</small></div>
      <div class="rd-fk-top">${small('gen')}${small('the')}</div>
    </div>
    <div class="rd-cap">${msg}</div>
    ${line?`<div class="rd-scroll"><table class="rd-tbl rd-line"><tr><th>영화 제목</th><th>감독 이름</th><th>주연 배우 이름</th><th>장르</th><th>상영관</th></tr><tr>${line.map(v=>`<td>${v}</td>`).join('')}</tr></table></div>`:''}
    <div class="rd-add"><b>🔑 기본키 지키기</b> <span class="muted">(선택)</span> 감독 테이블에 새 감독을 넣어 보세요. 이미 있는 감독 ID를 넣으면 어떻게 될까요?
      <div class="row" style="margin-top:6px"><label>감독 ID <input class="rd-in" data-i="id" size="4" placeholder="예: 04" value="${esc(iv.id)}"></label><label>감독 이름 <input class="rd-in" data-i="nm" size="12" placeholder="예: 알폰소 쿠아론" value="${esc(iv.nm)}"></label><button class="btn sm" data-k="add">넣기</button><button class="btn ghost sm" data-k="re">처음부터 다시</button></div></div>`;
    B.querySelectorAll('td.go').forEach(td=>td.onclick=()=>{const r=+td.dataset.r, c=+td.dataset.c, m=MOV.rows[r]; seen.add(r);
      if(c===0){hit=FK.map((t,j)=>[t,look(t,m[j+2])]); hit.src=[2,3,4,5].map(x=>[r,x]).concat([[r,0]]);
        line=[m[1],...FK.map((t,j)=>T[t].rows[look(t,m[j+2])][1])];
        msg=`영화 ID <b>${m[0]}</b>(${m[1]})의 외래키 네 개를 따라가 상영 정보 한 줄을 다시 만들었어요. 그림 Ⅰ-8의 레코드와 같은 내용이에요.${seen.size>=3?' 세 영화를 모두 따라가 보았어요.':''}`;}
      else{const t=FK[c-2], i=look(t,m[c]); hit=[[t,i]]; hit.src=[[r,c]]; line=null;
        msg=`영화 테이블의 ${MOV.h[c]} <b>${m[c]}</b> → ${T[t].n}에서 기본키가 <b>${m[c]}</b>인 행 → <b>${T[t].rows[i][1]}</b>. 외래키는 다른 테이블의 기본키를 가리켜요.`;}
      draw();});
    B.querySelectorAll('[data-i]').forEach(x=>x.oninput=()=>{iv[x.dataset.i]=x.value;});
    B.querySelector('[data-k=add]').onclick=()=>{const id=iv.id.trim(), nm=iv.nm.trim();
      if(!id||!nm){msg='감독 ID와 감독 이름을 모두 적어요.'; draw(); return;}
      const j=look('dir',id);
      if(j>=0){hit=[['dir',j]]; hit.src=[]; line=null;
        msg=`<span class="ng">넣을 수 없어요.</span> 감독 ID <b>${esc(id)}</b>는 이미 「${esc(T.dir.rows[j][1])}」의 기본키예요. 기본키는 <b>중복되는 값이 없어야</b> 해요. 같은 ID가 두 사람에게 붙으면 영화 테이블의 외래키가 누구를 가리키는지 알 수 없어요.`;}
      else{T.dir.rows.push([id,nm,1]); iv={id:'',nm:''}; hit=[['dir',T.dir.rows.length-1]]; hit.src=[]; line=null;
        msg=`<span class="ok">들어갔어요.</span> 감독 테이블에 새 행(${esc(id)} · ${esc(nm)})이 생겼어요. 이 감독의 영화를 영화 테이블에 넣는다면 감독 ID 칸에 <b>${esc(id)}</b>를 적어 연결해요.`;}
      draw();};
    B.querySelector('[data-k=re]').onclick=reset;
  }
  reset();
})();

/* 03 스스로 해결하기 · VLOOKUP (43쪽, 바람 열은 출판사 정오표 반영) */
(function(){
  const ACC=[[20240920,1,1,2],[20240921,0,1,3],[20240922,1,0,4],[20240923,1,1,1],[20240924,2,0,1]];
  const WX=[[20240920,24,10,10],[20240921,25,9,11],[20240922,25,9,8],[20240923,26,11,11],[20240924,27,9,7]];
  const AH=['날짜','사망자','중상자','경상자'], WH=['날짜','기온','강수량','바람'], LT='ABCDEFG';
  const B=$('vlook'); let ord, fill, sel, hl, miss, cmp, msg;
  function reset(){ord=[0,1,2,3,4]; fill=ACC.map(()=>[null,null,null]); sel=null; hl=null; miss=0; cmp=false;
    msg='데이터 통합 시트의 <b>노란 빈칸</b>(E~G열) 하나를 눌러 시작해요.'; draw();}
  const pos=d=>ord.findIndex(i=>WX[i][0]===d);
  const left=()=>fill.flat().filter(v=>v==null).length;
  function sheet(name,head,rows,cls){return `<div class="rd-sh"><div class="rd-sh-n">${name}</div><table class="rd-xl"><tr><th></th>${head.map((_,c)=>`<th>${LT[c]}</th>`).join('')}</tr>
    <tr><th>1</th>${head.map(h=>`<td class="hd">${h}</td>`).join('')}</tr>${rows.map((r,i)=>`<tr><th>${i+2}</th>${r.map((v,c)=>`<td class="${cls(i,c)}">${v}</td>`).join('')}</tr>`).join('')}</table></div>`;}
  function draw(){
    const L=left();
    const accSheet=sheet('교통사고 시트',AH,ACC,(i,c)=>hl&&hl.r===i&&c===0?'key':'');
    const wxSheet=sheet('날씨 시트',WH,ord.map(i=>WX[i]),(p,c)=>!hl||hl.p!==p?'':(c===0?'key':c===hl.n-1?'got':'row'));
    const merged=`<div class="rd-sh rd-wide"><div class="rd-sh-n">데이터 통합 시트 <small>(교통사고 시트 기준)</small></div><table class="rd-xl"><tr><th></th>${[...LT].map(c=>`<th>${c}</th>`).join('')}</tr>
      <tr><th>1</th>${[...AH,...WH.slice(1)].map((h,c)=>`<td class="hd${c>3?' wx':''}">${h}</td>`).join('')}</tr>
      ${ACC.map((r,i)=>`<tr><th>${i+2}</th>${r.map((v,c)=>`<td class="${hl&&hl.r===i&&c===0?'key':''}">${v}</td>`).join('')}${[0,1,2].map(k=>{const v=fill[i][k], s=sel&&sel.r===i&&sel.k===k;
        return `<td class="${v==null?'emp':'filled'} ${s?'sel':''}" data-r="${i}" data-k="${k}">${v==null?'':v}</td>`;}).join('')}</tr>`).join('')}</table></div>`;
    const cell=sel?`${LT[4+sel.k]}${sel.r+2}`:'';
    const fx=sel?`=VLOOKUP(A${sel.r+2}, 날씨!A:D, ${fill[sel.r][sel.k]!=null?sel.k+2:'<b class="q">?</b>'}, FALSE)`:'';
    let cmpH='';
    if(cmp){let bad=0; const rows=ACC.map((r,i)=>{const w=WX[ord[i]], ok=w[0]===r[0]; if(!ok) bad++;
        return `<tr class="${ok?'':'bad'}"><td>${r[0]}</td><td>${WX.find(x=>x[0]===r[0])[1]}</td><td>${w[1]} <small class="muted">(${w[0]}의 기온)</small></td><td>${ok?'✅':'❌'}</td></tr>`;}).join('');
      cmpH=`<div class="rd-cmp"><b>순서대로 붙여넣기와 비교하기 · 기온 열</b>
        <div class="rd-scroll"><table class="rd-tbl"><tr><th>교통사고 날짜</th><th>VLOOKUP(날짜로 찾기)</th><th>날씨 시트를 순서대로 붙였다면</th><th>맞음?</th></tr>${rows}</table></div>
        <p>${bad?`날씨 시트의 행 순서가 달라서 <b>${bad}줄</b>에 다른 날짜의 날씨가 붙었어요. 순서대로 붙여넣으면 이런 오류가 생기지만, VLOOKUP은 <b>날짜로 찾아서</b> 가져오기 때문에 순서와 상관없이 맞아요.`:'지금은 두 시트의 날짜 순서가 같아서 순서대로 붙여도 우연히 맞아요. <b>날씨 시트 행 섞기</b>를 누른 뒤 다시 비교해 보세요.'}</p></div>`;}
    B.innerHTML=`<div class="rd-two">${accSheet}${wxSheet}</div>
      <div class="rd-fx"><span class="rd-fx-c">${cell||'&nbsp;'}</span><span class="rd-fx-f">fx</span><span class="rd-fx-v mono">${fx||'<span class="muted">빈칸을 누르면 여기에 함수가 보여요</span>'}</span></div>
      <p class="note rd-fxn">수식 읽기: <b>A2</b> 찾을 값 · <b>날씨!A:D</b> 찾을 표(왼쪽 열에서 찾음) · <b>2</b> 가져올 열 번호 · <b>FALSE</b> 정확히 일치하는 값을 찾아요.</p>
      ${merged}
      ${sel&&fill[sel.r][sel.k]==null?`<div class="rd-ask">통합 시트 <b>${cell}</b>(${WH[sel.k+1]})에는 날씨 시트의 <b>몇 번째 열</b>을 가져와야 할까요? <span class="row" style="display:inline-flex">${[2,3,4].map(n=>`<button class="btn sm ghost" data-n="${n}">${n}번째 열 (${LT[n-1]}열)</button>`).join('')}</span></div>`:''}
      <div class="rd-cap">${msg}</div>
      <div class="rd-stat">채운 칸 <b>${15-L}</b> / 15 · 열 번호를 잘못 고른 횟수 <b class="${miss?'ng':''}">${miss}</b></div>
      <div class="row" style="margin-top:6px"><button class="btn ghost sm" data-k="all" ${L?'':'disabled'}>남은 칸 모두 채우기</button><button class="btn ghost sm" data-k="mix">날씨 시트 행 섞기</button><button class="btn ghost sm" data-k="cmp">${cmp?'비교 닫기':'순서대로 붙여넣기와 비교'}</button><button class="btn ghost sm" data-k="re">처음부터 다시</button></div>
      ${cmpH}
      <p class="note">값: 교과서 43쪽 ❶의 두 시트. ❷ 그림의 바람 열은 출판사 정오표에 따라 날씨 시트와 같은 값(10·11·8·11·7)이 되도록 고쳤어요.</p>`;
    B.querySelectorAll('td[data-r]').forEach(td=>td.onclick=()=>{const r=+td.dataset.r, k=+td.dataset.k; sel={r,k};
      if(fill[r][k]!=null){const p=pos(ACC[r][0]); hl={r,p,n:k+2}; msg=`이미 채운 칸이에요. A${r+2}의 날짜 ${ACC[r][0]}을 날씨 시트 ${p+2}행에서 찾아 ${k+2}번째 열(${WH[k+1]}) 값을 가져왔어요.`;}
      else{hl=null; msg=`<b>${LT[4+k]}${r+2}</b>를 골랐어요. 찾을 값은 교통사고 시트 <b>A${r+2}</b>의 날짜 <b>${ACC[r][0]}</b>예요. 날씨 시트 머리글을 보고 열 번호를 골라요.`;}
      draw();});
    B.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{const n=+b.dataset.n, {r,k}=sel;
      if(n!==k+2){miss++; msg=`<span class="ng">다시 골라요.</span> 날씨 시트의 ${n}번째 열(${LT[n-1]}열)은 「${WH[n-1]}」이에요. 지금 채우는 칸은 「${WH[k+1]}」이에요.`; draw(); return;}
      const p=pos(ACC[r][0]), v=WX[ord[p]][n-1]; fill[r][k]=v; hl={r,p,n};
      msg=`<span class="ok">채웠어요.</span> ① 찾을 값: A${r+2}의 <b>${ACC[r][0]}</b> → ② 날씨 시트 <b>왼쪽 열(A열)</b>에서 같은 날짜를 찾았어요: <b>${p+2}행</b> → ③ 그 행의 <b>${n}번째 열(${WH[n-1]})</b> 값 <b>${v}</b>를 가져왔어요.`
        +(left()?'':' <b>통합 완료!</b> 이제 한 줄에서 날짜별 사상자 수와 날씨를 함께 볼 수 있어요.');
      draw();});
    B.querySelector('[data-k=all]').onclick=()=>{ACC.forEach((r,i)=>[0,1,2].forEach(k=>{if(fill[i][k]==null) fill[i][k]=WX[ord[pos(r[0])]][k+1];})); sel=null; hl=null;
      msg='남은 칸을 VLOOKUP으로 모두 채웠어요. 실제 스프레드시트에서는 E2:G2에 함수를 넣고 아래로 끌어 복사하면 한 번에 채워져요. <b>통합 완료!</b>'; draw();};
    B.querySelector('[data-k=mix]').onclick=()=>{let o; do{o=shuffle(ord);}while(o.every((v,i)=>v===ord[i])); ord=o; hl=null;
      msg='날씨 시트의 행 순서를 섞었어요(날짜 순서가 바뀌었어요). 이미 채운 값은 그대로 맞을까요? VLOOKUP은 <b>날짜로 찾아서</b> 가져오기 때문에 순서가 바뀌어도 같은 값을 가져와요. 빈칸을 더 채워 보며 몇 행에서 찾는지 확인해 보세요.'; draw();};
    B.querySelector('[data-k=cmp]').onclick=()=>{cmp=!cmp; draw();};
    B.querySelector('[data-k=re]').onclick=reset;
  }
  reset();
})();

/* 04 (선택) SQL 실습 · sql.js(SQLite, MIT)를 이 화면에 들어올 때 불러옴 */
(function(){
  const INS=(a)=>`INSERT INTO BoxOffice VALUES('${a[0]}', '${a[1]}',\n  '${a[2]}', '${a[3]}',\n  '${a[4]}');`;
  const STEPS=[
    {t:'① 테이블 만들기',d:'<b>CREATE TABLE</b>(데이터 정의 언어)로 BoxOffice 테이블의 칼럼 이름과 데이터 유형을 정의해요. <b>VARCHAR(255)</b>는 최대 255글자까지 저장하는 가변 길이 문자열이고, <b>NOT NULL</b>은 비워 둘 수 없다는 뜻이에요.',
     sql:'CREATE TABLE BoxOffice(\n  영화_제목 VARCHAR(255) NOT NULL,\n  감독_이름 VARCHAR(255),\n  주연_배우_이름 VARCHAR(255),\n  장르 VARCHAR(100),\n  상영관 VARCHAR(255)\n);'},
    {t:'② 데이터 삽입',d:'<b>INSERT INTO … VALUES</b>(데이터 조작 언어)로 레코드 5개를 넣어요. 글자 값은 작은따옴표로 감싸요. 타이타닉의 장르는 교과서 46쪽처럼 <b>\'액션\'</b>으로 넣어요. ⑥에서 고쳐요.',
     sql:[['어벤져스 엔드게임','조 루소','로버트 다우니 주니어','액션','DGV 강남1관'],['어벤져스 엔드게임','조 루소','로버트 다우니 주니어','액션','DGV 강남2관'],['인터스텔라','크리스토퍼 놀란','매듀 매커니히','SF','롯데 시청1관'],['인터스텔라','크리스토퍼 놀란','매듀 매커니히','SF','롯데 시청2관'],['타이타닉','제임스 카메룬','케이트 윈슬렛','액션','영화박스 신촌1관']].map(INS).join('\n')},
    {t:'③ 출력하기',d:'<b>SELECT * FROM</b>으로 테이블의 모든 칼럼(*)을 출력해요. 데이터가 잘 삽입되었는지 확인해요.',sql:'SELECT * FROM BoxOffice;'},
    {t:'④ 데이터 추가',d:'그래비티 레코드를 추가한 뒤 결과를 출력해요. 명령 두 개를 한 번에 실행해요.',sql:INS(['그래비티','알폰소 쿠아론','산드라 블록','로맨스','우리극장 1관'])+'\nSELECT * FROM BoxOffice;'},
    {t:'⑤ 조건으로 조회',d:'<b>WHERE</b> 뒤에 조건을 써서 장르가 SF인 레코드만 조회해요.',sql:"SELECT * FROM BoxOffice WHERE 장르 = 'SF';"},
    {t:'⑥ 데이터 수정',d:'<b>UPDATE … SET … WHERE</b>로 영화 제목이 타이타닉인 레코드의 장르를 40쪽 표와 같은 \'로맨스\'로 고쳐요. 실행한 뒤 <b>SELECT * 넣기</b>로 확인해요.',sql:"UPDATE BoxOffice SET 장르 = '로맨스'\nWHERE 영화_제목 = '타이타닉';"},
    {t:'⑦ 데이터 삭제',d:'<b>DELETE FROM … WHERE</b>로 상영관이 DGV 강남2관인 레코드를 삭제해요. 실행한 뒤 <b>SELECT * 넣기</b>로 확인해요.',sql:"DELETE FROM BoxOffice WHERE 상영관 = 'DGV 강남2관';"},
  ];
  const B=$('sqlLab'); let SQL=null, db=null, loading=null, cur=-1, done=new Set(), again=false;
  B.innerHTML=`<div class="rd-sqst"></div>
    <div class="rd-steps">${STEPS.map((s,i)=>`<button data-s="${i}">${s.t}</button>`).join('')}</div>
    <div class="rd-sqd muted">단추를 눌러 명령을 불러오거나, 아래 칸에 직접 써요.</div>
    <textarea class="rd-code" spellcheck="false" autocapitalize="off" autocomplete="off" rows="7" aria-label="SQL 명령"></textarea>
    <div class="row" style="margin-top:6px"><button class="btn sm" data-k="run">실행 ▶</button><button class="btn ghost sm" data-k="sel">SELECT * 넣기</button><button class="btn ghost sm" data-k="re">처음부터 다시</button><span class="rd-cnt muted"></span></div>
    <div class="rd-out"></div>
    <p class="note">💭 생각해 보기(47쪽): BoxOffice 테이블의 <b>모든 데이터</b>를 삭제하려면 어떻게 해야 할까요? 직접 써서 실행해 보고, <b>처음부터 다시</b>로 되돌려요.</p>`;
  const ta=B.querySelector('.rd-code'), out=B.querySelector('.rd-out'), st=B.querySelector('.rd-sqst'), cnt=B.querySelector('.rd-cnt');
  function status(h,bad){st.innerHTML=h; st.className='rd-sqst'+(bad?' bad':'');}
  function count(){if(!db){cnt.textContent='';return;}
    try{const r=db.exec('SELECT COUNT(*) FROM BoxOffice'); cnt.textContent=`지금 BoxOffice 레코드 ${r[0].values[0][0]}개`;}catch(e){cnt.textContent='아직 BoxOffice 테이블이 없어요';}}
  function marks(){B.querySelectorAll('[data-s]').forEach(b=>{const i=+b.dataset.s; b.classList.toggle('done',done.has(i)); b.classList.toggle('on',i===cur);});}
  function load(){
    if(db||loading) return;
    status('⏳ SQL 실행기를 불러오는 중이에요…');
    loading=new Promise((ok,bad)=>{ if(window.initSqlJs) return ok();
        const s=document.createElement('script'); s.src='sql-wasm.js'; s.onload=ok; s.onerror=()=>bad(new Error('script')); document.head.appendChild(s);})
      .then(()=>initSqlJs({locateFile:f=>f}))
      .then(S=>{SQL=S; db=new S.Database(); status('✅ SQL 실행기가 준비됐어요. <b>① 테이블 만들기</b>부터 시작해요.'); count();})
      .catch(()=>{loading=null; const web=/^https?:$/.test(location.protocol);
        status((web?'⚠️ SQL 실행기를 불러오지 못했어요. 네트워크가 잠시 불안정했을 수 있어요. 다시 불러와 보고, 그래도 안 되면 선생님께 알려 주세요.':'⚠️ 이 화면은 <b>수업 사이트 주소로 열어야</b> SQL 실습기가 떠요. 파일을 직접 열었거나 미리 보기 화면이라 실행기를 불러올 수 없어요. 선생님께 알려 주세요.')+' <button class="btn ghost sm" data-k="retry">다시 불러오기</button><br><small>명령과 결과는 교과서 46~47쪽에서 볼 수 있어요.</small>',true);
        const r=st.querySelector('[data-k=retry]'); if(r) r.onclick=load;});
  }
  function friendly(m){
    let x='';
    if(/no such table/i.test(m)) x='아직 그런 테이블이 없어요. <b>① 테이블 만들기</b>를 먼저 실행했는지, 테이블 이름(BoxOffice)의 철자를 확인해요.';
    else if(/already exists/i.test(m)) x='이미 같은 이름의 테이블이 있어요. 새로 만들고 싶으면 <b>처음부터 다시</b>를 눌러요.';
    else if(/no such column/i.test(m)) x='그런 칼럼이 없어요. 칼럼 이름(영화_제목, 감독_이름, 주연_배우_이름, 장르, 상영관)의 철자와 밑줄(_)을 확인해요. 글자 값이라면 작은따옴표(\' \')로 감싸야 해요.';
    else if(/NOT NULL/i.test(m)) x='영화_제목 칸은 비워 둘 수 없어요(NOT NULL로 정했어요).';
    else if(/values for \d+ columns|has \d+ columns but \d+ values|\d+ values for \d+ columns/i.test(m)) x='칼럼 수와 넣은 값의 수가 달라요. 값 다섯 개를 쉼표로 구분해 넣었는지 확인해요.';
    else if(/unrecognized token/i.test(m)) x='알 수 없는 글자가 있어요. 따옴표가 짝이 맞는지, 굽은 따옴표(‘ ’)를 쓰지 않았는지 확인해요.';
    else if(/incomplete input/i.test(m)) x='명령이 끝나지 않았어요. 괄호와 따옴표를 닫았는지 확인해요.';
    else if(/syntax error/i.test(m)){const n=(m.match(/near "([^"]*)"/)||[])[1]; x=`명령의 짜임이 맞지 않아요${n?`(「${esc(n)}」 근처)`:''}. 낱말 철자, 쉼표, 괄호, 따옴표를 확인해요.`;}
    else x='실행하지 못했어요. 명령을 다시 확인해요.';
    return `<div class="rd-err">⚠️ ${x}<br><small class="muted">원래 메시지: ${esc(m)}</small></div>`;
  }
  function table(r){return `<div class="rd-scroll"><table class="rd-tbl rd-res"><tr>${r.columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr>${r.values.map(v=>`<tr>${v.map(x=>`<td>${x==null?'<span class="muted">NULL</span>':esc(x)}</td>`).join('')}</tr>`).join('')}</table></div><small class="muted">${r.values.length}개 레코드</small>`;}
  function run(){
    const sql=ta.value.trim();
    if(!sql){out.innerHTML='<div class="rd-err">실행할 명령을 먼저 써요.</div>'; return;}
    if(!db){out.innerHTML='<div class="rd-err">SQL 실행기가 아직 준비되지 않았어요. 위의 안내를 확인해요.</div>'; load(); return;}
    if(/주연\s+배우_이름/.test(sql)){out.innerHTML='<div class="rd-err">⚠️ 칼럼 이름 「주연 배우_이름」에 띄어쓰기가 있어요. SQL에서 띄어 쓰면 다른 낱말로 읽혀요. 이 실습기에서는 「주연_배우_이름」으로 붙여 써요. <button class="btn ghost sm" data-k="fixs">붙여 쓰기로 바꾸기</button></div>';
      out.querySelector('[data-k=fixs]').onclick=()=>{ta.value=ta.value.replace(/주연\s+배우_이름/g,'주연_배우_이름'); out.innerHTML='<div class="rd-ok">바꿨어요. 다시 <b>실행 ▶</b>을 눌러요.</div>';}; return;}
    const un=sql.match(/(^|;)\s*(GRANT|REVOKE|COMMIT|ROLLBACK|TRUNCATE)\b/i);
    if(un){out.innerHTML=`<div class="rd-err">ℹ️ <b>${un[2].toUpperCase()}</b>는 교과서에 나오는 명령이지만, <b>이 실습기(SQLite)에서는 지원하지 않는 명령이에요.</b> 여기서는 CREATE, INSERT, SELECT, UPDATE, DELETE를 실습해요.</div>`; return;}
    if((cur===1||cur===3) && done.has(cur) && ta.value===STEPS[cur].sql && !again){out.innerHTML='<div class="rd-err">ℹ️ 이 단계는 <b>이미 넣었어요.</b> 한 번 더 넣으면 같은 레코드가 또 생겨요. <button class="btn ghost sm" data-k="again">그래도 실행</button></div>';
      out.querySelector('[data-k=again]').onclick=()=>{again=true; run(); again=false;}; return;}
    if(/[‘’“”]/.test(sql)){out.innerHTML='<div class="rd-err">⚠️ 굽은 따옴표(‘ ’ “ ”)가 있어요. SQL에서는 곧은 작은따옴표(\')를 써야 해요. <button class="btn ghost sm" data-k="fixq">곧은 따옴표로 바꾸기</button></div>';
      out.querySelector('[data-k=fixq]').onclick=()=>{ta.value=ta.value.replace(/[‘’]/g,"'").replace(/[“”]/g,'"'); out.innerHTML='<div class="rd-ok">바꿨어요. 다시 <b>실행 ▶</b>을 눌러요.</div>';}; return;}
    try{
      const tc=()=>db.exec('SELECT total_changes()')[0].values[0][0];
      const b0=tc(), res=db.exec(sql), ch=tc()-b0;
      let h=`<div class="rd-ok">✅ 실행했어요.${ch?` 바뀐 레코드 <b>${ch}개</b>.`:''}${/^\s*(UPDATE|DELETE)/i.test(sql)&&!res.length?' <b>SELECT * 넣기</b>로 결과를 확인해 보세요.':''}</div>`;
      h+=res.map(table).join('');
      out.innerHTML=h; if(cur>=0 && ta.value===STEPS[cur].sql) done.add(cur); marks();
    }catch(e){out.innerHTML=friendly(String(e.message||e));}
    count();
  }
  B.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{cur=+b.dataset.s; ta.value=STEPS[cur].sql; B.querySelector('.rd-sqd').innerHTML=STEPS[cur].d; B.querySelector('.rd-sqd').classList.remove('muted'); out.innerHTML=''; marks();});
  ta.addEventListener('input',()=>{if(cur>=0 && ta.value!==STEPS[cur].sql){cur=-1; marks();}});
  ta.addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault(); run();}});
  B.querySelector('[data-k=run]').onclick=run;
  B.querySelector('[data-k=sel]').onclick=()=>{ta.value='SELECT * FROM BoxOffice;'; cur=-1; marks(); ta.focus();};
  B.querySelector('[data-k=re]').onclick=()=>{done=new Set(); cur=-1; ta.value='';
    if(SQL){try{db.close();}catch(e){} db=new SQL.Database(); out.innerHTML='<div class="rd-ok">데이터베이스를 새로 만들었어요. <b>① 테이블 만들기</b>부터 다시 해요.</div>';}
    else{out.innerHTML='<div class="rd-err">아직 SQL 실행기를 불러오지 못해서 새로 만들 데이터베이스가 없어요. 위의 안내를 확인해요.</div>'; load();} B.querySelector('.rd-sqd').innerHTML='단추를 눌러 명령을 불러오거나, 아래 칸에 직접 써요.'; marks(); count();};
  status('이 화면에서 SQL 실행기를 불러와요.');
  onShow[4]=load;
})();

/* 05 마무리 */
const MEMOLIST=[['planRel','처음 생각 · 반복해서 적힌 정보를 고칠 때'],['fkNote','외래키 따라가기 · 영화 ID 02의 상영 정보'],['vlookNote','VLOOKUP 통합 · 날짜로 찾는 까닭과 질문'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[5]=()=>memoSummary('msum',MEMOLIST);

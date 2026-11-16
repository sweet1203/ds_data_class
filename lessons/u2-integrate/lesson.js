/* u2-integrate 데이터 통합과 스케일링 (교과서 74~77쪽) */
/* 숫자 표시: 마이너스는 「−」 */
const igN=v=>{const r=Math.round(v*1000)/1000; return String(Object.is(r,-0)?0:r).replace('-','−');};
const igF=(v,d)=>{const s=(Math.round(v*10**d)/10**d).toFixed(d); return (/^-0\.?0*$/.test(s)?s.slice(1):s).replace('-','−');};
const igMean=a=>a.reduce((s,x)=>s+x,0)/a.length;
/* 표준편차: 편차 제곱의 평균의 제곱근(표준화 후 표준편차가 정확히 1) */
const igSd=a=>{const m=igMean(a); return Math.sqrt(igMean(a.map(x=>(x-m)**2)));};
function igQ(a,p){const s=[...a].sort((x,y)=>x-y), pos=(s.length-1)*p, lo=Math.floor(pos), f=pos-lo; return lo+1<s.length? s[lo]+(s[lo+1]-s[lo])*f : s[lo];}
const igClear=g=>{while(g.firstChild) g.removeChild(g.firstChild);};
const igP=v=>v<0?'('+igN(v)+')':igN(v);

/* 0 시작: 지난 시간(u2-clean)에 적은 나의 계획 보여 주기 — 읽기만 함 */
(function(){
  let p=''; try{ p=String((store.get('ds-u2-clean-memo'+WHO.sfx,{})||{}).plan||'').trim(); }catch(e){ p=''; }
  $('igPrev').innerHTML=p?`<b>지난 시간(교과서 70쪽)에 적은 나의 계획</b><span>${esc(p)}</span>`:'';
  $('igPrev').style.display=p?'':'none';
})();

/* 01 연도로 두 표 합치기 (표 Ⅱ-5 값, 온도 표의 연도 표기는 지어낸 예시) */
(function(){
  const A0=[[1986,null],[1987,null],[1988,null],[1989,0.0],[1990,-0.9],[1991,-0.1],[1992,0.5],[1993,-2.5]];
  const B0=[["'86",-0.9],['1987년',-0.7],['1988',-0.2],['1989',-0.5],["'90",0.1],['1991',-0.6],['1992년',-0.4],['1992',-0.4],['93',-1.0]];
  const TARGET=[[1989,0.0,-0.5],[1990,-0.9,0.1],[1991,-0.1,-0.6],[1992,0.5,-0.4],[1993,-2.5,-1.0]];
  const MISSY=['1986','1987','1988'];
  const isY=s=>/^\d{4}$/.test(s), toY=s=>{const d=s.replace(/\D/g,''); return d.length===2?'19'+d:d;};
  const NBAD=B0.filter(b=>!isY(b[0])).length;
  let A, B, log;
  const say=h=>{$('igStepMsg').innerHTML=h; $('igStepMsg').classList.toggle('on',!!h);};
  function draw(){
    $('igTA').innerHTML='<tr><th>연도</th><th>해수면 높이 편차</th></tr>'+A.map(a=>`<tr class="${a.del?'del':''}"><td>${a.y}</td><td class="${a.h==null&&!a.del?'nan':''}">${a.h==null?'NaN':igF(a.h,1)}</td></tr>`).join('');
    $('igTB').innerHTML='<tr><th>연도</th><th>해수면 온도 편차</th></tr>'+B.map((b,i)=>`<tr class="${b.del?'del':''}"><td><button class="yb${b.cur!==b.raw?' fixed':''}" data-i="${i}"${b.del?' disabled':''}>${esc(b.cur)}</button></td><td>${igF(b.t,1)}</td></tr>`).join('');
    $('igTB').querySelectorAll('.yb').forEach(btn=>btn.onclick=()=>{
      const b=B[+btn.dataset.i];
      if(isY(b.cur)){ say(b.cur!==b.raw?`「${esc(b.raw)}」 칸은 이미 고쳤어요(→ ${b.cur}).`:`「${b.cur}」 칸은 이미 YYYY 형식이에요. 다른 칸을 찾아보세요.`); return; }
      const old=b.cur; b.cur=toY(b.cur);
      const left=B.filter(x=>!isY(x.cur)).length;
      say(`「${esc(old)}」 → <b>${b.cur}</b>. 숫자 네 자리(YYYY) 형식으로 맞추었어요.${left?` 아직 ${left}칸 남았어요.`:' 형식을 모두 맞추었어요!'}`); draw();
    });
    $('igFixCnt').textContent=`고친 칸 ${B.filter(b=>b.cur!==b.raw).length} / ${NBAD}`;
  }
  function reset(){
    A=A0.map(([y,h])=>({y,h,del:false})); B=B0.map(([raw,t])=>({raw,cur:raw,t,del:false})); log=[];
    $('igResult').innerHTML=''; $('igResult').classList.remove('good'); say(''); draw();
  }
  $('igDedup').onclick=()=>{
    const seen=new Set(); let n=0;
    B.forEach(b=>{ if(b.del) return; const k=b.cur+'|'+b.t; if(seen.has(k)){ b.del=true; n++; } else seen.add(k); });
    const unfixed=B.some(b=>!b.del&&!isY(b.cur));
    if(n) say(`똑같은 줄 <b>${n}개</b>를 지웠어요. 같은 연도가 두 번 있으면 합칠 때 그 연도가 두 줄로 나와요.`);
    else if(unfixed) say('똑같은 줄이 안 보여요. 그런데 「1992년」과 「1992」는 정말 다른 연도일까요? <b>① 연도 형식을 먼저 맞추고</b> 다시 찾아보세요.');
    else say('지울 중복 줄이 없어요.');
    draw();
  };
  $('igDropNa').onclick=()=>{
    const already=A.every(a=>a.h!=null||a.del);
    A.forEach(a=>{ if(a.h==null) a.del=true; });
    let n=0; B.forEach(b=>{ if(!b.del&&MISSY.includes(b.cur)){ b.del=true; n++; } });
    const left=B.filter(b=>!b.del&&!isY(b.cur)&&MISSY.includes(toY(b.cur))).length;
    let h=already&&!n?'높이 표의 결측치 연도는 이미 지웠어요.':`높이 표에서 결측치(NaN)가 있는 1986~1988년을 지우고, 온도 표에서도 같은 연도 <b>${n}줄</b>을 지웠어요.`;
    if(left) h+=` 그런데 온도 표에 형식이 달라 같은 연도인지 알아보지 못한 줄이 <b>${left}개</b> 남았어요. 연도 형식을 맞춘 뒤 한 번 더 눌러 보세요.`;
    say(h); draw();
  };
  $('igMerge').onclick=()=>{
    const As=A.filter(a=>!a.del), Bs=B.filter(b=>!b.del), rows=[];
    As.forEach(a=>Bs.forEach(b=>{ if(String(a.y)===b.cur) rows.push({y:a.y,h:a.h,t:b.t}); }));
    const noA=As.filter(a=>!Bs.some(b=>String(a.y)===b.cur)).map(a=>a.y);
    const noB=Bs.filter(b=>!As.some(a=>String(a.y)===b.cur)).map(b=>esc(b.cur));
    const cnt={}; rows.forEach(r=>cnt[r.y]=(cnt[r.y]||0)+1);
    const dupY=Object.keys(cnt).filter(k=>cnt[k]>1), hasNa=rows.some(r=>r.h==null);
    const ok=!noA.length&&!noB.length&&rows.length===TARGET.length&&rows.every((r,i)=>r.y===TARGET[i][0]&&r.h===TARGET[i][1]&&r.t===TARGET[i][2]);
    const issues=[];
    let h=`<h4>합친 결과: ${rows.length}줄</h4><div class="ig-scroll"><table class="ig-tbl"><tr><th>연도</th><th>해수면 높이</th><th>해수면 온도</th></tr>`+
      rows.map(r=>`<tr class="${cnt[r.y]>1?'dup':''}"><td>${r.y}</td><td class="${r.h==null?'nan':''}">${r.h==null?'NaN':igF(r.h,1)}</td><td>${igF(r.t,1)}</td></tr>`).join('')+'</table></div><ul>';
    if(noA.length||noB.length){ h+=`<li><b>짝을 못 찾아 빠진 줄</b> · 높이 표: ${noA.length?noA.join(', '):'없음'} / 온도 표: ${noB.length?noB.join(', '):'없음'}</li>`; issues.push(`빠진 줄 ${noA.length+noB.length}개`); }
    if(dupY.length){ h+=`<li><b>${dupY.join(', ')}년</b>이 두 줄로 나왔어요(중복).</li>`; issues.push('중복'); }
    if(hasNa){ h+='<li>결측치(NaN)가 있는 줄이 섞여 있어요.</li>'; issues.push('결측치 섞임'); }
    if(ok) h+='<li class="ok">교과서 표 Ⅱ-5 (c)의 1989~1993년과 같아요! 결측치가 있는 연도는 빼고, 연도가 일치하는 데이터만 통합했어요.</li>';
    else if(!issues.length) h+='<li>문제가 보이지 않아요.</li>';
    $('igResult').innerHTML=h+'</ul>'; $('igResult').classList.toggle('good',ok);
    log.push(`${rows.length}줄${ok?'(완성)':(issues.length?'('+issues.join('·')+')':'')}`);
    MEMO.mergeLog='합치기 기록: '+log.slice(-6).join(' → '); store.set(MK,MEMO);
  };
  $('igMergeReset').onclick=reset;
  reset();
})();

/* 02 스케일링 비교기 (교과서 75쪽 1989~1996년 값) */
(function(){
  const YR=[1989,1990,1991,1992,1993,1994,1995,1996];
  const H0=[0.0,-0.9,-0.1,0.5,-2.5,-0.9,-2.1,-2.4], T=[-0.5,0.1,-0.6,-0.4,-1.0,-0.1,-0.3,-0.2];
  let H=H0.slice(), mode=0, sel=-1;
  const S=$('igScaleSvg');
  const sc=a=>{ if(mode===0) return a.slice(); if(mode===1){const lo=Math.min(...a), hi=Math.max(...a); return a.map(x=>(x-lo)/(hi-lo));} const m=igMean(a), s=igSd(a); return a.map(x=>(x-m)/s); };
  function range(all){
    if(mode===1) return [-0.05,1.05];
    const lo=Math.min(...all), hi=Math.max(...all);
    if(mode===2){ const r=Math.max(2.5,Math.ceil(Math.max(-lo,hi)*2)/2); return [-r,r]; }
    const pad=Math.max(.3,(hi-lo)*.06); return [Math.floor((lo-pad)*2)/2, Math.ceil((hi+pad)*2)/2];
  }
  function ticks(lo,hi){ const st=[0.1,0.2,0.25,0.5,1,2,2.5,5,10].find(s=>(hi-lo)/s<=10)||10, out=[]; for(let t=Math.ceil(lo/st-1e-9)*st;t<=hi+1e-9;t+=st) out.push(Math.round(t*1000)/1000); return out; }
  const fv=v=>mode===0?igN(v):igF(v,3);
  function draw(){
    const sh=sc(H), st=sc(T), [lo,hi]=range(sh.concat(st)), X=v=>160+(v-lo)/(hi-lo)*530;
    igClear(S);
    el('text',{x:10,y:16,class:'axl'},S,['원래 값 · 두 속성을 같은 눈금에','Min-Max 정규화 · 0~1','표준화 · 평균 0, 표준편차 1'][mode]);
    if(mode===2) el('line',{x1:X(0),x2:X(0),y1:24,y2:192,class:'zero'},S);
    [[78,'해수면 높이 편차','#2f6fd0',sh,'ph'],[168,'해수면 온도 편차','#e0702b',st,'pt']].forEach(([y,name,col,vals,cls],r)=>{
      el('text',{x:10,y:y-6,class:'rl',fill:col},S,name);
      el('line',{x1:160,x2:690,y1:y,y2:y,class:'ax'},S);
      ticks(lo,hi).forEach(t=>{ el('line',{x1:X(t),x2:X(t),y1:y-3,y2:y+3,class:'ax'},S); el('text',{x:X(t),y:y+16,class:'tk','text-anchor':'middle'},S,igN(t)); });
      const used={};
      vals.forEach((v,i)=>{
        const px=Math.round(X(v)/6), lv=used[px]=(used[px]||0)+1, cy=y-11-(lv-1)*13;
        const c=el('circle',{cx:X(v),cy,r:6.5,class:cls+(i===sel?' sel':'')},S); el('title',{},c,`${YR[i]}년 ${name} ${fv(v)}`);
        if(r===0&&i===7&&Math.abs(H[7]-H0[7])>1e-9) el('circle',{cx:X(v),cy,r:10.5,class:'ring'},S);
      });
    });
    $('igScaleTbl').innerHTML=`<tr><th>연도</th><th>해수면 높이</th><th>해수면 온도</th></tr>`+YR.map((y,i)=>`<tr data-i="${i}" class="${i===sel?'on':''}"><td>${y}</td><td>${fv(sh[i])}</td><td>${fv(st[i])}</td></tr>`).join('');
    $('igScaleTbl').querySelectorAll('tr[data-i]').forEach(tr=>tr.onclick=()=>{sel=+tr.dataset.i; draw();});
    /* 계산식 */
    let f='표의 줄을 눌러 보세요.';
    if(sel>=0){
      const one=(nm,a)=>{
        const x=a[sel];
        if(mode===1){const mn=Math.min(...a), mx=Math.max(...a); return `<b>${nm}</b> (x − 최솟값) ÷ (최댓값 − 최솟값) = (${igN(x)} − ${igP(mn)}) ÷ (${igN(mx)} − ${igP(mn)}) = <b>${igF((x-mn)/(mx-mn),3)}</b>`;}
        const m=igMean(a), s=igSd(a); return `<b>${nm}</b> (x − 평균) ÷ 표준편차 = (${igN(x)} − ${igP(Math.round(m*1000)/1000)}) ÷ ${igF(s,3)} = <b>${igF((x-m)/s,3)}</b>`;
      };
      f=mode===0?`<b>${YR[sel]}년</b> 높이 ${igN(H[sel])}, 온도 ${igN(T[sel])} · 원래 값이에요. 위에서 Min-Max 정규화나 표준화를 골라 보세요.`
        :`<b>${YR[sel]}년</b><br>${one('높이',H)}<br>${one('온도',T)}`;
    }
    $('igFormula').innerHTML=f;
    /* 통계 */
    const chip=(nm,a,k)=>`<div style="--k:${k}"><b>${nm}</b>최솟값 ${fv(Math.min(...a))} · 최댓값 ${fv(Math.max(...a))}<br>평균 ${igF(igMean(a),mode?3:2)} · 표준편차 ${igF(igSd(a),mode?3:2)}</div>`;
    $('igScaleStat').innerHTML=chip('해수면 높이',sh,'#2f6fd0')+chip('해수면 온도',st,'#e0702b');
    /* 안내 */
    /* 이상치 판정: 원래 높이 8개의 IQR 경계(Q3 + 1.5 × IQR)로 */
    const hq1=igQ(H,.25), hq3=igQ(H,.75), hhi=hq3+1.5*(hq3-hq1), hlo=hq1-1.5*(hq3-hq1);
    const out=H[7]>hhi+1e-9||H[7]<hlo-1e-9, rest=sh.slice(0,7);
    let msg=['같은 눈금에 그리면 높이 편차는 넓게, 온도 편차는 좁게 퍼져 보여요. 온도의 차이가 잘 드러나지 않아요.',
             '두 속성 모두 가장 작은 값은 <b>0</b>, 가장 큰 값은 <b>1</b>이 되었어요. 이제 같은 눈금에서 비교할 수 있어요.',
             '두 속성 모두 평균이 <b>0</b>, 표준편차가 <b>1</b>이 되었어요. 0보다 크면 평균보다 큰 값, 작으면 평균보다 작은 값이에요.'][mode];
    if(out){
      msg+=[` <br>1996년 높이(${igN(H[7])})가 8개 값의 ${H[7]>hhi?'상한값(Q3 + 1.5 × IQR = '+igF(hhi,2)+')보다 커서':'하한값(Q1 − 1.5 × IQR = '+igF(hlo,2)+')보다 작아서'} <b>이상치</b>가 되었어요. 방법을 바꿔 보세요.`,
            ` <br>이상치인 1996년 높이가 ${H[7]>hhi?'1':'0'}을 차지해서, 나머지 7개 높이 값이 <b>${igF(Math.min(...rest),2)}~${igF(Math.max(...rest),2)}</b> 사이로 몰렸어요. 서로의 차이가 잘 보이지 않아요.`,
            ` <br>나머지 7개 높이 값이 <b>${igF(Math.min(...rest),2)}~${igF(Math.max(...rest),2)}</b> 사이에 모였어요. 표준화도 이상치의 영향을 받아요.`][mode];
      if(mode) msg+=' 그래서 스케일링 전에 이상치를 먼저 처리해요.';
    }
    if(mode===2) msg+=' <br><span class="muted">Min-Max는 최솟값·최댓값 두 값으로 정해져 이상치 하나에 범위 전체가 좌우되고, 표준화는 모든 값의 평균·표준편차로 정해져 데이터가 많으면 영향이 덜해요. 이 예처럼 값이 8개뿐이면 차이가 거의 없어요.</span>';
    $('igScaleMsg').innerHTML=msg;
  }
  $('igMode').querySelectorAll('.ig-pill').forEach(b=>b.onclick=()=>{mode=+b.dataset.m; $('igMode').querySelectorAll('.ig-pill').forEach(x=>x.classList.toggle('on',x===b)); draw();});
  const setOut=v=>{H[7]=Math.round(v*10)/10; $('igOut').value=H[7]; $('igOutVal').textContent=igN(H[7]); draw();};
  $('igOut').oninput=()=>setOut(+$('igOut').value);
  $('igOutMake').onclick=()=>setOut(12);
  $('igOutBack').onclick=()=>setOut(-2.4);
  draw();
})();

/* 02 표준화하면 분포 모양이 바뀔까? (지어낸 예시 데이터 30개씩) */
(function(){
  const SETS=[
    {n:'지난주 읽은 책 수(권)',d:'한쪽으로 치우친 예시',v:[0,0,0,0,1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,4,4,5,5,6,7,8,10,12,15]},
    {n:'하루 운동 시간(분)',d:'봉우리가 둘인 예시',v:[10,15,15,15,20,20,20,20,25,25,25,25,30,30,35,70,75,80,80,85,85,85,90,90,90,95,95,100,105,110]},
    {n:'키(cm)',d:'가운데가 볼록한 예시',v:[152,155,157,158,159,160,160,161,162,162,163,163,164,164,165,165,165,166,166,167,167,168,169,170,171,172,173,175,178,181]}
  ];
  let k=0;
  function hist(id,vals,cls,unit){
    const lo=Math.min(...vals), hi=Math.max(...vals), NB=8, w=(hi-lo)/NB, cnt=Array(NB).fill(0);
    vals.forEach(v=>{let i=Math.floor((v-lo)/w+1e-9); if(i>=NB) i=NB-1; cnt[i]++;});
    const mx=Math.max(...cnt), S=$(id), X=i=>36+i*(290/NB), Y=c=>150-c/mx*125;
    igClear(S);
    const step=mx>8?2:1;
    for(let c=0;c<=mx;c+=step){ el('line',{x1:36,x2:326,y1:Y(c),y2:Y(c),class:'gl'},S); el('text',{x:30,y:Y(c)+4,class:'tk','text-anchor':'end'},S,c); }
    cnt.forEach((c,i)=>el('rect',{x:X(i),y:Y(c),width:290/NB,height:150-Y(c),class:cls,stroke:'#fff','stroke-width':1},S));
    for(let i=0;i<=NB;i+=2) el('text',{x:X(i),y:166,class:'tk','text-anchor':'middle'},S,Math.abs(hi-lo)<20?igF(lo+i*w,1):igN(Math.round((lo+i*w)*10)/10));
    const m=igMean(vals), mxp=36+(m-lo)/(hi-lo)*290;
    el('line',{x1:mxp,x2:mxp,y1:18,y2:150,class:'mean'},S); el('text',{x:mxp+4,y:16,class:'ml'},S,'평균 '+(Math.abs(m)<1e-9?'0':igF(m,1)));
    el('text',{x:326,y:184,class:'axl','text-anchor':'end'},S,unit);
    el('text',{x:4,y:12,class:'tk'},S,'개수');
  }
  function draw(){
    const s=SETS[k], v=s.v, m=igMean(v), sd=igSd(v), z=v.map(x=>(x-m)/sd);
    hist('igHistA',v,'hb',s.n); hist('igHistB',z,'hb2','표준화한 값');
    $('igHistAS').textContent=`평균 ${igF(m,2)} · 표준편차 ${igF(sd,2)} · 최솟값 ${igN(Math.min(...v))} · 최댓값 ${igN(Math.max(...v))}`;
    $('igHistBS').textContent=`평균 ${igF(igMean(z),2)} · 표준편차 ${igF(igSd(z),2)} · 최솟값 ${igF(Math.min(...z),2)} · 최댓값 ${igF(Math.max(...z),2)}`;
  }
  $('igSet').innerHTML=SETS.map((s,i)=>`<button class="ig-pill${i===k?' on':''}" data-k="${i}">${s.n} <small>· ${s.d}</small></button>`).join('');
  $('igSet').querySelectorAll('button').forEach(b=>b.onclick=()=>{k=+b.dataset.k; $('igSet').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b)); draw();});
  vote('igShapeVote','shapeVote',[['종 모양에 가까워진다','정규 분포처럼 바뀐다'],['모양은 그대로다','눈금만 바뀐다'],['반대쪽으로 치우친다','좌우가 뒤집힌다']],()=>{$('igShapeAfter').classList.add('on'); draw();});
})();

/* 03 시각화 방법 그림(새로 그린 예시) */
(function(){
  const ax='<line x1="8" y1="62" x2="114" y2="62" stroke="#9aa3ad"/><line x1="8" y1="6" x2="8" y2="62" stroke="#9aa3ad"/>';
  const blob='M18,14 C34,4 60,8 74,12 C92,16 108,26 104,42 C100,58 80,66 58,62 C38,60 22,62 14,48 C8,36 8,22 18,14 Z';
  const T={
    '선 그래프':ax+'<polyline fill="none" stroke="#2f6fd0" stroke-width="2" points="10,50 24,46 38,48 52,38 66,40 80,30 94,26 110,16"/>',
    '막대그래프':ax+[30,22,38,26,44,34].map((h,i)=>`<rect x="${14+i*16}" y="${62-h}" width="11" height="${h}" fill="#2f6fd0"/>`).join(''),
    '히스토그램':ax+[8,18,30,42,34,20,10,5].map((h,i)=>`<rect x="${10+i*13}" y="${62-h}" width="13" height="${h}" fill="#1f9d74" stroke="#fff" stroke-width=".8"/>`).join(''),
    '박스 플롯':[[16,30,46,58,88,104],[34,12,32,40,60,84],[52,40,62,70,86,110]].map(([y,a,b,m,c,d])=>`<line x1="${a}" x2="${d}" y1="${y}" y2="${y}" stroke="#1f9d74"/><rect x="${b}" y="${y-6}" width="${c-b}" height="12" fill="#d8f0e6" stroke="#1f9d74"/><line x1="${m}" x2="${m}" y1="${y-6}" y2="${y+6}" stroke="#0f2742" stroke-width="2"/>`).join(''),
    '산점도':ax+[[14,52],[22,48],[28,50],[36,40],[42,44],[50,36],[58,38],[64,30],[72,32],[80,24],[88,26],[96,18],[104,14]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.6" fill="#e0702b"/>`).join(''),
    '히트맵':[...Array(20)].map((_,i)=>{const r=i/5|0, c=i%5, v=[.9,.6,.3,.5,.2,.6,.9,.4,.7,.3,.3,.4,.9,.5,.6,.5,.7,.5,.9,.4][i]; return `<rect x="${12+c*20}" y="${6+r*14}" width="19" height="13" fill="rgba(224,112,43,${v})"/>`;}).join(''),
    '산점도 행렬':[...Array(9)].map((_,i)=>{const r=i/3|0, c=i%3, x=14+c*34, y=4+r*21; return `<rect x="${x}" y="${y}" width="32" height="19" fill="#fff" stroke="#e3ddd2"/>`+(r===c?`<text x="${x+16}" y="${y+13}" font-size="8" text-anchor="middle" fill="#5b6776">${'ABC'[r]}</text>`:[[5,14],[11,11],[17,8],[23,6],[28,4]].map(([dx,dy],j)=>`<circle cx="${x+dx}" cy="${y+((r+c)%2?dy:19-dy)}" r="1.6" fill="#e0702b"/>`).join(''));}).join(''),
    '평행좌표 플롯':[14,44,74,104].map(x=>`<line x1="${x}" x2="${x}" y1="6" y2="62" stroke="#9aa3ad"/>`).join('')+[[50,20,40,14],[40,30,20,26],[20,50,30,44],[30,40,56,34]].map(p=>`<polyline fill="none" stroke="#e0702b" stroke-width="1.4" opacity=".8" points="${p.map((y,i)=>(14+i*30)+','+y).join(' ')}"/>`).join(''),
    '점 지도':`<path d="${blob}" fill="#f1edf7" stroke="#9b4fc4"/>`+[[30,24],[34,28],[38,26],[36,32],[62,40],[66,44],[70,38],[64,48],[84,30],[52,22],[28,46]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.2" fill="#9b4fc4"/>`).join(''),
    '등치 지역도':[['M18,14 L50,9 L56,34 L14,40 Z',.25],['M50,9 L90,16 L82,34 L56,34 Z',.7],['M90,16 L106,30 L102,44 L82,34 Z',.45],['M14,40 L56,34 L58,62 L18,56 Z',.9],['M56,34 L82,34 L80,62 L58,62 Z',.35],['M82,34 L102,44 L96,58 L80,62 Z',.6]].map(([d,v])=>`<path d="${d}" fill="rgba(155,79,196,${v})" stroke="#fff"/>`).join('')
  };
  const put=(id,names)=>{$(id).innerHTML=names.map(n=>`<figure><svg viewBox="0 0 120 70" aria-hidden="true">${T[n]}</svg><figcaption>${n}</figcaption></figure>`).join('');};
  put('igTh1',['선 그래프','막대그래프']); put('igTh2',['히스토그램','박스 플롯']); put('igTh3',['산점도','히트맵','산점도 행렬','평행좌표 플롯']); put('igTh4',['점 지도','등치 지역도']);
})();

/* 03 이 질문엔 어떤 시각화? (새로 만든 질문) */
sorter('igSort',{
  cats:[{n:'시간 시각화',k:'#2f6fd0'},{n:'분포 시각화',k:'#1f9d74'},{n:'관계 시각화',k:'#e0702b'},{n:'공간 시각화',k:'#9b4fc4'}],
  items:[
    {t:'최근 10년 동안 우리 지역의 미세먼지 농도는 해마다 어떻게 달라졌을까?',short:'10년 동안 미세먼지 농도',c:0,ic:'🌫️',w:'해마다 달라지는 흐름을 보는 질문이라 선 그래프나 막대그래프가 알맞아요.'},
    {t:'점심 무렵 매점 손님 수는 10분 단위로 어떻게 오르내릴까?',short:'10분 단위 매점 손님 수',c:0,ic:'🥪',w:'일정한 간격으로 차례로 모은 값이에요. 교과서의 「시간대별 방문자 수」 막대그래프와 같은 꼴이에요.'},
    {t:'우리 반 수학 점수는 몇 점대에 가장 많이 몰려 있을까?',short:'수학 점수가 몰린 점수대',c:1,ic:'📝',w:'점수가 구간마다 몇 명인지 보는 히스토그램이 알맞아요.'},
    {t:'1반·2반·3반 학생들의 키는 반마다 얼마나 퍼져 있을까?',short:'반마다 키가 퍼진 정도',c:1,ic:'📏',w:'여러 그룹의 퍼진 정도를 나란히 비교하는 박스 플롯이 알맞아요.'},
    {t:'하루 운동량이 많은 학생일수록 잠을 깊게 잘까?',short:'운동량과 잠의 깊이',c:2,ic:'🏃',w:'두 변수가 함께 변하는지 보는 질문이라 산점도가 알맞아요.'},
    {t:'국어·영어·수학·과학 점수는 서로 얼마나 함께 오르내릴까?',short:'네 과목 점수끼리',c:2,ic:'🧮',w:'여러 변수 사이의 쌍별 관계는 히트맵이나 산점도 행렬로 한눈에 봐요.'},
    {t:'우리 시의 전기차 충전소는 어느 동네에 모여 있을까?',short:'전기차 충전소가 모인 동네',c:3,ic:'🔌',w:'위치를 점으로 찍어 보는 점 지도가 알맞아요.'},
    {t:'시·군마다 노인 인구 비율이 얼마나 다른지 지역별 색으로 비교하려면?',short:'시·군별 노인 인구 비율',c:3,ic:'🗺️',w:'지역별 값을 색의 강도로 칠하는 등치 지역도가 알맞아요.'}
  ],
  end:'<b>정리</b> 무엇이 궁금한지에 따라 그래프가 달라져요. 흐름이 궁금하면 <b>시간</b>, 퍼진 모양이 궁금하면 <b>분포</b>, 두 값이 함께 변하는지 궁금하면 <b>관계</b>, 어디에 있는지 궁금하면 <b>공간</b> 시각화예요.'
});

/* 03 같은 데이터, 다른 그래프 (학교 매점 4주 · 지어낸 예시) */
(function(){
  const TEMP=[22,23,25,24,26,24,25,27,28,27,26,28,29,30,29,28,30,31,31,30];
  const NZ=[2,-3,1,0,-2,3,-1,2,-4,1,0,-2,3,1,-1,2,-3,0,4,-2];
  const DRINK=TEMP.map((t,i)=>30+4*(t-22)+NZ[i]);
  const BREAD=[52,47,63,50,41, 55,49,60,48,38, 50,46,64,51,40, 54,48,61,49,39];
  const SNACK=[31,28,35,26,33, 29,30,36,27,32, 30,25,34,28,31, 33,29,37,26,30];
  const W=420, H=220, L=50, R=400, TOP=26, BOT=180;
  const sx=(v,a,b)=>L+(v-a)/(b-a)*(R-L), sy=(v,a,b)=>BOT-(v-a)/(b-a)*(BOT-TOP);
  const grid=(a,b,st)=>{let s=''; for(let v=a;v<=b;v+=st) s+=`<line x1="${L}" x2="${R}" y1="${sy(v,a,b)}" y2="${sy(v,a,b)}" class="gl"/><text x="${L-6}" y="${sy(v,a,b)+4}" class="tk" text-anchor="end">${v}</text>`; return s;};
  const wrap=(inner,yl,xl)=>`<svg viewBox="0 0 ${W} ${H}" class="ig-svg" role="img" aria-label="${yl} 그래프">${inner}<text x="6" y="12" class="axl">${yl}</text><text x="${R}" y="${H-4}" class="axl" text-anchor="end">${xl}</text></svg>`;
  const wkSum=[0,1,2,3].map(w=>DRINK.slice(w*5,w*5+5).reduce((a,b)=>a+b,0));
  const best=wkSum.indexOf(Math.max(...wkSum))+1;
  const V={
    line:()=>wrap(grid(20,70,10)+`<polyline points="${DRINK.map((v,i)=>sx(i,0,19)+','+sy(v,20,70)).join(' ')}" class="vl"/>`+DRINK.map((v,i)=>`<circle cx="${sx(i,0,19)}" cy="${sy(v,20,70)}" r="3" class="vd"/>`).join('')+[0,5,10,15].map((i,w)=>`<text x="${sx(i,0,19)}" y="${BOT+16}" class="tk">${w+1}주</text>`).join(''),'음료 판매량(개)','날짜 순서'),
    bar:()=>wrap(grid(0,350,50)+wkSum.map((v,w)=>{const x=L+w*88+24; return `<rect x="${x}" y="${sy(v,0,350)}" width="44" height="${BOT-sy(v,0,350)}" class="vb"/><text x="${x+22}" y="${sy(v,0,350)-4}" class="tk" text-anchor="middle">${v}</text><text x="${x+22}" y="${BOT+16}" class="tk" text-anchor="middle">${w+1}주</text>`;}).join(''),'주별 음료 판매량 합계(개)','주차'),
    hist:()=>{const ed=[25,35,45,55,65,75], c=ed.slice(0,-1).map((a,i)=>DRINK.filter(v=>v>=a&&(i===4?v<=ed[i+1]:v<ed[i+1])).length);
      return wrap(grid(0,8,2)+c.map((n,i)=>`<rect x="${sx(ed[i],25,75)}" y="${sy(n,0,8)}" width="${sx(ed[i+1],25,75)-sx(ed[i],25,75)}" height="${BOT-sy(n,0,8)}" class="hb2" stroke="#fff"/>`).join('')+ed.map(e=>`<text x="${sx(e,25,75)}" y="${BOT+16}" class="tk" text-anchor="middle">${e}</text>`).join(''),'날수(일)','음료 판매량(개)');},
    box:()=>{const rows=[['빵',BREAD],['음료',DRINK],['과자',SNACK]];
      let s=''; for(let v=0;v<=80;v+=10) s+=`<line x1="${sx(v,0,80)}" x2="${sx(v,0,80)}" y1="${TOP}" y2="${BOT}" class="gl"/><text x="${sx(v,0,80)}" y="${BOT+16}" class="tk" text-anchor="middle">${v}</text>`;
      rows.forEach(([n,a],r)=>{const y=TOP+30+r*50, q1=igQ(a,.25), q2=igQ(a,.5), q3=igQ(a,.75), mn=Math.min(...a), mx=Math.max(...a), X=v=>sx(v,0,80);
        s+=`<text x="${L-6}" y="${y+4}" class="tk" text-anchor="end">${n}</text><line x1="${X(mn)}" x2="${X(mx)}" y1="${y}" y2="${y}" class="vwh"/><rect x="${X(q1)}" y="${y-12}" width="${X(q3)-X(q1)}" height="24" class="vbox"/><line x1="${X(q2)}" x2="${X(q2)}" y1="${y-12}" y2="${y+12}" class="vmed"/>`;});
      return wrap(s,'품목','하루 판매량(개)');},
    scatter:()=>wrap(grid(20,70,10)+DRINK.map((v,i)=>`<circle cx="${sx(TEMP[i],21,32)}" cy="${sy(v,20,70)}" r="4" class="vs"/>`).join('')+[22,24,26,28,30,32].map(t=>`<text x="${sx(t,21,32)}" y="${BOT+16}" class="tk" text-anchor="middle">${t}</text>`).join(''),'음료 판매량(개)','그날 최고 기온(℃)')
  };
  const ITEMS=[
    {ic:'📈',n:'선 그래프',k:'line',kind:'시간 시각화',col:'#2f6fd0',p:'날이 갈수록 음료 판매량이 늘어나는 <b>흐름(추세)</b>이 보여요. 어느 날 갑자기 튀는 값이 있는지도 찾기 쉬워요.'},
    {ic:'📊',n:'막대그래프',k:'bar',kind:'시간 시각화',col:'#2f6fd0',p:`주마다 음료 판매량 합계를 차례로 놓으면 주가 지날수록 늘어나 <b>${best}주</b>에 가장 많이 팔렸다는 것이 한눈에 보여요. 일정한 간격(주)으로 모은 값을 비교하기 좋아요.`},
    {ic:'🧱',n:'히스토그램',k:'hist',kind:'분포 시각화',col:'#1f9d74',p:'날마다 팔린 음료 개수가 <b>어느 구간에 많이 몰려 있는지</b>, 전체가 어떻게 퍼져 있는지 보여요. 막대 사이에 빈칸이 없어요.'},
    {ic:'📦',n:'박스 플롯',k:'box',kind:'분포 시각화',col:'#1f9d74',p:'빵·음료·과자의 하루 판매량을 놓고 <b>가운데 값(중앙값)과 퍼진 정도</b>를 품목끼리 비교할 수 있어요.'},
    {ic:'🔵',n:'산점도',k:'scatter',kind:'관계 시각화',col:'#e0702b',p:'기온이 높은 날일수록 음료가 많이 팔리는 경향이 보여요. <b>두 변수가 함께 변하는지</b> 볼 때 알맞아요.'}
  ];
  tabs('igVizBtn','igVizView',ITEMS,it=>`<div class="ig-vz">${V[it.k]()}<div><span class="k" style="--k:${it.col}">${it.kind}</span><p><b>이 그래프로 보면</b> ${it.p}</p></div></div>`);
})();

/* 04 마무리 */
const MEMOLIST=[['firstThought','처음 생각: 두 표를 합쳐 비교하려면'],['mergeLog','연도로 두 표 합치기 기록'],['mergeMemo','두 표를 합치며 알게 된 것'],['scaleMemo','정규화·표준화 비교와 이상치의 영향'],['shapeVote','표준화하면 분포 모양은? (내 예상)'],['shapeMemo','예상과 결과, 모양이 그대로인 까닭'],['vizMemo','(선택) 매점 데이터로 궁금한 것과 알맞은 그래프'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[4]=()=>{
  const v=String(MEMO.firstThought||'').trim();
  $('igPrev2').innerHTML=v?`<b>시작 화면에 적은 처음 생각</b><span>${esc(v)}</span>`:'';
  $('igPrev2').style.display=v?'':'none';
  /* (선택) 항목은 쓴 것만 모아 보기에 보이기 */
  memoSummary('msum',MEMOLIST.filter(([k,l])=>!l.startsWith('(선택)')||String(MEMO[k]||'').trim()));
};

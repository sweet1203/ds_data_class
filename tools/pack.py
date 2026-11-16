#!/usr/bin/env python3
"""제작 에이전트에게 줄 차시 자료 묶음 만들기.

    python3 tools/pack.py u3-model [u3-regression ...]
    python3 tools/pack.py u3            (단원 전체 차시)

course.json 의 쪽수(pages)로 다음을 모아 작업자료_데이터과학/pack/<차시ID>.md 한 파일로 쓴다.
  1) 교과서 본문 (교과서_N단원_본문.txt, 해당 쪽만)
  2) 지도서 (지도서_N단원_쪽별.txt — 교과서 쪽과 맞는 지도서 쪽 + 그 쪽을 다루는 과정안·활동지·평가 문제 쪽)
  3) 실습 파일 요약 (교과서 소스코드/N단원/**/<쪽>쪽…: csv 열·행 수·앞 줄·숫자 열 범위, .ows 위젯과 연결, .ipynb 코드)
텍스트 파일이 없으면 인수인계.md 의 「뽑는 법」대로 pdftotext 로 먼저 뽑는다.
"""
from __future__ import annotations

import collections
import csv
import json
import pathlib
import re
import sys
import xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parents[1]
WORK = ROOT.parent / '작업자료_데이터과학'
SRC = ROOT.parent / '고등일반_데이터 과학' / '단원별 자료' / '수업자료' / '교과서 소스코드'
rd = lambda p: pathlib.Path(p).read_text(encoding='utf-8', errors='replace').replace('\f', '\n')
ROMAN = 'ⅠⅡⅢⅣ'


def squash(t: str) -> str:
    """지도서 -layout 텍스트: 줄마다 공백 줄이기, 굵은 글씨 때문에 두 번 찍힌 낱말 하나로"""
    out = []
    for ln in t.splitlines():
        ln = re.sub(r'\s+', ' ', ln).strip()
        if not ln:
            continue
        for _ in range(2):
            ln = re.sub(r'(?<!\S)(\S+(?: \S+){0,3}) \1(?!\S)', r'\1', ln)
        out.append(ln)
    return '\n'.join(out)


def page_range(s: str):
    a, _, b = s.partition('~')
    return set(range(int(a), int(b or a) + 1))


def textbook(unit_no: int, pages: set[int]) -> str:
    f = WORK / f'교과서_{unit_no}단원_본문.txt'
    if not f.exists():
        return f'(없음: {f.name})'
    parts = re.split(r'^=== 교과서 (\d+)쪽\n', rd(f), flags=re.M)
    return '\n'.join(f'### 교과서 {parts[i]}쪽\n{parts[i + 1].strip()}' for i in range(1, len(parts), 2)
                     if int(parts[i]) in pages)


def guide(unit_no: int, pages: set[int], lo: int, hi: int) -> str:
    f = WORK / f'지도서_{unit_no}단원_쪽별.txt'
    if not f.exists():
        return f'(없음: {f.name})'
    parts = re.split(r'^=+ 지도서 PDF (\d+)쪽 =+\n', rd(f), flags=re.M)
    G = [(int(parts[i]), parts[i + 1]) for i in range(1, len(parts), 2)]
    # 지도서 쪽 - 교과서 쪽 차이: 가장 많이 맞는 값
    cnt = collections.Counter()
    for g, body in G:
        for n in set(int(x) for x in re.findall(r'(?<!\d)(\d{2,3})(?!\d)', body)):
            if lo <= n <= hi:
                cnt[g - n] += 1
    off = cnt.most_common(1)[0][0] if cnt else 0
    keep = []
    for g, body in G:
        p = g - off
        if p in pages:
            keep.append((g, f'지도서 PDF {g}쪽 (교과서 {p}쪽)', body))
            continue
        if lo <= p <= hi:      # 다른 교과서 쪽에 맞는 지도서 쪽
            continue
        # 단원 앞(내용 정리·과정안)과 뒤(활동지·평가 문제): 이 차시 쪽을 말하는 곳만
        refs = set()
        for a, b in re.findall(r'(\d{2,3})\s*~\s*(\d{2,3})\s*쪽', body):
            refs |= set(range(int(a), int(b) + 1))
        refs |= {int(x) for x in re.findall(r'(?<![\d~])(\d{2,3})\s*쪽', body)}
        if refs & pages:
            keep.append((g, f'지도서 PDF {g}쪽 (단원 앞뒤 자료: 과정안·활동지·평가 문제 등)', body))
    return '\n\n'.join(f'### {h}\n{squash(b)}' for _, h, b in keep) or '(맞는 쪽 없음)'


def csv_summary(f: pathlib.Path) -> str:
    raw = f.read_bytes()
    for enc in ('utf-8-sig', 'cp949', 'latin-1'):
        try:
            txt = raw.decode(enc)
            break
        except UnicodeDecodeError:
            continue
    rows = list(csv.reader(txt.splitlines()))
    if not rows:
        return '(빈 파일)'
    head, body = rows[0], rows[1:]
    out = [f'- 행 {len(body)}개 × 열 {len(head)}개 (인코딩 {enc})', '- 열: ' + ' | '.join(head)]
    for r in body[:3]:
        out.append('- 예: ' + ' | '.join(x[:24] for x in r))
    nums = []
    for j, h in enumerate(head[:40]):
        vals, miss = [], 0
        for r in body:
            v = r[j].strip() if j < len(r) else ''
            if v == '' or v.upper() in ('NA', 'NAN', '?'):
                miss += 1
                continue
            try:
                vals.append(float(v))
            except ValueError:
                vals = None
                break
        if vals:
            nums.append(f'{h}: {min(vals):g}~{max(vals):g}, 평균 {sum(vals) / len(vals):.3g}' + (f', 빈 값 {miss}' if miss else ''))
        elif vals is None:
            cats = collections.Counter(r[j] for r in body if j < len(r))
            if len(cats) <= 12:
                nums.append(f'{h}: 범주 {len(cats)}개 ' + ', '.join(f'{k}({v})' for k, v in cats.most_common(6)))
            else:
                nums.append(f'{h}: 글자 값 {len(cats)}종')
    if nums:
        out.append('- 열 요약: ' + ' · '.join(nums))
    return '\n'.join(out)


def ows_summary(f: pathlib.Path) -> str:
    try:
        t = ET.parse(f).getroot()
    except ET.ParseError as e:
        return f'(읽기 실패 {e})'
    nodes = {n.get('id'): n for n in t.iter('node')}
    out = ['- 위젯: ' + ', '.join(f"{n.get('id')}.{n.get('title')}" for n in nodes.values())]
    links = [f"{nodes[l.get('source_node_id')].get('title')} →({l.get('source_channel')}→{l.get('sink_channel')}) {nodes[l.get('sink_node_id')].get('title')}"
             for l in t.iter('link') if l.get('source_node_id') in nodes and l.get('sink_node_id') in nodes]
    if links:
        out.append('- 연결: ' + ' ; '.join(links))
    return '\n'.join(out)


def ipynb_summary(f: pathlib.Path, limit=60) -> str:
    try:
        nb = json.loads(rd(f))
    except json.JSONDecodeError:
        return '(읽기 실패)'
    lines = []
    for c in nb.get('cells', []):
        src = ''.join(c.get('source', []))
        if c.get('cell_type') == 'code':
            lines += src.splitlines() + ['# ---']
        elif src.strip():
            lines.append('# [설명] ' + src.strip().splitlines()[0][:80])
    more = f'\n… (이하 {len(lines) - limit}줄 생략)' if len(lines) > limit else ''
    return '```python\n' + '\n'.join(lines[:limit]) + more + '\n```'


def files(unit_no: int, pages: set[int]) -> str:
    base = SRC / f'{unit_no}단원'
    if not base.exists():
        return '(소스코드 폴더 없음)'
    out = []
    for d in sorted(p for p in base.rglob('*') if p.is_dir()):
        m = re.match(r'(\d+)(?:_(\d+))?쪽', d.name)
        if not m:
            continue
        a, b = int(m.group(1)), int(m.group(2) or m.group(1))
        if not set(range(a, b + 1)) & pages:
            continue
        for f in sorted(d.iterdir()):
            if f.name.startswith('.') or f.is_dir():
                continue
            rel = f.relative_to(SRC)
            ext = f.suffix.lower()
            if ext == '.csv':
                body = csv_summary(f)
            elif ext == '.ows':
                body = ows_summary(f)
            elif ext == '.ipynb':
                body = ipynb_summary(f)
            elif ext == '.url':
                body = '- 링크: ' + ' '.join(re.findall(r'URL=(\S+)', rd(f)))
            else:
                body = f'- ({ext} 파일, {f.stat().st_size // 1024}KB)'
            out.append(f'#### {rel}\n{body}')
    return '\n\n'.join(out) or '(이 쪽수의 실습 파일 없음)'


def main(argv):
    c = json.loads(rd(ROOT / 'course.json'))
    targets = []
    for ui, u in enumerate(c['units']):
        for l in u['lessons']:
            if l['id'] in argv or u['id'] in argv:
                targets.append((ROMAN.index(u['name'][0]) + 1, u, l))
    if not targets:
        sys.exit('차시 ID나 단원 ID(u3 등)를 주세요')
    (WORK / 'pack').mkdir(exist_ok=True)
    for unit_no, u, l in targets:
        pages = page_range(l['pages'])
        allp = set().union(*(page_range(x['pages']) for x in u['lessons']))
        md = (f"# {l['id']} · {l['title']} (교과서 {l['pages']}쪽, {u['name']})\n\n"
              f"## 1. 교과서\n{textbook(unit_no, pages)}\n\n"
              f"## 2. 지도서\n{guide(unit_no, pages, min(allp), max(allp))}\n\n"
              f"## 3. 실습 파일 (교과서 소스코드)\n{files(unit_no, pages)}\n")
        o = WORK / 'pack' / f"{l['id']}.md"
        o.write_text(md, encoding='utf-8')
        print(f"{o.relative_to(ROOT.parent)}  {len(md):,}자")


if __name__ == '__main__':
    main(sys.argv[1:])

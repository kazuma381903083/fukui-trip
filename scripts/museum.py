"""Source-linked field notes for the trip's small, offline-readable museum."""
from pathlib import Path
import html, json
from visual import icon

ROOT = Path(__file__).resolve().parent.parent

def esc(value):
    return html.escape(str(value), quote=True)

def source_link(exhibit, index):
    source = exhibit['sources'][index]
    return f'<a class="museum-citation" href="{esc(source["url"])}" target="_blank" rel="noopener noreferrer" aria-label="出典：{esc(source["title"])}">[{index+1}]</a>'

def make_exhibit(exhibit, number):
    e = exhibit
    title = esc(e['title']).replace('\n', '<br>')
    if e.get('photo'):
        visual = f'<img src="assets/{esc(e["photo"])}" alt="{esc(e["photoAlt"])}" width="1200" height="800" loading="lazy">'
    elif e['id'] == 'weaving':
        # A diagram of plain weave, not a representation of a particular finished product.
        cells = ''.join(f'<i class="{"warp-over" if (row+col)%2==0 else "weft-over"}"></i>' for row in range(8) for col in range(8))
        visual = f'<div class="weave-diagram" role="img" aria-label="平織りの模式図。たて糸とよこ糸を一本ずつ交互に上下へ通します"><span class="warp-label">たて糸 ↓</span><div class="weave-grid" aria-hidden="true">{cells}</div><span class="weft-label">よこ糸 →</span></div>'
    else:
        visual = f'<div class="museum-type-art" aria-hidden="true">{icon(e["icon"])}<span>{esc(e["artWord"])}</span><small>{esc(e["artEnglish"])}</small></div>'
    facts = ''.join(f'<div class="museum-fact"><span>{i+1:02}</span><div><h4>{esc(fact["title"])}</h4><p>{esc(fact["text"])} {" ".join(source_link(e,j) for j in fact["sources"])}</p></div></div>' for i,fact in enumerate(e['facts']))
    prompts = ''.join(f'<li>{esc(prompt)}</li>' for prompt in e['prompts'])
    q = e['quiz']
    choices = ''.join(f'<span><b>{chr(65+i)}</b>{esc(choice)}</span>' for i,choice in enumerate(q['choices']))
    sources = ''.join(f'<li><a href="{esc(s["url"])}" target="_blank" rel="noopener noreferrer">{esc(s["title"])} ↗</a></li>' for s in e['sources'])
    links = ''.join(f'<a href="./#place-{esc(p["id"])}">{esc(p["label"])} {icon("arrow-up-right")}</a>' for p in e['places'])
    care = f'<p class="museum-care">{icon("backpack")}<span>{esc(e["care"])} {' '.join(source_link(e,j) for j in e.get('careSources',[]))}</span></p>' if e.get('care') else ''
    return f'''<article class="museum-exhibit exhibit-{esc(e['id'])}" id="exhibit-{esc(e['id'])}" data-museum-days="{' '.join(str(day) for day in e['days'])}" style="--exhibit-color:{esc(e['color'])}">
<div class="exhibit-visual {'has-photo' if e.get('photo') else 'has-diagram'}">{visual}<span class="exhibit-ticket"><small>ROOM</small><b>{number:02}</b></span><span class="exhibit-day">{esc(e['dayLabel'])}</span></div>
<div class="exhibit-body"><p class="eyebrow">{esc(e['kicker'])}</p><h3>{title}</h3><p class="exhibit-intro">{esc(e['intro'])}</p><div class="exhibit-peek"><span>{esc(e['feature']['value'])}</span><p>{esc(e['feature']['label'])} {source_link(e,e['feature']['source'])}</p></div>
<details class="exhibit-reading"><summary><span>見どころと、当日の楽しみ方</span><b>＋</b></summary><div class="exhibit-reading-body">{facts}<div class="field-mission"><p class="eyebrow">TRY THIS TOGETHER</p><h4>{icon('camera')}ふたりの観察メモ</h4><ul>{prompts}</ul></div>{care}</div></details>
<details class="museum-quiz"><summary><span class="quiz-letter">Q</span><span><small>ふたりで予想して、めくってみよう</small><strong>{esc(q['question'])}</strong><span class="quiz-choices">{choices}</span><span class="quiz-invitation">答えをひらく <b>↗</b></span></span></summary><div class="quiz-answer"><span class="eyebrow">THE LITTLE REVEAL</span><h4>{chr(65+q['answer'])} · {esc(q['choices'][q['answer']])}</h4><p>{esc(q['explanation'])} {' '.join(source_link(e,j) for j in q['sources'])}</p></div></details>
<div class="exhibit-links">{links}</div><details class="museum-sources"><summary>この展示の出典・公式案内</summary><ol>{sources}</ol></details></div></article>'''

def build_museum():
    data = json.loads((ROOT/'data/museum-content.json').read_text())
    cards = ''.join(make_exhibit(e,i+1) for i,e in enumerate(data['exhibits']))
    count = sum(len(e['facts']) for e in data['exhibits'])
    page = f'''<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#234d43"><meta name="description" content="恐竜、手織り、温泉、日本海、永平寺、一乗谷、福井の味。知るほど旅が楽しくなる、ふたりの小さな資料館。"><title>ふくいの小さな資料館。｜ふくいのしおり</title><link rel="icon" href="assets/icon-192.png"><link rel="apple-touch-icon" href="assets/icon-192.png"><link rel="manifest" href="manifest.webmanifest"><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="visual.css"><link rel="stylesheet" href="museum.css"><link rel="preload" as="image" href="assets/museum-cabinet.webp"><script src="museum.js" defer></script></head>
<body class="museum-page"><a class="skip-link" href="#exhibits">展示室へスキップ</a><header class="museum-header"><a class="brand" href="./"><span class="brand-mark">福</span><span>ふくいのしおり<small>THE LITTLE TRAVEL MUSEUM</small></span></a><a class="museum-back" href="./#reference">しおりに戻る ↗</a></header>
<main><section class="museum-intro" aria-labelledby="museum-title"><div class="museum-intro-copy"><p class="eyebrow">A CABINET OF CURIOSITIES</p><h1 id="museum-title">ふくいの<br>小さな資料館。</h1><p>見上げる。耳を澄ます。味わう。<br>知るほど、旅の景色がおもしろくなる。</p><a class="museum-enter" href="#exhibits">どの展示から、のぞこう？ <span>↓</span></a></div><figure class="museum-cabinet"><img src="assets/museum-cabinet.webp" alt="恐竜、糸、岩の柱、杉、歴史の門、そばと酒器を並べた旅の飾り棚のイラスト" width="1400" height="700" fetchpriority="high"><figcaption>旅で出会うものを、小さな飾り棚に。</figcaption></figure><div class="museum-catalogue-mark" aria-hidden="true"><span>FUKUI</span><strong>08</strong><span>ROOMS</span></div></section>
<div class="museum-facts-ribbon"><span>{icon('landmark')}8つの展示室</span><span>{icon('sun')}{count}の小さな発見</span><span>{icon('ticket')}8つのめくるクイズ</span></div>
<section class="museum-collection" id="exhibits" aria-labelledby="collection-title"><div class="museum-collection-heading"><div><p class="eyebrow">LOOK A LITTLE CLOSER</p><h2 id="collection-title">旅先の「へえ！」を。</h2></div><button type="button" class="museum-surprise" id="museum-surprise" hidden>{icon('sun')}一枚、おまかせでひらく ↗</button></div><div class="museum-toolbar" hidden><div class="museum-filters" role="group" aria-label="資料館を訪問日で絞り込む"><button type="button" data-museum-filter="all" aria-pressed="true">全部の展示</button><button type="button" data-museum-filter="1" aria-pressed="false">Day 1</button><button type="button" data-museum-filter="2" aria-pressed="false">Day 2</button><button type="button" data-museum-filter="3" aria-pressed="false">Day 3</button></div><span id="museum-count" role="status">8つの展示</span></div><div class="museum-grid">{cards}</div><p class="museum-reading-note">観察メモは、ふたりで楽しむための小さな提案。施設の案内に合わせて、できそうなものをひとつ。</p></section>
<section class="museum-closing"><img src="assets/dinosaur-traveler.webp" alt="" width="470" height="500" loading="lazy"><div><p class="eyebrow">THE BEST DISCOVERY IS YOURS</p><h2>続きは、旅先で。</h2><p>今日いちばんの「へえ！」を、<br>ふたりのメモに残しておこう。</p><a href="./#trip-memo">旅のメモをひらく ↗</a></div></section>
<footer class="museum-footer"><p>公式情報の確認：{esc(data['checkedAt'])}。展示や提供内容は変わる場合があります。<br>予約・時刻・移動の確認は、<a href="./#reference">しおりの実用資料</a>へ。</p><p id="museum-offline-status" role="status">オフライン保存の状態を確認しています。</p><div><a href="credits.html">写真・イラストの出典</a><a href="#museum-title">資料館の入口へ ↑</a><button type="button" id="museum-print" hidden>展示を印刷 ↗</button></div></footer></main><noscript><p class="museum-noscript">すべての展示・見どころ・クイズの答えを、そのまま開いて読めます。</p></noscript></body></html>'''
    (ROOT/'museum.html').write_text(page)
    return f'''<a class="museum-invitation" href="museum.html"><div class="museum-invitation-copy"><p class="eyebrow">THE LITTLE TRAVEL MUSEUM</p><h3>知るほど、<br>旅はおもしろい。</h3><p>恐竜の歯。織物の糸。海辺の岩。<br>見どころとクイズを、8つの展示室に。</p><span>資料館に入る {icon('arrow-up-right')}</span></div><img src="assets/museum-cabinet.webp" alt="旅のモチーフを並べた、小さな飾り棚のイラスト" width="1400" height="700" loading="lazy"><span class="museum-invitation-seal" aria-hidden="true">OPEN<br><b>08</b><small>ROOMS</small></span></a>'''

"""Generate the static travel guide from the original, unmodified itinerary."""
from pathlib import Path
import re, json, html, hashlib
import markdown
from enrich import make_map, make_summary, make_stamps

ROOT = Path(__file__).resolve().parent.parent
source = (ROOT / 'shiorimemo.md').read_text()

def section(n):
    return re.search(r'\*\*' + str(n) + r'．.*?(?=\n\*\*\d+．|\Z)', source, re.S).group()

def table(text):
    lines = re.search(r'(?:^\|.*\|\s*\n)+', text, re.M).group().strip().splitlines()
    return [[cell.strip() for cell in line.strip('|').split('|')] for line in lines[2:]]

def md(text):
    output = markdown.markdown(text.strip(), extensions=['tables'])
    return re.sub(r'<a href="(https?://[^"]+)"', r'<a target="_blank" rel="noopener noreferrer" href="\1"', output)

def esc(value): return html.escape(str(value), quote=True)
def map_url(query, directions=False):
    from urllib.parse import quote
    return ('https://www.google.com/maps/dir/?api=1&destination=' if directions else 'https://www.google.com/maps/search/?api=1&query=') + quote(query)

days = [
 dict(n=1,date='2026-09-21',short='9.21',weekday='MON',jp='月',title='太古に出会い、糸を織り、<br>湯にほどける。',lead='恐竜の世界を歩き、自分の手で布を織る。<br>一日の終わりは、あわらの湯と会席に。',area='福井駅 → 勝山 → あわら温泉',stay='越前あわら温泉 長谷川',focus='15:00 手織り体験 ／ 17:30 旅館到着予定',note='恐竜博物館は連休の交通規制に注意。臨時駐車場の場合は13:00頃を目安に見学を終え、帰りのシャトルへ。',image='eiheiji.webp'),
 dict(n=2,date='2026-09-22',short='9.22',weekday='TUE',jp='火',title='海から、<br>酒と祈りの里へ。',lead='日本海の青と、三国の旬の魚。<br>川辺の酒文化から、静かな永平寺へ。',area='あわら → 三国 → 永平寺町 → 福井市',stay='ホテルフジタ福井',focus='14:00 ESHIKOTO出発目安 ／ 20:45 煙や',note='昼食や移動が遅れたら、ESHIKOTOのカフェを省略。ホテル到着後の休憩を大切に。運転する人は試飲をしません。',image='tojinbo.webp'),
 dict(n=3,date='2026-09-23',short='9.23',weekday='WED',jp='水',title='城下町の記憶と、<br>帰り際の一杯。',lead='一乗谷の暮らしに、ゆっくり思いを巡らす。<br>車を返したら、福井の酒でもう一度乾杯。',area='福井市 → 一乗谷 → 福井駅 → 東京',stay='18:18 福井発 → 21:20 東京着',focus='15:00 一乗谷出発 ／ 返却目標16:00〜16:30',note='一乗谷ガイドは予約調整中。手配できなければ同じ時間帯に自主見学。帰路が混んだら駅の角打ちを省略します。',image=None),
]
# The names below locate the original paragraphs. Their content is not rewritten by the generator.
place_defs = [
 ('car',1,'レンタカー受取','トヨタレンタカー 福井駅東口店','交通','福井県福井市日之出2-2-18','0776-24-0100','予約済み','09:30受取 / 返却予約17:00','受取時にETC・給油条件・操作方法を確認。'),
 ('dinosaur',1,'福井県立恐竜博物館','福井県立恐竜博物館','太古','福井県勝山市村岡町寺尾51-11','0779-88-0001','予約・支払済み','11:00 入館枠','特別展と常設展。駐車場所に合わせて退出を前倒し。'),
 ('weaving',1,'はたや記念館 ゆめおーれ勝山','ゆめおーれ勝山','体験','福井県勝山市昭和町1-7-40','0779-87-1200','予約済み','15:00–16:00','一本ずつ糸を重ねて、自分だけの旅の記念を。'),
 ('hasegawa',1,'越前あわら温泉 長谷川','越前あわら温泉 長谷川','温泉','福井県あわら市二面48-14','0776-77-2164','予約・支払済み','17:30 到着予定','結会席と温泉。夕食19:00開始は希望・未確定。'),
 ('tojinbo',2,'東尋坊','東尋坊','海','福井県坂井市三国町安島 東尋坊','','訪問予定','09:30–10:30','日本海に立ち上がる岩の柱。海岸を歩き、景色を楽しむ。'),
 ('lunch',2,'昼食：みくに隠居処','みくに隠居処','食','福井県坂井市三国町宿3-7-22','0776-82-8558','未予約','11:00–12:15 希望','秋の甘えび旬彩御膳が第一候補。席と提供可否を確認。'),
 ('eshikoto',2,'ESHIKOTO','ESHIKOTO','酒文化','福井県吉田郡永平寺町下浄法寺12-17','0776-63-1030','訪問予定','13:15–14:00','九頭竜川を眺めて、酒の買い物。空いていればacoyaへ。'),
 ('eiheiji',2,'大本山永平寺','大本山永平寺','祈り','福井県吉田郡永平寺町志比5-15','0776-63-3102','当日参拝予定','14:30–16:00','杉木立と回廊に包まれる、静かな90分。'),
 ('fujita',2,'ホテルフジタ福井','ホテルフジタ福井','宿','福井県福井市大手3-12-20','0776-27-8811','予約・支払済み','17:00頃 到着予定','素泊まり。大手駐車場に車を置き、夜は徒歩で。'),
 ('kemuriya',2,'夕食：旬香逎燈 煙や','旬香逎燈 煙や','食と酒','福井県福井市大手2-7-23','050-5486-7791','席予約済み','20:45 夕食','郷土の味と福井酒。焼き物、発酵食品、地元野菜を少しずつ。'),
 ('museum',3,'福井県立一乗谷朝倉氏遺跡博物館','一乗谷朝倉氏遺跡博物館','歴史','福井県福井市安波賀中島町8-10','0776-41-7700','当日購入予定','09:45–11:45','模型と出土品から、戦国の城下町を知る。約2時間を確保。'),
 ('soba',3,'昼食：道の駅 一乗谷あさくら水の駅','一乗谷あさくら水の駅','そば','福井県福井市安波賀中島町1-1-1','0776-41-2777','未予約','11:45–12:45 移動込み','越前おろしそばで昼休み。ガイドの集合時刻を優先。'),
 ('ruins',3,'一乗谷朝倉氏遺跡・復原町並','一乗谷朝倉氏遺跡・復原町並','歴史','福井県福井市城戸ノ内町 一乗谷朝倉氏遺跡','0776-41-2330','予約調整中','13:00–14:30 希望','博物館で知った町を、今度は自分の足で歩く。'),
 ('fuel',3,'給油とレンタカー返却','給油とレンタカー返却','交通','福井県福井市御幸3-3-23','0776-24-7441','返却予約済み','16:00–16:30 返却目標','給油候補はENEOSセルフサン勝見店。返却予約は17:00。'),
 ('mizumoto',3,'福井駅：おさけとワイン みずもと','おさけとワイン みずもと','酒','福井県福井市中央1-1-25 みずもと','0776-29-7239','当日利用','16:45–17:15','車の返却完了後に角打ち。混んでいたら土産を優先。'),
]
blocks = {}
for day in days:
    s = section(day['n']+2)
    headings = list(re.finditer(r'^\*\*([^\n]+)\*\*\s*$', s, re.M))
    for i,m in enumerate(headings):
        name=m.group(1)
        if name in [p[2] for p in place_defs]:
            end = headings[i+1].start() if i+1 < len(headings) else len(s)
            # Some emphasis-only paragraphs are content rather than subsection headings.
            if name == '一乗谷朝倉氏遺跡・復原町並':
                end=s.index('**給油とレンタカー返却**')
            blocks[name]=s[m.end():end].strip().rstrip('-').strip()
    day['rows'] = table(s)

places=[]
for id, day, heading, name, kind, address, phone, status, time, intro in place_defs:
    places.append(dict(id=id,day=day,name=name,kind=kind,address=address,phone=phone,status=status,time=time,intro=intro,detail=md(blocks[heading]),map=map_url(address),directions=map_url(address,True)))

# Resolve itinerary entries to place details with explicit matches (no external geocoding).
matchers=[('レンタカー受付','car'),('恐竜博物館','dinosaur'),('ゆめおーれ','weaving'),('手織り','weaving'),('長谷川','hasegawa'),('旅館の','hasegawa'),('東尋坊','tojinbo'),('みくに','lunch'),('ESHIKOTO','eshikoto'),('永平寺','eiheiji'),('フジタ','fujita'),('煙や','kemuriya'),('一乗谷朝倉氏遺跡博物館','museum'),('ガイド','ruins'),('遺跡を','ruins'),('給油','fuel'),('レンタカー返却','car'),('みずもと','mizumoto')]
for day in days:
    day['events']=[]
    for time,title,note in day['rows']:
        pid=next((p for q,p in matchers if q in title),None)
        tm=re.search(r'\d{2}:\d{2}',time)
        fixed=(day['n']==1 and title in ['東京駅発','手織り体験','恐竜博物館']) or (day['n']==2 and title=='煙やで夕食') or (day['n']==3 and title=='福井駅発')
        day['events'].append(dict(time=time,title=title,note=note,place=pid,at=day['date']+'T'+tm.group()+':00+09:00' if tm else None,fixed=fixed))


def badge(status):
    uncertain = status in ['未予約','予約調整中']
    return f'<span class="badge {"pending" if uncertain else ""}">{esc(status)}</span>'

def place_links(p):
    return f'<a href="{p["directions"]}" target="_blank" rel="noopener noreferrer">経路を開く ↗</a>' + (f'<a href="tel:{p["phone"]}">電話する ↗</a>' if p['phone'] else '')

journey=''
for d in days:
    events=''
    for e in d['events']:
        title=f'<a href="#place-{e["place"]}" class="place-jump">{esc(e["title"])} <span aria-hidden="true">↗</span></a>' if e['place'] else esc(e['title'])
        fixed='<span class="fixed-label">固定</span>' if e['fixed'] else ''
        events+=f'<li class="event {"is-fixed" if e["fixed"] else ""}"><div class="event-time">{esc(e["time"])}{fixed}</div><div class="event-copy"><h4>{title}</h4><p>{esc(e["note"])}</p></div></li>'
    journey+=f'''<article class="day-panel" id="day-{d['n']}" aria-labelledby="day-tab-{d['n']}">
      <div class="day-intro"><div class="day-number">0{d['n']}<span>CHAPTER</span></div><p class="eyebrow">{d['short']} {d['weekday']} · {d['area']}</p><h3>{d['title']}</h3><p class="day-lead">{d['lead']}</p><div class="day-priority"><span>この日の大切な時刻</span><strong>{d['focus']}</strong></div><p class="day-note">{d['note']}</p><div class="stay"><span>{'TONIGHT' if d['n']<3 else 'HOMEWARD'}</span><p>{d['stay']}</p></div></div>
      <ol class="timeline">{events}</ol></article>'''

place_cards=''
for p in places:
    place_cards+=f'''<article class="place-card" id="place-{p['id']}" data-place-day="{p['day']}"><div class="place-meta"><span>DAY 0{p['day']} / {p['kind']}</span>{badge(p['status'])}</div><h3>{p['name']}</h3><p class="place-time">{p['time']}</p><p>{p['intro']}</p><details><summary>住所・駐車場・くわしい案内 <span>＋</span></summary><div class="place-detail">{p['detail']}</div></details><div class="place-links">{place_links(p)}</div></article>'''

routes=''
for d in days:
    stops=''.join(f'<a href="#place-{p["id"]}" class="route-stop place-jump"><span>{i+1:02}</span>{p["name"]}<b aria-hidden="true">↗</b></a>' for i,p in enumerate([p for p in places if p['day']==d['n']]))
    routes+=f'<div class="route-group" data-route-day="{d["n"]}"><p class="eyebrow">DAY 0{d["n"]} · {d["short"]}</p>{stops}</div>'

prep_rows=table(section(8))
prep=''.join(f'<label class="check-row"><input type="checkbox" data-check="task-{i}"><span><span class="task-priority">{esc(r[0])}</span><strong>{esc(r[1])}</strong><small>{esc(r[2])}</small></span></label>' for i,r in enumerate(prep_rows) if r[1]!='予約情報の転記')
packing_items=re.findall(r'^- (.+)$',section(9),re.M)
packing=''.join(f'<label class="check-row"><input type="checkbox" data-check="pack-{i}"><span>{md(t)}</span></label>' for i,t in enumerate(packing_items))
budget_rows=table(section(7))
budget=''.join('<tr>'+''.join(f'<td>{md(v)}</td>' for v in r)+'</tr>' for r in budget_rows)
reservations=''.join('<tr>'+''.join(f'<td>{md(v)}</td>' for v in r)+'</tr>' for r in table(section(2)))
rain=''.join(f'<div class="rain-row"><h4>{esc(a)}</h4><p>{esc(b)}</p></div>' for a,b in table(section(6)))

map_html,map_data=make_map()
summary_html=make_summary(days)
stamps_html=make_stamps()

page='''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#173f40"><meta name="description" content="2026年9月21日〜23日。恐竜、温泉、日本海、永平寺、一乗谷。ふたりで巡る福井、三日間のデジタルしおり。">
<meta name="robots" content="noindex,nofollow"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="ふくいのしおり">
<title>ふくい、余白の三日間。｜2026.9.21–23</title>
<link rel="icon" href="assets/icon-192.png" type="image/png"><link rel="apple-touch-icon" href="assets/icon-192.png"><link rel="manifest" href="manifest.webmanifest">
<link rel="preload" as="image" href="assets/tojinbo.webp" fetchpriority="high"><link rel="stylesheet" href="style.css">
<script src="trip-data.js" defer></script><script src="app.js" defer></script><script src="journey-extras.js" defer></script>
</head>
<body>
<a class="skip-link" href="#journey">旅程へスキップ</a>
<header class="site-header"><a class="brand" href="#top" aria-label="ふくいのしおり 表紙へ"><span class="brand-mark">福</span><span>ふくいのしおり<small>FUKUI TRAVEL JOURNAL</small></span></a><nav aria-label="メインナビ"><a href="#journey">三日間の旅程</a><a href="#timetable">全日程早見表</a><a href="#route">旅の地図</a><a href="#preparation">旅の準備</a></nav><span class="header-date">2026.09.21 — 23</span></header>
<main id="top">
<section class="cover" aria-label="旅の表紙"><img class="cover-photo" src="assets/tojinbo.webp" alt="青い日本海に面する東尋坊の柱状節理の断崖" width="1800" height="1200" fetchpriority="high"><div class="cover-shade"></div><div class="cover-content"><p class="eyebrow">A LITTLE JOURNEY, JUST THE TWO OF US.</p><h1>ふくい、<br>余白の<span>三日間。</span></h1><p class="cover-copy">海の青。森の静けさ。湯上がりの一杯。<br>好きなものを、ふたりのペースで。</p><a class="cover-cta" href="#journey">三日間をひらく <span>↗</span></a></div><div class="cover-bottom"><span>2026 <strong>09.21 — 09.23</strong></span><span>TOKYO → FUKUI<br>2 NIGHTS / 3 DAYS</span><span class="photo-place">東尋坊 · 日本海</span></div><span class="cover-side" aria-hidden="true">SEA, CRAFT & A LITTLE SAKE.</span></section>
<div class="trip-ribbon"><span>ふたり旅</span><span>北陸新幹線 ＋ レンタカー</span><span>勝山・あわら・三国・永平寺・一乗谷</span><a href="#route">旅の道すじを見る ↗</a></div>
<section class="now-section section-wrap" id="now" aria-labelledby="now-heading"><div class="now-label"><span class="status-dot"></span><span id="journey-state">BEFORE THE JOURNEY</span><h2 id="now-heading">旅のはじまりまで</h2></div><div class="now-main" aria-live="polite"><p id="now-kicker">9月21日（月） 東京駅から出発</p><h3 id="now-title">06:16 東京発 → 09:12 福井着</h3><p id="now-note">かがやき501号。東京駅には05:45頃に到着を。</p></div><a class="round-link" href="#journey" id="now-link">旅程へ <span>↗</span></a></section>
{{SUMMARY}}
<section class="section-wrap journey-section" id="journey"><div class="section-heading"><div><p class="eyebrow">01 / THE THREE-DAY STORY</p><h2>三日間、それぞれの楽しみ。</h2></div><p>予定をたどりながら、<br>寄り道できる余白も少し。</p></div><div class="day-tabs" aria-label="日程を選ぶ">{{DAY_TABS}}</div><p class="time-caption">移動・到着時刻は、混雑や徒歩の余裕を含む計画上の目安です。</p><div id="day-panels">{{JOURNEY}}</div></section>
<section class="forest-interlude"><img src="assets/eiheiji.webp" alt="緑の杉木立に囲まれた永平寺の建物" loading="lazy" width="1600" height="1067"><div><p class="eyebrow">A MOMENT OF STILLNESS</p><h2>急がない時間も、<br>旅の目的に。</h2><p>永平寺の回廊で、深呼吸。<br>Day 2 · 14:30–16:00</p><a href="#place-eiheiji" class="place-jump">永平寺の案内へ ↗</a></div></section>
<section class="section-wrap" id="route"><div class="section-heading"><div><p class="eyebrow">02 / FOLLOW THE THREAD</p><h2>海へ、里へ。旅の道すじ。</h2></div><p>福井県の地図に、三色の旅の軌跡。<br>日付や地点を選んで、道すじをたどろう。</p></div>{{MAP}}<details class="route-directory"><summary>日ごとの訪問先一覧を開く <span>＋</span></summary><div class="routes">{{ROUTES}}</div></details></section>
<section class="places-section" id="places"><div class="section-wrap"><div class="section-heading"><div><p class="eyebrow">03 / PLACES TO REMEMBER</p><h2>ここで過ごす、ひととき。</h2></div><div class="place-filters" aria-label="訪問日で絞り込む"><button type="button" data-filter="all" aria-pressed="true">すべて</button><button type="button" data-filter="1" aria-pressed="false">Day 1</button><button type="button" data-filter="2" aria-pressed="false">Day 2</button><button type="button" data-filter="3" aria-pressed="false">Day 3</button></div></div><div class="place-grid">{{PLACES}}</div></div></section>
<section class="section-wrap food-section" id="food"><div class="section-heading"><div><p class="eyebrow">04 / TASTE OF FUKUI</p><h2>おいしい記憶を、少しずつ。</h2></div><p>海鮮、会席、郷土の味。<br>その日の一杯を、ふたりで。</p></div><div class="food-grid"><a class="food-note" href="#place-hasegawa"><span class="food-index">一</span><p class="eyebrow">DAY 1 / あわら温泉</p><h3>湯上がりに、<br>結会席。</h3><p>福井の食材と焼きしゃぶ。<br>料理に合う地酒は、宿で相談。</p><span class="food-link">長谷川の案内 ↗</span></a><a class="food-note" href="#place-lunch"><span class="food-index">二</span><p class="eyebrow">DAY 2 / 三国と福井</p><h3>旬の甘えび。<br>夜は、福井酒。</h3><p>昼は三国港甘えび旬彩御膳が候補。<br>20:45から煙やで郷土の味を。</p><span class="food-link">三国の昼食候補 ↗</span></a><a class="food-note" href="#place-mizumoto"><span class="food-index">三</span><p class="eyebrow">DAY 3 / 一乗谷と駅</p><h3>おろしそばと、<br>旅を結ぶ一杯。</h3><p>昼はそばを軽やかに。車を返したら、<br>みずもとで気になる銘柄を。</p><span class="food-link">角打ちの案内 ↗</span></a></div><p class="sake-note">二人でお酒を楽しむのは、初日の旅館・Day 2の駐車後・最終日の車の返却完了後に。ESHIKOTOでは運転する人は試飲をしません。</p></section>
{{STAMPS}}
<section class="prep-section" id="preparation"><div class="section-wrap"><div class="section-heading"><div><p class="eyebrow">05 / BEFORE WE GO</p><h2>出発前に、ひとつずつ。</h2></div><span id="check-progress" class="check-progress">準備チェック</span></div><p class="storage-hint">チェックとメモはこの端末に保存されます。二人の端末間では共有されません。</p><p class="storage-warning" id="storage-warning" hidden>このブラウザでは保存できません。入力はページを閉じると失われます。</p><div class="prep-grid"><div class="prep-tasks"><h3>手配・確認すること</h3><p class="task-note">一乗谷ガイドは通常申込期限後。手配可否を早めに確認。</p>{{PREP}}</div><div class="packing"><h3>旅のかばん</h3>{{PACKING}}<label class="memo-label" for="trip-memo">ふたり旅のメモ</label><textarea id="trip-memo" rows="5" placeholder="気になった日本酒、買いたいお土産、忘れたくないこと。"></textarea><p class="memo-status" id="memo-status" role="status">この端末だけに保存</p><button class="text-button" id="export-memo" type="button">メモとチェックを保存用ファイルに書き出す ↓</button></div></div></div></section>
<section class="section-wrap archive-section" id="reference"><div class="section-heading"><div><p class="eyebrow">06 / IN YOUR POCKET</p><h2>旅先で、確かめたいこと。</h2></div><button class="outline-button" type="button" id="print-guide">しおりを印刷 ↗</button></div><details class="archive"><summary><span>01</span> 交通・宿泊・予約一覧 <b>＋</b></summary><div class="archive-body"><p>金額は2名分。予約済み固定費186,951円、支払済み確認分159,132円。手織り体験と煙やは固定費に含みません。</p><div class="table-scroll" tabindex="0" role="region" aria-label="予約一覧"><table><thead><tr><th>内容</th><th>予約内容</th><th>金額</th><th>状況</th></tr></thead><tbody>{{RESERVATIONS}}</tbody></table></div><p>新幹線は往復とも普通車指定席・2名並び席。号車・座席・乗車方法・予約番号・キャンセル条件は、手元の予約確認画面で確認してください。チケットQRコードはこの公開ページには保存しません。</p></div></details><details class="archive"><summary><span>02</span> ふたり分の予算 <b>＋</b></summary><div class="archive-body"><div class="budget-head"><span>土産を除く中央見積もり / 2名</span><strong>¥249,691</strong><p>土産込みで約26万〜27万円。余裕を持つなら27万〜28万円程度。</p></div><div class="table-scroll" tabindex="0" role="region" aria-label="予算明細"><table><thead><tr><th>項目</th><th>金額</th><th>備考</th></tr></thead><tbody>{{BUDGET}}</tbody></table></div><p>保存協会の4,000円ガイドの場合は1,500円追加。カフェやガイドを利用しなければ該当分を差し引きます。持ち帰る日本酒は土産代です。</p></div></details><details class="archive"><summary><span>03</span> 雨・渋滞・疲れたとき <b>＋</b></summary><div class="archive-body rain-grid">{{RAIN}}</div></details><details class="archive"><summary><span>04</span> オフラインとホーム画面への追加 <b>＋</b></summary><div class="archive-body"><p id="offline-status" role="status">オフライン保存の状態を確認しています。</p><p>一度オンラインでしおりの保存が完了すると、旅程・住所・電話番号・主要な写真をオフラインでも読めます。このしおり内の地図とタイムテーブルもオフラインで見られます。Google マップの経路検索・施設の公式サイトには通信が必要です。</p><p>iPhoneはSafariの共有メニューから「ホーム画面に追加」。Androidはブラウザのメニューから「ホーム画面に追加」または「アプリをインストール」を選びます。</p><button id="install-app" class="outline-button" type="button" hidden>ホーム画面に追加する ↗</button><p>予約画面やチケット、必要な地図は別途保存してください。保存データはブラウザの設定や空き容量により消える場合があります。</p></div></details></section>
<footer class="site-footer"><div><a class="footer-title" href="#top">ふくい、余白の三日間。</a><p>2026.09.21 — 09.23 · FOR THE TWO OF US.</p></div><div><p>旅程・営業情報の原稿確認基準日：2026.09.10<br>臨時営業・天候・交通状況は出発前に公式案内で確認。</p><a href="credits.html">写真・地図の出典</a><span class="footer-divider"> / </span><a href="#top">表紙へ戻る ↑</a></div></footer>
</main>
<nav class="mobile-nav" aria-label="スマートフォン用ナビゲーション"><a href="#now"><span aria-hidden="true">◷</span>今日</a><a href="#journey"><span aria-hidden="true">☷</span>旅程</a><a href="#route"><span aria-hidden="true">⌁</span>地図</a><a href="#preparation"><span aria-hidden="true">✓</span>準備</a></nav>
<noscript><div class="noscript">JavaScriptが無効です。全日程はそのまま読めます。日程の切り替え・チェックの保存・オフライン保存にはJavaScriptが必要です。</div></noscript>
</body></html>'''
replacements={'MAP':map_html,'SUMMARY':summary_html,'STAMPS':stamps_html,'DAY_TABS':''.join(f'<a href="#day-{d["n"]}" id="day-tab-{d["n"]}" class="day-tab" data-day="{d["n"]}"><span>DAY 0{d["n"]}</span><strong>{d["short"]}<small>{d["weekday"]}</small></strong><span class="tab-theme">{["恐竜・手織り・温泉","日本海・永平寺・福井酒","一乗谷・角打ち・帰京"][d["n"]-1]}</span></a>' for d in days),'JOURNEY':journey,'PLACES':place_cards,'ROUTES':routes,'PREP':prep,'PACKING':packing,'BUDGET':budget,'RESERVATIONS':reservations,'RAIN':rain}
for key,val in replacements.items(): page=page.replace('{{'+key+'}}',val)
(ROOT/'index.html').write_text(page)
trip=dict(map=map_data,days=days,places=[{k:v for k,v in p.items() if k!='detail'} for p in places],checkedAt='2026-09-10')
(ROOT/'trip-data.js').write_text('window.TRIP = '+json.dumps(trip,ensure_ascii=False,indent=2)+';\n')
# Version every shipped local asset. Only this project's caches are removed by the worker.
assets=['./','./index.html','./style.css','./trip-data.js','./app.js','./journey-extras.js','./manifest.webmanifest','./credits.html','./assets/tojinbo.webp','./assets/eiheiji.webp','./assets/icon-192.png','./assets/icon-512.png']
missing=[x for x in assets[1:] if not (ROOT/x[2:]).exists()]
if missing:
    print('HTML generated. Assets still needed:', ', '.join(missing))
else:
    digest=hashlib.sha256(b''.join((ROOT/x[2:]).read_bytes() for x in assets[1:])).hexdigest()[:12]
    template=(ROOT/'scripts/sw-template.js').read_text()
    (ROOT/'sw.js').write_text(template.replace('__VERSION__',digest).replace('__ASSETS__',json.dumps(assets)))
    print('Generated index.html, trip-data.js and sw.js; content version',digest)

"""Offline geographic SVG, source-linked summary, and playful travel stamps."""
import html
from visual import make_postcards, icon
from adventure_map import make_map

# Event titles reference the master itinerary, so summary times follow source updates.
SUMMARY=[
 ('早朝','出発・朝の支度',[
  ['東京駅到着目標','東京駅発'],['長谷川で朝食'],['朝食・身支度']]),
 ('午前','09:00 — 12:00',[
  ['福井駅着','レンタカー受付・受取','恐竜博物館'],['チェックアウト','東尋坊散策','みくに隠居処で昼食予定'],['ホテルチェックアウト','一乗谷朝倉氏遺跡博物館']]),
 ('昼','12:00 — 14:00',[
  ['見学終了・移動開始','軽い昼食'],['ESHIKOTO'],['昼食・遺跡方面への移動','遺跡をガイド付きで見学予定']]),
 ('午後','14:00 — 17:00',[
  ['手織り体験','勝山出発'],['大本山永平寺','福井市へ移動・駐車'],['一乗谷出発','レンタカー返却','みずもとで角打ち']]),
 ('夜','17:00 — 帰着・就寝',[
  ['長谷川チェックイン','旅館の「結会席」'],['ホテルフジタ福井チェックイン','休憩・身支度・近場の散歩','煙やで夕食'],['新幹線改札へ','福井駅発','東京駅着']])
]
def make_summary(days):
    rows=''
    for period,time,columns in SUMMARY:
        cells=''
        for day,titles in zip(days,columns):
            events=[]
            for title in titles:
                e=next((e for e in day['events'] if e['title']==title),None)
                if e is None:raise ValueError(f'Summary entry missing in Day {day["n"]}: {title}')
                pending='未予約' if title=='みくに隠居処で昼食予定' else '予約調整中' if title=='遺跡をガイド付きで見学予定' else ''
                flag='<span class="summary-fixed">固定</span>' if e['fixed'] else f'<span class="summary-pending">{pending}</span>' if pending else ''
                target=f'#place-{e["place"]}' if e['place'] else f'#day-{day["n"]}'
                note='<small>夕食時刻は宿に確認</small>' if title=='旅館の「結会席」' else '<small>返却予約は17:00</small>' if title=='レンタカー返却' else '<small>車の返却完了後</small>' if title=='みずもとで角打ち' else ''
                events.append(f'<a class="summary-event" href="{target}"><span class="summary-time">{html.escape(e["time"])}{flag}</span><strong>{html.escape(e["title"])}</strong>{note}</a>')
            cells+=f'<td class="summary-day-{day["n"]}">{"".join(events)}</td>'
        rows+=f'<tr><th scope="row"><span>{period}</span><small>{time}</small></th>{cells}</tr>'
    header=''.join(f'<th scope="col" class="summary-day-{d["n"]}"><span>DAY 0{d["n"]}</span><strong>{d["short"]}<small>（{d["jp"]}）</small></strong><em>{["恐竜・手織り・温泉","海・祈り・福井酒","歴史・そば・乾杯"][d["n"]-1]}</em></th>' for d in days)
    return f'''<section class="section-wrap summary-section" id="timetable"><div class="section-heading"><div><p class="eyebrow">THREE DAYS, THREE LITTLE ADVENTURES</p><h2>三日間の、いい予感。</h2></div><p>気になる一日を、ひらいてみよう。</p></div>{make_postcards(days)}<details class="overview-details"><summary><span>{icon("clock")} 3日間のタイムテーブルを見比べる</span><span>＋</span></summary><div class="summary-topline"><span>2026.09.21 — 23</span><span>● 固定の予約・列車　／　そのほかは計画上の目安</span></div><p class="summary-scroll-hint">左右にスワイプして、3日間を見比べる ↔</p><div class="summary-scroll" role="region" aria-label="全日程のタイムテーブル。横スクロールできます" tabindex="0"><table class="summary-table"><caption class="sr-only">2026年9月21日から23日の主要予定。朝・昼・午後・夜ごとに3日間を比較。</caption><thead><tr><th scope="col" class="summary-corner">TIME<br><span>OF DAY</span></th>{header}</tr></thead><tbody>{rows}</tbody></table></div><div class="summary-ticket"><span>RETURN TICKET</span><p><b>9.23　18:18 福井 → 21:20 東京</b><small>かがやき582号 · 指定席2名</small></p><a href="#day-3">最終日の詳細 ↗</a></div></details></section>'''

STAMPS=[('dinosaur','太古','恐竜に出会った','DAY 1'),('weaving','織','糸から思い出へ','DAY 1'),('hasegawa','湯','湯上がりの幸せ','DAY 1'),('tojinbo','海','日本海で深呼吸','DAY 2'),('eiheiji','祈','静けさを味わう','DAY 2'),('ruins','歴史','城下町を歩いた','DAY 3')]
def make_stamps():
    buttons=''.join(f'<button class="travel-stamp" type="button" data-stamp="{id}" aria-pressed="false" aria-label="{title}のスタンプを押す"><span class="stamp-day">{day}</span><strong>{icon({"dinosaur":"bone","weaving":"scissors","hasegawa":"bath","tojinbo":"droplets","eiheiji":"trees","ruins":"landmark"}[id])}</strong><span class="stamp-word">{title}</span><span class="stamp-action">ぽん、と押す</span></button>' for id,kanji,title,day in STAMPS)
    return f'''<section class="stamp-section section-wrap" id="stamps"><div class="section-heading"><div><p class="eyebrow">SIX LITTLE SOUVENIRS</p><h2>思い出を、ぽん。</h2></div><p>訪れたら、ぽん。六つの思い出を集めよう。</p></div><div class="stamp-book">{buttons}</div><div class="stamp-bottom"><p id="stamp-message" role="status">まだ白紙のスタンプ帳。どこから思い出が増えるかな。</p><span id="stamp-count">0 / 6</span></div><div class="stamp-keepsake" id="stamp-keepsake" hidden><p>福井の思い出、コンプリート。<small>FUKUI · 2026.09.21 — 23 · FOR THE TWO OF US</small></p>{icon('ticket')}</div><p class="storage-hint">スタンプはこの端末に保存。もう一度押すと取り消せます。</p></section>'''

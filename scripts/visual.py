"""Image-led chapters and compact, source-grounded itinerary highlights."""
from pathlib import Path
import html,re
ROOT=Path(__file__).resolve().parent.parent

def icon(name):
    text=(ROOT/'assets/icons'/f'{name}.svg').read_text()
    text=re.sub(r'<svg\b', '<svg class="ui-icon" aria-hidden="true" focusable="false"', text, count=1)
    return text

VISUALS=[
 dict(photo='dinosaur.webp',alt='福井県立恐竜博物館の風景',title='太古と、<br>湯けむり。',area='勝山 → あわら',chips=[('bone','恐竜'),('scissors','手織り'),('bath','温泉')],caption='恐竜博物館 / KATSUYAMA',peek=[('11:00','恐竜博物館'),('15:00','手織り体験'),('17:30','長谷川 到着予定')],events=[('東京駅発','train-front'),('レンタカー受付・受取','car-front'),('恐竜博物館','bone'),('手織り体験','scissors'),('長谷川チェックイン','bath')]),
 dict(photo='tojinbo.webp',alt='青い日本海に面する東尋坊の断崖',title='海と、<br>祈りと、一杯。',area='三国 → 永平寺 → 福井',chips=[('droplets','日本海'),('trees','永平寺'),('wine','福井酒')],caption='東尋坊 / MIKUNI',peek=[('09:30','東尋坊'),('14:30','永平寺'),('20:45','煙や')],events=[('東尋坊散策','droplets'),('みくに隠居処で昼食予定','utensils'),('ESHIKOTO','wine'),('大本山永平寺','trees'),('ホテルフジタ福井チェックイン','moon'),('煙やで夕食','utensils')]),
 dict(photo='ichijodani.webp',alt='一乗谷朝倉氏遺跡の風景',title='歴史を歩く、<br>余韻の日。',area='一乗谷 → 福井駅',chips=[('landmark','一乗谷'),('utensils','そば'),('wine','角打ち')],caption='一乗谷 / ICHIJODANI',peek=[('09:45','一乗谷の博物館'),('13:00','遺跡ガイド 調整中'),('18:18','新幹線で東京へ')],events=[('一乗谷朝倉氏遺跡博物館','landmark'),('遺跡をガイド付きで見学予定','trees'),('一乗谷出発','car-front'),('レンタカー返却','car-front'),('みずもとで角打ち','wine'),('福井駅発','train-front')])
]

def make_postcards(days):
    cards=''
    for day,v in zip(days,VISUALS):
        # Preview times are pulled from source events to keep future edits consistent.
        source_titles=[['恐竜博物館','手織り体験','長谷川チェックイン'],['東尋坊散策','大本山永平寺','煙やで夕食'],['一乗谷朝倉氏遺跡博物館','遺跡をガイド付きで見学予定','福井駅発']][day['n']-1]
        peek=''
        for title,(_,label) in zip(source_titles,v['peek']):
            e=next(e for e in day['events'] if e['title']==title)
            # Check-in keeps the target time from the master, rather than hiding its range.
            time=e['time'].replace('〜','–').removesuffix('–')
            peek+=f'<span><time>{html.escape(time)}</time><span>{label}</span></span>'
        chips=''.join(f'<span>{icon(i)}{label}</span>' for i,label in v['chips'])
        cards+=f'''<article class="postcard postcard-{day['n']}"><a href="#day-{day['n']}" class="postcard-image"><img src="assets/{v['photo']}" alt="{v['alt']}" width="1200" height="800" loading="lazy"><span class="postcard-date">DAY 0{day['n']}<b>{day['short']}</b><small>{day['weekday']}</small></span><h3>{v['title']}</h3><span class="postcard-go" aria-label="この日をひらく">{icon('arrow-up-right')}</span></a><div class="postcard-body"><div class="experience-chips">{chips}</div><div class="postcard-times">{peek}</div></div></article>'''
    return f'<div class="postcards">{cards}</div>'

def make_journey(days, discoveries=None):
    result=''
    for day,v in zip(days,VISUALS):
        milestones=''
        for title,i in v['events']:
            e=next(e for e in day['events'] if e['title']==title)
            target=f'#place-{e["place"]}' if e['place'] else '#reference'
            pending='未予約' if title=='みくに隠居処で昼食予定' else '予約調整中' if title=='遺跡をガイド付きで見学予定' else ''
            label={'東京駅発':'東京から福井へ','レンタカー受付・受取':'レンタカー受取','一乗谷朝倉氏遺跡博物館':'一乗谷の博物館','遺跡をガイド付きで見学予定':'一乗谷をガイドと歩く','ホテルフジタ福井チェックイン':'ホテルに車を置いて休憩','長谷川チェックイン':'長谷川で温泉と会席','みくに隠居処で昼食予定':'三国の海鮮ランチ','福井駅発':'新幹線で東京へ'}.get(title,title)
            status=f'<span class="milestone-status pending">{pending}</span>' if pending else '<span class="milestone-status">予約済み</span>' if e['fixed'] else ''
            note={'東京駅発':'かがやき501号 → 09:12 福井着','長谷川チェックイン':'17:30到着予定。夕食時刻は宿に確認。','レンタカー返却':'目標16:00〜16:30 ／ 予約17:00','みずもとで角打ち':'車の返却完了後に。混雑時は省略。','福井駅発':'かがやき582号 → 21:20 東京着'}.get(title,'')
            milestones+=f'<a class="milestone" href="{target}"><span class="milestone-icon">{icon(i)}</span><div><time>{html.escape(e["time"])}</time>{status}<h4>{label}</h4>{f"<small>{note}</small>" if note else ""}</div><span class="milestone-arrow">↗</span></a>'
        full=''
        for e in day['events']:
            title=f'<a href="#place-{e["place"]}" class="place-jump">{html.escape(e["title"])} ↗</a>' if e['place'] else html.escape(e['title'])
            fixed='<span class="fixed-label">固定</span>' if e['fixed'] else ''
            full+=f'<li class="event {"is-fixed" if e["fixed"] else ""}"><div class="event-time">{html.escape(e["time"])}{fixed}</div><div class="event-copy"><h4>{title}</h4><p>{html.escape(e["note"])}</p></div></li>'
        result+=f'''<article class="day-panel day-theme-{day['n']}" id="day-{day['n']}" aria-labelledby="day-tab-{day['n']}"><div class="chapter-layout"><div class="chapter-image"><img src="assets/{v['photo']}" alt="{v['alt']}" width="1200" height="800" loading="lazy"><div class="chapter-photo-copy"><span class="eyebrow">{v['area']}</span><h3>{v['title']}</h3><span>{v['caption']}</span></div><span class="chapter-number">0{day['n']}</span></div><div class="milestones">{milestones}</div></div><div class="day-reminder">{icon('clock')}<p><strong>{day['focus']}</strong><span>{day['note']}</span></p></div><details class="full-schedule" id="schedule-{day['n']}"><summary>{icon('clock')} すべての時間・移動を見る <span>＋</span></summary><ol class="timeline">{full}</ol></details>{(discoveries or {}).get(day['n'],'')}</article>'''
    return result

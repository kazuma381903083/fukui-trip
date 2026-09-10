"""Offline geographic SVG, source-linked summary, and playful travel stamps."""
from pathlib import Path
import json,math,html
from visual import make_postcards, icon
ROOT=Path(__file__).resolve().parent.parent

def project(lon,lat):
    # Local equirectangular projection with latitude correction; north is up.
    return (lon-136.0)*1130*math.cos(math.radians(36.1))+38,(36.31-lat)*1130+25

def geometry_path(geometry,proj):
    polys=geometry['coordinates'] if geometry['type']=='MultiPolygon' else [geometry['coordinates']]
    result=[]
    for poly in polys:
        for ring in poly:
            points=[proj(*p[:2]) for p in ring]
            result.append('M'+' L'.join(f'{x:.1f},{y:.1f}' for x,y in points)+' Z')
    return ' '.join(result)

def make_map():
    geo=json.loads((ROOT/'data/fukui-region.geojson').read_text())
    data=json.loads((ROOT/'data/map-stops.json').read_text())
    nodes={n['id']:n for n in data['nodes']}
    land=''.join(f'<path d="{geometry_path(f["geometry"],project)}" class="map-land {"is-fukui" if f["properties"]["id"]==18 else ""}"/>' for f in geo['features'])
    lines='';markers=''
    for day in data['days']:
        routes=[]
        for i,(start,end) in enumerate(zip(day['nodes'],day['nodes'][1:])):
            a,b=nodes[start],nodes[end];x,y=project(a['lon'],a['lat']);xx,yy=project(b['lon'],b['lat'])
            dx,dy=xx-x,yy-y;length=math.hypot(dx,dy)
            # Shorten each end so arrowheads stop before the location symbol.
            ux,uy=dx/length,dy/length
            x+=ux*13;y+=uy*13;xx-=ux*13;yy-=uy*13
            if day['n']==3:
                offset=21;cx=(x+xx)/2-uy*offset;cy=(y+yy)/2+ux*offset
                path=f'M{x:.1f},{y:.1f} Q{cx:.1f},{cy:.1f} {xx:.1f},{yy:.1f}'
            else:path=f'M{x:.1f},{y:.1f} L{xx:.1f},{yy:.1f}'
            routes.append(f'<path d="{path}" class="map-route" marker-end="url(#arrow-{day["n"]})" pathLength="100"/>')
        lines+=f'<g class="map-route-day" data-map-route="{day["n"]}" style="--route-color:{day["color"]}">{"".join(routes)}</g>'
    for n in data['nodes']:
        x,y=project(n['lon'],n['lat']);tx,ty=x+n['dx'],y+n['dy']
        markers+=f'''<a href="#place-{n['place']}" class="map-point" data-map-node="{n['id']}" aria-label="{n['name']}の案内"><title>{n['name']}</title><circle class="map-hit" cx="{x:.1f}" cy="{y:.1f}" r="21"/><circle class="map-pin" cx="{x:.1f}" cy="{y:.1f}" r="10"/><text class="map-pin-number" x="{x:.1f}" y="{y+3.5:.1f}" text-anchor="middle">·</text><path class="map-leader" d="M{x:.1f},{y:.1f} L{tx:.1f},{ty-5:.1f}"/><text class="map-label" x="{tx:.1f}" y="{ty:.1f}" text-anchor="{n['anchor']}">{n['name']}</text></a>'''
    fukui=next(f for f in geo['features'] if f['properties']['id']==18)
    inset_proj=lambda lon,lat:((lon-135.43)*89,(36.35-lat)*110)
    inset_path=geometry_path(fukui['geometry'],inset_proj)
    svg=f'''<svg class="fukui-map" viewBox="0 0 700 480" aria-labelledby="map-svg-title map-svg-desc"><title id="map-svg-title">福井県の北部・嶺北を巡る3日間の地図</title><desc id="map-svg-desc">北が上。Day 1は福井から東の勝山、北西のあわら。Day 2は西の東尋坊と三国から南東のESHIKOTO・永平寺を経て福井。Day 3は南東の一乗谷と福井を往復。線は訪問順を示し、道路の経路ではありません。</desc><defs><clipPath id="map-clip"><rect width="700" height="480" rx="3"/></clipPath>{''.join(f'<marker id="arrow-{d["n"]}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,1 L9,5 L0,9" fill="none" stroke="{d["color"]}" stroke-width="1.8"/></marker>' for d in data['days'])}<pattern id="map-grid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M42,0 H0 V42" fill="none" stroke="#547e7911" stroke-width="1"/></pattern></defs><g clip-path="url(#map-clip)"><rect width="700" height="480" fill="#deebe8"/>{land}<rect width="700" height="480" fill="url(#map-grid)"/><text class="sea-label" x="48" y="178">日本海</text><text class="map-small" x="49" y="196">SEA OF JAPAN</text><text class="region-label" x="487" y="54">石川県</text><text class="region-label" x="480" y="411">福井県・嶺北</text>{lines}{markers}<g class="map-north" transform="translate(648 45)"><text text-anchor="middle" y="-14">N</text><path d="M0,0 V35 M-5,8 L0,0 L5,8"/></g><g transform="translate(24 300)"><rect width="170" height="155" rx="3" fill="#f8f7f2" stroke="#c1d1c6"/><text x="13" y="23" class="inset-title">福井県全体</text><g transform="translate(4 34)"><path d="{inset_path}" fill="#cdd8c6" stroke="#7f9788" stroke-width=".8"/><rect x="51" y="4" width="68" height="47" fill="#ae663322" stroke="#a46840" stroke-width="1.2" stroke-dasharray="3 2"/><text x="42" y="107" class="map-small">今回の旅のエリア</text></g></g><g transform="translate(235 446)"><path d="M0,-5 V0 H101.6 V-5" stroke="#62796b" fill="none"/><text x="50.8" y="17" text-anchor="middle" class="map-small">約10 km</text></g></g></svg>'''
    filters='<div class="map-filters" role="group" aria-label="地図の日程"><button type="button" data-map-day="all" aria-pressed="true">全日程</button>'+''.join(f'<button type="button" data-map-day="{d["n"]}" aria-pressed="false" style="--route-color:{d["color"]}"><i aria-hidden="true"></i>Day {d["n"]}</button>' for d in data['days'])+'</div>'
    legend=''.join(f'<span style="--route-color:{d["color"]}"><i></i>Day {d["n"]}</span>' for d in data['days'])
    map_html=f'''<div class="map-tool"><div class="map-toolbar"><span class="eyebrow">FUKUI ROAD TRIP</span>{filters}</div><div class="map-layout"><div class="map-surface" tabindex="0" role="region" aria-label="福井県の旅の地図。拡大時は左右にスクロールできます"><button class="map-zoom" id="map-zoom" type="button" aria-pressed="false">地図を拡大 ＋</button>{svg}<div class="map-legend">{legend}<span>→ 訪問順</span></div></div><aside class="map-story" aria-label="地図の案内"><p class="eyebrow" id="map-story-kicker">3 DAYS / ひとめぐり</p><h3 id="map-story-title">海へ、里へ。</h3><p id="map-story-note">地点を押すと、案内がひらきます。</p><div id="map-itinerary"></div><div class="map-selection" id="map-selection" hidden><p id="map-location-name"></p><p id="map-location-note"></p><a id="map-location-link" href="#places">施設のくわしい案内 ↗</a></div><p class="map-finish" id="map-finish">東京 ↔ 福井は北陸新幹線<br>県内はレンタカー。夜の福井市内は徒歩で。</p></aside></div><p class="map-caption">線は訪問順の概略。道路の経路は施設の案内で確認。<a href="credits.html#map-credits">地図の出典 ↗</a></p></div>'''
    return map_html,data

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
    return f'''<section class="stamp-section section-wrap" id="stamps"><div class="section-heading"><div><p class="eyebrow">SIX LITTLE SOUVENIRS</p><h2>思い出を、ぽん。</h2></div><p>訪れたら、ぽん。六つの思い出を集めよう。</p></div><div class="stamp-book">{buttons}</div><div class="stamp-bottom"><p id="stamp-message" role="status">まだ白紙のスタンプ帳。どこから思い出が増えるかな。</p><span id="stamp-count">0 / 6</span></div><p class="storage-hint">スタンプはこの端末に保存。もう一度押すと取り消せます。</p></section>'''

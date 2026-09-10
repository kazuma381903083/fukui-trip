"""A photographic travel map; all route dots retain their geographic positions."""
from pathlib import Path
import json, math, re
from visual import icon

ROOT = Path(__file__).resolve().parent.parent

def project(lon, lat):
    return (lon - 136.0) * 1130 * math.cos(math.radians(36.1)) + 38, (36.31 - lat) * 1130 + 25

def geometry_path(geometry, proj):
    polys = geometry['coordinates'] if geometry['type'] == 'MultiPolygon' else [geometry['coordinates']]
    return ' '.join('M' + ' L'.join(f'{x:.1f},{y:.1f}' for x,y in [proj(*p[:2]) for p in ring]) + ' Z' for poly in polys for ring in poly)

# Callout positions differ from the actual coordinate dots; leaders connect them.
ART = {
    'tojinbo': dict(x=35,y=29,w=100,h=77,rotate=-7,photo='tojinbo.webp',label='東尋坊',tag='SEA BREEZE',stamp='tojinbo',tease='青の向こうで、深呼吸。'),
    'dinosaur': dict(x=552,y=151,w=116,h=88,rotate=6,photo='dinosaur.webp',label='恐竜博物館',tag='HELLO, DINOSAURS',stamp='dinosaur',tease='見上げる先に、太古の世界。'),
    'eiheiji': dict(x=421,y=357,w=111,h=78,rotate=5,photo='eiheiji.webp',label='永平寺',tag='A QUIET MOMENT',stamp='eiheiji',tease='杉木立の奥で、ひと呼吸。'),
    'ichijo': dict(x=264,y=420,w=104,h=67,rotate=-5,photo='ichijodani.webp',label='一乗谷',tag='WALK THROUGH TIME',stamp='ruins',tease='昔の町へ、歩幅をゆるめて。'),
    'awara': dict(x=303,y=64,icon='bath',label='あわら温泉',stamp='hasegawa',tease='今日の思い出を、湯にほどく。'),
    'mikuni': dict(x=108,y=190,icon='utensils',label='三国ランチ',tease='海辺のお昼は、おいしい予感。'),
    'eshikoto': dict(x=343,y=219,icon='wine',label='ESHIKOTO',tease='川の眺めと、お土産えらび。'),
    'weaving': dict(x=583,y=310,icon='scissors',label='ゆめおーれ',stamp='weaving',tease='糸を重ねて、旅の思い出に。'),
    'fukui': dict(x=181,y=311,icon='train-front',label='福井駅',tease='旅のはじまりも、帰り道も。'),
}

def make_map():
    geo=json.loads((ROOT/'data/fukui-region.geojson').read_text())
    data=json.loads((ROOT/'data/map-stops.json').read_text())
    nodes={n['id']:n for n in data['nodes']}
    for n in data['nodes']:
        n.update({k:v for k,v in ART[n['id']].items() if k in ['photo','label','tease','stamp']})
    land=''.join(f'<path d="{geometry_path(f["geometry"],project)}" class="map-land {"is-fukui" if f["properties"]["id"]==18 else ""}"/>' for f in geo['features'])
    lines=''
    for day in data['days']:
        routes=[]
        for i,(start,end) in enumerate(zip(day['nodes'],day['nodes'][1:])):
            a,b=nodes[start],nodes[end];x,y=project(a['lon'],a['lat']);xx,yy=project(b['lon'],b['lat'])
            dx,dy=xx-x,yy-y;length=math.hypot(dx,dy);ux,uy=dx/length,dy/length
            x+=ux*13;y+=uy*13;xx-=ux*13;yy-=uy*13
            cx=(x+xx)/2-uy*(21 if day['n']==3 else 0);cy=(y+yy)/2+ux*(21 if day['n']==3 else 0)
            path=f'M{x:.1f},{y:.1f} Q{cx:.1f},{cy:.1f} {xx:.1f},{yy:.1f}'
            routes.append(f'<path d="{path}" class="map-route" data-map-segment="{i}" marker-end="url(#arrow-{day["n"]})" pathLength="100"/>')
        lines+=f'<g class="map-route-day" data-map-route="{day["n"]}" style="--route-color:{day["color"]}">{"".join(routes)}</g>'
    markers='';clips=''
    for n in data['nodes']:
        a=ART[n['id']];x,y=project(n['lon'],n['lat']);cx,cy=a['x'],a['y']
        if 'photo' in a:
            w,h=a['w'],a['h'];tx,ty=cx+w/2,cy+h/2
            clips+=f'<clipPath id="photo-clip-{n["id"]}"><rect x="0" y="0" width="{w}" height="{h}" rx="2"/></clipPath>'
            art=f'''<g class="map-photo-stamp" transform="translate({cx} {cy}) rotate({a['rotate']} {w/2} {h/2})"><rect class="photo-paper" x="-5" y="-5" width="{w+10}" height="{h+22}" rx="2"/><rect class="photo-perforation" x="-5" y="-5" width="{w+10}" height="{h+22}" rx="2"/><image href="assets/{a['photo']}" width="{w}" height="{h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#photo-clip-{n['id']})"/><text class="photo-postmark" x="{w/2}" y="{h+11}" text-anchor="middle">{a['tag']}</text></g><text class="map-label" x="{tx}" y="{cy+h+39}" text-anchor="middle">{a['label']}</text>'''
        else:
            tx,ty=cx,cy
            hit_radius=30 if n['id']=='weaving' else 38
            glyph=re.sub(r'<svg\b',f'<svg x="{cx-14}" y="{cy-14}"',icon(a['icon']),count=1).replace('width="24"','width="28"').replace('height="24"','height="28"')
            art=f'<g class="map-icon-sticker"><circle class="map-callout-hit" cx="{cx}" cy="{cy}" r="{hit_radius}"/><circle cx="{cx}" cy="{cy}" r="24"/>{glyph}</g><text class="map-label" x="{cx}" y="{cy+41}" text-anchor="middle">{a["label"]}</text>'
        stamp=f'<circle class="map-visited" cx="{x+10:.1f}" cy="{y-12:.1f}" r="5"/>' if a.get('stamp') else ''
        markers+=f'''<a href="#place-{n['place']}" class="map-point" data-map-node="{n['id']}" aria-label="{n['name']}の案内をひらく"><title>{n['name']}</title><path class="map-leader" d="M{x:.1f},{y:.1f} L{tx:.1f},{ty:.1f}"/>{art}<circle class="map-hit" cx="{x:.1f}" cy="{y:.1f}" r="21"/><circle class="map-pin" cx="{x:.1f}" cy="{y:.1f}" r="10"/><text class="map-pin-number" x="{x:.1f}" y="{y+3.5:.1f}" text-anchor="middle">·</text>{stamp}</a>'''
    fukui=next(f for f in geo['features'] if f['properties']['id']==18)
    inset_path=geometry_path(fukui['geometry'],lambda lon,lat:((lon-135.43)*89,(36.35-lat)*110))
    arrows=''.join(f'<marker id="arrow-{d["n"]}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,1 L9,5 L0,9" fill="none" stroke="{d["color"]}" stroke-width="1.8"/></marker>' for d in data['days'])
    svg=f'''<svg class="fukui-map" viewBox="0 0 700 540" aria-labelledby="map-svg-title map-svg-desc"><title id="map-svg-title">福井県の北部・嶺北を巡る3日間の冒険マップ</title><desc id="map-svg-desc">北が上。Day 1は福井から東の勝山、北西のあわら。Day 2は西の東尋坊と三国から南東のESHIKOTO・永平寺を経て福井。Day 3は南東の一乗谷と福井を往復。写真とアイコンは線で実際の代表位置に結んでいます。色の線は訪問順で、道路の経路ではありません。</desc><defs>{clips}{arrows}<pattern id="map-grain" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".6" fill="#254b3e" opacity=".07"/></pattern></defs><rect width="700" height="540" fill="#d8e9e7"/>{land}<rect width="700" height="540" fill="url(#map-grain)" pointer-events="none"/><g aria-hidden="true"><text class="map-display-type" x="399" y="70">FUKUI</text><text class="map-subtitle" x="404" y="93">A LITTLE ADVENTURE</text><text class="sea-label" x="26" y="250">日本海</text><text class="map-small map-sea-meta" x="26" y="267">SEA OF JAPAN</text><text class="region-label" x="514" y="116">石川県</text><text class="region-label" x="538" y="496">福井県・嶺北</text></g>{lines}{markers}<g id="map-traveler" class="map-traveler" visibility="hidden" pointer-events="none" aria-hidden="true"><circle r="14"/><circle r="5"/></g><g class="map-north" transform="translate(665 36)"><text text-anchor="middle" y="-12">N</text><path d="M0,0 V30 M-5,8 L0,0 L5,8"/></g><g class="map-inset" transform="translate(25 474) scale(.47)"><path d="{inset_path}" fill="#c6d1b7" stroke="#869d80" stroke-width="1.3"/><rect x="51" y="4" width="68" height="47" fill="#ae663322" stroke="#a46840" stroke-width="2" stroke-dasharray="3 2"/><text x="155" y="36" class="map-small">福井県全体</text><text x="155" y="59" class="map-small">今回の旅は嶺北へ</text></g><g transform="translate(535 515)"><path d="M0,-5 V0 H101.6 V-5" stroke="#62796b" fill="none"/><text x="50.8" y="16" text-anchor="middle" class="map-small">約10 km</text></g></svg>'''
    filters='<div class="map-filters" role="group" aria-label="地図の日程"><button type="button" data-map-day="all" aria-pressed="true">全日程</button>'+''.join(f'<button type="button" data-map-day="{d["n"]}" aria-pressed="false" style="--route-color:{d["color"]}"><i aria-hidden="true"></i>Day {d["n"]}</button>' for d in data['days'])+'</div>'
    legend=''.join(f'<span style="--route-color:{d["color"]}"><i></i>Day {d["n"]}</span>' for d in data['days'])
    markup=f'''<div class="map-tool"><div class="map-toolbar"><span class="eyebrow">A MAP FULL OF LITTLE WONDERS</span>{filters}</div><div class="map-layout"><div class="map-canvas"><div class="map-surface" tabindex="0" role="region" aria-label="福井県の旅の地図。拡大時は左右にスクロールできます"><button class="map-zoom" id="map-zoom" type="button" aria-pressed="false">地図を拡大 ＋</button><div class="map-artboard">{svg}<button type="button" class="map-mascot" id="map-surprise" aria-label="恐竜と、旅先をひとつ発見する"><span><span class="mascot-desktop">どこに行こう？ ↗</span><span class="mascot-mobile">どこ行く？</span></span><img src="assets/dinosaur-traveler.webp" alt="" width="470" height="500" loading="lazy"></button></div></div><div class="map-legend">{legend}<span>→ 訪問順</span></div><div class="map-playbar"><button type="button" id="map-play" aria-pressed="false"><span class="play-symbol" aria-hidden="true">▶</span><span id="map-play-label">旅をたどる</span></button><span id="map-play-status" role="status" aria-live="polite">Day 1から、ひと足先に。</span><button type="button" id="map-next" hidden>次の場所へ →</button></div></div><aside class="map-story" aria-label="地図の案内"><p class="eyebrow" id="map-story-kicker">3 DAYS / ひとめぐり</p><h3 id="map-story-title">海へ、里へ。</h3><p id="map-story-note">地点を押すと、案内がひらきます。</p><div class="map-selection" id="map-selection" hidden><div class="map-selection-visual"><img id="map-location-image" src="assets/dinosaur.webp" alt="" width="400" height="267"><span id="map-location-tease"></span></div><div class="map-selection-copy"><p class="eyebrow">A LITTLE DISCOVERY</p><h4 id="map-location-name"></h4><p id="map-location-note"></p><a id="map-location-link" href="#places">施設のくわしい案内 ↗</a></div></div><div id="map-itinerary"></div><p class="map-finish" id="map-finish">東京 ↔ 福井は北陸新幹線。県内はレンタカー。</p><p class="map-invitation" id="map-invitation">写真や恐竜をタップして、<br>気になる場所をのぞいてみよう。</p></aside></div><p class="map-caption">色の線は訪問順の概略。道路経路は施設の案内へ。<a href="credits.html#map-credits">地図の出典 ↗</a></p></div>'''
    return markup,data

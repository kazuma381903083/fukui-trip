"""Check release assets, anchors and travel constraints before publishing."""
from pathlib import Path
from html.parser import HTMLParser
import json,re
ROOT=Path(__file__).resolve().parent.parent
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=[]; self.links=[]; self.assets=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if tag=='a':self.links.append(a.get('href',''))
        if tag in ['img','script'] and 'src' in a:self.assets.append(a['src'])
        if tag=='image' and 'href' in a:self.assets.append(a['href'])
        if tag=='link' and 'href' in a:self.assets.append(a['href'])
page=Page(); text=(ROOT/'index.html').read_text(); page.feed(text)
assert len(page.ids)==len(set(page.ids)), 'Duplicate HTML IDs'
for link in page.links:
    if link.startswith('#'):assert link[1:] in page.ids, f'Broken anchor: {link}'
for asset in page.assets:assert (ROOT/asset).is_file(),f'Missing asset: {asset}'
assert '{{' not in text,'Unreplaced template'
assert '鮎釣り' not in text and '平泉寺白山神社' not in text
raw=(ROOT/'trip-data.js').read_text(); data=json.loads(raw[len('window.TRIP = '):].rstrip(';\n'))
days=data['days']; places={p['id']:p for p in data['places']}
assert len(days)==3 and len(places)==15
assert any(e['time']=='15:00〜16:00' and e['title']=='手織り体験' and e['fixed'] for e in days[0]['events'])
assert any(e['title']=='大本山永平寺' for e in days[1]['events'])
assert not any(e['title']=='大本山永平寺' for e in days[2]['events'])
assert any(e['time']=='20:45〜' and e['title']=='煙やで夕食' and e['fixed'] for e in days[1]['events'])
assert any(e['time']=='18:18' and e['title']=='福井駅発' and e['fixed'] for e in days[2]['events'])
assert places['ruins']['status']=='予約調整中' and places['lunch']['status']=='未予約'
assert '予約17:00' in text or '返却予約は17:00' in text
assert '249,691' in text and '159,132' in text and '186,951' in text
assert '19:00開始は希望・未確定' in text
assert '９' not in days[0]['date']
for day in days:
    for event in day['events']:
        if event['place']:assert event['place'] in places
manifest=json.loads((ROOT/'manifest.webmanifest').read_text())
assert manifest['start_url']=='./' and manifest['scope']=='./'
for icon in manifest['icons']:assert (ROOT/icon['src']).is_file()
sw=(ROOT/'sw.js').read_text()
assert '__VERSION__' not in sw and '__ASSETS__' not in sw
assert 'key.startsWith(PREFIX)' in sw, 'Cache cleanup must be scoped to this trip'
assert [d['nodes'] for d in data['map']['days']]==[['fukui','dinosaur','weaving','awara'],['awara','tojinbo','mikuni','eshikoto','eiheiji','fukui'],['fukui','ichijo','fukui']]
assert 'class="summary-table"' in text and text.count('data-stamp=')==6
assert text.count('class="postcard postcard-')==3
assert text.count('class="full-schedule"')==3
assert 'id="place-directory"' in text
assert 'visual.css' in sw and 'assets/dinosaur.webp' in sw and 'assets/ichijodani.webp' in sw
assert 'journey-extras.js' in sw
assert 'delight.css' in sw and 'assets/dinosaur-traveler.webp' in sw
assert text.count('class="map-photo-stamp"')==4
for control in ['map-play','map-next','map-surprise','stamp-keepsake']:
    assert control in page.ids
print(f'PASS: {len(page.ids)} anchors, {len(places)} places, {sum(len(d["events"]) for d in days)} itinerary entries, travel constraints and offline assets.')

"""Small discoveries inside the itinerary, and a keepsake the reader can take home."""
from pathlib import Path
import html, json
from visual import icon

ROOT = Path(__file__).resolve().parent.parent
esc = html.escape

def make_discoveries(places):
    cards = json.loads((ROOT/'data/discovery-cards.json').read_text())
    names = {p['id']:p['name'] for p in places}
    motifs = {'dinosaur':('bone','歯'), 'weaving':('scissors','糸'), 'onsen':('bath','湯'), 'taste':('utensils','味'), 'tojinbo':('droplets','海'), 'sake':('wine','酒'), 'eiheiji':('trees','静'), 'ichijo':('landmark','時')}
    result = {}
    for day in (1,2,3):
        items = ''
        for index, card in enumerate(cards):
            if card['day'] != day: continue
            symbol, word = motifs[card['museumId']]
            items += f'''<article class="discovery-card" data-discovery-card="{esc(card['id'])}"><div class="discovery-art" aria-hidden="true"><span class="discovery-orbit"></span>{icon(symbol)}<b>{word}</b><small>FUKUI / {index+1:02}</small></div><div class="discovery-copy"><p class="discovery-tag">{esc(card['tag'])} <span>· {esc(names[card['placeId']])}</span></p><h4>{esc(card['title'])}</h4><p class="discovery-prompt">{esc(card['prompt'])}</p><div class="discovery-links"><a href="museum.html#exhibit-{esc(card['museumId'])}">見どころを知る ↗</a><a href="#place-{esc(card['placeId'])}">場所の案内 ↗</a></div></div></article>'''
        capsule = '<div class="gacha-show" hidden aria-hidden="true"><div class="gacha-rays"></div><div class="gacha-ball"><i class="gacha-top"></i><i class="gacha-bottom"></i><b>福</b></div><span class="gacha-pop">なにが出るかな？</span></div>'
        result[day] = f'''<details class="discovery-drawer" id="discovery-{day}" data-discovery-day="{day}"><summary><span>{icon('sun')}くるっと、旅ガチャ。<small>DAY 0{day} / 4 CARDS</small></span><b>あけてみる ↗</b></summary><div class="discovery-inside"><p class="discovery-intro">回して、ひらいて。今日の旅に、小さな発見。</p><div class="discovery-deck">{items}{capsule}</div><div class="discovery-bottom"><button class="discovery-draw" type="button" hidden><span class="gacha-handle" aria-hidden="true">↻</span>ガチャを回す</button><span class="discovery-announcement sr-only" role="status"></span><a href="#trip-memo">発見をメモに ↗</a></div></div></details>'''
    return result

def make_pockets():
    return f'''<nav class="journey-pockets section-wrap" aria-label="旅のポケット"><a href="#discovery-1" id="pocket-discovery">{icon('sun')}旅ガチャ</a><a href="museum.html">{icon('landmark')}資料館</a><a href="#reservations">{icon('ticket')}予約の控え</a><a href="#rain-plan" id="field-help-open">{icon('backpack')}現地でサッと</a></nav>'''

def make_postcard_studio():
    return f'''<div class="souvenir-invitation" id="souvenir-entry" hidden><span class="souvenir-mini" aria-hidden="true">{icon('sun')}<b>FUKUI</b><small>WITH LOVE</small></span><div><p class="eyebrow">A LITTLE PIECE OF YOUR JOURNEY</p><h3>この旅を、絵はがきに。</h3><p>好きな色と、ふたりのひとことを添えて。</p></div><button type="button" id="souvenir-open">絵はがきをつくる {icon('arrow-up-right')}</button></div>'''

def make_postcard_dialog():
    return '''<dialog class="souvenir-dialog" id="souvenir-dialog" aria-labelledby="souvenir-title"><div class="souvenir-dialog-top"><div><p class="eyebrow">POSTCARD STUDIO</p><h2 id="souvenir-title">ふたりの旅を、一枚に。</h2></div><button type="button" class="souvenir-close" id="souvenir-close" aria-label="絵はがきを閉じる" autofocus>×</button></div><div class="souvenir-preview"><canvas id="souvenir-canvas" width="1600" height="1000" role="img" aria-label="福井旅行の絵はがきプレビュー"></canvas></div><div class="souvenir-controls"><fieldset class="souvenir-themes"><legend>旅の色</legend><label><input type="radio" name="souvenir-theme" value="sea" checked><span class="theme-sea"></span>海の青</label><label><input type="radio" name="souvenir-theme" value="forest"><span class="theme-forest"></span>森の緑</label><label><input type="radio" name="souvenir-theme" value="sunset"><span class="theme-sunset"></span>夕日の朱</label></fieldset><label class="souvenir-note-label" for="souvenir-note">ふたりのひとこと <span>48文字まで</span></label><input id="souvenir-note" type="text" placeholder="例：海の青さと、湯上がりの幸せ。" autocomplete="off"><div class="souvenir-save-row"><p id="souvenir-status" role="status">スタンプの数も、いまの記録で。</p><button type="button" id="souvenir-save">画像を保存 ↓</button></div><p class="souvenir-privacy">画像は保存先へダウンロードされます。共有したいときは、保存した一枚をどうぞ。</p></div></dialog>'''

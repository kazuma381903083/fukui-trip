"""Check discovery navigation, live reservation hints and downloadable keepsakes."""
from playwright.sync_api import sync_playwright, expect
from datetime import datetime
from pathlib import Path
import base64, struct, sys

BASE = sys.argv[1] if len(sys.argv)>1 else 'http://localhost:4173/'
with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(viewport={'width':390,'height':844}, reduced_motion='reduce', accept_downloads=True)
    page = context.new_page(); errors = []
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.goto(BASE,wait_until='networkidle')
    expect(page.locator('.discovery-card')).to_have_count(12)
    expect(page.locator('.discovery-drawer[open]')).to_have_count(0)
    page.locator('#trip-memo').fill('もとの旅メモ。')
    page.locator('[data-stamp="dinosaur"]').click()
    # Cross-day anchors select their parent day and open the requested drawer.
    page.goto(BASE+'#discovery-2')
    expect(page.locator('#day-2')).to_be_visible()
    expect(page.locator('#discovery-2')).to_have_attribute('open','')
    expect(page.locator('#pocket-discovery')).to_have_attribute('href','#discovery-2')
    drawer = page.locator('#discovery-2'); seen = []
    for _ in range(4):
        card = drawer.locator('.discovery-card:visible')
        expect(card).to_have_count(1)
        seen.append(card.get_attribute('data-discovery-card'))
        drawer.locator('.discovery-draw').click()
    assert len(set(seen))==4,seen
    assert drawer.locator('.discovery-card:visible').get_attribute('data-discovery-card')!=seen[-1]
    page.set_viewport_size({'width':320,'height':568})
    drawer.locator('.discovery-draw').click()
    expect(drawer.locator('.discovery-card:visible h4')).to_be_in_viewport()
    expect(drawer.locator('.discovery-card:visible')).to_be_focused()
    page.keyboard.press('Tab');page.keyboard.press('Tab');page.keyboard.press('Tab')
    expect(drawer.locator('.discovery-draw')).to_be_focused()
    page.wait_for_function('document.activeElement.getBoundingClientRect().bottom < document.querySelector(".mobile-nav").getBoundingClientRect().top')
    page.keyboard.press('Enter')
    expect(drawer.locator('.discovery-card:visible h4')).to_be_in_viewport()
    page.set_viewport_size({'width':390,'height':844})
    assert page.evaluate('document.getAnimations().filter(a=>a.playState==="running").length')==0
    for target in ['reservations','rain-plan']:
        page.locator(f'.journey-pockets a[href="#{target}"]').click()
        expect(page.locator('#'+target)).to_have_attribute('open','')
    # The next fixed event retains its actual date and reaches the full timetable.
    page.clock.install(time=datetime.fromisoformat('2026-09-21T11:05:00+09:00'))
    page.reload(wait_until='networkidle')
    expect(page.locator('#now-fixed')).to_contain_text('15:00〜16:00 手織り体験')
    page.locator('#now-fixed').click()
    expect(page.locator('#schedule-1')).to_have_attribute('open','')
    page.clock.set_fixed_time(datetime.fromisoformat('2026-09-22T14:05:00+09:00'))
    page.reload(wait_until='networkidle')
    expect(page.locator('#now-fixed')).to_contain_text('20:45〜 煙やで夕食')
    page.clock.set_fixed_time(datetime.fromisoformat('2026-09-22T22:00:00+09:00'))
    page.reload(wait_until='networkidle')
    expect(page.locator('#now-fixed')).to_contain_text('9.23 18:18 福井駅発')
    page.locator('#now-fixed').click()
    expect(page.locator('#day-3')).to_be_visible()
    expect(page.locator('#schedule-3')).to_have_attribute('open','')
    page.clock.set_fixed_time(datetime.fromisoformat('2026-09-23T19:00:00+09:00'))
    page.reload(wait_until='networkidle')
    expect(page.locator('#now-fixed')).to_be_hidden()
    # One stamp, existing memo and the postcard's own sentence remain independent.
    page.locator('#souvenir-open').click()
    expect(page.locator('#souvenir-dialog')).to_be_visible()
    expect(page.locator('#souvenir-close')).to_be_focused()
    expect(page.locator('#souvenir-save')).to_be_enabled()
    expect(page.locator('#souvenir-canvas')).to_have_attribute('aria-label', '福井旅行の絵はがき。ふたりの旅。 スタンプ 1 / 6。')
    hashes = []
    for theme in ['sea','forest','sunset']:
        page.locator(f'input[value="{theme}"]').check()
        expect(page.locator('#souvenir-save')).to_be_enabled()
        hashes.append(page.locator('#souvenir-canvas').evaluate('c=>c.toDataURL()'))
    assert len(set(hashes))==3
    page.locator('#souvenir-note').fill('福井🦖'*20)
    assert page.locator('#souvenir-note').evaluate('e=>[...e.value].length')==48
    page.locator('#souvenir-note').fill('海の青さと、湯上がりの幸せ。')
    expect(page.locator('#souvenir-save')).to_be_enabled()
    for width in [320,390,768,1440]:
        page.set_viewport_size({'width':width,'height':844})
        assert not page.evaluate('document.documentElement.scrollWidth>innerWidth')
        assert page.locator('#souvenir-dialog').evaluate('d=>d.scrollWidth<=d.clientWidth')
    canvas_bytes=base64.b64decode(page.locator('#souvenir-canvas').evaluate('c=>c.toDataURL().split(",")[1]'))
    with page.expect_download() as event: page.locator('#souvenir-save').click()
    download = event.value; output=Path('/tmp/fukui-keepsake-qa.png');download.save_as(output)
    png=output.read_bytes()
    assert png==canvas_bytes and png[:8]==b'\x89PNG\r\n\x1a\n'
    assert struct.unpack('>II',png[16:24])==(1600,1000)
    page.keyboard.press('Escape')
    expect(page.locator('#souvenir-dialog')).not_to_be_visible()
    expect(page.locator('#souvenir-open')).to_be_focused()
    expect(page.locator('#trip-memo')).to_have_value('もとの旅メモ。')
    expect(page.locator('[data-stamp="dinosaur"]')).to_have_attribute('aria-pressed','true')
    # Fresh offline load still supports a draw and a first postcard render.
    page.evaluate('navigator.serviceWorker.ready')
    for asset in ['play.js','play.css','postcard-renderer.js']:
        assert page.evaluate('(asset)=>caches.match(asset).then(Boolean)',asset)
    context.set_offline(True);page.goto(BASE,wait_until='networkidle')
    page.locator('#pocket-discovery').click()
    expect(page.locator('.day-panel:not([hidden]) .discovery-card:visible')).to_have_count(1)
    page.locator('#souvenir-open').click();expect(page.locator('#souvenir-save')).to_be_enabled()
    assert page.locator('#souvenir-canvas').evaluate('c=>c.toDataURL().length>10000')
    assert not errors,errors
    context.close()
    context=browser.new_context(java_script_enabled=False, service_workers='block')
    page=context.new_page();page.goto(BASE)
    page.locator('#discovery-1>summary').click()
    expect(page.locator('#discovery-1 .discovery-card:visible')).to_have_count(4)
    expect(page.locator('#souvenir-entry')).to_be_hidden()
    context.close();browser.close()
    print('PASS: 12 day-matched discoveries, nonrepeating draw, deep links, reservation/rain pockets, Japan-time fixed events, 3 postcard themes, 48-codepoint note, exact PNG preview/export, focus return, 320–1440px, offline, original memo/stamps, no-JS reading; no runtime errors.')

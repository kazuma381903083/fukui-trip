"""Optional real-browser QA: run with a Python environment containing Playwright."""
from playwright.sync_api import sync_playwright,expect
from pathlib import Path
import json,sys
BASE=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:4173/'
with sync_playwright() as p:
 browser=p.chromium.launch()
 context=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce',accept_downloads=True)
 page=context.new_page(); errors=[]
 page.on('pageerror',lambda e: errors.append(str(e)))
 page.goto(BASE,wait_until='networkidle')
 expect(page.locator('#day-1')).to_be_visible()
 page.locator('#day-tab-2').click()
 expect(page.locator('#day-2')).to_be_visible(); expect(page.locator('#day-1')).to_be_hidden()
 assert '20:45' in page.locator('#day-2').inner_text()
 page.locator('#day-tab-2').press('ArrowRight')
 expect(page.locator('#day-tab-3')).to_be_focused();expect(page.locator('#day-3')).to_be_visible()
 page.locator('[data-filter="1"]').click();expect(page.locator('#place-eiheiji')).to_be_hidden()
 page.locator('.forest-interlude a').click();expect(page.locator('#place-eiheiji')).to_be_visible()
 assert page.locator('#place-eiheiji details').evaluate('(e)=>e.open')
 first=page.locator('[data-check]').first; first.check();page.locator('#trip-memo').fill('黒龍をお土産に。\nふたりで乾杯。')
 page.reload(wait_until='networkidle');expect(first).to_be_checked();expect(page.locator('#trip-memo')).to_have_value('黒龍をお土産に。\nふたりで乾杯。')
 with page.expect_download() as download:page.locator('#export-memo').click()
 assert '黒龍をお土産に' in Path(download.value.path()).read_text()
 for width in [320,390,768,1440]:
  page.set_viewport_size({'width':width,'height':900})
  assert not page.evaluate('document.documentElement.scrollWidth > innerWidth'),f'Horizontal overflow at {width}'
 page.set_viewport_size({'width':390,'height':844})
 page.goto(BASE+'#day-2',wait_until='networkidle');expect(page.locator('#day-2')).to_be_visible()
 page.screenshot(path='/tmp/fukui-mobile-verified.png',full_page=True)
 assert page.locator('img').evaluate_all('(imgs)=>imgs.every(i=>i.complete&&i.naturalWidth>0)')
 # Keep another trip's cache intact when this worker activates.
 page.evaluate("caches.open('shirasagi-test-preserve').then(c=>c.put('./previous-trip',new Response('keep')))")
 page.evaluate('navigator.serviceWorker.ready')
 page.reload(wait_until='networkidle')
 assert page.evaluate("navigator.serviceWorker.controller !== null")
 awaitable = page.evaluate("caches.keys()")
 assert 'shirasagi-test-preserve' in awaitable
 context.set_offline(True)
 page.reload(wait_until='networkidle')
 expect(page.locator('h1')).to_contain_text('ふくい')
 page.locator('#day-tab-3').click();expect(page.locator('#day-3')).to_be_visible()
 assert page.locator('img').evaluate_all('(imgs)=>imgs.every(i=>i.complete&&i.naturalWidth>0)')
 context.set_offline(False)
 assert not errors,errors
 context.close()
 # Date scenarios are evaluated in a different OS time zone to verify Japan-time handling.
 scenarios=[('2026-09-20T15:10:00Z','1','05:45'),('2026-09-22T04:00:00Z','2','13:15'),('2026-09-23T08:00:00Z','3','17:15'),('2026-09-24T00:00:00Z','1','ふたりで過ごした福井')]
 for iso,day,title in scenarios:
  c=browser.new_context(timezone_id='America/Los_Angeles',service_workers='block')
  pg=c.new_page();pg.clock.install(time=iso);pg.clock.pause_at(iso)
  pg.goto(BASE,wait_until='networkidle');expect(pg.locator('#day-'+day)).to_be_visible();expect(pg.locator('#now-title')).to_contain_text(title)
  c.close()
 # JavaScript-disabled visitors can still read every itinerary and detail.
 c=browser.new_context(java_script_enabled=False);pg=c.new_page();pg.goto(BASE)
 for day in ['1','2','3']:expect(pg.locator('#day-'+day)).to_be_visible()
 c.close()
 # A blocked storage API should leave the site usable and explain unsaved input.
 c=browser.new_context(service_workers='block');c.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new Error('disabled')}})")
 pg=c.new_page();pg.goto(BASE);expect(pg.locator('#storage-warning')).to_be_visible();pg.locator('#trip-memo').fill('保存テスト');expect(pg.locator('#memo-status')).to_contain_text('保存できません')
 c.close();browser.close()
 print('PASS: desktop/mobile 320–1440px, tabs + keyboard, place filters + deep links, local persistence + export, Japan-time scenarios, offline reload + images, cross-trip cache preservation, no-JS fallback, blocked storage; no runtime errors.')

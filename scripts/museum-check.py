"""Meaningful browser checks for source-linked reading, discovery and offline access."""
from playwright.sync_api import sync_playwright,expect
import sys

BASE=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:4173/'
with sync_playwright() as p:
 browser=p.chromium.launch()
 context=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
 page=context.new_page();errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
 page.goto(BASE+'museum.html',wait_until='networkidle')
 expect(page.locator('.museum-exhibit')).to_have_count(8)
 expect(page.locator('.exhibit-reading[open]')).to_have_count(0)
 expect(page.locator('.museum-quiz[open]')).to_have_count(0)
 for day,count in [('1',4),('2',4),('3',3),('all',8)]:
  page.locator(f'[data-museum-filter="{day}"]').click()
  expect(page.locator('.museum-exhibit:visible')).to_have_count(count)
 page.locator('[data-museum-filter="3"]').click()
 page.locator('#museum-surprise').click()
 selected=page.locator('.museum-exhibit:has(.exhibit-reading[open])')
 expect(selected).to_have_count(1)
 assert '3' in selected.get_attribute('data-museum-days').split()
 expect(selected.locator('.exhibit-reading>summary')).to_be_focused()
 # An anchor for a filtered-out room reveals its content; opening a quiz is keyboard accessible.
 page.evaluate("location.hash='#exhibit-weaving'")
 expect(page.locator('#exhibit-weaving')).to_be_visible()
 expect(page.locator('#exhibit-weaving .exhibit-reading')).to_have_attribute('open','')
 quiz=page.locator('#exhibit-weaving .museum-quiz>summary');quiz.focus();quiz.press('Enter')
 expect(page.locator('#exhibit-weaving .quiz-answer')).to_contain_text('B · 太い糸')
 # The source URLs are shown with the facts, and a return link opens practical information.
 assert page.locator('#exhibit-weaving .museum-citation').first.get_attribute('href').startswith('https://')
 page.locator('#exhibit-weaving .exhibit-links a').click()
 expect(page.locator('#place-weaving details')).to_have_attribute('open','')
 page.locator('#trip-memo').fill('資料館の発見：織物と羽二重餅。')
 page.goto(BASE+'museum.html#exhibit-ichijo',wait_until='networkidle')
 expect(page.locator('#exhibit-ichijo .exhibit-reading')).to_have_attribute('open','')
 expect(page.locator('#exhibit-ichijo')).to_be_in_viewport()
 # Print all rooms and answers, then restore the filter and individual disclosure states.
 page.locator('[data-museum-filter="2"]').click()
 page.evaluate("window.dispatchEvent(new Event('beforeprint'))")
 expect(page.locator('.museum-exhibit:visible')).to_have_count(8)
 assert page.locator('details:not([open])').count()==0
 page.evaluate("window.dispatchEvent(new Event('afterprint'))")
 expect(page.locator('.museum-exhibit:visible')).to_have_count(4)
 expect(page.locator('.museum-quiz[open]')).to_have_count(0)
 # Responsive layouts preserve access to the content.
 for width in [320,390,768,1440]:
  page.set_viewport_size({'width':width,'height':900})
  assert not page.evaluate('document.documentElement.scrollWidth>innerWidth'),f'Museum overflow at {width}'
 page.set_viewport_size({'width':390,'height':844})
 # Changing a sticky filter from the end of the collection returns to the first result.
 page.evaluate('scrollTo(0,document.documentElement.scrollHeight)')
 page.locator('[data-museum-filter="1"]').click()
 expect(page.locator('.museum-exhibit:visible').first).to_be_in_viewport()
 assert page.locator('#museum-count').evaluate("el=>getComputedStyle(el).display!=='none'")
 page.locator('[data-museum-filter="all"]').click()
 for image in page.locator('img').all():
  image.scroll_into_view_if_needed()
  expect(image).to_have_js_property('complete',True)
  assert image.evaluate('(img)=>img.naturalWidth>0')
 # A visit to the guide preloads the separate museum and its image for offline navigation.
 page.goto(BASE,wait_until='networkidle');page.evaluate('navigator.serviceWorker.ready')
 page.reload(wait_until='networkidle')
 assert page.evaluate('navigator.serviceWorker.controller !== null')
 for asset in ['museum.html','museum.css','museum.js','assets/museum-cabinet.webp']:
  assert page.evaluate('(asset)=>caches.match(asset).then(Boolean)',asset)
 context.set_offline(True)
 page.locator('.museum-invitation').click()
 expect(page.locator('h1')).to_contain_text('小さな資料館')
 page.locator('[data-museum-filter="3"]').click()
 page.locator('#exhibit-ichijo .museum-quiz>summary').click()
 expect(page.locator('#exhibit-ichijo .quiz-answer')).to_contain_text('60cm')
 page.reload(wait_until='networkidle')
 page.locator('#museum-surprise').click()
 expect(page.locator('.exhibit-reading[open]')).to_have_count(1)
 page.locator('.museum-header .museum-back').click()
 expect(page.locator('#trip-memo')).to_have_value('資料館の発見：織物と羽二重餅。')
 assert not errors,errors
 context.close()
 # No script is required for reading the complete collection and quiz answers.
 context=browser.new_context(java_script_enabled=False,service_workers='block')
 page=context.new_page();page.goto(BASE+'museum.html')
 expect(page.locator('.museum-exhibit:visible')).to_have_count(8)
 expect(page.locator('.museum-toolbar')).to_be_hidden()
 page.locator('#exhibit-onsen .exhibit-reading>summary').click()
 expect(page.locator('#exhibit-onsen .museum-fact')).to_have_count(4)
 page.locator('#exhibit-onsen .museum-quiz>summary').click()
 expect(page.locator('#exhibit-onsen .quiz-answer')).to_contain_text('田んぼに使う水')
 context.close();browser.close()
 print('PASS: 8 rooms, day filters, discovery, source links, keyboard quiz, deep links, itinerary return, print restoration, 320–1440px, offline navigation/images/reading, unchanged trip memo, no-JS reading; no runtime errors.')

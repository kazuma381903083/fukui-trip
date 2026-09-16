"""A single contextual answer, without adding another section to the guide."""
from pathlib import Path
import html,json
from visual import icon

ROOT=Path(__file__).resolve().parent.parent
esc=html.escape

def make_field_help():
    data=json.loads((ROOT/'data/field-help.json').read_text())
    scenarios=[('drive','car-front','車・駐車'),('pace','droplets','雨・遅れ'),('comfort','backpack','現地のコツ')]
    buttons=''.join(f'<button type="button" data-help-scene="{key}" aria-pressed="{str(key=="drive").lower()}">{icon(symbol)}{label}</button>' for key,symbol,label in scenarios)
    days=''.join(f'<button type="button" data-help-day="{day}" aria-pressed="{str(day==1).lower()}"><span>DAY 0{day}</span>9.{20+day}</button>' for day in (1,2,3))
    panels=''
    for answer in data['answers']:
        external=' target="_blank" rel="noopener noreferrer"' if answer['href'].startswith('https://') else ''
        source_external=' target="_blank" rel="noopener noreferrer"' if answer['sourceURL'].startswith('https://') else ''
        heading=f'field-title-{answer["day"]}-{answer["scene"]}'
        panels+=f'''<article class="field-answer" data-answer-day="{answer['day']}" data-answer-scene="{answer['scene']}" aria-labelledby="{heading}" hidden><p class="eyebrow">JUST ONE THING / DAY 0{answer['day']}</p><h3 id="{heading}">{esc(answer['title'])}</h3><p class="field-answer-copy">{esc(answer['text'])}</p><div class="field-anchor">{icon('clock')}<p><strong>{esc(answer['anchor'])}</strong><small>{esc(answer['note'])}</small></p></div><a class="field-action" href="{esc(answer['href'])}"{external}>{esc(answer['action'])} ↗</a><p class="field-source"><a href="{esc(answer['sourceURL'])}"{source_external}>出典：{esc(answer['sourceTitle'])} ↗</a></p></article>'''
    return f'''<dialog id="field-help" class="field-help" aria-labelledby="field-help-title"><div class="field-help-heading"><div><p class="eyebrow">YOUR LITTLE TRAVEL DESK</p><h2 id="field-help-title">現地で、サッと。</h2></div><button id="field-help-close" type="button" aria-label="現地のヒントを閉じる" autofocus>×</button></div><div class="field-days" role="group" aria-label="ヒントの日程">{days}</div><div class="field-scenes" role="group" aria-label="知りたい場面">{buttons}</div><div class="field-answers">{panels}</div><p id="field-answer-status" class="sr-only" role="status"></p><footer class="field-footer"><span>公式情報確認 {esc(data['checkedAt'])}</span><a href="#rain-plan">対応一覧へ ↗</a></footer></dialog>'''

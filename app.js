'use strict';
(() => {
  const data = window.TRIP;
  const $ = (s, parent = document) => parent.querySelector(s);
  const $$ = (s, parent = document) => [...parent.querySelectorAll(s)];
  const key = 'fukui-trip-2026-v1';
  let state = { checks: {}, memo: '' };
  let storageOK = true;
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || 'null');
    if (parsed && typeof parsed === 'object') {
      if (parsed.checks && typeof parsed.checks === 'object') state.checks = parsed.checks;
      if (typeof parsed.memo === 'string') state.memo = parsed.memo;
    }
    localStorage.setItem(key, JSON.stringify(state));
  } catch (_) { storageOK = false; }
  const showStorage = () => { $('#storage-warning').hidden = storageOK; };
  const save = () => {
    try { localStorage.setItem(key, JSON.stringify(state)); storageOK = true; }
    catch (_) { storageOK = false; }
    showStorage();
    return storageOK;
  };
  showStorage();
  const japanDate = now => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const jpToday = japanDate(new Date());
  const travelDay = data.days.find(d => d.date === jpToday);
  const dayFromHash = /^#day-([123])$/.exec(location.hash);
  let selected = dayFromHash ? Number(dayFromHash[1]) : travelDay ? travelDay.n : 1;
  $('.day-tabs').setAttribute('role', 'tablist');
  const tabs = $$('.day-tab');
  tabs.forEach(tab => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `day-${tab.dataset.day}`);
  });
  $$('.day-panel').forEach(panel => { panel.setAttribute('role', 'tabpanel'); });
  function selectDay(n, animate = true) {
    selected = n;
    const update = () => {
      tabs.forEach(tab => { const on = Number(tab.dataset.day) === n; tab.setAttribute('aria-selected', String(on)); tab.tabIndex = on ? 0 : -1; });
      $$('.day-panel').forEach(panel => { panel.hidden = panel.id !== `day-${n}`; });
      $('#pocket-discovery').href = `#discovery-${n}`;
    };
    if (animate && document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(update);
    else update();
  }
  selectDay(selected, false);
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', event => { event.preventDefault(); selectDay(Number(tab.dataset.day)); history.replaceState(null, '', `#day-${selected}`); });
    tab.addEventListener('keydown', event => {
      let next = null;
      if (event.key === 'ArrowRight') next = (i + 1) % 3;
      if (event.key === 'ArrowLeft') next = (i + 2) % 3;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = 2;
      if (event.key === ' ') { event.preventDefault(); tab.click(); return; }
      if (next !== null) { event.preventDefault(); tabs[next].focus(); tabs[next].click(); }
    });
  });
  function filterPlaces(day) {
    $$('.place-filters button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === day)));
    $$('.place-card').forEach(card => { card.hidden = day !== 'all' && card.dataset.placeDay !== day; });
  }
  $$('.place-filters button').forEach(button => button.addEventListener('click', () => { $('#place-directory').open = true; filterPlaces(button.dataset.filter); }));
  function openParents(element) {
    for (let parent = element?.parentElement; parent; parent = parent.parentElement) {
      if (parent.tagName === 'DETAILS') parent.open = true;
    }
  }
  function revealHash(hash) {
    const target = document.getElementById(hash.slice(1));
    if (target) {
      openParents(target);
      if (target.tagName === 'DETAILS') target.open = true;
      const panel = target.closest('.day-panel');
      if (panel) selectDay(Number(panel.id.slice(-1)), false);
    }
    const day = /^#day-([123])$/.exec(hash);
    if (day) selectDay(Number(day[1]), false);
    if (hash.startsWith('#place-')) {
      const card = document.getElementById(hash.slice(1));
      if (card) { openParents(card); filterPlaces('all'); $('details', card).open = true; }
    }
  }
  // Reveal filtered-out destinations before the browser performs its anchor scroll.
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (anchor && !anchor.matches('.day-tab')) revealHash(anchor.getAttribute('href'));
  });
  window.addEventListener('hashchange', () => revealHash(location.hash));
  revealHash(location.hash);
  function updateNow() {
    const now = new Date();
    const today = japanDate(now);
    const day = data.days.find(d => d.date === today);
    const nextFixed = data.days.flatMap(d => d.events.filter(e => e.fixed && e.at && new Date(e.at) > now).map(e => ({...e,day:d})))[0];
    const fixedLink = $('#now-fixed');
    fixedLink.hidden = !day || !nextFixed;
    if (day && nextFixed) {
      fixedLink.href = `#schedule-${nextFixed.day.n}`;
      $('span',fixedLink).textContent = `${nextFixed.day.n !== day.n ? nextFixed.day.short + ' ' : ''}${nextFixed.time} ${nextFixed.title} ↗`;
    }
    if (today < data.days[0].date) {
      const count = Math.ceil((new Date('2026-09-21T00:00:00+09:00') - new Date(today + 'T00:00:00+09:00')) / 86400000);
      $('#now-heading').textContent = `出発まで、あと${count}日`;
      return;
    }
    if (!day) {
      $('#journey-state').textContent = 'AFTER THE JOURNEY';
      $('#now-heading').textContent = '三日間の旅の記録';
      $('#now-kicker').textContent = '2026.09.21 — 09.23';
      $('#now-title').textContent = 'ふたりで過ごした福井を、もう一度。';
      $('#now-note').textContent = '旅程やメモは、このまま振り返れます。';
      return;
    }
    $('#journey-state').textContent = `DAY 0${day.n} · ${day.short}`;
    $('#now-heading').textContent = 'いま見るしおり';
    const next = day.events.find(event => event.at && new Date(event.at) > now);
    const link = $('#now-link');
    if (next) {
      $('#now-kicker').textContent = '次の予定 · 時刻表から表示';
      $('#now-title').textContent = `${next.time} ${next.title}`;
      $('#now-note').textContent = next.note;
      const place = data.places.find(p => p.id === next.place);
      if (place) { link.href = place.directions; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.innerHTML = '経路へ <span>↗</span>'; }
      else { link.href = `#day-${day.n}`; link.removeAttribute('target'); link.innerHTML = '旅程へ <span>↗</span>'; }
    } else {
      $('#now-kicker').textContent = 'このあとの過ごし方';
      $('#now-title').textContent = day.n === 3 ? 'おかえりなさい。' : '今日の続きは、ゆっくりと。';
      $('#now-note').textContent = day.n === 1 ? '夕食の開始時刻は宿で確認。温泉と会席を楽しんで。' : day.n === 2 ? '煙やから徒歩でホテルへ。明日の09:00出発に備えて。' : '気に入った味や景色を、メモに残しておきましょう。';
      link.href = `#day-${day.n}`; link.removeAttribute('target'); link.innerHTML = '旅程へ <span>↗</span>';
    }
  }
  updateNow();
  setInterval(updateNow, 60000);
  function progress() {
    const inputs = $$('[data-check]');
    const done = inputs.filter(input => input.checked).length;
    $('#check-progress').textContent = `${done} / ${inputs.length} 完了`;
  }
  $$('[data-check]').forEach(input => {
    input.checked = state.checks[input.dataset.check] === true;
    input.addEventListener('change', () => { state.checks[input.dataset.check] = input.checked; save(); progress(); });
  });
  progress();
  $('#trip-memo').value = state.memo;
  $('#trip-memo').addEventListener('input', event => {
    state.memo = event.target.value;
    $('#memo-status').textContent = save() ? 'この端末に保存しました' : '保存できません。書き出して保管してください。';
  });
  $('#export-memo').addEventListener('click', () => {
    const checks = $$('[data-check]').map(input => `${input.checked ? '☑' : '☐'} ${input.parentElement.innerText.trim().replace(/\n+/g, ' / ')}`).join('\n');
    const content = `ふくい、余白の三日間。\n2026.09.21–09.23\n\n準備チェック\n${checks}\n\n旅のメモ\n${state.memo}\n`;
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'ふくい旅のメモ.txt'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  let printState;
  function beforePrint() {
    printState = { details: $$('details').map(d => d.open), hidden: $$('[hidden]') };
    $$('details').forEach(d => { d.open = true; });
    $$('.place-card,.day-panel').forEach(el => { el.hidden = false; });
  }
  function afterPrint() {
    if (!printState) return;
    $$('details').forEach((d, i) => { d.open = printState.details[i]; });
    printState.hidden.forEach(el => { el.hidden = true; });
    selectDay(selected, false);
    printState = null;
  }
  window.addEventListener('beforeprint', beforePrint);
  window.addEventListener('afterprint', afterPrint);
  $('#print-guide').addEventListener('click', () => window.print());
  if ('IntersectionObserver' in window) {
    const links = $$('.mobile-nav a');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) links.forEach(a => a.classList.toggle('active', a.hash === `#${entry.target.id}`)); });
    }, { rootMargin: '-5% 0px -65% 0px', threshold: 0 });
    ['now', 'journey', 'route', 'preparation'].forEach(id => observer.observe(document.getElementById(id)));
  }
  let installPrompt;
  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); installPrompt = event; $('#install-app').hidden = false; });
  $('#install-app').addEventListener('click', async () => { if (!installPrompt) return; await installPrompt.prompt(); installPrompt = null; $('#install-app').hidden = true; });
  if ('serviceWorker' in navigator && window.isSecureContext) {
    navigator.serviceWorker.register('./sw.js').then(async () => {
      await navigator.serviceWorker.ready;
      const cacheNames = await caches.keys();
      $('#offline-status').textContent = cacheNames.some(n => n.startsWith('fukui-trip-2026-')) ? 'しおりのオフライン保存が完了しています。' : '保存を進めています。オンラインのまま少しお待ちください。';
    }).catch(() => { $('#offline-status').textContent = 'オフライン保存ができませんでした。通信を確認してページを再読み込みしてください。'; });
  } else {
    $('#offline-status').textContent = 'この表示環境ではオフライン保存を利用できません。HTTPSの公開ページでご利用ください。';
  }
})();

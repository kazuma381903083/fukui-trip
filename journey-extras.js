'use strict';
(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const data = window.TRIP.map;
  const nodes = new Map(data.nodes.map(node => [node.id, node]));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const nodeButtons = $$('.map-point');
  const mapTool = $('.map-tool');
  const traveler = $('#map-traveler');
  let selectedDay = null;
  let currentLocation = null;
  let previewIndex = -1;
  let playing = false;
  let completed = false;
  let timer = null;
  let frame = null;
  let segmentProgress = 0;

  function cancelClock() { clearTimeout(timer); cancelAnimationFrame(frame); timer = frame = null; }
  function playLabel(text) {
    $('#map-play-label').textContent = text;
    $('#map-play').setAttribute('aria-pressed', String(playing));
    $('.play-symbol').textContent = playing ? 'Ⅱ' : '▶';
    const next = $('#map-next');
    const hideNext = !playing || !motion.matches;
    const restoreFocus = hideNext && document.activeElement === next;
    next.hidden = hideNext;
    if (restoreFocus) $('#map-play').focus({preventScroll:true});
  }
  function pausePreview() {
    if (!playing) return;
    cancelClock(); playing = false;
    playLabel('つづきから');
    $('#map-play-status').textContent = 'ひと休み。続きは、いつでも。';
  }
  function resetPreview() {
    cancelClock(); playing = false; completed = false; previewIndex = -1; segmentProgress = 0;
    mapTool.classList.remove('is-playing');
    $$('.map-route.is-traveled').forEach(route => route.classList.remove('is-traveled'));
    traveler.setAttribute('visibility', 'hidden');
    playLabel(motion.matches ? '一つずつたどる' : '旅をたどる');
  }
  function chooseLocation(id, options = {}) {
    const node = nodes.get(id);
    if (!node) return;
    if (!options.preview) resetPreview();
    currentLocation = id;
    nodeButtons.forEach(point => {
      const selected = point.dataset.mapNode === id;
      point.classList.toggle('is-selected', selected);
      point.setAttribute('aria-expanded', String(selected));
    });
    $$('.map-stop-button').forEach(button => {
      const active = options.index === undefined ? button.dataset.stopId === id : Number(button.dataset.stopIndex) === options.index;
      button.setAttribute('aria-current', String(active));
    });
    const card = $('#map-selection');
    card.hidden = false; mapTool.classList.add('has-selection');
    card.classList.toggle('is-illustrated', !node.photo);
    $('#map-location-name').textContent = node.name;
    $('#map-location-note').textContent = node.description;
    $('#map-location-tease').textContent = node.tease;
    $('#map-location-link').href = `#place-${node.place}`;
    $('#map-location-image').src = `assets/${node.photo || 'dinosaur-traveler.webp'}`;
    $('#map-location-image').alt = node.photo ? `${node.label}の風景` : '';
    if (!options.preview) {
      $('#map-play-status').textContent = `${node.label}を発見。`;
      if (!motion.matches) card.animate([{opacity:.4,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}], {duration:260,easing:'ease-out'});
      // Keep a selected card visible on small screens without taking keyboard focus.
      if (options.reveal && matchMedia('(max-width:900px)').matches) card.scrollIntoView({block:'nearest',behavior:'instant'});
    }
  }
  function renderMap(value) {
    resetPreview();
    selectedDay = data.days.find(day => String(day.n) === value) || null;
    const selected = selectedDay;
    currentLocation = null;
    $$('.map-filters button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mapDay === value)));
    $$('.map-route-day').forEach(route => route.classList.toggle('is-muted', !!selected && String(selected.n) !== route.dataset.mapRoute));
    mapTool.style.setProperty('--active-route', selected ? selected.color : '#173f40');
    mapTool.classList.toggle('single-day', !!selected);
    mapTool.classList.remove('has-selection');
    nodeButtons.forEach(point => {
      const id = point.dataset.mapNode;
      const index = selected ? selected.nodes.indexOf(id) : -1;
      point.classList.toggle('is-muted', !!selected && index === -1);
      point.classList.remove('is-selected');
      point.setAttribute('aria-expanded', 'false');
      point.querySelector('.map-pin-number').textContent = index === -1 ? '·' : selected.nodes.map((nodeId,i) => nodeId === id ? i+1 : null).filter(Boolean).join('/');
    });
    $('#map-selection').hidden = true;
    $('#map-play-status').textContent = selected ? `Day ${selected.n}の道すじを、ひと足先に。` : 'Day 1から、ひと足先に。';
    const itinerary = $('#map-itinerary');
    itinerary.replaceChildren();
    if (selected) {
      $('#map-story-kicker').textContent = `DAY 0${selected.n} / ${window.TRIP.days[selected.n - 1].short}`;
      $('#map-story-title').textContent = ['太古と、湯けむり。','海から、永平寺へ。','一乗谷から、帰り道。'][selected.n - 1];
      $('#map-story-note').textContent = selected.note;
      $('#map-finish').textContent = selected.finish;
      selected.nodes.forEach((id, i) => {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'map-stop-button';
        button.dataset.stopId = id; button.dataset.stopIndex = String(i);
        button.setAttribute('aria-current', 'false');
        const number = document.createElement('span'); number.textContent = String(i + 1).padStart(2, '0');
        const label = document.createElement('span'); label.textContent = nodes.get(id).name + (selected.n === 3 && i === 2 ? '（帰着）' : '');
        button.append(number, label);
        button.addEventListener('click', () => chooseLocation(id, {index:i,reveal:true}));
        itinerary.append(button);
      });
    } else {
      $('#map-story-kicker').textContent = '3 DAYS / ひとめぐり';
      $('#map-story-title').textContent = '海へ、里へ。';
      $('#map-story-note').textContent = '地点を押すと、案内がひらきます。';
      $('#map-finish').textContent = '東京 ↔ 福井は北陸新幹線。県内はレンタカー、夜の福井市内は徒歩で。';
      data.days.forEach(day => {
        const button = document.createElement('button'); button.type = 'button'; button.className = 'map-day-overview'; button.style.setProperty('--route-color', day.color);
        const number = document.createElement('strong'); number.textContent = `0${day.n}`;
        const label = document.createElement('span'); label.textContent = day.short;
        button.setAttribute('aria-label', `Day ${day.n}：${day.short}の地図`);
        button.append(number, label); button.addEventListener('click', () => renderMap(String(day.n))); itinerary.append(button);
      });
    }
  }
  function moveTraveler(id) {
    const pin = nodeButtons.find(point => point.dataset.mapNode === id).querySelector('.map-pin');
    traveler.setAttribute('transform', `translate(${pin.getAttribute('cx')} ${pin.getAttribute('cy')})`);
    traveler.setAttribute('visibility', 'visible');
  }
  function arrive(index) {
    if (!playing) return;
    previewIndex = index;
    segmentProgress = 0;
    const id = selectedDay.nodes[index];
    chooseLocation(id, {preview:true,index}); moveTraveler(id);
    $$('.map-route-day:not(.is-muted) .map-route').forEach(route => route.classList.toggle('is-traveled', Number(route.dataset.mapSegment) < index));
    $('#map-play-status').textContent = `Day ${selectedDay.n} · ${index + 1}/${selectedDay.nodes.length} · ${nodes.get(id).label}${selectedDay.n === 3 && index === 2 ? 'に帰着' : ''}`;
    if (index === selectedDay.nodes.length - 1) {
      playing = false; completed = true; playLabel('もう一度たどる');
      return;
    }
    if (!motion.matches) timer = setTimeout(advance, 2300);
  }
  function advance() {
    if (!playing) return;
    const next = previewIndex + 1;
    if (next >= selectedDay.nodes.length) return;
    if (motion.matches) { arrive(next); return; }
    const path = $(`.map-route-day[data-map-route="${selectedDay.n}"] [data-map-segment="${previewIndex}"]`);
    const length = path.getTotalLength();
    let started;
    const travel = now => {
      if (!playing) return;
      started ??= now - segmentProgress * 950;
      const progress = Math.min(1, (now - started) / 950);
      segmentProgress = progress;
      const point = path.getPointAtLength(length * progress);
      traveler.setAttribute('transform', `translate(${point.x} ${point.y})`);
      if (progress < 1) frame = requestAnimationFrame(travel);
      else arrive(next);
    };
    frame = requestAnimationFrame(travel);
  }
  $('#map-play').addEventListener('click', () => {
    if (playing) { pausePreview(); return; }
    if (!selectedDay) renderMap('1');
    if (completed) resetPreview();
    playing = true; mapTool.classList.add('is-playing');
    playLabel(motion.matches ? 'ここで止める' : 'ひと休み');
    if (previewIndex < 0) arrive(0);
    else if (!motion.matches) advance();
  });
  $('#map-next').addEventListener('click', advance);
  $$('.map-filters button').forEach(button => button.addEventListener('click', () => renderMap(button.dataset.mapDay)));
  nodeButtons.forEach(point => {
    point.setAttribute('role', 'button'); point.setAttribute('aria-controls', 'map-selection');
    point.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); chooseLocation(point.dataset.mapNode,{reveal:true}); });
    point.addEventListener('keydown', event => { if (event.key === ' ') { event.preventDefault(); event.stopPropagation(); chooseLocation(point.dataset.mapNode,{reveal:true}); } });
  });
  let discoveryBag = [];
  $('#map-surprise').addEventListener('click', () => {
    if (!discoveryBag.length) discoveryBag = data.nodes.filter(node => node.stamp && node.id !== currentLocation).map(node => node.id).sort(() => Math.random() - .5);
    const id = discoveryBag.pop(); renderMap('all'); chooseLocation(id,{reveal:true});
    $('.mascot-desktop').textContent = 'ここ、気になる！ ↗';
    $('.mascot-mobile').textContent = 'ここへ！';
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pausePreview(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { if (!entries[0].isIntersecting) pausePreview(); }).observe(mapTool);
  motion.addEventListener('change', () => { pausePreview(); if (previewIndex < 0) resetPreview(); });
  renderMap('all');
  $('#map-zoom').addEventListener('click', () => {
    const zoomed = $('.map-surface').classList.toggle('is-zoomed');
    $('#map-zoom').setAttribute('aria-pressed', String(zoomed));
    $('#map-zoom').textContent = zoomed ? '地図全体に戻す −' : '地図を拡大 ＋';
    if (!zoomed) $('.map-surface').scrollLeft = 0;
  });

  const stampKey = 'fukui-trip-2026-stamps';
  let stamps = {};
  let canSave = true;
  try { const value = JSON.parse(localStorage.getItem(stampKey) || '{}'); if (value && typeof value === 'object' && !Array.isArray(value)) stamps = value; }
  catch (_) { canSave = false; }
  const stampButtons = $$('.travel-stamp');
  function renderStamps(message) {
    let count = 0;
    stampButtons.forEach(button => {
      const pressed = stamps[button.dataset.stamp] === true;
      button.setAttribute('aria-pressed', String(pressed));
      button.querySelector('.stamp-action').textContent = pressed ? '思い出になった！' : 'ぽん、と押す';
      button.setAttribute('aria-label', `${button.querySelector('.stamp-word').textContent}のスタンプを${pressed ? '取り消す' : '押す'}`);
      if (pressed) count++;
    });
    nodeButtons.forEach(point => point.classList.toggle('is-visited', stamps[nodes.get(point.dataset.mapNode).stamp] === true));
    $('.stamp-section').classList.toggle('is-complete', count === 6);
    $('#stamp-keepsake').hidden = count !== 6;
    $('#stamp-count').textContent = `${count} / 6`;
    $('#stamp-message').textContent = !canSave ? 'このブラウザでは保存できません。スタンプはページを閉じると失われます。' : count === 6 ? '六つそろった！ ふたりだけの福井の思い出。' : message || (count ? `${count}個の思い出が、この一冊に。` : 'まだ白紙のスタンプ帳。どこから思い出が増えるかな。');
    return count;
  }
  function celebrate(button, complete) {
    if (motion.matches) return;
    button.animate([{transform:'rotate(-12deg) scale(1.16)'},{transform:'rotate(-5deg) scale(.95)'},{transform:'rotate(-5deg) scale(1)'}],{duration:360,easing:'cubic-bezier(.2,.8,.2,1)'});
    const rect = button.getBoundingClientRect();
    const colors = ['#c17d46','#426f57','#d5b965','#7ca6a0'];
    for (let i = 0; i < (complete ? 34 : 12); i++) {
      const particle = document.createElement('i'); particle.className = 'stamp-confetti'; particle.setAttribute('aria-hidden','true');
      particle.style.left = `${rect.left + rect.width / 2}px`; particle.style.top = `${rect.top + rect.height / 2}px`; particle.style.background = colors[i % colors.length];
      document.body.append(particle);
      const angle = Math.random() * Math.PI * 2;
      const distance = (complete ? 150 : 65) * (.6 + Math.random());
      const x = Math.cos(angle) * distance, y = Math.sin(angle) * distance;
      const animation = particle.animate([{transform:'translate(0,0) rotate(0)',opacity:1},{transform:`translate(${x}px,${y}px) rotate(${i * 43}deg)`,opacity:.9,offset:.65},{transform:`translate(${x * 1.15}px,${y + 35}px) rotate(${i * 61}deg)`,opacity:0}],{duration:complete ? 1100 : 720,easing:'cubic-bezier(.15,.5,.3,1)'});
      animation.finished.then(() => particle.remove(), () => particle.remove());
    }
  }
  stampButtons.forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.stamp; stamps[id] = stamps[id] !== true;
    try { localStorage.setItem(stampKey, JSON.stringify(stamps)); canSave = true; } catch (_) { canSave = false; }
    const count = renderStamps(stamps[id] ? `「${button.querySelector('.stamp-word').textContent}」のしるしを、ぽん。` : 'スタンプを取り消しました。');
    if (stamps[id]) celebrate(button, count === 6);
  }));
  renderStamps();
})();

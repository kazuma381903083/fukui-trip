'use strict';
(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const data = window.TRIP.map;
  const nodes = new Map(data.nodes.map(node => [node.id, node]));

  const nodeButtons = $$('.map-point');
  function chooseLocation(id) {
    const node = nodes.get(id);
    if (!node) return;
    nodeButtons.forEach(point => point.classList.toggle('is-selected', point.dataset.mapNode === id));
    $('#map-selection').hidden = false;
    $('#map-location-name').textContent = node.name;
    $('#map-location-note').textContent = node.description;
    $('#map-location-link').href = `#place-${node.place}`;
    // Announce the selection without moving keyboard focus out of the map.
    $('#map-selection').setAttribute('role', 'status');
  }
  function renderMap(value) {
    const selected = data.days.find(d => String(d.n) === value);
    $$('.map-filters button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mapDay === value)));
    $$('.map-route-day').forEach(route => { route.classList.toggle('is-muted', !!selected && String(selected.n) !== route.dataset.mapRoute); });
    $('.map-tool').style.setProperty('--active-route', selected ? selected.color : '#173f40');
    $('.map-tool').classList.toggle('single-day', !!selected);
    nodeButtons.forEach(point => {
      const index = selected ? selected.nodes.indexOf(point.dataset.mapNode) : -1;
      const muted = !!selected && index === -1;
      point.classList.toggle('is-muted', muted);
      point.classList.remove('is-selected');
      point.querySelector('.map-pin-number').textContent = index === -1 ? '·' : selected.nodes.map((id,i) => id === point.dataset.mapNode ? i+1 : null).filter(Boolean).join('/');
    });
    $('#map-selection').hidden = true;
    const itinerary = $('#map-itinerary');
    itinerary.replaceChildren();
    if (selected) {
      $('#map-story-kicker').textContent = `DAY 0${selected.n} / ${window.TRIP.days[selected.n - 1].short}`;
      $('#map-story-title').textContent = selected.title;
      $('#map-story-note').textContent = selected.note;
      $('#map-finish').textContent = selected.finish;
      selected.nodes.forEach((id, i) => {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'map-stop-button';
        const number = document.createElement('span');number.textContent = String(i + 1).padStart(2, '0');
        const label = document.createElement('span');label.textContent = nodes.get(id).name + (selected.n === 3 && i === 2 ? '（帰着）' : '');
        button.append(number, label);button.addEventListener('click', () => chooseLocation(id));
        itinerary.append(button);
      });
    } else {
      $('#map-story-kicker').textContent = '3 DAYS / ひとめぐり';
      $('#map-story-title').textContent = '北へ、東へ。ふたりの福井を結ぶ。';
      $('#map-story-note').textContent = '日付を選ぶと、その日の移動を表示します。地図の地点を押して、旅先の案内を開いてみて。';
      $('#map-finish').textContent = '東京 ↔ 福井は北陸新幹線。県内はレンタカー、夜の福井市内は徒歩で。';
      data.days.forEach(d => {
        const button = document.createElement('button');button.type='button';button.className='map-day-overview';button.style.setProperty('--route-color',d.color);
        const label = document.createElement('strong');label.textContent=`DAY 0${d.n}`;
        const text = document.createElement('span');text.textContent=d.short;
        button.append(label,text);button.addEventListener('click',()=>renderMap(String(d.n)));itinerary.append(button);
      });
    }
  }
  $$('.map-filters button').forEach(button => button.addEventListener('click', () => renderMap(button.dataset.mapDay)));
  nodeButtons.forEach(point => point.addEventListener('click', event => { event.preventDefault();event.stopPropagation();chooseLocation(point.dataset.mapNode); }));
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
    $('#stamp-count').textContent = `${count} / 6`;
    $('#stamp-message').textContent = !canSave ? 'このブラウザでは保存できません。スタンプはページを閉じると失われます。' : count === 6 ? '六つそろった！ ふたりだけの福井の思い出。' : message || (count ? `${count}個の思い出が、この一冊に。` : 'まだ白紙のスタンプ帳。どこから思い出が増えるかな。');
  }
  stampButtons.forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.stamp; stamps[id] = stamps[id] !== true;
    try { localStorage.setItem(stampKey, JSON.stringify(stamps));canSave = true; } catch (_) { canSave = false; }
    if (stamps[id] && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      button.animate([{transform:'rotate(-12deg) scale(1.16)'},{transform:'rotate(-5deg) scale(.95)'},{transform:'rotate(-5deg) scale(1)'}],{duration:360,easing:'cubic-bezier(.2,.8,.2,1)'});
    }
    renderStamps(stamps[id] ? `「${button.querySelector('.stamp-word').textContent}」のしるしを、ぽん。` : 'スタンプを取り消しました。');
  }));
  renderStamps();
})();

'use strict';
(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const exhibits = $$('.museum-exhibit');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let filter = 'all';
  let lastDiscovery = null;
  function setFilter(value) {
    filter = value;
    $$('.museum-filters button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.museumFilter === value)));
    exhibits.forEach(exhibit => { exhibit.hidden = value !== 'all' && !exhibit.dataset.museumDays.split(' ').includes(value); });
    $('#museum-count').textContent = `${exhibits.filter(exhibit => !exhibit.hidden).length}つの展示`;
  }
  function revealExhibit(hash, focus = false) {
    const exhibit = exhibits.find(item => `#${item.id}` === hash);
    if (!exhibit) return;
    if (exhibit.hidden) setFilter('all');
    const reading = exhibit.querySelector('.exhibit-reading');
    reading.open = true;
    if (focus) reading.querySelector('summary').focus({preventScroll:true});
    exhibit.scrollIntoView({block:'start',behavior:focus && !motion.matches ? 'smooth' : 'instant'});
  }
  $('.museum-toolbar').hidden = false;
  $('#museum-surprise').hidden = false;
  $('#museum-print').hidden = false;
  $$('.museum-filters button').forEach(button => button.addEventListener('click', () => {
    setFilter(button.dataset.museumFilter);
    exhibits.find(exhibit => !exhibit.hidden)?.scrollIntoView({block:'start',behavior:motion.matches ? 'instant' : 'smooth'});
  }));
  $('#museum-surprise').addEventListener('click', () => {
    let choices = exhibits.filter(exhibit => !exhibit.hidden && exhibit !== lastDiscovery);
    if (!choices.length) choices = exhibits.filter(exhibit => !exhibit.hidden);
    lastDiscovery = choices[Math.floor(Math.random() * choices.length)];
    history.replaceState(null, '', `#${lastDiscovery.id}`);
    revealExhibit(location.hash, true);
  });
  window.addEventListener('hashchange', () => revealExhibit(location.hash));
  revealExhibit(location.hash);
  $$('.museum-quiz').forEach(quiz => quiz.addEventListener('toggle', () => {
    quiz.querySelector('.quiz-invitation').firstChild.textContent = quiz.open ? '答えを閉じる ' : '答えをひらく ';
    if (quiz.open && !motion.matches && !printState) quiz.querySelector('.quiz-answer').animate([{opacity:.3,transform:'translateY(-5px)'},{opacity:1,transform:'translateY(0)'}],{duration:250,easing:'ease-out'});
  }));
  let printState;
  window.addEventListener('beforeprint', () => {
    if (printState) return;
    printState = {filter,details:$$('details').map(item => item.open)};
    exhibits.forEach(exhibit => { exhibit.hidden = false; });
    $$('details').forEach(item => { item.open = true; });
  });
  window.addEventListener('afterprint', () => {
    if (!printState) return;
    $$('details').forEach((item,i) => { item.open = printState.details[i]; });
    setFilter(printState.filter); printState = null;
  });
  $('#museum-print').addEventListener('click', () => window.print());
  if ('serviceWorker' in navigator && window.isSecureContext) {
    const reportOffline = async () => {
      $('#museum-offline-status').textContent = await caches.match('./museum.html') ? '資料館もこの端末に保存済み。展示とクイズはオフラインで読めます。公式サイトを開くには通信が必要です。' : '資料館を保存しています。オンラインのまま少しお待ちください。';
    };
    const reportOfflineError = () => { $('#museum-offline-status').textContent = '今回はオフライン保存ができませんでした。通信のある場所で、もう一度開いてください。'; };
    navigator.serviceWorker.addEventListener('controllerchange', () => { reportOffline().catch(reportOfflineError); });
    navigator.serviceWorker.register('./sw.js').then(() => navigator.serviceWorker.ready).then(reportOffline).catch(reportOfflineError);
  } else $('#museum-offline-status').textContent = 'この環境ではオフライン保存を利用できません。';
})();

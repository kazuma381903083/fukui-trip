'use strict';
(() => {
  const $ = selector => document.querySelector(selector);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const map = $('.map-tool');
  const nightButton = $('#map-night-toggle');
  let comet = null;
  nightButton.hidden = false;
  function setNight(night, animate = false) {
    comet?.cancel();
    map.classList.toggle('is-night',night);
    nightButton.setAttribute('aria-pressed',String(night));
    nightButton.setAttribute('aria-label',night ? '地図を昼に戻す' : '地図を夜空にする');
    nightButton.querySelector('span').textContent = night ? '昼へ戻す' : '夜空へ';
    if (night && animate && !motion.matches) {
      comet = $('.map-comet').animate([
        {opacity:0,transform:'translate(-100px,55px)'},
        {opacity:1,offset:.2},
        {opacity:0,transform:'translate(120px,-65px)'}
      ],{duration:1100,easing:'ease-out'});
    }
  }
  nightButton.addEventListener('click', () => setNight(!map.classList.contains('is-night'),true));
  motion.addEventListener('change', () => { if (motion.matches) comet?.cancel(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) comet?.cancel(); });
  let printNight = null;
  window.addEventListener('beforeprint', () => {
    if (printNight !== null) return;
    printNight = map.classList.contains('is-night'); setNight(false);
  });
  window.addEventListener('afterprint', () => {
    if (printNight === null) return;
    setNight(printNight); printNight = null;
  });

  const dialog = $('#field-help');
  if (!dialog?.showModal) return;
  const opener = $('#field-help-open');
  const panels = [...dialog.querySelectorAll('.field-answer')];
  let day = '1', scene = 'drive', followingLink = false;
  function showAnswer(announce = true) {
    dialog.querySelectorAll('[data-help-day]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.helpDay === day)));
    dialog.querySelectorAll('[data-help-scene]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.helpScene === scene)));
    panels.forEach(panel => { panel.hidden = panel.dataset.answerDay !== day || panel.dataset.answerScene !== scene; });
    const active = panels.find(panel => !panel.hidden);
    $('#field-answer-status').textContent = announce ? `Day ${day}：${active.querySelector('h3').textContent}` : '';
  }
  opener.setAttribute('aria-haspopup','dialog');
  opener.addEventListener('click', event => {
    // The original archive anchor remains a complete no-script fallback.
    event.preventDefault(); event.stopPropagation();
    day = document.querySelector('.day-tab[aria-selected="true"]')?.dataset.day || '1';
    showAnswer(false); followingLink = false; dialog.showModal(); dialog.scrollTop = 0;
  });
  dialog.querySelectorAll('[data-help-day]').forEach(button => button.addEventListener('click', () => { day = button.dataset.helpDay; showAnswer(); }));
  dialog.querySelectorAll('[data-help-scene]').forEach(button => button.addEventListener('click', () => { scene = button.dataset.helpScene; showAnswer(); }));
  $('#field-help-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { if (!followingLink) opener.focus({preventScroll:true}); });
  dialog.addEventListener('click', event => {
    if (event.target.closest('a[href^="#"]')) { followingLink = true; dialog.close(); }
  });
  showAnswer(false);
})();

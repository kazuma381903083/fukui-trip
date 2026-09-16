'use strict';
(() => {
  const $ = selector => document.querySelector(selector);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.discovery-drawer').forEach(drawer => {
    const cards = [...drawer.querySelectorAll('.discovery-card')];
    drawer.querySelector('.discovery-deck').classList.add('is-ready');
    const button = drawer.querySelector('.discovery-draw');
    const overlay = drawer.querySelector('.gacha-show');
    let bag = [], current = null, busy = false, effects = [];
    function stopEffects() { effects.forEach(effect => effect.cancel()); }
    drawer.addEventListener('toggle', () => { if (!drawer.open) stopEffects(); });
    motion.addEventListener('change', () => { if (motion.matches) stopEffects(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopEffects(); });
    async function draw(announce = true) {
      if (busy) return;
      if (!bag.length) {
        bag = [...cards];
        for (let i = bag.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [bag[i],bag[j]] = [bag[j],bag[i]];
        }
        // Do not repeat the last card when starting a new shuffle.
        if (bag.length > 1 && bag[bag.length-1] === current) [bag[0],bag[bag.length-1]] = [bag[bag.length-1],bag[0]];
      }
      current = bag.pop();
      cards.forEach(card => { card.hidden = card !== current; });
      if (announce) {
        if (!motion.matches && drawer.open) {
          busy = true; button.disabled = true; overlay.hidden = false;
          drawer.classList.add('is-drawing');
          overlay.scrollIntoView({block:'center',behavior:'instant'});
          const animate = (selector,frames) => overlay.querySelector(selector).animate(frames,{duration:780,easing:'cubic-bezier(.3,.1,.2,1)',fill:'both'});
          effects = [
            animate('.gacha-ball',[{transform:'translateY(-25px) rotate(-20deg) scale(.75)'},{transform:'translateY(4px) rotate(16deg) scale(1)',offset:.3},{transform:'translateY(0) rotate(-8deg) scale(1.06)',offset:.55},{transform:'translateY(0) rotate(0) scale(1)'}]),
            animate('.gacha-top',[{transform:'none',offset:0},{transform:'none',offset:.55},{transform:'translate(-45px,-85px) rotate(-28deg)',opacity:0}]),
            animate('.gacha-bottom',[{transform:'none',offset:0},{transform:'none',offset:.55},{transform:'translate(40px,90px) rotate(20deg)',opacity:0}]),
            animate('.gacha-ball b',[{opacity:1},{opacity:1,offset:.55},{opacity:0,transform:'scale(1.7)'}]),
            animate('.gacha-rays',[{opacity:0,transform:'scale(.4) rotate(-15deg)'},{opacity:0,offset:.5},{opacity:.9,transform:'scale(1) rotate(10deg)',offset:.8},{opacity:0,transform:'scale(1.35) rotate(20deg)'}])
          ];
          await Promise.allSettled(effects.map(effect => effect.finished));
          stopEffects(); effects = [];
          overlay.hidden = true; drawer.classList.remove('is-drawing');
          busy = false; button.disabled = false;
        }
        drawer.querySelector('.discovery-announcement').textContent = current.querySelector('h4').textContent;
        if (!drawer.open || !current.getClientRects().length || document.hidden) return;
        current.tabIndex = -1;
        current.focus({preventScroll:true});
        const heading = current.querySelector('h4').getBoundingClientRect();
        if (heading.top < 24 || heading.bottom > innerHeight - 100) {
          current.scrollIntoView({block:'start',behavior:motion.matches ? 'instant' : 'smooth'});
        }
        if (!motion.matches) current.animate([{opacity:.2,transform:'translateY(9px) rotate(-.5deg)'},{opacity:1,transform:'none'}],{duration:320,easing:'ease-out'});
      }
    }
    button.hidden = false;
    button.addEventListener('click', () => draw());
    draw(false);
  });
  // Keep keyboard focus above the phone's floating navigation.
  document.querySelectorAll('.discovery-drawer a,.discovery-drawer button').forEach(control => {
    control.addEventListener('focus', () => requestAnimationFrame(() => {
      if (document.activeElement !== control || control.closest('.is-drawing')) return;
      const nav = $('.mobile-nav').getBoundingClientRect();
      if (nav.height && control.getBoundingClientRect().bottom > nav.top - 12) {
        control.scrollIntoView({block:'center',behavior:'instant'});
      }
    }));
  });

  const dialog = $('#souvenir-dialog');
  if (!dialog?.showModal || !window.FukuiPostcard) return;
  const canvas = $('#souvenir-canvas');
  const note = $('#souvenir-note');
  const status = $('#souvenir-status');
  const saveButton = $('#souvenir-save');
  let sequence = 0, rendering = Promise.resolve(), saving = false;
  function redraw() {
    const revision = ++sequence;
    saveButton.disabled = true;
    const options = {
      theme: $('input[name="souvenir-theme"]:checked').value,
      note: note.value,
      stampCount: document.querySelectorAll('.travel-stamp[aria-pressed="true"]').length
    };
    canvas.setAttribute('aria-label', `福井旅行の絵はがき。${options.note || 'ふたりの旅。'} スタンプ ${options.stampCount} / 6。`);
    rendering = rendering.catch(() => {}).then(() => window.FukuiPostcard.render(canvas, options)).then(() => {
      if (revision === sequence && !saving) saveButton.disabled = false;
    });
    rendering.catch(() => { status.textContent = '画像を描けませんでした。もう一度開いてください。'; });
    return rendering;
  }
  $('#souvenir-entry').hidden = false;
  $('#souvenir-open').addEventListener('click', () => {
    status.textContent = 'スタンプの数も、いまの記録で。';
    dialog.showModal();
    redraw();
  });
  $('#souvenir-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => $('#souvenir-open').focus({preventScroll:true}));
  document.querySelectorAll('input[name="souvenir-theme"]').forEach(input => input.addEventListener('change', () => redraw()));
  function updateNote(event) {
    if (event.isComposing) return;
    const characters = [...note.value];
    if (characters.length > 48) {
      note.value = characters.slice(0,48).join('');
      status.textContent = 'ひとことを48文字に収めました。';
    } else status.textContent = 'スタンプの数も、いまの記録で。';
    redraw();
  }
  note.addEventListener('input', updateNote);
  note.addEventListener('compositionend', updateNote);
  saveButton.addEventListener('click', async () => {
    if (saving) return;
    saving = true; saveButton.disabled = true;
    status.textContent = '絵はがきを用意しています…';
    try {
      await rendering;
      const blob = await new Promise(resolve => canvas.toBlob(resolve,'image/png'));
      if (!blob) throw new Error('No postcard image');
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url; anchor.download = 'ふたりの福井・旅の絵はがき.png';
      document.body.append(anchor); anchor.click(); anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url),60000);
      status.textContent = '絵はがきの保存を開きました。旅のひとことを、手元に。';
    } catch (_) { status.textContent = '保存できませんでした。もう一度お試しください。'; }
    finally { saving = false; saveButton.disabled = false; }
  });
})();

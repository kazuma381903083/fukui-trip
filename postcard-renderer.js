/* A self-contained, static postcard. No storage, remote fonts, or DOM changes. */
(function () {
  'use strict';

  const WIDTH = 1600;
  const HEIGHT = 1000;
  const SERIF = '"Hiragino Mincho ProN", "Yu Mincho", "Noto Serif CJK JP", serif';
  const SANS = '"Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif';
  const PAPER = '#f5f0e2';
  const INK = '#25493f';
  const VERMILION = '#b44c37';
  const THEMES = {
    sea: {
      sky: '#e4e9df', panel: '#e9e5d5', sun: '#d0a263', distant: '#99afa0',
      mid: '#598882', dark: '#2f6668', land: '#536e56', rock: '#918772',
      pale: '#d6e2d4', caption: '海の色を、ふたりで覚えた。', label: 'THE SEA REMEMBERS',
      index: '01', kanji: '海',
    },
    forest: {
      sky: '#e7e9d9', panel: '#e5e5d2', sun: '#c8a66b', distant: '#acb59a',
      mid: '#7b9678', dark: '#315c4c', land: '#4c7058', rock: '#ad9e7e',
      pale: '#dce4ce', caption: '木漏れ日を、ふたりでたどった。', label: 'IN THE QUIET WOODS',
      index: '02', kanji: '森',
    },
    sunset: {
      sky: '#eed6b8', panel: '#ede0cd', sun: '#c66d48', distant: '#b2a088',
      mid: '#ba896f', dark: '#796d66', land: '#6b7057', rock: '#a98166',
      pale: '#eed8b5', caption: '夕暮れを、ふたりの記憶に。', label: 'ONE LAST GOLDEN HOUR',
      index: '03', kanji: '夕',
    },
  };

  let imagePromise;
  const versions = new WeakMap();
  // Resolve relative to this file, including when the guide lives in a subdirectory.
  const scriptURL = document.currentScript && document.currentScript.src;
  let mascotURL = null;
  try {
    const base = scriptURL || window.location.href;
    const candidate = new URL('assets/dinosaur-traveler.webp', base);
    if (candidate.origin === window.location.origin ||
        (candidate.protocol === 'file:' && window.location.protocol === 'file:')) {
      mascotURL = candidate.href;
    }
  } catch (_) { /* The drawn stamp remains available without an asset URL. */ }

  function loadMascot() {
    if (imagePromise) return imagePromise;
    imagePromise = new Promise(function (resolve) {
      if (!mascotURL) { resolve(null); return; }
      const img = new Image();
      let done = false;
      let timeout;
      function finish(value) {
        if (done) return;
        done = true;
        clearTimeout(timeout);
        img.onload = null;
        img.onerror = null;
        resolve(value);
      }
      img.onload = function () { finish(img.naturalWidth ? img : null); };
      img.onerror = function () { finish(null); };
      timeout = setTimeout(function () { finish(null); }, 2500);
      img.src = mascotURL;
    });
    return imagePromise;
  }

  function path(ctx, points, fill, stroke, width) {
    ctx.beginPath();
    points.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
    if (fill) { ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width || 1; ctx.stroke(); }
  }

  function circle(ctx, x, y, r, fill, stroke, width) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width || 1; ctx.stroke(); }
  }

  function text(ctx, value, x, y, size, color, family, weight) {
    ctx.font = (weight || '400') + ' ' + size + 'px ' + (family || SANS);
    ctx.fillStyle = color || INK;
    ctx.fillText(value, x, y);
  }

  function tracked(ctx, value, x, y, size, spacing, color) {
    ctx.font = '500 ' + size + 'px ' + SANS;
    ctx.fillStyle = color || INK;
    Array.from(value).forEach(function (letter) {
      ctx.fillText(letter, x, y);
      x += ctx.measureText(letter).width + spacing;
    });
  }

  function paperGrain(ctx) {
    // Fixed seed keeps repeated exports identical and avoids animated noise.
    let seed = 7621;
    function random() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    ctx.fillStyle = 'rgba(58, 55, 34, 0.028)';
    for (let i = 0; i < 4200; i++) {
      const x = random() * WIDTH;
      const y = random() * HEIGHT;
      ctx.fillRect(x, y, 1 + random(), 1 + random());
    }
  }

  function arch(ctx) {
    ctx.beginPath();
    ctx.moveTo(99, 809);
    ctx.lineTo(99, 436);
    ctx.bezierCurveTo(99, 259, 224, 166, 414, 166);
    ctx.bezierCurveTo(604, 166, 729, 259, 729, 436);
    ctx.lineTo(729, 809);
    ctx.closePath();
  }

  function waves(ctx, palette, sunset) {
    ctx.save();
    ctx.strokeStyle = palette.pale;
    ctx.lineWidth = 2;
    ctx.globalAlpha = sunset ? 0.42 : 0.5;
    for (let row = 0; row < 9; row++) {
      const y = 481 + row * 40;
      for (let col = 0; col < 4; col++) {
        const x = 103 + col * 181 + (row % 2) * 39;
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.bezierCurveTo(x + 18, y - 4, x + 43, y + 4, x + 67, y);
        ctx.bezierCurveTo(x + 87, y - 4, x + 107, y + 3, x + 123, y);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function birds(ctx, x, y, color) {
    ctx.strokeStyle = color; ctx.lineWidth = 2.5;
    [[0, 0, 1], [55, -24, 0.7], [94, 19, 0.55]].forEach(function (b) {
      ctx.save(); ctx.translate(x + b[0], y + b[1]); ctx.scale(b[2], b[2]);
      ctx.beginPath(); ctx.moveTo(-15, 0); ctx.quadraticCurveTo(-5, -6, 0, 3);
      ctx.quadraticCurveTo(7, -7, 18, -4); ctx.stroke(); ctx.restore();
    });
  }

  function sea(ctx, p, sunset) {
    ctx.fillStyle = p.sky; ctx.fillRect(99, 166, 630, 643);
    circle(ctx, sunset ? 514 : 537, sunset ? 369 : 310, sunset ? 104 : 63, p.sun);
    path(ctx, [[99, 439], [231, 397], [331, 432], [430, 414], [551, 442], [729, 416], [729, 489], [99, 489]], p.distant);
    ctx.fillStyle = p.mid; ctx.fillRect(99, 458, 630, 351);
    path(ctx, [[99, 684], [294, 655], [455, 691], [729, 623], [729, 809], [99, 809]], p.dark);
    if (sunset) {
      ctx.fillStyle = '#eac599'; ctx.globalAlpha = 0.68;
      for (let i = 0; i < 8; i++) {
        const w = 30 + i * 20;
        ctx.fillRect(514 - w / 2 + Math.sin(i) * 8, 473 + i * 28, w, 5 + i % 3);
      }
      ctx.globalAlpha = 1;
    }
    waves(ctx, p, sunset);
    // A suggestion of coastal rock columns, not a literal site diagram.
    const ridge = [[99, 462], [156, 472], [196, 457], [241, 479], [286, 490], [332, 477], [379, 503], [422, 510], [461, 535], [486, 553]];
    for (let i = 0; i < ridge.length - 1; i++) {
      const a = ridge[i], b = ridge[i + 1];
      const drop = 178 - i * 8 + (i % 3) * 12;
      path(ctx, [[a[0], a[1]], [b[0], b[1]], [b[0] - 8, b[1] + drop], [a[0] - 7, a[1] + drop + 14]],
        i % 2 ? p.rock : '#aca28a');
      path(ctx, [[a[0] + 8, a[1] + 16], [a[0] + 5, a[1] + drop - 14]], null, 'rgba(48,59,46,.24)', 2);
    }
    path(ctx, [[99, 435], [157, 442], [198, 427], [247, 451], [297, 461], [334, 450], [381, 481], [429, 491], [486, 553], [422, 533], [373, 524], [330, 500], [278, 514], [229, 497], [180, 480], [136, 493], [99, 478]], p.land);
    birds(ctx, 256, 293, sunset ? '#806b56' : '#6d8579');
    // Two tiny travelers keep the illustration personal without imitating a photo.
    traveler(ctx, 265, 459, VERMILION);
    traveler(ctx, 287, 465, '#d1af6d');
  }

  function tree(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x - size * 0.028, y - size * 0.28, size * 0.056, size * 0.35);
    for (let i = 0; i < 3; i++) {
      const top = y - size + i * size * 0.22;
      const half = size * (0.19 + i * 0.07);
      path(ctx, [[x, top], [x + half, top + size * 0.48], [x - half, top + size * 0.48]], color);
    }
  }

  function forest(ctx, p) {
    ctx.fillStyle = p.sky; ctx.fillRect(99, 166, 630, 643);
    circle(ctx, 514, 297, 61, p.sun);
    path(ctx, [[99, 505], [202, 383], [300, 448], [424, 305], [570, 465], [646, 415], [729, 492], [729, 809], [99, 809]], p.distant);
    path(ctx, [[99, 536], [232, 448], [410, 533], [548, 420], [729, 549], [729, 809], [99, 809]], p.mid);
    path(ctx, [[99, 663], [274, 563], [431, 600], [546, 570], [729, 655], [729, 809], [99, 809]], p.land);
    path(ctx, [[99, 809], [287, 809], [434, 688], [446, 638], [395, 592], [398, 561], [383, 592], [418, 642], [391, 677]], '#d7c7a3');
    [[158, 621, 244], [227, 561, 164], [583, 598, 219], [656, 691, 298], [527, 558, 145]].forEach(function (t, i) {
      tree(ctx, t[0], t[1], t[2], i % 2 ? '#406950' : p.dark);
    });
    ctx.strokeStyle = p.pale; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.55;
    for (let i = 0; i < 8; i++) path(ctx, [[132 + i * 29, 711 + i % 3 * 19], [150 + i * 29, 705 + i % 3 * 19]], null, p.pale, 1.5);
    ctx.globalAlpha = 1;
    traveler(ctx, 410, 655, VERMILION); traveler(ctx, 429, 647, '#e2c98d');
    birds(ctx, 296, 298, '#73826b');
  }

  function traveler(ctx, x, y, color) {
    circle(ctx, x, y - 18, 4, '#364a3b');
    path(ctx, [[x - 4, y - 12], [x + 4, y - 12], [x + 5, y], [x - 5, y]], color);
    path(ctx, [[x - 2, y], [x - 3, y + 6]], null, INK, 2);
    path(ctx, [[x + 2, y], [x + 3, y + 6]], null, INK, 2);
  }

  function landscape(ctx, p, theme) {
    ctx.fillStyle = p.panel; ctx.fillRect(65, 64, 696, 867);
    ctx.strokeStyle = 'rgba(37,73,63,.4)'; ctx.lineWidth = 1;
    ctx.strokeRect(79.5, 78.5, 667, 837);
    tracked(ctx, 'F U K U I', 103, 122, 20, 5, INK);
    tracked(ctx, 'FIELD NOTE / ' + p.index, 525, 121, 12, 1.5, INK);
    ctx.save(); arch(ctx); ctx.clip();
    if (theme === 'forest') forest(ctx, p); else sea(ctx, p, theme === 'sunset');
    ctx.restore();
    arch(ctx); ctx.strokeStyle = 'rgba(37,73,63,.35)'; ctx.lineWidth = 1.4; ctx.stroke();
    text(ctx, p.caption, 104, 856, 25, INK, SERIF);
    tracked(ctx, p.label, 106, 888, 11, 2.2, '#697263');
    // A small red printer's mark.
    ctx.strokeStyle = VERMILION; ctx.lineWidth = 1.6; ctx.strokeRect(680, 845, 36, 36);
    text(ctx, p.kanji, 686, 872, 24, VERMILION, SERIF);
  }

  function fallbackDinosaur(ctx, x, y) {
    // Friendly traveling dinosaur assembled entirely from basic canvas shapes.
    ctx.save(); ctx.translate(x, y);
    path(ctx, [[-24, 24], [-58, 7], [-48, 31], [-13, 47]], '#6a8862');
    circle(ctx, -5, 15, 26, '#6a8862');
    ctx.fillStyle = '#6a8862'; ctx.fillRect(5, -29, 18, 45);
    circle(ctx, 21, -30, 21, '#6a8862'); circle(ctx, 36, -22, 14, '#6a8862');
    circle(ctx, 27, -34, 2.5, INK);
    path(ctx, [[-26, -4], [-10, -11], [-7, 20], [-25, 25]], '#bc8951');
    path(ctx, [[-15, 32], [-16, 52], [-2, 52], [1, 33]], '#5c7855');
    path(ctx, [[9, 30], [15, 51], [28, 51], [24, 26]], '#5c7855');
    path(ctx, [[14, -3], [29, 2], [46, -7], [45, 29], [29, 33], [15, 25]], '#f2e6c8');
    path(ctx, [[18, 18], [25, 11], [33, 19], [40, 10]], null, '#ad8d56', 2);
    ctx.restore();
  }

  function stamp(ctx, mascot, p) {
    ctx.save(); ctx.translate(1383, 83); ctx.rotate(0.035);
    ctx.fillStyle = '#fff9e9'; ctx.fillRect(0, 0, 147, 183);
    // Perforations are painted in the surrounding paper color; no compositing needed.
    for (let x = 9; x < 147; x += 16) { circle(ctx, x, 0, 4, PAPER); circle(ctx, x, 183, 4, PAPER); }
    for (let y = 12; y < 183; y += 16) { circle(ctx, 0, y, 4, PAPER); circle(ctx, 147, y, 4, PAPER); }
    ctx.fillStyle = p.pale; ctx.fillRect(11, 11, 125, 158);
    ctx.strokeStyle = 'rgba(37,73,63,.45)'; ctx.lineWidth = 1; ctx.strokeRect(15.5, 15.5, 116, 149);
    tracked(ctx, 'FUKUI', 27, 36, 12, 4, INK);
    if (mascot) {
      const scale = Math.min(111 / mascot.naturalWidth, 115 / mascot.naturalHeight);
      const w = mascot.naturalWidth * scale, h = mascot.naturalHeight * scale;
      ctx.drawImage(mascot, (147 - w) / 2, 42 + (115 - h) / 2, w, h);
    } else fallbackDinosaur(ctx, 74, 97);
    text(ctx, '旅', 113, 160, 15, INK, SERIF);
    ctx.restore();

    ctx.save(); ctx.translate(1357, 232); ctx.rotate(-0.16); ctx.globalAlpha = 0.8;
    circle(ctx, 0, 0, 65, null, VERMILION, 2);
    circle(ctx, 0, 0, 57, null, VERMILION, 1);
    ctx.textAlign = 'center';
    text(ctx, 'ふたりの旅', 0, -18, 17, VERMILION, SERIF);
    text(ctx, '2026.09', 0, 9, 17, VERMILION, SANS);
    text(ctx, 'F U K U I', 0, 32, 11, VERMILION, SANS);
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(-140, -15 + i * 12);
      ctx.bezierCurveTo(-119, -25 + i * 12, -106, -4 + i * 12, -85, -15 + i * 12);
      ctx.strokeStyle = VERMILION; ctx.lineWidth = 1.4; ctx.stroke();
    }
    ctx.restore();
  }

  function cleanNote(note) {
    let result = '', count = 0;
    const source = typeof note === 'string' ? note : '';
    for (const char of source) {
      if (count++ === 240) { result += '…'; break; }
      result += char;
    }
    return result.replace(/\r\n?/g, '\n').replace(/[\u2028\u2029]/g, '\n')
      .replace(/\t/g, ' ').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
      .trim();
  }

  function wrapNote(ctx, value, maxWidth, maxLines) {
    let units;
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      units = Array.from(new Intl.Segmenter('ja', { granularity: 'grapheme' }).segment(value), function (part) { return part.segment; });
    } else units = Array.from(value); // Code points never split UTF-16 surrogate pairs.
    const lines = [''];
    let overflow = false;
    for (let i = 0; i < units.length; i++) {
      const char = units[i];
      const index = lines.length - 1;
      if (char === '\n' || ctx.measureText(lines[index] + char).width > maxWidth) {
        if (lines.length === maxLines) { overflow = true; break; }
        lines.push(char === '\n' ? '' : char);
      } else lines[index] += char;
    }
    if (overflow) {
      let tail = Array.from(lines[lines.length - 1]);
      while (tail.length && ctx.measureText(tail.join('') + '…').width > maxWidth) tail.pop();
      lines[lines.length - 1] = tail.join('') + '…';
    }
    return lines;
  }

  function inscription(ctx, p, note, stampCount) {
    tracked(ctx, 'POSTCARD / FROM FUKUI', 843, 126, 13, 2.8, INK);
    text(ctx, 'ふくい、', 833, 338, 89, INK, SERIF, '600');
    text(ctx, 'ふたりの旅。', 833, 451, 89, INK, SERIF, '600');
    tracked(ctx, '2026.09.21 — 23', 846, 505, 21, 3, '#7b775f');
    path(ctx, [[846, 548], [905, 548]], null, VERMILION, 3);
    path(ctx, [[918, 548], [1476, 548]], null, '#cbc6b3', 1);
    tracked(ctx, 'A NOTE TO REMEMBER', 847, 590, 11, 2.6, '#777c6d');
    const actualNote = cleanNote(note) || 'また、ふたりで旅に出よう。';
    ctx.save(); ctx.beginPath(); ctx.rect(843, 609, 642, 202); ctx.clip();
    ctx.font = '400 29px ' + SERIF;
    ctx.fillStyle = INK;
    wrapNote(ctx, actualNote, 624, 4).forEach(function (line, i) { ctx.fillText(line, 846, 646 + i * 47); });
    ctx.restore();
    ctx.strokeStyle = '#b4b59f'; ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) circle(ctx, 852 + i * 21, 851, 4, i < stampCount ? p.land : null, p.land, 1);
    tracked(ctx, String(stampCount) + ' / 6', 1001, 858, 14, 1.8, '#667060');
    text(ctx, '旅の足あと', 1086, 857, 15, '#667060', SERIF);
    path(ctx, [[843, 888], [1477, 888]], null, '#b8baaa', 1);
    tracked(ctx, 'FUKUI TRAVEL JOURNAL', 846, 921, 12, 3.2, INK);
  }

  /**
   * Draw a 1600×1000 exportable postcard. Mutates only the supplied canvas.
   * @param {HTMLCanvasElement} canvas
   * @param {{theme?: 'sea'|'forest'|'sunset', note?: string, stampCount?: number}} options
   * @returns {Promise<void>}
   * Later concurrent calls on the same canvas take precedence. Asset failures
   * resolve normally with a drawn stamp. Invalid canvases reject with TypeError.
   */
  async function render(canvas, options) {
    if (!canvas || typeof canvas.getContext !== 'function') throw new TypeError('A canvas is required.');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new TypeError('Canvas 2D is unavailable.');
    options = options && typeof options === 'object' ? options : {};
    const theme = Object.prototype.hasOwnProperty.call(THEMES, options.theme) ? options.theme : 'sea';
    const p = THEMES[theme];
    const note = options.note;
    const count = typeof options.stampCount === 'number' && Number.isFinite(options.stampCount)
      ? Math.max(0, Math.min(6, Math.floor(options.stampCount))) : 0;
    const version = (versions.get(canvas) || 0) + 1;
    versions.set(canvas, version);
    const mascot = await loadMascot();
    if (versions.get(canvas) !== version) return;
    canvas.width = WIDTH; canvas.height = HEIGHT;
    ctx.save();
    try {
      ctx.fillStyle = PAPER; ctx.fillRect(0, 0, WIDTH, HEIGHT);
      landscape(ctx, p, theme);
      inscription(ctx, p, note, count);
      stamp(ctx, mascot, p);
      paperGrain(ctx);
    } finally { ctx.restore(); }
  }

  window.FukuiPostcard = Object.freeze({ render: render });
})();

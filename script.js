(() => {
  const C = window.CONFIG;
  const $ = (id) => document.getElementById(id);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const fill = (s) => s.replace(/\{name\}/g, C.herName).replace(/\{km\}/g, KM.toLocaleString('en-US'));

  // ---------- Distancia (haversine) ----------
  const KM = (() => {
    const R = 6371, rad = (d) => (d * Math.PI) / 180;
    const dLat = rad(C.her.lat - C.me.lat), dLon = rad(C.her.lon - C.me.lon);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(C.me.lat)) * Math.cos(rad(C.her.lat)) * Math.sin(dLon / 2) ** 2;
    return Math.round(2 * R * Math.asin(Math.sqrt(h)));
  })();

  // ---------- Textos ----------
  $('introEyebrow').textContent = C.intro.eyebrow;
  $('introTitle').textContent = C.intro.title;
  $('startLabel').textContent = C.intro.button;
  $('introHint').textContent = C.intro.hint;
  $('knockText').textContent = C.knockText;
  $('openBtn').textContent = C.openButton;
  $('nextBtn').textContent = C.nextButton;

  // ---------- Cielo estrellado ----------
  const cv = $('sky'), ctx = cv.getContext('2d');
  let stars = [], shooting = null, W, H, DPR;
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.width = innerWidth * DPR; H = cv.height = innerHeight * DPR;
    cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px';
    const n = Math.round((innerWidth * innerHeight) / 4200);
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H * 0.85,
      r: (Math.random() * 1.2 + 0.25) * DPR,
      p: Math.random() * Math.PI * 2, s: 0.5 + Math.random() * 1.5
    }));
  }
  function drawSky(t) {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      const a = 0.35 + 0.65 * Math.abs(Math.sin(s.p + (t / 1000) * s.s * 0.6));
      ctx.globalAlpha = a; ctx.fillStyle = '#fff6e0';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
    }
    if (!shooting && Math.random() < 0.003) {
      shooting = { x: Math.random() * W * 0.7, y: Math.random() * H * 0.35, l: 0, v: (9 + Math.random() * 6) * DPR };
    }
    if (shooting) {
      const sh = shooting; sh.l += 1;
      const x = sh.x + sh.l * sh.v, y = sh.y + sh.l * sh.v * 0.45;
      const g = ctx.createLinearGradient(x, y, x - 90 * DPR, y - 40 * DPR);
      g.addColorStop(0, 'rgba(255,240,200,.95)'); g.addColorStop(1, 'rgba(255,240,200,0)');
      ctx.globalAlpha = Math.max(0, 1 - sh.l / 50);
      ctx.strokeStyle = g; ctx.lineWidth = 1.6 * DPR;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 90 * DPR, y - 40 * DPR); ctx.stroke();
      if (sh.l > 50) shooting = null;
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawSky);
  }
  addEventListener('resize', resize); resize(); requestAnimationFrame(drawSky);

  // ---------- Luciérnagas ----------
  const ff = $('fireflies');
  for (let i = 0; i < 24; i++) {
    const d = document.createElement('div');
    d.className = 'firefly';
    d.style.left = Math.random() * 100 + 'vw';
    d.style.top = 40 + Math.random() * 60 + 'vh';
    d.style.animationDuration = `${14 + Math.random() * 16}s, ${2 + Math.random() * 3}s`;
    d.style.animationDelay = `${-Math.random() * 20}s, ${-Math.random() * 4}s`;
    ff.appendChild(d);
  }

  // ---------- Sonido de toques (sintetizado, sin archivos) ----------
  let actx = null;
  function hit(t) {
    const len = 0.14, sr = actx.sampleRate;
    const buf = actx.createBuffer(1, sr * len, sr), data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 8);
    const noise = actx.createBufferSource(); noise.buffer = buf;
    const lp = actx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700;
    const ng = actx.createGain(); ng.gain.value = 1.4;
    noise.connect(lp).connect(ng).connect(actx.destination);
    const osc = actx.createOscillator(), og = actx.createGain();
    osc.frequency.setValueAtTime(140, t); osc.frequency.exponentialRampToValueAtTime(60, t + 0.12);
    og.gain.setValueAtTime(0.9, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    osc.connect(og).connect(actx.destination);
    noise.start(t); osc.start(t); osc.stop(t + 0.2);
  }
  function knockSound() {
    if (!actx) return;
    const t = actx.currentTime + 0.02;
    hit(t); hit(t + 0.2); hit(t + 0.42);
  }

  // ---------- Música ----------
  const music = {
    yt: null, ready: false, playing: false, muted: false,
    target: Math.max(0, Math.min(100, C.music.volume ?? 70)),
    init() {
      if (C.music.audioFile) {
        $('audio').src = C.music.audioFile;
      } else if (C.music.youtubeId) {
        window.onYouTubeIframeAPIReady = () => {
          this.yt = new YT.Player('player', {
            width: 200, height: 200, videoId: C.music.youtubeId,
            playerVars: { start: C.music.startAt || 0, controls: 0, playsinline: 1, loop: 1, playlist: C.music.youtubeId },
            events: { onReady: () => { this.ready = true; this.yt.setVolume(0); } }
          });
        };
        const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(s);
      }
    },
    has() { return !!(C.music.audioFile || C.music.youtubeId); },
    setVol(v) {
      if (C.music.audioFile) $('audio').volume = v / 100;
      else if (this.yt && this.ready) this.yt.setVolume(v);
    },
    fadeTo(to, ms = 3000) {
      const from = this._v ?? 0, start = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - start) / ms);
        this._v = from + (to - from) * k; this.setVol(this._v);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },
    play() {
      if (!this.has()) return;
      this._v = 0;
      if (C.music.audioFile) {
        const a = $('audio'); a.volume = 0;
        try { a.currentTime = C.music.startAt || 0; } catch (e) {}
        a.play().catch(() => {});
      } else if (this.yt && this.ready) {
        this.yt.setVolume(0); this.yt.playVideo();
      } else {
        // si YouTube aún no cargó, reintenta un momento
        return setTimeout(() => this.play(), 400);
      }
      this.playing = true;
      $('muteBtn').classList.remove('hidden');
      this.fadeTo(this.target, 4000);
    },
    toggle() {
      this.muted = !this.muted;
      $('muteBtn').classList.toggle('off', this.muted);
      this.fadeTo(this.muted ? 0 : this.target, 600);
    }
  };
  music.init();
  $('muteBtn').addEventListener('click', () => music.toggle());

  // ---------- Escenas ----------
  function show(id) {
    document.querySelectorAll('.scene').forEach((s) => s.classList.toggle('active', s.id === id));
  }
  function reveal(btn) { btn.classList.remove('hidden-soft'); btn.classList.add('pulse'); }
  function conceal(btn) { btn.classList.add('hidden-soft'); btn.classList.remove('pulse'); }

  let knockTimer = null;
  function knockOnce() {
    const door = $('door'), txt = $('knockText');
    door.classList.remove('knock'); txt.classList.remove('show');
    void door.offsetWidth;
    door.classList.add('knock'); txt.classList.add('show');
    knockSound();
    if (navigator.vibrate) navigator.vibrate([40, 160, 40, 180, 40]);
  }

  $('startBtn').addEventListener('click', async () => {
    try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    show('doorScene');
    await sleep(1600);
    knockOnce();
    knockTimer = setInterval(knockOnce, 4200);
    await sleep(1800);
    reveal($('openBtn'));
  });

  // Typewriter
  async function type(el, text, speed = 42) {
    const caret = document.createElement('span'); caret.className = 'caret';
    el.textContent = ''; el.appendChild(caret);
    for (const ch of text) {
      caret.before(ch);
      await sleep(ch === ',' || ch === '.' || ch === '…' ? speed * 6 : speed);
    }
    await sleep(900);
    caret.remove();
  }

  $('openBtn').addEventListener('click', async () => {
    clearInterval(knockTimer);
    conceal($('openBtn'));
    music.play();
    $('frame').classList.add('opened');
    $('door').classList.remove('knock');
    $('door').classList.add('open');

    await sleep(3400);
    const bubble = $('bubble'), p = $('bubbleText');
    bubble.classList.add('show');

    const lines = C.greeting.map(fill);
    if (C.songQuote && C.songQuote.trim()) lines.push({ quote: C.songQuote.trim() });
    if (C.greetingEnd) lines.push(fill(C.greetingEnd));

    for (const line of lines) {
      if (typeof line === 'object') {
        p.innerHTML = ''; const q = document.createElement('span'); q.className = 'quote';
        p.appendChild(q); await type(q, `“${line.quote}”`, 70); await sleep(1400);
      } else {
        await type(p, line);
      }
      await sleep(700);
    }
    reveal($('nextBtn'));
  });

  // ---------- Librito ----------
  const pages = [...C.pages, { final: true, ...C.finalPage }];
  let idx = 0, clockTimer = null;

  const dots = $('dots');
  pages.forEach(() => dots.appendChild(document.createElement('i')));

  function daysSince() {
    const d = new Date(C.dateMet + 'T00:00:00');
    return Math.max(0, Math.floor((Date.now() - d.getTime()) / 86400000));
  }
  function timeIn(tz) {
    return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz }).format(new Date());
  }

  function render() {
    const pg = pages[idx];
    $('pageNum').textContent = `${idx + 1} / ${pages.length}`;
    $('pageTitle').textContent = fill(pg.title);
    $('pageText').textContent = fill(pg.text);
    const extra = $('pageExtra'); extra.innerHTML = '';
    clearInterval(clockTimer);

    if (pg.final) {
      if (pg.songQuote && pg.songQuote.trim()) {
        const q = document.createElement('p'); q.className = 'quote';
        q.textContent = `“${pg.songQuote.trim()}”`; extra.appendChild(q);
      }
      const stats = document.createElement('div'); stats.className = 'stats';
      stats.innerHTML = `
        <div class="stat"><b id="sDays">0</b><span>${C.labels.days}</span></div>
        <div class="stat"><b id="sKm">0</b><span>${C.labels.km}</span></div>
        <div class="stat"><b id="sHere">--:--</b><span>${C.labels.hereTime} · ${C.me.city}</span></div>
        <div class="stat"><b id="sThere">--:--</b><span>${C.labels.thereTime} · ${C.her.city}</span></div>`;
      extra.appendChild(stats);
      const sig = document.createElement('p'); sig.className = 'signature'; sig.textContent = pg.signature || '';
      extra.appendChild(sig);
      const rb = document.createElement('button'); rb.className = 'btn ghost replay'; rb.textContent = C.labels.replay;
      rb.onclick = () => location.reload();
      extra.appendChild(rb);

      countUp($('sDays'), daysSince());
      countUp($('sKm'), KM);
      const tick = () => { $('sHere').textContent = timeIn(C.me.tz); $('sThere').textContent = timeIn(C.her.tz); };
      tick(); clockTimer = setInterval(tick, 15000);
      startHearts();
    }

    $('prevPage').disabled = idx === 0;
    $('nextPage').disabled = idx === pages.length - 1;
    [...dots.children].forEach((d, i) => d.classList.toggle('on', i === idx));
  }

  function countUp(el, to, ms = 1800) {
    const start = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - start) / ms), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(to * e).toLocaleString('en-US');
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  async function go(d) {
    const n = idx + d;
    if (n < 0 || n >= pages.length) return;
    const page = $('page');
    page.classList.add('turning');
    await sleep(500);
    idx = n; render();
    page.classList.remove('turning');
  }

  $('nextBtn').addEventListener('click', () => { show('bookScene'); render(); });
  $('prevPage').addEventListener('click', () => go(-1));
  $('nextPage').addEventListener('click', () => go(1));
  addEventListener('keydown', (e) => {
    if (!$('bookScene').classList.contains('active')) return;
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  });
  // swipe en móvil
  let tx = null;
  $('bookScene').addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  $('bookScene').addEventListener('touchend', (e) => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    tx = null;
  });

  // ---------- Corazones ----------
  let heartsOn = false;
  function startHearts() {
    if (heartsOn) return; heartsOn = true;
    const box = $('hearts');
    const spawn = () => {
      const h = document.createElement('span'); h.className = 'heart';
      h.textContent = Math.random() < 0.8 ? '♥' : '✦';
      h.style.left = Math.random() * 100 + 'vw';
      h.style.fontSize = 10 + Math.random() * 18 + 'px';
      h.style.setProperty('--sway', (Math.random() * 120 - 60) + 'px');
      h.style.setProperty('--rot', (Math.random() * 80 - 40) + 'deg');
      h.style.animationDuration = 7 + Math.random() * 6 + 's';
      box.appendChild(h);
      setTimeout(() => h.remove(), 14000);
    };
    for (let i = 0; i < 12; i++) setTimeout(spawn, i * 180);
    setInterval(spawn, 900);
  }
})();

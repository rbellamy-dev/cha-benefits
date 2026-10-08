/* ─── Steep timer ────────────────────── */
// The countdown runs from a fixed end time, not a decrementing counter.
// Phones suspend timers when the screen locks and browsers throttle background
// tabs, so counting ticks drifts. Reading the clock means the time left is
// always right, however long the page was asleep.
(function () {
  const TEAS = {
    sencha:  { name: 'Sencha',  temp: '80°C', dose: '2g (one teaspoon)',  secs: 120, from: [222, 228, 185], to: [116, 158, 72] },
    gyokuro: { name: 'Gyokuro', temp: '60°C', dose: '3g (a full teaspoon)', secs: 150, from: [220, 230, 190], to: [78, 138, 74] },
    matcha:  { name: 'Matcha',  temp: '75°C', dose: '2g (sifted)',         secs: 30,  from: [190, 214, 140], to: [70, 130, 60] },
    hojicha: { name: 'Hojicha', temp: '90°C', dose: '3g (heaped)',         secs: 45,  from: [232, 220, 195], to: [166, 108, 62] }
  };

  const steeper = document.getElementById('steeper');
  const liquidG = document.getElementById('liquidG');
  const wavePath = document.getElementById('wavePath');
  const liquidRect = document.getElementById('liquidRect');
  const cupTime = document.getElementById('cupTime');
  const btn = document.getElementById('steepBtn');
  const status = document.getElementById('steepStatus');
  const LEVEL_EMPTY = 184, LEVEL_FULL = 72;
  const PAGE_TITLE = document.title;

  let tea = TEAS.sencha, timer = null, remaining = tea.secs, endsAt = 0, audio = null;

  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const lerp = (a, b, k) => Math.round(a + (b - a) * k);
  const mix = (c1, c2, k) => `rgb(${lerp(c1[0], c2[0], k)},${lerp(c1[1], c2[1], k)},${lerp(c1[2], c2[2], k)})`;

  function setLevel(full) {
    liquidG.style.transform = `translateY(${full ? LEVEL_FULL : LEVEL_EMPTY}px)`;
  }

  function render(progress) {
    const c = mix(tea.from, tea.to, progress);
    wavePath.setAttribute('fill', c);
    liquidRect.setAttribute('fill', c);
    cupTime.textContent = fmt(remaining);
  }

  // Seconds left, read from the clock and rounded up so 0:00 means done.
  const secondsLeft = () => Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));

  // A soft two-note chime, so you hear it's ready from across the kitchen.
  // The AudioContext is created on the Start click (browsers require a gesture).
  function chime() {
    if (!audio) return;
    try {
      const now = audio.currentTime;
      [[659.25, 0], [880, 0.22]].forEach(([freq, at]) => {
        const osc = audio.createOscillator(), gain = audio.createGain();
        osc.type = 'sine'; osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, now + at);
        gain.gain.exponentialRampToValueAtTime(0.18, now + at + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + at + 1.4);
        osc.connect(gain).connect(audio.destination);
        osc.start(now + at); osc.stop(now + at + 1.5);
      });
    } catch { /* sound is a nicety; the visual and title still say it's ready */ }
  }

  function setTea(key) {
    stop();
    tea = TEAS[key];
    remaining = tea.secs;
    document.getElementById('tempOut').textContent = tea.temp;
    document.getElementById('doseOut').textContent = tea.dose;
    document.getElementById('timeOut').textContent = fmt(tea.secs);
    document.getElementById('metaTemp').textContent = tea.temp;
    document.getElementById('metaTea').textContent = tea.name;
    status.textContent = '';
    steeper.classList.remove('done', 'steeping');
    document.title = PAGE_TITLE;
    setLevel(false);
    render(0);
  }

  function stop() {
    clearInterval(timer); timer = null;
    btn.textContent = 'Start the steep';
  }

  function finish() {
    stop();
    remaining = 0;
    steeper.classList.remove('steeping');
    steeper.classList.add('done');
    cupTime.textContent = '0:00';
    status.textContent = 'Lift the leaves. It’s ready.';
    btn.textContent = 'Steep again';
    document.title = `Ready · ${tea.name} · Cha`;
    chime();
  }

  function tick() {
    const left = secondsLeft();
    if (left === remaining && left > 0) return; // nothing new to draw
    remaining = left;
    if (remaining <= 0) { finish(); return; }
    render(1 - remaining / tea.secs);
    document.title = `${fmt(remaining)} · Steeping ${tea.name}`;
  }

  btn.addEventListener('click', () => {
    if (timer) {
      remaining = secondsLeft();
      stop();
      steeper.classList.remove('steeping');
      status.textContent = 'Paused mid-steep.';
      document.title = PAGE_TITLE;
      return;
    }
    if (remaining <= 0 || steeper.classList.contains('done')) { remaining = tea.secs; steeper.classList.remove('done'); render(0); }
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
    } catch { audio = null; }
    endsAt = Date.now() + remaining * 1000;
    steeper.classList.add('steeping');
    setLevel(true);
    status.textContent = 'Steeping… watch the colour turn.';
    btn.textContent = 'Pause';
    document.title = `${fmt(remaining)} · Steeping ${tea.name}`;
    // Ticks only redraw; the clock decides. A short interval keeps 0:00 on time.
    timer = setInterval(tick, 250);
  });

  // Back from a locked screen or another tab: catch up immediately.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    if (timer) tick();
    else if (steeper.classList.contains('done')) setTimeout(() => { document.title = PAGE_TITLE; }, 4000);
  });

  document.querySelectorAll('.tea-pick').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.tea-pick').forEach(x => x.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', 'true');
      setTea(b.dataset.tea);
    });
  });

  setTea('sencha');
})();

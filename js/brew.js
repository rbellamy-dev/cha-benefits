/* ─── Steep timer ────────────────────── */
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

  let tea = TEAS.sencha, timer = null, remaining = tea.secs;

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
    setLevel(false);
    render(0);
  }

  function stop() {
    clearInterval(timer); timer = null;
    btn.textContent = 'Start the steep';
  }

  function tick() {
    remaining--;
    const progress = 1 - remaining / tea.secs;
    render(progress);
    if (remaining <= 0) {
      stop();
      steeper.classList.remove('steeping');
      steeper.classList.add('done');
      cupTime.textContent = '0:00';
      status.textContent = 'Lift the leaves. It’s ready.';
      btn.textContent = 'Steep again';
    }
  }

  btn.addEventListener('click', () => {
    if (timer) { stop(); steeper.classList.remove('steeping'); status.textContent = 'Paused mid-steep.'; return; }
    if (remaining <= 0 || steeper.classList.contains('done')) { remaining = tea.secs; steeper.classList.remove('done'); render(0); }
    steeper.classList.add('steeping');
    setLevel(true);
    status.textContent = 'Steeping… watch the colour turn.';
    btn.textContent = 'Pause';
    timer = setInterval(tick, 1000);
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

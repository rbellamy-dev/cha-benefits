/* ─── Signup form ────────────────────── */
(function () {
  const form = document.getElementById('signup-form');
  const input = document.getElementById('email');
  const err = document.getElementById('form-error');
  const ok = document.getElementById('form-success');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    err.textContent = ''; ok.textContent = '';

    const v = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      err.textContent = 'That address doesn’t look quite right. Try once more.';
      input.focus();
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Steeping…';

    let succeeded = false;

    try {
      const res = await fetch('/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: v }),
      });

      let data = {};
      try { data = await res.json(); } catch { /* non-JSON body */ }

      if (res.ok) {
        ok.textContent = 'You’re on the list. Thank you.';
        input.value = '';
        succeeded = true;
      } else {
        err.textContent = data.error || 'Something went wrong on our end. Please try again.';
      }
    } catch {
      err.textContent = 'Could not connect. Please try again.';
    } finally {
      if (!succeeded) btn.disabled = false;
      btn.textContent = 'Subscribe';
    }
  });
})();

(() => {
  try {
    const key = 'stackly.session.v1';
    const session = JSON.parse(sessionStorage.getItem(key) || localStorage.getItem(key) || 'null');
    const accounts = JSON.parse(localStorage.getItem('stackly.accounts.v1') || '[]');
    if (!session || !Number.isFinite(session.expiresAt) || session.expiresAt <= Date.now() || !accounts.some(a => a.email === session.email)) {
      location.replace('signin.html'); return;
    }
    window.stacklyUser = {name:session.name, email:session.email};
  } catch { location.replace('signin.html'); }
})();

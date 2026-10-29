const params = new URLSearchParams(location.search);
if (params.get('mode') === 'signup') location.replace('register.html');
const isSignup = document.body.dataset.authMode === 'signup';
const isReset = params.get('mode') === 'reset';
const form = document.querySelector('#auth-form');
const password = document.querySelector('#password');
const email = document.querySelector('#email');
const statusMessage = document.querySelector('#status');
const accountsKey = 'stackly.accounts.v1';
const sessionKey = 'stackly.session.v1';
function showStatus(message) { statusMessage.textContent = message; statusMessage.hidden = false; }
function readAccounts() {
  const accounts = JSON.parse(localStorage.getItem(accountsKey) || '[]');
  if (!Array.isArray(accounts)) throw new Error('Invalid account storage');
  return accounts;
}
async function passwordHash(value, salt) {
  const bytes = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', bytes.encode(value), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({name:'PBKDF2', salt:bytes.encode(salt), iterations:210000, hash:'SHA-256'}, key, 256);
  return Array.from(new Uint8Array(bits), byte => byte.toString(16).padStart(2,'0')).join('');
}
if (isSignup) {
  password.minLength = 8;
  password.autocomplete = 'new-password';
  password.placeholder = 'Choose a password (at least 8 characters)';
}
if (params.get('registered') === '1') {
  showStatus('Registration successful. Sign in with your new account to continue.');
  email.value = sessionStorage.getItem('stackly.registeredEmail') || '';
  sessionStorage.removeItem('stackly.registeredEmail');
}
if (isReset) {
  document.title = 'Reset Password | Stackly';
  document.querySelector('#heading').textContent = 'Reset Password';
  document.querySelector('#intro').textContent = 'Contact our team for help accessing your account.';
  document.querySelector('#password-field').hidden = true;
  document.querySelector('#options').hidden = true;
  document.querySelector('#submit-button').textContent = 'Get help';
  password.required = false; password.disabled = true;
  document.querySelector('#account-prompt').textContent = 'Remember your password?';
  const link = document.querySelector('#account-link'); link.textContent = 'Sign In'; link.href = 'signin.html';
}
document.querySelector('#toggle-password').addEventListener('click', event => {
  const show = password.type === 'password'; password.type = show ? 'text' : 'password';
  event.currentTarget.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  event.currentTarget.setAttribute('aria-pressed', String(show));
});
const confirmation = document.querySelector('#confirm-password');
if (confirmation) {
  const validate = () => confirmation.setCustomValidity(confirmation.value === password.value ? '' : 'Passwords do not match.');
  confirmation.addEventListener('input', validate); password.addEventListener('input', validate);
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (isReset) { showStatus('Please contact autocarespares@gmail.com for help accessing your account.'); return; }
  if (!form.reportValidity()) return;
  const submit = document.querySelector('#submit-button'); submit.disabled = true;
  try {
    const address = email.value.trim().toLowerCase();
    const accounts = readAccounts();
    const account = accounts.find(item => item.email === address);
    if (isSignup) {
      const name = form.elements.name.value.trim();
      if (!name) { showStatus('Please enter your name.'); return; }
      if (account) { showStatus('An account with this email already exists. Please sign in.'); return; }
      const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2,'0')).join('');
      accounts.push({name, email:address, salt, hash:await passwordHash(password.value,salt)});
      localStorage.setItem(accountsKey, JSON.stringify(accounts));
      localStorage.removeItem(sessionKey); sessionStorage.removeItem(sessionKey);
      sessionStorage.setItem('stackly.registeredEmail', address);
      location.href = 'signin.html?registered=1';
    } else {
      if (!account || await passwordHash(password.value,account.salt) !== account.hash) {
        showStatus('Email or password is incorrect. Register first if you do not have an account.'); return;
      }
      const session = JSON.stringify({name:account.name,email:address,expiresAt:Date.now()+86400000});
      localStorage.removeItem(sessionKey); sessionStorage.removeItem(sessionKey);
      (document.querySelector('#remember').checked ? localStorage : sessionStorage).setItem(sessionKey,session);
      location.href = 'dashboard.html';
    }
  } catch (error) { showStatus('Unable to access account storage. Use a local web server and allow browser storage, then try again.'); }
  finally { submit.disabled = false; }
});

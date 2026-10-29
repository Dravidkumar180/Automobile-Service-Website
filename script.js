const dialogs = document.querySelectorAll('dialog');
const booking = document.querySelector('#booking-dialog');
const dateInput = document.querySelector('[name="date"]');
const today = new Date();
dateInput.min = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
document.querySelector('#year').textContent = today.getFullYear();
function openDialog(dialog) { dialogs.forEach(item => item.close()); dialog.showModal(); }
document.querySelectorAll('[data-book]').forEach(button => button.addEventListener('click', () => {
  booking.querySelector('select').value = button.dataset.book;
  openDialog(booking);
}));
document.querySelectorAll('.close').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
dialogs.forEach(dialog => dialog.addEventListener('click', event => { if(event.target === dialog) { const r = dialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } }));
document.querySelector('[data-dialog="account"]').addEventListener('click', () => { window.location.href = 'signin.html'; });
document.querySelector('#search-button').addEventListener('click', () => openDialog(document.querySelector('#search-dialog')));
document.querySelector('#search-form').addEventListener('submit', event => {
  event.preventDefault();
  const query = new FormData(event.target).get('query').trim().toLowerCase();
  window.location.href = `services.html?q=${encodeURIComponent(query)}`;
});
const query = new URLSearchParams(location.search).get('q');
if (query && document.querySelector('.no-results')) {
  let matches = 0;
  document.querySelectorAll('.service-card').forEach(card => {
    card.hidden = !card.textContent.toLowerCase().includes(query.toLowerCase());
    if (!card.hidden) matches++;
  });
  document.querySelector('.no-results').hidden = matches > 0;
}
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav a').forEach(link => {
  if (link.getAttribute('href') === currentPage) link.setAttribute('aria-current', 'page');
});

document.querySelector('.menu-toggle').addEventListener('click', event => { const isOpen = document.querySelector('nav').classList.toggle('open'); event.currentTarget.setAttribute('aria-expanded', String(isOpen)); event.currentTarget.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu'); });
document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => { document.querySelector('nav').classList.remove('open'); document.querySelector('.menu-toggle').setAttribute('aria-expanded','false'); }));
document.querySelector('#booking-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.target);
  const body = `Service inquiry\n\nName: ${data.get('name')}\nPhone: ${data.get('phone')}\nService: ${data.get('service')}\nPreferred date: ${data.get('date')}\n\nPlease contact me to confirm availability.`;
  window.location.href = `mailto:autocarespares@gmail.com?subject=${encodeURIComponent('Service inquiry: '+data.get('service'))}&body=${encodeURIComponent(body)}`;
});

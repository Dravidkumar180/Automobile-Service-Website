const currentUser = window.stacklyUser || {name:'Customer', email:''};
const userName = currentUser.name || 'Customer';
document.querySelectorAll('[data-user-name]').forEach(element => { element.textContent = userName; });
const safeAccountText = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]));
const dialog = document.querySelector('#detail-dialog');
const main = document.querySelector('#dashboard-main');
const overview = main.innerHTML;
const orderTable = main.querySelector('.table-scroll').outerHTML;
const vehicleCard = main.querySelector('.vehicle-card').outerHTML;
const panels = {
  vehicles: ['My Vehicles', '<div class="dialog-row"><strong>THE BMW M340i</strong><p>Registration: TN 10 AB 1234</p></div><p>2 vehicles are shown in the sample dashboard. Details for the second vehicle have not been provided.</p>'],
  booking: ['Upcoming Service', '<p><strong>Oil Change &amp; General Checkup</strong></p><p>06 Oct 2026 &middot; 10.00 AM</p><p class="delivered">Confirmed</p><p>These are the sample booking details from the supplied design.</p><a href="#services" data-view="services">Explore services &rarr;</a>'],
  orders: ['Orders', '<div class="dialog-row"><strong>#ORD1005 &middot; Brake Pads (Set)</strong><p>22 OCT 2026 &middot; Delivered</p></div><div class="dialog-row"><strong>#ORD1004 &middot; Engine Oil (5L)</strong><p>18 OCT 2026 &middot; Shipped</p></div><div class="dialog-row"><strong>#ORD1003 &middot; Air Filter</strong><p>12 OCT 2026 &middot; Delivered</p></div><p>The design shows 5 total orders; only these three sample orders were provided.</p>'],
  history: ['Service History', '<p>No previous service records have been connected to this dashboard yet.</p><a href="#services" data-view="services">Book a service &rarr;</a>'],
  profile: ['Profile', `<p><strong>${safeAccountText(userName)}</strong><br>Customer</p><p>${safeAccountText(currentUser.email)}</p><a href="#dashboard" data-view="dashboard">Back to dashboard &rarr;</a>`],
  settings: ['Settings', '<p>Account settings will be available when live customer accounts are connected.</p><a href="#support" data-view="support">Contact support &rarr;</a>'],
  notifications: ['Notifications', '<p>No live notifications are connected yet.</p>'],
  tracking: ['Track Order', '<p><strong>#ORD1004 &middot; Engine Oil (5L)</strong></p><p class="shipped">Shipped</p><p>This is the sample status shown in your dashboard. Live shipment tracking is not connected.</p><a href="#support" data-view="support">Contact us about an order &rarr;</a>']
};
const services = ['General Service', 'Engine Repair', 'Brake Service', 'AC Service'];
const parts = ['Maintenance Parts', 'Brake Parts', 'AC & Cooling Parts'];
const titles = { dashboard:'Dashboard', services:'Book Service', shop:'Shop Parts', support:'Contact Support', ...Object.fromEntries(Object.entries(panels).map(([key,value]) => [key,value[0]])) };
let searchQuery = '';
const escapeHTML = value => value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function inquiryForm(isParts) {
  const choices = isParts ? parts : services;
  return `<section class="view-panel"><h2>${isParts ? 'Parts Enquiry' : 'Request a Service Appointment'}</h2><form class="dashboard-form" data-inquiry="${isParts ? 'Parts enquiry' : 'Service appointment enquiry'}"><label>${isParts ? 'Part category' : 'Service'}<select name="request">${choices.map(name => `<option>${name}</option>`).join('')}</select></label><label>Vehicle<input name="vehicle" value="BMW M340i - TN 10 AB 1234" required></label>${isParts ? '' : '<label>Preferred date<input name="date" type="date" required></label>'}<label>Phone number<input name="phone" type="tel" pattern="[+0-9 ()-]{7,20}" autocomplete="tel" required></label><label class="full-width">${isParts ? 'Parts needed' : 'Notes'}<textarea name="notes" rows="3" ${isParts ? 'required' : ''}></textarea></label><button class="view-primary" type="submit">Prepare Enquiry</button><p class="form-note">Our team will confirm availability after receiving your email enquiry.</p><div class="inquiry-result full-width" role="status" hidden></div></form></section>`;
}
function render() {
  let view = location.hash.slice(1) || 'dashboard';
  if (!titles[view]) view = 'dashboard';
  let content = '';
  if (view === 'services' || view === 'shop') {
    const isParts = view === 'shop';
    const choices = isParts ? parts : services.filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()));
    content = `<p class="view-intro">${isParts ? 'Enquire about genuine parts. Our team will confirm compatibility, pricing, and availability.' : 'Choose a service and request an appointment for your vehicle.'}</p>${!isParts && searchQuery ? `<p>Search results for <strong>${escapeHTML(searchQuery)}</strong> <button class="view-back" data-clear-search>Clear search</button></p>` : ''}<div class="dashboard-service-grid">${choices.map(name => `<button class="dashboard-service" data-choice="${name}" type="button"><svg><use href="#${isParts ? 'cart' : 'tool'}"/></svg><h2>${name}</h2><p>${isParts ? 'Find the right fit for your vehicle.' : 'Professional care for your vehicle.'}</p><span>${isParts ? 'Enquire About Parts' : 'Select Service'} &rarr;</span></button>`).join('') || '<p>No matching services. Try engine, brake, or AC.</p>'}</div>${inquiryForm(isParts)}`;
  } else if (view === 'vehicles') {
    content = `<div class="dashboard-vehicle-grid">${vehicleCard}<section class="view-panel">${panels.vehicles[1]}<button class="view-primary" data-view="services">Book Service</button></section></div>`;
  } else if (view === 'orders') {
    content = `<section class="view-panel"><h2>Recent Orders</h2>${orderTable}<p class="form-note">The sample design shows 5 orders. Only these three order details were provided.</p><button class="view-primary" data-view="tracking">Track an Order</button></section>`;
  } else if (view === 'tracking') {
    content = `<section class="view-panel"><h2>Select an Order</h2><label class="tracking-label">Order<select id="tracking-order"><option value="1004">#ORD1004 - Engine Oil (5L)</option><option value="1005">#ORD1005 - Brake Pads (Set)</option><option value="1003">#ORD1003 - Air Filter</option></select></label><p class="tracking-status shipped" role="status">Shipped</p><p class="form-note">These are sample statuses. Live shipment tracking is not connected.</p><button class="view-primary" data-view="support">Contact Support</button></section>`;
  } else if (view === 'support') {
    content = '<section class="view-panel"><h2>How can we help?</h2><p>Contact our team for bookings, parts, or order enquiries.</p><p><a href="tel:+919034554321">+91 90345 54321</a></p><p><a href="mailto:autocarespares@gmail.com">autocarespares@gmail.com</a></p><p>Chennai - 600008</p></section>';
  } else if (panels[view]) content = `<section class="view-panel">${panels[view][1]}</section>`;
  main.innerHTML = view === 'dashboard' ? overview : `<div class="view-heading"><div><p>Auto Care / ${titles[view]}</p><h1>${titles[view]}</h1></div><button class="view-back" data-view="dashboard">&larr; Dashboard</button></div>${content}`;
  document.title = `${titles[view]} | Auto Care`;
  document.querySelectorAll('.sidebar nav [data-view]').forEach(item => {
    const active = item.dataset.view === view || (view === 'booking' && item.dataset.view === 'services') || (view === 'tracking' && item.dataset.view === 'orders');
    if (active) item.setAttribute('aria-current','page'); else item.removeAttribute('aria-current');
  });
  const date = main.querySelector('input[type="date"]');
  if (date) { const now = new Date(); date.min = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`; }
  document.querySelector('#sidebar').classList.remove('open');
  document.querySelector('.mobile-menu').setAttribute('aria-expanded','false');
}
function navigate(view) {
  if (location.hash === `#${view}`) render(); else { history.pushState(null,'',`#${view}`); render(); }
  main.focus({preventScroll:true}); window.scrollTo(0,0);
}
document.addEventListener('click', event => {
  const link = event.target.closest('[data-view]');
  if (link) { event.preventDefault(); navigate(link.dataset.view); return; }
  const choice = event.target.closest('[data-choice]');
  if (choice) { const select = main.querySelector('select[name="request"]'); select.value = choice.dataset.choice; select.scrollIntoView({behavior:'smooth',block:'center'}); select.focus({preventScroll:true}); }
  if (event.target.closest('[data-clear-search]')) { searchQuery = ''; document.querySelector('.search input').value = ''; render(); }
});
document.querySelector('.search').addEventListener('submit', event => {
  event.preventDefault(); searchQuery = new FormData(event.target).get('q').trim(); navigate('services');
});
main.addEventListener('submit', event => {
  const form = event.target.closest('[data-inquiry]');
  if (!form) return;
  event.preventDefault();
  if (!form.reportValidity()) return;
  const body = [...new FormData(form).entries()].map(([key,value]) => `${key}: ${value}`).join('\n');
  const result = form.querySelector('.inquiry-result'); result.hidden = false; result.replaceChildren();
  const p = document.createElement('p'); p.textContent = 'Your enquiry is ready. Send it by email so our team can confirm availability.';
  const a = document.createElement('a'); a.className = 'view-primary'; a.textContent = 'Send Enquiry by Email'; a.href = `mailto:autocarespares@gmail.com?subject=${encodeURIComponent(form.dataset.inquiry)}&body=${encodeURIComponent(body)}`;
  result.append(p,a);
});
main.addEventListener('change', event => {
  if (event.target.id !== 'tracking-order') return;
  const shipped = event.target.value === '1004'; const status = main.querySelector('.tracking-status');
  status.textContent = shipped ? 'Shipped' : 'Delivered'; status.className = `tracking-status ${shipped ? 'shipped' : 'delivered'}`;
});
document.querySelector('.mobile-menu').addEventListener('click', event => { const open = document.querySelector('#sidebar').classList.toggle('open'); event.currentTarget.setAttribute('aria-expanded',String(open)); });
window.addEventListener('hashchange',render);
window.addEventListener('popstate',render);
render();

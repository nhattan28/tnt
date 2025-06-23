const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const toggleBtn = document.getElementById('toggleBtn');

function showSidebar() {
  sidebar.classList.add('show');
  overlay.classList.add('show');
  toggleBtn.classList.add('hide');
}

function hideSidebar() {
  sidebar.classList.remove('show');
  overlay.classList.remove('show');
  toggleBtn.classList.remove('hide');
}

function loadPage(page) {
  document.getElementById('iframeView').src = page;
  hideSidebar();
}

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString('vi-VN', { hour12: false });
  const date = now.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  document.getElementById('clock').textContent = time;
  document.getElementById('date').textContent = date;
}

setInterval(updateClock, 1000);
updateClock();

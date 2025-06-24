// ⏰ Hiển thị đồng hồ
function updateClock() {
  const now = new Date();
  const clock = document.getElementById('clock');
  const date = document.getElementById('date');
  clock.textContent = now.toLocaleTimeString('vi-VN');
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  date.textContent = now.toLocaleDateString('vi-VN', options);
}
setInterval(updateClock, 1000);
updateClock();

// 🌫️ Mở sidebar
function showSidebar() {
  document.getElementById('sidebar').classList.add('show');
  document.getElementById('overlay').classList.add('show');
  document.getElementById('toggleBtn').classList.add('hide'); // 👈 ẩn nút ☰
}

function hideSidebar() {
  document.getElementById('sidebar').classList.remove('show');
  document.getElementById('overlay').classList.remove('show');
  setTimeout(() => {
    document.getElementById('toggleBtn').classList.remove('hide');
  }, 300); // delay 0.3s khớp với transition
}

// 🔁 Chuyển trang trong iframe
function loadPage(pageUrl) {
  document.getElementById('iframeView').src = pageUrl;
  hideSidebar();
}

//Chỉ mở 1 nhóm cha
 document.querySelectorAll('.sidebar details').forEach((detail) => {
    detail.addEventListener('toggle', () => {
      if (detail.open) {
        document.querySelectorAll('.sidebar details').forEach((other) => {
          if (other !== detail) other.removeAttribute('open');
        });
      }
    });
  });

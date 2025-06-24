// Khai báo biến lưu danh sách video, tiêu đề và vị trí hiện tại
let videoQueue = [], videoTitles = [], currentIndex = -1, player;

// Tách ID video từ link YouTube
function extractVideoId(url) {
  const match = url.match(/(?:v=|youtu\.be\/|\/embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

// Dán link từ clipboard và thêm vào danh sách
async function pasteAndAdd() {
  try {
    const text = await navigator.clipboard.readText();
    document.getElementById("videoInput").value = text;
    addVideo();
  } catch {
    alert("Không đọc được clipboard");
  }
}

// Xóa input
function clearInput() {
  document.getElementById("videoInput").value = "";
}

// Bắt đầu từ video đầu tiên
function startFirstVideo() {
  const input = document.getElementById("firstVideo").value.trim();
  const id = extractVideoId(input);
  if (!id) return alert("❌ Link không hợp lệ");

  const link = `https://youtu.be/${id}`;
  videoQueue.push(id);
  fetch(`https://www.youtube.com/oembed?url=${link}&format=json`)
    .then(res => res.json())
    .then(data => {
      videoTitles.push(data.title);
      currentIndex = 0;
      playVideo(id);
      updateQueueDisplay();
      document.getElementById("firstVideo").style.display = "none";
      document.querySelector("button[onclick='startFirstVideo()']").style.display = "none";
      document.getElementById("addSection").style.display = "block";
    })
    .catch(() => alert("Không lấy được tiêu đề."));
}

// Thêm video tiếp theo
function addVideo() {
  const input = document.getElementById("videoInput");
  const url = input.value.trim();
  const id = extractVideoId(url);
  if (!id) return alert("❌ Link không hợp lệ");

  const link = `https://youtu.be/${id}`;
  videoQueue.push(id);
  fetch(`https://www.youtube.com/oembed?url=${link}&format=json`)
    .then(res => res.json())
    .then(data => {
      videoTitles.push(data.title);
      updateQueueDisplay();
    })
    .catch(() => {
      videoTitles.push("Không rõ tiêu đề");
      updateQueueDisplay();
    });

  input.value = "";
}

// Cập nhật danh sách phát (có hỗ trợ kéo-thả)
function updateQueueDisplay() {
  const list = document.getElementById("queueList");
  list.innerHTML = "";

  videoQueue.forEach((id, index) => {
    const li = document.createElement("li");
    li.setAttribute("data-index", index);
    const link = `https://youtu.be/${id}`;
    const title = videoTitles[index] || `Video ${index + 1}`;
    li.innerHTML = `
      <div>
        ${index + 1}. <a href="${link}" target="_blank">${title}</a>
        ${index === currentIndex ? " 🎥 (Đang phát)" : ""}
      </div>
      <button class="delete-btn" onclick="removeVideo(${index})"> Xóa</button>
    `;
    list.appendChild(li);
  });

  Sortable.create(list, {
    animation: 150,
    onEnd: function (evt) {
      const from = evt.oldIndex;
      const to = evt.newIndex;
      const v = videoQueue.splice(from, 1)[0];
      const t = videoTitles.splice(from, 1)[0];
      videoQueue.splice(to, 0, v);
      videoTitles.splice(to, 0, t);
      if (from === currentIndex) currentIndex = to;
      else if (from < currentIndex && to >= currentIndex) currentIndex--;
      else if (from > currentIndex && to <= currentIndex) currentIndex++;
      updateQueueDisplay();
    }
  });
}

// Phát video theo ID
function playVideo(id) {
  document.getElementById("playerContainer").innerHTML = `
    <iframe id="ytPlayer"
      src="https://www.youtube.com/embed/${id}?autoplay=1&enablejsapi=1&rel=0"
      allow="autoplay" allowfullscreen></iframe>
  `;
  setTimeout(() => {
    const iframe = document.getElementById("ytPlayer");
    player = new YT.Player(iframe, {
      events: { 'onStateChange': onPlayerStateChange }
    });
  }, 500);
}

// Video kế tiếp
function nextVideo() {
  if (currentIndex + 1 < videoQueue.length) {
    currentIndex++;
    playVideo(videoQueue[currentIndex]);
    updateQueueDisplay();
  }
}

// Video trước đó
function prevVideo() {
  if (currentIndex > 0) {
    currentIndex--;
    playVideo(videoQueue[currentIndex]);
    updateQueueDisplay();
  }
}

// Xoá video khỏi hàng chờ
function removeVideo(index) {
  videoQueue.splice(index, 1);
  videoTitles.splice(index, 1);
  if (index === currentIndex) {
    if (videoQueue.length > 0) {
      currentIndex = Math.min(index, videoQueue.length - 1);
      playVideo(videoQueue[currentIndex]);
    } else {
      currentIndex = -1;
      document.getElementById("playerContainer").innerHTML = "";
    }
  } else if (index < currentIndex) {
    currentIndex--;
  }
  updateQueueDisplay();
}

// Reset toàn bộ playlist
function resetAll() {
  if (confirm("Bạn có chắc chắn muốn xoá toàn bộ playlist?")) {
    videoQueue = [];
    videoTitles = [];
    currentIndex = -1;
    document.getElementById("playerContainer").innerHTML = "";
    document.getElementById("queueList").innerHTML = "";
    document.getElementById("firstVideo").style.display = "block";
    document.getElementById("firstVideo").value = "";
    document.getElementById("addSection").style.display = "none";
    document.querySelector("button[onclick='startFirstVideo()']").style.display = "inline-block";
  }
}

// Tải API YouTube
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

// Khi video kết thúc thì phát tiếp
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) nextVideo();
}
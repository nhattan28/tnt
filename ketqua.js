const score = localStorage.getItem("quizScore");
const correct = localStorage.getItem("quizCorrect");
const total = localStorage.getItem("quizTotal");
const time = localStorage.getItem("quizTime");
const wrongAnswers = JSON.parse(localStorage.getItem("quizWrongAnswers") || "[]");
const correctAnswers = JSON.parse(localStorage.getItem("quizCorrectAnswers") || "[]");
const scale = localStorage.getItem("quizScale") || 10;
const violation = localStorage.getItem("quizViolation");
const fileName = localStorage.getItem("currentFileName") || "Unknown";
const answeredCount = localStorage.getItem("quizAnsweredCount"); // This is the value causing the issue if set incorrectly elsewhere

// Initialize retry data and save current score
let retryData = JSON.parse(localStorage.getItem("retryData")) || {};
if (!retryData[fileName]) {
  retryData[fileName] = { attempts: 0, scores: [] };
}
if (score) {
  retryData[fileName].scores.push(parseFloat(score));
  localStorage.setItem("retryData", JSON.stringify(retryData));
}

// Display core results
const scoreValue = parseFloat(score);
const formattedScore = scoreValue % 1 === 0 ? scoreValue.toFixed(0) : scoreValue.toFixed(1);
document.getElementById("score").textContent = `${formattedScore}/${scale}`;
document.getElementById("correct").textContent = correct;
document.getElementById("total").textContent = total;
document.getElementById("time").textContent = time;
document.getElementById("wrong").textContent = total - correct;
document.getElementById("answeredCount").textContent = answeredCount; // Displays the value retrieved from local storage

// Set motivational message based on score
const motivationalMessage = document.getElementById("motivationalMessage");
const scorePercentage = (parseFloat(score) / parseFloat(scale)) * 10;
let message = "";

if (scorePercentage >= 9) message = "👏 Xuất sắc! Bạn gần như hoàn hảo!";
else if (scorePercentage >= 7) message = "👍 Rất tốt! Hãy xem lại vài câu để cải thiện nhé!";
else if (scorePercentage >= 5) message = "💪 Khá ổn! Cố gắng thêm một chút nữa!";
else message = "🚀 Đừng nản! Ôn tập lại, lần sau bạn sẽ làm tốt hơn!";

motivationalMessage.classList.remove("hidden");
motivationalMessage.textContent = message;

// Display violation notice if present
if (violation) {
  const notice = document.getElementById("violationNotice");
  notice.classList.remove("hidden");
  notice.textContent = "🚫 Bài thi bị kết thúc do vi phạm nguyên tắc thi";
  localStorage.removeItem("quizViolation");
}

// References for answer sections and toggle buttons
const wrongContainer = document.getElementById("wrongAnswersContainer");
const wrongSection = document.getElementById("wrongAnswersSection");
const toggleWrongBtn = document.getElementById("toggleWrongBtn");
const correctContainer = document.getElementById("correctAnswersContainer");
const correctSection = document.getElementById("correctAnswersSection");
const toggleCorrectBtn = document.getElementById("toggleCorrectBtn");

// Handle wrong answers display
if (wrongAnswers.length === 0) {
  wrongSection.style.display = "none";
  document.getElementById("perfectMessage").classList.remove("hidden");
  triggerFireworks();
} else {
  wrongSection.style.display = "none"; // Initially hidden
}

wrongAnswers.forEach((item) => {
  const div = document.createElement("div");
  div.className = "p-4 rounded-xl bg-red-50 border border-red-200 shadow-sm";
  div.innerHTML = `
    <p class="mb-2 text-lg font-semibold">${item.question}</p>
    <p class="text-blue-700"><strong>Đáp án bạn chọn:</strong> ${item.selected}</p>
    <p class="text-green-700"><strong>Đáp án đúng:</strong> ${item.correct}</p>
  `;
  wrongContainer.appendChild(div);
});

// Handle correct answers display
if (correctAnswers.length === 0) {
  correctSection.style.display = "none";
} else {
  correctSection.style.display = "none"; // Initially hidden
}

correctAnswers.forEach((item) => {
  const div = document.createElement("div");
  div.className = "p-4 rounded-xl bg-green-50 border border-green-200 shadow-sm";
  div.innerHTML = `
    <p class="mb-2 text-lg font-semibold">${item.question}</p>
    <p class="text-green-700"><strong>Đáp án bạn chọn:</strong> ${item.selected}</p>
    <p class="text-green-700"><strong>Đáp án đúng:</strong> ${item.correct}</p>
  `;
  correctContainer.appendChild(div);
});

// Event listeners for toggle buttons
toggleWrongBtn.addEventListener("click", function() {
  if (wrongSection.style.display === "none") {
    wrongSection.style.display = "block";
    toggleWrongBtn.textContent = "Ẩn câu sai";
  } else {
    wrongSection.style.display = "none";
    toggleWrongBtn.textContent = "Hiển thị câu sai";
  }
});

toggleCorrectBtn.addEventListener("click", function() {
  if (correctSection.style.display === "none") {
    correctSection.style.display = "block";
    toggleCorrectBtn.textContent = "Ẩn câu đúng";
  } else {
    correctSection.style.display = "none";
    toggleCorrectBtn.textContent = "Hiển thị câu đúng";
  }
});

// Fireworks effect for perfect score
function triggerFireworks() {
  for (let i = 0; i < 100; i++) setTimeout(() => createFirework(), i * 50);
}

function createFirework() {
  const f = document.createElement("div");
  f.className = "firework";
  f.style.left = Math.random() * window.innerWidth + "px";
  f.style.top = Math.random() * window.innerHeight + "px";
  f.style.background = `hsl(${Math.random() * 360}, 100%, 60%)`;
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 1200);
}

// Scroll functions
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// Navigation functions
function restartQuiz() {
  retryData[fileName].attempts += 1;
  localStorage.setItem("retryData", JSON.stringify(retryData));
  localStorage.setItem("restartQuiz", "true");
  window.location.href = "kiemtra.html";
}

function goBack() {
  localStorage.removeItem("quizQuestions");
  localStorage.removeItem("currentFileName");
  localStorage.removeItem("quizScore");
  localStorage.removeItem("quizCorrect");
  localStorage.removeItem("quizTotal");
  localStorage.removeItem("quizTime");
  localStorage.removeItem("quizWrongAnswers");
  localStorage.removeItem("quizCorrectAnswers");
  localStorage.removeItem("quizScale");
  localStorage.removeItem("retryData");
  localStorage.removeItem("restartQuiz");
  window.location.href = "index.html";
}

// Function to show violation warning
function showViolationWarning(message, backgroundColor, duration) {
  const warning = document.createElement("div");
  warning.className = "violation-warning";
  warning.style.backgroundColor = backgroundColor;
  warning.textContent = message;
  document.body.appendChild(warning);
  setTimeout(() => {
    warning.remove();
  }, duration);
}

// Block right-click
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  showViolationWarning("Lêu lêu! Không được click chuột phải đâu nhé!", '#ef4444', 3000);
});

// Block F12 and developer tool shortcuts
document.addEventListener('keydown', (e) => {
  // Block F12
  if (e.key === 'F12' || e.keyCode === 123) {
    e.preventDefault();
    e.stopPropagation();
    showViolationWarning("Lêu lêu! Không được mở công cụ phát triển đâu nhé!", '#ef4444', 3000);
    return false;
  }
  // Block Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S, Ctrl+T, Ctrl+P
  if (e.ctrlKey || e.metaKey) {
    if (['i', 'I', 'j', 'J', 'c', 'C', 'u', 'U', 's', 'S', 't', 'T', 'p', 'P'].includes(e.key) ||
        (e.ctrlKey && e.shiftKey && ['i', 'I', 'j', 'J', 'c', 'C'].includes(e.key))) {
      e.preventDefault();
      e.stopPropagation();
      showViolationWarning("Lêu lêu! Không được mở công cụ phát triển đâu nhé!", '#ef4444', 3000);
      return false;
    }
  }
});

// Additional protection for macOS-specific shortcuts (Cmd+Opt+I, Cmd+Opt+J, Cmd+Shift+C)
document.addEventListener('keydown', (e) => {
  if (e.metaKey && e.altKey && ['i', 'I', 'j', 'J'].includes(e.key)) {
    e.preventDefault();
    e.stopPropagation();
    showViolationWarning("Lêu lêu! Không được mở công cụ phát triển đâu nhé!", '#ef4444', 3000);
    return false;
  }
  if (e.metaKey && e.shiftKey && ['c', 'C'].includes(e.key)) {
    e.preventDefault();
    e.stopPropagation();
    showViolationWarning("Lêu lêu! Không được mở công cụ phát triển đâu nhé!", '#ef4444', 3000);
    return false;
  }
});

// This window.onload function was empty and commented out in your original code.
// No functionality has been added here as per the original.
window.onload = function() {
  // Removed violation and file upload display logic to match original ketqua.html
};

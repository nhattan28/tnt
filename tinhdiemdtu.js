function addRow() {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" placeholder="Tên môn học"></td>
    <td><input type="number" min="1" value="1"></td>
    <td><input type="number" step="0.1" min="0" max="10"></td>
    <td><button class="btn delete-btn" onclick="deleteRow(this)">Xóa</button></td>
  `;
  const tbody = document.getElementById("subjects");
  tbody.appendChild(row);
  
  // Thêm dòng này để cuộn tới dòng mới
  row.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function deleteRow(btn) {
  const row = btn.parentNode.parentNode;
  const tbody = document.getElementById("subjects");
  if (tbody.rows.length > 1) {
    tbody.removeChild(row);
  } else {
    alert("Phải có ít nhất 1 môn học!");
  }
}

// Thêm hàm này để xóa tất cả các hàng, chừa lại một hàng trống
function clearAllRows() {
  if (confirm("Bạn có chắc chắn muốn xóa tất cả các môn học đã nhập không?")) {
    const tbody = document.getElementById("subjects");
    // Xóa tất cả các hàng hiện có
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
    // Thêm lại một hàng trống ban đầu
    addRow();
  }
}

function convertTo4(score10) {
  if (score10 >= 9.5) return 4.0;
  if (score10 >= 8.5) return 4.0;
  if (score10 >= 8.0) return 3.65;
  if (score10 >= 7.5) return 3.33;
  if (score10 >= 7.0) return 3.0;
  if (score10 >= 6.5) return 2.65;
  if (score10 >= 6.0) return 2.33;
  if (score10 >= 5.5) return 2.0;
  if (score10 >= 4.5) return 1.65;
  if (score10 >= 4.0) return 1.0;
  return 0.0;
}

function getRank(avg4) {
  if (avg4 >= 3.6) return "Xuất sắc";
  if (avg4 >= 3.2) return "Giỏi";
  if (avg4 >= 2.5) return "Khá";
  if (avg4 >= 2.0) return "Trung bình";
  return "Yếu/Kém";
}

function calculate() {
  const rows = document.querySelectorAll("#subjects tr");
  let totalCredits = 0,
    sum10 = 0,
    sum4 = 0;
  let hasValidData = false;

  rows.forEach((r) => {
    const credits = parseFloat(r.children[1].children[0].value) || 0;
    const score10 = parseFloat(r.children[2].children[0].value) || 0;

    if (credits > 0 && score10 >= 0 && score10 <= 10) {
      hasValidData = true;
      const score4 = convertTo4(score10);

      totalCredits += credits;
      sum10 += score10 * credits;
      sum4 += score4 * credits;
    }
  });

  if (!hasValidData || totalCredits === 0) {
    alert(
      "Vui lòng nhập số tín chỉ và điểm hợp lệ cho ít nhất một môn học!"
    );
    return;
  }

  const avg10 = (sum10 / totalCredits).toFixed(2);
  const avg4 = (sum4 / totalCredits).toFixed(2);
  const rank = getRank(parseFloat(avg4));

  document.getElementById("totalCredits").innerText =
    `📚 Tổng số tín chỉ: ${totalCredits}`;
  document.getElementById("avg10").innerText =
    `📘 Trung bình gốc (thang 10): ${avg10}`;
  document.getElementById("avg4").innerText =
    `📗 Trung bình tích lũy (thang 4): ${avg4}`;
  document.getElementById("rank").innerText = `🏆 Xếp loại cuối: ${rank}`;

  document.getElementById("input-page").classList.add("hidden");
  document.getElementById("result-page").classList.remove("hidden");
}

function goBack() {
  document.getElementById("input-page").classList.remove("hidden");
  document.getElementById("result-page").classList.add("hidden");
}
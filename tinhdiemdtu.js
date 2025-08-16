// Function để hiển thị modal thông báo tùy chỉnh
function showModal(message, type = 'alert', onConfirm = null) {
  const modal = document.getElementById('custom-modal');
  const messageElement = document.getElementById('modal-message');
  const confirmBtn = document.getElementById('modal-confirm-btn');
  const cancelBtn = document.getElementById('modal-cancel-btn');

  messageElement.innerText = message;

  if (type === 'confirm') {
    confirmBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
    confirmBtn.onclick = () => {
      onConfirm();
      modal.style.display = 'none';
    };
    cancelBtn.onclick = () => {
      modal.style.display = 'none';
    };
  } else {
    confirmBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    modal.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };
  }

  modal.style.display = 'flex';
}

function addRow(subjectCode = '', credits = '', score10 = '') {
  const tbody = document.getElementById("subjects");
  const existingSubjectCodes = Array.from(tbody.querySelectorAll('input[type="text"]'))
    .map(input => input.value.trim().toUpperCase());

  if (subjectCode && existingSubjectCodes.includes(subjectCode.trim().toUpperCase())) {
    showModal(`Mã lớp "${subjectCode}" đã tồn tại. Vui lòng nhập mã lớp khác.`);
    return;
  }

  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" placeholder="Mã lớp" value="${subjectCode}"></td>
    <td><input type="number" min="" value="${credits}"placeholder="Số tín chỉ"></td>
    <td><input type="number" step="0.1" min="0" max="10" value="${score10}"placeholder="Thang điểm 10"></td>
    <td><button class="btn delete-btn" onclick="deleteRow(this)">Xóa</button></td>
  `;
  
  tbody.appendChild(row);
  
  row.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function deleteRow(btn) {
  const row = btn.parentNode.parentNode;
  const tbody = document.getElementById("subjects");
  if (tbody.rows.length > 1) {
    tbody.removeChild(row);
  } else {
    showModal("Phải có ít nhất 1 môn học!");
  }
}

// Hàm này giờ sẽ chỉ được gọi từ nút "Xóa Tất Cả"
function clearAllRows() {
  showModal("Bạn có chắc chắn muốn xóa tất cả các môn học đã nhập không?", 'confirm', () => {
    const tbody = document.getElementById("subjects");
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
    addRow();

    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = "";
    }
  });
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
    showModal(
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
    `📘 Trung bình gốc (thang điểm 10): ${avg10}`;
  document.getElementById("avg4").innerText =
    `📗 Trung bình tích lũy (thang điểm 4): ${avg4}`;
  document.getElementById("rank").innerText = `🏆 Xếp loại học lực đối với sinh viên năm cuối: ${rank}`;

  document.getElementById("input-page").classList.add("hidden");
  document.getElementById("result-page").classList.remove("hidden");
}

function goBack() {
  document.getElementById("input-page").classList.remove("hidden");
  document.getElementById("result-page").classList.add("hidden");
}

document.getElementById('fileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length < 2) {
      showModal("Tệp không có dữ liệu!");
      return;
    }
    
    // Tìm vị trí của các cột dựa trên tiêu đề ở bất kỳ dòng nào
    let subjectCodeIndex = -1, creditsIndex = -1, scoreIndex = -1;
    let dataStartIndex = -1;

    for (let i = 0; i < jsonData.length; i++) {
      const headers = jsonData[i];
      if (Array.isArray(headers)) {
        subjectCodeIndex = headers.findIndex(header => header && header.toString().trim() === 'Mã Lớp');
        creditsIndex = headers.findIndex(header => header && header.toString().trim() === 'Số ĐVHT');
        scoreIndex = headers.findIndex(header => header && header.toString().trim() === 'Điểm gốc');
      }

      if (subjectCodeIndex !== -1 && creditsIndex !== -1 && scoreIndex !== -1) {
        dataStartIndex = i + 1;
        break;
      }
    }

    if (dataStartIndex === -1) {
      showModal("Tệp Excel không có đủ các cột 'Mã Lớp', 'Số ĐVHT', và 'Điểm gốc'. Vui lòng kiểm tra lại tiêu đề cột.");
      return;
    }
    
    // Tự động xóa các hàng cũ mà không cần hỏi xác nhận
    const tbody = document.getElementById("subjects");
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
    
    const existingSubjectCodes = new Set();
    let hasAddedData = false;

    // Bắt đầu đọc dữ liệu từ hàng sau dòng tiêu đề
    for (let i = dataStartIndex; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row.length > 0) {
        const subjectCode = row[subjectCodeIndex] ? row[subjectCodeIndex].toString().trim() : '';
        const credits = parseFloat(row[creditsIndex]) || 0;
        const score10 = parseFloat(row[scoreIndex]) || 0;
        
        if (subjectCode && credits > 0 && score10 >= 0 && score10 <= 10) {
          const codeToCompare = subjectCode.toUpperCase();
          if (existingSubjectCodes.has(codeToCompare)) {
            console.warn(`Mã môn "${subjectCode}" bị trùng lặp trong file và đã bị bỏ qua.`);
            continue;
          }
          existingSubjectCodes.add(codeToCompare);
          addRow(subjectCode, credits, score10);
          hasAddedData = true;
        }
      }
    }
    
    // Nếu không có dữ liệu nào được thêm, thêm lại 1 hàng trống
    if (!hasAddedData) {
        addRow();
        showModal("Không có dữ liệu hợp lệ được tìm thấy trong tệp Excel.");
    }
  };
  reader.readAsArrayBuffer(file);
});

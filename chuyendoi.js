function convert() {
  const inputText = document.getElementById("input").value;
  const lines = inputText.split("\n");
  let output = "";
  let questionNumber = 1;
  let collectingAnswers = false;

  const normalizeAnswer = (line) => {
    // Chuẩn hóa đáp án: xóa khoảng trắng thừa và định dạng
    const match = line.match(/^(\*\*)?([a-dA-D])[\.\,\)]\s*/);
    if (match) {
      const isCorrect = match[1] ? "**" : "";
      const letter = match[2].toLowerCase();
      const content = line.replace(/^(\*\*)?[a-dA-D][\.\,\)]\s*/, "").trim();
      return `${isCorrect}${letter}) ${content}${isCorrect}`;
    }
    return line.trim();
  };

  lines.forEach(line => {
    let trimmed = line.trim(); // Xóa khoảng trắng thừa ở đầu và cuối dòng

    if (/^(Câu\s*\d+[\s:.\)]*|\d+[\s:.\)]*)/i.test(trimmed)) {
      // Xử lý câu hỏi: xóa khoảng trắng thừa sau số thứ tự
      const questionText = trimmed
        .replace(/^Câu\s*\d+[\s:.\)]*/i, "")
        .replace(/^\d+[\s:.\)]*/, "")
        .trim(); // Xóa khoảng trắng thừa sau câu hỏi
      output += `${questionNumber}. ${questionText}\n`;
      questionNumber++;
      collectingAnswers = true;
    } else if (collectingAnswers && /^(\*\*)?[A-D][\.\,\)]\s*/i.test(trimmed)) {
      // Xử lý đáp án: đảm bảo không có khoảng trắng thừa trước đáp án
      output += normalizeAnswer(trimmed) + "\n";
    } else if (trimmed === "") {
      output += "\n";
      collectingAnswers = false;
    } else {
      // Giữ các dòng không phải câu hỏi hoặc đáp án, xóa khoảng trắng thừa
      output += trimmed + "\n";
    }
  });

  const finalOutput = output.trim(); // Xóa khoảng trắng thừa ở đầu và cuối toàn bộ output
  document.getElementById("output").textContent = finalOutput;
  document.querySelector(".placeholder").style.opacity = finalOutput ? "0" : "1";
}

function copyOutput() {
  const text = document.getElementById("output").textContent;
  const tempTextarea = document.createElement("textarea");
  tempTextarea.value = text;
  document.body.appendChild(tempTextarea);
  tempTextarea.select();
  try {
    document.execCommand("copy");
    alert("✅ Đã sao chép kết quả!");
  } catch (err) {
    alert("❌ Sao chép thất bại.");
  }
  document.body.removeChild(tempTextarea);
}

function clearAll() {
  document.getElementById("input").value = "";
  document.getElementById("output").textContent = "";
  document.querySelector(".placeholder").style.opacity = "1";
}

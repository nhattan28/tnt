function convert() {
  const inputText = document.getElementById("input").value;
  const rawLines = inputText.split("\n");

  const mergedLines = [];
  let buffer = "";

  rawLines.forEach(line => {
    const trimmed = line.trim();

    // ⚠️ Nếu là dòng chỉ chứa "a)", "b)",... → không phải đáp án mới, mà là dòng phụ → gộp vào dòng trước
    if (/^[a-dA-D][\.\,\)]\s*$/.test(trimmed)) {
      buffer += " " + trimmed;
      return;
    }

    // Nếu là đáp án mới (a. / b) / C. ...)
    if (/^(\*\*)?[a-dA-D][\.\,\)]\s+/.test(trimmed)) {
      if (buffer) mergedLines.push(buffer.trim());
      buffer = trimmed;
    }
    // Nếu là dòng bắt đầu bằng "Câu" hoặc số thứ tự → câu hỏi mới
    else if (/^(Câu\s*\d+[\s:.\)]*|\d+[\s:.\)]*)/i.test(trimmed)) {
      if (buffer) mergedLines.push(buffer.trim());
      buffer = trimmed;
    }
    // Nếu dòng trắng → xuống dòng thực sự
    else if (trimmed === "") {
      if (buffer) mergedLines.push(buffer.trim());
      buffer = "";
      mergedLines.push("");
    }
    // Dòng phụ → gộp tiếp
    else {
      buffer += " " + trimmed;
    }
  });

  if (buffer) mergedLines.push(buffer.trim());

  const lines = [];

  mergedLines.forEach(line => {
    const answerPattern = /((\*\*)?[a-dA-D][\.\,\)])\s+/g;
    const answerMatches = [...line.matchAll(answerPattern)];

    if (answerMatches.length >= 2) {
      const parts = line.split(/(?=(\*\*)?[a-dA-D][\.\,\)]\s)/g).filter(Boolean);
      const allValid = parts.every(p => /^(\*\*)?[a-dA-D][\.\,\)]\s/.test(p));
      if (allValid) {
        parts.forEach(p => lines.push(p.trim()));
      } else {
        lines.push(line.trim());
      }
    } else {
      lines.push(line.trim());
    }
  });

  let output = "";
  let questionNumber = 1;
  let collectingAnswers = false;

  const normalizeAnswer = (line) => {
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
    const trimmed = line.trim();

    if (/^(Câu\s*\d+[\s:.\)]*|\d+[\s:.\)]*)/i.test(trimmed)) {
      const questionText = trimmed
        .replace(/^Câu\s*\d+[\s:.\)]*/i, "")
        .replace(/^\d+[\s:.\)]*/, "")
        .trim();
      output += `${questionNumber}. ${questionText}\n`;
      questionNumber++;
      collectingAnswers = true;
    } else if (collectingAnswers && /^(\*\*)?[a-dA-D][\.\,\)]\s*/.test(trimmed)) {
      output += normalizeAnswer(trimmed) + "\n";
    } else if (trimmed === "") {
      output += "\n";
      collectingAnswers = false;
    } else {
      output += trimmed + "\n";
    }
  });

  const finalOutput = output.trim();
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

async function pasteInput() {
  try {
    const text = await navigator.clipboard.readText();
    document.getElementById("input").value = text;
  } catch (err) {
    alert("❌ Không thể dán. Trình duyệt không hỗ trợ hoặc bạn chưa cho phép.");
  }
}

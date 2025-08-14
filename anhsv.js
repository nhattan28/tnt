// Chặn chuột phải và một số phím tắt phổ biến
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    // Chặn F12 và tổ hợp phím Ctrl + Shift + I/J/C
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) {
        e.preventDefault();
        alert('Truy cập công cụ nhà phát triển đã bị chặn.');
    }
    // Chặn phím tắt xem mã nguồn Ctrl + U
    if (e.ctrlKey && e.key === 'U') {
        e.preventDefault();
        alert('Xem mã nguồn đã bị chặn.');
    }
});

// Thêm sự kiện để phát hiện khi người dùng cố gắng mở Developer Tools
const devToolsStatus = () => {
    const threshold = 160;
    if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
        document.body.style.filter = 'blur(5px)';
        document.body.style.userSelect = 'none';
    } else {
        document.body.style.filter = 'none';
        document.body.style.userSelect = 'auto';
    }
};

window.addEventListener('resize', devToolsStatus);
window.addEventListener('load', devToolsStatus);
window.addEventListener('blur', () => {
    setTimeout(devToolsStatus, 100);
});
window.addEventListener('focus', () => {
    setTimeout(devToolsStatus, 100);
});

// Xử lý sự kiện dán và xóa
document.getElementById('paste-button').addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('student-id').value = text.trim();
    } catch (err) {
        alert('Không thể dán. Vui lòng cho phép quyền truy cập clipboard.');
    }
});

document.getElementById('clear-button').addEventListener('click', () => {
    document.getElementById('student-id').value = '';
});

// Xử lý sự kiện tìm kiếm
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const studentId = document.getElementById('student-id').value;

    if (studentId) {
        const imageUrl = `https://hfs1.duytan.edu.vn/Upload/dichvu/sv_${studentId}_01.jpg`;
        const imgElement = document.getElementById('student-image');

        imgElement.src = imageUrl;

        // Ẩn form và hiện khung ảnh
        document.getElementById('search-form-container').style.display = 'none';
        document.getElementById('image-view').style.display = 'block';
    }
});

// Xử lý sự kiện quay lại
document.getElementById('back-button').addEventListener('click', function() {
    // Hiện form và ẩn khung ảnh
    document.getElementById('search-form-container').style.display = 'block';
    document.getElementById('image-view').style.display = 'none';
    
    // Xóa nội dung ô nhập liệu
    document.getElementById('student-id').value = '';
});

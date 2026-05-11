# BÁO CÁO DỰ ÁN
## EcoCompost AI — Ứng dụng Tính toán Phân bón Hữu cơ Thông minh
### Trường THPT Thanh Nưa — Tỉnh Điện Biên

---

## 1. TỔNG QUAN DỰ ÁN

**EcoCompost AI** là một ứng dụng web miễn phí, chạy trực tiếp trên điện thoại hoặc máy tính (không cần cài đặt), giúp người nông dân và học sinh tính toán lượng phân bón hữu cơ lỏng (đạm hữu cơ) từ rác thải hữu cơ một cách nhanh chóng và chính xác.

| Thông tin | Chi tiết |
|-----------|----------|
| Tên ứng dụng | EcoCompost AI |
| Địa chỉ truy cập | https://cuong-bo.github.io/ecocompost-ai |
| Nền tảng | Web — dùng được trên mọi thiết bị có trình duyệt |
| Chi phí sử dụng | Miễn phí hoàn toàn |
| Ngôn ngữ | Tiếng Việt |
| Đơn vị phát triển | Trường THPT Thanh Nưa, tỉnh Điện Biên |

---

## 2. VẤN ĐỀ DỰ ÁN GIẢI QUYẾT

Nông dân và học sinh tại các vùng nông thôn thường gặp khó khăn trong việc:

- **Pha chế phân bón không đúng tỉ lệ** → cây bị cháy rễ hoặc không đủ dinh dưỡng
- **Không biết dùng bao nhiêu IMO và mật rỉ đường** cho từng loại rác hữu cơ
- **Lịch tưới phân không phù hợp** với từng loại cây và mùa vụ
- **Không tận dụng được rác hữu cơ** sẵn có (rau củ, trái cây, xác cá, bã đậu...)

EcoCompost AI giải quyết toàn bộ các vấn đề trên chỉ trong vài giây, ngay trên điện thoại.

---

## 3. TÍNH NĂNG CHÍNH

### 3.1 Tính toán công thức ủ phân
Người dùng nhập vào:
- Số kg rác hữu cơ có sẵn
- Loại rác (rau củ, trái cây, xác cá, bã đậu, xương động vật, hỗn hợp)
- Màu sắc rác (xanh, vàng, nâu, đen)
- Loại cây trồng (rau ăn lá, lúa, cây ăn trái, hoa màu, cà chua, dưa leo)
- Nhiệt độ và độ ẩm môi trường
- Mùa vụ (mùa mưa / mùa nắng)
- Diện tích đất canh tác

Ứng dụng tự động tính và hiển thị:
- **Lượng IMO** cần dùng (ml)
- **Lượng mật rỉ đường** (lít)
- **Lượng nước pha** (lít)
- **Độ ẩm đống ủ** mục tiêu (%)
- **Sản lượng đạm hữu cơ lỏng** dự kiến (lít)
- **Tỉ lệ pha tưới** phù hợp từng loại cây
- **Mật độ phân bón** trên diện tích đất (kg/m²)
- **Lịch tưới định kỳ** (bao nhiêu ngày/lần)

### 3.2 Nhận diện rác bằng camera AI
- Chụp ảnh đống rác → AI tự động nhận diện loại rác và màu sắc
- Tự động điền vào form, tiết kiệm thời gian nhập liệu
- Hoạt động ngay trên thiết bị, không cần gửi ảnh lên internet

### 3.3 Hỗ trợ giọng nói (Text-to-Speech)
- Mỗi ô nhập liệu có biểu tượng loa 🔊
- Nhấn vào để nghe hướng dẫn bằng tiếng Việt
- Phù hợp với người dùng ít quen công nghệ hoặc người cao tuổi
- Nút **"Nghe kết quả"** đọc toàn bộ kết quả tính toán bằng giọng nói

### 3.4 Nhập liệu bằng giọng nói
- Các ô nhập số hỗ trợ nhận dạng giọng nói
- Nhấn biểu tượng microphone 🎤, nói số → tự động điền vào ô

### 3.5 Quản lý dữ liệu tập trung (Firebase Cloud)
- Mỗi lần tính toán được lưu tự động lên đám mây
- Quản trị viên (giáo viên) có thể xem **toàn bộ dữ liệu của tất cả học sinh** trên mọi thiết bị
- Không cần thu thập thủ công

### 3.6 Bảng quản trị dành cho giáo viên
Đăng nhập bằng tài khoản riêng để truy cập:

| Tab | Nội dung |
|-----|----------|
| Lịch sử | Xem từng lần tính toán: thời gian, loại cây, loại rác, sản lượng |
| Thống kê | Biểu đồ tổng hợp theo loại cây, loại rác, sản lượng |
| Xuất file | Tải báo cáo PDF (in được) hoặc file Excel (CSV) |

---

## 4. CÁCH SỬ DỤNG

### Dành cho học sinh / người dùng thông thường

```
Bước 1: Mở trình duyệt → truy cập https://cuong-bo.github.io/ecocompost-ai
Bước 2: Nhập thông tin (hoặc chụp ảnh rác để AI nhận diện tự động)
Bước 3: Nhấn "Tính toán"
Bước 4: Đọc kết quả (hoặc nhấn "Nghe kết quả" để nghe giọng nói)
Bước 5: Thực hiện theo công thức và lịch tưới được đề xuất
```

### Dành cho giáo viên / quản trị viên

```
Bước 1: Cuộn xuống cuối trang → nhấn "Admin"
Bước 2: Đăng nhập bằng tài khoản quản trị
Bước 3: Xem lịch sử, thống kê, xuất báo cáo toàn trường
```

---

## 5. CÔNG NGHỆ SỬ DỤNG

| Thành phần | Công nghệ | Ý nghĩa thực tế |
|------------|-----------|-----------------|
| Giao diện | React + TailwindCSS | Web app chạy mượt trên điện thoại |
| AI nhận diện ảnh | MobileNet (TensorFlow.js) | Chạy trên thiết bị, không cần server |
| Giọng nói | Web Speech API | Đọc và nhận dạng tiếng Việt |
| Lưu trữ đám mây | Firebase Firestore (Google) | Đồng bộ dữ liệu nhiều người dùng |
| Hosting | GitHub Pages | Miễn phí, ổn định, không cần máy chủ |
| Xuất báo cáo | jsPDF + PapaParse | Tạo PDF và CSV trực tiếp trên trình duyệt |

---

## 6. ĐỐI TƯỢNG SỬ DỤNG

- **Học sinh** trường THPT Thanh Nưa trong các giờ học thực hành nông nghiệp
- **Giáo viên** theo dõi và tổng hợp kết quả thực hành của cả lớp
- **Người nông dân** địa phương muốn áp dụng phân bón hữu cơ vào canh tác
- **Phụ huynh** có vườn rau, ao cá muốn tận dụng rác hữu cơ

---

## 7. ĐIỂM NỔI BẬT SO VỚI PHƯƠNG PHÁP TRUYỀN THỐNG

| Tiêu chí | Phương pháp cũ | EcoCompost AI |
|----------|----------------|---------------|
| Thời gian tính | 15–30 phút (tra bảng, tính tay) | Dưới 5 giây |
| Độ chính xác | Phụ thuộc kinh nghiệm | Theo công thức chuẩn |
| Tổng hợp dữ liệu lớp | Thu thập giấy tờ thủ công | Tự động lên đám mây |
| Hỗ trợ người mới | Cần đào tạo nhiều | Có hướng dẫn giọng nói |
| Chi phí | In tài liệu, đào tạo | Miễn phí hoàn toàn |
| Thiết bị cần thiết | Máy tính + sách tra | Bất kỳ điện thoại nào |

---

## 8. KẾT QUẢ KỲ VỌNG

- Học sinh nắm vững quy trình ủ phân hữu cơ qua thực hành có hỗ trợ công nghệ
- Giảm lãng phí rác thải hữu cơ trong trường và địa phương
- Tăng năng suất cây trồng nhờ bón phân đúng liều lượng và lịch trình
- Giáo viên có báo cáo tổng hợp định kỳ mà không tốn thời gian thu thập
- Lan rộng mô hình ứng dụng công nghệ vào nông nghiệp tại địa phương

---

## 9. THÔNG TIN DỰ ÁN

| | |
|--|--|
| Đơn vị thực hiện | Trường THPT Thanh Nưa, tỉnh Điện Biên |
| Địa chỉ ứng dụng | https://cuong-bo.github.io/ecocompost-ai |
| Năm phát triển | 2026 |
| Chi phí vận hành | Miễn phí (GitHub Pages + Firebase Free Tier) |

---

*Tài liệu này được soạn thảo để giới thiệu dự án EcoCompost AI đến ban lãnh đạo nhà trường, phụ huynh học sinh và các đơn vị đối tác địa phương.*

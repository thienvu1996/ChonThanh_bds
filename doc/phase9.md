SYSTEM DIRECTIVE: Continue "BĐS Chơn Thành" project. Strictly adhere to GEMINI.md rules.

EXECUTE PHASE 9: PROPERTY DETAIL PAGE & ADVANCED SEARCH FILTER

═══════════════════════════════════════════════════════
TASK 1 — Trang Chi Tiết BĐS (src/pages/PropertyDetailPage.jsx)
═══════════════════════════════════════════════════════
- Route: /bat-dong-san/:id (thêm vào App.jsx)
- Fetch chi tiết BĐS từ json-server: GET http://localhost:3001/properties/:id
- Fallback: nếu lỗi hoặc không tìm thấy → hiển thị trang 404 đẹp.

Layout (2 cột trên desktop, 1 cột trên mobile):
  CỘT TRÁI (lg:col-span-7):
  1. Image Gallery:
     - Ảnh chính (lớn) + thumbnails hàng ngang bên dưới (click để đổi ảnh chính).
     - Fallback: /assets/placeholder-land.jpg nếu images rỗng.

  2. Tabs thông tin: [Tổng quan] [Bản đồ] [Mô tả]
     - Tab "Tổng quan": hiển thị grid các thông số:
       Diện tích | Mặt tiền | Pháp lý | Loại BĐS | Trạng thái | Ngày đăng
     - Tab "Bản đồ": dùng Leaflet (lazy load giống ManagePropertiesPage) hiển thị
       coordinates đã lưu trong db. Map height 360px, KHÔNG cho kéo ghim (readOnly).
     - Tab "Mô tả": render property.description, nếu rỗng thì fallback text đẹp.

  CỘT PHẢI (lg:col-span-5) — Sticky trên desktop:
  - Card giá nổi bật: formattedPrice (màu xanh đậm, font lớn)
  - Nút CTA sticky mobile (bottom-0 fixed):
    [📞 Gọi Ngay] (href: tel:settings.phone) màu xanh
    [💬 Chat Zalo] (href: zalo link) màu lá
  - Form liên hệ nhanh: Họ tên + SĐT + textarea Ghi chú → onSubmit alert "Đã gửi yêu cầu!"
  - Tags: hiển thị property.tags dạng badge

- Breadcrumb: Trang chủ > [Loại BĐS] > [Tiêu đề rút gọn]
- SEO: <title>{property.title} | BĐS Chơn Thành</title>

═══════════════════════════════════════════════════════
TASK 2 — Bộ Lọc Nâng Cao (src/components/home/SearchFilter.jsx)
═══════════════════════════════════════════════════════
- Tích hợp vào HomePage.jsx (hiển thị ngay dưới Hero section, trên PropertyGrid).
- Bộ lọc gồm các trường:
  * Loại BĐS: dropdown [Tất cả | Đất nền | Đất vườn | Nhà ở | Nhà phố]
  * Khoảng giá: 2 select [Từ] [Đến] với các mốc:
    0 | 500 Triệu | 1 Tỷ | 2 Tỷ | 5 Tỷ | 10 Tỷ | Không giới hạn
  * Diện tích tối thiểu: select [Tất cả | ≥ 50m² | ≥ 100m² | ≥ 200m² | ≥ 500m²]
  * Trạng thái: [Tất cả | Đang bán | Đã bán | Đang cọc]
  * Nút "Tìm kiếm" (màu xanh) + nút "Xóa bộ lọc" (ghost)

- Logic lọc chạy CLIENT-SIDE (không gọi API thêm) trên mảng properties đã fetch.
- Khi không có kết quả: hiển thị empty state đẹp "Không tìm thấy BĐS phù hợp".
- Số lượng kết quả hiển thị: "Tìm thấy X bất động sản"

- Các PropertyCard phải có href → /bat-dong-san/:id (thay vì không link đi đâu).

═══════════════════════════════════════════════════════
TASK 3 — Cập nhật App.jsx
═══════════════════════════════════════════════════════
- Thêm route: <Route path="/bat-dong-san/:id" element={<PropertyDetailPage />} />
- Import PropertyDetailPage

Output: PropertyDetailPage.jsx, SearchFilter.jsx, cập nhật HomePage.jsx, App.jsx.

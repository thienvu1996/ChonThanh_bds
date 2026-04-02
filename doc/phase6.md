SYSTEM DIRECTIVE: Continue "BĐS Chơn Thành" project. Strictly adhere to GEMINI.md rules. We need to build the secondary pages to make the website a complete corporate platform.

EXECUTE PHASE 7: ABOUT & CONTACT PAGES
1. Create 'src/pages/AboutPage.jsx':
- Build a professional corporate page.
- Section 1: Hero banner with a title "Về Chúng Tôi - BĐS Chơn Thành".
- Section 2: "Giá trị cốt lõi" (Uy tín, Tận tâm, Minh bạch) using a 3-column grid with Lucide icons.
- Section 3: "Tầm nhìn & Sứ mệnh" text block.

2. Create 'src/pages/ContactPage.jsx':
- Layout: 2 columns on Desktop, 1 column on Mobile.
- Left Column: A modern Contact Form (Họ tên, Số điện thoại, Nhu cầu mua/bán). Add a "Gửi Yêu Cầu" button with a hover effect.
- Right Column: Company Info box (Address in Chơn Thành, Hotline, Email) and re-use the Leaflet Map here to show the office location.

3. Update 'src/components/common/Header.jsx':
- Convert standard `<a>` tags to React Router `<Link>` components.
- Include these exact navigation items: "Trang Chủ" (/), "Giới Thiệu" (/about), "Sản Phẩm" (/properties), "Liên Hệ" (/contact).

4. Update 'src/App.jsx':
- Import `AboutPage` and `ContactPage`.
- Add `<Route path="/about" element={<AboutPage />} />`
- Add `<Route path="/contact" element={<ContactPage />} />`

Output the complete code for AboutPage.jsx, ContactPage.jsx, Header.jsx, and App.jsx.
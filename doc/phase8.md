SYSTEM DIRECTIVE: Continue "BĐS Chơn Thành" project. Strictly adhere to GEMINI.md rules. We need to build the missing pages based on the finalized navigation menu.

EXECUTE PHASE 7: CATEGORY, NEWS, AND CONTACT PAGES
1. Update 'src/components/common/Header.jsx':
- Update the navigation links array to EXACTLY this:
  [
    { label: "Trang Chủ", href: "/" },
    { label: "Đất Nền", href: "/dat-nen" },
    { label: "Nhà Ở", href: "/nha-o" },
    { label: "Tin Tức", href: "/tin-tuc" },
    { label: "Liên Hệ", href: "/lien-he" }
  ]
- Ensure standard `<Link to={item.href}>` from 'react-router-dom' is used. Add active state styling (e.g., text-blue-600 font-bold when active).

2. Create 'src/pages/DatNenPage.jsx' & 'src/pages/NhaOPage.jsx':
- Both pages should reuse the `<PropertyGrid />` component.
- DatNenPage: Add a top banner/header "Danh sách Đất Nền Chơn Thành". Fetch properties and filter ONLY those where type/category is 'đất nền'.
- NhaOPage: Add a top banner/header "Danh sách Nhà Ở Chơn Thành". Fetch properties and filter ONLY those where type/category is 'nhà ở'.
- Provide a clear layout with padding and a breadcrumb if possible.

3. Create 'src/pages/TinTucPage.jsx':
- Build a Blog/News list layout.
- Create a mock array of 3-4 news articles (title, date, short excerpt, placeholder image url).
- Render them in a CSS Grid (`grid-cols-1 md:grid-cols-3 gap-8`). Make the article cards clickable (hover effects) with a "Đọc tiếp" button.

4. Create 'src/pages/LienHePage.jsx':
- Build a professional Contact Page. Layout: 2 columns on Desktop (`md:grid md:grid-cols-2`).
- Left Column: A modern "Gửi Yêu Cầu" Form (Inputs: Họ tên, SĐT, Nội dung). Include a prominent submit button.
- Right Column: Company Info (Address: Chơn Thành - Bình Phước, Hotline, Email). You can reuse the OpenStreetMap component here if available, or just output a clean info card.

5. Update 'src/App.jsx':
- Import `DatNenPage`, `NhaOPage`, `TinTucPage`, `LienHePage`.
- Add the corresponding `<Route>` tags inside `<MainLayout>`:
  `<Route path="/dat-nen" element={<DatNenPage />} />`
  `<Route path="/nha-o" element={<NhaOPage />} />`
  `<Route path="/tin-tuc" element={<TinTucPage />} />`
  `<Route path="/lien-he" element={<LienHePage />} />`

Output the complete code for Header.jsx, DatNenPage.jsx, NhaOPage.jsx, TinTucPage.jsx, LienHePage.jsx, and App.jsx.
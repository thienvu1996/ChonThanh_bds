SYSTEM DIRECTIVE: Continue "BĐS Chơn Thành" project. We are building the internal Admin CMS. Adhere to GEMINI.md rules.

EXECUTE PHASE 8: ADMIN DASHBOARD FOUNDATION
1. Create 'src/layouts/AdminLayout.jsx':
- This layout is separate from MainLayout. It MUST NOT have the public Header/Footer.
- Build a dashboard layout: A fixed Sidebar on the left (bg-gray-900, text-white) and a main content area on the right with a top Topbar (showing "Admin User" and a logout button).
- Sidebar Menu Items: "Tổng quan", "Quản lý BĐS", "Cài đặt". Use Lucide icons.
- Ensure the Sidebar is responsive (hidden behind a hamburger menu on mobile).

2. Create 'src/pages/admin/DashboardPage.jsx':
- Build a stats overview grid (4 cards): "Tổng số BĐS", "Đã bán", "Đang chờ duyệt", "Lượt xem". Use colorful icons for each card.

3. Create 'src/pages/admin/ManagePropertiesPage.jsx':
- Build a Data Table to list properties.
- Table Columns: ID, Hình ảnh (small thumbnail), Tiêu đề, Giá, Trạng thái (Đang bán/Đã bán using green/red badges), Hành động (Edit/Delete icons).
- Add a primary "Thêm BĐS Mới" button at the top right of the table.

4. Update 'src/App.jsx':
- Add a nested route structure for the admin area:
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<DashboardPage />} />
    <Route path="properties" element={<ManagePropertiesPage />} />
  </Route>

Output the complete code for AdminLayout.jsx, DashboardPage.jsx, ManagePropertiesPage.jsx, and App.jsx.
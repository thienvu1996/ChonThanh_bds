SYSTEM DIRECTIVE: Continue "BĐS Chơn Thành" project. Strictly adhere to GEMINI.md rules.

EXECUTE PHASE 10: KEYWORD SEARCH & ADMIN CRM REFINEMENT

═══════════════════════════════════════════════════════
TASK 1 — Keyword Search & Filter UX (src/components/home/SearchFilter.jsx)
═══════════════════════════════════════════════════════
- Add "Keyword Search" (text input):
  * Placeholder: "Tìm theo tên, địa chỉ, hoặc từ khóa..."
  * Icon: Lucide Search
  * Integration: Add to filtering logic in HomePage.jsx.
- Mobile UX: 
  * Make the filter "Collapsible" (Thu gọn / Mở rộng) on mobile (below <sm).
  * Show summary of active filters when collapsed.

═══════════════════════════════════════════════════════
TASK 2 — Admin CRM & Lead Polishing (src/pages/admin/LeadsPage.jsx)
═══════════════════════════════════════════════════════
- Improve Lead Card/Table:
  * Show "Quick Notes" field (text field) for each lead to record progress.
  * Add a "Copy to Clipboard" button for phone numbers.
  * Link "Property Name" directly to the public property page.
- Admin Layout:
  * Add a dynamic notification badge (red circle) to the "Khách hàng" menu item in AdminLayout.jsx if any lead has status "NEW".

Output: SearchFilter.jsx, HomePage.jsx, LeadsPage.jsx, AdminLayout.jsx.

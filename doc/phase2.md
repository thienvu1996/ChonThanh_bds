
SYSTEM DIRECTIVE: Continue "BĐS Chơn Thành" project. Adhere to Tailwind and Mobile-first rules.

EXECUTE STEP 2: API & MAIN LAYOUT
1. Create '.env.development' (VITE_API_BASE_URL=http://localhost:8080/api, VITE_USE_MOCK_DATA=true).
2. Create '.env.production' (VITE_API_BASE_URL=https://api.bdschonthanh.com/v1, VITE_USE_MOCK_DATA=false).
3. Create 'src/services/api.js'. Write a service using native fetch. Export 'fetchProperties' and 'fetchPropertyDetails'. Implement the logic to check 'VITE_USE_MOCK_DATA': if true, return data from 'mockData.js' with a 500ms simulated delay. If false, fetch from BASE_URL.
4. Create 'src/components/common/Header.jsx' (Logo left, standard navigation, Hotline right) and 'Footer.jsx'.
5. Create 'src/components/common/StickyZalo.jsx'. Must contain 2 buttons: "Gọi Ngay" and "Chat Zalo". 
6. Create 'src/layouts/MainLayout.jsx'. Use 'min-h-screen flex flex-col'. Render Header, main (flex-grow), and Footer. 
CRITICAL: Render <StickyZalo /> with fixed positioning at the bottom of the viewport so it is always visible on mobile screens.
Output the complete code for all 6 files.
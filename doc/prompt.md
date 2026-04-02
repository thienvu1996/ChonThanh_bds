SYSTEM DIRECTIVE: The client has approved the UI demo for "BĐS Chơn Thành". We are moving directly to PRODUCTION execution. Strictly adhere to the '.cursorrules' regarding Tailwind, Mobile-first, and Vietnamese Real Estate context. Execute the following 5 phases sequentially:

PHASE 1: FOLDER STRUCTURE & BOILERPLATE
Create these directories and empty .jsx files in 'src':
- src/components/common/ (Header.jsx, Footer.jsx, StickyZalo.jsx)
- src/components/home/ (HeroBanner.jsx, SearchFilter.jsx, PropertyGrid.jsx)
- src/components/property/ (MediaSlider.jsx, PropertyInfo.jsx, AmenitiesList.jsx, SimilarItems.jsx)
- src/layouts/ (MainLayout.jsx)
- src/pages/ (HomePage.jsx, PropertyDetailPage.jsx)
- src/utils/ (mockData.js)
- src/services/ (api.js)

PHASE 2: MOCK DATA SETUP
Populate 'src/utils/mockData.js' with a comprehensive JSON object exported as 'mockPropertyData' representing a Vietnamese land plot (fields: id, title, price, formattedPrice like "1.2 Tỷ", area, formattedArea like "150 m²", frontage, roadWidth, legalStatus, planningStatus, images array, surroundingAmenities array).

PHASE 3: ENVIRONMENT & API CONFIGURATION
1. Create '.env.development' (VITE_API_BASE_URL=http://localhost:8080/api, VITE_USE_MOCK_DATA=true).
2. Create '.env.production' (VITE_API_BASE_URL=https://api.bdschonthanh.com/v1, VITE_USE_MOCK_DATA=false).
3. Populate 'src/services/api.js' using 'fetch'. Check 'import.meta.env.VITE_USE_MOCK_DATA'. If true, simulate network delay and return 'mockPropertyData'. If false, make a real GET request to the BASE_URL.

PHASE 4: BASE LAYOUT SCAFFOLDING
Write 'src/layouts/MainLayout.jsx'. Use a full-height flexbox. Render <Header /> top, 'children' in a flex-grow <main>, and <Footer /> bottom. Crucially, position <StickyZalo /> fixed at the bottom for mobile.

PHASE 5: PRODUCTION BUILD - PROPERTY DETAIL PAGE
Write 'src/pages/PropertyDetailPage.jsx'.
1. Fetch data using the service from 'api.js' inside a 'useEffect'. Manage loading state.
2. Build a responsive container: single column on mobile, 2-column grid on desktop (md:grid-cols-12).
3. Left col (md:col-span-7): Render <MediaSlider />.
4. Right col (md:col-span-5): Render <PropertyInfo /> and <AmenitiesList />.
Ensure complete, robust code is outputted for all requested files.
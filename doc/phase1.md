SYSTEM DIRECTIVE: MASTER RULES FOR "BĐS CHƠN THÀNH"
You are a Senior Frontend Engineer. Use React, Tailwind CSS strictly, and Mobile-first responsive design. No standard CSS.

EXECUTE STEP 1: SCAFFOLDING & MOCK DATA
1. Create the exact folder structure inside 'src':
- components/common/
- components/home/
- components/property/
- layouts/
- pages/
- utils/
- services/

2. Create 'src/utils/mockData.js'.
Write a highly detailed JSON object exported as 'mockPropertyData' representing a premium Vietnamese land plot. Include:
- id: "bds-001"
- title: "Đất nền trung tâm Chơn Thành, thổ cư 100%"
- price: 1200000000
- formattedPrice: "1.2 Tỷ"
- area: 150
- formattedArea: "150 m²"
- dimensions: "5m x 30m"
- roadWidth: "12m (Nhựa)"
- legalStatus: "Sổ hồng riêng"
- planningStatus: "Đất ở tại đô thị (ODT)"
- description: "Vị trí đắc địa, cách KCN 2km, phù hợp xây trọ hoặc đầu tư sinh lời."
- images: Array of 3 realistic placeholder image URLs.
- amenities: Array of objects (e.g., { name: "Chợ Chơn Thành", distance: "500m" }).
Also export 'mockPropertyList' containing 6 variations of this data for the homepage.
Output the complete code for 'mockData.js'.
SYSTEM DIRECTIVE: Continue "BĐS Chơn Thành" project. This is the final UI phase. Prioritize premium UX micro-interactions.

EXECUTE STEP 4: HOMEPAGE & UX ENHANCEMENT
1. Create 'src/components/home/HeroBanner.jsx'. Use a large, high-quality real estate background image. Apply a dark overlay (`bg-black/50`). Center a bold, white Vietnamese headline ("Khám Phá Bất Động Sản Chơn Thành").
2. Create 'src/components/home/SearchFilter.jsx'. Design this as a FLOATING CARD (`absolute`, `bottom-0`, `translate-y-1/2`, `shadow-xl`, `bg-white`, `rounded-lg`). Include 3 select dropdowns (Khu vực, Mức giá, Diện tích) and a primary "Tìm Kiếm" button.
3. Create 'src/components/home/PropertyGrid.jsx'. Use `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`. Create a PropertyCard component for the list.
4. Create 'src/pages/HomePage.jsx'. Fetch 'fetchProperties' from 'api.js'. Render HeroBanner (with SearchFilter overlapping its bottom edge) and the PropertyGrid below it.
5. CRITICAL UX MANDATE: Apply smooth Tailwind transitions across all files. Add `group-hover:scale-105 transition-transform duration-300` to property images. Add `hover:bg-opacity-90` or `hover:-translate-y-1` to all buttons. Ensure all loading states have a spinning icon.
Output the complete code for all 4 files.

SYSTEM DIRECTIVE: Continue "BĐS Chơn Thành" project. Adhere to Tailwind, Strict Theme, and Mobile-first rules.

EXECUTE STEP 3: PROPERTY DETAIL PAGE BUILD
1. Create 'src/components/property/MediaSlider.jsx'. Build an image gallery showing the main image and thumbnails below it.
2. Create 'src/components/property/PropertyInfo.jsx'. Build a clean, high-contrast block displaying formattedPrice (large, text-red-600), formattedArea, dimensions, legalStatus, and description.
3. Create 'src/components/property/AmenitiesList.jsx'. Map through the amenities array and display them with checkmark icons.
4. Create 'src/pages/PropertyDetailPage.jsx'. 
- Use 'useEffect' to call 'fetchPropertyDetails' from 'api.js'. Handle loading state (spinner) and error state.
- Layout: Build a responsive container. It MUST be 'flex-col' (single column) on mobile screens. On desktop, use 'md:grid md:grid-cols-12 md:gap-8'.
- Render <MediaSlider /> in the left column ('md:col-span-7').
- Render <PropertyInfo /> and <AmenitiesList /> in the right column ('md:col-span-5').
Output the complete code for all 4 files.
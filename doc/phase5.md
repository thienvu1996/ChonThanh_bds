SYSTEM DIRECTIVE: Continue "BĐS Chơn Thành" project. Strictly adhere to GEMINI.md rules. We are implementing a free OpenStreetMap integration.

EXECUTE PHASE 5: OPENSTREETMAP INTEGRATION
1. Update 'src/utils/mockData.js': 
Add a 'coordinates' object to 'mockPropertyData' with approximate coordinates for Chơn Thành, Bình Phước (e.g., `coordinates: { lat: 11.4395, lng: 106.5985 }`). Ensure this is also reflected in the 'mockPropertyList' items.

2. Create 'src/components/property/PropertyMap.jsx':
- Import `MapContainer`, `TileLayer`, `Marker`, `Popup` from 'react-leaflet'.
- CRITICAL: Import Leaflet CSS (`import 'leaflet/dist/leaflet.css';`).
- CRITICAL FIX: Fix the Leaflet default icon path issue in React by overriding the default icon URLs (using standard Leaflet marker icon URLs from unpkg/cdnjs).
- The component must accept `coordinates` (lat, lng) as props.
- Render the map with Tailwind styling: `h-80 w-full rounded-xl shadow-md z-0` (keep z-index low so it doesn't overlap sticky headers).
- Use the standard OSM tile URL: `url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"`.

3. Update 'src/pages/PropertyDetailPage.jsx':
- Import `<PropertyMap />`.
- Render the map inside the Right Column (below `AmenitiesList` or `PropertyInfo`), passing the `propertyData.coordinates` to it. Add a nice section title like "Vị trí trên bản đồ".

Output the complete, updated code for 'mockData.js', 'PropertyMap.jsx', and 'PropertyDetailPage.jsx'.
// src/components/property/PropertyMap.jsx
// Bản đồ OpenStreetMap dùng react-leaflet
// Hiển thị vị trí thửa đất cùng địa chỉ chi tiết

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation } from "lucide-react";

// Fix Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/**
 * @param {{ coordinates: { lat: number, lng: number }, title?: string, address?: string }} props
 */
export default function PropertyMap({ coordinates, title = "Vị trí BĐS", address }) {
  const [isSatellite, setIsSatellite] = useState(true);

  if (!coordinates?.lat || !coordinates?.lng) return null;

  const position = [coordinates.lat, coordinates.lng];
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;

  const SATELLITE_LAYER = {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  };

  const STREET_LAYER = {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; OpenStreetMap',
  };

  const activeLayer = isSatellite ? SATELLITE_LAYER : STREET_LAYER;

  return (
    <div className="space-y-4">
      {/* Map Control */}
      <div className="flex justify-between items-center bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 pl-2">
          <MapPin className="w-4 h-4 text-red-500" />
          <span className="text-xs font-bold text-gray-700 truncate max-w-[200px]">{address || "Vị trí thửa đất"}</span>
        </div>
        <button
          onClick={() => setIsSatellite(!isSatellite)}
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-black bg-blue-50 text-blue-600 px-4 py-2 rounded-xl transition-all hover:bg-blue-600 hover:text-white"
        >
          {isSatellite ? "🗺️ Bản đồ" : "🛰️ Vệ tinh"}
        </button>
      </div>

      {/* Actual Map */}
      <div className="h-80 w-full rounded-3xl overflow-hidden shadow-inner border border-gray-100 z-0 relative group">
        <MapContainer
          center={position}
          zoom={17}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            key={activeLayer.url}
            attribution={activeLayer.attribution}
            url={activeLayer.url}
          />
          <Marker position={position}>
            <Popup>
              <div className="p-1 min-w-[150px]">
                <h4 className="font-black text-blue-700 text-sm mb-1">{title}</h4>
                <p className="text-gray-500 text-[10px] mb-2 leading-tight font-medium">{address}</p>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1 bg-blue-600 text-white font-black py-2 px-3 rounded-lg text-[9px] uppercase tracking-tighter hover:bg-blue-700 transition"
                >
                  <Navigation className="w-3 h-3" /> Chỉ đường chi tiết
                </a>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
        
        {/* Floating Google Maps Link */}
        <a 
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-4 right-4 z-[1000] bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-black text-gray-800 hover:scale-105 transition active:scale-95 border border-white/50"
        >
          <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
            <Navigation className="w-4 h-4" />
          </div>
          XEM TRÊN GOOGLE MAPS
        </a>
      </div>
    </div>
  );
}

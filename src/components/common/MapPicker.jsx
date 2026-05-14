import React, { useEffect, useRef } from "react";

/**
 * @param {{ lat: number, lng: number, onChange: (coords: {lat: number, lng: number}) => void, height?: number }} props
 */
export default function MapPicker({ lat, lng, onChange, height = 200 }) {
    const mapRef = useRef(null);
    const instanceRef = useRef(null);
    const markerRef = useRef(null);
    const layerRef = useRef(null);
    const isInternalChange = useRef(false);
    const [isSatellite, setIsSatellite] = React.useState(true);

    const SATELLITE_URL = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    const STREET_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    useEffect(() => {
        // Inject Leaflet CSS
        if (!document.getElementById("leaflet-css")) {
            const link = document.createElement("link");
            link.id = "leaflet-css";
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            document.head.appendChild(link);
        }

        // Load Leaflet JS
        const loadLeaflet = (cb) => {
            if (window.L) return cb(window.L);
            const script = document.createElement("script");
            script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
            script.onload = () => cb(window.L);
            document.body.appendChild(script);
        };

        loadLeaflet((L) => {
            if (instanceRef.current || !mapRef.current) return;

            const map = L.map(mapRef.current).setView([lat, lng], 15);
            const layer = L.tileLayer(isSatellite ? SATELLITE_URL : STREET_URL, {
                attribution: isSatellite ? "Tiles © Esri" : "© OpenStreetMap",
            }).addTo(map);

            layerRef.current = layer;

            const icon = L.divIcon({
                className: "",
                html: `<div style="width:28px;height:28px;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px #0004;display:flex;align-items:center;justify-content:center;">
          <div style="width:8px;height:8px;background:white;border-radius:50%;"></div></div>`,
                iconAnchor: [14, 14],
            });

            const marker = L.marker([lat, lng], { draggable: true, icon }).addTo(map);
            markerRef.current = marker;
            instanceRef.current = map;

            marker.on("dragend", () => {
                const { lat: newLat, lng: newLng } = marker.getLatLng();
                isInternalChange.current = true;
                onChange({ lat: parseFloat(newLat.toFixed(6)), lng: parseFloat(newLng.toFixed(6)) });
            });

            map.on("click", (e) => {
                marker.setLatLng([e.latlng.lat, e.latlng.lng]);
                isInternalChange.current = true;
                onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
            });
        });

        return () => {
            if (instanceRef.current) {
                instanceRef.current.remove();
                instanceRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!markerRef.current || !instanceRef.current) return;
        if (isInternalChange.current) {
            isInternalChange.current = false;
            return;
        }
        markerRef.current.setLatLng([lat, lng]);
        instanceRef.current.flyTo([lat, lng], 15);
    }, [lat, lng]);

    const toggleLayer = () => {
        if (!instanceRef.current || !window.L) return;
        const L = window.L;
        const nextSate = !isSatellite;
        setIsSatellite(nextSate);

        if (layerRef.current) {
            instanceRef.current.removeLayer(layerRef.current);
        }

        const newLayer = L.tileLayer(nextSate ? SATELLITE_URL : STREET_URL, {
            attribution: nextSate ? "Tiles © Esri" : "© OpenStreetMap",
        }).addTo(instanceRef.current);

        layerRef.current = newLayer;
    };

    return (
        <div className="relative group">
            <div ref={mapRef} style={{ height, borderRadius: 16 }} className="border border-gray-100 overflow-hidden shadow-inner" />

            {/* View Toggle */}
            <button
                type="button"
                onClick={toggleLayer}
                className="absolute top-2 right-2 z-[1000] bg-white/90 backdrop-blur-sm border border-gray-100 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-600 hover:text-white transition-all active:scale-95"
            >
                {isSatellite ? "🗺️ Bản đồ" : "🛰️ Vệ tinh"}
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm text-[9px] font-black text-blue-600 border border-blue-50 whitespace-nowrap z-[1000]">
                📍 {lat.toFixed(5)}, {lng.toFixed(5)}
            </div>
        </div>
    );
}

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Plus, Search, Pencil, Trash2, X, Image as ImageIcon,
  Camera, Check, AlertCircle, LayoutGrid, List as ListIcon,
  MapPin, Star, Tag, Ruler, FileText, DollarSign
} from "lucide-react";
import { fetchProperties, createProperty, updateProperty, deleteProperty } from "../../services/api";


// ---------- Helpers ----------
const formatPrice = (raw) => {
  const n = Number(raw);
  if (!n || isNaN(n)) return "";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")} Tỷ`;
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)} Triệu`;
  return `${n.toLocaleString("vi-VN")} VNĐ`;
};

const formatArea = (raw) => {
  const n = Number(raw);
  return n && !isNaN(n) ? `${n} m²` : "";
};

const EMPTY_FORM = {
  title: "", price: "", area: "", frontage: "", location: "",
  type: "Đất nền", status: "Đang bán", legalStatus: "Sổ hồng riêng",
  description: "", images: [], isFeatured: false,
  coordinates: { lat: 11.424, lng: 106.5962 },
};

// Validation rules per field
const VALIDATORS = {
  title: (v) => v.trim().length < 10 ? "Tiêu đề quá ngắn (tối thiểu 10 ký tự)" : null,
  price: (v) => !v || Number(v) <= 0 ? "Vui lòng nhập mức giá hợp lệ" : null,
  area: (v) => !v || Number(v) <= 0 ? "Vui lòng nhập diện tích hợp lệ" : null,
  location: (v) => v.trim().length < 5 ? "Địa chỉ quá ngắn" : null,
  description: (v) => v.trim().length < 10 ? "Mô tả quá ngắn (tối thiểu 10 ký tự)" : null,
};

const validate = (data) => {
  const errs = {};
  Object.entries(VALIDATORS).forEach(([f, fn]) => {
    const msg = fn(data[f] ?? "");
    if (msg) errs[f] = msg;
  });
  if (!data.images || data.images.length === 0) errs.images = "Cần ít nhất 1 hình ảnh";
  return errs;
};

// ---------- Leaflet Map Picker (lazy, no SSR issues) ----------
function MapPicker({ lat, lng, onChange }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const markerRef = useRef(null);
  // When true, the coordinate change came from inside the map (click/drag).
  // The sync effect should skip re-panning in that case to avoid a double-jump.
  const isInternalChange = useRef(false);

  useEffect(() => {
    // Dynamically load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Dynamically load Leaflet JS
    const loadLeaflet = (cb) => {
      if (window.L) return cb(window.L);
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => cb(window.L);
      document.body.appendChild(script);
    };

    loadLeaflet((L) => {
      if (instanceRef.current || !mapRef.current) return;

      const map = L.map(mapRef.current, { zoomControl: true }).setView([lat, lng], 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: `<div style="width:28px;height:28px;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px #0004;display:flex;align-items:center;justify-content:center;">
          <div style="width:8px;height:8px;background:white;border-radius:50%;"></div></div>`,
        iconAnchor: [14, 14],
      });

      const marker = L.marker([lat, lng], { draggable: true, icon }).addTo(map);
      markerRef.current = marker;
      instanceRef.current = map;

      // Helper: mark change as internal before notifying parent,
      // so the [lat,lng] sync effect knows NOT to re-pan the map.
      const emitInternal = (newLat, newLng) => {
        isInternalChange.current = true;
        onChange({ lat: parseFloat(newLat.toFixed(6)), lng: parseFloat(newLng.toFixed(6)) });
      };

      marker.on("dragend", () => {
        const { lat: newLat, lng: newLng } = marker.getLatLng();
        emitInternal(newLat, newLng);
      });

      map.on("click", (e) => {
        marker.setLatLng([e.latlng.lat, e.latlng.lng]);
        emitInternal(e.latlng.lat, e.latlng.lng);
      });

      // Fix tile misalignment when the container is resized by layout changes
      if (typeof ResizeObserver !== "undefined") {
        const ro = new ResizeObserver(() => map.invalidateSize());
        ro.observe(mapRef.current);
        map._ro = ro;
      }
    });

    return () => {
      if (instanceRef.current) {
        instanceRef.current._ro?.disconnect();
        instanceRef.current.remove();
        instanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []); // mount once

  // Sync ONLY when coordinates are pushed from OUTSIDE (e.g. geocoding).
  // If the change came from within the map, consume the flag and do nothing.
  useEffect(() => {
    if (!markerRef.current || !instanceRef.current) return;
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return; // skip — map already moved itself
    }
    markerRef.current.setLatLng([lat, lng]);
    instanceRef.current.flyTo([lat, lng], 15, { animate: true, duration: 0.8 });
  }, [lat, lng]);

  return (
    <div>
      <div ref={mapRef} style={{ height: 240, borderRadius: 16, zIndex: 0 }} className="border border-gray-200 overflow-hidden" />
      <p className="mt-2 text-[10px] text-gray-400 font-bold text-center uppercase tracking-widest">
        Nhấn vào bản đồ hoặc kéo ghim để chọn vị trí — {lat.toFixed(5)}, {lng.toFixed(5)}
      </p>
    </div>
  );
}

// ---------- Main Component ----------
export default function ManagePropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [geocodingStatus, setGeocodingStatus] = useState(""); // "", "loading", "ok", "fail"
  const fileInputRef = useRef(null);
  const geocodeTimer = useRef(null);

  useEffect(() => { loadProperties(); }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      setProperties(await fetchProperties());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleOpenModal = (property = null) => {
    setErrors({});
    if (property) {
      setCurrentProperty(property);
      setFormData({
        ...EMPTY_FORM,
        ...property,
        coordinates: property.coordinates || EMPTY_FORM.coordinates,
        images: property.images || [],
      });
    } else {
      setCurrentProperty(null);
      setFormData({ ...EMPTY_FORM });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    // Clear error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));

    // When location changes, debounce geocode to update map pin
    if (name === "location" && val.trim().length > 4) {
      setGeocodingStatus("loading");
      clearTimeout(geocodeTimer.current);
      geocodeTimer.current = setTimeout(async () => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=1`,
            { headers: { "Accept-Language": "vi" } }
          );
          const data = await res.json();
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            setFormData(prev => ({
              ...prev,
              coordinates: { lat: parseFloat(parseFloat(lat).toFixed(6)), lng: parseFloat(parseFloat(lon).toFixed(6)) },
            }));
            setGeocodingStatus("ok");
          } else {
            setGeocodingStatus("fail");
          }
        } catch {
          setGeocodingStatus("fail");
        }
      }, 800);
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const newImgs = await Promise.all(files.map(f => new Promise(res => {
      const r = new FileReader();
      r.onloadend = () => res(r.result);
      r.readAsDataURL(f);
    })));
    setFormData(prev => ({ ...prev, images: [...prev.images, ...newImgs] }));
    if (errors.images) setErrors(prev => ({ ...prev, images: null }));
  };

  const removeImage = (idx) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleMapChange = useCallback((coords) => {
    setFormData(prev => ({ ...prev, coordinates: coords }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Scroll to first error
      document.querySelector(".field-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);

    // Auto-generate formatted fields + thumbnail
    const payload = {
      ...formData,
      price: Number(formData.price),
      area: Number(formData.area),
      formattedPrice: formatPrice(formData.price),
      formattedArea: formatArea(formData.area),
      thumbnail: formData.images[0] || "",
      tags: buildTags(formData),
      ...(currentProperty ? {} : { id: `bds-${Date.now()}`, postedAt: new Date().toISOString().split("T")[0] }),
    };

    try {
      if (currentProperty) {
        await updateProperty(currentProperty.id, payload);
      } else {
        await createProperty(payload);
      }
      handleCloseModal();
      loadProperties();
    } catch (err) {
      alert("Lỗi lưu BĐS: " + (err.message || "Payload có thể quá lớn, hãy giảm kích thước ảnh."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa BĐS này?")) return;
    try {
      await deleteProperty(id);
      loadProperties();
    } catch (e) { console.error(e); }
  };

  const buildTags = (data) => {
    const tags = [];
    if (data.frontage) tags.push(`Mặt tiền ${data.frontage}`);
    if (data.legalStatus === "Sổ hồng riêng") tags.push("Sổ hồng");
    if (data.isFeatured) tags.push("Nổi bật");
    return tags;
  };

  const filtered = properties.filter(p =>
    (p.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.location || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cls = {
    input: (field) => `w-full px-5 py-4 bg-gray-50 border rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-bold text-sm ${errors[field] ? "border-red-400 bg-red-50" : "border-gray-100"}`,
    label: "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1",
  };

  const FieldError = ({ field }) => errors[field]
    ? <p className="field-error mt-1.5 text-xs text-red-500 font-bold flex items-center gap-1"><AlertCircle size={12} />{errors[field]}</p>
    : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Quản Lý Bất Động Sản</h1>
          <p className="text-sm text-gray-500 font-medium">{properties.length} sản phẩm đang hiển thị trên hệ thống</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1">
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}><LayoutGrid size={20} /></button>
            <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}><ListIcon size={20} /></button>
          </div>
          <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-black shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5">
            <Plus size={20} strokeWidth={3} /><span className="hidden sm:inline">THÊM MỚI</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
        <input type="text" placeholder="Tìm kiếm theo tiêu đề hoặc địa chỉ..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-gray-700"
          value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đang tải dữ liệu...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
          <AlertCircle size={48} className="text-gray-200 mb-4" />
          <p className="text-gray-500 font-bold">Không tìm thấy bất động sản nào</p>
          <button onClick={() => setSearchTerm("")} className="mt-4 text-blue-600 font-black text-sm hover:underline">Xóa bộ lọc</button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img src={p.thumbnail || p.images?.[0] || "/assets/placeholder-land.jpg"} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase text-white ${p.status === "Đang bán" ? "bg-green-600" : "bg-red-600"}`}>{p.status}</span>
                  {p.isFeatured && <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase text-white bg-yellow-500 flex items-center gap-1"><Star size={8} />Nổi bật</span>}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-black text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors text-sm">{p.title}</h3>
                <p className="text-xs text-gray-400 font-medium mb-4 flex items-center gap-1"><MapPin size={12} />{p.location}</p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                  <div>
                    <span className="text-blue-600 font-black text-lg block">{p.formattedPrice || formatPrice(p.price)}</span>
                    <span className="text-gray-400 text-xs font-bold">{p.formattedArea || formatArea(p.area)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(p)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><Pencil size={18} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Hình ảnh</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Thông tin</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Giá & DT</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-20 h-14 rounded-xl overflow-hidden shadow-sm">
                      <img src={p.thumbnail || p.images?.[0] || "/assets/placeholder-land.jpg"} className="w-full h-full object-cover" alt={p.title} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-black text-gray-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">{p.title}</p>
                    <p className="text-xs text-gray-400 font-medium mt-1">{p.location}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-black text-blue-600 text-sm">{p.formattedPrice || formatPrice(p.price)}</p>
                    <p className="text-xs text-gray-400 font-bold">{p.formattedArea || formatArea(p.area)}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenModal(p)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><Pencil size={18} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-md" onClick={handleCloseModal} />
          <div className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in duration-300">

            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                  {currentProperty ? "Cập Nhật Bất Động Sản" : "Thêm Bất Động Sản Mới"}
                </h2>
                <div className="h-1.5 w-12 bg-blue-600 rounded-full mt-2" />
              </div>
              <button onClick={handleCloseModal} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
                <X size={24} strokeWidth={3} />
              </button>
            </div>

            {/* Global error banner */}
            {Object.keys(errors).length > 0 && (
              <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
                <AlertCircle size={18} />
                Vui lòng kiểm tra lại {Object.keys(errors).length} trường còn thiếu hoặc chưa hợp lệ bên dưới.
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* Cột trái */}
                <div className="space-y-5">
                  {/* Tiêu đề */}
                  <div>
                    <label className={cls.label}><span className="flex items-center gap-1"><FileText size={10} />Tiêu đề BĐS *</span></label>
                    <input name="title" value={formData.title} onChange={handleInputChange}
                      className={cls.input("title")} placeholder="VD: Đất nền 150m² gần KCN Becamex, thổ cư 100%..." />
                    <FieldError field="title" />
                  </div>

                  {/* Giá + Diện tích */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={cls.label}><span className="flex items-center gap-1"><DollarSign size={10} />Giá bán (VNĐ) *</span></label>
                      <input name="price" type="number" value={formData.price} onChange={handleInputChange}
                        className={cls.input("price")} placeholder="VD: 1200000000" />
                      {formData.price > 0 && !errors.price && (
                        <p className="mt-1 text-xs text-blue-600 font-black">{formatPrice(formData.price)}</p>
                      )}
                      <FieldError field="price" />
                    </div>
                    <div>
                      <label className={cls.label}><span className="flex items-center gap-1"><Ruler size={10} />Diện tích (m²) *</span></label>
                      <input name="area" type="number" value={formData.area} onChange={handleInputChange}
                        className={cls.input("area")} placeholder="VD: 150" />
                      {formData.area > 0 && !errors.area && (
                        <p className="mt-1 text-xs text-blue-600 font-black">{formatArea(formData.area)}</p>
                      )}
                      <FieldError field="area" />
                    </div>
                  </div>

                  {/* Mặt tiền */}
                  <div>
                    <label className={cls.label}>Mặt tiền (m) — tuỳ chọn</label>
                    <input name="frontage" value={formData.frontage} onChange={handleInputChange}
                      className={cls.input("")} placeholder="VD: 5m" />
                  </div>

                  {/* Địa chỉ */}
                  <div>
                    <label className={cls.label}><span className="flex items-center gap-1"><MapPin size={10} />Địa chỉ / Vị trí *</span></label>
                    <input name="location" value={formData.location} onChange={handleInputChange}
                      className={cls.input("location")} placeholder="VD: Phường Thành Tâm, Chơn Thành" />
                    {geocodingStatus === "loading" && (
                      <p className="mt-1.5 text-[10px] text-blue-500 font-bold flex items-center gap-1.5">
                        <span className="inline-block w-3 h-3 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
                        Đang tìm vị trí trên bản đồ...
                      </p>
                    )}
                    {geocodingStatus === "ok" && (
                      <p className="mt-1.5 text-[10px] text-green-600 font-bold flex items-center gap-1.5">
                        <Check size={10} />Ghim bản đồ đã được cập nhật tự động
                      </p>
                    )}
                    {geocodingStatus === "fail" && (
                      <p className="mt-1.5 text-[10px] text-orange-500 font-bold flex items-center gap-1.5">
                        <AlertCircle size={10} />Không tìm thấy vị trí — kéo ghim thủ công trên bản đồ
                      </p>
                    )}
                    <FieldError field="location" />
                  </div>

                  {/* Loại / Pháp lý / Trạng thái */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className={cls.label}>Loại BĐS</label>
                      <select name="type" value={formData.type} onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-sm">
                        <option>Đất nền</option><option>Đất vườn</option><option>Nhà ở</option><option>Nhà phố</option>
                      </select>
                    </div>
                    <div>
                      <label className={cls.label}>Pháp lý</label>
                      <select name="legalStatus" value={formData.legalStatus} onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-sm">
                        <option>Sổ hồng riêng</option><option>Sổ đỏ</option><option>Hợp đồng cọc</option>
                      </select>
                    </div>
                    <div>
                      <label className={cls.label}>Trạng thái</label>
                      <select name="status" value={formData.status} onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-sm">
                        <option>Đang bán</option><option>Đã bán</option><option>Đang cọc</option>
                      </select>
                    </div>
                  </div>

                  {/* Mô tả */}
                  <div>
                    <label className={cls.label}>Mô tả chi tiết *</label>
                    <textarea name="description" rows={4} value={formData.description} onChange={handleInputChange}
                      className={`${cls.input("description")} resize-none`}
                      placeholder="Nhập ưu điểm nổi bật, tiện ích xung quanh, tiềm năng đầu tư..." />
                    <FieldError field="description" />
                  </div>

                  {/* Nổi bật toggle */}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" name="isFeatured" id="isFeatured"
                        checked={formData.isFeatured} onChange={handleInputChange} className="sr-only" />
                      <div className={`w-12 h-6 rounded-full transition-colors ${formData.isFeatured ? "bg-yellow-400" : "bg-gray-200"}`} />
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${formData.isFeatured ? "translate-x-6" : ""}`} />
                    </div>
                    <span className="text-sm font-black text-gray-700 flex items-center gap-1.5">
                      <Star size={14} className={formData.isFeatured ? "text-yellow-500 fill-yellow-400" : "text-gray-400"} />
                      {formData.isFeatured ? "Đang hiển thị nổi bật" : "Đánh dấu nổi bật"}
                    </span>
                  </label>
                </div>

                {/* Cột phải */}
                <div className="space-y-6">
                  {/* Hình ảnh */}
                  <div>
                    <label className={`${cls.label} flex justify-between items-center`}>
                      <span className="flex items-center gap-1"><ImageIcon size={10} />Hình ảnh ({formData.images.length}) *</span>
                      <span className="text-blue-500 lowercase normal-case font-bold">Ảnh đầu tiên = ảnh chính</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
                          <img src={img} className="w-full h-full object-cover" alt="" />
                          <button type="button" onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-lg flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <X size={14} strokeWidth={3} />
                          </button>
                          {idx === 0 && (
                            <div className="absolute bottom-0 inset-x-0 bg-blue-600/80 backdrop-blur-sm text-white text-[8px] py-1 text-center font-black uppercase tracking-widest">Ảnh chính</div>
                          )}
                        </div>
                      ))}
                      {formData.images.length < 10 && (
                        <button type="button" onClick={() => fileInputRef.current.click()}
                          className={`aspect-[4/3] rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 group ${errors.images ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"}`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${errors.images ? "bg-red-100 text-red-500" : "bg-gray-100 group-hover:bg-blue-100 text-gray-400 group-hover:text-blue-600"}`}>
                            <Plus size={20} />
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${errors.images ? "text-red-500" : "text-gray-400 group-hover:text-blue-600"}`}>Thêm ảnh</span>
                        </button>
                      )}
                    </div>
                    <FieldError field="images" />
                    <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={handleFileChange} />
                  </div>

                  {/* Map picker */}
                  <div>
                    <label className={`${cls.label} flex items-center gap-1 mb-2`}>
                      <MapPin size={10} />Vị trí trên bản đồ
                    </label>
                    <MapPicker
                      lat={formData.coordinates?.lat || 11.424}
                      lng={formData.coordinates?.lng || 106.5962}
                      onChange={handleMapChange}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-between sticky bottom-0 bg-white">
                <p className="text-xs text-gray-400 font-bold">
                  {Object.keys(errors).length > 0
                    ? <span className="text-red-500 flex items-center gap-1"><AlertCircle size={12} />{Object.keys(errors).length} lỗi cần sửa</span>
                    : <span className="text-green-500 flex items-center gap-1"><Check size={12} />Sẵn sàng lưu</span>}
                </p>
                <div className="flex gap-3">
                  <button type="button" onClick={handleCloseModal} className="px-8 py-4 rounded-2xl font-black text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all">HỦY BỎ</button>
                  <button type="submit" disabled={submitting}
                    className={`flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-sm shadow-xl transition-all hover:-translate-y-1 ${submitting ? "bg-gray-400 cursor-not-allowed text-white" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100"}`}>
                    {submitting
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />ĐANG LƯU...</>
                      : <><Check size={20} strokeWidth={3} />{currentProperty ? "LƯU THAY ĐỔI" : "ĐĂNG BÀI NGAY"}</>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

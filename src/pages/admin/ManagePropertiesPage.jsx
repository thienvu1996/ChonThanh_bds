import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Plus, Search, Pencil, Trash2, X, Image as ImageIcon,
  Camera, Check, AlertCircle, LayoutGrid, List as ListIcon,
  MapPin, Star, Tag, Ruler, FileText, DollarSign, Download, FileJson, Video
} from "lucide-react";
import { fetchProperties, createProperty, updateProperty, deleteProperty, fetchSettings } from "../../services/api";
import MapPicker from "../../components/common/MapPicker";
import toast from "react-hot-toast";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from "docx";

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
  type: "Đất nền", status: "Đang bán", legal_status: "Sổ hồng riêng",
  description: "", images: [], legal_images: [], video_url: "", is_featured: false,
  thumbnail_url: "",
  coordinates: { lat: 11.424, lng: 106.5962 },
};

// Giới hạn bảo mật (Protect Cloudinary Free Tier)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_IMAGES = 10;

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

// ---------- Main Component ----------
export default function ManagePropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);
  const fileInputRef = useRef(null);
  const legalFileInputRef = useRef(null);

  useEffect(() => {
    loadProperties();
    loadSiteSettings();
  }, []);

  const loadSiteSettings = async () => {
    try {
      const data = await fetchSettings();
      setSiteSettings(data);
    } catch (e) { console.error("Lỗi tải settings"); }
  };

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await fetchProperties();
      setProperties(data || []);
    } catch (e) { toast.error("Không thể tải danh sách BĐS"); }
    finally { setLoading(false); }
  };

  const handleOpenModal = (property = null) => {
    if (property) {
      setCurrentProperty(property);
      const imgs = Array.isArray(property.images) ? property.images : [];
      const loadedData = {
        ...EMPTY_FORM,
        ...property,
        thumbnail_url: property.thumbnail_url || imgs[0] || "",
      };
      setFormData(loadedData);

      // Auto-geocode nếu coordinates vẫn là mặc định và có địa chỉ
      const DEFAULT_LAT = 11.424;
      const DEFAULT_LNG = 106.5962;
      const coords = property.coordinates;
      const isDefault = !coords ||
        (Math.abs(coords.lat - DEFAULT_LAT) < 0.001 && Math.abs(coords.lng - DEFAULT_LNG) < 0.001);

      if (isDefault && property.location) {
        // Geocode sau khi state cập nhật (delay nhỏ)
        setTimeout(async () => {
          try {
            const newCoords = await geocodeAddress(property.location);
            if (newCoords) {
              setFormData(prev => ({ ...prev, coordinates: newCoords }));
              toast.success("📍 Đã cập nhật vị trí theo địa chỉ!", { duration: 3000 });
            }
          } catch { /* silent fail */ }
        }, 400);
      }
    } else {
      setCurrentProperty(null);
      setFormData({ ...EMPTY_FORM });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleUploadImages = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_UPLOAD_PRESET === "your-unsigned-preset") {
      return toast.error("Vui lòng cấu hình Upload Preset trong file .env");
    }

    setUploading(true);
    const t = toast.loading("Đang tải ảnh thực tế...");
    try {
      const validUrls = [];
      for (const file of files) {
        if (formData.images.length + validUrls.length >= MAX_IMAGES) {
          toast.error(`Giới hạn ${MAX_IMAGES} ảnh`, { id: t });
          break;
        }
        if (file.size > MAX_IMAGE_SIZE) {
          toast.error(`File ${file.name} quá lớn (>5MB)`, { id: t });
          continue;
        }
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        data.append("folder", "chonthanh_bds");
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: data });
        const json = await res.json();

        if (json.secure_url) {
          validUrls.push(json.secure_url);
        } else {
          console.error("Cloudinary Error:", json);
          toast.error(`Lỗi: ${json.error?.message || "Không thể tải ảnh"}`, { id: t });
        }
      }

      if (validUrls.length > 0) {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...validUrls] }));
        toast.success("Đã tải xong ảnh thực tế!", { id: t });
      }
    } catch (err) {
      toast.error("Lỗi kết nối Cloudinary", { id: t });
    }
    finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleUploadLegalImages = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) return toast.error("Chưa cấu hình Cloudinary");

    setUploading(true);
    const t = toast.loading("Đang tải ảnh pháp lý...");
    try {
      const validUrls = [];
      for (const file of files) {
        if ((formData.legal_images?.length || 0) + validUrls.length >= 5) {
          toast.error("Tối đa 5 ảnh sổ đỏ", { id: t });
          break;
        }
        if (file.size > MAX_IMAGE_SIZE) {
          toast.error(`File ${file.name} quá lớn (>5MB)`, { id: t });
          continue;
        }
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        data.append("folder", "chonthanh_bds/phap_ly");
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: data });
        const json = await res.json();

        if (json.secure_url) {
          validUrls.push(json.secure_url);
        } else {
          console.error("Cloudinary Error:", json);
          toast.error(`Lỗi tải file ${file.name}`, { id: t });
        }
      }

      if (validUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          legal_images: [...(Array.isArray(prev.legal_images) ? prev.legal_images : []), ...validUrls]
        }));
        toast.success("Đã tải xong ảnh sổ đỏ!", { id: t });
      } else {
        toast.error("Không có ảnh nào được tải lên", { id: t });
      }
    } catch (err) {
      toast.error("Lỗi kết nối máy chủ upload", { id: t });
    }
    finally {
      setUploading(false);
      e.target.value = ""; // Reset input để có thể chọn lại cùng file đó nếu cần
    }
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_VIDEO_SIZE) return toast.error("Video quá nặng (>50MB). Hãy dùng YouTube.");

    setUploading(true);
    const t = toast.loading("Đang tải video lên...");
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      data.append("folder", "chonthanh_bds/videos");
      data.append("resource_type", "video");
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`, { method: "POST", body: data });
      const json = await res.json();
      if (json.secure_url) {
        setFormData(prev => ({ ...prev, video_url: json.secure_url }));
        toast.success("Tải video xong!", { id: t });
      }
    } catch (err) { toast.error("Lỗi upload video", { id: t }); }
    finally { setUploading(false); }
  };

  const removeImage = (idx) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  const removeLegalImage = (idx) => setFormData(prev => ({ ...prev, legal_images: prev.legal_images.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || formData.images.length === 0)
      return toast.error("Thiếu thông tin bắt buộc (Tiêu đề, Giá, Ảnh)");

    setSubmitting(true);
    // ✅ Truyền thẳng formData – api.js (propertyToDbPayload) sẽ lo normalize & clean
    try {
      if (currentProperty) await updateProperty(currentProperty.id, formData);
      else await createProperty(formData);
      toast.success("✅ Lưu tin thành công!");
      setIsModalOpen(false);
      loadProperties();
    } catch (err) {
      // Hiển thị lỗi chi tiết từ Supabase để dễ debug
      console.error("[handleSubmit] error:", err);
      toast.error(`❌ Lỗi: ${err.message || "Không thể lưu dữ liệu"}`, { duration: 6000 });
    }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa tin này?")) return;
    try {
      await deleteProperty(id);
      toast.success("Đã xóa");
      loadProperties();
    } catch (e) { toast.error("Lỗi xóa"); }
  };

  // ---- Hàm geocode core (nhận location string, trả về {lat, lng} hoặc null) ----
  const geocodeAddress = async (locationStr) => {
    if (!locationStr) return null;
    const prefix = siteSettings?.search_prefix || "Chơn Thành, Bình Phước";
    let fullAddress = locationStr;
    if (!fullAddress.toLowerCase().includes("việt nam")) {
      if (!fullAddress.toLowerCase().includes(prefix.split(',')[0].trim().toLowerCase())) {
        fullAddress += `, ${prefix}`;
      }
      fullAddress += ", Việt Nam";
    }
    const search = async (q) => {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`);
      return res.json();
    };
    let data = await search(fullAddress);
    if (!data?.length) {
      const parts = locationStr.split(',');
      if (parts.length > 2) data = await search(parts.slice(Math.floor(parts.length / 2)).join(','));
    }
    if (data?.length) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  };

  // ----- Geocoding thủ công (user bấm nút / onBlur) -----
  const handleGeocode = async () => {
    if (!formData.location) return toast.error("Vui lòng nhập địa chỉ trước!");
    const t = toast.loading("Đang phân tích địa chỉ...");
    try {
      const coords = await geocodeAddress(formData.location);
      if (coords) {
        setFormData(prev => ({ ...prev, coordinates: coords }));
        toast.success("Đã định vị thành công!", { id: t });
      } else {
        toast.error("Không tìm thấy! Thử nhập: 'Tên đường, Phường, Tỉnh'", { id: t });
      }
    } catch {
      toast.error("Dịch vụ bản đồ đang bận, thử lại sau!", { id: t });
    }
  };

  // ----- Lấy địa chỉ ngược từ tọa độ ghim (Reverse Geocoding) -----
  const handleReverseGeocode = async () => {
    const { lat, lng } = formData.coordinates;
    const t = toast.loading("Đang lấy địa chỉ từ ghim...");
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await res.json();
      if (data && data.display_name) {
        // Dọn dẹp địa chỉ trả về cho gọn hơn
        setFormData(prev => ({ ...prev, location: data.display_name }));
        toast.success("Đã cập nhật địa chỉ!", { id: t });
      } else {
        toast.error("Không thể xác định địa chỉ tại điểm này", { id: t });
      }
    } catch (err) {
      toast.error("Lỗi kết nối bản đồ", { id: t });
    }
  };

  const getLocationErrorMessage = (err) => {
    if (err?.code === err?.PERMISSION_DENIED || err?.code === 1) {
      return "Chưa bật quyền định vị. Hãy cho phép vị trí cho trang này trong trình duyệt rồi bấm thử lại.";
    }
    if (err?.code === err?.TIMEOUT || err?.code === 3) {
      return "Quá 30 giây vẫn chưa tìm được vị trí. Hãy bật GPS/vị trí trên thiết bị hoặc ghim thủ công trên bản đồ.";
    }
    return "Không bắt được tín hiệu vị trí. Hãy bật GPS/vị trí trên thiết bị và thử lại.";
  };

  const requestCurrentPosition = () => new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0,
    });
  });

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Trình duyệt không hỗ trợ định vị GPS");
      return;
    }

    const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    if (window.location.protocol !== "https:" && !isLocalhost) {
      toast.error("Trình duyệt chỉ cho lấy vị trí trên HTTPS hoặc localhost.");
      return;
    }

    const t = toast.loading("Đang xin quyền và tìm vị trí hiện tại... tối đa 30s");

    try {
      if (navigator.permissions?.query) {
        const permission = await navigator.permissions.query({ name: "geolocation" });
        if (permission.state === "denied") {
          toast.error("Quyền định vị đang bị chặn. Mở cài đặt trình duyệt và cho phép vị trí cho trang này.", {
            id: t,
            duration: 7000,
          });
          return;
        }
      }

      const pos = await requestCurrentPosition();
      const { latitude, longitude } = pos.coords;
      setFormData(prev => ({
        ...prev,
        coordinates: {
          lat: parseFloat(latitude.toFixed(6)),
          lng: parseFloat(longitude.toFixed(6)),
        },
      }));
      toast.success("Đã lấy vị trí hiện tại", { id: t });
    } catch (err) {
      console.error("Geolocation error:", err);
      toast.error(getLocationErrorMessage(err), { id: t, duration: 7000 });
    }
  };

  const exportToExcel = () => {
    const data = properties.map(p => ({
      "Tiêu đề": p.title, "Giá": p.formatted_price, "DT": p.formatted_area, "Vị trí": p.location, "Ngày": new Date(p.posted_at).toLocaleDateString("vi-VN")
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BDS");
    XLSX.writeFile(wb, `BDS_CHONTHANH_${new Date().getTime()}.xlsx`);
  };

  const exportToWord = async (p) => {
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ children: [new TextRun({ text: p.title, bold: true, size: 30 })] }),
          new Paragraph({ children: [new TextRun({ text: `Giá: ${p.formatted_price} | DT: ${p.formatted_area}` })] }),
          new Paragraph({ children: [new TextRun({ text: `Địa chỉ: ${p.location}` })] }),
          new Paragraph({ children: [new TextRun({ text: p.description })] }),
        ]
      }]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Phieu_${p.id}.docx`);
  };

  const filtered = properties.filter(p => (p.title || "").toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Quản Lý Bất Động Sản</h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{properties.length} tin đăng</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportToExcel} className="p-2.5 bg-green-50 text-green-600 rounded-xl"><FileJson size={20} /></button>
          <button onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl">{viewMode === "grid" ? <ListIcon size={20} /> : <LayoutGrid size={20} />}</button>
          <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black flex items-center gap-2"><Plus size={20} /> ĐĂNG TIN</button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
        <input type="text" placeholder="Tìm tên nhà đất..." className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none font-bold" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      {loading ? (
        <div className="py-20 text-center font-black text-gray-300 uppercase tracking-widest text-[10px] animate-pulse">Đang tải dữ liệu...</div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                <img src={p.thumbnail_url || "/assets/placeholder-land.jpg"} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600/90 text-[8px] font-black text-white uppercase rounded-md">{p.type}</div>
              </div>
              <h3 className="font-black text-gray-900 line-clamp-1 mb-2">{p.title}</h3>
              <div className="flex justify-between items-center mb-4">
                <span className="text-blue-600 font-black text-sm">{p.formatted_price}</span>
                <span className="text-gray-400 font-bold text-[10px]">{p.formatted_area}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-50">
                <button onClick={() => exportToWord(p)} className="text-[9px] font-black text-gray-400 hover:text-blue-600 flex items-center gap-1 uppercase tracking-widest transition-colors"><Download size={12} /> Phiếu</button>
                <div className="flex gap-1">
                  <button onClick={() => handleOpenModal(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={18} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden text-sm">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !submitting && setIsModalOpen(false)} />
          <div className="relative w-full max-w-5xl bg-white rounded-[2rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] flex flex-col max-h-[96vh] overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-8 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
              <h2 className="font-black text-gray-900 uppercase text-sm tracking-wider">{currentProperty ? "Sửa tin" : "Đăng tin mới"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-7 space-y-5">
                    <input name="title" value={formData.title} onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" placeholder="Tiêu đề bắt mắt..." />
                    <div className="grid grid-cols-2 gap-4">
                      <input name="price" type="number" value={formData.price} onChange={handleInputChange} className="px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" placeholder="Giá (VNĐ)" />
                      <input name="area" type="number" value={formData.area} onChange={handleInputChange} className="px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" placeholder="DT (m²)" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vị trí thực tế *</label>
                      <div className="flex gap-2">
                        <input
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          onBlur={handleGeocode}
                          className="flex-1 px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                          placeholder="Nhập địa chỉ → bản đồ tự cập nhật..."
                        />
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={handleGeocode}
                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-[9px] hover:bg-blue-100 transition-colors uppercase tracking-tight"
                          >
                            Tìm tọa độ
                          </button>
                          <button
                            type="button"
                            onClick={handleGetCurrentLocation}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-black text-[9px] hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-1 uppercase tracking-tight"
                          >
                            📍 Vị trí hiện tại
                          </button>
                          <button
                            type="button"
                            onClick={handleReverseGeocode}
                            className="px-4 py-2 bg-gray-50 text-gray-500 rounded-xl font-black text-[9px] hover:bg-gray-100 transition-colors uppercase tracking-tight"
                          >
                            Địa chỉ từ ghim
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <select name="type" value={formData.type} onChange={handleInputChange} className="px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-xs"><option>Đất nền</option><option>Đất vườn</option><option>Nhà phố</option></select>
                      <select name="legal_status" value={formData.legal_status} onChange={handleInputChange} className="px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-xs"><option>Sổ hồng riêng</option><option>Sổ đỏ</option></select>
                      <select name="status" value={formData.status} onChange={handleInputChange} className="px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-xs"><option>Đang bán</option><option>Đã bán</option></select>
                    </div>
                    <textarea name="description" rows={5} value={formData.description} onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold resize-none" placeholder="Mô tả ưu điểm..." />
                    <div className="pt-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Vị trí trên bản đồ</span>
                      <MapPicker lat={formData.coordinates.lat} lng={formData.coordinates.lng} onChange={c => setFormData(p => ({ ...p, coordinates: c }))} />
                    </div>
                  </div>
                  <div className="md:col-span-5 space-y-4">
                    {/* Khay Ảnh Thực Tế */}
                    <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ảnh Thực tế ({formData.images.length}/{MAX_IMAGES})</span>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => {
                            const camInput = document.createElement('input');
                            camInput.type = 'file';
                            camInput.accept = 'image/*';
                            camInput.capture = 'environment';
                            camInput.onchange = (e) => handleUploadImages(e);
                            camInput.click();
                          }} className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-md uppercase hover:bg-green-100">Chụp ảnh 📸</button>
                          <button type="button" onClick={() => fileInputRef.current.click()} className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase hover:bg-blue-100">Thêm ảnh +</button>
                        </div>
                      </div>
                      {/* Hướng dẫn chọn thumbnail */}
                      {formData.images.length > 0 && (
                        <p className="text-[9px] text-blue-400 font-bold mb-2 ml-1">👑 Click vào ảnh để chọn làm ảnh đại diện</p>
                      )}
                      <div className="max-h-40 overflow-y-auto pr-2 scrollbar-thin">
                        <div className="grid grid-cols-4 gap-2">
                          {formData.images.map((img, idx) => {
                            const isThumb = (formData.thumbnail_url || formData.images[0]) === img;
                            return (
                              <div
                                key={idx}
                                className={`relative aspect-square rounded-xl overflow-hidden shadow-sm group/img cursor-pointer transition-all ${isThumb
                                  ? "ring-2 ring-blue-500 ring-offset-1"
                                  : "border border-white"
                                  }`}
                                onClick={() => setFormData(prev => ({ ...prev, thumbnail_url: img }))}
                              >
                                <img src={img} className="w-full h-full object-cover" />
                                {/* Badge thumbnail */}
                                {isThumb && (
                                  <div className="absolute top-1 left-1 bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full leading-none">
                                    👑
                                  </div>
                                )}
                                {/* Nút xóa khi hover */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation(); // không trigger chọn thumbnail
                                    setFormData(prev => ({
                                      ...prev,
                                      images: prev.images.filter((_, i) => i !== idx),
                                      // Nếu xóa ảnh đang là thumbnail → reset về ảnh đầu tiên còn lại
                                      thumbnail_url: prev.thumbnail_url === img
                                        ? (prev.images.filter((_, i) => i !== idx)[0] || "")
                                        : prev.thumbnail_url,
                                    }));
                                  }}
                                  className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity text-xs font-bold"
                                >
                                  Xóa
                                </button>
                              </div>
                            );
                          })}
                          {formData.images.length < MAX_IMAGES && (
                            <button
                              type="button"
                              onClick={() => fileInputRef.current.click()}
                              className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300 hover:border-blue-300 hover:text-blue-500 transition-all"
                            >
                              <Plus size={20} />
                            </button>
                          )}
                        </div>
                      </div>
                      <input type="file" ref={fileInputRef} hidden multiple accept="image/*" onChange={handleUploadImages} />
                    </div>

                    {/* Khay Ảnh Pháp Lý */}
                    <div className="bg-blue-50/30 p-4 rounded-3xl border border-blue-100">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Ảnh Sổ đỏ (Bảo mật)</span>
                        <button type="button" onClick={() => legalFileInputRef.current.click()} className="text-[10px] font-black text-blue-600 uppercase hover:underline">Thêm sổ +</button>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {formData.legal_images && formData.legal_images.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white shadow-sm group/leg">
                            <img src={img} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, legal_images: prev.legal_images.filter((_, i) => i !== idx) }))}
                              className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover/leg:opacity-100 transition-opacity"
                            >
                              Xóa
                            </button>
                          </div>
                        ))}
                        {(formData.legal_images ? formData.legal_images.length : 0) < 5 && (
                          <button
                            type="button"
                            onClick={() => legalFileInputRef.current.click()}
                            className="aspect-square border-2 border-dashed border-blue-200 rounded-xl flex items-center justify-center text-blue-300 hover:border-blue-400"
                          >
                            <Plus size={20} />
                          </button>
                        )}
                      </div>
                      <input type="file" ref={legalFileInputRef} hidden multiple accept="image/*" onChange={handleUploadLegalImages} />
                    </div>

                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-3">
                      <span className="text-[9px] font-black text-gray-400 uppercase flex justify-between">Video giới thiệu <span className="text-blue-500">&lt; 50MB</span></span>
                      <input name="video_url" value={formData.video_url} onChange={handleInputChange} className="w-full px-4 py-2 bg-white border border-blue-100 rounded-xl text-[10px] font-bold" placeholder="Dán link YouTube hoặc tải lên..." />
                      <button type="button" onClick={() => document.getElementById('v-up').click()} className="w-full py-2 bg-white border border-dashed border-blue-200 rounded-xl text-[8px] font-black text-blue-600 uppercase tracking-widest">{uploading ? "Đang tải..." : "TẢI VIDEO LÊN"}</button>
                      <input type="file" id="v-up" hidden accept="video/*" onChange={handleUploadVideo} />
                    </div>

                  </div>
                </div>
              </div>
              <div className="p-4 border-t flex justify-end gap-3 bg-white flex-shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 font-bold text-gray-400">HỦY</button>
                <button type="submit" disabled={submitting || uploading} className="px-10 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg">LƯU TIN NGAY</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

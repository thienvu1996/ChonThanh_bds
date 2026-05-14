import React, { useState, useEffect, useRef } from "react";
import { 
  Settings as SettingsIcon, Save, Globe, Phone, Mail, 
  MapPin, Image as ImageIcon, Layout, Shield, 
  RefreshCcw, Check, Sparkles, Camera, Plus
} from "lucide-react";
import {
  fetchSettings,
  fetchSites,
  getActiveSiteId,
  isSuperAdminSession,
  saveSite,
  setActiveSiteId,
} from "../../services/api";
import { saveSettings } from "../../utils/settingsStore";
import toast from "react-hot-toast";

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    site_title: "",
    hero_title: "",
    hero_subtitle: "",
    banner_url: "",
    phone: "",
    zalo: "",
    email: "",
    address: "",
    footer_text: "",
    search_prefix: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [sites, setSites] = useState([]);
  const [activeSite, setActiveSite] = useState(null);
  const [savingSite, setSavingSite] = useState(false);
  const bannerInputRef = useRef(null);

  useEffect(() => {
    bootSettings();
  }, []);

  const bootSettings = async () => {
    setLoading(true);
    try {
      const superAdmin = await isSuperAdminSession();
      setIsSuperAdmin(superAdmin);

      const siteList = await fetchSites();
      setSites(siteList);

      const selected = siteList.find((site) => site.id === getActiveSiteId()) || siteList[0] || null;
      if (selected) {
        setActiveSite(selected);
        setActiveSiteId(selected.id);
      }

      const data = await fetchSettings();
      if (data) setSettings(data);
    } catch (e) {
      toast.error("Không thể tải cấu hình hệ thống");
    } finally {
      setLoading(false);
    }
  };

  const reloadSettings = async () => {
    const data = await fetchSettings();
    if (data) setSettings(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSiteChange = (e) => {
    const next = sites.find((site) => site.id === e.target.value);
    if (!next) return;
    setActiveSite(next);
    setActiveSiteId(next.id);
    reloadSettings();
  };

  const handleSiteFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setActiveSite(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleNewSite = () => {
    const suffix = Date.now().toString().slice(-5);
    setActiveSite({
      name: "Website mới",
      site_key: `site-${suffix}`,
      domain: "",
      is_default: false,
    });
  };

  const handleSaveSite = async () => {
    if (!activeSite) return;
    setSavingSite(true);
    try {
      const saved = await saveSite(activeSite);
      const nextSites = await fetchSites();
      setSites(nextSites);
      setActiveSite(saved);
      setActiveSiteId(saved.id);
      await reloadSettings();
      toast.success("Đã lưu cấu hình website");
    } catch (error) {
      toast.error(error.message || "Không thể lưu website");
    } finally {
      setSavingSite(false);
    }
  };

  const handleUploadBanner = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      return toast.error("Chưa cấu hình Cloudinary");
    }

    setUploading(true);
    const t = toast.loading("Đang tải banner mới lên...");

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const json = await res.json();
      if (json.secure_url) {
        setSettings(prev => ({ ...prev, banner_url: json.secure_url }));
        toast.success("Đã cập nhật link banner!", { id: t });
      }
    } catch (err) {
      toast.error("Lỗi khi tải ảnh lên", { id: t });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = await saveSettings(settings);
      setSettings(saved);
      toast.success("Đã lưu tất cả thay đổi!");
    } catch (err) {
      toast.error("Lỗi khi lưu cấu hình");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-gray-400">Đang tải cấu hình...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
             <SettingsIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Cấu Hình Website</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Quản lý nội dung & Thông tin liên hệ</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-blue-100 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
        >
          {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
          LƯU CẤU HÌNH
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {isSuperAdmin && (
          <section className="bg-white rounded-[2.5rem] border border-blue-100 shadow-sm p-8 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-blue-600">
                <Globe size={20} />
                <h2 className="font-black uppercase tracking-widest text-sm">Quản lý nhiều Website</h2>
              </div>
              <button
                type="button"
                onClick={handleNewSite}
                className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-black text-xs uppercase hover:bg-blue-100"
              >
                <Plus size={16} /> Site mới
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Website đang cấu hình</label>
                <select
                  value={activeSite?.id || ""}
                  onChange={handleSiteChange}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                >
                  {sites.map(site => (
                    <option key={site.id} value={site.id}>{site.name} ({site.site_key})</option>
                  ))}
                  {!activeSite?.id && <option value="">Website mới</option>}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên Website nội bộ</label>
                <input name="name" value={activeSite?.name || ""} onChange={handleSiteFieldChange} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">VITE_SITE_KEY</label>
                <input name="site_key" value={activeSite?.site_key || ""} onChange={handleSiteFieldChange} className="w-full px-5 py-4 bg-blue-50/30 border border-blue-100 rounded-2xl outline-none font-bold text-blue-700" placeholder="chon-thanh" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Domain FE</label>
                <input name="domain" value={activeSite?.domain || ""} onChange={handleSiteFieldChange} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" placeholder="bdschonthanh.vn" />
              </div>
            </div>

            <label className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-500">
              <input type="checkbox" name="is_default" checked={Boolean(activeSite?.is_default)} onChange={handleSiteFieldChange} className="w-4 h-4" />
              Website mặc định khi không khớp domain
            </label>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveSite}
                disabled={savingSite}
                className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-2xl font-black shadow-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {savingSite ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                LƯU WEBSITE
              </button>
            </div>
          </section>
        )}

        {/* Banner Section */}
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-8 space-y-6">
          <div className="flex items-center gap-2 text-blue-600">
            <Layout size={20} />
            <h2 className="font-black uppercase tracking-widest text-sm">Hình ảnh Banner chính</h2>
          </div>
          
          <div className="relative group aspect-[21/9] rounded-3xl overflow-hidden bg-gray-100 border-4 border-gray-50 shadow-inner">
             {settings.banner_url ? (
               <img src={settings.banner_url} className="w-full h-full object-cover" alt="Banner" />
             ) : (
               <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                  <ImageIcon size={48} strokeWidth={1} />
                  <p className="font-bold text-xs uppercase tracking-widest mt-2">Chưa có banner</p>
               </div>
             )}
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => bannerInputRef.current.click()} className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-transform">
                   <Camera size={18} /> THAY ĐỔI ẢNH
                </button>
             </div>
             {uploading && (
               <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                     <RefreshCcw className="text-blue-600 animate-spin" size={32} />
                     <p className="font-black text-blue-600 text-[10px] uppercase tracking-widest">Đang tải lên...</p>
                  </div>
               </div>
             )}
          </div>
          <input type="file" ref={bannerInputRef} hidden accept="image/*" onChange={handleUploadBanner} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tiêu đề lớn (Hero Title)</label>
                <input name="hero_title" value={settings.hero_title} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-sm focus:ring-4 focus:ring-blue-50 transition-all" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mô tả ngắn (Hero Subtitle)</label>
                <input name="hero_subtitle" value={settings.hero_subtitle} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-sm focus:ring-4 focus:ring-blue-50 transition-all" />
             </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 space-y-6">
          <div className="flex items-center gap-2 text-blue-600">
            <Globe size={20} />
            <h2 className="font-black uppercase tracking-widest text-sm">Thông tin Website & Liên hệ</h2>
          </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên Website</label>
              <input name="site_title" value={settings.site_title} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-blue-600">Khu vực tìm kiếm mặc định (X, Y)</label>
              <input name="search_prefix" value={settings.search_prefix} onChange={handleChange} className="w-full px-5 py-4 bg-blue-50/30 border border-blue-100 rounded-2xl outline-none font-bold text-blue-700" placeholder="VD: Lộc Ninh, Bình Phước" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Số điện thoại Hotline</label>
              <input name="phone" value={settings.phone} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-blue-600" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Số Zalo liên hệ</label>
              <input name="zalo" value={settings.zalo} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-blue-600" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email hỗ trợ</label>
            <input name="email" value={settings.email} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" />
            </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Địa chỉ văn phòng</label>
            <input name="address" value={settings.address} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nội dung Bản quyền (Footer)</label>
            <input name="footer_text" value={settings.footer_text} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" />
          </div>
        </section>

        {/* Security Info */}
        <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100 flex items-start gap-4">
           <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
              <Shield size={20} />
           </div>
           <div>
              <p className="text-xs font-black text-blue-900 uppercase tracking-widest">⚠️ Lưu ý bảo mật</p>
              <p className="text-xs text-blue-600/70 font-medium mt-1 leading-relaxed">Mọi thay đổi tại đây sẽ ảnh hưởng trực tiếp đến giao diện hiển thị cho khách hàng trên toàn bộ hệ thống. Vui lòng kiểm tra kỹ số điện thoại và thông tin liên hệ trước khi Lưu.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

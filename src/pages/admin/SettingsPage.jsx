import React, { useState, useEffect, useRef } from "react";
import { getSettings, saveSettings, resetSettings } from "../../utils/settingsStore";
import { 
  Save, RefreshCw, Image as ImageIcon, Phone, MessageSquare, 
  Mail, MapPin, Type, Layout, Globe, Trash2
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState(getSettings());
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    saveSettings(settings);
    setTimeout(() => {
      setIsSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 600);
  };

  const handleReset = () => {
    if (window.confirm("Bạn có chắc chắn muốn khôi phục cài đặt gốc?")) {
      resetSettings();
      setSettings(getSettings());
    }
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSettings((prev) => ({ ...prev, bannerUrl: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium";
  const labelCls = "block text-xs font-black text-gray-400 uppercase tracking-widest mb-2";

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Cài Đặt Hệ Thống</h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <Globe className="w-4 h-4" /> Tùy chỉnh nội dung website của bạn
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 font-bold text-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Khôi phục gốc
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm transition-all shadow-lg ${
              isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100"
            }`}
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "ĐANG LƯU..." : "LƯU CÀI ĐẶT"}
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-center gap-3 text-green-600 font-bold text-sm animate-bounce">
          <Save className="w-4 h-4" /> Lưu cấu hình thành công! Trang web đã được cập nhật.
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- CỘT 1: GIAO DIỆN CHÍNH --- */}
        <div className="space-y-8">
          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600">
                <Layout className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-gray-800 tracking-tight">Trang Chủ (Hero Section)</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className={labelCls}>Banner trang chủ (Kích thước khuyên dùng: 1920x800)</label>
                <div className="relative group rounded-2xl overflow-hidden bg-gray-100 aspect-[21/9] border-2 border-dashed border-gray-200">
                  {settings.bannerUrl ? (
                    <>
                      <img src={settings.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 bg-white rounded-full text-blue-600 hover:scale-110 transition-transform">
                          <ImageIcon className="w-5 h-5" />
                        </button>
                        <button type="button" onClick={() => setSettings(p => ({ ...p, bannerUrl: "" }))} className="p-3 bg-white rounded-full text-red-600 hover:scale-110 transition-transform">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2 font-bold hover:text-blue-500 transition">
                      <ImageIcon className="w-8 h-8 opacity-20" />
                      <span className="text-xs">BẤM ĐỂ TẢI ẢNH BANNER LÊN</span>
                    </button>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Tiêu đề chính (Title)</label>
                <input name="heroTitle" value={settings.heroTitle} onChange={handleChange} className={inputCls} placeholder="VD: BĐS CHƠN THÀNH - GIÁ TRỊ THỰC..." />
              </div>

              <div>
                <label className={labelCls}>Mô tả ngắn (Subtitle)</label>
                <textarea name="heroSubtitle" value={settings.heroSubtitle} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} placeholder="VD: Chuyên cung cấp đất nền, nhà phố..." />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                <Globe className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-gray-800 tracking-tight">Thông Tin Website</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className={labelCls}>Tên Website (Site Title)</label>
                <input name="siteTitle" value={settings.siteTitle} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Chân trang (Footer Text)</label>
                <input name="footerText" value={settings.footerText} onChange={handleChange} className={inputCls} />
              </div>
            </div>
          </section>
        </div>

        {/* --- CỘT 2: THÔNG TIN LIÊN HỆ --- */}
        <div className="space-y-8">
          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-full">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <Phone className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-gray-800 tracking-tight">Kênh Liên Hệ (Hotline/Social)</h2>
            </div>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}><span className="flex items-center gap-2"><Phone className="w-3 h-3" /> Số điện thoại</span></label>
                  <input name="phone" value={settings.phone} onChange={handleChange} className={inputCls} placeholder="0901.234.567" />
                </div>
                <div>
                  <label className={labelCls}><span className="flex items-center gap-2"><MessageSquare className="w-3 h-3" /> Zalo</span></label>
                  <input name="zalo" value={settings.zalo} onChange={handleChange} className={inputCls} placeholder="0901.234.567" />
                </div>
              </div>

              <div>
                <label className={labelCls}><span className="flex items-center gap-2"><Mail className="w-3 h-3" /> Email hỗ trợ</span></label>
                <input name="email" value={settings.email} onChange={handleChange} className={inputCls} placeholder="contact@domain.vn" />
              </div>

              <div>
                <label className={labelCls}><span className="flex items-center gap-2"><MapPin className="w-3 h-3" /> Địa chỉ văn phòng</span></label>
                <textarea name="address" value={settings.address} onChange={handleChange} rows={4} className={`${inputCls} resize-none`} placeholder="Số nhà, Tên đường, Phường/Xã..." />
              </div>

              {/* Demo preview card */}
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 mt-10">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Xem trước hiển thị (Mockup)</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center animate-pulse">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-800">{settings.phone}</p>
                    <p className="text-[11px] text-gray-500 font-bold uppercase">Hotline 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}

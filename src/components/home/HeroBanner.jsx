// src/components/home/HeroBanner.jsx
// Hero section: full-viewport ảnh nền BĐS + overlay tối + headline + SearchFilter floating bên dưới
// SearchFilter được truyền vào dưới dạng children để HeroBanner không phụ thuộc implementation

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { getSettings } from "../../utils/settingsStore";

export default function HeroBanner({ children }) {
  const [settings, setSettings] = useState(getSettings());

  useEffect(() => {
    const handleUpdate = () => setSettings(getSettings());
    window.addEventListener("settingsUpdated", handleUpdate);
    return () => window.removeEventListener("settingsUpdated", handleUpdate);
  }, []);

  return (
    // relative + pb dài để SearchFilter floating không bị cắt
    <section className="relative w-full h-[75vh] min-h-[500px] flex flex-col items-center justify-center overflow-visible">
      {/* Ảnh nền */}
      <img
        src={settings.bannerUrl}
        alt={settings.siteTitle}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
      />

      {/* Overlay tối để chữ nổi bật */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Nội dung văn bản */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <span className="inline-block bg-blue-600/80 text-white text-[10px] md:text-xs font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20">
          Thị xã Chơn Thành · Bình Phước
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-2xl mb-6 tracking-tight">
          {settings.heroTitle}
        </h1>
        <p className="text-gray-200 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium opacity-90">
          {settings.heroSubtitle}
        </p>

        {/* Mũi tên hướng dẫn scroll */}
        <div className="mt-10 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
          <ChevronDown className="w-8 h-8 text-white mx-auto" />
        </div>
      </div>

      {/* SearchFilter slot - âm vào dưới hero */}
      {children && (
        <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-1/2 px-4 max-w-5xl mx-auto w-full">
          {children}
        </div>
      )}
    </section>
  );
}

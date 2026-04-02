// src/layouts/MainLayout.jsx
// Layout gốc của toàn bộ app
// StickyZalo render ở đây để đảm bảo hiển thị mọi trang, pb-16 md:pb-0 tránh nội dung bị che

import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import StickyZalo from "../components/common/StickyZalo";
import AIAssistant from "../components/common/AIAssistant";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* pb-16 trên mobile để nội dung không bị StickyZalo che */}
      <main className="flex-grow pb-16 md:pb-0">
        {children}
      </main>

      <Footer />

      {/* AI Assistant Floating */}
      <AIAssistant />

      {/* Sticky CTA - chỉ hiển thị trên mobile (md:hidden trong component) */}
      <StickyZalo />
    </div>
  );
}

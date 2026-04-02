// src/components/common/StickyZalo.jsx
// Sticky CTA bar - luôn hiển thị ở bottom của màn hình mobile
// Bắt buộc theo rule: "Gọi Ngay" và "Chat Zalo" phải sticky trên mobile

import { Phone, MessageCircle } from "lucide-react";

export default function StickyZalo() {
  return (
    // pb-safe đảm bảo không bị safe-area-inset che khuất trên iPhone
    <div className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden shadow-2xl">
      {/* Nút Gọi Ngay */}
      <a
        href="tel:0901234567"
        className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-sm transition-colors duration-200 active:scale-95"
      >
        <Phone className="w-5 h-5 animate-pulse" />
        <span>Gọi Ngay</span>
      </a>

      {/* Divider */}
      <div className="w-px bg-green-800" />

      {/* Nút Chat Zalo */}
      <a
        href="https://zalo.me/0901234567"
        target="_blank"
        rel="noreferrer"
        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-sm transition-colors duration-200 active:scale-95"
      >
        <MessageCircle className="w-5 h-5" />
        <span>Chat Zalo</span>
      </a>
    </div>
  );
}

// src/components/property/PropertyInfo.jsx
// Hiển thị thông tin chi tiết BĐS: giá, diện tích, pháp lý, mô tả
// Nhận toàn bộ data qua props - không hardcode

import { Tag, Maximize2, Ruler, FileCheck, MapPin, Phone, MessageCircle } from "lucide-react";

// Row thông tin gọn
function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <Icon className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
      <div className="flex-1 flex justify-between gap-2">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="text-sm font-semibold text-gray-800 text-right">{value}</span>
      </div>
    </div>
  );
}

export default function PropertyInfo({ property }) {
  // Guard – tránh crash nếu data chưa load
  if (!property) return null;

  const {
    title,
    formattedPrice,
    formattedPricePerM2,
    formattedArea,
    dimensions,
    frontage,
    roadWidth,
    direction,
    legalStatus,
    planningStatus,
    landUse,
    description,
    contact,
    status,
    tags,
  } = property;

  return (
    <div className="space-y-4">
      {/* Tiêu đề & trạng thái */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {status || "Đang bán"}
          </span>
          {tags?.map((tag) => (
            <span
              key={tag}
              className="bg-blue-50 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-snug">
          {title}
        </h1>
      </div>

      {/* Giá - nổi bật */}
      <div className="bg-red-50 border border-red-100 rounded-xl p-4">
        <p className="text-sm text-gray-500 mb-1">Mức giá</p>
        <p className="text-3xl font-extrabold text-red-600">{formattedPrice}</p>
        {formattedPricePerM2 && (
          <p className="text-sm text-gray-500 mt-1">{formattedPricePerM2}</p>
        )}
      </div>

      {/* Thông số chi tiết */}
      <div className="bg-white border border-gray-200 rounded-xl px-4">
        <InfoRow icon={Maximize2} label="Diện tích" value={formattedArea} />
        {dimensions && <InfoRow icon={Ruler} label="Kích thước" value={dimensions} />}
        {frontage && <InfoRow icon={Ruler} label="Mặt tiền" value={frontage} />}
        {roadWidth && <InfoRow icon={Ruler} label="Rộng đường" value={roadWidth} />}
        {direction && <InfoRow icon={MapPin} label="Hướng" value={direction} />}
        {legalStatus && <InfoRow icon={FileCheck} label="Pháp lý" value={legalStatus} />}
        {planningStatus && <InfoRow icon={Tag} label="Quy hoạch" value={planningStatus} />}
        {landUse && <InfoRow icon={Tag} label="Mục đích SD" value={landUse} />}
      </div>

      {/* Mô tả */}
      {description && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            Mô tả
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      )}

      {/* Liên hệ - Desktop (Mobile dùng StickyZalo) */}
      {contact && (
        <div className="hidden md:block bg-blue-700 rounded-xl p-4 text-white">
          <p className="text-sm font-semibold mb-3">Liên hệ tư vấn</p>
          <p className="font-bold text-lg mb-4">{contact.name}</p>
          <div className="flex gap-3">
            <a
              href={`tel:${contact.phone}`}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-lg text-sm transition-all duration-200 hover:-translate-y-0.5"
            >
              <Phone className="w-4 h-4" />
              Gọi Ngay
            </a>
            <a
              href={`https://zalo.me/${contact.zalo}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-lg text-sm transition-all duration-200 hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4" />
              Chat Zalo
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

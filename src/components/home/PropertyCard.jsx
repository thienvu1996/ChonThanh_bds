// src/components/home/PropertyCard.jsx
// Card BĐS trong danh sách Homepage - nhận data qua props, không hardcode
// Micro-animation: hover scale ảnh + lift card

import { MapPin, Maximize2, FileCheck, Star } from "lucide-react";

const FALLBACK = "/assets/placeholder-land.jpg";

export default function PropertyCard({ property }) {
  if (!property) return null;

  const {
    id,
    title,
    formattedPrice,
    formattedArea,
    frontage,
    legalStatus,
    thumbnail,
    fallbackImage,
    location,
    type,
    isFeatured,
    status,
    tags,
  } = property;

  const imgSrc = thumbnail || fallbackImage || FALLBACK;

  return (
    <a
      href={`/bat-dong-san/${id}`}
      className="group flex flex-col bg-white rounded-2xl shadow hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
    >
      {/* Ảnh */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = FALLBACK;
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {isFeatured && (
            <span className="flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full shadow">
              <Star className="w-3 h-3" />
              Nổi bật
            </span>
          )}
          <span className="bg-blue-700 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            {type}
          </span>
        </div>

        {/* Trạng thái */}
        <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          {status || "Đang bán"}
        </span>
      </div>

      {/* Nội dung card */}
      <div className="flex flex-col flex-grow p-4 gap-2">
        {/* Giá */}
        <p className="text-xl font-extrabold text-red-600">{formattedPrice}</p>

        {/* Tiêu đề */}
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
          {title}
        </h3>

        {/* Meta: diện tích, mặt tiền, pháp lý */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
          {formattedArea && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
              {formattedArea}
            </span>
          )}
          {frontage && (
            <span className="text-xs text-gray-500">
              Mặt tiền {frontage}
            </span>
          )}
          {legalStatus && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <FileCheck className="w-3.5 h-3.5 text-green-500" />
              {legalStatus}
            </span>
          )}
        </div>

        {/* Vị trí */}
        {location && (
          <div className="flex items-center gap-1 mt-auto pt-2 border-t border-gray-100">
            <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="text-xs text-gray-500 truncate">{location}</span>
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-blue-50 text-blue-600 text-[11px] font-medium px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}

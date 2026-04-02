// src/components/property/MediaSlider.jsx
// Gallery ảnh cho trang chi tiết BĐS: ảnh chính + thumbnails bên dưới
// Fallback về ảnh placeholder nếu URL bị lỗi

import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

const FALLBACK = "/assets/placeholder-land.jpg";

export default function MediaSlider({ images = [], fallbackImage = FALLBACK, title = "" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgErrors, setImgErrors] = useState({});

  // Danh sách ảnh hợp lệ, tối thiểu 1 phần tử placeholder
  const imageList = images.length > 0 ? images : [FALLBACK];

  const handlePrev = () =>
    setActiveIndex((i) => (i - 1 + imageList.length) % imageList.length);
  const handleNext = () =>
    setActiveIndex((i) => (i + 1) % imageList.length);
  const handleImgError = (idx) =>
    setImgErrors((prev) => ({ ...prev, [idx]: true }));

  return (
    <div className="w-full">
      {/* Ảnh chính */}
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 group">
        {imgErrors[activeIndex] ? (
          // Hiển thị fallback UI nếu ảnh bị lỗi
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
            <ImageOff className="w-12 h-12" />
            <span className="text-sm">Không tải được ảnh</span>
          </div>
        ) : (
          <img
            src={imageList[activeIndex]}
            alt={`${title} - ảnh ${activeIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => handleImgError(activeIndex)}
          />
        )}

        {/* Overlay label */}
        <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {activeIndex + 1} / {imageList.length}
        </div>

        {/* Prev / Next buttons - chỉ hiện khi có nhiều hơn 1 ảnh */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Ảnh tiếp theo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {imageList.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                idx === activeIndex
                  ? "border-blue-600 scale-105"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <img
                src={imgErrors[idx] ? (fallbackImage || FALLBACK) : img}
                alt={`thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={() => handleImgError(idx)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

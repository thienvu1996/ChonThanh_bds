// src/components/property/AmenitiesList.jsx
// Danh sách tiện ích lân cận BĐS, hiển thị với checkmark icon

import { CheckCircle } from "lucide-react";

export default function AmenitiesList({ amenities = [] }) {
  // Không render block nếu không có dữ liệu (tránh UI trống)
  if (!amenities || amenities.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        Tiện ích lân cận
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {amenities.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
            <span className="text-sm text-gray-700">
              {item.name}
              {item.distance && (
                <span className="text-gray-400 ml-1">({item.distance})</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

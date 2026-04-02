// src/components/home/PropertyGrid.jsx
// Grid hiển thị danh sách PropertyCard: 1 col mobile, 2 col sm, 3 col lg

import PropertyCard from "./PropertyCard";

export default function PropertyGrid({ properties = [], loading = false }) {
  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow animate-pulse">
            <div className="bg-gray-200 aspect-[4/3] w-full" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg font-semibold">Không tìm thấy BĐS phù hợp</p>
        <p className="text-sm mt-1">Thử thay đổi bộ lọc tìm kiếm</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

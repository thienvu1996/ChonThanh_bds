// src/pages/HomePage.jsx
// Trang chủ: HeroBanner + floating SearchFilter + PropertyGrid
// Fetch fetchProperties từ api.js, xử lý loading + error

import { useEffect, useState } from "react";
import { fetchProperties } from "../services/api";
import MainLayout from "../layouts/MainLayout";
import HeroBanner from "../components/home/HeroBanner";
import SearchFilter from "../components/home/SearchFilter";
import PropertyGrid from "../components/home/PropertyGrid";
import VideoReview from "../components/home/VideoReview";
import { AlertTriangle } from "lucide-react";

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties()
      .then((data) => {
        setProperties(data);
        setFiltered(data);
      })
      .catch((err) => setError(err.message || "Lỗi kết nối server."))
      .finally(() => setLoading(false));
  }, []);

  // Xử lý lọc theo filter từ SearchFilter
  const handleSearch = ({ keyword, type, price, area, status }) => {
    let result = [...properties];

    // Lọc theo từ khóa (Keyword)
    if (keyword && keyword.trim() !== "") {
      const k = keyword.toLowerCase().trim();
      result = result.filter((p) => 
        (p.title || "").toLowerCase().includes(k) ||
        (p.location || "").toLowerCase().includes(k) ||
        (p.description || "").toLowerCase().includes(k) ||
        (p.tags || []).some(tag => tag.toLowerCase().includes(k))
      );
    }

    if (type !== "all") {
      result = result.filter((p) => p.type === type);
    }

    if (price !== "all") {
      const ranges = {
        "under-1ty":  [0, 1_000_000_000],
        "1ty-2ty":    [1_000_000_000, 2_000_000_000],
        "2ty-5ty":    [2_000_000_000, 5_000_000_000],
        "over-5ty":   [5_000_000_000, Infinity],
      };
      const [min, max] = ranges[price] || [0, Infinity];
      result = result.filter((p) => p.price >= min && p.price <= max);
    }

    if (area !== "all") {
      const areaRanges = {
        "under-100": [0, 100],
        "100-200":   [100, 200],
        "200-500":   [200, 500],
        "over-500":  [500, Infinity],
      };
      const [min, max] = areaRanges[area] || [0, Infinity];
      result = result.filter((p) => p.area >= min && p.area <= max);
    }

    if (status && status !== "all") {
      result = result.filter((p) => p.status === status);
    }

    setFiltered(result);
  };

  return (
    <MainLayout>
      {/* Hero + SearchFilter floating */}
      <HeroBanner>
        <SearchFilter onSearch={handleSearch} />
      </HeroBanner>

      {/* Padding top tạo khoảng trống cho SearchFilter floating (50% card height ≈ 80px) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">

        {/* Section title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Bất Động Sản Nổi Bật
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {filtered.length} bất động sản tại Chơn Thành
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-red-500">
            <AlertTriangle className="w-10 h-10" />
            <p className="font-semibold">Không thể tải danh sách BĐS</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        )}

        {/* PropertyGrid với loading skeleton */}
        {!error && <PropertyGrid properties={filtered} loading={loading} />}
      </div>

      {/* Video Review Section */}
      <div className="bg-gray-50 border-t border-gray-100">
        <VideoReview />
      </div>
    </MainLayout>
  );
}

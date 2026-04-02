// src/pages/NhaOPage.jsx
// Trang danh sách Nhà Ở - filter từ mockPropertyList theo type

import { useEffect, useState } from "react";
import { fetchProperties } from "../services/api";
import MainLayout from "../layouts/MainLayout";
import PropertyGrid from "../components/home/PropertyGrid";
import { Home, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function NhaOPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties()
      // Lọc cả "Nhà ở" lẫn "Nhà phố" cho trang này
      .then((data) =>
        setProperties(data.filter((p) => p.type === "Nhà ở" || p.type === "Nhà phố"))
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      {/* Banner nhỏ gọn hơn theo yêu cầu khách hàng */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white py-6 md:py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-1.5 text-green-200 text-[10px] mb-2 uppercase font-black tracking-widest">
            <Link to="/" className="hover:text-white flex items-center gap-1">
              <Home className="w-3 h-3" /> Trang chủ
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Nhà Ở</span>
          </nav>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            Danh Sách Nhà Ở Chơn Thành
          </h1>
          <p className="text-green-100/80 text-xs font-bold mt-1">
            {properties.length} căn nhà đang được đăng bán tại Chơn Thành, Bình Phước
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PropertyGrid properties={properties} loading={loading} />
      </div>
    </MainLayout>
  );
}

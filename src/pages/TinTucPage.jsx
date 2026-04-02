// src/pages/TinTucPage.jsx
// Blog/News grid 3 cột đều, mỗi card có ảnh, badge, title, excerpt, nút Đọc tiếp

import MainLayout from "../layouts/MainLayout";
import { Calendar, ArrowRight, Home, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const MOCK_NEWS = [
  {
    id: 1,
    title: "Bình Phước phê duyệt quy hoạch KCN mở rộng Becamex Chơn Thành 500ha",
    excerpt:
      "UBND tỉnh Bình Phước phê duyệt mở rộng KCN Becamex Chơn Thành thêm 500ha, thu hút 50.000 lao động, tạo động lực tăng trưởng BĐS mạnh mẽ.",
    date: "25/03/2026",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
    category: "Quy hoạch",
    categoryColor: "bg-purple-100 text-purple-700",
  },
  {
    id: 2,
    title: "Đất nền Chơn Thành tăng 20% trong năm 2025 — Xu hướng tiếp tục 2026",
    excerpt:
      "Giá đất nền tại Chơn Thành tăng trung bình 20% trong năm 2025 nhờ hạ tầng hoàn thiện và nhu cầu nhà ở công nhân tăng cao.",
    date: "20/03/2026",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80",
    category: "Thị trường",
    categoryColor: "bg-blue-100 text-blue-700",
  },
  {
    id: 3,
    title: "5 kinh nghiệm vàng khi mua đất nền lần đầu tại Bình Phước",
    excerpt:
      "Kiểm tra pháp lý, xác minh quy hoạch, so sánh giá thị trường và những điểm cần lưu ý khi ký hợp đồng đặt cọc.",
    date: "15/03/2026",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80",
    category: "Kinh nghiệm",
    categoryColor: "bg-green-100 text-green-700",
  },
  {
    id: 4,
    title: "Cao tốc TP.HCM – Chơn Thành: Cú hích lớn cho BĐS Bình Phước",
    excerpt:
      "Tuyến cao tốc dự kiến hoàn thành 2027 rút ngắn thời gian di chuyển xuống 45 phút, mở ra tiềm năng tăng giá BĐS vượt trội.",
    date: "10/03/2026",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    category: "Hạ tầng",
    categoryColor: "bg-orange-100 text-orange-700",
  },
];

export default function TinTucPage() {
  return (
    <MainLayout>
      {/* Banner */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
            <Link to="/" className="hover:text-white flex items-center gap-1">
              <Home className="w-3 h-3" /> Trang chủ
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Tin Tức</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-extrabold">Tin Tức BĐS Chơn Thành</h1>
          <p className="text-gray-400 text-sm mt-1">
            Cập nhật thị trường, quy hoạch và kinh nghiệm đầu tư BĐS Bình Phước
          </p>
        </div>
      </div>

      {/* Grid 3 cột đều */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_NEWS.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col"
            >
              {/* Ảnh */}
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.src = "/assets/placeholder-land.jpg"; }}
                />
              </div>

              {/* Nội dung */}
              <div className="p-5 flex flex-col flex-grow">
                {/* Category + Date */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${article.categoryColor}`}>
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {article.date}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-sm font-bold text-gray-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {article.title}
                </h2>

                {/* Excerpt */}
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 flex-grow">
                  {article.excerpt}
                </p>

                {/* Đọc tiếp */}
                <button className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors w-fit">
                  Đọc tiếp <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

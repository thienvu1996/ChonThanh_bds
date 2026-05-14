// src/pages/TinTucPage.jsx
import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { Calendar, ArrowRight, Home, ChevronRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchNewsArticles } from "../services/api";

const categoryClass = (category = "") => {
  const key = category.toLowerCase();
  if (key.includes("quy hoạch")) return "bg-purple-100 text-purple-700";
  if (key.includes("thị trường")) return "bg-blue-100 text-blue-700";
  if (key.includes("kinh nghiệm")) return "bg-green-100 text-green-700";
  if (key.includes("hạ tầng")) return "bg-orange-100 text-orange-700";
  return "bg-gray-100 text-gray-700";
};

export default function TinTucPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchNewsArticles()
      .then((data) => mounted && setArticles(data))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <MainLayout>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="py-20 flex items-center justify-center gap-3 text-gray-400 font-bold">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            Đang tải tin tức...
          </div>
        ) : articles.length === 0 ? (
          <div className="py-20 text-center text-gray-400 font-bold">
            Chưa có tin tức nào được xuất bản
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = "/assets/placeholder-land.jpg"; }}
                  />
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryClass(article.category)}`}>
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {article.date}
                    </span>
                  </div>

                  <h2 className="text-sm font-bold text-gray-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {article.title}
                  </h2>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 flex-grow">
                    {article.excerpt}
                  </p>

                  <span className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-700 w-fit">
                    Đọc tiếp <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

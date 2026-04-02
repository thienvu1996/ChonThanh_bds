// src/pages/AboutPage.jsx
import MainLayout from "../layouts/MainLayout";
import { ShieldCheck, Heart, Eye, Target } from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80";

const CORE_VALUES = [
  {
    icon: ShieldCheck,
    title: "Uy Tín",
    color: "text-blue-600",
    bg: "bg-blue-50",
    desc: "Cam kết thông tin pháp lý chính xác, minh bạch 100%. Chúng tôi ưu tiên quyền lợi khách hàng hơn lợi nhuận ngắn hạn.",
  },
  {
    icon: Heart,
    title: "Tận Tâm",
    color: "text-red-500",
    bg: "bg-red-50",
    desc: "Đồng hành cùng khách hàng từ bước tìm kiếm, thương lượng đến khi hoàn tất thủ tục sang tên sổ đỏ.",
  },
  {
    icon: Eye,
    title: "Minh Bạch",
    color: "text-green-600",
    bg: "bg-green-50",
    desc: "Không phí ẩn, không thông tin sai lệch. Mọi giao dịch đều được ghi nhận rõ ràng và có hợp đồng đầy đủ.",
  },
];

export default function AboutPage() {
  return (
    <MainLayout>
      {/* SECTION 1: Hero Banner */}
      <section className="relative w-full h-64 md:h-80 flex items-center justify-center overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Về BĐS Chơn Thành"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-4">
          <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-2">
            Câu chuyện của chúng tôi
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
            Về Chúng Tôi — BĐS Chơn Thành
          </h1>
          <p className="text-gray-200 text-sm mt-3 max-w-xl mx-auto">
            Đơn vị tiên phong trong lĩnh vực bất động sản tại thị xã Chơn Thành, Bình Phước.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* SECTION 2: Giá trị cốt lõi */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Giá Trị Cốt Lõi</h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl mx-auto">
              Ba trụ cột định hình nên văn hóa và phương châm hành động của BĐS Chơn Thành.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CORE_VALUES.map(({ icon: Icon, title, color, bg, desc }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md p-8 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 ${bg} ${color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: Tầm nhìn & Sứ mệnh */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-blue-700 text-white rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-blue-200" />
              <h2 className="text-xl font-bold">Tầm Nhìn</h2>
            </div>
            <p className="text-blue-100 leading-relaxed text-sm">
              Trở thành sàn giao dịch bất động sản số 1 tại thị xã Chơn Thành và các huyện lân cận của tỉnh Bình Phước vào năm 2027, với hệ thống công nghệ hiện đại và đội ngũ chuyên gia giàu kinh nghiệm.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900">Sứ Mệnh</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm">
              Kết nối những cơ hội đầu tư tốt nhất với từng khách hàng, giúp mọi người an cư lạc nghiệp và gia tăng tài sản bền vững trên vùng đất giàu tiềm năng Chơn Thành — Bình Phước.
            </p>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

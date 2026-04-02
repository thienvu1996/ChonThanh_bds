// src/pages/ContactPage.jsx
// 2 cột desktop, 1 cột mobile: Form liên hệ + Thông tin công ty + Bản đồ

import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PropertyMap from "../components/property/PropertyMap";
import { MapPin, Phone, Mail, Send, CheckCircle } from "lucide-react";

const OFFICE_COORDINATES = { lat: 11.4240, lng: 106.5962 };

const NEEDS = [
  "Mua đất nền",
  "Mua nhà ở",
  "Bán bất động sản",
  "Cho thuê",
  "Tư vấn đầu tư",
  "Khác",
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", need: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submit – thực tế sẽ gọi API backend
    setSubmitted(true);
  };

  return (
    <MainLayout>
      {/* Hero nhỏ */}
      <div className="bg-blue-700 text-white py-10 px-4 text-center">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-1">Liên Hệ Với Chúng Tôi</h1>
        <p className="text-blue-200 text-sm">Đội ngũ tư vấn sẵn sàng hỗ trợ bạn 7 ngày / tuần</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT: Form liên hệ */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Gửi Yêu Cầu Tư Vấn</h2>

            {submitted ? (
              // Success state
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-green-600">
                <CheckCircle className="w-14 h-14" />
                <p className="text-lg font-bold">Đã nhận yêu cầu!</p>
                <p className="text-sm text-gray-500 text-center">
                  Chúng tôi sẽ liên hệ lại với bạn trong vòng 30 phút.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", need: "", message: "" }); }}
                  className="mt-2 text-sm text-blue-600 underline"
                >
                  Gửi yêu cầu khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Họ tên */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-gray-50"
                  />
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="0901 234 567"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-gray-50"
                  />
                </div>

                {/* Nhu cầu */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Nhu cầu
                  </label>
                  <select
                    name="need"
                    value={form.need}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-gray-50"
                  >
                    <option value="">-- Chọn nhu cầu --</option>
                    {NEEDS.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                {/* Ghi chú */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Nội dung thêm
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Mô tả khu vực, diện tích, ngân sách..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-gray-50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  Gửi Yêu Cầu
                </button>
              </form>
            )}
          </div>

          {/* RIGHT: Thông tin + Bản đồ văn phòng */}
          <div className="space-y-5">
            {/* Thông tin công ty */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Thông Tin Văn Phòng</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold">Địa chỉ</p>
                    <p className="text-gray-500">Khu phố 4, Phường Thành Tâm, Thị xã Chơn Thành, Bình Phước</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-600 shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold text-gray-700">Hotline</p>
                    <a href="tel:0901234567" className="text-green-600 hover:underline">0901.234.567</a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold text-gray-700">Email</p>
                    <a href="mailto:info@bdschonthanh.com" className="text-blue-600 hover:underline">info@bdschonthanh.com</a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Bản đồ văn phòng */}
            <div>
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Vị trí văn phòng
              </p>
              <PropertyMap
                coordinates={OFFICE_COORDINATES}
                title="Văn phòng BĐS Chơn Thành"
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

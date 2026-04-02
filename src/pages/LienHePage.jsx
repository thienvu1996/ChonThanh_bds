import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PropertyMap from "../components/property/PropertyMap";
import { MapPin, Phone, Mail, Send, CheckCircle, Home, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getSettings } from "../utils/settingsStore";
import { saveLead } from "../utils/leadStore";

const OFFICE_COORDINATES = { lat: 11.4240, lng: 106.5962 };

export default function LienHePage() {
  const [settings, setSettings] = useState(getSettings());
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  useEffect(() => {
    const handleUpdate = () => setSettings(getSettings());
    window.addEventListener("settingsUpdated", handleUpdate);
    return () => window.removeEventListener("settingsUpdated", handleUpdate);
  }, []);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    saveLead({
      ...form,
      source: "Trang Liên Hệ"
    });
    setSubmitted(true);
  };

  return (
    <MainLayout>
      {/* Banner */}
      <div className="bg-blue-700 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-1.5 text-blue-200 text-xs mb-3">
            <Link to="/" className="hover:text-white flex items-center gap-1">
              <Home className="w-3 h-3" /> Trang chủ
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Liên Hệ</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-extrabold">Liên Hệ Với Chúng Tôi</h1>
          <p className="text-blue-200 text-sm mt-1">
            Đội ngũ tư vấn sẵn sàng hỗ trợ 7 ngày / tuần từ 7:00 – 21:00
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT: Form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Gửi Yêu Cầu</h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-green-600">
                <CheckCircle className="w-14 h-14" />
                <p className="text-lg font-bold">Đã nhận yêu cầu!</p>
                <p className="text-sm text-gray-500 text-center">
                  Chúng tôi sẽ liên hệ lại trong vòng 30 phút.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", message: "" }); }}
                  className="mt-2 text-sm text-blue-600 underline"
                >
                  Gửi yêu cầu khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Nội dung
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tôi muốn tìm mua đất nền khoảng 1 tỷ tại Chơn Thành..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-gray-50 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Send className="w-4 h-4" />
                  Gửi Yêu Cầu
                </button>
              </form>
            )}
          </div>

          {/* RIGHT: Company info + Map */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Thông Tin Liên Hệ</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold text-gray-700">Địa chỉ office</p>
                    <p className="text-gray-500">{settings.address}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-600 shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold text-gray-700">Hotline tư vấn</p>
                    <a href={`tel:${settings.phone}`} className="text-green-600 font-bold hover:underline">{settings.phone}</a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold text-gray-700">Email phản hồi</p>
                    <a href={`mailto:${settings.email}`} className="text-blue-600 font-bold hover:underline">{settings.email}</a>
                  </div>
                </li>
              </ul>
            </div>

            <PropertyMap
              coordinates={OFFICE_COORDINATES}
              title="Văn phòng BĐS Chơn Thành"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

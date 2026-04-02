import { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Facebook } from "lucide-react";
import { getSettings } from "../../utils/settingsStore";
import logo from "../../assets/logo.png";

export default function Footer() {
  const [settings, setSettings] = useState(getSettings());

  useEffect(() => {
    const handleUpdate = () => setSettings(getSettings());
    window.addEventListener("settingsUpdated", handleUpdate);
    return () => window.removeEventListener("settingsUpdated", handleUpdate);
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Cột 1: Thương hiệu */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm border border-gray-800/10">
                <img src={logo} alt="Logo" className="w-full h-full object-contain p-0.5" />
              </div>
              <span className="font-black text-white text-lg uppercase tracking-tight">{settings.siteTitle}</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 font-medium italic opacity-80">
              Chuyên trang bất động sản uy tín tại khu vực Chơn Thành, Bình Phước. Pháp lý minh bạch, hỗ trợ tận tâm.
            </p>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-blue-400 hover:text-blue-300 transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <Facebook className="w-4 h-4" />
              Theo dõi Fanpage
            </a>
          </div>

          {/* Cột 2: Link nhanh */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Danh mục
            </h3>
            <ul className="space-y-2">
              {["Đất nền", "Đất vườn", "Nhà ở", "Nhà phố thương mại", "Tin tức BĐS"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Cột 3: Liên hệ */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Liên hệ
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li>
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-2 text-sm hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-green-400 shrink-0" />
                  <span>{settings.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 text-sm hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{settings.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & copyright */}
        <div className="border-t border-gray-800 mt-8 pt-4 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
          {settings.footerText}
        </div>
      </div>
    </footer>
  );
}

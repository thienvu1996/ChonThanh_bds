import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Menu, X, MapPin } from "lucide-react";
import { getSettings } from "../../utils/settingsStore";
import logo from "../../assets/logo.png";

const NAV_LINKS = [
  { label: "Trang Chủ", href: "/" },
  { label: "Đất Nền", href: "/dat-nen" },
  { label: "Nhà Ở", href: "/nha-o" },
  { label: "Tin Tức", href: "/tin-tuc" },
  { label: "Liên Hệ", href: "/lien-he" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settings, setSettings] = useState(getSettings());
  const location = useLocation();

  useEffect(() => {
    const handleUpdate = () => setSettings(getSettings());
    window.addEventListener("settingsUpdated", handleUpdate);
    return () => window.removeEventListener("settingsUpdated", handleUpdate);
  }, []);

  // Active check
  const isActive = (href) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-md border border-gray-100">
              <img src={logo} alt="Logo" className="w-full h-full object-contain p-0.5" />
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-black text-blue-700 uppercase tracking-tight">
                {settings.siteTitle}
              </span>
              <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                Chuyên BĐS Chơn Thành
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.href)
                    ? "text-blue-700 font-bold"
                    : "text-gray-700 hover:text-blue-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Hotline - desktop */}
          <a
            href={`tel:${settings.phone}`}
            className="hidden md:flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
          >
            <Phone className="w-4 h-4" />
            <span>{settings.phone}</span>
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className={`py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.href)
                    ? "bg-blue-50 text-blue-700 font-bold"
                    : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${settings.phone}`}
              className="mt-2 flex items-center justify-center gap-2 bg-green-600 text-white text-sm font-semibold py-3 rounded-lg"
            >
              <Phone className="w-4 h-4" />
              Gọi Ngay: {settings.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

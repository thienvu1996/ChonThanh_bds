// src/layouts/AdminLayout.jsx
import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  LayoutDashboard,
  Building2,
  Users,
  Pencil,
  Plus,
  Settings,
  Image as ImageIcon,
  Save,
  Pencil as PencilIcon,
  Trash2,
  ImageOff,
  Menu,
  X,
  LogOut,
  Bell,
  ChevronRight,
} from "lucide-react";
import { useEffect } from "react";
import { getLeads } from "../utils/leadStore";

const MENU = [
  { label: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { label: "Quản lý BĐS", href: "/admin/properties", icon: Building2 },
  { label: "Khách hàng", href: "/admin/leads", icon: Users },
  { label: "Cài đặt hệ thống", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const [newLeadsCount, setNewLeadsCount] = useState(0);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const updateCount = () => {
      const leads = getLeads();
      const count = leads.filter(l => l.status === "Mới").length;
      setNewLeadsCount(count);
    };
    
    updateCount();
    window.addEventListener("leadsUpdated", updateCount);
    return () => window.removeEventListener("leadsUpdated", updateCount);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  const active = (href) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="min-h-screen flex bg-[#f4f6fb]">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ─── SIDEBAR ─── */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-40 w-[280px] flex flex-col
          bg-white border-r border-gray-100 shadow-xl
          transition-all duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:sticky md:top-0 md:shadow-none
        `}
      >
        {/* Brand */}
        <div className="flex flex-col justify-center h-20 px-6 border-b border-gray-100 bg-gray-50/30">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 border border-gray-100">
              <img src={logo} alt="Logo" className="w-full h-full object-contain p-0.5" />
            </div>
            <div>
              <p className="text-[15px] font-black text-gray-900 leading-none tracking-tight">BĐS Admin</p>
              <p className="text-[10px] font-bold text-gray-400 mt-1.5 uppercase tracking-widest">Hệ thống quản trị</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
            Danh mục chính
          </p>
          {MENU.map(({ label, href, icon: Icon }) => {
            const isActive = active(href);
            return (
              <Link
                key={href}
                to={href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-bold
                  transition-all duration-200 group
                  ${isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-[18px] h-[18px] ${isActive ? "text-white" : "text-gray-400 group-hover:text-blue-600 transition-colors"}`} />
                  {label}
                </div>
                {label === "Khách hàng" && newLeadsCount > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? "bg-white text-blue-600" : "bg-red-500 text-white"
                  }`}>
                    {newLeadsCount}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-6 border-t border-gray-100 bg-gray-50/20 space-y-3">
          {/* User profile */}
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white border border-gray-100 shadow-sm mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-base font-black shadow-md">
              A
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-gray-900 truncate">Admin User</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Quản trị viên</p>
            </div>
          </div>

          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-all group"
          >
            <div className="w-[18px] h-[18px] flex items-center justify-center">
              <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            </div>
            Về trang chủ
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold text-red-500 hover:bg-red-50 transition-all group"
          >
            <LogOut className="w-[18px] h-[18px] group-hover:rotate-6 transition-transform" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-5 bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm font-bold text-gray-900">
                {MENU.find((m) => active(m.href))?.label ?? "Dashboard"}
              </h1>
              <p className="text-[11px] text-gray-400 hidden sm:block">
                {new Date().toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

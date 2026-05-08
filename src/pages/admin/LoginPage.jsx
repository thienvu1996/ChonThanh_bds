import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, Eye, EyeOff, LogIn, ArrowRight } from "lucide-react";
import logo from "../../assets/logo.png";
import { supabase } from "../../utils/supabaseClient";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" }); // Đổi username thành email
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      toast.success("Đăng nhập thành công!");
      navigate("/admin");
    } catch (err) {
      toast.error(err.message || "Tài khoản hoặc mật khẩu không chính xác.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-xl mb-6 p-2 border border-gray-100">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Quản Trị Hệ Thống</h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">BĐS Chơn Thành</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-100/50 p-8 md:p-10 border border-gray-50">
          <form onSubmit={handleLogin} className="space-y-6">

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email quản trị</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Mật khẩu</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 group hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  ĐĂNG NHẬP NGAY
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Home link */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-blue-600 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 mx-auto justify-center"
          >
            <ArrowRight size={14} className="rotate-180" /> Quay về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

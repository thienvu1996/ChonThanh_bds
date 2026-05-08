import React, { useState, useEffect } from "react";
import {
  Users, Search, Phone, MessageSquare, Calendar,
  Trash2, CheckCircle, Clock, AlertCircle, Download, ExternalLink,
  ChevronRight, Filter
} from "lucide-react";
import { fetchLeads, markLeadAsRead, deleteProperty } from "../../services/api"; // Lưu ý: Cần thêm hàm deleteLead vào api.js
import { supabase } from "../../utils/supabaseClient";
import toast from "react-hot-toast";
import * as XLSX from 'xlsx';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, new, read

  useEffect(() => {
    loadLeads();

    // 1. KÍCH HOẠT REAL-TIME: Lắng nghe bảng 'leads' trên Supabase
    const subscription = supabase
      .channel('leads_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (payload) => {
        console.log('Có khách hàng mới:', payload.new);
        setLeads(prev => [payload.new, ...prev]);
        toast.success("🔔 CÓ KHÁCH HÀNG MỚI QUAN TÂM!", {
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#2563eb',
            color: '#fff',
            fontWeight: 'black'
          }
        });
        // Phát một tiếng báo hiệu nhỏ (tùy chọn)
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => { });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = await fetchLeads();
      setLeads(data);
    } catch (e) {
      toast.error("Không thể tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markLeadAsRead(id);
      setLeads(prev => prev.map(l => l.id === id ? { ...l, is_read: true } : l));
      toast.success("Đã đánh dấu đã đọc");
    } catch (e) {
      toast.error("Lỗi cập nhật");
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thông tin này?")) return;
    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
      setLeads(prev => prev.filter(l => l.id !== id));
      toast.success("Đã xóa khách hàng");
    } catch (e) {
      toast.error("Lỗi khi xóa");
    }
  };

  const exportToExcel = () => {
    const data = leads.map(l => ({
      "Tên khách hàng": l.customer_name,
      "Số điện thoại": l.phone,
      "Ghi chú/Lời nhắn": l.message,
      "Căn BĐS quan tâm": l.properties?.title || "Trang chủ",
      "Ngày gửi": new Date(l.created_at).toLocaleString("vi-VN"),
      "Trạng thái": l.is_read ? "Đã đọc" : "Khách mới"
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSachKhach");
    XLSX.writeFile(wb, `KhachHang_${new Date().getTime()}.xlsx`);
    toast.success("Đã xuất file Excel!");
  };

  const filtered = leads.filter(l => {
    const matchSearch = (l.customer_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.phone || "").includes(searchTerm);
    if (filter === "new") return matchSearch && !l.is_read;
    if (filter === "read") return matchSearch && l.is_read;
    return matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Quản Lý Khách Hàng</h1>
          <p className="text-sm text-gray-500 font-medium">Bạn có {leads.filter(l => !l.is_read).length} thông báo khách hàng mới chưa đọc</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportToExcel} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-black shadow-lg shadow-green-100 transition-all hover:-translate-y-1">
            <Download size={18} /> <span className="hidden sm:inline">XUẤT EXCEL</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc số điện thoại..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none font-bold focus:ring-4 focus:ring-blue-50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
          <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === "all" ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-gray-400 hover:bg-gray-50"}`}>Tất cả</button>
          <button onClick={() => setFilter("new")} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === "new" ? "bg-red-500 text-white shadow-lg shadow-red-100" : "text-gray-400 hover:bg-gray-50"}`}>Mới</button>
          <button onClick={() => setFilter("read")} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === "read" ? "bg-green-600 text-white shadow-lg shadow-green-100" : "text-gray-400 hover:bg-gray-50"}`}>Đã đọc</button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-20 font-bold text-gray-400 uppercase tracking-widest text-[10px] animate-pulse">Đang tải khách hàng...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200 mb-4">
            <Users size={40} />
          </div>
          <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Hiện tại chưa có khách hàng nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(l => (
            <div key={l.id} className={`bg-white rounded-[2rem] border transition-all p-6 group relative overflow-hidden ${l.is_read ? "border-gray-100" : "border-blue-200 shadow-xl shadow-blue-50 ring-1 ring-blue-100"}`}>
              {!l.is_read && <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />}

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 flex-col ${l.is_read ? "bg-gray-50 text-gray-400" : "bg-blue-600 text-white shadow-lg shadow-blue-100 animate-pulse"}`}>
                    <Users size={24} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-black text-lg ${l.is_read ? "text-gray-700" : "text-blue-600"}`}>{l.customer_name}</h3>
                      {!l.is_read && <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-md text-[8px] font-black uppercase tracking-tighter">Mới</span>}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {l.message?.includes("Sổ Đỏ") && (
                        <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-md text-[8px] font-black border border-red-100 flex items-center gap-1 animate-bounce">
                          <AlertCircle size={10} /> PHÁP LÝ
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg text-gray-900 leading-none"><Phone size={12} className="text-blue-600" /> {l.phone}</span>
                      <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(l.created_at).toLocaleString("vi-VN")}</span>
                      {l.properties?.title && <span className="flex items-center gap-1.5 text-blue-600 underline decoration-blue-200 underline-offset-4"><ExternalLink size={12} /> {l.properties.title}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex-1 lg:max-w-md bg-gray-50/50 p-4 rounded-2xl italic text-sm text-gray-500 border border-gray-100">
                  {l.message || "Không có lời nhắn"}
                </div>

                <div className="flex items-center gap-2 lg:flex-row-reverse">
                  <button
                    onClick={() => handleDeleteLead(l.id)}
                    className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Xóa thông tin"
                  >
                    <Trash2 size={20} />
                  </button>
                  {l.is_read ? (
                    <div className="px-5 py-2.5 rounded-xl bg-gray-50 text-gray-400 font-black text-[10px] uppercase flex items-center gap-2">
                      <CheckCircle size={14} /> Đã xử lý
                    </div>
                  ) : (
                    <button
                      onClick={() => handleMarkAsRead(l.id)}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-black text-[10px] uppercase shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
                    >
                      Xác nhận đã đọc
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

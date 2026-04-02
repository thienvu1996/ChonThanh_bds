import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLeads, updateLeadStatus, updateLeadNote, deleteLead, LEAD_STATUS } from "../../utils/leadStore";
import { 
  Users, Search, Filter, Trash2, Phone, Mail, 
  MessageSquare, Calendar, MoreVertical, CheckCircle, 
  Clock, AlertCircle, XCircle, ExternalLink, Copy, Check
} from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const loadLeads = () => {
      setLeads(getLeads());
    };
    loadLeads();
    window.addEventListener("leadsUpdated", loadLeads);
    return () => window.removeEventListener("leadsUpdated", loadLeads);
  }, []);

  const handleCopyPhone = (phone, id) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNoteChange = (id, note) => {
    updateLeadNote(id, note);
    // Cập nhật local state để UI mượt mà
    setLeads(prev => prev.map(l => l.id === id ? { ...l, adminNote: note } : l));
  };

  const filteredLeads = leads.filter(l => {
    const matchesFilter = filter === "all" || l.status === filter;
    const matchesSearch = 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.phone.includes(searchTerm) ||
      (l.adminNote || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case LEAD_STATUS.NEW:
        return "bg-blue-100 text-blue-700 border-blue-200";
      case LEAD_STATUS.CONTACTED:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case LEAD_STATUS.INTERESTED:
        return "bg-green-100 text-green-700 border-green-200";
      case LEAD_STATUS.NOT_POTENTIAL:
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Quản lý Khách hàng
          </h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
            {filteredLeads.length} yêu cầu tư vấn
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Tìm tên, SĐT, ghi chú..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none w-full sm:w-64 transition-all"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer font-bold text-gray-600"
          >
            <option value="all">Tất cả trạng thái</option>
            {Object.values(LEAD_STATUS).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Khách hàng</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Nguồn / BĐS Quát tâm</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Ghi chú Admin</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{lead.name}</span>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500">
                          <div className="flex items-center gap-1 group/phone">
                            <span className="font-bold text-green-600">{lead.phone}</span>
                            <button 
                              onClick={() => handleCopyPhone(lead.phone, lead.id)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              {copiedId === lead.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                          {lead.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-blue-500" /> {lead.email}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col max-w-[200px]">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{lead.source}</span>
                        {lead.propertyId ? (
                          <Link 
                            to={`/bat-dong-san/${lead.propertyId}`} 
                            className="text-[11px] text-blue-600 font-bold mt-1 inline-flex items-center gap-1 hover:underline truncate"
                            title={lead.propertyName}
                          >
                            {lead.propertyName}
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </Link>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic mt-1">Quan tâm chung</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <textarea
                        value={lead.adminNote || ""}
                        onChange={(e) => handleNoteChange(lead.id, e.target.value)}
                        placeholder="Ghi chú tương tác..."
                        className="w-full bg-transparent border-0 focus:ring-0 text-xs text-gray-600 resize-none font-medium h-10 hover:bg-white/50 focus:bg-white p-1 rounded transition-all"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                        className={`text-[10px] font-black px-3 py-1.5 rounded-full border appearance-none cursor-pointer focus:outline-none transition-all shadow-sm ${getStatusStyle(lead.status)}`}
                      >
                        {Object.values(LEAD_STATUS).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { if(window.confirm("Xác nhận xóa khách hàng này khỏi hệ thống?")) deleteLead(lead.id); }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-300">
                      <Users className="w-12 h-12" />
                      <p className="text-sm font-bold">Chưa có khách hàng nào phù hợp</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 gap-4">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-blue-500" />
          Dữ liệu khách hàng được bảo mật và lưu trữ nội bộ
        </p>
        <div className="flex gap-4">
           <div className="flex items-center gap-1.5">
             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black text-gray-600 uppercase">Hệ thống đang hoạt động</span>
           </div>
        </div>
      </div>
    </div>
  );
}

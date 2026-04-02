// src/pages/admin/DashboardPage.jsx
// Trang tổng quan Admin: 4 stat cards + bảng BĐS mới nhất

import { mockPropertyList } from "../../utils/mockData";
import { Building2, CheckCircle, Clock, Eye, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { getLeads } from "../../utils/leadStore";

export default function DashboardPage() {
  const leads = getLeads();
  const newLeadsCount = leads.filter(l => l.status === "Mới").length;

  const STATS = [
    {
      label: "Tổng số BĐS",
      value: "6",
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      label: "Yêu cầu mới",
      value: newLeadsCount.toString(),
      icon: Users,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
    },
    {
      label: "Đang chờ duyệt",
      value: "1",
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-100",
    },
    {
      label: "Lượt xem hôm nay",
      value: "312",
      icon: Eye,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
    },
  ];
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Tổng Quan</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div
            key={label}
            className={`bg-white rounded-2xl border ${border} p-5 flex items-center gap-4 shadow-sm`}
          >
            <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 leading-tight">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* BĐS mới nhất */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 text-sm">BĐS Mới Nhất</h3>
          <Link
            to="/admin/properties"
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            Xem tất cả →
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {mockPropertyList.slice(0, 4).map((p) => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-3">
              <img
                src={p.thumbnail || "/assets/placeholder-land.jpg"}
                alt={p.title}
                className="w-12 h-10 rounded-lg object-cover shrink-0 bg-gray-100"
                onError={(e) => { e.currentTarget.src = "/assets/placeholder-land.jpg"; }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{p.title}</p>
                <p className="text-xs text-gray-400">{p.location}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-red-600">{p.formattedPrice}</p>
                <span className="text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

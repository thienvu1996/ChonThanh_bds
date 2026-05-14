import { useState } from "react";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";

const PROPERTY_TYPES = [
  { value: "all", label: "Tất cả loại BĐS" },
  { value: "Đất nền", label: "Đất nền" },
  { value: "Đất vườn", label: "Đất vườn" },
  { value: "Nhà ở", label: "Nhà ở" },
  { value: "Nhà phố", label: "Nhà phố" },
];

const PRICE_RANGES = [
  { value: "all", label: "Tất cả mức giá" },
  { value: "under-1ty", label: "Dưới 1 tỷ" },
  { value: "1ty-2ty", label: "1 - 2 tỷ" },
  { value: "2ty-5ty", label: "2 - 5 tỷ" },
  { value: "over-5ty", label: "Trên 5 tỷ" },
];

const AREA_RANGES = [
  { value: "all",       label: "Tất cả diện tích" },
  { value: "under-100", label: "Dưới 100 m²" },
  { value: "100-200",   label: "100 – 200 m²" },
  { value: "200-500",   label: "200 – 500 m²" },
  { value: "over-500",  label: "Trên 500 m²" },
];

const STATUS_OPTIONS = [
  { value: "all",        label: "Tất cả trạng thái" },
  { value: "Đang bán",  label: "Đang bán" },
  { value: "Đã bán",    label: "Đã bán" },
  { value: "Đang cọc",  label: "Đang cọc" },
];

const EMPTY = { keyword: "", type: "all", price: "all", area: "all", status: "all" };

const selectCls = "w-full min-w-0 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition truncate";
const labelCls  = "block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide";

export default function SearchFilter({ onSearch }) {
  const [filters, setFilters] = useState(EMPTY);
  const [isOpen, setIsOpen] = useState(false); // For mobile collapse

  const handleChange = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value }));

  const handleSearch = () => {
    onSearch?.(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilters(EMPTY);
    onSearch?.(EMPTY);
  };

  const isFiltered = filters.keyword !== "" || Object.entries(filters).some(([k, v]) => k !== "keyword" && v !== "all");

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-5 border border-gray-100 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 gap-4">
        
        {/* Main Search Bar (Keyword) */}
        <div className="relative group lg:hidden">
          <label className={labelCls}>Tìm Kiếm Từ Khóa</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text"
              placeholder="Nhập tên bds, địa chỉ hoặc từ khóa..."
              value={filters.keyword}
              onChange={e => handleChange("keyword", e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              className="w-full min-w-0 pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
            />
          </div>
        </div>

        {/* Filters Toggle (Mobile only) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-600"
        >
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Bộ lọc nâng cao
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Desktop Filters Row (Visible on LG, conditional on Mobile) */}
        <div className={`${isOpen ? "grid" : "hidden lg:grid"} grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(260px,1fr)_minmax(130px,160px)_minmax(130px,160px)_minmax(130px,160px)_minmax(130px,160px)_140px] xl:grid-cols-[minmax(320px,1fr)_minmax(150px,180px)_minmax(150px,180px)_minmax(150px,180px)_minmax(150px,180px)_150px] gap-4 items-end`}>
          <div className="hidden lg:block min-w-0 relative group">
            <label className={labelCls}>Tìm Kiếm Từ Khóa</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Nhập tên bds, địa chỉ hoặc từ khóa..."
                value={filters.keyword}
                onChange={e => handleChange("keyword", e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                className="w-full min-w-0 pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>
          </div>
          
          <div className="w-full min-w-0">
            <label className={labelCls}>Loại BĐS</label>
            <select value={filters.type} onChange={e => handleChange("type", e.target.value)} className={selectCls}>
              {PROPERTY_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="w-full min-w-0">
            <label className={labelCls}>Khoảng giá</label>
            <select value={filters.price} onChange={e => handleChange("price", e.target.value)} className={selectCls}>
              {PRICE_RANGES.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className="w-full min-w-0">
            <label className={labelCls}>Diện tích</label>
            <select value={filters.area} onChange={e => handleChange("area", e.target.value)} className={selectCls}>
              {AREA_RANGES.map(a => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>

          <div className="w-full min-w-0">
            <label className={labelCls}>Trạng thái</label>
            <select value={filters.status} onChange={e => handleChange("status", e.target.value)} className={selectCls}>
              {STATUS_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Action Buttons inside the row for Desktop, or full width on Mobile */}
          <div className="flex items-center gap-2 w-full">
            {isFiltered && (
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-1.5 border border-gray-300 hover:border-red-400 hover:text-red-500 text-gray-500 font-bold px-4 py-2.5 rounded-lg transition-all text-sm whitespace-nowrap h-[42px]"
                title="Xóa tất cả bộ lọc"
              >
                <X className="w-3.5 h-3.5" /> <span className="lg:hidden">Xóa lọc</span>
              </button>
            )}
            <button
              onClick={handleSearch}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-black px-5 py-2.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95 text-sm whitespace-nowrap h-[42px]"
            >
              <Search className="w-4 h-4" />
              <span>TÌM KIẾM</span>
            </button>
          </div>
        </div>

      </div>

      {/* Filter status summary (Mobile only, when collapsed) */}
      {!isOpen && isFiltered && (
        <div className="lg:hidden mt-3 flex flex-wrap gap-2 pt-3 border-t border-gray-50">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Đang lọc:</span>
          {filters.keyword && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded">"{filters.keyword}"</span>}
          {filters.type !== "all" && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded">{filters.type}</span>}
          {filters.price !== "all" && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded">Giá</span>}
          <button onClick={handleReset} className="text-[10px] font-black text-red-500 underline ml-auto">Xóa tất cả</button>
        </div>
      )}
    </div>
  );
}

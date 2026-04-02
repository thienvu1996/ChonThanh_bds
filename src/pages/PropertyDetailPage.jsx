import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPropertyDetails } from "../services/api";
import { getSettings } from "../utils/settingsStore";
import { saveLead } from "../utils/leadStore";
import MainLayout from "../layouts/MainLayout";
import PropertyMap from "../components/property/PropertyMap";
import {
  Loader2, AlertTriangle, MapPin, Phone, MessageCircle,
  ChevronRight, Maximize2, Ruler, FileCheck, Tag, Calendar,
  Home, Star, Send, Layers, Play, Image as ImageIcon,
  Map as MapIcon, Info, ExternalLink, X, ChevronLeft
} from "lucide-react";

const FALLBACK = "/assets/placeholder-land.jpg";

// ─── Media Section Components ─────────────────────────────────

function Lightbox({ images, activeIndex, onClose, onPrev, onNext }) {
  if (activeIndex === null) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      <button onClick={onClose} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all">
        <X className="w-6 h-6" />
      </button>
      
      <div className="relative w-full max-w-5xl aspect-[16/10] flex items-center justify-center">
        {images.length > 1 && (
          <button onClick={onPrev} className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        
        <img 
          src={images[activeIndex]} 
          alt="" 
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in duration-300" 
          onError={e => { e.currentTarget.src = FALLBACK; }}
        />

        {images.length > 1 && (
          <button onClick={onNext} className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all">
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="mt-6 text-white text-sm font-bold bg-white/10 px-4 py-2 rounded-full">
        {activeIndex + 1} / {images.length}
      </div>
    </div>
  );
}

function SectionTitle({ title, icon: Icon }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">{title}</h3>
    </div>
  );
}

function ImageGrid({ images, title, onImageClick }) {
  const imgs = images?.length ? images : [FALLBACK];
  return (
    <div className="grid grid-cols-2 gap-2">
      {imgs.map((img, i) => (
        <div 
          key={i} 
          onClick={() => onImageClick && onImageClick(i, imgs)}
          className={`relative rounded-xl overflow-hidden bg-gray-100 shadow-sm transition-transform hover:scale-[1.02] cursor-pointer group ${i === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"}`}
        >
          <img
            src={img}
            alt={`${title} - ${i + 1}`}
            className="w-full h-full object-cover"
            onError={e => { e.currentTarget.src = FALLBACK; }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white">
              <Maximize2 className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function VideoPlayer({ url }) {
  if (!url) return null;
  return (
    <div className="rounded-2xl overflow-hidden aspect-video bg-black shadow-lg">
      <iframe
        src={url}
        title="BĐS Video Review"
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}

// ─── Info Section Components ──────────────────────────────────

function InfoItem({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-2 rounded-lg">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-blue-500" />
        <span className="text-sm font-medium text-gray-500">{label}</span>
      </div>
      <span className="text-sm font-black text-gray-900">{value}</span>
    </div>
  );
}

function ContactForm({ phone, zalo, propertyTitle, propertyId }) {
  const [form, setForm] = useState({ name: "", sdt: "", note: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    saveLead({
      name: form.name,
      phone: form.sdt,
      message: form.note,
      source: "Trang Chi tiết BĐS",
      propertyName: propertyTitle,
      propertyId: propertyId
    });
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", sdt: "", note: "" });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xl shadow-gray-100/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-1 bg-blue-600 rounded-full"></div>
        <h3 className="font-black text-gray-900 text-lg">Yêu cầu tư vấn</h3>
      </div>
      {sent ? (
        <div className="py-10 flex flex-col items-center gap-3 text-green-600 font-bold animate-in zoom-in duration-300">
          <div className="p-4 bg-green-50 rounded-full">
            <Send className="w-8 h-8" />
          </div>
          <p className="text-center">Thông tin đã được gửi!<br/><span className="text-xs font-normal text-gray-400">Chúng tôi sẽ gọi lại cho bạn sớm nhất.</span></p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Họ và tên</label>
            <input
              required value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Nhập họ tên của bạn..."
              className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Số điện thoại</label>
            <input
              required value={form.sdt}
              onChange={e => setForm(p => ({ ...p, sdt: e.target.value }))}
              placeholder="Nhập số điện thoại..."
              className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Ghi chú</label>
            <textarea
              rows={3} value={form.note}
              onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
              placeholder="Bạn quan tâm đến vấn đề nào?..."
              className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm resize-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
          <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-4 rounded-2xl text-sm transition-all hover:shadow-lg hover:shadow-blue-200 active:scale-95 flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /> GỬI YÊU CẦU NGAY
          </button>
        </form>
      )}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <a href={`tel:${phone}`} className="flex flex-col items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-2xl text-xs transition-all active:scale-95">
          <Phone className="w-4 h-4" /> Gọi Ngay
        </a>
        <a href={`https://zalo.me/${zalo?.replace(/\./g, "")}`} target="_blank" rel="noreferrer"
          className="flex flex-col items-center justify-center gap-1.5 bg-[#0068ff] hover:opacity-90 text-white font-bold py-3.5 rounded-2xl text-xs transition-all active:scale-95">
          <MessageCircle className="w-4 h-4" /> Chat Zalo
        </a>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState({ images: [], index: null });
  const settings = getSettings();

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchPropertyDetails(id)
      .then(data => setProperty(data))
      .catch(err => setError(err.message || "Không thể tải thông tin BĐS."))
      .finally(() => setLoading(false));
  }, [id]);

  const openLightbox = (index, images) => setLightbox({ images, index });
  const closeLightbox = () => setLightbox({ images: [], index: null });
  const prevImage = () => setLightbox(p => ({ ...p, index: (p.index - 1 + p.images.length) % p.images.length }));
  const nextImage = () => setLightbox(p => ({ ...p, index: (p.index + 1) % p.images.length }));

  if (loading) return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-sm font-medium">Đang tải thông tin chi tiết BĐS...</p>
      </div>
    </MainLayout>
  );

  if (error || !property) return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
        <div className="p-6 bg-red-50 rounded-full">
          <AlertTriangle className="w-16 h-16 text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Không tìm thấy BĐS</h2>
        <p className="text-gray-500 max-w-sm">{error || "Thông tin bất động sản không tồn tại hoặc đã bị gỡ bỏ."}</p>
        <Link to="/" className="mt-4 bg-gray-900 text-white font-bold px-8 py-4 rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95">
          ← Quay về trang chủ
        </Link>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      {/* Lightbox Modal */}
      <Lightbox 
        images={lightbox.images} 
        activeIndex={lightbox.index} 
        onClose={closeLightbox} 
        onPrev={prevImage} 
        onNext={nextImage} 
      />

      <div className="bg-gray-50/50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-2 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
            <Link to="/" className="hover:text-blue-600 transition font-bold">Trang chủ</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/${property.type === "Đất nền" ? "dat-nen" : "nha-o"}`} className="hover:text-blue-600 transition font-bold">{property.type}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-800 font-bold truncate">{property.title}</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <span className={`text-[10px] uppercase tracking-widest font-black px-2.5 py-1 rounded-md ${
                  property.status === "Đang bán" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                }`}>{property.status}</span>
                {property.isFeatured && (
                  <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-black bg-orange-500 text-white px-2.5 py-1 rounded-md">
                    <Star className="w-3 h-3 fill-white" /> Nổi bật
                  </span>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span>{property.location}</span>
              </div>
            </div>
            
            <div className="flex flex-row md:flex-col items-baseline md:items-end gap-2 bg-white md:bg-transparent p-4 md:p-0 rounded-2xl shadow-sm md:shadow-none border border-gray-100 md:border-0">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden md:block">Giá niêm yết</span>
              <span className="text-3xl lg:text-4xl font-black text-blue-700">
                {property.formattedPrice || (property.price ? `${(property.price / 1e9).toFixed(1)} Tỷ` : "Liên hệ")}
              </span>
              {property.price && property.area && (
                <span className="text-sm font-bold text-gray-500">
                  ~{Math.round(property.price / property.area / 1e6).toLocaleString("vi-VN")} Triệu/m²
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 pb-32 md:pb-16 transition-all duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: Media Section */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* 1. Hình ảnh thửa đất */}
            <section>
              <SectionTitle title="Hình ảnh thực tế" icon={ImageIcon} />
              <ImageGrid images={property.images} title={property.title} onImageClick={openLightbox} />
            </section>

            {/* 2. Hình sổ đỏ */}
            {property.registryImages?.length > 0 && (
              <section className="bg-orange-50/30 p-6 rounded-3xl border border-orange-100">
                <SectionTitle title="Pháp lý (Sổ đỏ/Sổ hồng)" icon={FileCheck} />
                <ImageGrid images={property.registryImages} title="Sổ đỏ" onImageClick={openLightbox} />
                <p className="mt-4 text-sm text-gray-500 italic flex items-center gap-2">
                  <Info className="w-4 h-4 text-orange-400" />
                  Sổ hồng riêng, thổ cư 100%, công chứng ngay trong ngày.
                </p>
              </section>
            )}

            {/* 3. Video Review */}
            {property.videoUrl && (
              <section>
                <SectionTitle title="Video Review / Flycam" icon={Play} />
                <VideoPlayer url={property.videoUrl} />
              </section>
            )}

            {/* 4. Ảnh khu vực xung quanh */}
            {property.surroundingImages?.length > 0 && (
              <section>
                <SectionTitle title="Khu vực xung quanh" icon={Layers} />
                <ImageGrid images={property.surroundingImages} title="Khu vực" onImageClick={openLightbox} />
              </section>
            )}

            {/* 5. Vị trí trên bản đồ */}
            <section>
              <SectionTitle title="Vị trí & Chỉ đường" icon={MapIcon} />
              {property.coordinates?.lat ? (
                <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                  <PropertyMap 
                    coordinates={property.coordinates} 
                    title={property.title} 
                    address={property.location}
                  />
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-gray-400">
                  <MapPin className="w-10 h-10 mb-2 opacity-20" />
                  <p className="text-sm font-bold">Vị trí sẽ được cập nhật sớm nhất</p>
                </div>
              )}
            </section>

          </div>

          {/* RIGHT COLUMN: Info Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="sticky top-24 space-y-8">
              
              {/* 1. Thông số thửa đất */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-1 bg-blue-600 rounded-full"></div>
                  <h3 className="font-black text-gray-900 text-lg">Thông tin chi tiết</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-1">
                  <InfoItem icon={Maximize2} label="Diện tích" value={property.formattedArea || (property.area ? `${property.area} m²` : null)} />
                  <InfoItem icon={Ruler} label="Mặt tiền" value={property.frontage} />
                  <InfoItem icon={Layers} label="Đường trước đất" value={property.roadWidth || "Đường nhựa hiện hữu"} />
                  <InfoItem icon={FileCheck} label="Pháp lý" value={property.legalStatus} />
                  <InfoItem icon={MapIcon} label="Quy hoạch" value={property.planning} />
                  <InfoItem icon={Calendar} label="Ngày đăng" value={property.postedAt} />
                </div>

                {/* Tags */}
                {property.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-50">
                    {property.tags.map(tag => (
                      <span key={tag} className="bg-blue-50 text-blue-700 text-[10px] uppercase tracking-wider font-black px-3 py-1.5 rounded-lg">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Mô tả */}
              {property.description && (
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <SectionTitle title="Mô tả chi tiết" icon={Info} />
                  <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed font-medium">
                    {property.description.split('\n').map((line, i) => (
                      <p key={i} className="mb-3">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Form tư vấn */}
              <ContactForm 
                phone={settings.phone} 
                zalo={settings.zalo} 
                propertyTitle={property.title}
                propertyId={property.id}
              />

              {/* Hỗ trợ nhanh */}
              <div className="flex items-center justify-center gap-4 py-4 px-6 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Chia sẻ tin này:</span>
                <button className="p-2 bg-white rounded-full text-blue-600 shadow-sm hover:scale-110 transition-all"><ExternalLink className="w-4 h-4" /></button>
                <button className="bg-white px-4 py-2 rounded-xl text-xs font-black text-blue-700 shadow-sm hover:bg-blue-600 hover:text-white transition-all">Sao chép liên kết</button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* STICKY CTA: Mobile Only */}
      <div className="fixed bottom-0 inset-x-0 z-50 md:hidden p-4 bg-gradient-to-t from-white via-white to-white/90 border-t border-gray-100 backdrop-blur-sm">
        <div className="flex gap-3">
          <a
            href={`tel:${settings.phone}`}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white font-black py-4 rounded-2xl text-sm shadow-xl shadow-green-200 active:scale-95 transition-all"
          >
            <Phone className="w-5 h-5" /> GỌI NGAY
          </a>
          <a
            href={`https://zalo.me/${settings.zalo?.replace(/\./g, "")}`}
            target="_blank" rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#0068ff] text-white font-black py-4 rounded-2xl text-sm shadow-xl shadow-blue-200 active:scale-95 transition-all"
          >
            <MessageCircle className="w-5 h-5" /> CHAT ZALO
          </a>
        </div>
      </div>
    </MainLayout>
  );
}

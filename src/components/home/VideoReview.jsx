// src/components/home/VideoReview.jsx
// Section "Video Review Đất" – hỗ trợ 2 loại:
//   1. YouTube: truyền youtubeId  (ví dụ: "dQw4w9WgXcQ")
//   2. Video local: truyền videoUrl (ví dụ: "/videos/review-dat.mp4")
//      → Đặt file video trong thư mục public/videos/

import { useState } from "react";
import { Play, Youtube, Video } from "lucide-react";

// Danh sách video mặc định – đổi youtubeId hoặc videoUrl theo thực tế
const DEFAULT_VIDEOS = [
  {
    id: "v1",
    youtubeId: "dQw4w9WgXcQ", // ← thay bằng YouTube ID thật
    title: "Review đất nền trung tâm Chơn Thành – 150m² sổ hồng",
    subtitle: "Phường Thành Tâm · 1.2 Tỷ",
  },
  {
    id: "v2",
    youtubeId: "dQw4w9WgXcQ",
    title: "Lô góc 2 mặt tiền đối diện KCN Becamex – cơ hội đầu tư",
    subtitle: "Phường Minh Đức · 2.5 Tỷ",
  },
  {
    id: "v3",
    // Ví dụ video từ máy: đặt file vào public/videos/review-dat.mp4
    // youtubeId: undefined,
    youtubeId: "dQw4w9WgXcQ",
    // videoUrl: "/videos/review-dat.mp4",
    title: "Nhà phố mặt tiền đường Hùng Vương – vị trí kinh doanh",
    subtitle: "Trung tâm Chơn Thành · 3.8 Tỷ",
  },
];

// ─── Card YouTube ─────────────────────────────────────────────
function YoutubeCard({ video }) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;

  return (
    <div className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
      <div className="relative aspect-video bg-gray-900 cursor-pointer" onClick={() => setPlaying(true)}>
        {playing ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={thumb}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={e => { e.currentTarget.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center shadow-2xl transition-all group-hover:scale-110">
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              </div>
            </div>
            <span className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-full">
              <Youtube className="w-3 h-3 text-red-500" /> YouTube
            </span>
          </>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">{video.title}</h3>
        <p className="text-xs text-gray-400 mt-1 font-medium">{video.subtitle}</p>
      </div>
    </div>
  );
}

// ─── Card Video local (mp4) ───────────────────────────────────
function LocalVideoCard({ video }) {
  return (
    <div className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
      <div className="relative aspect-video bg-gray-900">
        <video
          src={video.videoUrl}
          className="w-full h-full object-cover"
          controls
          preload="metadata"
          poster={video.poster || undefined}
        />
        <span className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-full pointer-events-none">
          <Video className="w-3 h-3 text-blue-400" /> Video
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">{video.title}</h3>
        <p className="text-xs text-gray-400 mt-1 font-medium">{video.subtitle}</p>
      </div>
    </div>
  );
}

// ─── Section chính ────────────────────────────────────────────
export default function VideoReview({ videos = DEFAULT_VIDEOS }) {
  if (!videos || videos.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-8 bg-red-500 rounded-full" />
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-2">
            <Youtube className="w-6 h-6 text-red-600" />
            Video Review Đất
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">Khám phá thực tế từng lô đất qua video thực địa</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(v =>
          v.videoUrl
            ? <LocalVideoCard key={v.id} video={v} />
            : <YoutubeCard key={v.id} video={v} />
        )}
      </div>
    </section>
  );
}

// src/components/home/VideoReview.jsx
import { useEffect, useState } from "react";
import { Play, Youtube, Video } from "lucide-react";
import { fetchProperties } from "../../services/api";

const youtubeIdFromUrl = (url = "") => {
  if (!url) return "";
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/i);
  return match?.[1] || "";
};

function YoutubeCard({ video }) {
  const [playing, setPlaying] = useState(false);
  const youtubeId = youtubeIdFromUrl(video.videoUrl);
  const thumb = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

  return (
    <div className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
      <div className="relative aspect-video bg-gray-900 cursor-pointer" onClick={() => setPlaying(true)}>
        {playing ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
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
              onError={e => { e.currentTarget.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`; }}
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
      <VideoText video={video} />
    </div>
  );
}

function LocalVideoCard({ video }) {
  return (
    <div className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
      <div className="relative aspect-video bg-gray-900">
        <video
          src={video.videoUrl}
          className="w-full h-full object-cover"
          controls
          preload="metadata"
          poster={video.thumbnail || undefined}
        />
        <span className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-full pointer-events-none">
          <Video className="w-3 h-3 text-blue-400" /> Video
        </span>
      </div>
      <VideoText video={video} />
    </div>
  );
}

function VideoText({ video }) {
  return (
    <div className="p-4">
      <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">{video.title}</h3>
      <p className="text-xs text-gray-400 mt-1 font-medium">{video.subtitle}</p>
    </div>
  );
}

export default function VideoReview() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetchProperties().then((properties) => {
      if (!mounted) return;
      setVideos(
        properties
          .filter((property) => property.videoUrl)
          .slice(0, 3)
          .map((property) => ({
            id: property.id,
            title: property.title,
            subtitle: [property.location, property.formattedPrice].filter(Boolean).join(" · "),
            videoUrl: property.videoUrl,
            thumbnail: property.thumbnail,
          }))
      );
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!videos.length) return null;

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
        {videos.map(video =>
          youtubeIdFromUrl(video.videoUrl)
            ? <YoutubeCard key={video.id} video={video} />
            : <LocalVideoCard key={video.id} video={video} />
        )}
      </div>
    </section>
  );
}

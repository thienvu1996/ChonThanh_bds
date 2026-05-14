// scripts/seed.js
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Thiếu VITE_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const toNumberOrNull = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return [value].filter(Boolean);
};

const formatPrice = (raw) => {
  const n = Number(raw);
  if (!n || Number.isNaN(n)) return "";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")} Tỷ`;
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)} Triệu`;
  return `${n.toLocaleString("vi-VN")} VNĐ`;
};

const formatArea = (raw) => {
  const n = Number(raw);
  return n && !Number.isNaN(n) ? `${n} m²` : "";
};

const getDefaultSite = async () => {
  const { data, error } = await supabase
    .from("sites")
    .upsert(
      { site_key: "default", name: "BĐS Chơn Thành", is_default: true },
      { onConflict: "site_key" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
};

const toSettingsRow = (settings = {}, siteId) => ({
  site_id: siteId,
  site_title: settings.site_title ?? settings.siteTitle ?? "BĐS Chơn Thành",
  hero_title: settings.hero_title ?? settings.heroTitle ?? "",
  hero_subtitle: settings.hero_subtitle ?? settings.heroSubtitle ?? "",
  banner_url: settings.banner_url ?? settings.bannerUrl ?? "/assets/banner.jpg",
  phone: settings.phone ?? "",
  zalo: settings.zalo ?? "",
  email: settings.email ?? "",
  address: settings.address ?? "",
  footer_text: settings.footer_text ?? settings.footerText ?? "",
  search_prefix: settings.search_prefix ?? settings.searchPrefix ?? "Chơn Thành, Bình Phước",
});

const toPropertyRow = (property = {}, siteId) => {
  const price = toNumberOrNull(property.price);
  const area = toNumberOrNull(property.area);
  const images = normalizeArray(property.images);
  const legalImages = normalizeArray(property.legal_images ?? property.legalImages ?? property.registryImages);
  const legalStatus = property.legal_status ?? property.legalStatus ?? "";
  const isFeatured = Boolean(property.is_featured ?? property.isFeatured);
  const id = UUID_RE.test(property.id) ? property.id : undefined;

  return {
    ...(id ? { id } : {}),
    site_id: siteId,
    legacy_id: property.legacy_id ?? (property.id && !id ? property.id : null),
    title: property.title,
    description: property.description ?? null,
    price,
    formatted_price: property.formatted_price ?? property.formattedPrice ?? formatPrice(price),
    area,
    formatted_area: property.formatted_area ?? property.formattedArea ?? formatArea(area),
    frontage: property.frontage ?? null,
    location: property.location ?? null,
    coordinates: property.coordinates ?? { lat: 11.424, lng: 106.5962 },
    type: property.type ?? "Đất nền",
    status: property.status ?? "Đang bán",
    is_featured: isFeatured,
    thumbnail_url: property.thumbnail_url ?? property.thumbnail ?? images[0] ?? "",
    images,
    legal_images: legalImages,
    legal_status: legalStatus,
    tags: normalizeArray(
      property.tags?.length
        ? property.tags
        : [property.type, legalStatus, isFeatured ? "Nổi bật" : null]
    ),
    video_url: property.video_url ?? property.videoUrl ?? null,
    road_width: property.road_width ?? property.roadWidth ?? null,
    posted_at: property.posted_at ?? (property.postedAt ? new Date(property.postedAt).toISOString() : new Date().toISOString()),
  };
};

async function seed() {
  console.log("Bắt đầu chuyển dữ liệu lên Supabase...");

  try {
    const dbPath = path.resolve(process.cwd(), "api/db.json");
    const dbData = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    const defaultSite = await getDefaultSite();

    if (dbData.settings) {
      console.log("Đang đẩy cấu hình web...");
      const { error } = await supabase
        .from("settings")
        .upsert(toSettingsRow(dbData.settings, defaultSite.id), { onConflict: "site_id" });

      if (error) throw error;
    }

    if (dbData.properties?.length) {
      console.log(`Đang đẩy ${dbData.properties.length} bất động sản...`);
      const rows = dbData.properties.map((property) => toPropertyRow(property, defaultSite.id));
      const { error } = await supabase
        .from("properties")
        .upsert(rows, { onConflict: "legacy_id" });

      if (error) throw error;
    }

    console.log("Hoàn thành seed Supabase.");
  } catch (err) {
    console.error("Lỗi trong quá trình seed:", err.message);
    process.exitCode = 1;
  }
}

seed();

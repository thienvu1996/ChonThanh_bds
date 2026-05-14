// src/services/api.js
import { supabase } from "../utils/supabaseClient";

const DEFAULT_COORDINATES = { lat: 11.424, lng: 106.5962 };
const DEFAULT_SETTINGS_VALUES = {
  siteTitle: "BĐS Chơn Thành",
  heroTitle: "BĐS CHƠN THÀNH - GIÁ TRỊ THỰC, SINH LỜI THỰC",
  heroSubtitle: "Chuyên cung cấp đất nền, nhà phố tại khu vực Chơn Thành - Bình Phước với pháp lý minh bạch.",
  bannerUrl: "/assets/banner.jpg",
  phone: "0858.550.088",
  zalo: "0858.550.088",
  email: "info@bdschonthanh.vn",
  address: "Quốc Lộ 14 , Mũi Tàu, Phường Chơn Thành, Thành Phố Đồng Nai",
  footerText: "© 2026 BĐS Chơn Thành. Thiết kế và vận hành bởi Admin Team.",
  searchPrefix: "Chơn Thành, Bình Phước",
};
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const cleanObject = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));

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

const normalizeCoordinates = (value) => {
  if (!value || typeof value !== "object") return DEFAULT_COORDINATES;
  const lat = Number(value.lat);
  const lng = Number(value.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return DEFAULT_COORDINATES;
  return { lat, lng };
};

export const formatPrice = (raw) => {
  const n = Number(raw);
  if (!n || Number.isNaN(n)) return "";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")} Tỷ`;
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)} Triệu`;
  return `${n.toLocaleString("vi-VN")} VNĐ`;
};

export const formatArea = (raw) => {
  const n = Number(raw);
  return n && !Number.isNaN(n) ? `${n} m²` : "";
};

export function normalizeSettings(row = {}) {
  const siteTitle = row.site_title ?? row.siteTitle ?? DEFAULT_SETTINGS_VALUES.siteTitle;
  const heroTitle = row.hero_title ?? row.heroTitle ?? DEFAULT_SETTINGS_VALUES.heroTitle;
  const heroSubtitle = row.hero_subtitle ?? row.heroSubtitle ?? DEFAULT_SETTINGS_VALUES.heroSubtitle;
  const bannerUrl = row.banner_url ?? row.bannerUrl ?? DEFAULT_SETTINGS_VALUES.bannerUrl;
  const footerText = row.footer_text ?? row.footerText ?? DEFAULT_SETTINGS_VALUES.footerText;
  const searchPrefix = row.search_prefix ?? row.searchPrefix ?? DEFAULT_SETTINGS_VALUES.searchPrefix;

  return {
    ...row,
    site_title: siteTitle,
    siteTitle,
    hero_title: heroTitle,
    heroTitle,
    hero_subtitle: heroSubtitle,
    heroSubtitle,
    banner_url: bannerUrl,
    bannerUrl,
    phone: row.phone ?? DEFAULT_SETTINGS_VALUES.phone,
    zalo: row.zalo ?? DEFAULT_SETTINGS_VALUES.zalo,
    email: row.email ?? DEFAULT_SETTINGS_VALUES.email,
    address: row.address ?? DEFAULT_SETTINGS_VALUES.address,
    footer_text: footerText,
    footerText,
    search_prefix: searchPrefix,
    searchPrefix,
  };
}

function settingsToDbPayload(payload = {}) {
  const settings = normalizeSettings(payload);
  return {
    id: 1,
    site_title: settings.site_title,
    hero_title: settings.hero_title,
    hero_subtitle: settings.hero_subtitle,
    banner_url: settings.banner_url,
    phone: settings.phone,
    zalo: settings.zalo,
    email: settings.email,
    address: settings.address,
    footer_text: settings.footer_text,
    search_prefix: settings.search_prefix,
  };
}

export function normalizeProperty(row = {}) {
  const images = normalizeArray(row.images);
  const legalImages = normalizeArray(row.legal_images ?? row.legalImages);
  const thumbnail = row.thumbnail_url ?? row.thumbnail ?? row.fallbackImage ?? images[0] ?? "";
  const legalStatus = row.legal_status ?? row.legalStatus ?? "";
  const isFeatured = Boolean(row.is_featured ?? row.isFeatured);
  const videoUrl = row.video_url ?? row.videoUrl ?? "";
  const postedAtRaw = row.posted_at ?? row.postedAt ?? row.created_at ?? "";
  const formattedPrice = row.formatted_price ?? row.formattedPrice ?? formatPrice(row.price);
  const formattedArea = row.formatted_area ?? row.formattedArea ?? formatArea(row.area);
  const roadWidth = row.road_width ?? row.roadWidth ?? "";

  return {
    ...row,
    images,
    legal_images: legalImages,
    legalImages,
    thumbnail_url: thumbnail,
    thumbnail,
    fallbackImage: thumbnail,
    formatted_price: formattedPrice,
    formattedPrice,
    formatted_area: formattedArea,
    formattedArea,
    legal_status: legalStatus,
    legalStatus,
    is_featured: isFeatured,
    isFeatured,
    video_url: videoUrl,
    videoUrl,
    road_width: roadWidth,
    roadWidth,
    posted_at: postedAtRaw,
    postedAt: postedAtRaw ? new Date(postedAtRaw).toLocaleDateString("vi-VN") : "",
    coordinates: normalizeCoordinates(row.coordinates),
  };
}

function propertyToDbPayload(payload = {}) {
  const images = normalizeArray(payload.images);
  const legalImages = normalizeArray(payload.legal_images ?? payload.legalImages);
  const price = toNumberOrNull(payload.price);
  const area = toNumberOrNull(payload.area);
  const legalStatus = payload.legal_status ?? payload.legalStatus ?? null;
  const videoUrl = payload.video_url ?? payload.videoUrl ?? null;
  const roadWidth = payload.road_width ?? payload.roadWidth ?? null;
  const thumbnail = payload.thumbnail_url ?? payload.thumbnail ?? images[0] ?? "";
  const tags = normalizeArray(
    payload.tags?.length
      ? payload.tags
      : [payload.type, legalStatus, payload.is_featured || payload.isFeatured ? "Nổi bật" : null]
  );

  return cleanObject({
    title: payload.title?.trim(),
    description: payload.description ?? null,
    price,
    formatted_price: payload.formatted_price ?? payload.formattedPrice ?? formatPrice(price),
    area,
    formatted_area: payload.formatted_area ?? payload.formattedArea ?? formatArea(area),
    frontage: payload.frontage ?? null,
    location: payload.location ?? null,
    coordinates: normalizeCoordinates(payload.coordinates),
    type: payload.type ?? "Đất nền",
    status: payload.status ?? "Đang bán",
    is_featured: Boolean(payload.is_featured ?? payload.isFeatured),
    thumbnail_url: thumbnail,
    images,
    legal_images: legalImages,
    legal_status: legalStatus,
    tags,
    video_url: videoUrl,
    road_width: roadWidth,
  });
}

export function normalizeLead(row = {}) {
  const customerName = row.customer_name ?? row.customerName ?? row.name ?? "Khách hàng";
  const propertyTitle = row.properties?.title ?? row.propertyName ?? row.property_name ?? null;

  return {
    ...row,
    customer_name: customerName,
    customerName,
    name: customerName,
    property_id: row.property_id ?? row.propertyId ?? null,
    propertyId: row.property_id ?? row.propertyId ?? null,
    propertyName: propertyTitle,
    source: row.source ?? "",
    admin_note: row.admin_note ?? row.adminNote ?? "",
    adminNote: row.admin_note ?? row.adminNote ?? "",
    createdAt: row.created_at ?? row.createdAt ?? "",
    status: row.is_read ? "Đã đọc" : "Mới",
  };
}

function leadToDbPayload(payload = {}) {
  const phone = payload.phone ?? payload.sdt ?? "";
  const propertyId = payload.property_id ?? payload.propertyId ?? null;

  if (!phone.trim()) {
    throw new Error("Vui lòng nhập số điện thoại");
  }

  return cleanObject({
    customer_name: payload.customer_name ?? payload.customerName ?? payload.name ?? "Khách hàng",
    phone,
    message: payload.message ?? payload.note ?? "",
    property_id: propertyId && UUID_RE.test(propertyId) ? propertyId : null,
    source: payload.source ?? "",
  });
}

// PROPERTIES
export async function fetchProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("posted_at", { ascending: false });

  if (error) {
    console.error("[api] fetchProperties error:", error);
    return [];
  }
  return (data || []).map(normalizeProperty);
}

export async function fetchPropertyDetails(id) {
  const query = supabase.from("properties").select("*");
  const { data, error } = await (UUID_RE.test(id)
    ? query.eq("id", id)
    : query.eq("legacy_id", id)
  ).single();

  if (error) {
    console.error("[api] fetchPropertyDetails error:", error);
    throw new Error("Không tìm thấy thông tin BĐS");
  }
  return normalizeProperty(data);
}

export async function createProperty(payload) {
  const { data, error } = await supabase
    .from("properties")
    .insert([propertyToDbPayload(payload)])
    .select()
    .single();

  if (error) throw new Error(`Lỗi tạo BĐS: ${error.message}`);
  return normalizeProperty(data);
}

export async function updateProperty(id, payload) {
  const { data, error } = await supabase
    .from("properties")
    .update(propertyToDbPayload(payload))
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Lỗi cập nhật BĐS: ${error.message}`);
  return normalizeProperty(data);
}

export async function deleteProperty(id) {
  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id);

  if (error) throw new Error(`Lỗi xóa BĐS: ${error.message}`);
  return { id };
}

// SETTINGS
export async function fetchSettings() {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.warn("[api] Lỗi tải cấu hình:", error.message);
    return null;
  }
  return data ? normalizeSettings(data) : null;
}

export async function updateSettings(newSettings) {
  const { data, error } = await supabase
    .from("settings")
    .upsert(settingsToDbPayload(newSettings))
    .select()
    .single();

  if (error) throw new Error(`Lỗi lưu cấu hình: ${error.message}`);
  return normalizeSettings(data);
}

// LEADS
export async function submitLead(payload) {
  const row = leadToDbPayload(payload);
  const { error } = await supabase
    .from("leads")
    .insert([row]);

  if (error) throw new Error(`Lỗi gửi thông tin: ${error.message}`);
  return normalizeLead({ ...row, is_read: false, created_at: new Date().toISOString() });
}

export async function fetchLeads() {
  const { data, error } = await supabase
    .from("leads")
    .select("*, properties(title)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[api] fetchLeads error:", error);
    throw new Error(`Lỗi tải danh sách khách: ${error.message}`);
  }
  return (data || []).map(normalizeLead);
}

export async function markLeadAsRead(id) {
  const { data, error } = await supabase
    .from("leads")
    .update({ is_read: true })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Lỗi cập nhật: ${error.message}`);
  return normalizeLead(data);
}

export async function deleteLead(id) {
  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id);

  if (error) throw new Error(`Lỗi xóa khách hàng: ${error.message}`);
  return { id };
}

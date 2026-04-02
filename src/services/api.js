// src/services/api.js
// Service layer – tách biệt hoàn toàn với UI.
// VITE_USE_MOCK_DATA=true  → dùng localStorage (demo cho khách, không cần server)
// VITE_USE_MOCK_DATA=false → gọi json-server thật

import { mockPropertyData, mockPropertyList } from "../utils/mockData";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USE_MOCK  = import.meta.env.VITE_USE_MOCK_DATA === "true";

// ─── Khóa localStorage ──────────────────────────────────────
const KEY_PROPERTIES = "bds_mock_properties";
const KEY_SETTINGS   = "bds_chonthanh_settings";

// ─── localStorage helpers ───────────────────────────────────
const lsGetProperties = () => {
  try {
    const raw = localStorage.getItem(KEY_PROPERTIES);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const lsSaveProperties = (list) =>
  localStorage.setItem(KEY_PROPERTIES, JSON.stringify(list));

/** Trả về danh sách mock: ưu tiên localStorage (đã chỉnh sửa), fallback về mockData */
const getMockList = () => lsGetProperties() ?? [...mockPropertyList];

// ─── Giả lập độ trễ mạng ────────────────────────────────────
const delay = (ms = 350) => new Promise(r => setTimeout(r, ms));

// ════════════════════════════════════════════════════════════
// PROPERTIES
// ════════════════════════════════════════════════════════════

/** Danh sách tất cả BĐS — tự fallback về mock nếu server không khả dụng */
export async function fetchProperties() {
  if (USE_MOCK) {
    await delay();
    return getMockList();
  }
  try {
    const res = await fetch(`${BASE_URL}/properties`);
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json();
  } catch {
    // Server không chạy → dùng localStorage/mockData để không crash
    console.warn("[api] json-server không khả dụng, dùng mock data.");
    return getMockList();
  }
}

/** Chi tiết 1 BĐS — tự fallback về mock nếu server không khả dụng */
export async function fetchPropertyDetails(id) {
  if (USE_MOCK) {
    await delay();
    const list = getMockList();
    const found = list.find(p => p.id === id);
    return found ? { ...mockPropertyData, ...found } : (() => { throw new Error("Không tìm thấy BĐS"); })();
  }
  try {
    const res = await fetch(`${BASE_URL}/properties/${id}`);
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json();
  } catch {
    console.warn("[api] json-server không khả dụng, dùng mock data.");
    const list = getMockList();
    const found = list.find(p => p.id === id);
    return found ? { ...mockPropertyData, ...found } : (() => { throw new Error("Không tìm thấy BĐS"); })();
  }
}

/** Thêm BĐS mới */
export async function createProperty(payload) {
  if (USE_MOCK) {
    await delay(200);
    const list = getMockList();
    const newItem = { ...payload, id: `bds-${Date.now()}`, postedAt: new Date().toISOString().split("T")[0] };
    lsSaveProperties([...list, newItem]);
    return newItem;
  }
  const res = await fetch(`${BASE_URL}/properties`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Lỗi tạo BĐS: ${res.status}`);
  return res.json();
}

/** Cập nhật BĐS (PUT toàn bộ) */
export async function updateProperty(id, payload) {
  if (USE_MOCK) {
    await delay(200);
    const list = getMockList().map(p => p.id === id ? { ...p, ...payload, id } : p);
    lsSaveProperties(list);
    return payload;
  }
  const res = await fetch(`${BASE_URL}/properties/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Lỗi cập nhật BĐS: ${res.status}`);
  return res.json();
}

/** Xóa BĐS */
export async function deleteProperty(id) {
  if (USE_MOCK) {
    await delay(200);
    lsSaveProperties(getMockList().filter(p => p.id !== id));
    return { id };
  }
  const res = await fetch(`${BASE_URL}/properties/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Lỗi xóa BĐS: ${res.status}`);
  return { id };
}

// ════════════════════════════════════════════════════════════
// SETTINGS
// ════════════════════════════════════════════════════════════
const CHUNK_LIMIT = 80 * 1024;

export async function fetchSettings() {
  if (USE_MOCK) {
    return JSON.parse(localStorage.getItem(KEY_SETTINGS) || "{}");
  }
  const res = await fetch(`${BASE_URL}/settings`);
  if (!res.ok) throw new Error(`Lỗi tải cấu hình: ${res.status}`);
  const data = await res.json();
  if (data.bannerUrl_1 != null) {
    data.bannerUrl = (data.bannerUrl_1 || "") + (data.bannerUrl_2 || "");
    delete data.bannerUrl_1;
    delete data.bannerUrl_2;
  }
  return data;
}

export async function updateSettings(newSettings) {
  if (USE_MOCK) {
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(newSettings));
    return newSettings;
  }
  const { bannerUrl, ...rest } = newSettings;
  const isBase64 = bannerUrl?.startsWith("data:");
  const isLarge  = isBase64 && bannerUrl.length > CHUNK_LIMIT;

  if (isLarge) {
    const mid   = Math.ceil(bannerUrl.length / 2);
    const part1 = bannerUrl.slice(0, mid);
    const part2 = bannerUrl.slice(mid);
    const r1 = await fetch(`${BASE_URL}/settings`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...rest, bannerUrl: null, bannerUrl_1: part1, bannerUrl_2: null }),
    });
    if (!r1.ok) throw new Error(`Lỗi lưu cấu hình (phần 1): ${r1.status}`);
    const r2 = await fetch(`${BASE_URL}/settings`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bannerUrl_2: part2 }),
    });
    if (!r2.ok) throw new Error(`Lỗi lưu cấu hình (phần 2): ${r2.status}`);
    return r2.json();
  }

  const payload = { ...newSettings, bannerUrl_1: null, bannerUrl_2: null };
  const res = await fetch(`${BASE_URL}/settings`, {
    method: "PUT", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Lỗi lưu cấu hình: ${res.status}`);
  return res.json();
}

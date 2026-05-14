// src/utils/settingsStore.js
import { fetchSettings, normalizeSettings, updateSettings } from "../services/api";

const SETTINGS_KEY = "bds_chonthanh_settings";

const DEFAULT_SETTINGS = normalizeSettings({
  banner_url: "/assets/banner.jpg",
  hero_title: "BĐS CHƠN THÀNH - GIÁ TRỊ THỰC, SINH LỜI THỰC",
  hero_subtitle: "Chuyên cung cấp đất nền, nhà phố tại khu vực Chơn Thành - Bình Phước với pháp lý minh bạch.",
  phone: "0858.550.088",
  zalo: "0858.550.088",
  email: "info@bdschonthanh.vn",
  address: "Quốc Lộ 14 , Mũi Tàu, Phường Chơn Thành, Thành Phố Đồng Nai",
  site_title: "BĐS Chơn Thành",
  footer_text: "© 2026 BĐS Chơn Thành. Thiết kế và vận hành bởi Admin Team.",
  search_prefix: "Chơn Thành, Bình Phước",
});

let cachedSettings = DEFAULT_SETTINGS;

const withoutNullish = (settings = {}) =>
  Object.fromEntries(Object.entries(settings).filter(([, value]) => value !== null && value !== undefined));

const mergeWithDefaults = (settings = {}) =>
  normalizeSettings({ ...DEFAULT_SETTINGS, ...withoutNullish(settings) });

const publish = () => {
  window.dispatchEvent(new Event("settingsUpdated"));
};

export const getSettings = () => cachedSettings;

export const initSettings = async () => {
  try {
    const serverSettings = await fetchSettings();
    if (serverSettings && Object.keys(serverSettings).length > 0) {
      cachedSettings = mergeWithDefaults(serverSettings);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(cachedSettings));
      publish();
      return cachedSettings;
    }
  } catch (error) {
    console.error("Không thể tải cấu hình từ Supabase, dùng cache cục bộ:", error);
  }

  const local = localStorage.getItem(SETTINGS_KEY);
  if (local) {
    cachedSettings = mergeWithDefaults(JSON.parse(local));
    publish();
  }
  return cachedSettings;
};

export const saveSettings = async (newSettings) => {
  const normalized = mergeWithDefaults(newSettings);
  const saved = await updateSettings(normalized);
  cachedSettings = mergeWithDefaults(saved);
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(cachedSettings));
  publish();
  return cachedSettings;
};

export const resetSettings = async () => {
  const saved = await updateSettings(DEFAULT_SETTINGS);
  cachedSettings = mergeWithDefaults(saved);
  localStorage.removeItem(SETTINGS_KEY);
  publish();
  return cachedSettings;
};

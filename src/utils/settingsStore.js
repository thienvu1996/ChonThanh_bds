// settingsStore.js
// Cầu nối giữa giao diện (UI) và Backend (JSON Server) thông qua api.js
import { fetchSettings, updateSettings } from "../services/api";

const SETTINGS_KEY = "bds_chonthanh_settings";

const DEFAULT_SETTINGS = {
  bannerUrl: "/assets/banner.jpg",
  heroTitle: "BĐS CHƠN THÀNH - GIÁ TRỊ THỰC, SINH LỜI THỰC",
  heroSubtitle: "Chuyên cung cấp đất nền, nhà phố tại khu vực Chơn Thành - Bình Phước với pháp lý minh bạch.",
  phone: "0858.550.088",
  zalo: "0858.550.088",
  email: "info@bdschonthanh.vn",
  address: "Quốc Lộ 14 , Mũi Tàu, Phường Chơn Thành, Thành Phố Đồng Nai",
  siteTitle: "BĐS Chơn Thành Official",
  footerText: "© 2026 BĐS Chơn Thành. Thiết kế và vận hành bởi Admin Team.",
};

// Cache local để trả về đồng bộ cho các component nhanh chóng
let cachedSettings = DEFAULT_SETTINGS;

/**
 * Lấy cấu hình từ cache (đồng bộ)
 */
export const getSettings = () => {
  return cachedSettings;
};

/**
 * Đồng bộ cache với Server (bất đồng bộ)
 * Nên gọi khi khởi tạo ứng dụng
 */
export const initSettings = async () => {
  try {
    const serverSettings = await fetchSettings();
    if (serverSettings && Object.keys(serverSettings).length > 0) {
      cachedSettings = { ...DEFAULT_SETTINGS, ...serverSettings };
      window.dispatchEvent(new Event("settingsUpdated"));
    }
  } catch (error) {
    console.error("Không thể tải cấu hình từ server, dùng mặc định:", error);
    // Fallback về localStorage nếu cần
    const local = localStorage.getItem(SETTINGS_KEY);
    if (local) cachedSettings = JSON.parse(local);
  }
};

/**
 * Lưu cấu hình lên Server và cập nhật cache
 */
export const saveSettings = async (newSettings) => {
  cachedSettings = newSettings;
  window.dispatchEvent(new Event("settingsUpdated"));

  try {
    await updateSettings(newSettings);
    // Backup vào localStorage cho an toàn
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  } catch (error) {
    console.error("Lỗi khi lưu cấu hình lên server:", error);
  }
};

export const resetSettings = async () => {
  cachedSettings = DEFAULT_SETTINGS;
  window.dispatchEvent(new Event("settingsUpdated"));
  try {
    await updateSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error("Lỗi khi reset cấu hình:", error);
  }
};

// Tự động kích hoạt init khi module được load (optional, nhưng an toàn hơn nếu gọi ở main.jsx)
// initSettings();

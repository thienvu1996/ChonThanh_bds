// src/services/api.js
import { supabase } from "../utils/supabaseClient";

/** 
 * ĐÃ LOẠI BỎ MOCK DATA THEO YÊU CẦU NGƯỜI DÙNG 
 * Hệ thống hiện tại chỉ sử dụng dữ liệu thật từ Supabase.
 */

// ════════════════════════════════════════════════════════════
// PROPERTIES (BẤT ĐỘNG SẢN)
// ════════════════════════════════════════════════════════════

/** Lấy danh sách tất cả BĐS */
export async function fetchProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('posted_at', { ascending: false });

  if (error) {
    console.error("[api] Supabase error:", error);
    return []; // Trả về mảng rỗng nếu lỗi, không dùng mock data
  }
  return data || [];
}

/** Chi tiết 1 BĐS */
export async function fetchPropertyDetails(id) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("[api] Supabase error:", error);
    throw new Error("Không tìm thấy thông tin BĐS");
  }
  return data;
}

/** Thêm BĐS mới */
export async function createProperty(payload) {
  const { data, error } = await supabase
    .from('properties')
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(`Lỗi tạo BĐS: ${error.message}`);
  return data;
}

/** Cập nhật BĐS */
export async function updateProperty(id, payload) {
  const { data, error } = await supabase
    .from('properties')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Lỗi cập nhật BĐS: ${error.message}`);
  return data;
}

/** Xóa BĐS */
export async function deleteProperty(id) {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Lỗi xóa BĐS: ${error.message}`);
  return { id };
}

// ════════════════════════════════════════════════════════════
// SETTINGS (CẤU HÌNH WEB)
// ════════════════════════════════════════════════════════════

export async function fetchSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle(); // Dùng maybeSingle để tránh báo lỗi nếu chưa có settings nào

  if (error) {
    console.warn("[api] Lỗi tải cấu hình:", error.message);
    return null;
  }
  return data;
}

export async function updateSettings(newSettings) {
  const { data, error } = await supabase
    .from('settings')
    .upsert({ ...newSettings, id: 1 })
    .select()
    .single();

  if (error) throw new Error(`Lỗi lưu cấu hình: ${error.message}`);
  return data;
}

// ════════════════════════════════════════════════════════════
// LEADS (KHÁCH HÀNG QUAN TÂM)
// ════════════════════════════════════════════════════════════

/** Gửi thông tin khách hàng */
export async function submitLead(payload) {
  const { data, error } = await supabase
    .from('leads')
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(`Lỗi gửi thông tin: ${error.message}`);
  return data;
}

/** Lấy danh sách khách hàng (Dành cho Admin) */
export async function fetchLeads() {
  const { data, error } = await supabase
    .from('leads')
    .select('*, properties(title)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("[api] fetchLeads Error:", error);
    throw new Error(`Lỗi tải danh sách khách: ${error.message}`);
  }
  return data || [];
}

/** Đánh dấu đã đọc */
export async function markLeadAsRead(id) {
  const { data, error } = await supabase
    .from('leads')
    .update({ is_read: true })
    .eq('id', id);

  if (error) throw new Error(`Lỗi cập nhật: ${error.message}`);
  return data;
}

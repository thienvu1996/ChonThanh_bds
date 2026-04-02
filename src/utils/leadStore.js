// src/utils/leadStore.js
// Quản lý Lead (khách hàng tiềm năng) bằng localStorage
// Giả lập backend để demo cho khách hàng

const STORAGE_KEY = "bds_chon_thanh_leads";

export const LEAD_STATUS = {
  NEW: "Mới",
  CONTACTED: "Đã liên hệ",
  INTERESTED: "Quan tâm",
  NOT_POTENTIAL: "Không tiềm năng",
};

// Lấy danh sách lead
export const getLeads = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Lưu một lead mới
export const saveLead = (leadData) => {
  const leads = getLeads();
  const newLead = {
    id: `lead-${Date.now()}`,
    name: leadData.name || "Khách ẩn danh",
    phone: leadData.phone || leadData.sdt || "",
    email: leadData.email || "",
    message: leadData.message || leadData.note || "",
    adminNote: "", // Trống cho admin nhập sau
    source: leadData.source || "Website Form",
    propertyName: leadData.propertyName || null,
    propertyId: leadData.propertyId || null,
    status: LEAD_STATUS.NEW,
    createdAt: new Date().toISOString(),
  };

  const updatedLeads = [newLead, ...leads];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLeads));

  // Trigger event để các component khác tự update (như Badge trên sidebar)
  window.dispatchEvent(new CustomEvent("leadsUpdated", { detail: updatedLeads }));
  
  // Hiển thị notification (Toast giả lập)
  console.log("New Lead Captured:", newLead);
  return newLead;
};

// Cập nhật trạng thái lead
export const updateLeadStatus = (leadId, newStatus) => {
  const leads = getLeads();
  const updatedLeads = leads.map((l) =>
    l.id === leadId ? { ...l, status: newStatus } : l
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLeads));
  window.dispatchEvent(new CustomEvent("leadsUpdated", { detail: updatedLeads }));
  return updatedLeads;
};

// Cập nhật ghi chú admin
export const updateLeadNote = (leadId, newNote) => {
  const leads = getLeads();
  const updatedLeads = leads.map((l) =>
    l.id === leadId ? { ...l, adminNote: newNote } : l
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLeads));
  // Không cần dispatch event ở đây để tránh re-render liên tục khi gõ
  return updatedLeads;
};

// Xóa lead
export const deleteLead = (leadId) => {
  const leads = getLeads();
  const updatedLeads = leads.filter((l) => l.id !== leadId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLeads));
  window.dispatchEvent(new CustomEvent("leadsUpdated", { detail: updatedLeads }));
  return updatedLeads;
};

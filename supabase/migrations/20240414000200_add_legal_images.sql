-- Thêm cột lưu trữ ảnh sổ đỏ/giấy tờ riêng biệt
ALTER TABLE properties ADD COLUMN IF NOT EXISTS legal_images text[] DEFAULT '{}';

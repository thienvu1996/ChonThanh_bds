-- Thêm cột khu vực trọng tâm vào phần cài đặt
ALTER TABLE settings ADD COLUMN IF NOT EXISTS search_prefix text DEFAULT 'Chơn Thành, Bình Phước';

-- Đồng bộ các cột frontend/admin đang dùng khi ghi dữ liệu vào Supabase
ALTER TABLE properties ADD COLUMN IF NOT EXISTS legacy_id text;
CREATE UNIQUE INDEX IF NOT EXISTS properties_legacy_id_key ON properties (legacy_id);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS frontage text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS road_width text;

ALTER TABLE leads ADD COLUMN IF NOT EXISTS source text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS admin_note text;

ALTER TABLE settings ADD COLUMN IF NOT EXISTS search_prefix text DEFAULT 'Chơn Thành, Bình Phước';

-- 20240414000000_init_schema.sql
-- File migration khởi tạo toàn bộ cấu trúc Database

-- 1. Bảng lưu trữ Thông tin Bất động sản
CREATE TABLE IF NOT EXISTS properties (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id text UNIQUE,
  title text NOT NULL,
  description text,
  price numeric,
  formatted_price text,
  area numeric,
  formatted_area text,
  frontage text,
  location text,
  coordinates jsonb DEFAULT '{"lat": 11.424, "lng": 106.5962}'::jsonb,
  type text NOT NULL,
  status text DEFAULT 'Đang bán',
  is_featured boolean DEFAULT false,
  thumbnail_url text,
  images text[] DEFAULT '{}',
  legal_status text,
  legal_images text[] DEFAULT '{}',
  video_url text,
  road_width text,
  tags text[] DEFAULT '{}',
  posted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Bảng lưu trữ Cấu hình Website
CREATE TABLE IF NOT EXISTS settings (
  id int PRIMARY KEY DEFAULT 1,
  site_title text NOT NULL,
  hero_title text,
  hero_subtitle text,
  banner_url text,
  phone text,
  zalo text,
  email text,
  address text,
  footer_text text,
  search_prefix text DEFAULT 'Chơn Thành, Bình Phước',
  CONSTRAINT one_row CHECK (id = 1)
);

-- 3. Bảng lưu trữ Khách hàng (Leads)
CREATE TABLE IF NOT EXISTS leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text NOT NULL,
  phone text NOT NULL,
  message text,
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  source text,
  admin_note text,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. BẢO MẬT (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Cấu hình Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Cho phép xem BĐS công khai" ON properties;
    DROP POLICY IF EXISTS "Cho phép xem Cài đặt công khai" ON settings;
    DROP POLICY IF EXISTS "Cho phép khách gửi SĐT" ON leads;
    DROP POLICY IF EXISTS "Admin quản lý BĐS" ON properties;
    DROP POLICY IF EXISTS "Admin quản lý Cấu hình" ON settings;
    DROP POLICY IF EXISTS "Admin quản lý Khách hàng" ON leads;
END $$;

CREATE POLICY "Cho phép xem BĐS công khai" ON properties FOR SELECT USING (true);
CREATE POLICY "Cho phép xem Cài đặt công khai" ON settings FOR SELECT USING (true);
CREATE POLICY "Cho phép khách gửi SĐT" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin quản lý BĐS" ON properties FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin quản lý Cấu hình" ON settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin quản lý Khách hàng" ON leads FOR ALL TO authenticated USING (true);

-- Khởi tạo 1 dòng settings mặc định
INSERT INTO settings (id, site_title) VALUES (1, 'BĐS Chơn Thành') ON CONFLICT (id) DO NOTHING;

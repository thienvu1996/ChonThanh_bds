-- Tin tức lấy từ Supabase thay cho dữ liệu mock trong frontend
CREATE TABLE IF NOT EXISTS news_articles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id uuid REFERENCES sites(id) ON DELETE CASCADE,
  title text NOT NULL,
  excerpt text,
  content text,
  category text DEFAULT 'Tin tức',
  image_url text,
  is_published boolean DEFAULT true,
  published_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cho phép xem Tin tức công khai" ON news_articles;
DROP POLICY IF EXISTS "Admin quản lý Tin tức" ON news_articles;

CREATE POLICY "Cho phép xem Tin tức công khai" ON news_articles FOR SELECT USING (is_published = true);
CREATE POLICY "Admin quản lý Tin tức" ON news_articles FOR ALL TO authenticated USING (true);

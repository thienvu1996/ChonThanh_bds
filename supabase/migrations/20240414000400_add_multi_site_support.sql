-- Multi FE / one BE support.
-- Each deployed frontend can map to a site by VITE_SITE_KEY or domain.

CREATE TABLE IF NOT EXISTS sites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_key text UNIQUE NOT NULL,
  name text NOT NULL,
  domain text UNIQUE,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO sites (site_key, name, is_default)
VALUES ('default', 'BĐS Chơn Thành', true)
ON CONFLICT (site_key) DO NOTHING;

ALTER TABLE settings DROP CONSTRAINT IF EXISTS one_row;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS site_id uuid REFERENCES sites(id) ON DELETE CASCADE;

CREATE SEQUENCE IF NOT EXISTS settings_id_seq;
SELECT setval('settings_id_seq', COALESCE((SELECT MAX(id) FROM settings), 1));
ALTER TABLE settings ALTER COLUMN id SET DEFAULT nextval('settings_id_seq');

UPDATE settings
SET site_id = (SELECT id FROM sites WHERE site_key = 'default')
WHERE site_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS settings_site_id_key ON settings (site_id);

ALTER TABLE properties ADD COLUMN IF NOT EXISTS site_id uuid REFERENCES sites(id) ON DELETE CASCADE;
UPDATE properties
SET site_id = (SELECT id FROM sites WHERE site_key = 'default')
WHERE site_id IS NULL;

ALTER TABLE leads ADD COLUMN IF NOT EXISTS site_id uuid REFERENCES sites(id) ON DELETE CASCADE;
UPDATE leads
SET site_id = (SELECT id FROM sites WHERE site_key = 'default')
WHERE site_id IS NULL;

INSERT INTO settings (site_id, site_title)
SELECT id, 'BĐS Chơn Thành'
FROM sites
WHERE site_key = 'default'
ON CONFLICT (site_id) DO NOTHING;

ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cho phép xem Website công khai" ON sites;
DROP POLICY IF EXISTS "Admin quản lý Website" ON sites;

CREATE POLICY "Cho phép xem Website công khai" ON sites FOR SELECT USING (true);
CREATE POLICY "Admin quản lý Website" ON sites FOR ALL TO authenticated USING (true);

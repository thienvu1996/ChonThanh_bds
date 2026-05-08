// scripts/seed.js
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' }); // Đọc từ file bảo mật nhất

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Dùng Service Role để vượt qua RLS khi khởi tạo

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Thiếu VITE_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log("🚀 Bắt đầu chuyển dữ liệu lên Supabase...");

  try {
    const dbPath = path.resolve(process.cwd(), 'api/db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    // 1. Chèn Settings
    if (dbData.settings) {
      console.log("📦 Đang đẩy Cấu hình Web...");
      const { error: settingsError } = await supabase
        .from('settings')
        .upsert({ ...dbData.settings, id: 1 });
      
      if (settingsError) throw settingsError;
    }

    // 2. Chèn Properties
    if (dbData.properties && dbData.properties.length > 0) {
      console.log(`📦 Đang đẩy ${dbData.properties.length} Bất động sản...`);
      // Chuẩn hóa dữ liệu một chút (đổi postedAt thành posted_at)
      const formattedProperties = dbData.properties.map(p => {
        const { postedAt, ...rest } = p;
        return {
          ...rest,
          posted_at: postedAt ? new Date(postedAt).toISOString() : new Date().toISOString(),
          thumbnail_url: p.thumbnail, // Map lại key cho khớp SQL
        };
      });

      const { error: propError } = await supabase
        .from('properties')
        .upsert(formattedProperties);
      
      if (propError) throw propError;
    }

    console.log("✅ Hoàn thành! Dữ liệu của bạn đã sẵn sàng trên Supabase.");
  } catch (err) {
    console.error("❌ Lỗi trong quá trình Seed:", err.message);
  }
}

seed();

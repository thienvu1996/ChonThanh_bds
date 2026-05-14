// scripts/run_schema.js
// Chạy: node scripts/run_schema.js
// Yêu cầu: SUPABASE_DB_URL trong .env.local (lấy từ Dashboard > Settings > Database > Connection string > URI)
//
// Nếu không có DB URL, thay thế bằng cách:
// 1. Vào https://supabase.com/dashboard/project/tvbgrsxppbwwauedqfhd/sql
// 2. Paste nội dung file supabase/schema.sql và bấm RUN

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, "../supabase/schema.sql");
const sql = readFileSync(schemaPath, "utf8");

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error("❌ Thiếu VITE_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local");
    process.exit(1);
}

console.log(`\n🚀 Project: ${SUPABASE_URL}`);
console.log(`📄 Schema: ${schemaPath} (${sql.length} ký tự)\n`);

// Cách 1: Dùng Supabase REST /rest/v1/rpc/exec_sql (cần tạo function trước)
// Cách 2 (dùng ở đây): Tách từng statement và chạy qua API SQL endpoint (Supabase Studio API)
// URL: POST /rest/v1/ - không hỗ trợ SQL thô
// 
// => Dùng pg client nếu có connection string
const DB_URL = process.env.SUPABASE_DB_URL;

if (DB_URL) {
    // Nếu có DB connection string, dùng pg
    const { default: pg } = await import("pg");
    const client = new pg.Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });

    try {
        await client.connect();
        console.log("✅ Đã kết nối Database");
        await client.query(sql);
        console.log("✅ Schema chạy thành công!");
    } catch (err) {
        console.error("❌ Lỗi chạy schema:", err.message);
    } finally {
        await client.end();
    }
} else {
    // Fallback: Tạo migration file với link trực tiếp
    console.log("⚠️  Không tìm thấy SUPABASE_DB_URL trong .env.local");
    console.log("\n📋 Cách chạy schema thủ công:\n");
    console.log("👉 Mở link này trong trình duyệt:");
    console.log(`   https://supabase.com/dashboard/project/tvbgrsxppbwwauedqfhd/sql/new`);
    console.log("\n📋 Sau đó paste nội dung file sau vào SQL Editor và bấm RUN:");
    console.log(`   ${schemaPath}`);
    console.log("\n📄 Nội dung SQL:\n" + "─".repeat(60));
    console.log(sql);
    console.log("─".repeat(60));
    console.log("\n💡 Hoặc thêm vào .env.local:");
    console.log("   SUPABASE_DB_URL=postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres");
    console.log("   (Lấy từ Dashboard > Settings > Database > Connection string > URI)");
}

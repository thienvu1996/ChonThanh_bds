// scripts/create-admin.js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Thiếu VITE_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local");
  process.exit(1);
}

if (!email || !password) {
  console.error("Thiếu ADMIN_EMAIL hoặc ADMIN_PASSWORD trong .env.local");
  process.exit(1);
}

if (password.length < 8) {
  console.error("ADMIN_PASSWORD phải có ít nhất 8 ký tự");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error) {
  console.error(`Không tạo được admin: ${error.message}`);
  process.exit(1);
}

console.log(`Đã tạo admin: ${data.user.email}`);

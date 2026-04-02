import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * AuthGuard: Bảo vệ các Route Admin.
 * Kiểm tra xem người dùng đã đăng nhập chưa (thông qua session).
 * Nếu chưa, chuyển hướng về trang Login.
 */
export default function AuthGuard({ children }) {
  const token = sessionStorage.getItem("admin_token");
  const location = useLocation();

  if (!token) {
    // Chuyển hướng đến trang đăng nhập, nhưng lưu lại vị trí hiện tại của người dùng
    // để có thể quay lại sau khi đăng nhập thành công.
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import DatNenPage from "./pages/DatNenPage";
import NhaOPage from "./pages/NhaOPage";
import TinTucPage from "./pages/TinTucPage";
import LienHePage from "./pages/LienHePage";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import ManagePropertiesPage from "./pages/admin/ManagePropertiesPage";
import SettingsPage from "./pages/admin/SettingsPage";
import LeadsPage from "./pages/admin/LeadsPage";
import LoginPage from "./pages/admin/LoginPage";
import AuthGuard from "./components/admin/AuthGuard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/bat-dong-san/:id" element={<PropertyDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/dat-nen" element={<DatNenPage />} />
        <Route path="/nha-o" element={<NhaOPage />} />
        <Route path="/tin-tuc" element={<TinTucPage />} />
        <Route path="/lien-he" element={<LienHePage />} />

        {/* Admin nested routes - Protected by AuthGuard */}
        <Route
          path="/admin"
          element={
            <AuthGuard>
              <AdminLayout />
            </AuthGuard>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="properties" element={<ManagePropertiesPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Public Login */}
        <Route path="/admin/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}


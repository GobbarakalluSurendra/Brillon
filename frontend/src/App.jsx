import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EventsPage from './features/events/EventsPage';
import CareersPage from './features/careers/CareersPage';
import AdminLoginPage from './features/admin/AdminLoginPage';
import AdminLayout from './features/admin/AdminLayout';
import AdminDashboardPage from './features/admin/AdminDashboardPage';
import AdminEventsPage from './features/admin/AdminEventsPage';
import AdminRegistrationsPage from './features/admin/AdminRegistrationsPage';
import AdminCareersPage from './features/admin/AdminCareersPage';
import AdminApplicationsPage from './features/admin/AdminApplicationsPage';
import ProtectedRoute from './components/ProtectedRoute';
import CookieConsent from './components/CookieConsent';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"        element={<EventsPage />} />
        <Route path="/careers" element={<CareersPage />} />

        {/* Admin login — public */}
        <Route path="/admin-login" element={<AdminLoginPage />} />

        {/* Protected admin routes — all wrapped in AdminLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin"               element={<AdminDashboardPage />} />
            <Route path="/admin/events"        element={<AdminEventsPage />} />
            <Route path="/admin/registrations" element={<AdminRegistrationsPage />} />
            <Route path="/admin/careers"       element={<AdminCareersPage />} />
            <Route path="/admin/applications"  element={<AdminApplicationsPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookieConsent />
    </BrowserRouter>
  );
}

export default App;
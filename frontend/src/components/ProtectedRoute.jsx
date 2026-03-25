import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('adminToken');

  // If no token, immediately redirect to login — no flash of protected content
  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  // Token exists — render the protected child route
  return <Outlet />;
}

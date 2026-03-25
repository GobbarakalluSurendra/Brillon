import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import './AdminDashboard.css';

// ── SVG Icons ──────────────────────────────────────────────────────────────
const IconDashboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
const IconEvents = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconBriefcase = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const IconInbox = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

const navGroups = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard />, path: '/admin' },
    ],
  },
  {
    label: 'Manage',
    items: [
      { id: 'events',        label: 'Events',        icon: <IconEvents />,     path: '/admin/events' },
      { id: 'registrations', label: 'Registrations', icon: <IconUsers />,      path: '/admin/registrations' },
      { id: 'careers',       label: 'Careers',       icon: <IconBriefcase />,  path: '/admin/careers' },
      { id: 'applications',  label: 'Applications',  icon: <IconInbox />,      path: '/admin/applications' },
    ],
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  // Determine active nav by current URL
  const activeId = () => {
    if (location.pathname === '/admin') return 'dashboard';
    if (location.pathname.startsWith('/admin/events')) return 'events';
    if (location.pathname.startsWith('/admin/registrations')) return 'registrations';
    if (location.pathname.startsWith('/admin/careers'))       return 'careers';
    if (location.pathname.startsWith('/admin/applications')) return 'applications';
    return '';
  };

  return (
    <div className={`admin-page ${sidebarOpen ? 'sidebar-is-open' : ''}`}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile topbar */}
      <div className="mobile-topbar">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(o => !o)}>
          {sidebarOpen ? <IconClose /> : <IconMenu />}
        </button>
        <span className="mobile-brand">⚡ EventAdmin</span>
      </div>

      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>

        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-icon">⚡</div>
          <span className="brand-name">EventAdmin</span>
        </div>

        {/* Nav groups */}
        <nav className="sidebar-nav">
          {navGroups.map(group => (
            <div className="nav-group" key={group.label}>
              <span className="nav-group-label">{group.label}</span>
              {group.items.map(item => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`nav-item ${activeId() === item.id ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {activeId() === item.id && <span className="nav-indicator" />}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <Link to="/" className="back-link">
            <span className="nav-icon"><IconGlobe /></span>
            Public View
          </Link>

          <div className="sidebar-divider" />

          <div className="admin-user-card">
            <div className="admin-avatar">A</div>
            <div className="admin-user-info">
              <span className="admin-user-name">Administrator</span>
              <span className="admin-user-role">admin@gmail.com</span>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon"><IconLogout /></span>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Child route renders here ── */}
      <Outlet />
    </div>
  );
}

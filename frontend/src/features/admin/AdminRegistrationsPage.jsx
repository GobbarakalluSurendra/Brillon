import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';
import './AdminRegistrations.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function AdminRegistrationsPage() {
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const token = localStorage.getItem('adminToken');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) { navigate('/admin-login'); return; }
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API_BASE}/register-event`, config);
      setRegistrations(res.data.registrations || []);
    } catch {
      setError('Failed to load registrations.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (str) => {
    if (!str) return '—';
    return new Date(str).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const filtered = registrations.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.email?.toLowerCase().includes(search.toLowerCase()) ||
    r.eventName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="admin-main">

      {/* Topbar */}
      <header className="admin-topbar">
        <div>
          <h1 className="admin-title">Registrations</h1>
          <p className="admin-subtitle">All event sign-ups from users</p>
        </div>
        <button className="btn-add btn-refresh" onClick={fetchRegistrations}>
          ↻ Refresh
        </button>
      </header>

      {/* Stats */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div>
            <div className="stat-value">{registrations.length}</div>
            <div className="stat-label">Total Sign-ups</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎪</div>
          <div>
            <div className="stat-value">
              {[...new Set(registrations.map(r => r.eventName))].length}
            </div>
            <div className="stat-label">Events with Sign-ups</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div>
            <div className="stat-value">
              {[...new Set(registrations.map(r => r.email))].length}
            </div>
            <div className="stat-label">Unique Users</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-header">
          <span className="table-title">All Registrations</span>
          <div className="reg-search-wrap">
            <input
              type="text"
              className="reg-search"
              placeholder="Search name, email or event…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className="table-count">{filtered.length}</span>
          </div>
        </div>

        {loading && (
          <div className="admin-loading">
            <div className="admin-spinner" />
            Loading…
          </div>
        )}

        {error && <div className="admin-error">⚠️ {error}</div>}

        {!loading && !error && (
          <div className="table-wrap">
            <table className="events-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Event</th>
                  <th>Registered On</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty-row">
                      {search ? 'No results match your search.' : 'No registrations yet.'}
                    </td>
                  </tr>
                )}
                {filtered.map((r, idx) => (
                  <tr key={r._id}>
                    <td style={{ color: '#4b5680', fontSize: '13px' }}>{idx + 1}</td>
                    <td style={{ fontWeight: 600, color: '#e2e8f0' }}>{r.name}</td>
                    <td style={{ color: '#94a3b8' }}>{r.email}</td>
                    <td style={{ color: '#94a3b8' }}>{r.phone}</td>
                    <td>
                      <span className="category-badge">{r.eventName || '—'}</span>
                    </td>
                    <td style={{ color: '#94a3b8' }}>{formatDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

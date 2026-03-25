import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';
import './AdminApplications.css';

const API_BASE = 'http://localhost:5000';

export default function AdminApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem('adminToken');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) { navigate('/admin-login'); return; }
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API_BASE}/apply-job`, config);
      setApplications(res.data.applications || []);
    } catch {
      setError('Failed to load applications. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/apply-job/${id}`, config);
      setDeleteConfirm(null);
      showToast('Application deleted.');
      fetchApplications();
    } catch {
      showToast('Failed to delete application.', 'error');
    }
  };

  const formatDate = (str) => {
    if (!str) return '—';
    return new Date(str).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const filtered = applications.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase()) ||
    a.jobTitle?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="admin-main">
      <header className="admin-topbar">
        <div>
          <h1 className="admin-title">Job Applications</h1>
          <p className="admin-subtitle">All applications submitted from the Careers page</p>
        </div>
      </header>

      {/* Stats */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div>
            <div className="stat-value">{applications.length}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div>
            <div className="stat-value">
              {new Set(applications.map(a => a.email)).size}
            </div>
            <div className="stat-label">Unique Applicants</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div>
            <div className="stat-value">
              {new Set(applications.map(a => a.jobTitle)).size}
            </div>
            <div className="stat-label">Roles Applied</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <span className="table-title">All Applications</span>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              className="reg-search"
              placeholder="Search name, email, role…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className="table-count">{filtered.length}</span>
          </div>
        </div>

        {loading && (
          <div className="admin-loading"><div className="admin-spinner" /> Loading…</div>
        )}
        {error && <div className="admin-error">⚠️ {error}</div>}

        {!loading && !error && (
          <div className="table-wrap">
            <table className="events-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Applicant</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role Applied</th>
                  <th>Message</th>
                  <th>Applied On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan="8" className="empty-row">No applications found.</td></tr>
                )}
                {filtered.map((a, idx) => (
                  <tr key={a._id}>
                    <td style={{ color: '#4b5680', fontSize: '13px' }}>{idx + 1}</td>
                    <td style={{ fontWeight: 600, color: '#e2e8f0' }}>{a.name}</td>
                    <td>
                      <a href={`mailto:${a.email}`} className="app-email-link">{a.email}</a>
                    </td>
                    <td style={{ color: '#94a3b8' }}>{a.phone}</td>
                    <td>
                      <span className="app-role-badge">{a.jobTitle}</span>
                    </td>
                    <td className="app-message-cell">
                      {a.message ? (
                        <span title={a.message}>
                          {a.message.length > 60 ? a.message.slice(0, 60) + '…' : a.message}
                        </span>
                      ) : (
                        <span style={{ color: '#334155' }}>—</span>
                      )}
                    </td>
                    <td style={{ color: '#64748b', fontSize: '13px' }}>{formatDate(a.createdAt)}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-delete" onClick={() => setDeleteConfirm(a)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Delete Application</h3>
            <p>Remove <strong>{deleteConfirm.name}</strong>'s application for <strong>{deleteConfirm.jobTitle}</strong>?</p>
            <div className="confirm-actions">
              <button onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm._id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>}
    </main>
  );
}

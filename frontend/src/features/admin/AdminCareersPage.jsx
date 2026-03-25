import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import JobFormModal from '../careers/JobFormModal';
import './AdminDashboard.css';
import './AdminCareers.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function AdminCareersPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState({ open: false, job: null });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  const token = localStorage.getItem('adminToken');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) { navigate('/admin-login'); return; }
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API_BASE}/jobs/all`, config);
      setJobs(res.data.jobs || []);
    } catch {
      setError('Failed to load jobs. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (data, id) => {
    try {
      if (id) {
        await axios.put(`${API_BASE}/jobs/${id}`, data, config);
        showToast('Job updated!');
      } else {
        await axios.post(`${API_BASE}/jobs`, data, config);
        showToast('Job created!');
      }
      setModal({ open: false, job: null });
      fetchJobs();
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/jobs/${id}`, config);
      setDeleteConfirm(null);
      showToast('Job deleted.');
      fetchJobs();
    } catch {
      showToast('Failed to delete job.', 'error');
    }
  };

  const filtered = jobs.filter(j => {
    const matchType = filterType === 'All' || j.type === filterType;
    const matchSearch =
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.department?.toLowerCase().includes(search.toLowerCase()) ||
      j.location?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const typeBadge = (type) => (
    <span className={`type-badge ${type === 'Full-time' ? 'fulltime' : 'intern'}`}>{type}</span>
  );

  const activeBadge = (active) => (
    <span className={`active-badge ${active ? 'live' : 'off'}`}>{active ? 'Live' : 'Hidden'}</span>
  );

  return (
    <main className="admin-main">
      <header className="admin-topbar">
        <div>
          <h1 className="admin-title">Careers</h1>
          <p className="admin-subtitle">Manage job listings shown on the Careers page</p>
        </div>
        <button className="btn-add" onClick={() => setModal({ open: true, job: null })}>
          + Add Job
        </button>
      </header>

      {/* Stats */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div>
            <div className="stat-value">{jobs.length}</div>
            <div className="stat-label">Total Listings</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div>
            <div className="stat-value">{jobs.filter(j => j.type === 'Full-time').length}</div>
            <div className="stat-label">Full-time</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div>
            <div className="stat-value">{jobs.filter(j => j.type === 'Internship').length}</div>
            <div className="stat-label">Internships</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <span className="table-title">All Job Listings</span>
          <div className="careers-filters">
            <div className="filter-tabs">
              {['All', 'Full-time', 'Internship'].map(t => (
                <button
                  key={t}
                  className={`filter-tab ${filterType === t ? 'active' : ''}`}
                  onClick={() => setFilterType(t)}
                >{t}</button>
              ))}
            </div>
            <input
              type="text"
              className="reg-search"
              placeholder="Search title, dept…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className="table-count">{filtered.length}</span>
          </div>
        </div>

        {loading && <div className="admin-loading"><div className="admin-spinner" /> Loading…</div>}
        {error && <div className="admin-error">⚠️ {error}</div>}

        {!loading && !error && (
          <div className="table-wrap">
            <table className="events-table">
              <thead>
                <tr>
                  <th>#</th><th>Title</th><th>Department</th><th>Location</th>
                  <th>Type</th><th>Level</th><th>Salary</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan="9" className="empty-row">No jobs match your filters.</td></tr>
                )}
                {filtered.map((j, idx) => (
                  <tr key={j._id}>
                    <td style={{ color: '#4b5680', fontSize: '13px' }}>{idx + 1}</td>
                    <td style={{ fontWeight: 600, color: '#e2e8f0' }}>{j.title}</td>
                    <td><span style={{ color: '#3b82f6', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em' }}>{j.department}</span></td>
                    <td style={{ color: '#94a3b8' }}>{j.location}</td>
                    <td>{typeBadge(j.type)}</td>
                    <td style={{ color: '#64748b', fontSize: '13px' }}>{j.level || '—'}</td>
                    <td style={{ color: '#22d3ee', fontWeight: 700, fontSize: '13px' }}>{j.salary || '—'}</td>
                    <td>{activeBadge(j.isActive)}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => setModal({ open: true, job: j })}>Edit</button>
                        <button className="btn-delete" onClick={() => setDeleteConfirm(j)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal.open && (
        <JobFormModal job={modal.job} onSave={handleSave} onClose={() => setModal({ open: false, job: null })} />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Delete Job</h3>
            <p>Remove <strong>{deleteConfirm.title}</strong> from listings?</p>
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

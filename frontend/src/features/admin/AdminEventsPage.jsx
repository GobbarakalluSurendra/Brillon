import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EventFormModal from '../events/EventFormModal';
import './AdminDashboard.css';

const API_BASE = 'http://localhost:5000';

export default function AdminEventsPage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formModal, setFormModal] = useState({ open: false, event: null });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem('adminToken');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) { navigate('/admin-login'); return; }
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API_BASE}/events`, config);
      setEvents(res.data.events || []);
    } catch {
      setError('Failed to load events. Check backend or auth.');
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
        await axios.put(`${API_BASE}/events/${id}`, data, config);
        showToast('Event updated successfully!');
      } else {
        await axios.post(`${API_BASE}/events`, data, config);
        showToast('Event created successfully!');
      }
      setFormModal({ open: false, event: null });
      fetchEvents();
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/events/${id}`, config);
      setDeleteConfirm(null);
      showToast('Event deleted.');
      fetchEvents();
    } catch {
      showToast('Failed to delete event.', 'error');
    }
  };

  const formatDate = (str) => {
    if (!str) return '—';
    return new Date(str).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  return (
    <main className="admin-main">

      {/* Topbar */}
      <header className="admin-topbar">
        <div>
          <h1 className="admin-title">Events Management</h1>
          <p className="admin-subtitle">Add, edit, and manage events</p>
        </div>
        <button className="btn-add" onClick={() => setFormModal({ open: true, event: null })}>
          + Add Event
        </button>
      </header>

      {/* Stats */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div>
            <div className="stat-value">{events.length}</div>
            <div className="stat-label">Total Events</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🟢</div>
          <div>
            <div className="stat-value">
              {events.filter(e => new Date(e.date) >= new Date()).length}
            </div>
            <div className="stat-label">Upcoming</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <div>
            <div className="stat-value">
              {[...new Set(events.map(e => e.category))].length}
            </div>
            <div className="stat-label">Categories</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-header">
          <span className="table-title">All Events</span>
          <span className="table-count">{events.length}</span>
        </div>

        {loading && (
          <div className="admin-loading">
            <div className="admin-spinner" />
            Loading...
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
                  <th>Date</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty-row">No events found</td>
                  </tr>
                )}
                {events.map((ev, idx) => (
                  <tr key={ev._id}>
                    <td>{idx + 1}</td>
                    <td>{ev.name}</td>
                    <td>{formatDate(ev.date)}</td>
                    <td>
                      <span className="category-badge">{ev.category || 'General'}</span>
                    </td>
                    <td>{ev.location}</td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="btn-edit"
                          onClick={() => setFormModal({ open: true, event: ev })}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => setDeleteConfirm(ev)}
                        >
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

      {/* Modal */}
      {formModal.open && (
        <EventFormModal
          event={formModal.event}
          onSave={handleSave}
          onClose={() => setFormModal({ open: false, event: null })}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Delete Event</h3>
            <p>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?</p>
            <div className="confirm-actions">
              <button onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm._id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>
      )}
    </main>
  );
}

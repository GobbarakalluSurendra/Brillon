import { useState } from 'react';
import axios from 'axios';
import './RegisterModal.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const INITIAL_FORM = { name: '', email: '', phone: '' };

export default function RegisterModal({ event, onClose }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverMsg, setServerMsg] = useState('');

  // ✅ Check if event is completed
  const isEventCompleted = new Date(event.date) < new Date();

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone)) {
      newErrors.phone = 'Please enter a valid phone number (7–15 digits).';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Prevent submission if event completed
    if (isEventCompleted) {
      setStatus('error');
      setServerMsg('This event has already been completed.');
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('loading');
    setServerMsg('');

    try {
      const res = await axios.post(`${API_BASE}/register-event`, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        eventId: event._id,
      });

      setStatus('success');
      setServerMsg(res.data.message || 'Registration successful!');
    } catch (err) {
      setStatus('error');
      setServerMsg(
        err.response?.data?.message || 'Something went wrong. Please try again.'
      );
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-title">

        {/* Close Button */}
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ✖
        </button>

        {status === 'success' ? (
          /* ✅ Success State */
          <div className="modal-success">
            <h2 className="success-title">You're Registered! 🎉</h2>
            <p className="success-message">{serverMsg}</p>

            <div className="success-event-info">
              <p><strong>Event:</strong> {event.name}</p>
              <p><strong>Name:</strong> {form.name}</p>
              <p><strong>Email:</strong> {form.email}</p>
            </div>

            <button className="modal-done-btn" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          /* ✅ Form State */
          <>
            <div className="modal-header">
              <h2 id="modal-title">{event.name}</h2>
              <p>
                {new Date(event.date).toDateString()} | {event.location}
              </p>
            </div>

            {/* ✅ Event Completed Message */}
            {isEventCompleted && (
              <div className="server-error">
                This event has already been completed. Registration is closed.
              </div>
            )}

            {/* Server Error */}
            {status === 'error' && (
              <div className="server-error">{serverMsg}</div>
            )}

            <form className="modal-form" onSubmit={handleSubmit}>
              {/* Name */}
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}

              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}

              {/* Phone */}
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}

              {/* ✅ Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading' || isEventCompleted}
                className="modal-submit-btn"
              >
                {isEventCompleted
                  ? 'Event Completed'
                  : status === 'loading'
                    ? 'Registering...'
                    : 'Register'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

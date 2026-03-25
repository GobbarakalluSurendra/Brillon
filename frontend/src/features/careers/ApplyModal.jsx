import { useState } from 'react';
import axios from 'axios';
import './ApplyModal.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function ApplyModal({ job, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = 'Full name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address.';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    else if (!/^\+?[\d\s()\-]{7,15}$/.test(form.phone)) e.phone = 'Invalid phone number.';
    return e;
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(err => ({ ...err, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/apply-job`, {
        jobId:    job._id,
        jobTitle: job.title,
        name:     form.name.trim(),
        email:    form.email.trim(),
        phone:    form.phone.trim(),
        message:  form.message.trim(),
      });
      setSuccess(true);
      setTimeout(onClose, 2500);
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="am-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="am-modal">
        {/* Header */}
        <div className="am-header">
          <div>
            <div className="am-tag">Apply Now</div>
            <h2 className="am-title">{job.title}</h2>
            <div className="am-meta">
              <span>{job.department}</span>
              <span className="am-dot">·</span>
              <span>{job.location}</span>
              <span className="am-dot">·</span>
              <span>{job.type}</span>
            </div>
          </div>
          <button className="am-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Success state */}
        {success ? (
          <div className="am-success">
            <div className="am-success-icon">✓</div>
            <h3>Application Submitted!</h3>
            <p>Thanks for applying to <strong>{job.title}</strong>. We'll be in touch soon.</p>
          </div>
        ) : (
          <form className="am-form" onSubmit={handleSubmit} noValidate>
            {errors.form && <div className="am-form-error">{errors.form}</div>}

            <div className="am-row">
              <div className="am-field">
                <label htmlFor="am-name">Full Name <span className="am-req">*</span></label>
                <input
                  id="am-name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className={errors.name ? 'am-input error' : 'am-input'}
                />
                {errors.name && <span className="am-error">{errors.name}</span>}
              </div>

              <div className="am-field">
                <label htmlFor="am-email">Email Address <span className="am-req">*</span></label>
                <input
                  id="am-email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className={errors.email ? 'am-input error' : 'am-input'}
                />
                {errors.email && <span className="am-error">{errors.email}</span>}
              </div>
            </div>

            <div className="am-field">
              <label htmlFor="am-phone">Phone Number <span className="am-req">*</span></label>
              <input
                id="am-phone"
                name="phone"
                type="tel"
                placeholder="+1 555 000 0000"
                value={form.phone}
                onChange={handleChange}
                className={errors.phone ? 'am-input error' : 'am-input'}
              />
              {errors.phone && <span className="am-error">{errors.phone}</span>}
            </div>

            <div className="am-field">
              <label htmlFor="am-message">Cover Message <span className="am-opt">(optional)</span></label>
              <textarea
                id="am-message"
                name="message"
                rows={4}
                placeholder="Tell us why you're a great fit for this role…"
                value={form.message}
                onChange={handleChange}
                className="am-textarea"
              />
            </div>

            <div className="am-actions">
              <button type="button" className="am-btn-cancel" onClick={onClose}>Cancel</button>
              <button type="submit" className="am-btn-submit" disabled={submitting}>
                {submitting ? (
                  <><span className="am-spinner" /> Submitting…</>
                ) : 'Submit Application →'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

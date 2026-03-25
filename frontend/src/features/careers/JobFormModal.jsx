import { useState, useEffect } from 'react';
import './JobFormModal.css';

const EMPTY = {
  title: '', department: '', location: '', type: 'Full-time',
  level: '', duration: '', salary: '', isActive: true,
};

export default function JobFormModal({ job, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (job) {
      setForm({
        title:      job.title      || '',
        department: job.department || '',
        location:   job.location   || '',
        type:       job.type       || 'Full-time',
        level:      job.level      || '',
        duration:   job.duration   || '',
        salary:     job.salary     || '',
        isActive:   job.isActive   !== undefined ? job.isActive : true,
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [job]);

  const validate = () => {
    const e = {};
    if (!form.title.trim())      e.title      = 'Required';
    if (!form.department.trim()) e.department = 'Required';
    if (!form.location.trim())   e.location   = 'Required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    await onSave(form, job?._id);
    setSaving(false);
  };

  return (
    <div className="jfm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="jfm-box">
        <div className="jfm-header">
          <h2 className="jfm-title">{job ? 'Edit Job' : 'Add New Job'}</h2>
          <button className="jfm-close" onClick={onClose}>✕</button>
        </div>

        <form className="jfm-form" onSubmit={handleSubmit}>
          <div className="jfm-grid">
            {/* Title */}
            <div className="jfm-field full">
              <label>Job Title *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Senior Frontend Engineer" />
              {errors.title && <span className="jfm-error">{errors.title}</span>}
            </div>

            {/* Department */}
            <div className="jfm-field">
              <label>Department *</label>
              <input name="department" value={form.department} onChange={handleChange} placeholder="e.g. Engineering" />
              {errors.department && <span className="jfm-error">{errors.department}</span>}
            </div>

            {/* Location */}
            <div className="jfm-field">
              <label>Location *</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Remote / New York" />
              {errors.location && <span className="jfm-error">{errors.location}</span>}
            </div>

            {/* Type */}
            <div className="jfm-field">
              <label>Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Level */}
            <div className="jfm-field">
              <label>Level / Experience</label>
              <input name="level" value={form.level} onChange={handleChange} placeholder="e.g. Senior, Mid-Senior, Intern" />
            </div>

            {/* Duration (internship) */}
            <div className="jfm-field">
              <label>Duration <span className="jfm-hint">(Internships)</span></label>
              <input name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 3 months" />
            </div>

            {/* Salary */}
            <div className="jfm-field">
              <label>Salary / Stipend</label>
              <input name="salary" value={form.salary} onChange={handleChange} placeholder="e.g. $3,000/mo" />
            </div>

            {/* Active toggle */}
            <div className="jfm-field full jfm-toggle-field">
              <label className="jfm-toggle-label">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                <span className="jfm-toggle-track">
                  <span className="jfm-toggle-thumb" />
                </span>
                <span className="jfm-toggle-text">{form.isActive ? 'Live — visible on Careers page' : 'Hidden — not shown publicly'}</span>
              </label>
            </div>
          </div>

          <div className="jfm-footer">
            <button type="button" className="jfm-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="jfm-submit" disabled={saving}>
              {saving ? 'Saving…' : (job ? 'Save Changes' : 'Create Job')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

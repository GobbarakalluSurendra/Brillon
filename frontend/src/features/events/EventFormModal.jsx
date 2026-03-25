import { useState, useEffect } from 'react';
import './EventFormModal.css';

const DEFAULT_CATEGORIES = [
  'General',
  'Technology',
  'Workshops',
  'Hackathons',
  'Leadership',
  'Conferences',
  'Seminars'
];

const emptyForm = {
  name: '',
  date: '',
  location: '',
  category: 'General',
  image: '',
  description: '',
};

export default function EventFormModal({
  event,
  onSave,
  onClose,
  existingCategories = []
}) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [customCategories, setCustomCategories] = useState([]);

  const isEdit = Boolean(event);

  // ✅ Load custom categories from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('customCategories')) || [];
    setCustomCategories(saved);
  }, []);

  // ✅ Close modal on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // ✅ Set form data
  useEffect(() => {
    if (event) {
      setForm({
        name: event.name || '',
        date: event.date || '',
        location: event.location || '',
        category: event.category || 'General',
        image: event.image || '',
        description: event.description || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [event]);

  // ✅ Merge all categories
  const allCategories = Array.from(
    new Set([
      ...DEFAULT_CATEGORIES,
      ...existingCategories,
      ...customCategories
    ])
  );

  const dropdownCategories = [...allCategories, 'Other'];

  // ✅ Validation
  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = 'Event name is required.';

    if (!form.date) {
      e.date = 'Date is required.';
    } else if (new Date(form.date) < new Date().setHours(0, 0, 0, 0)) {
      e.date = 'Date cannot be in the past.';
    }

    if (!form.location.trim()) e.location = 'Location is required.';

    if (!form.description.trim()) {
      e.description = 'Description is required.';
    } else if (form.description.length < 20) {
      e.description = 'Description should be at least 20 characters.';
    }

    if (
      form.image &&
      !/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(form.image)
    ) {
      e.image = 'Enter a valid image URL.';
    }

    return e;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    // ✅ Save custom category
    if (
      form.category &&
      !DEFAULT_CATEGORIES.includes(form.category)
    ) {
      const saved = JSON.parse(localStorage.getItem('customCategories')) || [];

      if (!saved.includes(form.category)) {
        const updated = [...saved, form.category];
        localStorage.setItem('customCategories', JSON.stringify(updated));
        setCustomCategories(updated); // update instantly
      }
    }

    setSaving(true);

    await onSave(
      {
        ...form,
        name: form.name.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
      },
      event?._id
    );

    setSaving(false);
  };

  return (
    <div
      className="efm-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="efm-modal">

        {/* Header */}
        <div className="efm-header">
          <div>
            <h2 className="efm-title">
              {isEdit ? 'Edit Event' : 'Add New Event'}
            </h2>
            <p className="efm-subtitle">
              {isEdit
                ? 'Update the event details below.'
                : 'Fill in the details to create a new event.'}
            </p>
          </div>
          <button className="efm-close" onClick={onClose}>✕</button>
        </div>

        {/* Form */}
        <form className="efm-form" onSubmit={handleSubmit}>
          <div className="efm-grid">

            {/* Name */}
            <div className="efm-field efm-span2">
              <label className="efm-label">
                Event Name <span className="req">*</span>
              </label>
              <input
                autoFocus
                className={`efm-input ${errors.name ? 'has-error' : ''}`}
                type="text"
                placeholder="e.g. Tech Innovation Summit 2026"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
              />
              {errors.name && <span className="efm-error">{errors.name}</span>}
            </div>

            {/* Date */}
            <div className="efm-field">
              <label className="efm-label">
                Date <span className="req">*</span>
              </label>
              <input
                className={`efm-input ${errors.date ? 'has-error' : ''}`}
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={form.date}
                onChange={e => handleChange('date', e.target.value)}
              />
              {errors.date && <span className="efm-error">{errors.date}</span>}
            </div>

            {/* Category */}
            <div className="efm-field">
              <label className="efm-label">Category</label>
              <select
                className="efm-input efm-select"
                value={allCategories.includes(form.category) ? form.category : 'Other'}
                onChange={e => {
                  if (e.target.value === 'Other') {
                    handleChange('category', '');
                  } else {
                    handleChange('category', e.target.value);
                  }
                }}
              >
                {dropdownCategories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {!allCategories.includes(form.category) && (
                <input
                  type="text"
                  className="efm-input"
                  placeholder="Enter custom category"
                  value={form.category}
                  onChange={e => handleChange('category', e.target.value)}
                  style={{ marginTop: '0.5rem' }}
                />
              )}
            </div>

            {/* Location */}
            <div className="efm-field efm-span2">
              <label className="efm-label">
                Location <span className="req">*</span>
              </label>
              <input
                className={`efm-input ${errors.location ? 'has-error' : ''}`}
                type="text"
                placeholder="e.g. Hyderabad Convention Center"
                value={form.location}
                onChange={e => handleChange('location', e.target.value)}
              />
              {errors.location && <span className="efm-error">{errors.location}</span>}
            </div>

            {/* Image */}
            <div className="efm-field efm-span2">
              <label className="efm-label">
                Image URL <span className="optional">(optional)</span>
              </label>
              <input
                className="efm-input"
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={form.image}
                onChange={e => handleChange('image', e.target.value)}
              />
              {errors.image && <span className="efm-error">{errors.image}</span>}

              {form.image && (
                <div className="efm-preview">
                  <img
                    src={form.image}
                    alt="preview"
                    className="efm-thumb"
                    onError={e => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="efm-field efm-span2">
              <label className="efm-label">
                Description <span className="req">*</span>
              </label>
              <textarea
                className={`efm-textarea ${errors.description ? 'has-error' : ''}`}
                rows={4}
                placeholder="Describe the event..."
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
              />
              {errors.description && <span className="efm-error">{errors.description}</span>}
            </div>
          </div>

          {/* Footer */}
          <div className="efm-footer">
            <button
              type="button"
              className="efm-btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="efm-btn-save"
              disabled={saving}
            >
              {saving
                ? 'Saving…'
                : isEdit
                ? '💾 Save Changes'
                : '✨ Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
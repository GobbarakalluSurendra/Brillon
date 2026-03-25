import './EventCard.css';

const CATEGORY_COLORS = {
  Technology: { bg: 'rgba(99, 179, 237, 0.12)', color: '#63b3ed', border: 'rgba(99, 179, 237, 0.3)' },

  WorkShops: { bg: 'rgba(255, 206, 86, 0.12)', color: '#ffce56', border: 'rgba(255, 206, 86, 0.3)' },

  Hackthons: { bg: 'rgba(255, 99, 132, 0.12)', color: '#ff6384', border: 'rgba(255, 99, 132, 0.3)' },

  Leadership: { bg: 'rgba(246, 173, 85, 0.12)', color: '#f6ad55', border: 'rgba(246, 173, 85, 0.3)' },

  Conferences: { bg: 'rgba(153, 102, 255, 0.12)', color: '#9966ff', border: 'rgba(153, 102, 255, 0.3)' },

  Seminars: { bg: 'rgba(75, 192, 192, 0.12)', color: '#4bc0c0', border: 'rgba(75, 192, 192, 0.3)' },

  General: { bg: 'rgba(108, 99, 255, 0.12)', color: '#6c63ff', border: 'rgba(108, 99, 255, 0.3)' },
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return {
    day: d.getDate(),
    month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    year: d.getFullYear(),
    full: d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  };
};

export default function EventCard({ event, onRegister }) {
  const { name, date, location, description, image, category } = event;
  const dateObj = formatDate(date);
  const catStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS.General;

  return (
    <article className="event-card">
      {/* Image */}
      <div className="card-image-wrapper">
        <img
          src={image || `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop`}
          alt={name}
          className="card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop`;
          }}
        />
        <div className="card-image-overlay" />
        {/* Date Badge */}
        <div className="date-badge">
          <span className="date-day">{dateObj.day}</span>
          <span className="date-month">{dateObj.month}</span>
        </div>
        {/* Category Tag */}
        <span
          className="category-tag"
          style={{ background: catStyle.bg, color: catStyle.color, borderColor: catStyle.border }}
        >
          {category || 'General'}
        </span>
      </div>

      {/* Content */}
      <div className="card-content">
        <h3 className="card-title">{name}</h3>

        <div className="card-meta">
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <span>{dateObj.full}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">📍</span>
            <span>{location}</span>
          </div>
        </div>

        <p className="card-description">{description}</p>

        <button className="register-btn" onClick={onRegister}>
          <span>Register Now</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </article>
  );
}

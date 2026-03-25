import { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from './EventCard';
import RegisterModal from './RegisterModal';
import './Events.css';

const API_BASE = 'http://localhost:5000';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchEvents();
  }, []);

  // ✅ Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API_BASE}/events`);
      setEvents(res.data.events || []);
    } catch (err) {
      setError('Failed to load events. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Dynamic Categories (ONLY existing ones)
  const dynamicCategories = [
    'All',
    ...Array.from(
      new Set(events.map(e => e.category).filter(Boolean))
    )
  ];

  // ✅ Reset category if it no longer exists
  useEffect(() => {
    if (
      activeCategory !== 'All' &&
      !events.some(e => e.category === activeCategory)
    ) {
      setActiveCategory('All');
    }
  }, [events, activeCategory]);

  // ✅ Filtered Events
  const filteredEvents =
    activeCategory === 'All'
      ? events
      : events.filter(e => e.category === activeCategory);

  return (
    <div className="events-page">

      {/* Hero Section */}
      <header className="events-hero">
        <div className="hero-bg-glow" />
        <div className="container">
          <h1 className="hero-title">
            Discover <span className="gradient-text">Extraordinary</span> Events
          </h1>
          <p className="hero-subtitle">
            Connect, learn, and grow with world-class conferences, workshops,
            and networking events.
          </p>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{events.length}+</span>
              <span className="stat-label">Events</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">12K+</span>
              <span className="stat-label">Attendees</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Speakers</span>
            </div>
          </div>
        </div>
      </header>

      {/* ✅ Dynamic Filter Tabs */}
      <section className="events-filter-bar">
        <div className="container">
          <div className="filter-scroll">
            {dynamicCategories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
                {/* ✅ Optional: show count */}
                {cat !== 'All' && (
                  <span style={{ marginLeft: '6px', opacity: 0.7 }}>
                    ({events.filter(e => e.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <main className="events-main">
        <div className="container">

          {/* Loading */}
          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading events...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <h3>Connection Error</h3>
              <p>{error}</p>
              <button className="retry-btn" onClick={fetchEvents}>
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filteredEvents.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🗓️</div>
              <h3>No events found</h3>
              <p>No events in the {activeCategory} category yet.</p>
            </div>
          )}

          {/* Events */}
          {!loading && !error && filteredEvents.length > 0 && (
            <>
              <div className="section-header">
                <h2 className="section-title">
                  {activeCategory === 'All' ? 'All Events' : activeCategory}
                </h2>
                <span className="events-count">
                  {filteredEvents.length} events
                </span>
              </div>

              <div className="events-grid">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onRegister={() => setSelectedEvent(event)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Registration Modal */}
      {selectedEvent && (
        <RegisterModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
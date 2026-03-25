import { useState, useEffect } from 'react';
import axios from 'axios';
import ApplyModal from './ApplyModal';
import './Careers.css';

const API_BASE = 'http://localhost:5000';

// ── Main Page ────────────────────────────────────────────────────────────────
export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [applyJob, setApplyJob] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/jobs`)
      .then(res => setJobs(res.data.jobs || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const fullTime = jobs.filter(j => j.type === 'Full-time');
  const internships = jobs.filter(j => j.type === 'Internship');

  // Derive unique departments for filter chips
  const departments = ['All', ...new Set(fullTime.map(j => j.department))];

  const filteredFull = activeFilter === 'All'
    ? fullTime
    : fullTime.filter(j => j.department === activeFilter);

  return (
    <div className="c-page">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="c-hero">
        <div className="c-hero-grid" />
        <div className="c-hero-glow" />
        <div className="c-hero-content">
          <div className="c-badge">Careers at EventAdmin</div>
          <h1 className="c-hero-h1">
            Build the Future{' '}
            <span className="c-grad">With Us</span>
          </h1>
          <p className="c-hero-p">
            Join a team of the world's most ambitious technologists, event strategists,
            and innovators. At EventAdmin, your work shapes the landscape of live experiences.
          </p>
          <a href="#open-positions" className="c-hero-btn">
            Apply Now &nbsp;→
          </a>
        </div>
      </section>

      {/* ── WHY JOIN US / PERKS ───────────────────────────────────────────── */}
      <section className="c-perks-section">
        <div className="c-wrap">
          <div className="c-perks-grid">
            {[
              {
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                ),
                title: 'Work From Anywhere',
                desc: 'Fully remote-first culture with global team meetups 3x per year.',
              },
              {
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                  </svg>
                ),
                title: 'Rapid Growth',
                desc: 'Fast-track career paths with quarterly performance reviews and promotions.',
              },
              {
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                ),
                title: 'Cutting-Edge Tech',
                desc: 'Work with the latest AI, cloud, and semiconductor technologies daily.',
              },
              {
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                title: 'Elite Team',
                desc: 'Collaborate with world-class engineers, scientists, and finance experts.',
              },
            ].map(perk => (
              <div key={perk.title} className="c-perk-card">
                <div className="c-perk-icon">{perk.icon}</div>
                <div className="c-perk-title">{perk.title}</div>
                <p className="c-perk-desc">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPEN OPPORTUNITIES ────────────────────────────────────────────── */}
      <section className="c-section" id="open-positions">
        <div className="c-wrap">
          <div className="c-section-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
            Open Opportunities
          </div>
          <h2 className="c-section-h2">
            Join Our <span className="c-grad">Global Team</span>
          </h2>

          {/* Filter chips */}
          <div className="c-filters">
            {departments.map(dep => (
              <button
                key={dep}
                className={`c-chip ${activeFilter === dep ? 'active' : ''}`}
                onClick={() => setActiveFilter(dep)}
              >{dep}</button>
            ))}
          </div>

          {loading && (
            <div className="c-loading"><div className="c-spinner" /> Loading positions…</div>
          )}

          {!loading && filteredFull.length === 0 && (
            <div className="c-empty">No open positions right now. Check back soon.</div>
          )}

          <div className="c-job-list">
            {filteredFull.map(job => (
              <div key={job._id} className="c-job-card">
                <div className="c-job-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                </div>
                <div className="c-job-info">
                  <div className="c-job-title">{job.title}</div>
                  <div className="c-job-meta">
                    <span>{job.department}</span>
                    <span className="c-dot">·</span>
                    <span>
                      <svg className="c-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      {job.location}
                    </span>
                    <span className="c-dot">·</span>
                    <span>{job.type}</span>
                  </div>
                </div>
                {job.level && <div className="c-level-tag">{job.level}</div>}
                <button className="c-apply-btn" onClick={() => setApplyJob(job)}>
                  Apply &nbsp;→
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERNSHIP PROGRAMS ───────────────────────────────────────────── */}
      {internships.length > 0 && (
        <section className="c-section c-section-dark">
          <div className="c-wrap">
            <div className="c-section-label">
              🎓 Internship Programs
            </div>
            <h2 className="c-section-h2">
              Launch Your Career at <span className="c-grad">EventAdmin</span>
            </h2>
            <div className="c-intern-grid">
              {internships.map(job => (
                <div key={job._id} className="c-intern-card">
                  <div className="c-intern-dept">{job.department.toUpperCase()}</div>
                  <div className="c-intern-title">{job.title}</div>
                  {job.duration && <div className="c-intern-dur">Duration: {job.duration}</div>}
                  {job.salary && <div className="c-intern-sal">{job.salary}</div>}
                  <button className="c-intern-btn" onClick={() => setApplyJob(job)}>Apply Now</button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CERTIFICATION PROGRAMS ────────────────────────────────────────── */}
      <section className="c-section">
        <div className="c-wrap">
          <div className="c-section-label cert-label">
            📖 Certification Programs
          </div>
          <h2 className="c-section-h2">
            Industry-Recognized <span className="c-grad-gold">Certifications</span>
          </h2>
          <div className="c-cert-grid">
            {[
              { title: 'EventAdmin AI Certification', level: 'Advanced', color: 'gold', desc: 'Master AI-driven event planning, predictive analytics and smart automation for large-scale events.' },
              { title: 'Enterprise Events Certification', level: 'Professional', color: 'orange', desc: 'Build expertise in enterprise event orchestration, multi-venue coordination and stakeholder management.' },
              { title: 'Cloud & DevOps Certification', level: 'Intermediate', color: 'yellow', desc: 'Deploy and scale event platforms on the cloud with modern DevOps practices and CI/CD pipelines.' },
            ].map(cert => (
              <div key={cert.title} className="c-cert-card">
                <span className={`c-cert-badge lvl-${cert.color}`}>{cert.level}</span>
                <div className="c-cert-title">{cert.title}</div>
                <p className="c-cert-desc">{cert.desc}</p>
                <a href="#" className={`c-cert-link lnk-${cert.color}`}>Learn More →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <section className="c-cta-section">
        <div className="c-wrap">
          <div className="c-cta-inner">
            <div>
              <h2 className="c-cta-h2">Ready to Transform Your Business?</h2>
              <p className="c-cta-p">Join hundreds of enterprises powered by EventAdmin intelligence.</p>
            </div>
            <div className="c-cta-btns">
              <a href="mailto:contact@eventadmin.com" className="c-cta-primary">Contact Us →</a>
              <a href="/" className="c-cta-secondary">Explore Events</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="c-footer">
        <div className="c-wrap">
          <div className="c-footer-grid">
            <div className="c-footer-brand">
              <div className="c-footer-logo">
                <div className="c-nav-logo-icon">⚡</div>
                <span className="c-nav-logo-text">EventAdmin</span>
              </div>
              <p className="c-footer-mission">
                Building the future of live event experiences.<br />
                Connecting people with moments that matter.
              </p>
              <div className="c-footer-socials">
                <a href="#" className="c-social-btn" aria-label="LinkedIn">in</a>
                <a href="#" className="c-social-btn" aria-label="Twitter">𝕏</a>
                <a href="#" className="c-social-btn" aria-label="Website">🌐</a>
              </div>
            </div>
            <div className="c-footer-col">
              <div className="c-footer-col-title">Company</div>
              <a href="/">Home</a>
              <a href="/careers">Careers</a>
              <a href="mailto:contact@eventadmin.com">Contact</a>
            </div>
            <div className="c-footer-col">
              <div className="c-footer-col-title">Solutions</div>
              <a href="/">Events Platform</a>
              <a href="/careers">Join the Team</a>
              <a href="/admin-login">Admin Portal</a>
            </div>
            <div className="c-footer-col">
              <div className="c-footer-col-title">Support</div>
              <a href="#">Documentation</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
          <div className="c-footer-bar">
            <div className="c-footer-contacts">
              <span>📧 contact@eventadmin.com</span>
              <span>📞 +1 (800) EVENT-00</span>
              <span>📍 Global Headquarters</span>
            </div>
            <div className="c-footer-copy">© 2026 EventAdmin Corporation. All rights reserved.</div>
          </div>
        </div>
      </footer>
      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}
    </div>
  );
}

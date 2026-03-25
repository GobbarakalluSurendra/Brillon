import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import './AdminDashboard.css';

const API_BASE = 'http://localhost:5000';

const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#8884d8'];

// ✅ Normalize category
const normalizeCategory = (cat) => {
  if (!cat) return 'Other';
  return cat.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [careers, setCareers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);

    try {
      const eventRes = await axios.get(`${API_BASE}/events`);
      setEvents(eventRes.data?.events || []);
    } catch {
      setEvents([]);
    }

    try {
      const regRes = await axios.get(`${API_BASE}/register-event`);
      setRegistrations(regRes.data?.registrations || []);
    } catch {
      setRegistrations([]);
    }

    try {
      const jobRes = await axios.get(`${API_BASE}/jobs`);
      setCareers(jobRes.data?.jobs || []);
    } catch {
      setCareers([]);
    }

    try {
      const token = localStorage.getItem('adminToken');
      const appRes = await axios.get(`${API_BASE}/apply-job`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(appRes.data?.applications || []);
    } catch {
      setApplications([]);
    }

    setLoading(false);
  };

  // ================= ANALYTICS =================

  const categoryData = Object.values(
    events.reduce((acc, e) => {
      const cat = normalizeCategory(e.category);
      acc[cat] = acc[cat] || { name: cat, value: 0 };
      acc[cat].value++;
      return acc;
    }, {})
  );

  const dateData = Object.values(
    events.reduce((acc, e) => {
      const date = new Date(e.date).toLocaleDateString();
      acc[date] = acc[date] || { date, count: 0 };
      acc[date].count++;
      return acc;
    }, {})
  );

  const monthlyData = Object.values(
    registrations.reduce((acc, r) => {
      const month = new Date(r.createdAt).toLocaleString('default', { month: 'short' });
      acc[month] = acc[month] || { month, count: 0 };
      acc[month].count++;
      return acc;
    }, {})
  );

  const applicationData = Object.values(
    applications.reduce((acc, a) => {
      const job = a.jobTitle || 'Unknown';
      acc[job] = acc[job] || { name: job, value: 0 };
      acc[job].value++;
      return acc;
    }, {})
  );

  const topEvent = Object.values(
    registrations.reduce((acc, r) => {
      acc[r.eventName] = acc[r.eventName] || { name: r.eventName, count: 0 };
      acc[r.eventName].count++;
      return acc;
    }, {})
  ).sort((a, b) => b.count - a.count)[0];

  const conversionRate =
    events.length > 0
      ? ((registrations.length / events.length) * 100).toFixed(1)
      : 0;

  // ================= UI =================

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <p>Loading Analytics...</p>
      </div>
    );
  }

  return (
    <main className="admin-main">

      <h1 className="dashboard-title">📊 Admin Analytics Dashboard</h1>

      {/* STATS */}
      <div className="stats-grid">
        <div className="card"><h2>{events.length}</h2><p>📅 Events</p></div>
        <div className="card"><h2>{registrations.length}</h2><p>👥 Registrations</p></div>
        <div className="card"><h2>{careers.length}</h2><p>💼 Jobs</p></div>
        <div className="card"><h2>{applications.length}</h2><p>📄 Applications</p></div>
        <div className="card"><h2>{conversionRate}%</h2><p>⚡ Conversion</p></div>
      </div>

      {/* CHARTS */}
      <div className="charts-grid">

        <div className="chart-card">
          <h3>Events by Category</h3>
          <PieChart width={300} height={300}>
            <Pie data={categoryData} dataKey="value" outerRadius={100} label>
              {categoryData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="chart-card">
          <h3>Events by Date</h3>
          <BarChart width={400} height={300} data={dateData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>

        <div className="chart-card">
          <h3>Registrations Growth</h3>
          <BarChart width={400} height={300} data={monthlyData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#00C49F" />
          </BarChart>
        </div>

        <div className="chart-card">
          <h3>Applications per Job</h3>
          <PieChart width={300} height={300}>
            <Pie data={applicationData} dataKey="value" outerRadius={100} label>
              {applicationData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="chart-card highlight">
          <h3>🏆 Top Event</h3>
          <h2>{topEvent?.name || "No Data"}</h2>
          <p>{topEvent?.count || 0} registrations</p>
        </div>

      </div>
    </main>
  );
}
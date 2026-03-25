import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminLogin.css";

const API_BASE = "http://localhost:5000";

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/admin");
    }
  }, []);

  // ✅ Handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    if (error) setError("");
  };

  // ✅ Validate
  const validate = () => {
    if (!form.email.trim()) return "Email is required";
    if (!form.password.trim()) return "Password is required";
    return null;
  };

  // ✅ Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(`${API_BASE}/login`, {
        email: form.email.trim(),
        password: form.password.trim()
      });

      // ✅ Save token
      localStorage.setItem("adminToken", res.data.token);

      navigate("/admin");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>Admin Login</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

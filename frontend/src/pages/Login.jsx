import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_USER_API || "http://localhost:3001";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/users/login`, { email, password });
      login(data.user, data.token);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Left panel */}
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <div style={styles.brandMark}>☁️</div>
          <h2 style={styles.brandName}>CloudCart</h2>
          <p style={styles.brandTagline}>India's smartest shopping destination.</p>
          <div style={styles.features}>
            {[
              ["🚀", "Fast 24-hour delivery"],
              ["🔒", "Secure payments"],
              ["⭐", "Thousands of products"],
              ["↩️", "Easy 30-day returns"],
            ].map(([icon, text]) => (
              <div key={text} style={styles.feature}>
                <span style={styles.featureIcon}>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={styles.rightPanel}>
        <div style={styles.formWrap}>
          <div style={styles.formHeader}>
            <h1 style={styles.formTitle}>Welcome back 👋</h1>
            <p style={styles.formSub}>Sign in to your CloudCart account</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span style={{ marginRight: "8px" }}>⚠️</span>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>✉️</span>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={styles.field}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label style={styles.label}>Password</label>
                <span style={styles.forgotLink}>Forgot password?</span>
              </div>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>🔑</span>
                <input
                  style={styles.input}
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  style={styles.eyeBtn}
                  onClick={() => setShowPass((s) => !s)}
                  tabIndex={-1}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? (
                <span>Signing in…</span>
              ) : (
                <span>Sign In →</span>
              )}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine} />
          </div>

          <p style={styles.switchText}>
            Don't have an account?{" "}
            <Link to="/register" style={styles.switchLink}>
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "calc(100vh - 64px)",
    background: "#f8f9fc",
  },

  // Left
  leftPanel: {
    flex: 1,
    background: "linear-gradient(145deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 48px",
  },
  leftContent: { maxWidth: "380px" },
  brandMark: { fontSize: "3rem", marginBottom: "8px" },
  brandName: {
    color: "#fff",
    fontSize: "2.4rem",
    fontWeight: 800,
    margin: "0 0 12px",
    letterSpacing: "-0.5px",
  },
  brandTagline: {
    color: "rgba(255,255,255,0.6)",
    fontSize: "1.05rem",
    lineHeight: 1.5,
    margin: "0 0 48px",
  },
  features: { display: "flex", flexDirection: "column", gap: "20px" },
  feature: { display: "flex", alignItems: "center", gap: "14px", color: "rgba(255,255,255,0.8)", fontSize: "0.95rem" },
  featureIcon: { fontSize: "1.3rem" },

  // Right
  rightPanel: {
    width: "480px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 32px",
    background: "#fff",
    boxShadow: "-4px 0 32px rgba(0,0,0,0.06)",
  },
  formWrap: { width: "100%", maxWidth: "380px" },
  formHeader: { marginBottom: "32px" },
  formTitle: { fontSize: "1.9rem", fontWeight: 800, color: "#1a1a2e", margin: "0 0 6px" },
  formSub: { color: "#888", margin: 0, fontSize: "0.95rem" },

  errorBox: {
    background: "#fce4ec",
    color: "#c62828",
    border: "1px solid #ffcdd2",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "0.88rem",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
  },

  field: { marginBottom: "20px" },
  label: { display: "block", fontWeight: 600, color: "#444", fontSize: "0.87rem", marginBottom: "7px" },
  inputWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "13px",
    fontSize: "0.95rem",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "12px 44px 12px 40px",
    border: "1.5px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "0.95rem",
    color: "#1a1a2e",
    background: "#fafafa",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.95rem",
    padding: "0",
    color: "#888",
  },
  forgotLink: {
    color: "#e94560",
    fontSize: "0.82rem",
    cursor: "pointer",
    fontWeight: 600,
  },

  submitBtn: {
    width: "100%",
    padding: "14px",
    background: "#e94560",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "8px",
    letterSpacing: "0.3px",
    transition: "opacity 0.2s",
  },

  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "24px 0",
  },
  dividerLine: { flex: 1, height: "1px", background: "#eee" },
  dividerText: { color: "#bbb", fontSize: "0.8rem", fontWeight: 600 },

  switchText: { textAlign: "center", color: "#888", fontSize: "0.9rem" },
  switchLink: { color: "#e94560", fontWeight: 700, textDecoration: "none" },
};

export default Login;
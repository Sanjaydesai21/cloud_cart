import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_USER_API || "http://localhost:3001";

function StrengthBar({ password }) {
  const score = [/.{6,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(password)).length;
  const colors = ["#ccc", "#e94560", "#f59e0b", "#4caf50", "#1b5e20"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  if (!password) return null;
  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "4px",
              borderRadius: "2px",
              background: i <= score ? colors[score] : "#eee",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: "0.75rem", color: colors[score], fontWeight: 600 }}>{labels[score]}</span>
    </div>
  );
}

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/users/register`, { name, email, password });
      login(data.user, data.token);
      navigate("/products");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        "Registration failed. Please try again."
      );
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
          <h2 style={styles.brandName}>Join CloudCart</h2>
          <p style={styles.brandTagline}>Create your free account in under a minute.</p>
          <div style={styles.perks}>
            {[
              ["🎁", "Exclusive member deals"],
              ["📦", "Track your orders live"],
              ["💳", "Save payment methods"],
              ["❤️", "Wishlist your favourites"],
            ].map(([icon, text]) => (
              <div key={text} style={styles.perk}>
                <span style={styles.perkIcon}>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
          <div style={styles.loginPrompt}>
            Already have an account?{" "}
            <Link to="/login" style={styles.loginLink}>Sign in →</Link>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={styles.rightPanel}>
        <div style={styles.formWrap}>
          <div style={styles.formHeader}>
            <h1 style={styles.formTitle}>Create account ✨</h1>
            <p style={styles.formSub}>It's free and always will be.</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span style={{ marginRight: "8px" }}>⚠️</span>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Full name</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>👤</span>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

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
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>🔑</span>
                <input
                  style={styles.input}
                  type={showPass ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
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
              <StrengthBar password={password} />
            </div>

            <p style={styles.termsText}>
              By creating an account you agree to our{" "}
              <span style={styles.termsLink}>Terms of Service</span> and{" "}
              <span style={styles.termsLink}>Privacy Policy</span>.
            </p>

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>already a member?</span>
            <span style={styles.dividerLine} />
          </div>

          <Link to="/login" style={styles.signinBtn}>Sign In</Link>
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
    background: "linear-gradient(145deg,#0f3460 0%,#16213e 60%,#1a1a2e 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 48px",
  },
  leftContent: { maxWidth: "380px" },
  brandMark: { fontSize: "3rem", marginBottom: "8px" },
  brandName: { color: "#fff", fontSize: "2.2rem", fontWeight: 800, margin: "0 0 12px" },
  brandTagline: { color: "rgba(255,255,255,0.6)", fontSize: "1.05rem", lineHeight: 1.5, margin: "0 0 40px" },
  perks: { display: "flex", flexDirection: "column", gap: "20px", marginBottom: "48px" },
  perk: { display: "flex", alignItems: "center", gap: "14px", color: "rgba(255,255,255,0.8)", fontSize: "0.95rem" },
  perkIcon: { fontSize: "1.3rem" },
  loginPrompt: { color: "rgba(255,255,255,0.55)", fontSize: "0.9rem" },
  loginLink: { color: "#e94560", fontWeight: 700, textDecoration: "none" },

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
  formHeader: { marginBottom: "28px" },
  formTitle: { fontSize: "1.8rem", fontWeight: 800, color: "#1a1a2e", margin: "0 0 6px" },
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

  field: { marginBottom: "18px" },
  label: { display: "block", fontWeight: 600, color: "#444", fontSize: "0.87rem", marginBottom: "7px" },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: { position: "absolute", left: "13px", fontSize: "0.95rem", pointerEvents: "none" },
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
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.95rem",
    padding: 0,
    color: "#888",
  },

  termsText: { color: "#aaa", fontSize: "0.8rem", lineHeight: 1.5, margin: "0 0 16px" },
  termsLink: { color: "#e94560", cursor: "pointer", fontWeight: 600 },

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
    letterSpacing: "0.3px",
  },

  divider: { display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" },
  dividerLine: { flex: 1, height: "1px", background: "#eee" },
  dividerText: { color: "#bbb", fontSize: "0.78rem", fontWeight: 600, whiteSpace: "nowrap" },

  signinBtn: {
    display: "block",
    width: "100%",
    padding: "13px",
    border: "1.5px solid #e0e0e0",
    borderRadius: "8px",
    textAlign: "center",
    color: "#555",
    fontWeight: 700,
    fontSize: "0.95rem",
    textDecoration: "none",
    background: "#fafafa",
    boxSizing: "border-box",
  },
};

export default Register;
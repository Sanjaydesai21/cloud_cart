import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <Link to="/" style={styles.brand}>
        <span style={styles.logo}>🛒</span>
        <span>
          Cloud<span style={styles.brandAccent}>Cart</span>
        </span>
      </Link>

      {/* Navigation */}
      <div style={styles.links}>
        <NavLink
          to="/products"
          style={({ isActive }) => ({
            ...styles.link,
            color: isActive ? "#e94560" : "#ffffff",
          })}
        >
          Products
        </NavLink>

        {user && (
          <>
            <NavLink
              to="/cart"
              style={({ isActive }) => ({
                ...styles.link,
                color: isActive ? "#e94560" : "#ffffff",
              })}
            >
              Cart
            </NavLink>

            <NavLink
              to="/orders"
              style={({ isActive }) => ({
                ...styles.link,
                color: isActive ? "#e94560" : "#ffffff",
              })}
            >
              Orders
            </NavLink>
          </>
        )}
      </div>

      {/* User Section */}
      <div style={styles.userSection}>
        {user ? (
          <>
            <div style={styles.profile}>
              <div style={styles.avatar}>
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <div style={styles.welcome}>Welcome</div>
                <div style={styles.username}>{user.name}</div>
              </div>
            </div>

            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.loginBtn}>
              Login
            </Link>

            <Link to="/register" style={styles.registerBtn}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 60px",
    background: "rgba(15, 23, 42, 0.95)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    color: "#ffffff",
    fontSize: "1.8rem",
    fontWeight: "800",
  },

  logo: {
    fontSize: "2rem",
  },

  brandAccent: {
    color: "#e94560",
  },

  links: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
  },

  link: {
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "0.3s",
  },

  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  profile: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#e94560",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "1rem",
  },

  welcome: {
    color: "#94a3b8",
    fontSize: "0.75rem",
  },

  username: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "0.9rem",
  },

  loginBtn: {
    color: "#ffffff",
    textDecoration: "none",
    padding: "10px 18px",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "8px",
    fontWeight: "600",
  },

  registerBtn: {
    background: "#e94560",
    color: "#ffffff",
    textDecoration: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "600",
  },

  logoutBtn: {
    background: "#e94560",
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Navbar;
const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 50px",
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
    letterSpacing: "-0.5px",
  },

  links: {
    display: "flex",
    alignItems: "center",
    gap: "28px",
  },

  link: {
    color: "#d1d5db",
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "all 0.3s ease",
  },

  greeting: {
    color: "#94a3b8",
    fontSize: "0.95rem",
    fontWeight: "500",
  },

  btn: {
    background: "#e94560",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.3s ease",
  },

  btnLink: {
    background: "#e94560",
    color: "#fff",
    textDecoration: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    transition: "0.3s ease",
  },
};
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ORDER_API = import.meta.env.VITE_ORDER_API || "http://localhost:3004";

const STATUS_CONFIG = {
  pending:   { color: "#f57c00", bg: "#fff3e0", icon: "⏳", label: "Pending" },
  confirmed: { color: "#1976d2", bg: "#e3f2fd", icon: "✅", label: "Confirmed" },
  shipped:   { color: "#7b1fa2", bg: "#f3e5f5", icon: "📦", label: "Shipped" },
  delivered: { color: "#388e3c", bg: "#e8f5e9", icon: "🎉", label: "Delivered" },
  cancelled: { color: "#c62828", bg: "#fce4ec", icon: "✖", label: "Cancelled" },
};

const STEPS = ["pending", "confirmed", "shipped", "delivered"];

function StatusBar({ status }) {
  if (status === "cancelled") {
    return (
      <div style={styles.cancelledBanner}>
        ✖ This order was cancelled
      </div>
    );
  }
  const current = STEPS.indexOf(status);
  return (
    <div style={styles.statusBar}>
      {STEPS.map((step, i) => {
        const cfg = STATUS_CONFIG[step];
        const done = i <= current;
        return (
          <div key={step} style={styles.stepWrap}>
            <div style={{
              ...styles.stepDot,
              background: done ? cfg.color : "#e0e0e0",
              transform: i === current ? "scale(1.2)" : "scale(1)",
            }}>
              {done ? cfg.icon : "○"}
            </div>
            <span style={{ ...styles.stepLabel, color: done ? cfg.color : "#bbb" }}>
              {cfg.label}
            </span>
            {i < STEPS.length - 1 && (
              <div style={{
                ...styles.connector,
                background: i < current ? cfg.color : "#e0e0e0",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const date = new Date(order.created_at);

  return (
    <div style={styles.card}>
      <div style={styles.cardTop}>
        <div>
          <div style={styles.orderIdRow}>
            <span style={styles.orderId}>Order #{order.id}</span>
            <span style={{ ...styles.statusPill, background: cfg.bg, color: cfg.color }}>
              {cfg.icon} {cfg.label}
            </span>
          </div>
          <p style={styles.orderDate}>
            Placed on {date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            &nbsp;at {date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div style={styles.orderRight}>
          <p style={styles.orderTotal}>₹{Number(order.total_amount).toLocaleString()}</p>
          <p style={styles.orderItems}>{order.item_count} item{order.item_count !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <StatusBar status={order.status} />

      <button
        style={styles.expandBtn}
        onClick={() => setExpanded((e) => !e)}
      >
        {expanded ? "▲ Hide details" : "▼ View details"}
      </button>

      {expanded && (
        <div style={styles.details}>
          <div style={styles.detailGrid}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Order ID</span>
              <span style={styles.detailVal}>#{order.id}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Items</span>
              <span style={styles.detailVal}>{order.item_count}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Total Paid</span>
              <span style={{ ...styles.detailVal, color: "#e94560", fontWeight: 800 }}>
                ₹{Number(order.total_amount).toLocaleString()}
              </span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Status</span>
              <span style={{ ...styles.detailVal, color: cfg.color, fontWeight: 700 }}>
                {cfg.icon} {cfg.label}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${ORDER_API}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setOrders(r.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={{ fontSize: "2.5rem" }}>📦</div>
        <p style={{ color: "#888", marginTop: "12px" }}>Loading your orders…</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <div style={styles.pageHeaderInner}>
          <h1 style={styles.pageTitle}>📦 Your Orders</h1>
          <p style={styles.pageSubtitle}>{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
        </div>
      </div>

      <div style={styles.container}>
        {orders.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: "4rem", marginBottom: "16px" }}>📭</div>
            <h2 style={{ color: "#1a1a2e", margin: "0 0 8px" }}>No orders yet</h2>
            <p style={{ color: "#999", marginBottom: "28px" }}>Your order history will appear here once you shop.</p>
            <button onClick={() => navigate("/products")} style={styles.shopBtn}>
              Start Shopping →
            </button>
          </div>
        ) : (
          <div style={styles.ordersList}>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { background: "#f8f9fc", minHeight: "100vh", paddingBottom: "60px" },
  loadingWrap: { textAlign: "center", padding: "120px 20px" },

  pageHeader: {
    background: "linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)",
    padding: "36px 0 32px",
  },
  pageHeaderInner: { maxWidth: "900px", margin: "0 auto", padding: "0 20px" },
  pageTitle: { color: "#fff", fontSize: "1.8rem", fontWeight: 800, margin: "0 0 4px" },
  pageSubtitle: { color: "rgba(255,255,255,0.55)", margin: 0, fontSize: "0.9rem" },

  container: { maxWidth: "900px", margin: "0 auto", padding: "32px 20px" },
  ordersList: { display: "flex", flexDirection: "column", gap: "20px" },

  // Card
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  orderIdRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" },
  orderId: { fontWeight: 800, fontSize: "1.05rem", color: "#1a1a2e" },
  statusPill: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: 700,
  },
  orderDate: { color: "#999", fontSize: "0.83rem", margin: 0 },
  orderRight: { textAlign: "right" },
  orderTotal: { color: "#e94560", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 2px" },
  orderItems: { color: "#aaa", fontSize: "0.83rem", margin: 0 },

  // Status bar
  statusBar: {
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
    position: "relative",
  },
  stepWrap: { display: "flex", flexDirection: "column", alignItems: "center", position: "relative", flex: 1 },
  stepDot: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.85rem",
    color: "#fff",
    fontWeight: 700,
    transition: "all 0.3s",
    marginBottom: "6px",
    zIndex: 1,
  },
  stepLabel: { fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.3px" },
  connector: {
    position: "absolute",
    top: "16px",
    left: "calc(50% + 16px)",
    right: "calc(-50% + 16px)",
    height: "3px",
    zIndex: 0,
  },
  cancelledBanner: {
    background: "#fce4ec",
    color: "#c62828",
    padding: "10px 16px",
    borderRadius: "8px",
    fontWeight: 700,
    fontSize: "0.9rem",
    marginBottom: "16px",
  },

  expandBtn: {
    background: "none",
    border: "none",
    color: "#e94560",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 600,
    padding: 0,
    marginTop: "4px",
  },

  details: { marginTop: "16px", borderTop: "1px solid #f0f0f0", paddingTop: "16px" },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "16px",
  },
  detailItem: { display: "flex", flexDirection: "column", gap: "4px" },
  detailLabel: { color: "#aaa", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" },
  detailVal: { color: "#1a1a2e", fontWeight: 600, fontSize: "0.95rem" },

  // Empty
  empty: {
    textAlign: "center",
    padding: "100px 20px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  },
  shopBtn: {
    background: "#e94560",
    color: "#fff",
    border: "none",
    padding: "14px 32px",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default Orders;
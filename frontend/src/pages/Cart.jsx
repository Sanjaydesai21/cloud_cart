import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CART_API = import.meta.env.VITE_CART_API || "http://localhost:3003";
const ORDER_API = import.meta.env.VITE_ORDER_API || "http://localhost:3004";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=200&q=70";

function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [removing, setRemoving] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  const fetchCart = () => {
    setLoading(true);
    axios
      .get(`${CART_API}/api/cart`, { headers })
      .then((r) => setCart(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchCart, []);

  const removeItem = async (cartItemId) => {
    setRemoving(cartItemId);
    await axios.delete(`${CART_API}/api/cart/${cartItemId}`, { headers });
    fetchCart();
    setRemoving(null);
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const { data } = await axios.post(`${ORDER_API}/api/orders`, {}, { headers });
      alert(`✅ Order #${data.orderId} placed! Total: ₹${Number(data.total).toLocaleString()}`);
      navigate("/orders");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={{ fontSize: "2.5rem" }}>🛒</div>
        <p style={{ color: "#888", marginTop: "12px" }}>Loading your cart…</p>
      </div>
    );
  }

  const deliveryFee = cart.total > 999 ? 0 : 49;
  const grandTotal = Number(cart.total) + deliveryFee;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.pageHeader}>
        <div style={styles.pageHeaderInner}>
          <h1 style={styles.pageTitle}>🛒 Your Cart</h1>
          <p style={styles.pageSubtitle}>
            {cart.itemCount || 0} item{cart.itemCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div style={styles.container}>
        {cart.items.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🛍️</div>
            <h2 style={styles.emptyTitle}>Your cart is empty</h2>
            <p style={styles.emptySub}>Looks like you haven't added anything yet.</p>
            <button onClick={() => navigate("/products")} style={styles.shopBtn}>
              Browse Products →
            </button>
          </div>
        ) : (
          <div style={styles.layout}>
            {/* Items */}
            <div style={styles.itemsCol}>
              {cart.items.map((item) => (
                <div key={item.cart_item_id} style={styles.itemCard}>
                  <img
                    src={item.image_url || FALLBACK_IMG}
                    alt={item.name}
                    style={styles.itemImg}
                    onError={(e) => { e.target.src = FALLBACK_IMG; }}
                  />
                  <div style={styles.itemInfo}>
                    <h3 style={styles.itemName}>{item.name}</h3>
                    <p style={styles.itemUnit}>
                      ₹{Number(item.price).toLocaleString()} per unit
                    </p>
                    <div style={styles.itemQtyRow}>
                      <span style={styles.qtyBadge}>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div style={styles.itemRight}>
                    <p style={styles.itemSubtotal}>
                      ₹{Number(item.subtotal).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeItem(item.cart_item_id)}
                      disabled={removing === item.cart_item_id}
                      style={styles.removeBtn}
                    >
                      {removing === item.cart_item_id ? "…" : "🗑 Remove"}
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => navigate("/products")}
                style={styles.continueShopping}
              >
                ← Continue Shopping
              </button>
            </div>

            {/* Summary */}
            <div style={styles.summaryCol}>
              <div style={styles.summaryCard}>
                <h2 style={styles.summaryTitle}>Order Summary</h2>
                <div style={styles.summaryRow}>
                  <span>Subtotal ({cart.itemCount} items)</span>
                  <span>₹{Number(cart.total).toLocaleString()}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Delivery</span>
                  <span style={{ color: deliveryFee === 0 ? "#388e3c" : "#e94560" }}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <div style={styles.freeDeliveryNote}>
                    Add ₹{(999 - cart.total).toLocaleString()} more for free delivery!
                  </div>
                )}
                <div style={styles.divider} />
                <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
                <button
                  onClick={placeOrder}
                  disabled={placing}
                  style={styles.orderBtn}
                >
                  {placing ? "Placing Order…" : "✓ Place Order"}
                </button>
                <div style={styles.secureNote}>🔒 Secure checkout · 30-day returns</div>
              </div>

              {/* Promo box */}
              <div style={styles.promoCard}>
                <p style={styles.promoLabel}>🎁 Promo Code</p>
                <div style={styles.promoRow}>
                  <input
                    placeholder="Enter code"
                    style={styles.promoInput}
                    disabled
                  />
                  <button style={styles.promoBtn} disabled>Apply</button>
                </div>
                <p style={styles.promoHint}>Coming soon!</p>
              </div>
            </div>
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
  pageHeaderInner: { maxWidth: "1100px", margin: "0 auto", padding: "0 20px" },
  pageTitle: { color: "#fff", fontSize: "1.8rem", fontWeight: 800, margin: "0 0 4px" },
  pageSubtitle: { color: "rgba(255,255,255,0.55)", margin: 0, fontSize: "0.9rem" },

  container: { maxWidth: "1100px", margin: "0 auto", padding: "32px 20px" },

  layout: { display: "grid", gridTemplateColumns: "1fr 360px", gap: "28px", alignItems: "start" },

  // Items
  itemsCol: { display: "flex", flexDirection: "column", gap: "16px" },
  itemCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    gap: "16px",
    alignItems: "center",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  },
  itemImg: {
    width: "90px",
    height: "90px",
    objectFit: "cover",
    borderRadius: "8px",
    flexShrink: 0,
    background: "#f0f0f0",
  },
  itemInfo: { flex: 1, minWidth: 0 },
  itemName: {
    margin: "0 0 6px",
    fontWeight: 700,
    fontSize: "1rem",
    color: "#1a1a2e",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  itemUnit: { margin: "0 0 8px", color: "#888", fontSize: "0.85rem" },
  itemQtyRow: { display: "flex", gap: "8px" },
  qtyBadge: {
    background: "#f5f5f5",
    color: "#555",
    padding: "3px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: 600,
  },
  itemRight: { textAlign: "right", flexShrink: 0 },
  itemSubtotal: { color: "#e94560", fontWeight: 800, fontSize: "1.1rem", margin: "0 0 10px" },
  removeBtn: {
    background: "none",
    border: "1px solid #ffcdd2",
    color: "#c62828",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: 600,
  },
  continueShopping: {
    background: "none",
    border: "none",
    color: "#e94560",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 600,
    padding: "8px 0",
    alignSelf: "flex-start",
  },

  // Summary
  summaryCol: { display: "flex", flexDirection: "column", gap: "16px" },
  summaryCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "28px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  },
  summaryTitle: { fontSize: "1.1rem", fontWeight: 800, color: "#1a1a2e", margin: "0 0 20px" },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    fontSize: "0.92rem",
    color: "#555",
  },
  freeDeliveryNote: {
    background: "#fff8e1",
    color: "#f57c00",
    fontSize: "0.8rem",
    padding: "8px 12px",
    borderRadius: "6px",
    marginBottom: "12px",
    fontWeight: 600,
  },
  divider: { height: "1px", background: "#f0f0f0", margin: "16px 0" },
  totalRow: {
    fontSize: "1.15rem",
    fontWeight: 800,
    color: "#1a1a2e",
    marginBottom: "20px",
  },
  orderBtn: {
    width: "100%",
    padding: "15px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: "12px",
    letterSpacing: "0.3px",
  },
  secureNote: { textAlign: "center", color: "#aaa", fontSize: "0.78rem" },

  promoCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px 28px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  },
  promoLabel: { fontWeight: 700, color: "#1a1a2e", margin: "0 0 10px", fontSize: "0.9rem" },
  promoRow: { display: "flex", gap: "8px" },
  promoInput: {
    flex: 1,
    padding: "9px 12px",
    border: "1.5px solid #e0e0e0",
    borderRadius: "6px",
    fontSize: "0.87rem",
    background: "#f9f9f9",
  },
  promoBtn: {
    padding: "9px 16px",
    background: "#e94560",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: 700,
    fontSize: "0.85rem",
    cursor: "not-allowed",
    opacity: 0.6,
  },
  promoHint: { color: "#bbb", fontSize: "0.75rem", margin: "8px 0 0" },

  // Empty
  empty: {
    textAlign: "center",
    padding: "100px 20px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  },
  emptyIcon: { fontSize: "4rem", marginBottom: "16px" },
  emptyTitle: { fontSize: "1.5rem", fontWeight: 800, color: "#1a1a2e", margin: "0 0 8px" },
  emptySub: { color: "#999", margin: "0 0 28px", fontSize: "0.95rem" },
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

export default Cart;
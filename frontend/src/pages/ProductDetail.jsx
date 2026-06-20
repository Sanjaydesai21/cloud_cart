import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const PRODUCT_API = import.meta.env.VITE_PRODUCT_API || "http://localhost:3002";
const CART_API = import.meta.env.VITE_CART_API || "http://localhost:3003";

const FALLBACK_IMAGES = {
  Electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
  Fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
  "Home & Living": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
  Sports: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
  default: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80",
};

function StarRating({ rating = 4, count = 128 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ color: "#f59e0b", fontSize: "1rem" }}>
        {"★".repeat(rating)}{"☆".repeat(5 - rating)}
      </span>
      <span style={{ color: "#888", fontSize: "0.85rem" }}>({count} reviews)</span>
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${PRODUCT_API}/api/products/${id}`)
      .then((r) => setProduct(r.data.product))
      .catch(() => navigate("/products"))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!token) { navigate("/login"); return; }
    setAdding(true);
    try {
      await axios.post(
        `${CART_API}/api/cart`,
        { productId: product.id, quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingSpinner}>🛒</div>
        <p style={{ color: "#888" }}>Loading product…</p>
      </div>
    );
  }
  if (!product) return null;

  const imgSrc = product.image_url || FALLBACK_IMAGES[product.category] || FALLBACK_IMAGES.default;
  const inStock = product.stock > 0;
  const rating = (product.id % 2) + 3;
  const reviewCount = 80 + (product.id * 13) % 200;
  const discount = product.id % 3 === 0 ? 20 : null;
  const originalPrice = discount ? Math.round(product.price / (1 - discount / 100)) : null;

  return (
    <div style={styles.page}>
      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>
        <span style={styles.breadLink} onClick={() => navigate("/")}>Home</span>
        <span style={styles.breadSep}> / </span>
        <span style={styles.breadLink} onClick={() => navigate("/products")}>Products</span>
        <span style={styles.breadSep}> / </span>
        <span style={{ color: "#555" }}>{product.name}</span>
      </div>

      <div style={styles.container}>
        {/* Image panel */}
        <div style={styles.imagePanel}>
          <div style={styles.mainImgWrap}>
            <img src={imgSrc} alt={product.name} style={styles.mainImg} />
            {discount && <div style={styles.discountBadge}>{discount}% OFF</div>}
          </div>
          {/* Thumbnail row (decorative) */}
          <div style={styles.thumbRow}>
            {[0.9, 0.8, 0.95, 0.85].map((op, i) => (
              <img
                key={i}
                src={imgSrc}
                alt=""
                style={{ ...styles.thumb, opacity: i === 0 ? 1 : op, filter: i === 0 ? "none" : "brightness(0.85)" }}
              />
            ))}
          </div>
        </div>

        {/* Info panel */}
        <div style={styles.infoPanel}>
          <span style={styles.categoryTag}>{product.category}</span>
          <h1 style={styles.productTitle}>{product.name}</h1>
          <StarRating rating={rating} count={reviewCount} />

          <div style={styles.priceRow}>
            <span style={styles.price}>₹{Number(product.price).toLocaleString()}</span>
            {originalPrice && (
              <span style={styles.originalPrice}>₹{Number(originalPrice).toLocaleString()}</span>
            )}
            {discount && <span style={styles.saveBadge}>Save {discount}%</span>}
          </div>

          <p style={styles.description}>{product.description}</p>

          <div style={styles.stockStatus}>
            {inStock ? (
              <span style={styles.inStock}>✅ In Stock ({product.stock} units left)</span>
            ) : (
              <span style={styles.outStock}>❌ Out of Stock</span>
            )}
          </div>

          {/* Quantity */}
          {inStock && (
            <div style={styles.qtyWrap}>
              <span style={styles.qtyLabel}>Quantity:</span>
              <div style={styles.qtyBox}>
                <button
                  style={styles.qtyBtn}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty === 1}
                >−</button>
                <span style={styles.qtyVal}>{qty}</span>
                <button
                  style={styles.qtyBtn}
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  disabled={qty === product.stock}
                >+</button>
              </div>
            </div>
          )}

          <div style={styles.actionRow}>
            <button
              onClick={addToCart}
              disabled={!inStock || adding}
              style={{
                ...styles.addBtn,
                background: added ? "#28a745" : "#e94560",
                opacity: !inStock ? 0.5 : 1,
              }}
            >
              {adding ? "Adding…" : added ? "✓ Added to Cart!" : "🛒 Add to Cart"}
            </button>
            <button style={styles.wishlistBtn} title="Save for later">♡</button>
          </div>

          {/* Perks */}
          <div style={styles.perks}>
            {["🚀 Free delivery over ₹999", "↩️ 30-day returns", "🔒 Secure checkout"].map((p) => (
              <div key={p} style={styles.perk}>{p}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { background: "#f8f9fc", minHeight: "100vh", paddingBottom: "60px" },

  loadingWrap: { textAlign: "center", padding: "120px 20px" },
  loadingSpinner: { fontSize: "3rem", marginBottom: "16px" },

  breadcrumb: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "20px 20px 0",
    fontSize: "0.87rem",
    color: "#999",
  },
  breadLink: { color: "#e94560", cursor: "pointer", textDecoration: "none" },
  breadSep: { margin: "0 6px", color: "#ccc" },

  container: {
    maxWidth: "1100px",
    margin: "24px auto 0",
    padding: "0 20px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "48px",
    alignItems: "start",
  },

  // Image
  imagePanel: {},
  mainImgWrap: {
    position: "relative",
    borderRadius: "16px",
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
    marginBottom: "12px",
  },
  mainImg: { width: "100%", height: "440px", objectFit: "cover", display: "block" },
  discountBadge: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "#e94560",
    color: "#fff",
    fontWeight: 800,
    fontSize: "0.85rem",
    padding: "6px 14px",
    borderRadius: "20px",
  },
  thumbRow: { display: "flex", gap: "10px" },
  thumb: {
    width: "70px",
    height: "70px",
    objectFit: "cover",
    borderRadius: "8px",
    cursor: "pointer",
    border: "2px solid transparent",
    transition: "border-color 0.2s",
  },

  // Info
  infoPanel: {
    background: "#fff",
    borderRadius: "16px",
    padding: "36px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
  },
  categoryTag: {
    display: "inline-block",
    background: "#fde8ec",
    color: "#e94560",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase",
    padding: "4px 12px",
    borderRadius: "20px",
    marginBottom: "12px",
  },
  productTitle: {
    fontSize: "1.7rem",
    fontWeight: 800,
    color: "#1a1a2e",
    margin: "0 0 12px",
    lineHeight: 1.25,
  },
  priceRow: { display: "flex", alignItems: "center", gap: "12px", margin: "16px 0 20px" },
  price: { fontSize: "2rem", fontWeight: 800, color: "#e94560" },
  originalPrice: {
    fontSize: "1.1rem",
    color: "#aaa",
    textDecoration: "line-through",
  },
  saveBadge: {
    background: "#e8f5e9",
    color: "#388e3c",
    fontSize: "0.8rem",
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: "20px",
  },
  description: {
    color: "#555",
    lineHeight: 1.7,
    fontSize: "0.95rem",
    margin: "0 0 20px",
  },
  stockStatus: { marginBottom: "20px" },
  inStock: { color: "#388e3c", fontWeight: 600, fontSize: "0.9rem" },
  outStock: { color: "#c62828", fontWeight: 600, fontSize: "0.9rem" },

  qtyWrap: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" },
  qtyLabel: { fontWeight: 600, color: "#444", fontSize: "0.9rem" },
  qtyBox: {
    display: "flex",
    alignItems: "center",
    border: "1.5px solid #e0e0e0",
    borderRadius: "8px",
    overflow: "hidden",
  },
  qtyBtn: {
    width: "38px",
    height: "38px",
    background: "#f5f5f5",
    border: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
    fontWeight: 700,
    color: "#333",
  },
  qtyVal: {
    width: "44px",
    textAlign: "center",
    fontWeight: 700,
    fontSize: "1rem",
    color: "#1a1a2e",
  },

  actionRow: { display: "flex", gap: "12px", marginBottom: "24px" },
  addBtn: {
    flex: 1,
    color: "#fff",
    border: "none",
    padding: "15px 24px",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "background 0.3s",
    letterSpacing: "0.3px",
  },
  wishlistBtn: {
    width: "52px",
    height: "52px",
    borderRadius: "10px",
    border: "1.5px solid #e0e0e0",
    background: "#fff",
    fontSize: "1.4rem",
    cursor: "pointer",
    color: "#e94560",
  },

  perks: {
    borderTop: "1px solid #f0f0f0",
    paddingTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  perk: { color: "#555", fontSize: "0.87rem", fontWeight: 500 },
};

export default ProductDetail;
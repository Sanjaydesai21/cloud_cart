import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_PRODUCT_API || "http://localhost:3002";

const FALLBACK_IMAGES = {
  Electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80",
  Fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80",
  "Home & Living": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
  Sports: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
  default: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&q=80",
};

function StarRating({ rating = 4 }) {
  return (
    <span style={{ color: "#f59e0b", fontSize: "0.8rem" }}>
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const imgSrc = product.image_url || FALLBACK_IMAGES[product.category] || FALLBACK_IMAGES.default;
  const rating = (product.id % 2) + 3; // mock: 3–4 stars

  return (
    <Link to={`/products/${product.id}`} style={styles.cardLink}>
      <div
        style={{
          ...styles.card,
          transform: hovered ? "translateY(-6px)" : "none",
          boxShadow: hovered
            ? "0 16px 40px rgba(0,0,0,0.14)"
            : "0 2px 12px rgba(0,0,0,0.08)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {product.stock === 0 && <div style={styles.outBadge}>Out of Stock</div>}
        {product.stock > 0 && product.stock < 5 && (
          <div style={styles.lowBadge}>Only {product.stock} left!</div>
        )}
        <div style={styles.imgWrap}>
          <img src={imgSrc} alt={product.name} style={styles.img} />
        </div>
        <div style={styles.cardBody}>
          <span style={styles.category}>{product.category}</span>
          <h3 style={styles.productName}>{product.name}</h3>
          <StarRating rating={rating} />
          <div style={styles.cardFooter}>
            <span style={styles.price}>₹{Number(product.price).toLocaleString()}</span>
            <span
              style={{
                ...styles.stockPill,
                background: product.stock > 0 ? "#e8f5e9" : "#fce4ec",
                color: product.stock > 0 ? "#388e3c" : "#c62828",
              }}
            >
              {product.stock > 0 ? "✔ In Stock" : "✘ Sold Out"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/products/categories`)
      .then((r) => setCategories(r.data.categories))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    axios
      .get(`${API_URL}/api/products`, { params })
      .then((r) => {
        let list = r.data.products;
        if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
        if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
        setProducts(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  return (
    <div style={styles.page}>
      {/* Page header */}
      <div style={styles.pageHeader}>
        <div style={styles.pageHeaderInner}>
          <h1 style={styles.pageTitle}>All Products</h1>
          <p style={styles.pageSubtitle}>{products.length} items found</p>
        </div>
      </div>

      <div style={styles.container}>
        {/* Filters bar */}
        <div style={styles.filterBar}>
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              style={styles.searchInput}
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            style={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">🗂 All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            style={styles.select}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">↕ Sort By</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
        </div>

        {/* Category pills */}
        <div style={styles.pills}>
          <button
            style={{ ...styles.pill, ...(category === "" ? styles.pillActive : {}) }}
            onClick={() => setCategory("")}
          >All</button>
          {categories.map((c) => (
            <button
              key={c}
              style={{ ...styles.pill, ...(category === c ? styles.pillActive : {}) }}
              onClick={() => setCategory(c)}
            >{c}</button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={styles.loadingGrid}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={styles.skeleton} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: "3rem" }}>🔍</p>
            <h3>No products found</h3>
            <p style={{ color: "#999" }}>Try a different search or category.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { background: "#f8f9fc", minHeight: "100vh" },
  pageHeader: {
    background: "linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)",
    padding: "40px 0 36px",
  },
  pageHeaderInner: { maxWidth: "1200px", margin: "0 auto", padding: "0 20px" },
  pageTitle: { color: "#fff", fontSize: "2rem", fontWeight: 800, margin: "0 0 4px" },
  pageSubtitle: { color: "rgba(255,255,255,0.55)", margin: 0, fontSize: "0.95rem" },

  container: { maxWidth: "1200px", margin: "0 auto", padding: "32px 20px" },

  filterBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  searchWrap: {
    flex: 1,
    minWidth: "200px",
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    fontSize: "1rem",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "11px 12px 11px 40px",
    border: "1.5px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "0.95rem",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
  },
  select: {
    padding: "11px 16px",
    border: "1.5px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "0.9rem",
    background: "#fff",
    cursor: "pointer",
    outline: "none",
  },

  pills: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" },
  pill: {
    padding: "6px 18px",
    borderRadius: "20px",
    border: "1.5px solid #ddd",
    background: "#fff",
    fontSize: "0.85rem",
    cursor: "pointer",
    fontWeight: 500,
    color: "#555",
    transition: "all 0.2s",
  },
  pillActive: {
    background: "#e94560",
    color: "#fff",
    border: "1.5px solid #e94560",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "24px",
  },
  loadingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "24px",
  },
  skeleton: {
    height: "340px",
    borderRadius: "12px",
    background: "linear-gradient(90deg,#ececec 25%,#f5f5f5 50%,#ececec 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
  },
  empty: { textAlign: "center", padding: "80px 20px", color: "#444" },

  // Card
  cardLink: { textDecoration: "none", color: "inherit" },
  card: {
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    transition: "transform 0.25s, box-shadow 0.25s",
    cursor: "pointer",
    position: "relative",
  },
  outBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    background: "#c62828",
    color: "#fff",
    fontSize: "0.7rem",
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: "20px",
    zIndex: 1,
    letterSpacing: "0.5px",
  },
  lowBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    background: "#e65100",
    color: "#fff",
    fontSize: "0.7rem",
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: "20px",
    zIndex: 1,
  },
  imgWrap: { height: "210px", overflow: "hidden" },
  img: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" },
  cardBody: { padding: "16px" },
  category: {
    color: "#e94560",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  productName: {
    margin: "6px 0 6px",
    fontSize: "0.97rem",
    fontWeight: 700,
    color: "#1a1a2e",
    lineHeight: 1.3,
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "12px",
  },
  price: { color: "#e94560", fontSize: "1.15rem", fontWeight: 800 },
  stockPill: {
    fontSize: "0.72rem",
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: "20px",
  },
};

export default Products;
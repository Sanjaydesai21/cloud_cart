import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const features = [
  {
    icon: "🚀",
    title: "Express Delivery",
    desc: "Get your orders delivered within 24 hours anywhere in India.",
  },
  {
    icon: "🔒",
    title: "Secure Payments",
    desc: "Bank-grade encryption keeps your payment details safe.",
  },
  {
    icon: "↩️",
    title: "Easy Returns",
    desc: "Hassle-free 30-day return policy on all products.",
  },
  {
    icon: "⭐",
    title: "Top Brands",
    desc: "Curated selection from the world's most trusted brands.",
  },
];

const heroImages = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
  "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&q=80",
];

const categories = [
  { name: "Electronics", emoji: "💻", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80" },
  { name: "Fashion", emoji: "👗", img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80" },
  { name: "Home & Living", emoji: "🏠", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80" },
  { name: "Sports", emoji: "⚽", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80" },
];

function Home() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroImages.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={styles.page}>
      {/* ── HERO ── */}
      <section style={{ ...styles.hero, backgroundImage: `url(${heroImages[slide]})` }}>
        <div style={styles.heroOverlay}>
          <p style={styles.heroEyebrow}>NEW ARRIVALS 2025</p>
          <h1 style={styles.heroTitle}>
            Shop Smarter.<br />Live Better.
          </h1>
          <p style={styles.heroSub}>
            Discover thousands of products at unbeatable prices, delivered to your door.
          </p>
          <div style={styles.heroActions}>
            <Link to="/products" style={styles.heroCta}>
              Shop Now &nbsp;→
            </Link>
            <Link to="/register" style={styles.heroGhost}>
              Join for Free
            </Link>
          </div>
        </div>
        <div style={styles.dots}>
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              style={{ ...styles.dot, opacity: i === slide ? 1 : 0.4 }}
            />
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.eyebrow}>BROWSE BY</span>
          <h2 style={styles.sectionTitle}>Shop by Category</h2>
        </div>
        <div style={styles.catGrid}>
          {categories.map((cat) => (
            <Link to="/products" key={cat.name} style={styles.catCardLink}>
              <div style={styles.catCard}>
                <img src={cat.img} alt={cat.name} style={styles.catImg} />
                <div style={styles.catOverlay}>
                  <span style={styles.catEmoji}>{cat.emoji}</span>
                  <span style={styles.catName}>{cat.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={styles.featSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.eyebrow}>WHY CLOUDCART</span>
          <h2 style={styles.sectionTitle}>Built Around You</h2>
        </div>
        <div style={styles.featGrid}>
          {features.map((f) => (
            <div key={f.title} style={styles.featCard}>
              <div style={styles.featIcon}>{f.icon}</div>
              <h3 style={styles.featTitle}>{f.title}</h3>
              <p style={styles.featDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BANNER ── */}
      <section style={styles.banner}>
        <div style={styles.bannerContent}>
          <p style={styles.bannerEye}>LIMITED OFFER</p>
          <h2 style={styles.bannerTitle}>Up to 50% Off on Electronics</h2>
          <p style={styles.bannerSub}>Flash sale ends Sunday midnight. Don't miss out.</p>
          <Link to="/products" style={styles.bannerBtn}>Grab the Deal →</Link>
        </div>
        <img
          src="https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&q=80"
          alt="Sale"
          style={styles.bannerImg}
        />
      </section>
    </div>
  );
}

const styles = {
  page: { background: "#f8f9fc", minHeight: "100vh" },

  // Hero
  hero: {
    position: "relative",
    height: "560px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "background-image 0.8s ease",
    display: "flex",
    alignItems: "center",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(90deg,rgba(10,10,30,0.82) 0%,rgba(10,10,30,0.2) 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "0 80px",
  },
  heroEyebrow: {
    color: "#e94560",
    letterSpacing: "3px",
    fontSize: "0.75rem",
    fontWeight: 700,
    marginBottom: "12px",
  },
  heroTitle: {
    fontSize: "3.4rem",
    color: "#fff",
    fontWeight: 800,
    lineHeight: 1.15,
    margin: "0 0 16px",
  },
  heroSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: "1.1rem",
    maxWidth: "480px",
    lineHeight: 1.6,
    margin: "0 0 32px",
  },
  heroActions: { display: "flex", gap: "16px", alignItems: "center" },
  heroCta: {
    background: "#e94560",
    color: "#fff",
    padding: "14px 32px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "1rem",
    letterSpacing: "0.5px",
  },
  heroGhost: {
    color: "#fff",
    border: "2px solid rgba(255,255,255,0.5)",
    padding: "13px 28px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "1rem",
  },
  dots: { position: "absolute", bottom: "24px", left: "80px", display: "flex", gap: "8px" },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#fff",
    border: "none",
    cursor: "pointer",
    padding: 0,
    transition: "opacity 0.3s",
  },

  // Sections
  section: { maxWidth: "1200px", margin: "0 auto", padding: "64px 20px" },
  featSection: { background: "#fff", padding: "64px 20px" },
  sectionHeader: { textAlign: "center", marginBottom: "40px" },
  eyebrow: {
    color: "#e94560",
    letterSpacing: "3px",
    fontSize: "0.72rem",
    fontWeight: 700,
    display: "block",
    marginBottom: "8px",
  },
  sectionTitle: { fontSize: "2rem", fontWeight: 800, color: "#1a1a2e", margin: 0 },

  // Categories
  catGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  catCardLink: { textDecoration: "none" },
  catCard: {
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
    height: "200px",
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
  },
  catImg: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" },
  catOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(0deg,rgba(0,0,0,0.65) 0%,rgba(0,0,0,0.1) 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "20px",
  },
  catEmoji: { fontSize: "1.8rem", marginBottom: "4px" },
  catName: { color: "#fff", fontWeight: 700, fontSize: "1rem" },

  // Features
  featGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  featCard: {
    background: "#f8f9fc",
    borderRadius: "12px",
    padding: "32px 24px",
    textAlign: "center",
    border: "1px solid #eee",
  },
  featIcon: { fontSize: "2.2rem", marginBottom: "16px" },
  featTitle: { fontWeight: 700, fontSize: "1rem", color: "#1a1a2e", margin: "0 0 8px" },
  featDesc: { color: "#777", fontSize: "0.88rem", lineHeight: 1.6, margin: 0 },

  // Banner
  banner: {
    maxWidth: "1200px",
    margin: "0 auto 64px",
    borderRadius: "16px",
    background: "linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
  },
  bannerContent: { padding: "48px 56px", flex: 1 },
  bannerEye: { color: "#e94560", letterSpacing: "3px", fontSize: "0.72rem", fontWeight: 700, marginBottom: "12px" },
  bannerTitle: { color: "#fff", fontSize: "2rem", fontWeight: 800, margin: "0 0 12px" },
  bannerSub: { color: "rgba(255,255,255,0.65)", fontSize: "1rem", margin: "0 0 28px" },
  bannerBtn: {
    display: "inline-block",
    background: "#e94560",
    color: "#fff",
    padding: "13px 28px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "0.95rem",
  },
  bannerImg: { width: "380px", height: "260px", objectFit: "cover" },
};

export default Home;
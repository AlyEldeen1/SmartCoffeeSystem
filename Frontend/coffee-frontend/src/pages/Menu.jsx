import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ShoppingBag } from "lucide-react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const COLORS = {
  green: "#172c17",
  greenLight: "#1e3a1e",
  gold: "#c9a96e",
  goldDim: "#9a7a4e",
  cream: "#f0e6d3",
  white: "#f5f0ea",
};

// Map common coffee names or categories to emojis for layout
const getEmoji = (name) => {
  const n = name.toLowerCase();
  if (n.includes("espresso")) return "☕";
  if (n.includes("flat white") || n.includes("latte")) return "🥛";
  if (n.includes("cold brew") || n.includes("iced")) return "🧊";
  if (n.includes("matcha")) return "🍵";
  if (n.includes("cappuccino")) return "☁️";
  if (n.includes("mocha") || n.includes("chocolate")) return "🍫";
  if (n.includes("food") || n.includes("croissant") || n.includes("cake")) return "🥐";
  return "☕";
};

export default function Menu() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // 'all' or category ID
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [feedback, setFeedback] = useState({}); // Stores success state per product ID

  useEffect(() => {
    const initPage = async () => {
      try {
        const profileRes = await API.get("/auth/profile");
        setUser(profileRes.data.user);

        const catsRes = await API.get("/categories");
        setCategories(catsRes.data.categories || []);
      } catch (err) {
        console.error("Failed to load menu details", err);
        localStorage.removeItem("token");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, [navigate]);

  useEffect(() => {
    if (loading || categories.length === 0) return;

    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        if (activeTab === "all") {
          // Fetch products of all categories in parallel and combine
          const requests = categories.map((cat) => API.get(`/products/category/${cat.id}`));
          const responses = await Promise.all(requests);
          const allProds = responses.flatMap((res, idx) => {
            const list = res.data.products || [];
            // Attach category name for ease of rendering
            return list.map((p) => ({
              ...p,
              categoryName: categories[idx].name,
            }));
          });
          setProducts(allProds);
        } else {
          const res = await API.get(`/products/category/${activeTab}`);
          const cat = categories.find((c) => String(c.id) === String(activeTab));
          const list = res.data.products || [];
          setProducts(list.map((p) => ({ ...p, categoryName: cat?.name })));
        }
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [activeTab, categories, loading]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      let updated;
      if (existing) {
        updated = prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        updated = [...prevCart, { id: product.id, name: product.name, price: product.price, qty: 1 }];
      }
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });

    // Success feedback animation
    setFeedback((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setFeedback((prev) => ({ ...prev, [product.id]: false }));
    }, 800);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.qty, 0);
  };

  // Filter only available products for customer menu view
  const availableProducts = products.filter((p) => p.is_available);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.green }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500&display=swap');`}</style>
        <Loader2 size={32} className="animate-spin" style={{ color: COLORS.gold }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: COLORS.green, color: COLORS.gold }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500&display=swap');`}</style>

      {/* Navigation */}
      <Navbar role={user?.role} />

      {/* Header */}
      <div className="px-10 py-8 flex justify-between items-baseline">
        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "28px",
            letterSpacing: "6px",
            color: COLORS.gold,
          }}
        >
          Menu
        </h1>
      </div>

      <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`, margin: "0 2.5rem 1.5rem" }} />

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 px-10 mb-8">
        <button
          onClick={() => setActiveTab("all")}
          className="px-6 py-2 text-[10px] tracking-[3px] uppercase cursor-pointer border rounded-[2px] transition duration-200"
          style={{
            borderColor: activeTab === "all" ? COLORS.gold : "transparent",
            color: activeTab === "all" ? COLORS.gold : COLORS.goldDim,
            background: activeTab === "all" ? COLORS.greenLight : "transparent",
            fontFamily: "'Raleway', sans-serif",
          }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className="px-6 py-2 text-[10px] tracking-[3px] uppercase cursor-pointer border rounded-[2px] transition duration-200"
            style={{
              borderColor: String(activeTab) === String(cat.id) ? COLORS.gold : "transparent",
              color: String(activeTab) === String(cat.id) ? COLORS.gold : COLORS.goldDim,
              background: String(activeTab) === String(cat.id) ? COLORS.greenLight : "transparent",
              fontFamily: "'Raleway', sans-serif",
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="flex-1 px-10 pb-16">
        {productsLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={24} className="animate-spin" style={{ color: COLORS.gold }} />
          </div>
        ) : availableProducts.length === 0 ? (
          <div className="text-center py-20" style={{ color: COLORS.goldDim }}>
            No items available in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableProducts.map((prod) => {
              const isAdded = feedback[prod.id];
              return (
                <div
                  key={prod.id}
                  className="rounded-[4px] p-6 border transition duration-200 hover:-translate-y-1"
                  style={{
                    background: COLORS.greenLight,
                    borderColor: "#2a4a2a",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = COLORS.gold;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#2a4a2a";
                  }}
                >
                  <div className="text-3xl mb-3">{getEmoji(prod.name)}</div>
                  <div
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "14px",
                      color: COLORS.cream,
                      marginBottom: "6px",
                    }}
                  >
                    {prod.name}
                  </div>
                  <div
                    className="text-[11px] leading-relaxed mb-4"
                    style={{ color: COLORS.goldDim }}
                  >
                    {prod.description || "Freshly brewed selection."}
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: "15px",
                        color: COLORS.gold,
                      }}
                    >
                      {prod.price} EGP
                    </span>
                    <button
                      onClick={() => addToCart(prod)}
                      className="w-8 h-8 rounded-full border-none flex items-center justify-center text-lg cursor-pointer transition-colors duration-200"
                      style={{
                        background: isAdded ? "#5a9a5a" : COLORS.gold,
                        color: COLORS.green,
                      }}
                    >
                      {isAdded ? "✓" : "+"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cart floating review if there are items */}
      {getCartCount() > 0 && (
        <div
          className="fixed bottom-6 right-6 p-4 rounded-[4px] shadow-lg flex items-center gap-4 cursor-pointer hover:brightness-110 transition duration-200 z-50"
          style={{
            background: COLORS.gold,
            color: COLORS.green,
          }}
          onClick={() => navigate("/dashboard")} // Wait, we don't have a cart page yet, let's keep it pointing to dashboard for now or general flow
        >
          <ShoppingBag size={18} />
          <span className="text-[11px] tracking-[2px] uppercase font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
            Cart ({getCartCount()} items)
          </span>
        </div>
      )}
    </div>
  );
}

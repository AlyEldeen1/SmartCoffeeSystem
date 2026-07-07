import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus, Edit2, Trash2, ChevronDown, ChevronUp, Eye, EyeOff, X, RefreshCw } from "lucide-react";
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

export default function AdminMenu() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [productsMap, setProductsMap] = useState({}); // catId -> product list
  const [expandedCatId, setExpandedCatId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Category Form State
  const [showCatForm, setShowCatForm] = useState(false);
  const [editingCat, setEditingCat] = useState(null); // category object if editing
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catImage, setCatImage] = useState("");

  // Product Form State
  const [showProdForm, setShowProdForm] = useState(false);
  const [editingProd, setEditingProd] = useState(null); // product object if editing
  const [prodName, setProdName] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodImage, setProdImage] = useState("");

  // Fetch Admin Profile and Categories
  useEffect(() => {
    const initPage = async () => {
      try {
        const profileRes = await API.get("/auth/profile");
        const u = profileRes.data.user;
        if (u.role !== "admin") {
          navigate("/dashboard");
          return;
        }
        setUser(u);
        await fetchCategories();
      } catch (err) {
        console.error("Failed to load page config", err);
        localStorage.removeItem("token");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setErrorMsg("Failed to load categories.");
    }
  };

  const fetchProductsForCategory = async (catId) => {
    try {
      const res = await API.get(`/products/category/${catId}`);
      setProductsMap((prev) => ({
        ...prev,
        [catId]: res.data.products || [],
      }));
    } catch (err) {
      console.error("Failed to fetch products for category", err);
    }
  };

  const toggleCategoryExpand = async (catId) => {
    if (expandedCatId === catId) {
      setExpandedCatId(null);
    } else {
      setExpandedCatId(catId);
      setShowProdForm(false);
      setEditingProd(null);
      await fetchProductsForCategory(catId);
    }
  };

  // Reset category form
  const resetCatForm = () => {
    setEditingCat(null);
    setCatName("");
    setCatDesc("");
    setCatImage("");
    setShowCatForm(false);
    setErrorMsg("");
  };

  // Reset product form
  const resetProdForm = () => {
    setEditingProd(null);
    setProdName("");
    setProdDesc("");
    setProdPrice("");
    setProdImage("");
    setShowProdForm(false);
    setErrorMsg("");
  };

  // Handle Category Submit (Add / Edit)
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!catName.trim()) {
      setErrorMsg("Category Name is required");
      return;
    }

    try {
      if (editingCat) {
        // Edit Category
        await API.put(`/categories/${editingCat.id}`, {
          name: catName,
          description: catDesc,
          image_url: catImage,
        });
        setSuccessMsg("Category updated successfully.");
      } else {
        // Add Category
        await API.post("/categories", {
          name: catName,
          description: catDesc,
          image_url: catImage,
        });
        setSuccessMsg("Category added successfully.");
      }
      resetCatForm();
      await fetchCategories();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to save category.");
    }
  };

  // Edit category button handler
  const startEditCategory = (cat) => {
    setEditingCat(cat);
    setCatName(cat.name);
    setCatDesc(cat.description || "");
    setCatImage(cat.image_url || "");
    setShowCatForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete Category
  const handleDeleteCategory = async (catId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await API.delete(`/categories/${catId}`);
      setSuccessMsg("Category deleted successfully.");
      await fetchCategories();
      if (expandedCatId === catId) setExpandedCatId(null);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to delete category.");
    }
  };

  // Toggle Product Availability (soft deletion/restoration)
  const handleToggleProductAvailability = async (prodId, catId) => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await API.patch(`/products/${prodId}/availability`);
      setSuccessMsg("Product availability updated.");
      await fetchProductsForCategory(catId);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to toggle availability.");
    }
  };

  // Hard Delete Product
  const handleDeleteProduct = async (prodId, catId) => {
    if (!window.confirm("Are you sure you want to permanently delete this product?")) return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await API.delete(`/products/${prodId}`);
      setSuccessMsg("Product deleted successfully.");
      await fetchProductsForCategory(catId);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to delete product.");
    }
  };

  // Edit product button handler
  const startEditProduct = (prod) => {
    setEditingProd(prod);
    setProdName(prod.name);
    setProdDesc(prod.description || "");
    setProdPrice(prod.price);
    setProdImage(prod.image_url || "");
    setShowProdForm(true);
  };

  // Handle Product Submit (Add / Edit)
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!prodName.trim() || !prodPrice) {
      setErrorMsg("Name and Price are required.");
      return;
    }

    try {
      if (editingProd) {
        // Edit Product
        await API.put(`/products/${editingProd.id}`, {
          category_id: expandedCatId,
          name: prodName,
          description: prodDesc,
          price: Number(prodPrice),
          image_url: prodImage,
        });
        setSuccessMsg("Product updated successfully.");
      } else {
        // Add Product
        await API.post("/products", {
          category_id: expandedCatId,
          name: prodName,
          description: prodDesc,
          price: Number(prodPrice),
          image_url: prodImage,
        });
        setSuccessMsg("Product added successfully.");
      }
      resetProdForm();
      await fetchProductsForCategory(expandedCatId);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to save product.");
    }
  };

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
      <div className="px-10 py-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "28px",
              letterSpacing: "6px",
              color: COLORS.gold,
            }}
          >
            Menu Database
          </h1>
          <p style={{ color: COLORS.goldDim, fontSize: "12px", marginTop: "4px" }}>
            Add, update, disable, and manage your store menu.
          </p>
        </div>
        <button
          onClick={() => {
            resetCatForm();
            setShowCatForm(!showCatForm);
          }}
          className="px-5 py-3 transition rounded-[2px] flex items-center gap-2 cursor-pointer font-bold"
          style={{
            background: COLORS.gold,
            color: COLORS.green,
            fontFamily: "'Cinzel', serif",
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`, margin: "0 2.5rem 1.5rem" }} />

      {/* Alerts */}
      <div className="px-10 space-y-2">
        {errorMsg && (
          <div className="p-4 rounded-[4px] border border-red-900 bg-red-950/40 text-red-300 text-sm flex items-center justify-between">
            <span>{errorMsg}</span>
            <button className="text-red-300 hover:text-white" onClick={() => setErrorMsg("")}>
              <X size={16} />
            </button>
          </div>
        )}
        {successMsg && (
          <div className="p-4 rounded-[4px] border border-green-900 bg-green-950/40 text-green-300 text-sm flex items-center justify-between">
            <span>{successMsg}</span>
            <button className="text-green-300 hover:text-white" onClick={() => setSuccessMsg("")}>
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Category Add/Edit Form section */}
      {showCatForm && (
        <div className="mx-10 my-4 p-6 border rounded-[4px]" style={{ background: COLORS.greenLight, borderColor: "#2a4a2a" }}>
          <div className="flex justify-between items-center mb-6">
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "16px", color: COLORS.cream, letterSpacing: "2px" }}>
              {editingCat ? "Edit Category" : "Add New Category"}
            </h2>
            <button className="text-gold-dim hover:text-gold" onClick={resetCatForm}>
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase text-gold-dim mb-2">Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Cold Brew"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full bg-green text-cream border rounded-[2px] p-3 outline-none text-sm focus:border-gold"
                  style={{ background: COLORS.green, borderColor: "#2a4a2a", fontFamily: "'Raleway', sans-serif" }}
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase text-gold-dim mb-2">Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  className="w-full bg-green text-cream border rounded-[2px] p-3 outline-none text-sm focus:border-gold"
                  style={{ background: COLORS.green, borderColor: "#2a4a2a", fontFamily: "'Raleway', sans-serif" }}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-gold-dim mb-2">Description</label>
              <textarea
                placeholder="Description of the category..."
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
                rows={3}
                className="w-full bg-green text-cream border rounded-[2px] p-3 outline-none text-sm focus:border-gold resize-none"
                style={{ background: COLORS.green, borderColor: "#2a4a2a", fontFamily: "'Raleway', sans-serif" }}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={resetCatForm}
                className="px-4 py-2 border rounded-[2px] text-xs uppercase tracking-[2px]"
                style={{ borderColor: "#2a4a2a", color: COLORS.goldDim, fontFamily: "'Cinzel', serif" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-[2px] text-xs uppercase tracking-[2px] font-bold"
                style={{ background: COLORS.gold, color: COLORS.green, fontFamily: "'Cinzel', serif" }}
              >
                {editingCat ? "Save Changes" : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Accordion List */}
      <div className="px-10 pb-20 space-y-4">
        {categories.length === 0 ? (
          <div className="text-center py-12" style={{ color: COLORS.goldDim }}>
            No categories defined yet. Create your first category above.
          </div>
        ) : (
          categories.map((cat) => {
            const isExpanded = expandedCatId === cat.id;
            const prods = productsMap[cat.id] || [];

            return (
              <div key={cat.id} className="border rounded-[4px] overflow-hidden" style={{ borderColor: "#2a4a2a", background: COLORS.greenLight }}>
                {/* Accordion Head */}
                <div
                  className="flex justify-between items-center p-5 cursor-pointer select-none transition hover:bg-[#223d22]"
                  onClick={() => toggleCategoryExpand(cat.id)}
                >
                  <div>
                    <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "15px", color: COLORS.cream, fontWeight: 600 }}>
                      {cat.name}
                    </h3>
                    <p style={{ color: COLORS.goldDim, fontSize: "11px", marginTop: "2px" }}>
                      {cat.description || "No description provided."}
                    </p>
                  </div>

                  <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => startEditCategory(cat)}
                      className="p-2 text-gold-dim hover:text-gold transition bg-transparent border-none cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition bg-transparent border-none cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div onClick={() => toggleCategoryExpand(cat.id)} className="p-2 text-gold hover:text-cream transition cursor-pointer">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </div>

                {/* Accordion Slider Body */}
                {isExpanded && (
                  <div className="border-t p-6 space-y-6" style={{ borderColor: "#172c17", background: "rgba(0,0,0,0.15)" }}>
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: "12px", color: COLORS.gold, letterSpacing: "1px" }}>
                        Products inside {cat.name}
                      </h4>
                      <button
                        onClick={() => {
                          resetProdForm();
                          setShowProdForm(!showProdForm);
                        }}
                        className="px-3 py-1.5 border border-gold text-[9px] tracking-[2px] uppercase rounded-[2px] cursor-pointer hover:bg-gold/10 transition"
                        style={{ fontFamily: "'Cinzel', serif", color: COLORS.gold }}
                      >
                        <Plus size={10} className="inline mr-1" /> Add Product
                      </button>
                    </div>

                    {/* Product Form inside Panel */}
                    {showProdForm && (
                      <div className="p-5 border rounded-[4px] space-y-4" style={{ background: COLORS.green, borderColor: "#2a4a2a" }}>
                        <div className="flex justify-between items-center mb-2">
                          <h5 style={{ fontFamily: "'Cinzel', serif", fontSize: "13px", color: COLORS.cream }}>
                            {editingProd ? "Edit Product Details" : `Add Product to ${cat.name}`}
                          </h5>
                          <button className="text-gold-dim hover:text-gold" onClick={resetProdForm}>
                            <X size={16} />
                          </button>
                        </div>
                        <form onSubmit={handleProductSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[9px] tracking-[2px] uppercase text-gold-dim mb-1">Product Name *</label>
                              <input
                                type="text"
                                placeholder="e.g. Caramel Latte"
                                value={prodName}
                                onChange={(e) => setProdName(e.target.value)}
                                className="w-full bg-green-light text-cream border rounded-[2px] p-2.5 outline-none text-sm focus:border-gold"
                                style={{ background: COLORS.greenLight, borderColor: "#2a4a2a", fontFamily: "'Raleway', sans-serif" }}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] tracking-[2px] uppercase text-gold-dim mb-1">Price (EGP) *</label>
                              <input
                                type="number"
                                placeholder="e.g. 50"
                                value={prodPrice}
                                onChange={(e) => setProdPrice(e.target.value)}
                                className="w-full bg-green-light text-cream border rounded-[2px] p-2.5 outline-none text-sm focus:border-gold"
                                style={{ background: COLORS.greenLight, borderColor: "#2a4a2a", fontFamily: "'Raleway', sans-serif" }}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] tracking-[2px] uppercase text-gold-dim mb-1">Image URL</label>
                              <input
                                type="text"
                                placeholder="https://example.com/item.png"
                                value={prodImage}
                                onChange={(e) => setProdImage(e.target.value)}
                                className="w-full bg-green-light text-cream border rounded-[2px] p-2.5 outline-none text-sm focus:border-gold"
                                style={{ background: COLORS.greenLight, borderColor: "#2a4a2a", fontFamily: "'Raleway', sans-serif" }}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] tracking-[2px] uppercase text-gold-dim mb-1">Description</label>
                            <input
                              type="text"
                              placeholder="Describe the product flavor profile, ingredients..."
                              value={prodDesc}
                              onChange={(e) => setProdDesc(e.target.value)}
                              className="w-full bg-green-light text-cream border rounded-[2px] p-2.5 outline-none text-sm focus:border-gold"
                              style={{ background: COLORS.greenLight, borderColor: "#2a4a2a", fontFamily: "'Raleway', sans-serif" }}
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button
                              type="button"
                              onClick={resetProdForm}
                              className="px-3 py-1.5 border rounded-[2px] text-[10px] uppercase tracking-[2px]"
                              style={{ borderColor: "#2a4a2a", color: COLORS.goldDim, fontFamily: "'Cinzel', serif" }}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-1.5 rounded-[2px] text-[10px] uppercase tracking-[2px] font-bold"
                              style={{ background: COLORS.gold, color: COLORS.green, fontFamily: "'Cinzel', serif" }}
                            >
                              {editingProd ? "Save Product" : "Add Product"}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Products Grid inside Slider */}
                    {prods.length === 0 ? (
                      <div className="text-center py-8 text-xs" style={{ color: COLORS.goldDim }}>
                        No products inside this category. Click Add Product above.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {prods.map((prod) => (
                          <div
                            key={prod.id}
                            className="flex justify-between items-center p-4 border rounded-[3px] transition duration-200"
                            style={{
                              background: COLORS.green,
                              borderColor: prod.is_available ? "#2a4a2a" : "#1a2a1a",
                              opacity: prod.is_available ? 1 : 0.6,
                            }}
                          >
                            <div className="flex-1 pr-4">
                              <div className="flex items-center gap-2">
                                <span style={{ fontFamily: "'Cinzel', serif", fontSize: "13px", color: COLORS.cream, fontWeight: 500 }}>
                                  {prod.name}
                                </span>
                                {!prod.is_available && (
                                  <span className="text-[8px] tracking-[1px] uppercase bg-red-950 border border-red-900 text-red-400 px-1.5 py-0.5 rounded-[2px]">
                                    Disabled
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px]" style={{ color: COLORS.gold }}>
                                {prod.price} EGP
                              </div>
                              <div className="text-[10px] leading-snug mt-1" style={{ color: COLORS.goldDim }}>
                                {prod.description || "Fresh selection."}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {/* Soft Delete / Toggle Availability Button */}
                              <button
                                onClick={() => handleToggleProductAvailability(prod.id, cat.id)}
                                className={`p-2 rounded-[2px] border transition cursor-pointer flex items-center justify-center`}
                                style={{
                                  borderColor: prod.is_available ? "#2a4a2a" : COLORS.goldDim,
                                  background: "transparent",
                                  color: prod.is_available ? COLORS.goldDim : COLORS.gold,
                                }}
                                title={prod.is_available ? "Soft Delete (Disable)" : "Restore (Enable)"}
                              >
                                {prod.is_available ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>

                              {/* Edit Button */}
                              <button
                                onClick={() => startEditProduct(prod)}
                                className="p-2 border rounded-[2px] transition cursor-pointer flex items-center justify-center"
                                style={{ borderColor: "#2a4a2a", background: "transparent", color: COLORS.goldDim }}
                                title="Edit Product"
                              >
                                <Edit2 size={14} />
                              </button>

                              {/* Hard Delete Button */}
                              <button
                                onClick={() => handleDeleteProduct(prod.id, cat.id)}
                                className="p-2 border rounded-[2px] transition cursor-pointer flex items-center justify-center hover:border-red-500 hover:text-red-400"
                                style={{ borderColor: "#2a4a2a", background: "transparent", color: COLORS.goldDim }}
                                title="Delete Product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Loader2, Coffee } from "lucide-react";
import API from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/auth/profile");
        setUser(response.data.user);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch profile");
        localStorage.removeItem("token");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetchProfile();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#faf8f5" }}>
        <Loader2 size={32} className="animate-spin" style={{ color: "#6b3f22" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#faf8f5" }}>
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <p style={{ color: "#dc2626", marginBottom: "1rem" }}>{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-lg"
            style={{ background: "#6b3f22", color: "#f5ede0" }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#faf8f5" }}>
      {/* Header */}
      <nav
        className="flex justify-between items-center p-6 shadow-sm"
        style={{ background: "#fff", borderBottom: "1px solid #e8ddd4" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(212,169,106,0.2)", border: "1px solid rgba(212,169,106,0.3)" }}
          >
            <Coffee size={20} color="#d4a96a" />
          </div>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#2c1a0e", fontSize: "1.1rem", fontWeight: 600 }}>
            Smart Coffee
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition"
          style={{ background: "#fff5f5", color: "#dc2626" }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        {/* Welcome Card */}
        <div
          className="p-8 rounded-lg mb-8"
          style={{
            background: "linear-gradient(135deg, #4a2c17 0%, #6b3f22 100%)",
            color: "#f5ede0",
          }}
        >
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "2.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Welcome back, {user?.name}! ☕
          </h1>
          <p style={{ color: "rgba(245,237,224,0.7)" }}>
            Ready to order your next brew?
          </p>
        </div>

        {/* User Info Card */}
        <div
          className="bg-white p-6 rounded-lg shadow-sm border"
          style={{ borderColor: "#e8ddd4" }}
        >
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.3rem", color: "#2c1a0e", fontWeight: 600, marginBottom: "1.5rem" }}>
            Profile Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <p style={{ fontSize: "0.85rem", color: "#8a7060", fontWeight: 600, marginBottom: "0.4rem" }}>
                Full Name
              </p>
              <p style={{ fontSize: "1rem", color: "#2c1a0e", fontWeight: 500 }}>
                {user?.name}
              </p>
            </div>

            {/* Email */}
            <div>
              <p style={{ fontSize: "0.85rem", color: "#8a7060", fontWeight: 600, marginBottom: "0.4rem" }}>
                Email Address
              </p>
              <p style={{ fontSize: "1rem", color: "#2c1a0e", fontWeight: 500 }}>
                {user?.email}
              </p>
            </div>

            {/* Role */}
            <div>
              <p style={{ fontSize: "0.85rem", color: "#8a7060", fontWeight: 600, marginBottom: "0.4rem" }}>
                Account Type
              </p>
              <div
                className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  background: user?.role === "admin" ? "#fef3c7" : user?.role === "cashier" ? "#dbeafe" : "#f0fdf4",
                  color: user?.role === "admin" ? "#92400e" : user?.role === "cashier" ? "#0c4a6e" : "#166534",
                }}
              >
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </div>
            </div>

            {/* ID */}
            <div>
              <p style={{ fontSize: "0.85rem", color: "#8a7060", fontWeight: 600, marginBottom: "0.4rem" }}>
                User ID
              </p>
              <p style={{ fontSize: "0.9rem", color: "#6b7280", fontFamily: "monospace" }}>
                {user?.id}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Browse Menu", icon: "🍵", color: "#f0fdf4" },
            { title: "View Orders", icon: "📦", color: "#fef3c7" },
            { title: "Loyalty Rewards", icon: "⭐", color: "#fce7f3" },
          ].map((action, idx) => (
            <button
              key={idx}
              className="p-6 rounded-lg bg-white border text-center hover:shadow-md transition"
              style={{ borderColor: "#e8ddd4" }}
            >
              <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{action.icon}</p>
              <p style={{ color: "#2c1a0e", fontWeight: 600 }}>{action.title}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
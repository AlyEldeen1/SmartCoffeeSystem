import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Loader2, Menu, User } from "lucide-react";
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

const ROLE_COLORS = {
  admin: { bg: "#2a4a2a", border: "#4a7a4a", text: "#86efac" },
  cashier: { bg: "#2a3a4a", border: "#4a6a8a", text: "#5a9adc" },
  customer: { bg: "#3a3a2a", border: "#6a6a4a", text: "#c9a96e" },
};

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.green }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500&display=swap');`}</style>
        <Loader2 size={32} className="animate-spin" style={{ color: COLORS.gold }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: COLORS.green }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500&display=swap');`}</style>
        <div className="p-8 text-center max-w-md" style={{ background: COLORS.greenLight, border: `1px solid #2a4a2a`, borderRadius: "4px" }}>
          <p style={{ color: "#fca5a5", marginBottom: "1rem" }}>{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 transition"
            style={{
              background: COLORS.gold,
              color: COLORS.green,
              borderRadius: "2px",
              fontFamily: "'Cinzel', serif",
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const roleColor = ROLE_COLORS[user?.role] || ROLE_COLORS.customer;

  return (
    <div className="min-h-screen" style={{ background: COLORS.green }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500&display=swap');`}</style>

      {/* Reusable Navbar */}
      <Navbar role={user?.role} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "32px",
                  letterSpacing: "3px",
                  color: COLORS.gold,
                  marginBottom: "0.5rem",
                }}
              >
                Welcome, {user?.name}
              </h1>
              <p style={{ color: COLORS.goldDim, fontSize: "14px", letterSpacing: "1px" }}>
                Ready to order your next brew? ☕
              </p>
            </div>
            {/* Role Badge */}
            <div
              style={{
                background: roleColor.bg,
                border: `1px solid ${roleColor.border}`,
                borderRadius: "4px",
                padding: "12px 16px",
              }}
            >
              <p style={{ fontSize: "10px", letterSpacing: "2px", color: COLORS.goldDim, textTransform: "uppercase", marginBottom: "4px" }}>
                Account Type
              </p>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: "16px", color: roleColor.text, fontWeight: 600 }}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </p>
            </div>
          </div>
          <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)` }} />
        </div>

        {/* Quick Actions */}
        <div>
          <h3
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "14px",
              letterSpacing: "3px",
              color: COLORS.goldDim,
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            Quick Actions
          </h3>

          <div className={`grid grid-cols-1 ${user?.role === "admin" ? "md:grid-cols-4" : "md:grid-cols-3"} gap-4`}>
            {/* Menu Button */}
            <button
              onClick={() => navigate("/menu")}
              style={{
                background: COLORS.greenLight,
                border: `1px solid #2a4a2a`,
                borderRadius: "4px",
                padding: "20px",
                cursor: "pointer",
                transition: "border-color 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = COLORS.gold;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2a4a2a";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "0.5rem" }}>🍵</div>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: "14px", color: COLORS.cream }}>
                Browse Menu
              </p>
              <p style={{ fontSize: "11px", color: COLORS.goldDim, marginTop: "0.5rem" }}>
                Browse our coffee selection
              </p>
            </button>

            {/* Orders Button */}
            <button
              style={{
                background: COLORS.greenLight,
                border: `1px solid #2a4a2a`,
                borderRadius: "4px",
                padding: "20px",
                cursor: "pointer",
                transition: "border-color 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = COLORS.gold;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2a4a2a";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "0.5rem" }}>📦</div>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: "14px", color: COLORS.cream }}>
                My Orders
              </p>
              <p style={{ fontSize: "11px", color: COLORS.goldDim, marginTop: "0.5rem" }}>
                Track your orders
              </p>
            </button>

            {/* Loyalty Button */}
            <button
              style={{
                background: COLORS.greenLight,
                border: `1px solid #2a4a2a`,
                borderRadius: "4px",
                padding: "20px",
                cursor: "pointer",
                transition: "border-color 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = COLORS.gold;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2a4a2a";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "0.5rem" }}>⭐</div>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: "14px", color: COLORS.cream }}>
                Loyalty Points
              </p>
              <p style={{ fontSize: "11px", color: COLORS.goldDim, marginTop: "0.5rem" }}>
                Earn rewards
              </p>
            </button>

            {/* Admin Panel Button (Conditional) */}
            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                style={{
                  background: COLORS.greenLight,
                  border: `1px solid #2a4a2a`,
                  borderRadius: "4px",
                  padding: "20px",
                  cursor: "pointer",
                  transition: "border-color 0.2s, transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COLORS.gold;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#2a4a2a";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: "28px", marginBottom: "0.5rem" }}>🛡️</div>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: "14px", color: COLORS.cream }}>
                  Admin Panel
                </p>
                <p style={{ fontSize: "11px", color: COLORS.goldDim, marginTop: "0.5rem" }}>
                  Manage store & database
                </p>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
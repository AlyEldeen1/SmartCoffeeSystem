import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
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

export default function Profile() {
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
            onClick={() => navigate("/dashboard")}
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
            Back to Dashboard
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
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        {/* User Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "32px",
                letterSpacing: "3px",
                color: COLORS.cream,
                marginBottom: "0.5rem",
              }}
            >
              {user?.name}
            </h2>
            <p style={{ color: COLORS.goldDim, fontSize: "13px", letterSpacing: "1px" }}>
              {user?.email}
            </p>
          </div>

          {/* Role Badge */}
          <div
            style={{
              background: roleColor.bg,
              border: `1px solid ${roleColor.border}`,
              borderRadius: "4px",
              padding: "16px 20px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "10px", letterSpacing: "2px", color: COLORS.goldDim, textTransform: "uppercase", marginBottom: "6px" }}>
              Account Type
            </p>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: "18px", color: roleColor.text, fontWeight: 600 }}>
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </p>
          </div>
        </div>

        <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`, marginBottom: "2rem" }} />

        {/* Personal Information */}
        <div
          className="mb-8 p-8"
          style={{
            background: COLORS.greenLight,
            border: `1px solid #2a4a2a`,
            borderRadius: "4px",
          }}
        >
          <h3
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "14px",
              letterSpacing: "3px",
              color: COLORS.goldDim,
              textTransform: "uppercase",
              marginBottom: "2rem",
            }}
          >
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Full Name */}
            <div className="pb-6 border-b" style={{ borderColor: "#2a4a2a" }}>
              <p style={{ fontSize: "10px", color: COLORS.goldDim, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                Full Name
              </p>
              <p style={{ fontSize: "16px", color: COLORS.cream, fontFamily: "'Cinzel', serif", fontWeight: 500 }}>
                {user?.name}
              </p>
            </div>

            {/* Email Address */}
            <div className="pb-6 border-b" style={{ borderColor: "#2a4a2a" }}>
              <p style={{ fontSize: "10px", color: COLORS.goldDim, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                Email Address
              </p>
              <p style={{ fontSize: "16px", color: COLORS.cream, fontFamily: "'Raleway', sans-serif" }}>
                {user?.email}
              </p>
            </div>

            {/* Phone Number */}
            <div className="pb-6 border-b" style={{ borderColor: "#2a4a2a" }}>
              <p style={{ fontSize: "10px", color: COLORS.goldDim, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                Phone Number
              </p>
              <p style={{ fontSize: "16px", color: COLORS.cream, fontFamily: "'Raleway', sans-serif" }}>
                {user?.phone_number || "Not provided"}
              </p>
            </div>

            {/* User ID */}
            <div className="pb-6 border-b" style={{ borderColor: "#2a4a2a" }}>
              <p style={{ fontSize: "10px", color: COLORS.goldDim, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                User ID
              </p>
              <p style={{ fontSize: "13px", color: COLORS.goldDim, fontFamily: "monospace", wordBreak: "break-all" }}>
                {user?.id}
              </p>
            </div>

            {/* Created At */}
            <div className="pb-6 border-b" style={{ borderColor: "#2a4a2a" }}>
              <p style={{ fontSize: "10px", color: COLORS.goldDim, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                Member Since
              </p>
              <p style={{ fontSize: "16px", color: COLORS.cream, fontFamily: "'Raleway', sans-serif" }}>
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
              </p>
            </div>

            {/* Role */}
            <div className="pb-6 border-b" style={{ borderColor: "#2a4a2a" }}>
              <p style={{ fontSize: "10px", color: COLORS.goldDim, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                Account Type
              </p>
              <p style={{ fontSize: "16px", color: roleColor.text, fontFamily: "'Cinzel', serif", fontWeight: 600 }}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Account Actions */}
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
            Account Actions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Edit Profile Button */}
            <button
              style={{
                background: COLORS.greenLight,
                border: `1px solid #2a4a2a`,
                color: COLORS.cream,
                borderRadius: "4px",
                padding: "14px",
                cursor: "pointer",
                transition: "border-color 0.2s, transform 0.15s",
                fontFamily: "'Cinzel', serif",
                fontSize: "12px",
                letterSpacing: "2px",
                textTransform: "uppercase",
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
              Edit Profile
            </button>

            {/* Change Password Button */}
            <button
              style={{
                background: COLORS.greenLight,
                border: `1px solid #2a4a2a`,
                color: COLORS.cream,
                borderRadius: "4px",
                padding: "14px",
                cursor: "pointer",
                transition: "border-color 0.2s, transform 0.15s",
                fontFamily: "'Cinzel', serif",
                fontSize: "12px",
                letterSpacing: "2px",
                textTransform: "uppercase",
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
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

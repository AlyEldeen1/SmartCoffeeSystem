import { useNavigate } from "react-router-dom";
import { LogOut, User, ShieldAlert } from "lucide-react";

const COLORS = {
  green: "#172c17",
  greenLight: "#1e3a1e",
  gold: "#c9a96e",
  goldDim: "#9a7a4e",
  cream: "#f0e6d3",
  white: "#f5f0ea",
};

export default function Navbar({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <nav
        className="flex justify-between items-center p-6 sticky top-0 z-50"
        style={{
          background: COLORS.green,
          borderBottom: `1px solid ${COLORS.greenLight}`,
        }}
      >
        {/* Left Side Links */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/menu")}
            style={{
              color: COLORS.gold,
              textDecoration: "none",
              fontFamily: "'Raleway', sans-serif",
              fontSize: "13px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = COLORS.cream)}
            onMouseLeave={(e) => (e.target.style.color = COLORS.gold)}
          >
            Menu
          </button>
        </div>

        {/* Center Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <svg width="28" height="28" viewBox="0 0 100 100">
            <ellipse cx="50" cy="50" rx="46" ry="46" fill="none" stroke={COLORS.gold} strokeWidth="2.5" />
            <line x1="36" y1="28" x2="36" y2="72" stroke={COLORS.gold} strokeWidth="4" strokeLinecap="round" />
            <line x1="36" y1="50" x2="64" y2="28" stroke={COLORS.gold} strokeWidth="4" strokeLinecap="round" />
            <line x1="36" y1="50" x2="64" y2="72" stroke={COLORS.gold} strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "16px",
              letterSpacing: "4px",
              color: COLORS.gold,
              fontWeight: 700,
            }}
          >
            KOFF
          </span>
        </div>

        {/* Right Side Links */}
        <div className="flex items-center gap-6">
          {role === "admin" && (
            <button
              onClick={() => navigate("/admin")}
              style={{
                color: COLORS.gold,
                textDecoration: "none",
                fontFamily: "'Raleway', sans-serif",
                fontSize: "13px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "color 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.cream)}
              onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.gold)}
            >
              <ShieldAlert size={14} />
              Admin
            </button>
          )}

          <button
            onClick={() => navigate("/profile")}
            style={{
              color: COLORS.gold,
              textDecoration: "none",
              fontFamily: "'Raleway', sans-serif",
              fontSize: "13px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = COLORS.cream)}
            onMouseLeave={(e) => (e.target.style.color = COLORS.gold)}
          >
            Profile
          </button>

          <button
            onClick={handleLogout}
            style={{
              color: COLORS.goldDim,
              textDecoration: "none",
              fontFamily: "'Raleway', sans-serif",
              fontSize: "13px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = COLORS.cream)}
            onMouseLeave={(e) => (e.target.style.color = COLORS.goldDim)}
          >
            Log Out
          </button>
        </div>
      </nav>
      <div style={{ borderBottom: `1px solid ${COLORS.goldDim}`, opacity: 0.15 }} />
    </>
  );
}

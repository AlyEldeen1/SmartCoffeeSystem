import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus, Users, Award, DollarSign, ListCollapse } from "lucide-react";
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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await API.get("/auth/profile");
        const u = response.data.user;
        if (u.role !== "admin") {
          // If not admin, redirect to customer dashboard
          navigate("/dashboard");
          return;
        }
        setUser(u);
      } catch (err) {
        console.error("Failed to load admin profile", err);
        localStorage.removeItem("token");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.green }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500&display=swap');`}</style>
        <Loader2 size={32} className="animate-spin" style={{ color: COLORS.gold }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: COLORS.green, color: COLORS.gold }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500&display=swap');`}</style>

      {/* Navigation */}
      <Navbar role={user?.role} />

      {/* Header */}
      <div className="px-10 py-8">
        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "28px",
            letterSpacing: "6px",
            color: COLORS.gold,
          }}
        >
          Admin Dashboard
        </h1>
      </div>

      <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`, margin: "0 2.5rem 1.5rem" }} />

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-10 mb-8">
        <div className="rounded-[4px] p-6 border" style={{ background: COLORS.greenLight, borderColor: "#2a4a2a" }}>
          <div className="text-[9px] tracking-[3px] uppercase mb-2" style={{ color: COLORS.goldDim }}>
            Today's Orders
          </div>
          <div className="text-3xl font-semibold mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
            47
          </div>
          <div className="text-[11px]" style={{ color: "#5a9a5a" }}>
            ↑ 12% vs yesterday
          </div>
        </div>

        <div className="rounded-[4px] p-6 border" style={{ background: COLORS.greenLight, borderColor: "#2a4a2a" }}>
          <div className="text-[9px] tracking-[3px] uppercase mb-2" style={{ color: COLORS.goldDim }}>
            Revenue
          </div>
          <div className="text-3xl font-semibold mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
            2,340
          </div>
          <div className="text-[11px]" style={{ color: COLORS.goldDim }}>
            EGP today
          </div>
        </div>

        <div className="rounded-[4px] p-6 border" style={{ background: COLORS.greenLight, borderColor: "#2a4a2a" }}>
          <div className="text-[9px] tracking-[3px] uppercase mb-2" style={{ color: COLORS.goldDim }}>
            Active Users
          </div>
          <div className="text-3xl font-semibold mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
            18
          </div>
          <div className="text-[11px]" style={{ color: COLORS.goldDim }}>
            Currently in app
          </div>
        </div>

        <div className="rounded-[4px] p-6 border" style={{ background: COLORS.greenLight, borderColor: "#2a4a2a" }}>
          <div className="text-[9px] tracking-[3px] uppercase mb-2" style={{ color: COLORS.goldDim }}>
            Top Item
          </div>
          <div className="text-xl font-semibold mb-1" style={{ fontFamily: "'Cinzel', serif", color: COLORS.cream }}>
            Cold Brew
          </div>
          <div className="text-[11px]" style={{ color: COLORS.goldDim }}>
            14 orders
          </div>
        </div>
      </div>

      {/* Admin Body splits */}
      <div className="flex flex-col md:flex-row gap-6 px-10 pb-16">
        {/* Live Orders Column */}
        <div className="flex-[1.6]">
          <div className="text-[12px] tracking-[4px] uppercase mb-4" style={{ fontFamily: "'Cinzel', serif", color: COLORS.goldDim }}>
            Live Orders
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center p-4 border rounded-[3px]" style={{ background: COLORS.greenLight, borderColor: "#2a4a2a" }}>
              <div>
                <div className="text-[11px]" style={{ color: COLORS.goldDim }}>#ORD-0047</div>
                <div className="text-[13px] font-semibold text-white" style={{ fontFamily: "'Cinzel', serif" }}>Ahmed — Flat White × 2</div>
              </div>
              <span className="text-[9px] tracking-[2px] uppercase px-[10px] py-[4px] rounded-[2px]" style={{ background: "#4a3a10", color: "#c9a030" }}>
                Pending
              </span>
            </div>

            <div className="flex justify-between items-center p-4 border rounded-[3px]" style={{ background: COLORS.greenLight, borderColor: "#2a4a2a" }}>
              <div>
                <div className="text-[11px]" style={{ color: COLORS.goldDim }}>#ORD-0046</div>
                <div className="text-[13px] font-semibold text-white" style={{ fontFamily: "'Cinzel', serif" }}>Sara — Cold Brew</div>
              </div>
              <span className="text-[9px] tracking-[2px] uppercase px-[10px] py-[4px] rounded-[2px]" style={{ background: "#1a2a4a", color: "#5a7ac9" }}>
                Making
              </span>
            </div>

            <div className="flex justify-between items-center p-4 border rounded-[3px]" style={{ background: COLORS.greenLight, borderColor: "#2a4a2a" }}>
              <div>
                <div className="text-[11px]" style={{ color: COLORS.goldDim }}>#ORD-0045</div>
                <div className="text-[13px] font-semibold text-white" style={{ fontFamily: "'Cinzel', serif" }}>Omar — Mocha + Matcha</div>
              </div>
              <span className="text-[9px] tracking-[2px] uppercase px-[10px] py-[4px] rounded-[2px]" style={{ background: "#0a3a1a", color: "#5a9a5a" }}>
                Ready
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions Column */}
        <div className="flex-1">
          <div className="text-[12px] tracking-[4px] uppercase mb-4" style={{ fontFamily: "'Cinzel', serif", color: COLORS.goldDim }}>
            Quick Actions
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate("/admin/menu")}
              className="w-full text-left p-4 border rounded-[3px] flex items-center gap-3 transition duration-200 cursor-pointer text-[12px] tracking-[2px] hover:border-gold font-semibold"
              style={{
                background: COLORS.greenLight,
                borderColor: "#2a4a2a",
                color: COLORS.gold,
                fontFamily: "'Raleway', sans-serif",
              }}
            >
              📋 Manage Menu (DB Page)
            </button>

            <button
              className="w-full text-left p-4 border rounded-[3px] flex items-center gap-3 transition duration-200 cursor-default text-[12px] tracking-[2px]"
              style={{
                background: COLORS.greenLight,
                borderColor: "#1a2a1a",
                color: COLORS.goldDim,
                opacity: 0.6,
                fontFamily: "'Raleway', sans-serif",
              }}
            >
              👥 Manage Users
            </button>

            <button
              className="w-full text-left p-4 border rounded-[3px] flex items-center gap-3 transition duration-200 cursor-default text-[12px] tracking-[2px]"
              style={{
                background: COLORS.greenLight,
                borderColor: "#1a2a1a",
                color: COLORS.goldDim,
                opacity: 0.6,
                fontFamily: "'Raleway', sans-serif",
              }}
            >
              🏷️ Add Promos
            </button>

            <button
              className="w-full text-left p-4 border rounded-[3px] flex items-center gap-3 transition duration-200 cursor-default text-[12px] tracking-[2px]"
              style={{
                background: COLORS.greenLight,
                borderColor: "#1a2a1a",
                color: COLORS.goldDim,
                opacity: 0.6,
                fontFamily: "'Raleway', sans-serif",
              }}
            >
              📊 Sales Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import API from "../services/api";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const COLORS = {
  green: "#172c17",
  greenLight: "#1e3a1e",
  gold: "#c9a96e",
  goldDim: "#9a7a4e",
  cream: "#f0e6d3",
  white: "#f5f0ea",
};

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const response = await API.post("/auth/login", data);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: COLORS.green }}
    >
      <style>{`
        @import url(‘https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500&display=swap’);
      `}</style>

      <div
        className="w-full max-w-sm flex flex-col items-center gap-7"
        style={{ maxWidth: "360px" }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <svg width="70" height="70" viewBox="0 0 100 100">
            <ellipse cx="50" cy="50" rx="46" ry="46" fill="none" stroke={COLORS.gold} strokeWidth="2.5" />
            <line x1="50" y1="4" x2="50" y2="96" stroke={COLORS.gold} strokeWidth="1.5" opacity="0.5" />
            <line x1="4" y1="50" x2="96" y2="50" stroke={COLORS.gold} strokeWidth="1.5" opacity="0.3" />
            <line x1="36" y1="28" x2="36" y2="72" stroke={COLORS.gold} strokeWidth="4" strokeLinecap="round" />
            <line x1="36" y1="50" x2="64" y2="28" stroke={COLORS.gold} strokeWidth="4" strokeLinecap="round" />
            <line x1="36" y1="50" x2="64" y2="72" stroke={COLORS.gold} strokeWidth="4" strokeLinecap="round" />
            <line x1="50" y1="50" x2="92" y2="30" stroke={COLORS.gold} strokeWidth="1" opacity="0.25" />
            <line x1="50" y1="50" x2="92" y2="70" stroke={COLORS.gold} strokeWidth="1" opacity="0.25" />
          </svg>
          <div
            style={{
              fontFamily: "’Cinzel’, serif",
              fontSize: "36px",
              letterSpacing: "12px",
              color: COLORS.gold,
              fontWeight: 700,
            }}
          >
            KOFF
          </div>
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "4px",
              color: COLORS.goldDim,
              textTransform: "uppercase",
            }}
          >
            Smart Coffee System
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
          }}
        />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full flex flex-col gap-3">
          {/* Error banner */}
          {serverError && (
            <Alert
              className="mb-2 border"
              style={{
                background: "#fff5f5",
                borderColor: "#fca5a5",
                borderRadius: "2px",
              }}
            >
              <AlertDescription style={{ color: "#dc2626", fontSize: "0.85rem" }}>
                {serverError}
              </AlertDescription>
            </Alert>
          )}

          {/* Email */}
          <Field label="Email" error={errors.email?.message}>
            <Input
              {...register("email")}
              type="email"
              placeholder="your@email.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              style={inputStyle(!!errors.email)}
            />
          </Field>

          {/* Password */}
          <Field label="Password" error={errors.password?.message}>
            <div className="relative">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                style={{ ...inputStyle(!!errors.password), paddingRight: "2.75rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: COLORS.goldDim, lineHeight: 0 }}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 font-semibold tracking-widest transition-all duration-200 active:scale-[0.98]"
            style={{
              background: isSubmitting ? COLORS.goldDim : COLORS.gold,
              color: COLORS.green,
              border: "none",
              borderRadius: "2px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              padding: "14px",
              fontFamily: "’Cinzel’, serif",
              fontSize: "12px",
              letterSpacing: "4px",
              textTransform: "uppercase",
            }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                Signing In
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div style={{ fontSize: "12px", color: COLORS.goldDim, textAlign: "center" }}>
          Don’t have an account?{" "}
          <Link
            to="/register"
            style={{
              color: COLORS.gold,
              cursor: "pointer",
              textDecoration: "none",
              fontWeight: 600,
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <Label
        style={{
          fontSize: "10px",
          fontWeight: 600,
          color: COLORS.goldDim,
          letterSpacing: "3px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Label>
      {children}
      {error && (
        <p style={{ color: "#fca5a5", fontSize: "0.75rem", marginTop: "2px" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function inputStyle(hasError) {
  return {
    height: "42px",
    borderRadius: "2px",
    border: `1px solid ${hasError ? "#fca5a5" : "#2a4a2a"}`,
    background: COLORS.greenLight,
    color: COLORS.cream,
    fontFamily: "’Raleway’, sans-serif",
    fontSize: "13px",
    padding: "12px 14px",
    transition: "border-color 0.2s",
    outline: "none",
  };
}
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(60, "Full name is too long"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .regex(/^[0-9+\s\-()]{7,15}$/, "Please enter a valid phone number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const COLORS = {
  green: "#172c17",
  greenLight: "#1e3a1e",
  gold: "#c9a96e",
  goldDim: "#9a7a4e",
  cream: "#f0e6d3",
  white: "#f5f0ea",
};

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone_number: data.phone,
          password: data.password,
          role: "customer",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.message || result.error || "Registration failed. Please try again.");
        return;
      }

      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch {
      setServerError("Unable to connect to server. Please check your connection.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: COLORS.green }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500&display=swap');
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
              fontFamily: "'Cinzel', serif",
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
          {/* Success banner */}
          {success && (
            <Alert
              className="mb-2 border"
              style={{
                background: "#f0faf4",
                borderColor: "#86efac",
                borderRadius: "2px",
              }}
            >
              <CheckCircle2 size={16} style={{ color: "#16a34a" }} />
              <AlertDescription style={{ color: "#15803d", fontWeight: 500, fontSize: "0.85rem" }}>
                Account created! Redirecting to login…
              </AlertDescription>
            </Alert>
          )}

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

          {/* Full Name */}
          <Field label="Full Name" error={errors.name?.message}>
            <Input
              {...register("name")}
              placeholder="Aly Hassan"
              autoComplete="name"
              aria-invalid={!!errors.name}
              style={inputStyle(!!errors.name)}
            />
          </Field>

          {/* Email */}
          <Field label="Email" error={errors.email?.message}>
            <Input
              {...register("email")}
              type="email"
              placeholder="aly@example.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              style={inputStyle(!!errors.email)}
            />
          </Field>

          {/* Phone */}
          <Field label="Phone Number" error={errors.phone?.message}>
            <Input
              {...register("phone")}
              type="tel"
              placeholder="01012345678"
              autoComplete="tel"
              aria-invalid={!!errors.phone}
              style={inputStyle(!!errors.phone)}
            />
          </Field>

          {/* Password */}
          <Field label="Password" error={errors.password?.message}>
            <div className="relative">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <Field label="Confirm Password" error={errors.confirmPassword?.message}>
            <div className="relative">
              <Input
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                style={{ ...inputStyle(!!errors.confirmPassword), paddingRight: "2.75rem" }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: COLORS.goldDim, lineHeight: 0 }}
                tabIndex={-1}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting || success}
            className="w-full mt-2 font-semibold tracking-widest transition-all duration-200 active:scale-[0.98]"
            style={{
              background: isSubmitting || success ? COLORS.goldDim : COLORS.gold,
              color: COLORS.green,
              border: "none",
              borderRadius: "2px",
              cursor: isSubmitting || success ? "not-allowed" : "pointer",
              padding: "14px",
              fontFamily: "'Cinzel', serif",
              fontSize: "12px",
              letterSpacing: "4px",
              textTransform: "uppercase",
            }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                Creating Account
              </span>
            ) : success ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 size={14} />
                Account Created!
              </span>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div style={{ fontSize: "12px", color: COLORS.goldDim, textAlign: "center" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: COLORS.gold,
              cursor: "pointer",
              textDecoration: "none",
              fontWeight: 600,
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            Sign In
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
    fontFamily: "'Raleway', sans-serif",
    fontSize: "13px",
    padding: "12px 14px",
    transition: "border-color 0.2s",
    outline: "none",
  };
}

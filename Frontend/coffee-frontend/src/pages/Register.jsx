import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Coffee, Loader2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// ─── Validation Schema ──────────────────────────────────────────────────────
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

// ─── Component ───────────────────────────────────────────────────────────────
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
    <div className="min-h-screen flex" style={{ background: "var(--mira-background, #faf8f5)" }}>

      {/* ── Left Panel: Coffee Branding ── */}
      <div
        className="hidden lg:flex lg:w-5/12 xl:w-2/5 flex-col justify-between p-10 relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #2c1a0e 0%, #4a2c17 60%, #6b3f22 100%)",
        }}
      >
        {/* Decorative circles */}
        <span
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #d4a96a 0%, transparent 70%)" }}
        />
        <span
          className="absolute bottom-20 -right-16 w-56 h-56 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #d4a96a 0%, transparent 70%)" }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(212,169,106,0.2)", border: "1px solid rgba(212,169,106,0.3)" }}
          >
            <Coffee size={20} color="#d4a96a" />
          </div>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#d4a96a", fontSize: "1.1rem", fontWeight: 600 }}>
            Smart Coffee
          </span>
        </div>

        {/* Centre copy */}
        <div className="relative z-10">
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "2.6rem", lineHeight: 1.2, color: "#f5ede0", fontWeight: 700 }}>
            Start your<br />coffee journey.
          </p>
          <p style={{ color: "rgba(245,237,224,0.55)", fontSize: "0.95rem", marginTop: "1rem", lineHeight: 1.7 }}>
            Join us to order, track, and enjoy your<br />favourite brews — every single day.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3 mt-8">
            {["Quick ordering, zero hassle", "Loyalty rewards on every cup", "Real-time order tracking"].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(212,169,106,0.2)", border: "1px solid rgba(212,169,106,0.3)" }}
                >
                  <CheckCircle2 size={11} color="#d4a96a" />
                </span>
                <span style={{ color: "rgba(245,237,224,0.7)", fontSize: "0.88rem" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p style={{ color: "rgba(245,237,224,0.3)", fontSize: "0.78rem" }} className="relative z-10">
          © {new Date().getFullYear()} Smart Coffee System
        </p>
      </div>

      {/* ── Right Panel: Form ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Coffee size={22} style={{ color: "#6b3f22" }} />
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#2c1a0e", fontWeight: 600 }}>
              Smart Coffee
            </span>
          </div>

          <Card
            className="border-0 shadow-none"
            style={{ background: "transparent" }}
          >
            <CardHeader className="px-0 pb-6">
              <CardTitle
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.9rem",
                  color: "#2c1a0e",
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                Create your account
              </CardTitle>
              <CardDescription style={{ color: "#8a7060", marginTop: "0.4rem", fontSize: "0.9rem" }}>
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{ color: "#6b3f22", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}
                >
                  Sign in
                </Link>
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">

              {/* Success banner */}
              {success && (
                <Alert
                  className="mb-5 border"
                  style={{ background: "#f0faf4", borderColor: "#86efac", borderRadius: "10px" }}
                >
                  <CheckCircle2 size={16} style={{ color: "#16a34a" }} />
                  <AlertDescription style={{ color: "#15803d", fontWeight: 500 }}>
                    Account created! Redirecting to login…
                  </AlertDescription>
                </Alert>
              )}

              {/* Error banner */}
              {serverError && (
                <Alert
                  className="mb-5 border"
                  style={{ background: "#fff5f5", borderColor: "#fca5a5", borderRadius: "10px" }}
                >
                  <AlertDescription style={{ color: "#dc2626" }}>{serverError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">

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
                <Field label="Email Address" error={errors.email?.message}>
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
                      placeholder="Min. 8 chars, 1 uppercase, 1 number"
                      autoComplete="new-password"
                      aria-invalid={!!errors.password}
                      style={{ ...inputStyle(!!errors.password), paddingRight: "2.75rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "#8a7060", lineHeight: 0 }}
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </Field>

                {/* Confirm Password */}
                <Field label="Confirm Password" error={errors.confirmPassword?.message}>
                  <div className="relative">
                    <Input
                      {...register("confirmPassword")}
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      aria-invalid={!!errors.confirmPassword}
                      style={{ ...inputStyle(!!errors.confirmPassword), paddingRight: "2.75rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "#8a7060", lineHeight: 0 }}
                      tabIndex={-1}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </Field>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting || success}
                  className="w-full mt-1 h-11 font-semibold text-sm tracking-wide transition-all duration-200 active:scale-[0.98]"
                  style={{
                    background: isSubmitting || success ? "#a0856a" : "linear-gradient(135deg, #4a2c17 0%, #6b3f22 100%)",
                    color: "#f5ede0",
                    border: "none",
                    borderRadius: "10px",
                    cursor: isSubmitting || success ? "not-allowed" : "pointer",
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Creating account…
                    </span>
                  ) : success ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      Account created!
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>

              </form>

              <p className="text-center mt-6" style={{ color: "#b0998a", fontSize: "0.75rem" }}>
                By registering, you agree to our{" "}
                <span style={{ color: "#6b3f22", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "2px" }}>
                  Terms of Service
                </span>{" "}
                and{" "}
                <span style={{ color: "#6b3f22", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "2px" }}>
                  Privacy Policy
                </span>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label
        style={{
          fontSize: "0.82rem",
          fontWeight: 600,
          color: "#4a2c17",
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </Label>
      {children}
      {error && (
        <p style={{ color: "#dc2626", fontSize: "0.78rem", marginTop: "1px" }}>{error}</p>
      )}
    </div>
  );
}

function inputStyle(hasError) {
  return {
    height: "2.65rem",
    borderRadius: "9px",
    border: `1.5px solid ${hasError ? "#fca5a5" : "#e8ddd4"}`,
    background: "#fff",
    fontSize: "0.9rem",
    color: "#2c1a0e",
    transition: "border-color 0.15s",
    outline: "none",
    boxShadow: hasError ? "0 0 0 3px rgba(220,38,38,0.08)" : "none",
  };
}

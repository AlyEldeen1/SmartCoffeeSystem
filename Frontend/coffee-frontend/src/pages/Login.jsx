import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Coffee, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import API from "../services/api";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

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
          <span style={{ fontFamily: "’Playfair Display’, Georgia, serif", color: "#d4a96a", fontSize: "1.1rem", fontWeight: 600 }}>
            Smart Coffee
          </span>
        </div>

        {/* Centre copy */}
        <div className="relative z-10">
          <p style={{ fontFamily: "’Playfair Display’, Georgia, serif", fontSize: "2.6rem", lineHeight: 1.2, color: "#f5ede0", fontWeight: 700 }}>
            Welcome back.
          </p>
          <p style={{ color: "rgba(245,237,224,0.55)", fontSize: "0.95rem", marginTop: "1rem", lineHeight: 1.7 }}>
            Sign in to your account and continue<br />enjoying your favourite brews.
          </p>
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
            <span style={{ fontFamily: "’Playfair Display’, Georgia, serif", color: "#2c1a0e", fontWeight: 600 }}>
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
                  fontFamily: "’Playfair Display’, Georgia, serif",
                  fontSize: "1.9rem",
                  color: "#2c1a0e",
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                Sign in
              </CardTitle>
              <CardDescription style={{ color: "#8a7060", marginTop: "0.4rem", fontSize: "0.9rem" }}>
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  style={{ color: "#6b3f22", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}
                >
                  Create one
                </Link>
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
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

                {/* Password */}
                <Field label="Password" error={errors.password?.message}>
                  <div className="relative">
                    <Input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
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

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-1 h-11 font-semibold text-sm tracking-wide transition-all duration-200 active:scale-[0.98]"
                  style={{
                    background: isSubmitting ? "#a0856a" : "linear-gradient(135deg, #4a2c17 0%, #6b3f22 100%)",
                    color: "#f5ede0",
                    border: "none",
                    borderRadius: "10px",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Signing in…
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

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
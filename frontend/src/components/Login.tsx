import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, X, User } from "lucide-react";

export default function Login({ onClose }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    otp: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // ========================= LOGIN =========================
  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      onClose();
      window.location.reload();

    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  // =================== SEND OTP (SIGNUP) ===================
  async function handleSendOtp(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "OTP error");

      setOtpSent(true);
      alert("OTP sent ✅");

    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  // =================== VERIFY OTP ===================
  async function handleVerifyOtp(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: form.email,
          otp: form.otp
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "OTP wrong");

      alert("Signup success ✅");
      onClose();
      window.location.reload();

    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-md rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl p-8">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X size={22} />
        </button>

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          {mode === "login" ? "Login" : "Signup"}
        </h2>

        {/* SWITCH BUTTON */}
        <p className="text-center text-sm mb-6 text-gray-400">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                className="text-blue-500 hover:underline"
                onClick={() => {
                  setMode("signup");
                  setOtpSent(false);
                }}
              >
                Signup
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-blue-500 hover:underline"
                onClick={() => {
                  setMode("login");
                  setOtpSent(false);
                }}
              >
                Login
              </button>
            </>
          )}
        </p>

        <form
          onSubmit={
            mode === "login"
              ? handleLogin
              : otpSent
              ? handleVerifyOtp
              : handleSendOtp
          }
        >
          {/* NAME (ONLY IN SIGNUP) */}
          {mode === "signup" && (
            <div className="mb-4 relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-2.5 rounded-lg"
                required
              />
            </div>
          )}

          {/* EMAIL */}
          <div className="mb-4 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-2.5 rounded-lg"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4 relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white pl-10 pr-10 py-2.5 rounded-lg"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* OTP */}
          {mode === "signup" && (
            <div className="mb-4">
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={form.otp}
                onChange={handleChange}
                disabled={!otpSent}
                className={`w-full px-4 py-2.5 rounded-lg ${
                  otpSent
                    ? "bg-gray-800 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
              />
            </div>
          )}

          {/* ERROR */}
          {error && (
            <p className="text-center text-red-500 text-sm mb-3">
              {error}
            </p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-2.5 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : otpSent
              ? "Verify OTP"
              : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

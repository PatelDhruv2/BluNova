import { useState } from "react";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    otp: ""
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // 1️⃣ SEND OTP
  async function handleSendOtp(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error sending OTP");
        setLoading(false);
        return;
      }

      alert("OTP sent to your email ✅");
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      alert("Server error while sending OTP");
    }

    setLoading(false);
  }

  // 2️⃣ VERIFY OTP
  async function handleVerifyOtp(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          email: form.email,
          otp: form.otp
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid OTP");
        setLoading(false);
        return;
      }

      alert("Signup complete ✅");
      window.location.href = "/";

    } catch (err) {
      console.error(err);
      alert("Server error while verifying OTP");
    }

    setLoading(false);
  }

  return (
    <div style={styles.container}>
      <form style={styles.form}>

        <h2 style={styles.heading}>Signup</h2>

        <input
          type="text"
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
          required
        />

        {!otpSent && (
          <button
            onClick={handleSendOtp}
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        )}

        {/* OTP Field (disabled until OTP sent) */}
        <input
          type="text"
          placeholder="Enter OTP"
          name="otp"
          value={form.otp}
          onChange={handleChange}
          style={{
            ...styles.input,
            background: !otpSent ? "#e5e5e5" : "#fff",
            cursor: !otpSent ? "not-allowed" : "text"
          }}
          disabled={!otpSent}
        />

        {otpSent && (
          <button
            onClick={handleVerifyOtp}
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        )}

      </form>
    </div>
  );
}

/* Simple styling */
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#111"
  },
  form: {
    width: "350px",
    padding: "25px",
    borderRadius: "10px",
    background: "#1c1c1c",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  heading: {
    color: "white",
    textAlign: "center"
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    outline: "none",
    fontSize: "15px"
  },
  button: {
    padding: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

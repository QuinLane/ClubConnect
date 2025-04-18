import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function RegisterPage() {
  const [ucid, setUcid] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5050/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: parseInt(ucid),
          username,
          email,
          password,
          userType: "Student",
          createdAt: new Date().toISOString(),
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Registration failed");
      }

      alert("Account created! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        padding: "1rem",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "white",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "2rem",
        }}
      >
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <img
          src={logo}
          alt="ClubConnect Logo"
          style={{
            width: "200px",
            objectFit: "contain",
            marginBottom: "1rem",
          }}
        />
        <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#1a1a1a", marginBottom: "0.5rem" }}>
          Create an Account
        </h2>
        <p style={{ color: "#6b7280" }}>Register to join ClubConnect</p>
      </div>


        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>UCID</label>
            <input
              type="number"
              value={ucid}
              onChange={(e) => setUcid(e.target.value)}
              placeholder="Enter your UCID"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={inputStyle}
            />
          </div>

          {error && (
            <div
              style={{
                padding: "0.75rem",
                backgroundColor: "#fef2f2",
                color: "#dc2626",
                fontSize: "0.875rem",
                borderRadius: "0.375rem",
                border: "1px solid #fecaca",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "0.375rem",
              backgroundColor: isLoading ? "#9ca3af" : "#4f46e5",
              color: "white",
              fontWeight: "500",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              marginTop: "0.5rem",
            }}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
          <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.875rem", color: "#374151" }}>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{
                color: "#4f46e5",
                cursor: "pointer",
                fontWeight: "500",
                textDecoration: "underline",
              }}
            >
              Log in
            </span>
          </p>

        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "0.875rem",
  fontWeight: "500",
  color: "#374151",
  marginBottom: "0.5rem",
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "0.375rem",
  border: "1px solid #d1d5db",
  outline: "none",
  transition: "all 0.2s",
  boxSizing: "border-box",
};

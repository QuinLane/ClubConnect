import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState(""); // Changed from UCID to email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5050/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // Changed from UCID to email
        credentials: "include", // For cookies if using them
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Login failed");
      }

      const { token, user } = await res.json();

      // Store the token in localStorage or context
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on user type
      if (user.userType === "SUAdmin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
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
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#1a1a1a",
              marginBottom: "0.5rem",
            }}
          >
            Welcome To ClubConnect
          </h2>
          <p style={{ color: "#6b7280" }}>Sign in to access your account</p>
        </div>

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.375rem",
                border: "1px solid #d1d5db",
                outline: "none",
                transition: "all 0.2s",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.375rem",
                border: "1px solid #d1d5db",
                outline: "none",
                transition: "all 0.2s",
                boxSizing: "border-box",
              }}
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
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

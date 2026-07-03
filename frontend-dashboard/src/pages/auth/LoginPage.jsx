import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logoImg from "../../assets/logo.png"; // Imported brand logo asset

// Free-tier backends spin down when idle and can take ~60-90s to wake on the first request
const WAKE_UP_HINT_DELAY_MS = 5000;

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWakeUpHint, setShowWakeUpHint] = useState(false);
  const wakeUpTimerRef = useRef(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    setShowWakeUpHint(false);

    wakeUpTimerRef.current = setTimeout(() => {
      setShowWakeUpHint(true);
    }, WAKE_UP_HINT_DELAY_MS);

    try {
      const loggedInUser = await login(formData.email, formData.password);

      if (loggedInUser.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/products");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      clearTimeout(wakeUpTimerRef.current);
      setIsSubmitting(false);
      setShowWakeUpHint(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="section-label">Authentication</p>
        
        {/* Flex container to hold Logo and Text horizontally */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
          <img src={logoImg} alt="RetailFlow Logo" style={{ height: "36px", width: "auto" }} />
          <h2 style={{ margin: 0, fontSize: "28px" }}>RetailFlow</h2>
        </div>
        
        <p className="section-text">Use admin in email for admin access.</p>

        {error && <p className="auth-error">{error}</p>}
        {showWakeUpHint && (
          <p className="section-text">
            Still working — the server was asleep and can take up to a minute to wake up on its first request.
          </p>
        )}

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="input"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required // Enforces browser input validation natively
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="input"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required // Enforces browser input validation natively
          />
        </div>

        <button type="submit" className="primary-btn" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
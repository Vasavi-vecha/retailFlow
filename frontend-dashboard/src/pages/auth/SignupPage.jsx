import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logoImg from "../../assets/logo.png";

function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function isPasswordStrong(password) {
    const minLength = 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return password.length >= minLength && hasLetter && hasNumber;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!isPasswordStrong(formData.password)) {
      setError("Password must be at least 8 characters long and contain both letters and numbers.");
      return;
    }

    try {
      // 1. Register the credentials inside the authentication system
      await signup(formData.name, formData.email, formData.password);
      
      // 2. Flash a success alert confirming account creation
      alert("Account created successfully! Please log in with your credentials.");
      
      // 3. Force redirect directly to the login page
      navigate("/login");
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="section-label">Authentication</p>
        
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
          <img src={logoImg} alt="RetailFlow Logo" style={{ height: "36px", width: "auto" }} />
          <h2 style={{ margin: 0, fontSize: "28px" }}>RetailFlow</h2>
        </div>
        
        <p className="section-text">Register as a customer user.</p>

        {error && <p className="auth-error">{error}</p>}

        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            className="input"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            className="input"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            name="password"
            type="password"
            className="input"
            placeholder="Min. 8 characters with letters & numbers"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="primary-btn">Signup</button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default SignupPage;
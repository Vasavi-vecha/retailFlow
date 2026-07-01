// src/pages/public/IndexPage.jsx
import { Link } from "react-router-dom";
import logoImg from "../../assets/logo.png";

function IndexPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f1f3f6", fontFamily: "sans-serif" }}>
      {/* 1. Header Navigation Bar */}
      <header style={{
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "16px 40px", 
        background: "#ffffff", 
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        borderBottom: "1px solid #dbdbdb"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={logoImg} alt="RetailFlow Logo" style={{ height: "36px", width: "auto" }} />
          <span style={{ fontSize: "24px", fontWeight: "bold", color: "#212121" }}>RetailFlow</span>
        </div>
        {/* Changed button actions to strictly use Login and Signup */}
        <div style={{ display: "flex", gap: "16px" }}>
          <Link to="/login" className="secondary-btn" style={{ padding: "8px 16px", fontSize: "14px" }}>Login</Link>
          <Link to="/signup" className="primary-btn" style={{ padding: "8px 16px", fontSize: "14px" }}>Signup</Link>
        </div>
      </header>

      {/* 2. Hero Branding Section */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
        <div style={{ padding: "40px", background: "#ffffff", borderRadius: "12px", border: "1px solid #e0e0e0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", marginBottom: "40px" }}>
          <img src={logoImg} alt="RetailFlow Dynamic Emblem" style={{ height: "100px", marginBottom: "20px" }} />
          <h1 style={{ fontSize: "48px", margin: "0 0 12px 0", color: "#212121", fontWeight: "700" }}>RetailFlow</h1>
          <p style={{ fontSize: "20px", color: "#2874f0", fontWeight: "600", margin: "0 0 16px 0" }}>
            Seamless Commerce. Smarter Operations.
          </p>
          <p style={{ maxWidth: "700px", margin: "0 auto 32px auto", color: "#666666", fontSize: "16px", lineHeight: "1.6" }}>
            An enterprise-grade, scalable microservices e-commerce ecosystem built with a high-performance Java Spring Boot backend, Docker isolation pipelines, and smart telemetry alerting grids.
          </p>
          
          {/* Main Call to Action Portals */}
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
            <Link to="/products" className="primary-btn" style={{ padding: "14px 32px", fontSize: "16px" }}>
              🛒 Enter Shopping Store
            </Link>
            <Link to="/admin/dashboard" className="secondary-btn" style={{ padding: "14px 32px", fontSize: "16px", border: "1px solid #2874f0", color: "#2874f0" }}>
              📊 Launch Operations Console
            </Link>
          </div>
        </div>

        {/* 3. System Microservices Architecture Specs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "24px", textAlign: "left" }}>
          <div style={{ background: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
            <h3 style={{ margin: "0 0 8px 0", color: "#212121", fontSize: "18px" }}>⚡ Decoupled Microservices</h3>
            <p style={{ margin: 0, color: "#666666", fontSize: "14px", lineHeight: "1.5" }}>
              Independent REST API modules tracking Authentication, Catalog Inventories, and Live Orders built using clean Java, Spring Boot, and isolated database pools.
            </p>
          </div>
          <div style={{ background: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
            <h3 style={{ margin: "0 0 8px 0", color: "#212121", fontSize: "18px" }}>🚀 Robust CI/CD Pipelines</h3>
            <p style={{ margin: 0, color: "#666666", fontSize: "14px", lineHeight: "1.5" }}>
              Automated GitHub Actions runners validating integration test structures, compiling code nodes, and deploying live production clusters inside secure Docker contexts.
            </p>
          </div>
          <div style={{ background: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
            <h3 style={{ margin: "0 0 8px 0", color: "#212121", fontSize: "18px" }}>🚨 Real-time Smart Monitoring</h3>
            <p style={{ margin: 0, color: "#666666", fontSize: "14px", lineHeight: "1.5" }}>
              Autonomous telemetry observers cross-checking API response latencies and incident error thresholds to generate instantly actionable production control dashboard metrics.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default IndexPage;
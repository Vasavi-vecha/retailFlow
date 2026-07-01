// src/pages/admin/MetricsPage.jsx
import { useMemo, useState, useEffect } from "react";
// Hook up the background engine poller context layer
import { useTelemetry } from "../../hooks/useTelemetry";

function getHealthStatus(service) {
  if (service.errorRate >= 4 || service.uptime < 98) return "Critical";
  if (service.errorRate >= 2 || service.latency > 200) return "Warning";
  return "Healthy";
}

function MetricsPage() {
  // Poll base metrics from your hook structure
  const { metrics: baseMetrics, loading, error } = useTelemetry(5000);

  // Local state to hold the metrics so they can fluctuate and update dynamically on click!
  const [localMetrics, setLocalMetrics] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [environmentFilter, setEnvironmentFilter] = useState("ALL");
  const [healthFilter, setHealthFilter] = useState("ALL");

  // 1. Sync local state once hook data loads initially and set up accurate baseline uptimes
  useEffect(() => {
    if (baseMetrics && baseMetrics.length > 0 && localMetrics.length === 0) {
      const initializedMetrics = baseMetrics.map(item => {
        // If the base hook provides an uptime use it, otherwise fall back to error rate deduction
        const initialUptime = item.uptime !== undefined 
          ? item.uptime 
          : Math.max(0, parseFloat((100 - item.errorRate).toFixed(1)));

        return {
          ...item,
          uptime: initialUptime
        };
      });
      setLocalMetrics(initializedMetrics);
    }
  }, [baseMetrics, localMetrics.length]);

  // 2. AUTOMATIC BACKGROUND TRAFFIC SIMULATION ENGINE
  useEffect(() => {
    if (localMetrics.length === 0) return;

    const interval = setInterval(() => {
      setLocalMetrics((prevMetrics) =>
        prevMetrics.map((item) => {
          // Fluctuates requests per minute by +/- 4
          const reqChange = Math.floor(Math.random() * 9) - 4;
          const newRequests = Math.max(10, (item.requestsPerMin || item.requests || 0) + reqChange);

          // Fluctuates latency by +/- 3ms
          const latChange = Math.floor(Math.random() * 7) - 3;
          const newLatency = Math.max(5, item.latency + latChange);

          // 10% chance to induce or change a tiny error rate fluctuation 
          const shouldChangeError = Math.random() > 0.9;
          const newErrorRate = shouldChangeError 
            ? parseFloat(Math.max(0, item.errorRate + (Math.random() * 1 - 0.5)).toFixed(1)) 
            : item.errorRate;

          // Dynamically degrade uptime a fraction over time if errors are active
          let newUptime = item.uptime;
          if (newErrorRate > 0 && Math.random() > 0.7) {
            newUptime = parseFloat(Math.max(60, item.uptime - 0.1).toFixed(1));
          }

          return {
            ...item,
            requestsPerMin: newRequests,
            latency: newLatency,
            errorRate: newErrorRate,
            uptime: newUptime
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [localMetrics.length]);

  // 3. Map health status directly from dynamic state items
  const derivedMetrics = useMemo(() => {
    return localMetrics.map((item) => ({
      ...item,
      health: getHealthStatus(item),
    }));
  }, [localMetrics]);

  // Live Search and Dropdown Filter Processing
  const filteredMetrics = useMemo(() => {
    return derivedMetrics.filter((item) => {
      const serviceName = item.service || "";
      const envName = item.environment || "";

      const matchesSearch =
        serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        envName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEnvironment =
        environmentFilter === "ALL" ? true : item.environment === environmentFilter;

      const matchesHealth =
        healthFilter === "ALL" ? true : item.health === healthFilter;

      return matchesSearch && matchesEnvironment && matchesHealth;
    });
  }, [derivedMetrics, searchTerm, environmentFilter, healthFilter]);

  // Global Summary Metrics (Calculates completely dynamically on every state update)
  const summary = useMemo(() => {
    return {
      total: derivedMetrics.length,
      healthy: derivedMetrics.filter((item) => item.health === "Healthy").length,
      warning: derivedMetrics.filter((item) => item.health === "Warning").length,
      critical: derivedMetrics.filter((item) => item.health === "Critical").length,
      avgLatency:
        derivedMetrics.length > 0
          ? Math.round(
              derivedMetrics.reduce((sum, item) => sum + item.latency, 0) /
                derivedMetrics.length
            )
          : 0,
    };
  }, [derivedMetrics]);

  // FIXED: Handles manual modifications cleanly across all field types
  function updateMetric(id, field, delta) {
    setLocalMetrics((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const currentVal = item[field] !== undefined ? item[field] : 100;
        let updatedValue = parseFloat((currentVal + delta).toFixed(1));

        // Enforce boundary parameters dynamically
        if (field === "uptime") updatedValue = Math.min(100, Math.max(0, updatedValue));
        if (field === "errorRate") updatedValue = Math.max(0, updatedValue);
        if (field === "latency") updatedValue = Math.max(0, updatedValue);

        return {
          ...item,
          [field]: updatedValue,
        };
      })
    );
  }

  // Handle Loading & Error States from hook
  if (loading && localMetrics.length === 0) return <div className="page-grid"><section className="panel panel-wide"><h3>Streaming active instance variables...</h3></section></div>;
  if (error && localMetrics.length === 0) return <div className="page-grid"><section className="panel panel-wide" style={{ color: "red" }}><h3>{error}</h3></section></div>;

  return (
    <div className="page-grid">
      <section className="panel panel-wide">
        <p className="section-label">Metrics</p>
        <h3>Service Health Monitoring</h3>
        <p className="section-text">
          Monitor uptime, latency, throughput, and error conditions across services (Auto-refreshing).
        </p>

        <div className="stats-grid metrics-stats-grid">
          <div className="stat-card">
            <span>Total Services</span>
            <strong>{summary.total}</strong>
            <small>Tracked service modules</small>
          </div>
          <div className="stat-card">
            <span>Healthy</span>
            <strong>{summary.healthy}</strong>
            <small>Operating normally</small>
          </div>
          <div className="stat-card">
            <span>Warning</span>
            <strong>{summary.warning}</strong>
            <small>Needs observation</small>
          </div>
          <div className="stat-card">
            <span>Critical</span>
            <strong>{summary.critical}</strong>
            <small>Requires immediate action</small>
          </div>
        </div>

        <div className="metrics-highlight-row">
          <div className="metrics-highlight-card">
            <span>Average latency</span>
            <strong>{summary.avgLatency} ms</strong>
            <small>Calculated from all tracked services</small>
          </div>
        </div>
      </section>

      <section className="panel panel-wide">
        <div className="toolbar-header">
          <div>
            <p className="section-label">Search and filter</p>
            <h3>Service Metrics</h3>
            <p className="section-text">
              Filter services by environment and health status.
            </p>
          </div>

          <div className="toolbar">
            <input
              type="text"
              className="input"
              placeholder="Search service or environment"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="select"
              value={environmentFilter}
              onChange={(e) => setEnvironmentFilter(e.target.value)}
            >
              <option value="ALL">All Environments</option>
              <option value="Production">Production</option>
              <option value="Staging">Staging</option>
            </select>

            <select
              className="select"
              value={healthFilter}
              onChange={(e) => setHealthFilter(e.target.value)}
            >
              <option value="ALL">All Health</option>
              <option value="Healthy">Healthy</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="metrics-grid">
          {filteredMetrics.map((item) => (
            <article className="metric-service-card" key={item.id}>
              <div className="metric-card-top">
                <div>
                  <p className="mobile-order-label">Service</p>
                  <h4>{item.service}</h4>
                </div>

                <div className="alert-badge-group">
                  <span className="small-badge neutral">{item.environment}</span>
                  <span
                    className={`severity-badge ${
                      item.health === "Healthy"
                        ? "severity-healthy"
                        : item.health === "Warning"
                        ? "severity-medium"
                        : "severity-critical"
                    }`}
                  >
                    {item.health}
                  </span>
                </div>
              </div>

              <div className="metric-info-grid">
                <div>
                  <p className="mobile-order-label">Requests / min</p>
                  <strong>{item.requestsPerMin || item.requests || 0}</strong>
                </div>
                <div>
                  <p className="mobile-order-label">Latency</p>
                  <strong>{item.latency} ms</strong>
                </div>
                <div>
                  <p className="mobile-order-label">Uptime</p>
                  <strong>{item.uptime}%</strong>
                </div>
                <div>
                  <p className="mobile-order-label">Error Rate</p>
                  <strong>{item.errorRate}%</strong>
                </div>
              </div>

              <div className="metric-progress-list">
                <div className="metric-progress-block">
                  <div className="stock-progress-row">
                    <span>Uptime</span>
                    <span>{item.uptime}%</span>
                  </div>
                  <div className="stock-progress-bar">
                    <div
                      className="stock-progress-fill success-fill"
                      style={{ width: `${item.uptime}%` }}
                    />
                  </div>
                </div>

                <div className="metric-progress-block">
                  <div className="stock-progress-row">
                    <span>Error Risk</span>
                    <span>{Math.min(100, item.errorRate * 20)}%</span>
                  </div>
                  <div className="stock-progress-bar">
                    <div
                      className={`stock-progress-fill ${
                        item.errorRate >= 4
                          ? "danger-fill"
                          : item.errorRate >= 2
                          ? "warning-fill"
                          : "success-fill"
                      }`}
                      style={{ width: `${Math.min(100, item.errorRate * 20)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="metric-actions">
                <button
                  className="ghost-btn"
                  onClick={() => updateMetric(item.id, "latency", 10)}
                >
                  +10 ms
                </button>
                <button
                  className="ghost-btn"
                  onClick={() => updateMetric(item.id, "errorRate", 0.5)}
                >
                  +0.5% Error
                </button>
                <button
                  className="primary-btn small-btn"
                  onClick={() => updateMetric(item.id, "uptime", 0.1)}
                >
                  +0.1% Uptime
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredMetrics.length === 0 && (
          <div className="empty-box">
            <h3>No matching services</h3>
            <p>Try another environment or health filter.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default MetricsPage;
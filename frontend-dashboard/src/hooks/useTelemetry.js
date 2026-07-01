// src/hooks/useTelemetry.js
import { useEffect, useState } from "react";
import { monitoringApi } from "../api/monitoringApi";

export function useTelemetry(pollingInterval = 5000) {
  const [metrics, setMetrics] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTelemetryData = async () => {
      try {
        const liveMetrics = await monitoringApi.getSystemMetrics();
        
        if (isMounted) {
          setMetrics(liveMetrics);
          setAlerts([]); 
          setError(null);
          setLoading(false);
        }
      } catch { // The try block closes right here cleanly
        if (isMounted) {
          setError("Failed to stream active simulation data parameters.");
          setLoading(false);
        }
      } // The catch block closes here
    }; // The async function wrapper closes here

    fetchTelemetryData();
    const liveTimer = setInterval(fetchTelemetryData, pollingInterval);

    return () => {
      isMounted = false;
      clearInterval(liveTimer);
    };
  }, [pollingInterval]);

  return { metrics, alerts, loading, error };
}
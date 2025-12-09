import { useState, useEffect } from 'react';
import { getAutomations } from '../services/mockApi';

export const useAutomations = () => {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAutomations = async () => {
      try {
        setLoading(true);
        const data = await getAutomations();
        setAutomations(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setAutomations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAutomations();
  }, []);

  return { automations, loading, error };
};
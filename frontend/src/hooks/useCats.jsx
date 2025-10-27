/**
 * useCats.jsx
 * ------------
 */

import { useState, useEffect } from 'react'; 
import { catAPI } from '../services/api';


export function useCats() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await catAPI.getAllCats();
      const sortedCats = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setCats(sortedCats);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching cats: ', err);
    } finally {
      setLoading(false);
    }
  };

  const addCat = async (formData) => {
    try {
      const newCat = await catAPI.addCat(formData);
      setCats(prev => [newCat, ...prev]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  return { cats, loading, error, addCat, refetch: fetchCats };
}
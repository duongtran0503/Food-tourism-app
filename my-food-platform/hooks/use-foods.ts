import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export const useFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFoods = async () => {
    try {
      const response = await api.get('/foods');
      setFoods(response.data);
    } catch (error) {
      console.error("Lỗi fetch foods:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFoods(); }, []);

  return { foods, loading, refresh: fetchFoods };
};
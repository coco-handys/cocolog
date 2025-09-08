import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL: string = (process.env.REACT_APP_API_URL as string) || 'http://localhost:8002/api';

export type AuthUser = {
  id: number;
  username: string;
  email?: string;
};

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const setAuthToken = (token: string | null) => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const checkAuthStatus = async (): Promise<void> => {
    try {
      const response = await axios.get<AuthUser>(`${API_BASE_URL}/auth/profile/`);
      setCurrentUser(response.data);
      setIsAuthenticated(true);
    } catch {
      setAuthToken(null);
      setIsAuthenticated(false);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      checkAuthStatus();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { 
    isAuthenticated, 
    setIsAuthenticated, 
    currentUser, 
    setCurrentUser, 
    loading, 
    setLoading,
    setAuthToken, 
    checkAuthStatus 
  };
}
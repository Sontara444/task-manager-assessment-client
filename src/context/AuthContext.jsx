import { createContext, useState, useContext, useEffect } from 'react';
import { fetchApi } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await fetchApi('/auth/me');
        if (data.success && data.data) {
          setUser(data.data);
        } else {
          setUser(null);
          localStorage.removeItem('token');
        }
      } catch (err) {
        setUser(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.success) {
      localStorage.setItem('token', data.token);
      setUser(data.data);
      return data.data;
    }
    throw new Error(data.error || 'Login failed');
  };

  const register = async (name, email, password) => {
    const data = await fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    if (data.success) {
      localStorage.setItem('token', data.token);
      setUser(data.data);
      return data.data;
    }
    throw new Error(data.error || 'Registration failed');
  };

  const logout = async () => {
    try {
      await fetchApi('/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

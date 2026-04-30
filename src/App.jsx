import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import Login from './pages/Login.jsx'
import Reports from './pages/Reports.jsx'
import { useDarkMode } from './hooks/useDarkMode.js'

export default function App() {
  const { isDark, toggle } = useDarkMode();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem("token");
    if (!t) return null;
    try {
      const decoded = jwtDecode(t);
      return decoded.exp * 1000 < Date.now() ? null : decoded;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          handleLogout();
          return;
        }
        setUser(decoded);
      } catch {
        handleLogout();
      }
    }
  }, [token]);

  function handleLogin(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  if (!token || !user) {
    return <Login onLogin={handleLogin} />;
  }

  return <Reports user={user} onLogout={handleLogout} isDark={isDark} onToggleDark={toggle} />;
}
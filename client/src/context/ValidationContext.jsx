import PropTypes from 'prop-types';
import React from 'react';

const AuthContext = React.createContext();

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context; // Devuelve directamente el contexto
};
const baseUrl = process.env.REACT_APP_BASEURL;

export const ValidationContext = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isBarber, setIsBarber] = React.useState(false);

  const checkToken = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/is-verify`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const dataResponse = await response.json();
      if (dataResponse === true) return setIsLoggedIn(true);
      setIsLoggedIn(false);
      setIsAdmin(false);
      setIsBarber(false);
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
    } catch (error) {
      alert(error);
    }
  };

  const checkAuth = React.useCallback(async () => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    if (token) {
      await checkToken();
      if (userType === 'barber') {
        setIsBarber(true);
      } else if (userType === 'admin') {
        setIsAdmin(true);
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setIsBarber(false);
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
    }
  }, []);

  React.useEffect(() => {
    checkAuth();
    const handleFocus = () => {
      checkToken(); // Comprobar si el token ha expirado mientras el usuario estaba ausente
    };
    window.addEventListener('focus', handleFocus);

    // Cleanup: Remover el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ checkAuth, isLoggedIn, isAdmin, isBarber }}>
      {children}
    </AuthContext.Provider>
  );
};

ValidationContext.propTypes = {
  children: PropTypes.node,
};

import Header from './Header';
import React, { useEffect} from 'react';
import useAuth from '@hooks/useAuth';

const Layout = ({ children }: { children: React.ReactElement }) => {
  const { loading ,isAuthenticated, setIsAuthenticated, currentUser: authUser, setCurrentUser: setAuthUser, setAuthToken, checkAuthStatus, setLoading } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    setAuthToken(null);
    setIsAuthenticated(false);
    setAuthUser(null);
  };

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        currentUser={authUser}
        onLogout={handleLogout}
      />
      <div className={'p-[20px]'}>
        {children}
      </div>
    </>
  )
}

export default Layout;
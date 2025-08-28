import useAuth from '@hooks/useAuth';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8002/api';

const Header = () => {
  const { isAuthenticated, currentUser } = useAuth();

  // 로그아웃
  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout/`);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setAuthToken(null);
      setIsAuthenticated(false);
      setCurrentUser(null);
      setPosts([]);
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="navbar">
        <div className="nav-brand">
          <h1>💻 CodeLog</h1>
          <p className="nav-subtitle">개발자의 생각을 담는 공간</p>
        </div>
        <div className="nav-auth">
          {isAuthenticated ? (
            <div className="user-info">
              <span>안녕하세요, <strong>{currentUser?.username}</strong>님!</span>
              <button className="btn btn-outline" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn btn-outline" onClick={() => setShowLoginForm(true)}>
                로그인
              </button>
              {/*<button className="btn btn-primary" onClick={() => setShowRegisterForm(true)}>*/}
              {/*  회원가입*/}
              {/*</button>*/}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
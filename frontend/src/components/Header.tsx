import React from 'react';
import { AuthUser } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

type HeaderProps = {
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  onLogout?: () => void;
};

const Header: React.FC<HeaderProps> = ({ isAuthenticated, currentUser, onLogout }) => {

  const router = useNavigate()

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h1>🚀 DevLog</h1>
      </div>
      <div className="nav-actions">
        {!isAuthenticated ? (
          <>
            <button 
              className="btn btn-primary"
              onClick={() => router('/login')}
            >
              로그인
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => router('/register')}
            >
              회원가입
            </button>
          </>
        ) : (
          <>
            <span className="user-info">
              안녕하세요, {currentUser?.username}님! 👋
            </span>
            <button 
              className="btn btn-success"
              onClick={() => router('/posts/create')}
            >
              ✍️ 새 글 작성
            </button>
            <button 
              className="btn btn-outline"
              onClick={onLogout}
            >
              로그아웃
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;

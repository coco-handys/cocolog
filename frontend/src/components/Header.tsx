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
    <nav>
      <div>
        <h1 className={'head01'}>SHIN EUN HYE</h1>
      </div>
      <div>
        {!isAuthenticated ? (
          <>
            <button 
              onClick={() => router('/login')}
            >
              로그인
            </button>
            <button 
              onClick={() => router('/register')}
            >
              회원가입
            </button>
          </>
        ) : (
          <>
            <span>
              안녕하세요, {currentUser?.username}님! 👋
            </span>
            <button 
              onClick={() => router('/posts/create')}
            >
              ✍️ 새 글 작성
            </button>
            <button 
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

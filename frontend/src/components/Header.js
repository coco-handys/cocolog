import React from 'react';

const Header = ({ isAuthenticated, currentUser, onLogin, onRegister, onLogout, onCreatePost }) => {
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
              onClick={onLogin}
            >
              로그인
            </button>
            <button 
              className="btn btn-secondary"
              onClick={onRegister}
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
              onClick={onCreatePost}
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

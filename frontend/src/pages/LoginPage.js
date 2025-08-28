import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';

const LoginPage = ({ onLogin, onSwitchToRegister }) => {
  const [authForm, setAuthForm] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onLogin(authForm);
  };

  return (
    <div className="login-page">
      <div className="auth-container">
        <h1>🔐 로그인</h1>
        <p className="subtitle">DevLog에 오신 것을 환영합니다</p>
        
        <AuthForm
          type="login"
          formData={authForm}
          onChange={setAuthForm}
          onSubmit={handleSubmit}
          onSwitchMode={onSwitchToRegister}
          switchText="계정이 없으신가요? 회원가입"
        />
      </div>
    </div>
  );
};

export default LoginPage;

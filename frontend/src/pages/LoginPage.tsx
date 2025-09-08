import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';

type LoginData = { username: string; password: string };

type LoginPageProps = {
  onLogin: (data: LoginData) => Promise<void> | void;
  onSwitchToRegister: () => void;
};

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToRegister }) => {
  const [authForm, setAuthForm] = useState<LoginData>({
    username: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
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
          onChange={setAuthForm as any}
          onSubmit={() => onLogin(authForm)}
          onSwitchMode={onSwitchToRegister}
          switchText="계정이 없으신가요? 회원가입"
        />
      </div>
    </div>
  );
};

export default LoginPage;

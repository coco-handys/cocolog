import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';

type RegisterData = { username: string; email: string; password: string; password_confirm: string };

type RegisterPageProps = {
  onRegister: (data: RegisterData) => Promise<void> | void;
  onSwitchToLogin: () => void;
};

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onSwitchToLogin }) => {
  const [authForm, setAuthForm] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    password_confirm: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onRegister(authForm);
  };

  return (
    <div className="register-page">
      <div className="auth-container">
        <h1>📝 회원가입</h1>
        <p className="subtitle">DevLog의 멤버가 되어보세요</p>
        
        <AuthForm
          type="register"
          formData={authForm}
          onChange={setAuthForm as any}
          onSubmit={() => onRegister(authForm)}
          onSwitchMode={onSwitchToLogin}
          switchText="이미 계정이 있으신가요? 로그인"
        />
      </div>
    </div>
  );
};

export default RegisterPage;

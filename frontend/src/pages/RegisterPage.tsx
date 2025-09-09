import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import AuthForm from '@components/AuthForm';
import useAuth, { AuthUser } from '@hooks/useAuth';
import { API_BASE_URL } from '@utils/config';

type RegisterData = { username: string; email: string; password: string; password_confirm: string };

const RegisterPage = () => {
  const { setIsAuthenticated, setCurrentUser: setAuthUser, setAuthToken } = useAuth();
  const router = useNavigate();

  const [authForm, setAuthForm] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    password_confirm: ''
  });

  const onRegister = async (formData: { username: string; email: string; password: string; password_confirm: string; }): Promise<void> => {
    try {
      await axios.post(`${API_BASE_URL}/auth/register/`, formData);
      await handleLogin({
        username: formData.username,
        password: formData.password
      });
    } catch (err: any) {
    }
  };

  const handleLogin = async (formData: { username: string; password: string; }): Promise<void> => {
      const response = await axios.post<{ token: string; user: AuthUser }>(`${API_BASE_URL}/auth/login/`, formData);
      setAuthToken(response.data.token);
      setAuthUser(response.data.user);
      setIsAuthenticated(true);
  };

  return (
    <div className="register-page">
      <div className="auth-container">
        <h1>📝 회원가입</h1>
        <p className="subtitle">DevLog의 멤버가 되어보세요</p>
        
        <AuthForm
          isLoginMode={false}
          formData={authForm}
          onChange={setAuthForm as any}
          onSubmit={() => onRegister(authForm)}
          switchText="이미 계정이 있으신가요? 로그인"
          onChangeMode={() => router('/login')}
        />
      </div>
    </div>
  );
};

export default RegisterPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthForm from '@components/AuthForm';
import axios from 'axios';
import { API_BASE_URL } from '@utils/config';
import useAuth from '@hooks/useAuth';

type LoginData = { username: string; password: string };

const LoginPage = () => {

  const { setAuthToken, setIsAuthenticated, setCurrentUser } = useAuth();
  const router = useNavigate();

  const [authForm, setAuthForm] = useState<LoginData>({
    username: '',
    password: ''
  });

  const onLogin = async (user: { username: string; password: string; }) => {
    try {
      const response = await axios.post<{ token: string; user: any }>(`${API_BASE_URL}/auth/login/`, user);
      setAuthToken(response.data.token);
      setCurrentUser(response.data.user);
      setIsAuthenticated(true);
      router('/');
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  }

  return (
    <div className="login-page">
      <div className="auth-container">
        <h1>🔐 로그인</h1>
        <p className="subtitle">DevLog에 오신 것을 환영합니다</p>
        
        <AuthForm
          formData={authForm}
          onChange={setAuthForm as any}
          onSubmit={onLogin}
          onChangeMode={() => router('/register')}
          switchText="계정이 없으신가요? 회원가입"
        />
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import useAuth from "./hooks/useAuth";

// 페이지 컴포넌트들
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePostPage from './pages/CreatePostPage';

// 공통 컴포넌트들
import Header from './components/Header';

// API 기본 URL 설정 (배포 환경에서는 환경변수 사용)
const API_BASE_URL = 'https://cocolog-production.up.railway.app/api';

function App() {
  const { isAuthenticated, setIsAuthenticated, currentUser: authUser, setCurrentUser: setAuthUser, setAuthToken, loading, checkAuthStatus, setLoading } = useAuth()

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  
  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState('home');
  
  // 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  // 회원가입
  const handleRegister = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register/`, formData);
      
      // 회원가입 성공 후 자동 로그인
      await handleLogin({
        username: formData.username,
        password: formData.password
      });
      setCurrentPage('home');
    } catch (err) {
      setError('회원가입에 실패했습니다: ' + (err.response?.data?.username?.[0] || err.response?.data?.email?.[0] || '알 수 없는 오류'));
    }
  };

  // 로그인
  const handleLogin = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login/`, formData);
      
      setAuthToken(response.data.token);
      setAuthUser(response.data.user);
      setIsAuthenticated(true);
      setCurrentPage('home');
      setError(null);
      
      // 로그인 후 글 목록 새로고침
      fetchPosts();
    } catch (err) {
      setError('로그인에 실패했습니다: ' + (err.response?.data?.non_field_errors?.[0] || '알 수 없는 오류'));
    }
  };

  // 로그아웃
  const handleLogout = () => {
    setAuthToken(null);
    setIsAuthenticated(false);
    setAuthUser(null);
    setPosts([]);
    setCurrentPage('home');
  };

  // 글 목록 불러오기
  const fetchPosts = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/posts/`);
      setPosts(response.data);
      setError(null);
    } catch (err) {
      setError('글 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // 새 글 작성
  const handleCreatePost = async (postData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/posts/`, postData);
      setPosts([...posts, response.data]);
      setError(null);
      setCurrentPage('home');
    } catch (err) {
      setError('글 작성에 실패했습니다.');
      console.error('Error creating post:', err);
    }
  };

  // 글 수정
  const handleEditPost = async (postId, postData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/posts/${postId}/`, postData);
      setPosts(posts.map(post => post.id === postId ? response.data : post));
      setError(null);
    } catch (err) {
      setError('글 수정에 실패했습니다.');
      console.error('Error updating post:', err);
    }
  };

  // 글 삭제
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${API_BASE_URL}/posts/${postId}/`);
      setPosts(posts.filter(post => post.id !== postId));
      setError(null);
    } catch (err) {
      setError('글 삭제에 실패했습니다.');
      console.error('Error deleting post:', err);
    }
  };

  // 권한 확인 함수
  const canEditPost = (post) => {
    return isAuthenticated && authUser && post.author === authUser.id;
  };

  // 페이지 렌더링
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginPage
            onLogin={handleLogin}
            onSwitchToRegister={() => setCurrentPage('register')}
          />
        );
      case 'register':
        return (
          <RegisterPage
            onRegister={handleRegister}
            onSwitchToLogin={() => setCurrentPage('login')}
          />
        );
      case 'create':
        return (
          <CreatePostPage
            onSubmit={handleCreatePost}
            onCancel={() => setCurrentPage('home')}
          />
        );
      default:
        return (
          <HomePage
            posts={posts}
            loading={loading}
            error={error}
            isAuthenticated={isAuthenticated}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
            canEditPost={canEditPost}
          />
        );
    }
  };

  if (loading) return <div className="loading">로딩 중...</div>;

  return (
    <div className="App">
      <Header
        isAuthenticated={isAuthenticated}
        currentUser={authUser}
        onLogin={() => setCurrentPage('login')}
        onRegister={() => setCurrentPage('register')}
        onLogout={handleLogout}
        onCreatePost={() => setCurrentPage('create')}
      />
      
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;

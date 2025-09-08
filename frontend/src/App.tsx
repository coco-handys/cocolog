import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import useAuth, { AuthUser } from './hooks/useAuth';

// 페이지 컴포넌트들
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePostPage from './pages/CreatePostPage';

// 공통 컴포넌트들
import Header from './components/Header';

// API 기본 URL 설정 (배포 환경에서는 환경변수 사용)
const API_BASE_URL: string = (process.env.REACT_APP_API_URL as string) || 'http://localhost:8002/api';

export type Post = {
  id: number;
  title: string;
  content: string;
  author: number;
  author_username?: string;
  created_at: string;
};

type CurrentPage = 'home' | 'login' | 'register' | 'create';

function App(): React.ReactElement {
  const { isAuthenticated, setIsAuthenticated, currentUser: authUser, setCurrentUser: setAuthUser, setAuthToken, loading, checkAuthStatus, setLoading } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState<CurrentPage>('home');
  
  // 로그인 상태 확인 (초기 로드) + 공개 글 로드
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      checkAuthStatus();
    } else {
      setLoading(false);
    }
    // 공개 글은 로그인 여부와 상관 없이 로드
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 회원가입
  const handleRegister = async (formData: { username: string; email: string; password: string; password_confirm: string; }): Promise<void> => {
    try {
      await axios.post(`${API_BASE_URL}/auth/register/`, formData);
      // 회원가입 성공 후 자동 로그인
      await handleLogin({
        username: formData.username,
        password: formData.password
      });
      setCurrentPage('home');
    } catch (err: any) {
      setError('회원가입에 실패했습니다: ' + (err.response?.data?.username?.[0] || err.response?.data?.email?.[0] || '알 수 없는 오류'));
    }
  };

  // 로그인
  const handleLogin = async (formData: { username: string; password: string; }): Promise<void> => {
    try {
      const response = await axios.post<{ token: string; user: AuthUser }>(`${API_BASE_URL}/auth/login/`, formData);
      setAuthToken(response.data.token);
      setAuthUser(response.data.user);
      setIsAuthenticated(true);
      setCurrentPage('home');
      setError(null);
      // 로그인 후 글 목록 새로고침 (본인 글 포함 최신화)
      fetchPosts();
    } catch (err: any) {
      setError('로그인에 실패했습니다: ' + (err.response?.data?.non_field_errors?.[0] || '알 수 없는 오류'));
    }
  };

  // 로그아웃
  const handleLogout = (): void => {
    setAuthToken(null);
    setIsAuthenticated(false);
    setAuthUser(null);
    setPosts([]);
    setCurrentPage('home');
    // 공개 글 다시 로드
    fetchPosts();
  };

  // 글 목록 불러오기 (공개 글 기준)
  const fetchPosts = async (): Promise<void> => {
    try {
      const response = await axios.get<Post[]>(`${API_BASE_URL}/posts/`);
      setPosts(response.data);
      setError(null);
    } catch (err) {
      setError('글 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching posts:', err);
    }
  };

  // 새 글 작성
  const handleCreatePost = async (postData: { title: string; content: string; }): Promise<void> => {
    try {
      const response = await axios.post<Post>(`${API_BASE_URL}/posts/`, postData);
      setPosts([...posts, response.data]);
      setError(null);
      setCurrentPage('home');
    } catch (err) {
      setError('글 작성에 실패했습니다.');
      console.error('Error creating post:', err);
    }
  };

  // 글 수정
  const handleEditPost = async (postId: number, postData: { title: string; content: string; }): Promise<void> => {
    try {
      const response = await axios.put<Post>(`${API_BASE_URL}/posts/${postId}/`, postData);
      setPosts(posts.map(post => post.id === postId ? response.data : post));
      setError(null);
    } catch (err) {
      setError('글 수정에 실패했습니다.');
      console.error('Error updating post:', err);
    }
  };

  // 글 삭제
  const handleDeletePost = async (postId: number): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/posts/${postId}/`);
      setPosts(posts.filter(post => post.id !== postId));
      setError(null);
    } catch (err) {
      setError('글 삭제에 실패했습니다.');
      console.error('Error deleting post:', err);
    }
  };

  // 권한 확인 함수 (레거시 글에서 author id 없을 때 author_username로도 확인)
  const canEditPost = (post: Post): boolean => {
    if (!isAuthenticated || !authUser) return false;
    if (post.author && post.author === authUser.id) return true;
    if (post.author_username && post.author_username === authUser.username) return true;
    return false;
  };

  // 페이지 렌더링
  const renderPage = (): React.ReactElement => {
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

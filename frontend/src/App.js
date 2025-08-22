import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// API 기본 URL 설정 (배포 환경에서는 환경변수 사용)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  
  // 인증 관련 상태
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: ''
  });

  // 인증 토큰 설정
  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

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

  // 인증 상태 확인
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/profile/`);
      setCurrentUser(response.data);
      setIsAuthenticated(true);
    } catch (err) {
      setAuthToken(null);
      setIsAuthenticated(false);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 회원가입
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register/`, {
        username: authForm.username,
        email: authForm.email,
        password: authForm.password,
        password_confirm: authForm.password_confirm
      });
      
      // 회원가입 성공 후 자동 로그인
      await handleLogin(e);
      setShowRegisterForm(false);
      setAuthForm({ username: '', email: '', password: '', password_confirm: '' });
    } catch (err) {
      setError('회원가입에 실패했습니다: ' + (err.response?.data?.username?.[0] || err.response?.data?.email?.[0] || '알 수 없는 오류'));
    }
  };

  // 로그인
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
        username: authForm.username,
        password: authForm.password
      });
      
      setAuthToken(response.data.token);
      setCurrentUser(response.data.user);
      setIsAuthenticated(true);
      setShowLoginForm(false);
      setAuthForm({ username: '', email: '', password: '', password_confirm: '' });
      setError(null);
      
      // 로그인 후 글 목록 새로고침
      fetchPosts();
    } catch (err) {
      setError('로그인에 실패했습니다: ' + (err.response?.data?.non_field_errors?.[0] || '알 수 없는 오류'));
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout/`);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setAuthToken(null);
      setIsAuthenticated(false);
      setCurrentUser(null);
      setPosts([]);
    }
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
  const createPost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/posts/`, newPost);
      setPosts([...posts, response.data]);
      setNewPost({ title: '', content: '' });
      setError(null);
    } catch (err) {
      setError('글 작성에 실패했습니다.');
      console.error('Error creating post:', err);
    }
  };

  // 글 수정 시작
  const startEdit = (post) => {
    setEditingPost(post.id);
    setEditForm({ title: post.title, content: post.content });
  };

  // 글 수정 취소
  const cancelEdit = () => {
    setEditingPost(null);
    setEditForm({ title: '', content: '' });
  };

  // 글 수정 완료
  const updatePost = async (postId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/posts/${postId}/`, editForm);
      setPosts(posts.map(post => post.id === postId ? response.data : post));
      setEditingPost(null);
      setEditForm({ title: '', content: '' });
      setError(null);
    } catch (err) {
      setError('글 수정에 실패했습니다.');
      console.error('Error updating post:', err);
    }
  };

  // 글 삭제
  const deletePost = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/posts/${id}/`);
      setPosts(posts.filter(post => post.id !== id));
      setError(null);
    } catch (err) {
      setError('글 삭제에 실패했습니다.');
      console.error('Error deleting post:', err);
    }
  };

  // 권한 확인 함수
  const canEditPost = (post) => {
    return isAuthenticated && currentUser && post.author === currentUser.id;
  };

  if (loading) return <div className="loading">로딩 중...</div>;

  return (
    <div className="App">
      {/* 상단 네비게이션 바 */}
      <nav className="navbar">
        <div className="nav-brand">
          <h1>💻 CodeLog</h1>
          <p className="nav-subtitle">개발자의 생각을 담는 공간</p>
        </div>
        <div className="nav-auth">
          {isAuthenticated ? (
            <div className="user-info">
              <span>안녕하세요, <strong>{currentUser?.username}</strong>님!</span>
              <button className="btn btn-outline" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn btn-outline" onClick={() => setShowLoginForm(true)}>
                로그인
              </button>
              <button className="btn btn-primary" onClick={() => setShowRegisterForm(true)}>
                회원가입
              </button>
            </div>
          )}
        </div>
      </nav>

      {error && <div className="error-message">{error}</div>}

      {/* 로그인 폼 */}
      {showLoginForm && (
        <div className="form-container">
          <h2>로그인</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>사용자명</label>
              <input
                type="text"
                value={authForm.username}
                onChange={(e) => setAuthForm({...authForm, username: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>비밀번호</label>
              <input
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">로그인</button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowLoginForm(false)}>
              취소
            </button>
          </form>
        </div>
      )}

      {/* 회원가입 폼 */}
      {showRegisterForm && (
        <div className="form-container">
          <h2>회원가입</h2>
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>사용자명</label>
              <input
                type="text"
                value={authForm.username}
                onChange={(e) => setAuthForm({...authForm, username: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>이메일</label>
              <input
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>비밀번호</label>
              <input
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>비밀번호 확인</label>
              <input
                type="password"
                value={authForm.password_confirm}
                onChange={(e) => setAuthForm({...authForm, password_confirm: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn btn-success">회원가입</button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowRegisterForm(false)}>
              취소
            </button>
          </form>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <main className="main-content">
        {/* 새 글 작성 폼 (로그인한 사용자만) */}
        {isAuthenticated && (
          <div className="form-container">
            <h2>새 글 작성</h2>
            <form onSubmit={createPost}>
              <div className="form-group">
                <label>제목</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>내용</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">글 작성</button>
            </form>
          </div>
        )}

        {/* 글 목록 */}
        <div className="posts-container">
          <h2>📝 최근 글</h2>
          {!isAuthenticated ? (
            <div className="empty-state">
              <p>글을 보려면 로그인이 필요합니다.</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <p>아직 작성된 글이 없습니다. 첫 번째 글을 작성해보세요! 🚀</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className={`post-card ${editingPost === post.id ? 'edit-mode' : ''}`}>
                {editingPost === post.id ? (
                  // 수정 모드
                  <div>
                    <div className="form-group">
                      <label>제목</label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>내용</label>
                      <textarea
                        value={editForm.content}
                        onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                        required
                      />
                    </div>
                    <div className="post-actions">
                      <button onClick={() => updatePost(post.id)} className="btn btn-success">
                        수정 완료
                      </button>
                      <button onClick={cancelEdit} className="btn btn-secondary">
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  // 일반 모드
                  <div>
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <div className="post-meta">
                      작성자: {post.author_username || '알 수 없음'} | 작성일: {new Date(post.created_at).toLocaleString()}
                    </div>
                    <div className="post-actions">
                      {canEditPost(post) && (
                        <button 
                          onClick={() => startEdit(post)}
                          className="btn btn-info"
                        >
                          ✏️ 수정
                        </button>
                      )}
                      {canEditPost(post) && (
                        <button 
                          onClick={() => deletePost(post.id)}
                          className="btn btn-danger"
                        >
                          🗑️ 삭제
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

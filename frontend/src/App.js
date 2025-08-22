import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });

  const API_BASE_URL = 'http://localhost:8001/api';

  // 글 목록 불러오기
  const fetchPosts = async () => {
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

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <div className="App">로딩 중...</div>;

  return (
    <div className="App">
      <h1>블로그</h1>
      
      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

      {/* 새 글 작성 폼 */}
      <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc' }}>
        <h2>새 글 작성</h2>
        <form onSubmit={createPost}>
          <div>
            <label>제목: </label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              required
            />
          </div>
          <div>
            <label>내용: </label>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              required
            />
          </div>
          <button type="submit">글 작성</button>
        </form>
      </div>

      {/* 글 목록 */}
      <div>
        <h2>글 목록</h2>
        {posts.length === 0 ? (
          <p>작성된 글이 없습니다.</p>
        ) : (
          posts.map(post => (
            <div key={post.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ddd' }}>
              {editingPost === post.id ? (
                // 수정 모드
                <div>
                  <div>
                    <label>제목: </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label>내용: </label>
                    <textarea
                      value={editForm.content}
                      onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                      required
                    />
                  </div>
                  <button onClick={() => updatePost(post.id)} style={{ backgroundColor: 'green', color: 'white', marginRight: '5px' }}>
                    수정 완료
                  </button>
                  <button onClick={cancelEdit} style={{ backgroundColor: 'gray', color: 'white' }}>
                    취소
                  </button>
                </div>
              ) : (
                // 일반 모드
                <div>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <small>작성일: {new Date(post.created_at).toLocaleString()}</small>
                  <div style={{ marginTop: '10px' }}>
                    <button 
                      onClick={() => startEdit(post)}
                      style={{ backgroundColor: 'blue', color: 'white', marginRight: '5px' }}
                    >
                      수정
                    </button>
                    <button 
                      onClick={() => deletePost(post.id)}
                      style={{ backgroundColor: 'red', color: 'white' }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;

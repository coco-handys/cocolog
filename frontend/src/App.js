import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  const API_BASE_URL = 'http://localhost:8000/api';

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
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <small>작성일: {new Date(post.created_at).toLocaleString()}</small>
              <button 
                onClick={() => deletePost(post.id)}
                style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
              >
                삭제
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;

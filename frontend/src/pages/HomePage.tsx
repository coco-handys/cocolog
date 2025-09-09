import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { API_BASE_URL } from '@utils/config';
import { AuthUser } from '@hooks/useAuth';
import PostCard from '@components/PostCard';
import type { Post } from 'types/post';

type HomePageProps = {
  isAuthenticated: boolean;
  authUser: AuthUser | null;
};

const HomePage: React.FC<HomePageProps> = ({ isAuthenticated, authUser }) => {

  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const response = await axios.get<Post[]>(`${API_BASE_URL}/posts/`);
      setPosts(response.data);
      setError(null);
    } catch (err) {
      setError('글 목록을 불러오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    (async () => await fetchPosts())()
  }, []);

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

  const canEditPost = (post: Post): boolean => {
    if (!isAuthenticated || !authUser) return false;
    if (post.author && post.author === authUser.id) return true;
    if (post.author_username && post.author_username === authUser.username) return true;
    return false;
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

  return (
    <div className="home-page">

      
      {error && <div className="error-message">{error}</div>}
      
      <div className="posts-container">
        <h2>📝 최근 글</h2>
        {posts.length === 0 ? (
          <div className="empty-state">
            <p>아직 작성된 글이 없습니다. 첫 번째 글을 작성해보세요! 🚀</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
                canEdit={canEditPost(post)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

import React from 'react';
import PostCard from '../components/PostCard';

const HomePage = ({ posts, loading, error, isAuthenticated, onEdit, onDelete, canEditPost }) => {
  if (loading) return <div className="loading">로딩 중...</div>;

  return (
    <div className="home-page">
      <h1>🚀 DevLog</h1>
      <p className="subtitle">개발자들의 이야기를 나누는 공간</p>
      
      {error && <div className="error-message">{error}</div>}
      
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
          <div className="posts-grid">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={onEdit}
                onDelete={onDelete}
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

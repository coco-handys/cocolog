import React, { useState } from 'react';
import PostForm from './PostForm';

const PostCard = ({ post, onEdit, onDelete, canEdit }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (formData) => {
    await onEdit(post.id, formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="post-card edit-mode">
        <PostForm
          formData={{ title: post.title, content: post.content }}
          onChange={() => {}}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitText="수정 완료"
          cancelText="취소"
        />
      </div>
    );
  }

  return (
    <div className="post-card">
      <div className="post-header">
        <h3>{post.title}</h3>
        <div className="post-meta">
          <span>작성자: {post.author_username || '알 수 없음'}</span>
          <span>작성일: {new Date(post.created_at).toLocaleString()}</span>
        </div>
      </div>
      
      <div className="post-content">
        <p>{post.content}</p>
      </div>
      
      {canEdit && (
        <div className="post-actions">
          <button 
            onClick={handleEdit}
            className="btn btn-info"
          >
            ✏️ 수정
          </button>
          <button 
            onClick={() => onDelete(post.id)}
            className="btn btn-danger"
          >
            🗑️ 삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard;

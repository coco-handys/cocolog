import React, { useState } from 'react';
import PostForm from './PostForm';
import type { Post } from 'types/post';

type PostCardProps = {
  post: Post;
  onEdit: (postId: number, data: { title: string; content: string }) => Promise<void> | void;
  onDelete: (postId: number) => Promise<void> | void;
  canEdit: boolean;
};

const PostCard: React.FC<PostCardProps> = ({ post, onEdit, onDelete, canEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (formData: { title: string; content: string }) => {
    await onEdit(post.id, formData);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    const confirmed = window.confirm('정말 이 글을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.');
    if (!confirmed) return;
    try {
      setIsDeleting(true);
      await onDelete(post.id);
    } finally {
      setIsDeleting(false);
    }
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
            onClick={handleDelete}
            className="btn btn-danger"
            disabled={isDeleting}
          >
            {isDeleting ? '삭제 중...' : '🗑️ 삭제'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard;

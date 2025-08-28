import React, { useState } from 'react';
import PostForm from '../components/PostForm';

const CreatePostPage = ({ onSubmit, onCancel }) => {
  const [postData, setPostData] = useState({
    title: '',
    content: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(postData);
    setPostData({ title: '', content: '' });
  };

  return (
    <div className="create-post-page">
      <div className="form-container">
        <h1>✍️ 새 글 작성</h1>
        <p className="subtitle">새로운 이야기를 공유해보세요</p>
        
        <PostForm
          formData={postData}
          onChange={setPostData}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          submitText="글 작성"
          cancelText="취소"
        />
      </div>
    </div>
  );
};

export default CreatePostPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import PostForm from '@components/PostForm';
import { API_BASE_URL } from '@utils/config';
import type { Post } from 'types/post';

const CreatePostPage = () => {
  const router = useNavigate();
  const [postData, setPostData] = useState({
    title: '',
    content: ''
  });

  // 새 글 작성
  const handleCreatePost = async (postData: { title: string; content: string; }): Promise<void> => {
    setPostData({ title: '', content: '' });
    await axios.post<Post>(`${API_BASE_URL}/posts/`, postData);
  };

  return (
    <div className="create-post-page">
      <div className="form-container">
        <h1>✍️ 새 글 작성</h1>
        <p className="subtitle">새로운 이야기를 공유해보세요</p>
        <PostForm
          formData={postData}
          onChange={setPostData}
          onSubmit={handleCreatePost}
          onCancel={() => router(-1)}
          submitText="글 작성"
          cancelText="취소"
        />
      </div>
    </div>
  );
};

export default CreatePostPage;

import React from 'react';

const PostForm = ({ formData, onChange, onSubmit, onCancel, submitText, cancelText }) => {
  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <div className="form-group">
        <label htmlFor="title">제목</label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
          placeholder="글 제목을 입력하세요"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="content">내용</label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          required
          placeholder="글 내용을 입력하세요"
          rows="6"
        />
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {submitText}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          {cancelText}
        </button>
      </div>
    </form>
  );
};

export default PostForm;

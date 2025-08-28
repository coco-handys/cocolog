import React from 'react';

const AuthForm = ({ type, formData, onChange, onSubmit, onSwitchMode, switchText }) => {
  const isLogin = type === 'login';

  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label htmlFor="username">사용자명</label>
        <input
          id="username"
          type="text"
          value={formData.username}
          onChange={(e) => handleChange('username', e.target.value)}
          required
          placeholder="사용자명을 입력하세요"
        />
      </div>
      
      {!isLogin && (
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            placeholder="이메일을 입력하세요"
          />
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          required
          placeholder="비밀번호를 입력하세요"
        />
      </div>
      
      {!isLogin && (
        <div className="form-group">
          <label htmlFor="password_confirm">비밀번호 확인</label>
          <input
            id="password_confirm"
            type="password"
            value={formData.password_confirm}
            onChange={(e) => handleChange('password_confirm', e.target.value)}
            required
            placeholder="비밀번호를 다시 입력하세요"
          />
        </div>
      )}
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isLogin ? '로그인' : '회원가입'}
        </button>
        <button type="button" className="btn btn-link" onClick={onSwitchMode}>
          {switchText}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;

import React from 'react';

type LoginData = { username: string; password: string };
type RegisterData = LoginData & { email: string; password_confirm: string };

type AuthFormProps = {
  isLoginMode?: boolean;
  formData: LoginData | RegisterData;
  onChange: (data: any) => void;
  onSubmit: (data: any) => void | Promise<void>;
  switchText: string;
  onChangeMode: () => void;
};

const AuthForm: React.FC<AuthFormProps> = ({ isLoginMode = true, formData, onChange, onSubmit, switchText, onChangeMode }) => {

  const handleChange = (field: string, value: string) => {
    onChange({ ...(formData as any), [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
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
          value={(formData as any).username}
          onChange={(e) => handleChange('username', e.target.value)}
          required
          placeholder="사용자명을 입력하세요"
        />
      </div>
      
      {!isLoginMode && (
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            value={(formData as any).email || ''}
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
          value={(formData as any).password}
          onChange={(e) => handleChange('password', e.target.value)}
          required
          placeholder="비밀번호를 입력하세요"
        />
      </div>
      
      {!isLoginMode && (
        <div className="form-group">
          <label htmlFor="password_confirm">비밀번호 확인</label>
          <input
            id="password_confirm"
            type="password"
            value={(formData as any).password_confirm || ''}
            onChange={(e) => handleChange('password_confirm', e.target.value)}
            required
            placeholder="비밀번호를 다시 입력하세요"
          />
        </div>
      )}
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isLoginMode ? '로그인' : '회원가입'}
        </button>
        <button type="button" className="btn btn-link" onClick={onChangeMode}>
          {switchText}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;

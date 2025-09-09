import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthUser } from '@hooks/useAuth';

type HeaderProps = {
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  onLogout?: () => void;
};

const Link = [
  { label:'About' , url: '/about' },
  { label:'Portfolio' , url: '/portfolio' },
  { label:'Blog' , url: '/blog' },
]

const Header: React.FC<HeaderProps> = ({ isAuthenticated, currentUser, onLogout }) => {

  const router = useNavigate()

  return (
    <nav>
      <div className={'py-[10px] bg-slate-800 text-gray-200 shadow-md'}>
        <div className={'w-[1000px] mx-auto flex justify-between items-center'}>
          <h1 className={'body02 cursor-pointer'} onClick={() => router('/')}>SHIN EUN HYE</h1>
          <div className={'flex body02 gap-[6px]'}>
            {!isAuthenticated ? (
              <>
                <button
                  className={'cursor-pointer underline'}
                  onClick={() => router('/login')}
                >
                  로그인
                </button>
                <button
                  className={'cursor-pointer'}
                  onClick={() => router('/register')}
                >
                  회원가입
                </button>
              </>
            ) : (
              <>
            <span>
              안녕하세요, {currentUser?.username}님! 👋
            </span>
                <button
                  onClick={() => router('/posts/create')}
                >
                  ✍️ 새 글 작성
                </button>
                <button
                  onClick={onLogout}
                >
                  로그아웃
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className={'py-[12px] bg-slate-900 text-gray-200'}>
        <div className={'w-[1000px] mx-auto flex items-center gap-[12px]'}>
          { Link.map((item) => (
            <div
              key={`link-${item}`}
             className={'white body02 cursor-pointer hover:opacity-60 duration-150'}
              onClick={() => router(item.url)}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Header;

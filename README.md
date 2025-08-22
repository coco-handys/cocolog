# 💻 CodeLog - 개발자 블로그

개발자의 생각을 담는 공간

## 🚀 기술 스택

### Backend
- **Python 3.11**
- **Django 4.2.7**
- **Django REST Framework 3.14.0**
- **PostgreSQL** (배포 시)
- **SQLite** (로컬 개발 시)

### Frontend
- **React 18**
- **CSS3**
- **Axios** (API 통신)

## 🏗️ 주요 기능

- ✅ 사용자 인증 (회원가입/로그인)
- ✅ 블로그 포스트 CRUD
- ✅ 권한 관리 (작성자만 수정/삭제)
- ✅ 반응형 UI

## 🚀 배포 방법

### Backend (Railway)

1. **Railway 계정 생성**: [railway.app](https://railway.app)
2. **GitHub 저장소 연결**
3. **환경변수 설정**:
   - `SECRET_KEY`: Django 시크릿 키
   - `DEBUG`: False
   - `DATABASE_URL`: Railway에서 자동 생성
4. **배포**: 자동으로 GitHub 푸시 시 배포됨

### Frontend (Vercel)

1. **Vercel 계정 생성**: [vercel.com](https://vercel.com)
2. **GitHub 저장소 연결**
3. **환경변수 설정**:
   - `REACT_APP_API_URL`: 백엔드 API URL
4. **배포**: 자동으로 GitHub 푸시 시 배포됨

## 🛠️ 로컬 개발

### Backend 실행
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend 실행
```bash
cd frontend
npm install
npm start
```

## 📁 프로젝트 구조

```
cocolog/
├── backend/          # Django 백엔드
│   ├── config/      # Django 설정
│   ├── posts/       # 블로그 포스트 앱
│   ├── users/       # 사용자 인증 앱
│   └── requirements.txt
├── frontend/        # React 프론트엔드
│   ├── src/
│   └── package.json
└── README.md
```

## 🔧 API 엔드포인트

- `POST /api/auth/register/` - 회원가입
- `POST /api/auth/login/` - 로그인
- `GET /api/posts/` - 포스트 목록
- `POST /api/posts/` - 포스트 작성
- `GET /api/posts/{id}/` - 포스트 상세
- `PUT /api/posts/{id}/` - 포스트 수정
- `DELETE /api/posts/{id}/` - 포스트 삭제

## �� 라이선스

MIT License

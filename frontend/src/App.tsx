import { Routes, Route, BrowserRouter } from 'react-router-dom';

// 페이지 컴포넌트
import HomePage from '@pages/HomePage';
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import CreatePostPage from '@pages/CreatePostPage';

// 공통 컴포넌트
import { ROUTES } from './routes';
import Layout from '@components/Layout';
import useAuth from "@hooks/useAuth";

function App(): React.ReactElement {

  const { currentUser, isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage isAuthenticated={isAuthenticated} authUser={currentUser} />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.CREATE_POST} element={<CreatePostPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

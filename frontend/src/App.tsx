import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { BuilderPage } from './pages/BuilderPage';
import { LoginPage } from './pages/LoginPage';
import { ResumeProvider } from './context/ResumeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <ResumeProvider>
        <Toaster position="bottom-right" />
        <BrowserRouter>
          <AuthGate>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/builder" element={<BuilderPage />} />
            </Routes>
          </AuthGate>
        </BrowserRouter>
      </ResumeProvider>
    </AuthProvider>
  );
}

export default App;

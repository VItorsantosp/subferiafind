import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Hub from './pages/Hub';
import Profile from './pages/Profile'; // NOVO IMPORT
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/hub" replace /> : <Login />} />
        
        <Route path="/hub" element={<ProtectedRoute><Hub /></ProtectedRoute>} />
        
        {/* NOVA ROTA PROTEGIDA PARA O PERFIL */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
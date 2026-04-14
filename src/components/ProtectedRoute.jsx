import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Este componente verifica se existe um utilizador antes de renderizar a página
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Enquanto o Supabase verifica a sessão, mostramos um ecrã de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Se não houver utilizador, manda de volta para o Login (raiz)
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Se estiver tudo ok, renderiza os "filhos" (a página protegida)
  return children;
}
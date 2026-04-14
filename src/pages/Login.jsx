import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Gamepad2, Mail, Lock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { signInWithEmail, signInWithDiscord, persistedName } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmail(email, password);
      navigate('/hub');
      // Aqui redirecionaremos para o Feed depois
    } catch (err) {
      setError('Credenciais inválidas ou erro no servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      
      {/* Lado Esquerdo - Formulário */}
      <div className="flex-1 flex items-center justify-center p-8 z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-surface p-8 rounded-2xl border border-white/5 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Gamepad2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">SUBFERIA HUB</h1>
          </div>

          {persistedName ? (
             <p className="text-muted mb-8 text-lg">
               Bem-vindo de volta, <span className="text-primary font-semibold">{persistedName}</span>. Pronto para o próximo round?
             </p>
          ) : (
            <p className="text-muted mb-8">Faça login para encontrar seu squad ideal.</p>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 bg-background border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-text placeholder-muted/50 transition-all outline-none"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-muted">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 bg-background border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-text placeholder-muted/50 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Conectando...' : (
                <>
                  Entrar no Hub <LogIn className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <span className="border-b border-white/10 w-1/5 lg:w-1/4"></span>
            <span className="text-xs text-center text-muted uppercase">ou continue com</span>
            <span className="border-b border-white/10 w-1/5 lg:w-1/4"></span>
          </div>

          <button
            onClick={signInWithDiscord}
            type="button"
            className="mt-6 w-full flex justify-center items-center gap-2 bg-[#5865F2]/10 border border-[#5865F2]/30 hover:bg-[#5865F2]/20 text-[#5865F2] font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Login com Discord
          </button>
        </motion.div>
      </div>

      {/* Lado Direito - Visual/Branding (Oculto em telas pequenas) */}
      <div className="hidden md:flex flex-1 relative bg-surface items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-background to-background"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 text-center space-y-6 max-w-lg p-8"
        >
          <div className="w-32 h-32 mx-auto border-4 border-primary/30 rounded-full flex items-center justify-center bg-background/50 backdrop-blur-sm">
             <Gamepad2 className="w-16 h-16 text-primary" />
          </div>
          <h2 className="text-4xl font-bold text-white">Eleve seu Gameplay</h2>
          <p className="text-lg text-muted">
            Conecte-se com jogadores do seu nível. Filtre por rank, estilo de jogo e encontre seu duo perfeito para dominar as partidas.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("1. Iniciando aplicação...");

  // Garante que seu nome se mantenha mesmo após desconectar
  const [persistedName, setPersistedName] = useState(() => {
    return localStorage.getItem('@GamingHub:lastUsername') || 'Estudante Shark';
  });

  useEffect(() => {
    let isMounted = true;

    // Failsafe: Se em 5 segundos nada acontecer, libera a tela de qualquer jeito
    const failsafe = setTimeout(() => {
      if (isMounted) {
        console.warn("Failsafe ativado: Supabase demorou demais.");
        setLoading(false);
      }
    }, 5000);

    const initializeAuth = async () => {
      try {
        setStatusMsg("2. Verificando login ativo...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session?.user) {
          setUser(session.user);
          setStatusMsg("3. Usuário identificado! Buscando perfil...");
          await fetchProfile(session.user.id);
        } else {
          setStatusMsg("3. Nenhum login encontrado.");
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro Auth:', error);
        setLoading(false);
      } finally {
        clearTimeout(failsafe);
      }
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription?.unsubscribe();
      clearTimeout(failsafe);
    };
  }, []);

  const fetchProfile = async (userId) => {
    try {
      setStatusMsg("4. A ler tabela de perfis (profiles)...");
      
      // Bypass de 1.5 segundos: Se a tabela profiles travar, a gente ignora
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 1500)
      );

      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

      if (error) throw error;

      if (data) {
        setProfile(data);
        if (data.username) {
          localStorage.setItem('@GamingHub:lastUsername', data.username);
          setPersistedName(data.username);
        }
      }
    } catch (error) {
      console.warn('Banco de dados lento ou tabela profiles ausente. Usando dados locais.');
    } finally {
      setStatusMsg("5. Finalizando...");
      setLoading(false); 
    }
  };

  const signInWithEmail = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signInWithDiscord = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'discord' });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, persistedName, signInWithEmail, signInWithDiscord, signOut }}>
      {loading ? (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white gap-4 p-8 text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="space-y-2">
            <p className="text-xl font-bold tracking-widest text-primary uppercase">Sincronizando</p>
            <p className="text-muted font-medium">{statusMsg}</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
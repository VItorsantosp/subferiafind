import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Gamepad2, Search, Settings, Users, Filter, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import PlayerCard from '../components/PlayerCard';
import GlobalChat from '../components/GlobalChat';

const GAMES_FILTER = ['Todos', 'GTA 5', 'CS2', 'Valorant', 'League of Legends', 'Free Fire', 'Outro'];

export default function Hub() {
  const { signOut, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState('Todos');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca os jogadores reais da base de dados do Supabase
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) throw error;
        setPlayers(data || []);
      } catch (e) {
        console.error('Erro ao carregar Hub:', e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  // Lógica de filtragem reativa
  const filteredPlayers = useMemo(() => {
    return players.filter(p => {
      const name = p.username || 'Jogador Anônimo';
      const game = p.main_game || 'Outro';
      const bio = p.bio || '';
      
      const matchesSearch = 
        name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        game.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bio.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGame = selectedGame === 'Todos' || game === selectedGame;
      
      return matchesSearch && matchesGame;
    });
  }, [searchTerm, selectedGame, players]);

  return (
    <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30">
      {/* Header Fixo e Moderno */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-4 mb-8">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <Gamepad2 className="w-6 h-6 text-background" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black italic tracking-tighter leading-none">SUBFERIA HUB</h1>
              <p className="text-[9px] text-muted uppercase tracking-[0.3em] font-bold mt-1">Ginga Community</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/profile" className="group flex items-center gap-3 bg-surface/50 hover:bg-surface px-4 py-2 rounded-2xl border border-white/5 transition-all">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                  {profile?.username || 'Configurar Perfil'}
                </p>
                <p className="text-[9px] text-muted font-bold tracking-widest uppercase">Membro</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-background border border-white/10 overflow-hidden flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Settings className="w-5 h-5 text-muted" />
                )}
              </div>
            </Link>
            
            <button 
              onClick={signOut} 
              className="p-3 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-xl text-red-500 transition-all border border-red-500/10"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 md:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* COLUNA DA ESQUERDA: Feed e Filtros (Ocupa 3 colunas) */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Seção de Busca e Filtros */}
            <section className="space-y-6">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Procurar jogador, clã ou jogo..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-surface border border-white/5 rounded-[2rem] py-6 pl-16 pr-8 focus:border-primary/50 outline-none transition-all shadow-2xl text-lg font-medium"
                />
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <Filter size={16} className="text-primary" />
                </div>
                {GAMES_FILTER.map(game => (
                  <button 
                    key={game} 
                    onClick={() => setSelectedGame(game)}
                    className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black transition-all border uppercase tracking-[0.2em] ${
                      selectedGame === game 
                      ? 'bg-primary border-primary text-background shadow-lg shadow-primary/20' 
                      : 'bg-surface border-white/5 text-muted hover:border-primary/30 hover:text-white'
                    }`}
                  >
                    {game}
                  </button>
                ))}
              </div>
            </section>

            {/* Grid de Jogadores */}
            <section>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-primary font-black italic uppercase tracking-[0.3em] text-xs">Sincronizando Database...</p>
                </div>
              ) : filteredPlayers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                  {filteredPlayers.map(player => (
                    <PlayerCard key={player.id} player={player} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 bg-surface/20 rounded-[3rem] border-2 border-dashed border-white/5">
                  <Users className="w-16 h-16 text-muted/20 mx-auto mb-6" />
                  <h2 className="text-xl font-bold text-white uppercase italic">Nenhum Squad Encontrado</h2>
                  <button 
                    onClick={() => {setSearchTerm(''); setSelectedGame('Todos');}}
                    className="mt-6 text-primary font-black uppercase text-[10px] tracking-widest hover:underline"
                  >
                    Resetar Filtros
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* COLUNA DA DIREITA: Chat Global (Ocupa 1 coluna) */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-28">
              <GlobalChat />
            </div>
          </aside>

          {/* Chat Mobile (Aparece apenas em ecrãs pequenos no fim) */}
          <div className="lg:hidden mt-8">
            <GlobalChat />
          </div>

        </div>
      </main>
    </div>
  );
}
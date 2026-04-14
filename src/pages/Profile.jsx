import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { User, Image as ImageIcon, ArrowLeft, Check } from 'lucide-react';

const GAMES_LIST = ['GTA 5', 'CS2', 'Valorant', 'League of Legends', 'Free Fire', 'Outro'];

export default function Profile() {
  const { user, profile, persistedName, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    play_schedule: '',
    discord_user: '',
    main_game: '',
    rank: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (!authLoading && !user) navigate('/');
    if (profile) {
      setFormData({
        username: profile.username || persistedName || '',
        bio: profile.bio || '',
        play_schedule: profile.play_schedule || '',
        discord_user: profile.discord_user || '',
        main_game: profile.main_game || '',
        rank: profile.rank || '',
        avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile, user, authLoading, persistedName, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        ...formData,
        updated_at: new Date(),
      });
      if (error) throw error;
      localStorage.setItem('@GamingHub:lastUsername', formData.username);
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setTimeout(() => { navigate('/hub'); window.location.reload(); }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-primary font-black italic">A CARREGAR...</div>;

  return (
    <div className="min-h-screen bg-background text-white p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-surface p-6 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-primary uppercase">Meu Perfil</h1>
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em]">Identidade Digital Hub</p>
          </div>
          <button onClick={() => navigate('/hub')} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-muted">
            <ArrowLeft size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* SEÇÃO DE AVATAR */}
          <div className="bg-background/50 p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-surface rounded-[2rem] border-2 border-primary/20 overflow-hidden flex-shrink-0 shadow-lg shadow-primary/10">
              {formData.avatar_url ? (
                <img src={formData.avatar_url} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted"><User size={40} /></div>
              )}
            </div>
            <div className="flex-1 w-full space-y-2">
              <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">URL da Imagem (Avatar)</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                <input 
                  name="avatar_url" 
                  value={formData.avatar_url} 
                  onChange={handleChange} 
                  placeholder="Link da foto (Discord, Imgur, etc)" 
                  className="w-full bg-surface border border-white/5 p-4 pl-12 rounded-2xl focus:border-primary outline-none text-sm transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Nickname</label>
              <input name="username" value={formData.username} onChange={handleChange} className="w-full bg-background border border-white/5 p-4 rounded-2xl focus:border-primary outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Discord</label>
              <input name="discord_user" value={formData.discord_user} onChange={handleChange} className="w-full bg-background border border-white/5 p-4 rounded-2xl focus:border-primary outline-none" placeholder="User#0000" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Jogo Principal</label>
              <select name="main_game" value={formData.main_game} onChange={handleChange} className="w-full bg-background border border-white/5 p-4 rounded-2xl focus:border-primary outline-none appearance-none">
                <option value="">Selecionar Jogo</option>
                {GAMES_LIST.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Rank / Patente</label>
              <input name="rank" value={formData.rank} onChange={handleChange} className="w-full bg-background border border-white/5 p-4 rounded-2xl focus:border-primary outline-none" placeholder="Ex: Elite, Ouro..." />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-indigo-600 text-white font-black py-5 rounded-[1.5rem] transition-all flex items-center justify-center gap-3 uppercase italic tracking-tighter shadow-lg shadow-primary/20">
            {loading ? 'A Guardar...' : <><Check size={20} /> Confirmar Dados</>}
          </button>
        </form>
      </div>
    </div>
  );
}
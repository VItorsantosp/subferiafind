import { useState } from 'react'; // Adicionado para o efeito de cópia
import { User, MessageSquare, Trophy, Clock, Hash, Check, Copy } from 'lucide-react';

export default function PlayerCard({ player }) {
  const [copied, setCopied] = useState(false);

  const getGameColor = (game) => {
    const gameName = (game || "").toLowerCase();
    switch (gameName) {
      case 'gta 5': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'cs2': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'valorant': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'league of legends': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  // Função para copiar o Discord
  const handleContact = () => {
    const discord = player?.discord_user;
    
    if (discord) {
      navigator.clipboard.writeText(discord);
      setCopied(true);
      
      // Reseta o ícone após 2 segundos
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert("Este jogador não informou o Discord no perfil.");
    }
  };

  return (
    <div className="bg-surface border border-white/5 rounded-[2.5rem] p-7 hover:border-primary/40 transition-all group shadow-xl relative overflow-hidden">
      {/* Badge de Status (Estético) */}
      <div className="absolute top-6 right-6">
        <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[8px] font-black text-green-500 uppercase">Online</span>
        </div>
      </div>

      <div className="flex items-start gap-5 mb-8">
        <div className="w-20 h-20 bg-background rounded-[1.5rem] border border-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center group-hover:border-primary/50 transition-all duration-500 shadow-inner">
          {player?.avatar_url ? (
            <img 
              src={player.avatar_url} 
              alt={player.username} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            />
          ) : (
            <User className="w-10 h-10 text-muted/30" />
          )}
        </div>
        <div className="pt-2">
          <h3 className="font-black text-2xl text-white italic uppercase tracking-tighter leading-none mb-2">
            {player?.username || 'Anónimo'}
          </h3>
          <div className={`px-3 py-1 rounded-lg text-[10px] font-black border uppercase tracking-[0.2em] inline-block ${getGameColor(player?.main_game)}`}>
            {player?.main_game || 'Outro'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-background/40 p-4 rounded-3xl border border-white/5 group-hover:bg-background/60 transition-colors">
          <p className="text-[9px] text-muted font-black uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <Trophy size={10} className="text-primary" /> Rank
          </p>
          <div className="text-sm font-black text-white italic">{player?.rank || '---'}</div>
        </div>
        <div className="bg-background/40 p-4 rounded-3xl border border-white/5 group-hover:bg-background/60 transition-colors">
          <p className="text-[9px] text-muted font-black uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <Clock size={10} className="text-primary" /> Horário
          </p>
          <div className="text-sm font-black text-white italic">{player?.play_schedule || 'FLEX'}</div>
        </div>
      </div>

      {/* Bio curta */}
      {player?.bio && (
        <div className="mb-8 px-2">
          <p className="text-xs text-muted leading-relaxed line-clamp-2 italic">
            "{player.bio}"
          </p>
        </div>
      )}

      {/* Botão de Acção: Copiar Discord */}
      <button 
        onClick={handleContact}
        className={`w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg ${
          copied 
          ? 'bg-green-500 text-white shadow-green-500/20' 
          : 'bg-primary text-background hover:bg-indigo-400 shadow-primary/20'
        }`}
      >
        {copied ? (
          <>
            <Check size={18} strokeWidth={3} />
            Copiado!
          </>
        ) : (
          <>
            <Hash size={18} strokeWidth={3} />
            Contactar via Discord
          </>
        )}
      </button>
    </div>
  );
}
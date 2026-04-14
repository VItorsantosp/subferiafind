import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Send, Hash, User } from 'lucide-react';

export default function GlobalChat() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // 1. Busca mensagens iniciais
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(50);
        if (!error) setMessages(data || []);
      } catch (e) {
        console.log("Aguardando base de dados...");
      }
    };
    fetchMessages();
  }, []);

  // 2. Sistema Realtime com PROTEÇÃO TOTAL
  useEffect(() => {
    if (!user || !supabase) return;

    // Criamos o canal mas com um nome único para evitar conflitos
    const channelName = `chat-${Math.random()}`;
    const channel = supabase.channel(channelName);

    // Só tentamos o subscribe se o objeto existir
    try {
      channel
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'messages' }, 
          (payload) => {
            setMessages(prev => {
              if (prev.find(m => m.id === payload.new.id)) return prev;
              return [...prev, payload.new];
            });
          }
        )
        .subscribe((status) => {
          console.log("Status da Conexão:", status);
        });
    } catch (err) {
      console.error("Erro ao iniciar Realtime:", err);
    }

    return () => {
      // Limpeza obrigatória para não travar a tela no refresh
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const { error } = await supabase.from('messages').insert([{
      content: newMessage,
      user_id: user.id,
      username: profile?.username || 'Membro Ginga',
      avatar_url: profile?.avatar_url || ''
    }]);

    if (!error) setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[500px] w-full bg-surface border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <div className="p-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hash size={16} className="text-primary" />
          <h2 className="font-black italic uppercase text-[10px] tracking-widest">Chat Global</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-background/10">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.user_id === user?.id ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-8 rounded-xl bg-background border border-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
              {msg.avatar_url ? (
                <img src={msg.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <User size={14} className="text-muted" />
              )}
            </div>
            <div className={`flex flex-col ${msg.user_id === user?.id ? 'items-end' : 'items-start'}`}>
              <span className="text-[8px] font-bold text-muted mb-1 uppercase tracking-tighter">{msg.username}</span>
              <div className={`px-4 py-2.5 rounded-2xl text-[11px] max-w-[180px] break-words ${
                msg.user_id === user?.id ? 'bg-primary text-background font-bold rounded-tr-none' : 'bg-surface border border-white/5 rounded-tl-none text-white'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-background/50 border-t border-white/5 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Diga algo..."
          className="flex-1 bg-surface border border-white/5 rounded-xl px-4 py-3 text-[11px] outline-none text-white focus:border-primary/50"
        />
        <button type="submit" className="bg-primary p-3 rounded-xl text-background hover:scale-105 transition-all">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
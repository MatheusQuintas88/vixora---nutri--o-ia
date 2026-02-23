import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Loader2, ShoppingBasket } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { UserProfile, Message } from '../types';
import { chatWithNutritionist, adjustPlanWithInventory } from '../services/gemini';

export default function Chat({ profile }: { profile: UserProfile }) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(`vixora_chat_${profile.name}`);
    return saved ? JSON.parse(saved) : [
      { role: 'model', text: `Olá ${profile.name}! Sou seu nutricionista IA. Como posso te ajudar hoje?` }
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInventoryInput, setShowInventoryInput] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(`vixora_chat_${profile.name}`, JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, profile.name]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setShowInventoryInput(false);

    try {
      let responseText: string | undefined;
      if (textOverride?.startsWith('Tenho em casa:')) {
        responseText = await adjustPlanWithInventory(textOverride.replace('Tenho em casa:', ''), profile);
      } else {
        responseText = await chatWithNutritionist([...messages, userMsg], profile);
      }
      setMessages(prev => [...prev, { role: 'model', text: responseText || 'Desculpe, tive um erro ao processar sua mensagem.' }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Ocorreu um erro na conexão. Tente novamente.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-card rounded-3xl border border-white/5 shadow-2xl flex flex-col h-full overflow-hidden">
      {/* Chat Header */}
      <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm tracking-wider uppercase">Vixora IA</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-[10px] text-emerald-500/70 uppercase font-bold tracking-widest">Neural Link Active</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowInventoryInput(!showInventoryInput)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
        >
          <ShoppingBasket size={16} />
          INVENTÁRIO
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
        <AnimatePresence initial={false}>
          {showInventoryInput && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/20 mb-6"
            >
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Otimização de Despensa</p>
              <textarea 
                placeholder="Ex: Tenho frango, batata doce e brócolis..."
                className="w-full p-4 text-sm bg-black/20 rounded-xl border border-white/5 focus:ring-2 focus:ring-emerald-500/20 outline-none h-24 resize-none text-white placeholder:text-gray-600"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(`Tenho em casa: ${e.currentTarget.value}`);
                  }
                }}
              />
              <p className="text-[10px] text-emerald-500/50 mt-3 italic">Pressione Enter para processar via IA</p>
            </motion.div>
          )}
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-emerald-500 text-black' 
                    : 'bg-white/5 text-emerald-500 border border-white/10'
                }`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`p-5 rounded-2xl text-sm leading-relaxed shadow-xl ${
                  msg.role === 'user' 
                    ? 'bg-emerald-500 text-black rounded-tr-none font-medium' 
                    : 'bg-white/[0.03] text-gray-200 rounded-tl-none border border-white/5'
                }`}>
                  <div className="markdown-body prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/40">
                    <ReactMarkdown>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-4 max-w-[80%]">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500 border border-white/10">
                  <Bot size={20} />
                </div>
                <div className="bg-white/[0.03] p-5 rounded-2xl rounded-tl-none border border-white/5">
                  <Loader2 size={20} className="animate-spin text-emerald-500/50" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-6 border-t border-white/5 bg-white/[0.01]">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Comande sua nutrição aqui..."
            className="w-full pl-6 pr-16 py-5 bg-black/40 rounded-2xl border border-white/5 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none text-sm text-white placeholder:text-gray-600"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="absolute right-3 w-12 h-12 bg-emerald-500 text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

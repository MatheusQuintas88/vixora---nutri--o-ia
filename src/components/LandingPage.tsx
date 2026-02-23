import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChefHat, ShieldCheck, Zap, Star, ArrowRight, Lock, Mail } from 'lucide-react';

export default function LandingPage({ onLogin, onBuy }: { onLogin: (email: string, pass: string) => void, onBuy: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { minutes: prev.minutes - 1, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg overflow-x-hidden text-white">
      {/* Urgency Bar */}
      <div className="bg-emerald-600 py-2 px-4 text-center text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] animate-pulse">
        ⚠️ OFERTA DE LANÇAMENTO: 85% DE DESCONTO EXPIRA EM {timeLeft.minutes}:{timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
      </div>

      {/* Hero Section */}
      <div className="relative pt-16 md:pt-24 pb-20 md:pb-32 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-6xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] md:text-xs font-bold mb-8 tracking-widest"
          >
            <Zap size={14} />
            TECNOLOGIA NEURAL DE ÚLTIMA GERAÇÃO
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-8xl font-display font-bold mb-8 tracking-tighter leading-[0.9]"
          >
            Pare de <span className="text-gray-600 line-through decoration-red-500/50">Tentar</span>. <br />
            Comece a <span className="text-emerald-500 neon-text-emerald">Vencer</span>.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Vixora não é apenas um app. É um <span className="text-white font-bold italic">Nutricionista de Elite</span> disponível 24h por dia, 
            que conhece seu metabolismo melhor que você mesmo.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-6"
          >
            <button 
              onClick={onBuy}
              className="w-full md:w-auto px-12 py-6 bg-emerald-500 text-black font-black rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg group"
            >
              QUERO MEU ACESSO VITALÍCIO AGORA
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-4 text-gray-500 text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-500" /> Pagamento Seguro</span>
              <span className="w-1 h-1 bg-gray-700 rounded-full" />
              <span className="flex items-center gap-1"><Star size={14} className="text-emerald-500" /> 7 Dias de Garantia</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scarcity Section */}
      <div className="bg-white/[0.02] border-y border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center md:justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <p className="text-3xl font-display font-bold text-white">12,482+</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Vidas Transformadas</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-3xl font-display font-bold text-emerald-500">4.9/5</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Avaliação Média</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-3xl font-display font-bold text-red-500">APENAS 14</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Vagas Restantes Hoje</p>
          </div>
        </div>
      </div>

      {/* Social Proof / Testimonials */}
      <div className="max-w-6xl mx-auto px-4 py-32">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-center mb-20 tracking-tight">
          O que dizem os <span className="text-emerald-500 italic">Vixorianos</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TestimonialCard 
            name="Ricardo Santos"
            role="Empresário"
            text="Perdi 12kg em 3 meses sem passar fome. A IA entende exatamente quando eu preciso de mais energia."
            image="https://picsum.photos/seed/user1/100/100"
          />
          <TestimonialCard 
            name="Juliana Lima"
            role="Atleta Amadora"
            text="O recurso de tirar foto do prato mudou minha vida. Não preciso mais ficar digitando gramas de cada coisa."
            image="https://picsum.photos/seed/user2/100/100"
          />
          <TestimonialCard 
            name="Marcos Oliveira"
            role="Desenvolvedor"
            text="A funcionalidade 'O que tenho em casa' é genial. Economizo tempo e dinheiro comendo saudável."
            image="https://picsum.photos/seed/user3/100/100"
          />
        </div>
      </div>

      {/* Pricing / CTA Final */}
      <div className="max-w-4xl mx-auto px-4 py-32 text-center">
        <div className="bg-dark-card p-12 rounded-[3rem] border border-emerald-500/20 shadow-[0_0_60px_rgba(16,185,129,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[10px] font-black px-6 py-2 rotate-45 translate-x-6 translate-y-4">
            MELHOR PREÇO
          </div>
          <h3 className="text-4xl font-display font-bold mb-4">Acesso Vitalício</h3>
          <p className="text-gray-500 mb-8">Sem mensalidades, sem taxas escondidas.</p>
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className="text-gray-600 line-through text-2xl">R$ 197,00</span>
            <span className="text-6xl font-display font-bold text-emerald-500">R$ 29,99</span>
          </div>
          <button 
            onClick={onBuy}
            className="w-full py-6 bg-emerald-500 text-black font-black rounded-2xl text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20"
          >
            QUERO MEU ACESSO AGORA
          </button>
          <p className="mt-6 text-gray-600 text-xs font-bold uppercase tracking-widest">
            * Oferta válida apenas para os próximos 15 minutos
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-600 text-xs font-bold uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-emerald-500" />
          <span>VIXORA NEURAL SYSTEMS © 2026</span>
        </div>
        <div className="flex gap-8">
          <button onClick={() => setIsLogin(true)} className="hover:text-emerald-400 transition-colors">ÁREA DE MEMBROS</button>
          <span className="hover:text-emerald-400 transition-colors cursor-pointer">TERMOS</span>
          <span className="hover:text-emerald-400 transition-colors cursor-pointer">PRIVACIDADE</span>
        </div>
      </footer>

      {/* Login Modal */}
      {isLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-card w-full max-w-md rounded-[2.5rem] border border-white/10 p-10 relative shadow-2xl"
          >
            <button 
              onClick={() => setIsLogin(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              ✕
            </button>
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 mx-auto mb-6">
                <Lock size={32} />
              </div>
              <h2 className="text-2xl font-display font-bold text-white tracking-tight">Neural Login</h2>
              <p className="text-gray-500 text-sm mt-2">Acesse sua central de comando.</p>
            </div>
            <div className="space-y-6">
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  placeholder="Seu E-mail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all text-white placeholder:text-gray-700 font-medium"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input 
                  type="password" 
                  placeholder="Sua Senha"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all text-white placeholder:text-gray-700 font-medium"
                />
              </div>
              <button 
                onClick={() => onLogin(email, password)}
                className="w-full py-5 bg-emerald-500 text-black font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-sm"
              >
                AUTENTICAR
              </button>
              <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                Problemas no acesso? <span className="text-emerald-500 cursor-pointer hover:underline">Suporte Neural</span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function TestimonialCard({ name, role, text, image }: { name: string, role: string, text: string, image: string }) {
  return (
    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all group">
      <div className="flex items-center gap-4 mb-6">
        <img src={image} alt={name} className="w-12 h-12 rounded-full border-2 border-emerald-500/20" referrerPolicy="no-referrer" />
        <div>
          <p className="font-bold text-white">{name}</p>
          <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{role}</p>
        </div>
      </div>
      <p className="text-gray-400 italic leading-relaxed">"{text}"</p>
      <div className="flex gap-1 mt-6">
        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} className="fill-emerald-500 text-emerald-500" />)}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

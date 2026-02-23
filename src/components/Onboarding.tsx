import { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { ChefHat, ArrowRight } from 'lucide-react';

export default function Onboarding({ onComplete }: { onComplete: (profile: UserProfile) => void }) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    age: 0,
    weight: 0,
    height: 0,
    goal: 'maintenance',
    activityLevel: 'moderate'
  });

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsProcessing(true);
      // Simulate a loading state as requested before going to payment
      setTimeout(async () => {
        try {
          const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: formData.name }),
          });
          const { url } = await response.json();
          if (url) {
            // Save profile locally before redirecting
            localStorage.setItem('vixora_pending_profile', JSON.stringify(formData));
            window.location.href = url;
          }
        } catch (error) {
          console.error("Payment error:", error);
          setIsProcessing(false);
        }
      }, 2000);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          <div className="relative">
            <div className="w-24 h-24 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ChefHat size={32} className="text-emerald-500 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-display font-bold tracking-tight">Sincronizando Dados...</h2>
            <p className="text-gray-500 max-w-xs mx-auto text-sm">
              Nossa IA está calculando sua estrutura metabólica e preparando seu acesso exclusivo.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-card w-full max-w-md rounded-[2.5rem] shadow-2xl border border-white/5 relative z-10 overflow-hidden"
      >
        <div className="p-10">
          <div className="flex justify-center mb-10">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <ChefHat size={40} />
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Bio-Perfil</h1>
            <p className="text-gray-500 text-sm mt-2">Configure sua identidade nutricional.</p>
          </div>

          <div className="space-y-8">
            {step === 1 && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Nome Completo</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all outline-none text-white placeholder:text-gray-600"
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Idade</label>
                  <input 
                    type="number" 
                    value={formData.age || ''}
                    onChange={e => setFormData({...formData, age: parseInt(e.target.value) || 0})}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all outline-none text-white placeholder:text-gray-600"
                    placeholder="Ex: 25"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Peso (kg)</label>
                    <input 
                      type="number" 
                      value={formData.weight || ''}
                      onChange={e => setFormData({...formData, weight: parseInt(e.target.value) || 0})}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all outline-none text-white placeholder:text-gray-600"
                      placeholder="Ex: 70"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Altura (cm)</label>
                    <input 
                      type="number" 
                      value={formData.height || ''}
                      onChange={e => setFormData({...formData, height: parseInt(e.target.value) || 0})}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all outline-none text-white placeholder:text-gray-600"
                      placeholder="Ex: 175"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Nível de Atividade</label>
                  <select 
                    value={formData.activityLevel}
                    onChange={e => setFormData({...formData, activityLevel: e.target.value as any})}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all outline-none text-white appearance-none cursor-pointer bg-dark-card"
                  >
                    <option value="sedentary" className="bg-dark-card">Sedentário</option>
                    <option value="moderate" className="bg-dark-card">Moderado</option>
                    <option value="active" className="bg-dark-card">Ativo</option>
                  </select>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Objetivo Neural</label>
                <div className="grid gap-4">
                  {[
                    { id: 'weight_loss', label: 'Perder Peso', desc: 'Déficit calórico otimizado' },
                    { id: 'muscle_gain', label: 'Ganhar Músculos', desc: 'Hipertrofia e síntese proteica' },
                    { id: 'maintenance', label: 'Manter Peso', desc: 'Homeostase e longevidade' }
                  ].map(goal => (
                    <button
                      key={goal.id}
                      onClick={() => setFormData({...formData, goal: goal.id as any})}
                      className={`p-5 rounded-[1.5rem] border text-left transition-all relative overflow-hidden group ${
                        formData.goal === goal.id 
                          ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                          : 'border-white/5 bg-white/[0.02] hover:border-emerald-500/30'
                      }`}
                    >
                      <div className={`font-bold text-sm ${formData.goal === goal.id ? 'text-emerald-400' : 'text-gray-300'}`}>{goal.label}</div>
                      <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">{goal.desc}</div>
                      {formData.goal === goal.id && (
                        <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <button
              onClick={handleNext}
              disabled={(step === 1 && (!formData.name || !formData.age)) || (step === 2 && (!formData.weight || !formData.height))}
              className="w-full bg-emerald-500 text-black py-5 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
            >
              {step === 3 ? 'Ativar Assinatura (R$ 29,99)' : 'Próxima Etapa'}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        
        <div className="bg-white/[0.02] p-6 flex justify-center gap-3 border-t border-white/5">
          {[1, 2, 3].map(s => (
            <div 
              key={s} 
              className={`h-1.5 rounded-full transition-all duration-500 ${s === step ? 'w-12 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'w-3 bg-white/10'}`} 
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

import { UserProfile, Meal } from '../types';
import { Activity, Flame, Utensils, TrendingUp, Camera } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { analyzeFoodImage } from '../services/gemini';

export default function Dashboard({ profile, mealPlan }: { profile: UserProfile, mealPlan: Meal[] }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const result = await analyzeFoodImage(base64);
        setAnalysisResult(result || null);
      } catch (error) {
        console.error("Error analyzing image:", error);
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long' });
  const todayMeal = mealPlan.find(m => m.day.toLowerCase().includes(today.toLowerCase())) || mealPlan[0];

  return (
    <div className="space-y-10">
      {/* Progress Bars Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-card p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all" />
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Calorias Diárias</h3>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-display font-bold text-white">1,450</span>
                <span className="text-gray-600 font-bold mb-1 text-sm">/ 2,200 kcal</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Flame size={24} />
            </div>
          </div>
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '65%' }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-4 font-bold uppercase tracking-widest flex items-center gap-2">
            <TrendingUp size={12} className="text-emerald-500" />
            65% da meta atingida
          </p>
        </div>

        <div className="bg-dark-card p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all" />
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Proteína Neural</h3>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-display font-bold text-white">112</span>
                <span className="text-gray-600 font-bold mb-1 text-sm">/ 160 g</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Activity size={24} />
            </div>
          </div>
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-4 font-bold uppercase tracking-widest flex items-center gap-2">
            <TrendingUp size={12} className="text-blue-500" />
            70% da meta atingida
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Today's Meals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-display font-bold tracking-tight">Refeições de Hoje</h3>
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">{today}</span>
          </div>
          
          <div className="space-y-4">
            {todayMeal && (
              <>
                <MealItem time="08:00" type="Café da Manhã" description={todayMeal.breakfast} />
                <MealItem time="12:30" type="Almoço" description={todayMeal.lunch} />
                <MealItem time="16:00" type="Lanche" description={todayMeal.snack} />
                <MealItem time="20:00" type="Jantar" description={todayMeal.dinner} />
              </>
            )}
          </div>
        </div>

        {/* AI Photo Analysis */}
        <div className="space-y-6">
          <h3 className="text-xl font-display font-bold tracking-tight">Análise IA</h3>
          <div className="bg-dark-card p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
            <div className="aspect-square rounded-2xl bg-white/[0.02] border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group hover:border-emerald-500/50 transition-all">
              {analyzing ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-400 font-medium">Escaneando nutrientes...</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Camera size={32} className="text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-400 mb-6">Capture sua refeição para análise instantânea.</p>
                  <label className="bg-emerald-500 text-black px-8 py-3 rounded-xl text-sm font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20">
                    ESCANEAR PRATO
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </>
              )}
            </div>

            {analysisResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"
              >
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Relatório IA</p>
                <p className="text-sm text-emerald-100/80 leading-relaxed italic">"{analysisResult}"</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subValue, color }: { icon: React.ReactNode, label: string, value: string, subValue: string, color: string }) {
  const colors: Record<string, string> = {
    orange: 'hover:border-orange-500/30',
    blue: 'hover:border-blue-500/30',
    emerald: 'hover:border-emerald-500/30',
    purple: 'hover:border-purple-500/30'
  };

  return (
    <div className={`bg-dark-card p-6 rounded-3xl border border-white/5 shadow-xl transition-all hover:-translate-y-1 ${colors[color]}`}>
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
        {icon}
      </div>
      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{label}</p>
      <h4 className="text-3xl font-display font-bold mt-2 tracking-tight">{value}</h4>
      <p className="text-[10px] text-gray-600 font-bold mt-2 uppercase tracking-widest">{subValue}</p>
    </div>
  );
}

function MealItem({ time, type, description }: { time: string, type: string, description: string }) {
  return (
    <div className="bg-dark-card p-6 rounded-2xl border border-white/5 flex items-center gap-8 hover:border-emerald-500/30 transition-all group cursor-pointer">
      <div className="text-xs font-mono font-bold text-emerald-500/50 group-hover:text-emerald-500 transition-colors">{time}</div>
      <div className="flex-1">
        <h5 className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors uppercase tracking-wider">{type}</h5>
        <p className="text-sm text-gray-500 mt-1 line-clamp-1 group-hover:line-clamp-none transition-all">{description}</p>
      </div>
      <div className="w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center text-gray-600 group-hover:text-emerald-500 group-hover:border-emerald-500/50 transition-all">
        <Utensils size={18} />
      </div>
    </div>
  );
}

import { Meal } from '../types';
import { motion } from 'motion/react';
import { RefreshCw, Calendar, ChevronRight } from 'lucide-react';

export default function MealPlan({ mealPlan, onRegenerate, loading }: { mealPlan: Meal[], onRegenerate: () => void, loading: boolean }) {
  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-display font-bold tracking-tight">Seu Cardápio Semanal</h3>
          <p className="text-sm text-gray-500">Gerado pela IA com base no seu perfil genético e objetivos.</p>
        </div>
        <button 
          onClick={onRegenerate}
          disabled={loading}
          className="flex items-center gap-3 px-6 py-3 bg-emerald-500 text-black rounded-xl text-sm font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          REGENERAR PLANO
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mealPlan.map((meal, i) => (
          <motion.div
            key={meal.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-dark-card rounded-3xl border border-white/5 shadow-2xl overflow-hidden group hover:border-emerald-500/30 transition-all"
          >
            <div className="p-6 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Calendar size={18} />
                </div>
                <span className="font-display font-bold text-sm capitalize tracking-wider">{meal.day}</span>
              </div>
              <ChevronRight size={18} className="text-gray-600 group-hover:text-emerald-500 transition-colors" />
            </div>
            
            <div className="p-6 space-y-6">
              <MealSection label="Café da Manhã" content={meal.breakfast} />
              <MealSection label="Almoço" content={meal.lunch} />
              <MealSection label="Lanche" content={meal.snack} />
              <MealSection label="Jantar" content={meal.dinner} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MealSection({ label, content }: { label: string, content: string }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.2em]">{label}</p>
      <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors">{content}</p>
    </div>
  );
}

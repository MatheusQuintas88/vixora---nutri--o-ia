/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChefHat, 
  MessageSquare, 
  LayoutDashboard, 
  Settings, 
  Camera, 
  LogOut,
  ChevronRight,
  Activity,
  Target,
  User as UserIcon,
  Zap
} from 'lucide-react';
import { UserProfile, Meal } from './types';
import { generateMealPlan } from './services/gemini';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import MealPlan from './components/MealPlan';
import Onboarding from './components/Onboarding';
import LandingPage from './components/LandingPage';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('vixora_profile');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'meals' | 'chat' | 'settings'>('dashboard');
  const [mealPlan, setMealPlan] = useState<Meal[]>(() => {
    const saved = localStorage.getItem('vixora_meals');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    // Admin bypass check (if name is 'admin')
    const pendingProfile = localStorage.getItem('vixora_pending_profile');
    if (pendingProfile) {
      const parsed = JSON.parse(pendingProfile);
      if (parsed.name.toLowerCase() === 'admin') {
        setProfile(parsed);
        localStorage.setItem('vixora_profile', pendingProfile);
        localStorage.removeItem('vixora_pending_profile');
        window.history.replaceState({}, document.title, "/");
        return;
      }
    }

    if (sessionId) {
      verifyPayment(sessionId);
    }
  }, []);

  const verifyPayment = async (sessionId: string) => {
    setIsVerifying(true);
    try {
      const response = await fetch(`/api/verify-session/${sessionId}`);
      const { status } = await response.json();
      if (status === 'paid') {
        const pendingProfile = localStorage.getItem('vixora_pending_profile');
        if (pendingProfile) {
          const profileData = JSON.parse(pendingProfile);
          setProfile(profileData);
          localStorage.setItem('vixora_profile', pendingProfile);
          localStorage.removeItem('vixora_pending_profile');
          
          // Simulate sending email with credentials
          await fetch('/api/send-welcome-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: profileData.name + '@vixora.ai', name: profileData.name }),
          });
        }
      }
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setIsVerifying(false);
      window.history.replaceState({}, document.title, "/");
    }
  };

  const handleLogin = async (email: string, pass: string) => {
    // Simple login simulation
    if (email && pass) {
      setLoading(true);
      // In a real app, this would verify against a DB
      const mockProfile: UserProfile = {
        name: email.split('@')[0],
        age: 30,
        weight: 80,
        height: 180,
        goal: 'maintenance',
        activityLevel: 'moderate'
      };
      setProfile(mockProfile);
      localStorage.setItem('vixora_profile', JSON.stringify(mockProfile));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      localStorage.setItem('vixora_profile', JSON.stringify(profile));
      if (mealPlan.length === 0) {
        handleGeneratePlan();
      }
    }
  }, [profile]);

  useEffect(() => {
    if (mealPlan.length > 0) {
      localStorage.setItem('vixora_meals', JSON.stringify(mealPlan));
    }
  }, [mealPlan]);

  const handleGeneratePlan = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const plan = await generateMealPlan(profile);
      setMealPlan(plan);
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4 text-white">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-2xl font-display font-bold neon-text-emerald">Verificando...</h2>
      </div>
    );
  }

  if (!profile && !showOnboarding) {
    return <LandingPage onLogin={handleLogin} onBuy={() => setShowOnboarding(true)} />;
  }

  if (!profile && showOnboarding) {
    return <Onboarding onComplete={setProfile} />;
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 bg-dark-card border-r border-white/5 flex-col fixed h-full z-20">
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Zap size={28} />
          </div>
          <h1 className="text-2xl font-display font-bold tracking-tighter neon-text-emerald">VIXORA</h1>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <NavItem 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            icon={<LayoutDashboard size={22} />}
            label="Dashboard"
          />
          <NavItem 
            active={activeTab === 'meals'} 
            onClick={() => setActiveTab('meals')}
            icon={<Activity size={22} />}
            label="Plano Alimentar"
          />
          <NavItem 
            active={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')}
            icon={<MessageSquare size={22} />}
            label="Nutricionista IA"
          />
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={() => {
              localStorage.removeItem('vixora_profile');
              localStorage.removeItem('vixora_meals');
              window.location.reload();
            }}
            className="flex items-center gap-3 px-6 py-4 w-full text-sm font-bold text-gray-500 hover:text-red-400 hover:bg-red-400/5 rounded-2xl transition-all"
          >
            <LogOut size={20} />
            Desconectar
          </button>
        </div>
      </aside>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-card/80 backdrop-blur-xl border-t border-white/5 z-50 px-6 py-3 flex justify-between items-center">
        <MobileNavItem 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')}
          icon={<LayoutDashboard size={24} />}
        />
        <MobileNavItem 
          active={activeTab === 'meals'} 
          onClick={() => setActiveTab('meals')}
          icon={<Activity size={24} />}
        />
        <MobileNavItem 
          active={activeTab === 'chat'} 
          onClick={() => setActiveTab('chat')}
          icon={<MessageSquare size={24} />}
        />
        <button 
          onClick={() => {
            localStorage.removeItem('vixora_profile');
            localStorage.removeItem('vixora_meals');
            window.location.reload();
          }}
          className="p-3 text-gray-500"
        >
          <LogOut size={24} />
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-4 md:p-10 pb-24 md:pb-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight">Olá, {profile.name}</h2>
            <p className="text-gray-500 text-sm mt-1">Sua evolução neural continua hoje.</p>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-lg font-display font-bold text-emerald-400">{profile.weight} kg</span>
              <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Peso Atual</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <UserIcon size={24} />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Dashboard profile={profile} mealPlan={mealPlan} />
            </motion.div>
          )}
          {activeTab === 'meals' && (
            <motion.div
              key="meals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <MealPlan mealPlan={mealPlan} onRegenerate={handleGeneratePlan} loading={loading} />
            </motion.div>
          )}
          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-[calc(100vh-14rem)] md:h-[calc(100vh-16rem)]"
            >
              <Chat profile={profile} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-4 w-full text-sm font-bold rounded-2xl transition-all group ${
        active 
          ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/40' 
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <span className={`${active ? 'text-black' : 'text-emerald-500 group-hover:scale-110 transition-transform'}`}>
        {icon}
      </span>
      {label}
    </button>
  );
}

function MobileNavItem({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-xl transition-all ${
        active 
          ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/40' 
          : 'text-gray-500'
      }`}
    >
      {icon}
    </button>
  );
}

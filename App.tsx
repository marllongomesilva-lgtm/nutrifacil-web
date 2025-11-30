import React, { useState } from 'react';
import { Onboarding } from './components/Onboarding';
import { DashboardView, DietView, ShoppingListView, ChatView, ProfileView } from './components/Views';
import { BottomNav, Button } from './components/UI';
import { UserProfile, DietPlan } from './types';
import { generateDietPlan } from './services/geminiService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('welcome');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setCurrentView('onboarding');
  };

  const handleOnboardingComplete = async (data: UserProfile) => {
    setProfile(data);
    setIsLoading(true);
    setCurrentView('loading');
    
    try {
      const plan = await generateDietPlan(data);
      setDietPlan(plan);
      setCurrentView('dashboard');
    } catch (error) {
      console.error(error);
      alert("Houve um erro ao gerar sua dieta. Verifique sua chave de API.");
      setCurrentView('onboarding'); // Go back on error
    } finally {
      setIsLoading(false);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'welcome':
        return (
          <div className="h-screen bg-white flex flex-col justify-between p-8 relative overflow-hidden">
             <div className="mt-20 z-10">
               <div className="w-16 h-16 bg-primary rounded-2xl mb-6 flex items-center justify-center text-white text-3xl font-display font-bold shadow-lg shadow-primary/40">
                 N
               </div>
               <h1 className="font-display font-extrabold text-4xl text-text-main leading-tight mb-4">
                 Monte sua dieta <span className="text-primary">perfeita</span> em minutos.
               </h1>
               <p className="text-text-muted text-lg">
                 O NutriFácil cria um plano alimentar personalizado para o seu corpo e objetivo.
               </p>
             </div>
             
             <div className="z-10 w-full space-y-3">
               <Button fullWidth onClick={handleLogin}>Começar Agora</Button>
               <Button fullWidth variant="ghost" onClick={handleLogin}>Já tenho conta</Button>
             </div>

             {/* Decoration */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          </div>
        );
      case 'onboarding':
        return <div className="min-h-screen bg-surface pt-10"><Onboarding onComplete={handleOnboardingComplete} /></div>;
      case 'loading':
        return (
          <div className="h-screen flex flex-col items-center justify-center bg-white p-8 text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-bold font-display text-text-main">Criando sua dieta...</h2>
            <p className="text-text-muted mt-2">Nossa IA está calculando os melhores macros para seu objetivo de {profile?.goal}.</p>
          </div>
        );
      case 'dashboard':
        return dietPlan && profile ? <DashboardView profile={profile} diet={dietPlan} /> : null;
      case 'diet':
        return dietPlan ? <DietView diet={dietPlan} /> : null;
      case 'chat':
        return <ChatView />;
      case 'progress':
        // Reuse Dashboard for now or separate component, mocking profile view for demo simplicity in "Progress"
        return dietPlan && profile ? <DashboardView profile={profile} diet={dietPlan} /> : null;
      case 'profile':
        return profile ? <ProfileView profile={profile} /> : null;
      default:
        return <div>View not found</div>;
    }
  };

  const showNav = ['dashboard', 'diet', 'chat', 'progress', 'profile'].includes(currentView);

  return (
    <div className="font-sans text-text-main bg-surface min-h-screen max-w-lg mx-auto shadow-2xl relative">
       {renderView()}
       {showNav && <BottomNav currentView={currentView} setView={setCurrentView} />}
    </div>
  );
};

export default App;
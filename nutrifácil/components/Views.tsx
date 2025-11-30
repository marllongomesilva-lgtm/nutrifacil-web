import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Header, Icon, Input } from './UI';
import { DietPlan, UserProfile, ChatMessage, Meal } from '../types';
import { getSubstitution, chatWithNutritionist } from '../services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from 'recharts';

// --- Dashboard Component ---
export const DashboardView: React.FC<{profile: UserProfile, diet: DietPlan}> = ({ profile, diet }) => {
  const data = [
    { name: 'Proteína', value: diet.dailyMacros.protein, color: '#3D8AF7' },
    { name: 'Carbos', value: diet.dailyMacros.carbs, color: '#4CAF50' },
    { name: 'Gordura', value: diet.dailyMacros.fats, color: '#FFC107' },
  ];

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="bg-primary text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="font-display font-bold text-xl">Olá, {profile.name}! 👋</h2>
          <p className="opacity-90 text-sm mt-1">Seu objetivo: <span className="font-bold">{profile.goal}</span></p>
          <div className="mt-4 flex gap-4">
            <div>
              <p className="text-xs opacity-80 uppercase tracking-wide">Calorias</p>
              <p className="font-bold text-2xl">{diet.totalCalories}</p>
            </div>
            <div>
              <p className="text-xs opacity-80 uppercase tracking-wide">Peso Atual</p>
              <p className="font-bold text-2xl">{profile.weight}kg</p>
            </div>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-8 opacity-20">
          <Icon name="TrendingUp" size={120} />
        </div>
      </div>

      <Header title="Resumo do Dia" />
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col items-center justify-center p-4">
            <h3 className="text-sm font-semibold text-text-main mb-2">Macros</h3>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} innerRadius={25} outerRadius={40} paddingAngle={5} dataKey="value">
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-2 text-[10px] text-text-muted">
              <span className="text-accent">P</span>
              <span className="text-primary">C</span>
              <span className="text-warning">G</span>
            </div>
        </Card>
        
        <Card className="bg-blue-50 border-blue-100 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2 text-accent">
               <Icon name="Utensils" size={18} />
               <h3 className="font-bold">Próxima</h3>
            </div>
            <p className="text-sm font-medium text-text-main line-clamp-2">{diet.meals[0]?.name}</p>
            <p className="text-xs text-text-muted mt-1">{diet.meals[0]?.time}</p>
        </Card>
      </div>

      <div className="flex justify-between items-center mt-4">
        <h3 className="font-display font-bold text-lg text-text-main">Água</h3>
        <span className="text-sm text-accent font-bold">1.2L / 3L</span>
      </div>
      <div className="flex gap-2">
         {[1,2,3,4,5,6].map(i => (
             <button key={i} className={`flex-1 h-10 rounded-lg border-2 border-blue-100 flex items-center justify-center ${i <= 2 ? 'bg-blue-100 text-accent' : 'text-gray-300'}`}>
                <div className="w-3 h-3 bg-current rounded-full" />
             </button>
         ))}
      </div>
    </div>
  );
};

// --- Diet Plan Component ---
export const DietView: React.FC<{diet: DietPlan}> = ({ diet }) => {
  const [subModal, setSubModal] = useState<{show: boolean, food: string, calories: number} | null>(null);
  const [subResult, setSubResult] = useState<string>('');
  const [loadingSub, setLoadingSub] = useState(false);

  const handleSub = async () => {
    if(!subModal) return;
    setLoadingSub(true);
    try {
      const res = await getSubstitution(subModal.food, subModal.calories);
      setSubResult(res);
    } catch(e) {
      setSubResult("Erro ao buscar.");
    } finally {
      setLoadingSub(false);
    }
  }

  return (
    <div className="p-4 pb-24 space-y-6">
      <Header title="Minha Dieta" subtitle={`${diet.totalCalories} kcal • Foco em ${diet.meals.length} refeições`} />
      
      {diet.meals.map((meal, idx) => (
        <Card key={idx} className="overflow-hidden p-0 mb-4 group">
          <div className="relative h-32 w-full overflow-hidden">
            <img 
              src={`https://picsum.photos/seed/${meal.imageKeyword || 'food'}/600/300`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              alt={meal.name}
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
              <div className="flex justify-between items-end text-white">
                <div>
                   <h3 className="font-bold font-display text-lg">{meal.name}</h3>
                   <span className="text-xs opacity-90 bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">{meal.time}</span>
                </div>
                <div className="text-right">
                   <span className="font-bold text-warning">{meal.calories}</span>
                   <span className="text-xs block opacity-80">kcal</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4">
             <ul className="space-y-2 mb-4">
                {meal.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm text-text-main border-b border-dashed border-gray-100 pb-1 last:border-0">
                    <span>{item.name}</span>
                    <span className="text-text-muted font-medium">{item.quantity}</span>
                  </li>
                ))}
             </ul>
             
             <div className="flex gap-2 mt-4">
               <Button 
                  variant="outline" 
                  className="flex-1 h-9 text-xs" 
                  onClick={() => {
                    setSubModal({show: true, food: meal.items[0].name, calories: Math.round(meal.calories / meal.items.length)});
                    setSubResult('');
                  }}
               >
                 <Icon name="RefreshCcw" size={14} className="mr-1"/> Substituir
               </Button>
               <Button variant="ghost" className="h-9 px-3 text-xs text-text-muted">
                 Receita
               </Button>
             </div>
          </div>
        </Card>
      ))}

      {/* Substitution Modal */}
      {subModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
           <Card className="w-full max-w-sm animate-fade-in">
              <h3 className="font-bold text-lg mb-2">Substituir Alimento</h3>
              <p className="text-sm text-text-muted mb-4">Buscando opções para <b>{subModal.food}</b> (~{subModal.calories} kcal)</p>
              
              {subResult ? (
                <div className="bg-surface p-3 rounded-lg text-sm whitespace-pre-line mb-4 border border-gray-100">
                  {subResult}
                </div>
              ) : (
                 <div className="py-4 text-center">
                   {loadingSub ? <Icon name="RefreshCcw" className="animate-spin mx-auto text-primary" /> : <p className="text-sm text-text-muted">Clique em buscar para ver opções da IA.</p>}
                 </div>
              )}

              <div className="flex gap-2">
                 <Button variant="ghost" className="flex-1" onClick={() => setSubModal(null)}>Fechar</Button>
                 {!subResult && <Button className="flex-1" onClick={handleSub} isLoading={loadingSub}>Buscar com IA</Button>}
              </div>
           </Card>
        </div>
      )}
    </div>
  );
};

// --- Shopping List Component ---
export const ShoppingListView: React.FC<{diet: DietPlan}> = ({ diet }) => (
  <div className="p-4 pb-24">
    <Header title="Lista de Compras" subtitle="Organizada para sua semana." />
    
    {diet.shoppingList.map((cat, idx) => (
      <div key={idx} className="mb-6">
        <h3 className="font-display font-bold text-primary mb-3 flex items-center gap-2">
           <span className="w-2 h-6 bg-warning rounded-full block"></span>
           {cat.category}
        </h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
           {cat.items.map((item, i) => (
             <div key={i} className="p-3 flex items-center gap-3">
               <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
               <span className="text-sm text-text-main">{item}</span>
             </div>
           ))}
        </div>
      </div>
    ))}

    <Button fullWidth variant="outline" className="mt-4 gap-2">
       <Icon name="ShoppingCart" size={18} /> Exportar PDF (Premium)
    </Button>
  </div>
);

// --- Chat Component ---
export const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Olá! Sou seu assistente nutricional. Como posso ajudar na sua dieta hoje? 🥗', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if(!input.trim()) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Convert to gemini history format
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const responseText = await chatWithNutritionist(history, userMsg.text);
      const botMsg: ChatMessage = { id: (Date.now()+1).toString(), role: 'model', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
       const errorMsg: ChatMessage = { id: Date.now().toString(), role: 'model', text: 'Desculpe, tive um problema de conexão. Tente novamente.', timestamp: new Date() };
       setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <div className="p-4 border-b bg-white z-10">
         <h1 className="font-display font-bold text-lg text-primary">Chat NutriFácil</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" ref={scrollRef}>
         {messages.map(msg => (
           <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-text-main shadow-sm border border-gray-100 rounded-tl-none'}`}>
                 {msg.text}
              </div>
           </div>
         ))}
         {loading && (
           <div className="flex justify-start">
             <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
             </div>
           </div>
         )}
      </div>

      <div className="p-3 bg-white border-t flex gap-2">
         <input 
           className="flex-1 bg-gray-100 rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
           placeholder="Pergunte sobre sua dieta..."
           value={input}
           onChange={e => setInput(e.target.value)}
           onKeyPress={e => e.key === 'Enter' && handleSend()}
         />
         <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg disabled:opacity-50"
         >
           <Icon name="ChevronLeft" className="rotate-180" size={20} />
         </button>
      </div>
    </div>
  );
};

// --- Profile View (Mock) ---
export const ProfileView: React.FC<{profile: UserProfile}> = ({ profile }) => (
  <div className="p-4 space-y-4">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">👤</div>
      <div>
        <h2 className="font-bold text-xl">{profile.name}</h2>
        <p className="text-sm text-text-muted">Plano Gratuito</p>
      </div>
    </div>

    <Card>
       <h3 className="font-bold mb-4">Assinatura Premium</h3>
       <div className="space-y-3">
         {['Dietas ilimitadas', 'Chat ilimitado com IA', 'Receitas exclusivas', 'Análise de evolução'].map((feat, i) => (
           <div key={i} className="flex items-center gap-2 text-sm">
             <div className="w-5 h-5 bg-warning/20 text-warning rounded-full flex items-center justify-center text-[10px]">✓</div>
             {feat}
           </div>
         ))}
       </div>
       <Button fullWidth className="mt-4 bg-warning text-black hover:bg-yellow-400 shadow-warning/20">
         Assinar Agora (R$ 29,90)
       </Button>
    </Card>

    <div className="space-y-2 mt-4">
       {['Configurações', 'Dados Pessoais', 'Ajuda', 'Sair'].map(item => (
         <button key={item} className="w-full text-left p-4 bg-white rounded-xl text-sm font-medium text-text-main border border-gray-100 flex justify-between">
           {item} <Icon name="ChevronLeft" size={16} className="rotate-180 text-gray-300"/>
         </button>
       ))}
    </div>
  </div>
);
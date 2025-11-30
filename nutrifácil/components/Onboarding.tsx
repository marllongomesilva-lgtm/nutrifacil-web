import React, { useState } from 'react';
import { Button, Input, Select, Header } from './UI';
import { UserProfile, Gender, Goal, ActivityLevel } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    age: undefined,
    weight: undefined,
    height: undefined,
    gender: undefined,
    goal: undefined,
    activityLevel: undefined,
    mealsPerDay: 3,
    restrictions: [],
    dislikes: [],
    budget: 'Médio',
    isPremium: false
  });

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <Header title="Vamos nos conhecer?" subtitle="Precisamos de alguns dados para calcular suas necessidades." />
            <Input 
              label="Nome" 
              placeholder="Como você se chama?" 
              value={formData.name || ''} 
              onChange={e => handleChange('name', e.target.value)} 
            />
            <Input 
              label="Idade" 
              type="number" 
              placeholder="Anos" 
              value={formData.age || ''} 
              onChange={e => handleChange('age', Number(e.target.value))} 
            />
            <Select 
              label="Gênero"
              value={formData.gender || ''}
              onChange={e => handleChange('gender', e.target.value)}
              options={[
                { label: Gender.Male, value: Gender.Male },
                { label: Gender.Female, value: Gender.Female },
              ]}
            />
            <Button fullWidth onClick={nextStep} disabled={!formData.name || !formData.age || !formData.gender}>Próximo</Button>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in">
             <Header title="Medidas e Objetivo" subtitle="Para onde queremos ir?" />
             <div className="flex gap-4">
              <Input 
                className="flex-1"
                label="Peso (kg)" 
                type="number" 
                value={formData.weight || ''} 
                onChange={e => handleChange('weight', Number(e.target.value))} 
              />
              <Input 
                className="flex-1"
                label="Altura (cm)" 
                type="number" 
                value={formData.height || ''} 
                onChange={e => handleChange('height', Number(e.target.value))} 
              />
             </div>
             <Select 
              label="Qual seu objetivo?"
              value={formData.goal || ''}
              onChange={e => handleChange('goal', e.target.value)}
              options={[
                { label: Goal.Lose, value: Goal.Lose },
                { label: Goal.Gain, value: Goal.Gain },
                { label: Goal.Maintain, value: Goal.Maintain },
              ]}
            />
             <Select 
              label="Nível de Atividade"
              value={formData.activityLevel || ''}
              onChange={e => handleChange('activityLevel', e.target.value)}
              options={[
                { label: ActivityLevel.Sedentary, value: ActivityLevel.Sedentary },
                { label: ActivityLevel.Light, value: ActivityLevel.Light },
                { label: ActivityLevel.Moderate, value: ActivityLevel.Moderate },
                { label: ActivityLevel.Heavy, value: ActivityLevel.Heavy },
              ]}
            />
            <div className="flex gap-3 mt-4">
              <Button variant="ghost" onClick={prevStep}>Voltar</Button>
              <Button className="flex-1" onClick={nextStep} disabled={!formData.weight || !formData.height || !formData.goal || !formData.activityLevel}>Próximo</Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in">
            <Header title="Preferências" subtitle="Personalize sua rotina." />
            <Select 
              label="Refeições por dia"
              value={formData.mealsPerDay || 3}
              onChange={e => handleChange('mealsPerDay', Number(e.target.value))}
              options={[
                { label: "3 refeições", value: "3" },
                { label: "4 refeições", value: "4" },
                { label: "5 refeições", value: "5" },
                { label: "6 refeições", value: "6" },
              ]}
            />
            <Input 
              label="O que você NÃO come? (separar por vírgula)"
              placeholder="Ex: Cebola, Fígado..."
              onChange={e => handleChange('dislikes', e.target.value.split(','))}
            />
            <Input 
              label="Restrições Alimentares"
              placeholder="Ex: Sem glúten, Vegano..."
              onChange={e => handleChange('restrictions', e.target.value.split(','))}
            />
            <Select 
              label="Orçamento Semanal"
              value={formData.budget || 'Médio'}
              onChange={e => handleChange('budget', e.target.value)}
              options={[
                { label: "Econômico", value: "Baixo" },
                { label: "Moderado", value: "Médio" },
                { label: "Livre", value: "Alto" },
              ]}
            />
            <div className="flex gap-3 mt-6">
              <Button variant="ghost" onClick={prevStep}>Voltar</Button>
              <Button className="flex-1" onClick={() => onComplete(formData as UserProfile)}>Gerar Dieta Mágica ✨</Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="w-full bg-gray-200 h-2 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-primary h-full transition-all duration-500 ease-out" 
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>
      {renderStep()}
    </div>
  );
};
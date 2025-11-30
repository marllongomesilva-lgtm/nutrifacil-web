import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  fullWidth, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "h-12 px-6 rounded-xl font-display font-bold transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/30",
    secondary: "bg-accent text-white hover:bg-blue-600 shadow-lg shadow-accent/30",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
    ghost: "text-text-main hover:bg-gray-100"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : children}
    </button>
  );
};

export const Card: React.FC<{children: React.ReactNode, className?: string, onClick?: () => void}> = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-xl shadow-soft p-5 border border-gray-100 ${className}`}>
    {children}
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5 mb-4">
    <label className="text-sm font-semibold text-text-main ml-1">{label}</label>
    <input 
      className={`h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all ${className}`}
      {...props}
    />
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string, value: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5 mb-4">
    <label className="text-sm font-semibold text-text-main ml-1">{label}</label>
    <div className="relative">
      <select 
        className={`w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none ${className}`}
        {...props}
      >
        <option value="" disabled>Selecione...</option>
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  </div>
);

export const Header: React.FC<{title: string, subtitle?: string}> = ({ title, subtitle }) => (
  <div className="mb-6">
    <h1 className="font-display font-extrabold text-2xl text-text-main">{title}</h1>
    {subtitle && <p className="text-text-muted text-sm mt-1">{subtitle}</p>}
  </div>
);

export const BottomNav: React.FC<{currentView: string, setView: (v: string) => void}> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', icon: 'Home', label: 'Início' },
    { id: 'diet', icon: 'Utensils', label: 'Dieta' },
    { id: 'chat', icon: 'MessageCircle', label: 'Chat' },
    { id: 'progress', icon: 'TrendingUp', label: 'Evolução' },
    { id: 'profile', icon: 'User', label: 'Perfil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 pb-safe">
      {navItems.map(item => {
        // Simple icon mapping locally to avoid huge imports in this file
        const isActive = currentView === item.id;
        return (
          <button 
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}
          >
            {/* Using a simple SVG placeholder logic or imported icons would be better, but sticking to simple rendering */}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isActive ? 'bg-primary/10' : ''}`}>
               <Icon name={item.icon} size={20} />
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        )
      })}
    </div>
  );
};

// Simple Icon wrapper using Lucide
import { Home, Utensils, MessageCircle, TrendingUp, User, ChevronLeft, RefreshCcw, ShoppingCart, Lock } from 'lucide-react';

export const Icon: React.FC<{name: string, size?: number, className?: string}> = ({ name, size=24, className }) => {
  const icons: any = { Home, Utensils, MessageCircle, TrendingUp, User, ChevronLeft, RefreshCcw, ShoppingCart, Lock };
  const LucideIcon = icons[name] || Home;
  return <LucideIcon size={size} className={className} />;
};
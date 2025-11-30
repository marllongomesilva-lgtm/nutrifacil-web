export enum Gender {
  Male = 'Masculino',
  Female = 'Feminino',
  Other = 'Outro'
}

export enum Goal {
  Lose = 'Emagrecer',
  Gain = 'Ganhar Massa',
  Maintain = 'Manter Peso'
}

export enum ActivityLevel {
  Sedentary = 'Sedentário',
  Light = 'Levemente Ativo',
  Moderate = 'Moderado',
  Heavy = 'Muito Ativo'
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  goal: Goal;
  activityLevel: ActivityLevel;
  mealsPerDay: number;
  restrictions: string[];
  dislikes: string[];
  budget: string;
  isPremium: boolean;
}

export interface MacroNutrients {
  protein: number;
  carbs: number;
  fats: number;
}

export interface FoodItem {
  name: string;
  quantity: string;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  macros: MacroNutrients;
  items: FoodItem[];
  imageKeyword?: string; // used to fetch generic image
}

export interface DietPlan {
  totalCalories: number;
  dailyMacros: MacroNutrients;
  meals: Meal[];
  shoppingList: {
    category: string;
    items: string[];
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Recipe {
  id: string;
  title: string;
  calories: number;
  time: string;
  image: string;
  tags: string[];
}
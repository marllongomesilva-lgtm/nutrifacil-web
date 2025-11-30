import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, DietPlan } from "../types";

// Declaração para evitar erro de TypeScript na Vercel
declare var process: any;

// Initialize the client directly with process.env.API_KEY as per strict guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const dietSchema = {
  type: Type.OBJECT,
  properties: {
    totalCalories: { type: Type.NUMBER, description: "Total daily calories target" },
    dailyMacros: {
      type: Type.OBJECT,
      properties: {
        protein: { type: Type.NUMBER, description: "Total grams of protein" },
        carbs: { type: Type.NUMBER, description: "Total grams of carbs" },
        fats: { type: Type.NUMBER, description: "Total grams of fats" },
      },
      required: ["protein", "carbs", "fats"]
    },
    meals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING, description: "e.g., Café da Manhã" },
          time: { type: Type.STRING, description: "e.g., 08:00" },
          calories: { type: Type.NUMBER },
          macros: {
            type: Type.OBJECT,
            properties: {
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fats: { type: Type.NUMBER }
            }
          },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                quantity: { type: Type.STRING }
              }
            }
          },
          imageKeyword: { type: Type.STRING, description: "A simple English keyword for image search, e.g., 'oatmeal', 'grilled chicken'" }
        },
        required: ["name", "time", "calories", "items", "imageKeyword"]
      }
    },
    shoppingList: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          items: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  },
  required: ["totalCalories", "dailyMacros", "meals", "shoppingList"]
};

export const generateDietPlan = async (profile: UserProfile): Promise<DietPlan> => {
  const prompt = `
    Crie um plano de dieta completo para um usuário com o seguinte perfil:
    Idade: ${profile.age}, Peso: ${profile.weight}kg, Altura: ${profile.height}cm.
    Objetivo: ${profile.goal}.
    Nível de Atividade: ${profile.activityLevel}.
    Refeições por dia: ${profile.mealsPerDay}.
    Restrições: ${profile.restrictions.join(', ') || 'Nenhuma'}.
    Não gosta de: ${profile.dislikes.join(', ') || 'Nada'}.
    Orçamento: ${profile.budget}.
    
    A dieta deve ser prática e realista para o Brasil. 
    Retorne APENAS o JSON seguindo o schema especificado.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: dietSchema,
        temperature: 0.7
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as DietPlan;
    }
    throw new Error("No content generated");
  } catch (error) {
    console.error("Error generating diet:", error);
    throw error;
  }
};

export const getSubstitution = async (originalFood: string, calories: number): Promise<string> => {
  const prompt = `Sugira 3 opções de substituição para "${originalFood}" que tenham aproximadamente ${calories} calorias. Seja direto e breve. Formate como uma lista simples.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text || "Não foi possível encontrar substituições no momento.";
};

export const chatWithNutritionist = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: history,
    config: {
      systemInstruction: "Você é o NutriFácil, um assistente nutricional amigável, motivador e especialista. Responda de forma clara, concisa e direta. Use emojis ocasionalmente. Fale português do Brasil."
    }
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};
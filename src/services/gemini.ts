import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Meal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const generateMealPlan = async (profile: UserProfile): Promise<Meal[]> => {
  const prompt = `Generate a 7-day meal plan for a user with the following profile:
    Name: ${profile.name}
    Age: ${profile.age}
    Weight: ${profile.weight}kg
    Height: ${profile.height}cm
    Goal: ${profile.goal}
    Activity Level: ${profile.activityLevel}
    
    Return the plan as a JSON array of objects, each with 'day', 'breakfast', 'lunch', 'snack', and 'dinner' fields.
    Use Portuguese (pt-BR) for the food descriptions.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING },
            breakfast: { type: Type.STRING },
            lunch: { type: Type.STRING },
            snack: { type: Type.STRING },
            dinner: { type: Type.STRING },
          },
          required: ["day", "breakfast", "lunch", "snack", "dinner"],
        },
      },
    },
  });

  return JSON.parse(response.text || "[]");
};

export const chatWithNutritionist = async (messages: { role: 'user' | 'model', text: string }[], profile: UserProfile) => {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `Você é o Vixora, um nutricionista virtual inteligente e empático. 
      Seu objetivo é ajudar o usuário (${profile.name}) a atingir seu objetivo de ${profile.goal}.
      Seu tom deve ser profissional, motivador e baseado em evidências científicas.
      Responda sempre em Português (pt-BR).`,
    },
  });

  // Reconstruct history
  const history = messages.slice(0, -1).map(m => ({
    role: m.role,
    parts: [{ text: m.text }]
  }));

  const lastMessage = messages[messages.length - 1].text;
  
  const response = await chat.sendMessage({ message: lastMessage });
  return response.text;
};

export const adjustPlanWithInventory = async (inventory: string, profile: UserProfile): Promise<string> => {
  const prompt = `O usuário (${profile.name}) tem os seguintes ingredientes em casa: "${inventory}".
  Com base no seu objetivo de ${profile.goal}, sugira como ele pode adaptar sua dieta de hoje ou criar uma refeição saudável usando esses ingredientes.
  Seja prático e criativo. Responda em Português (pt-BR).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text || "Não consegui processar sua solicitação.";
};

export const analyzeFoodImage = async (base64Image: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Image.split(',')[1], mimeType: "image/jpeg" } },
        { text: "Analise esta imagem de comida. Identifique o que é, estime as calorias e macronutrientes (proteínas, carboidratos, gorduras). Responda em Português (pt-BR) de forma concisa." }
      ]
    }
  });
  return response.text;
};

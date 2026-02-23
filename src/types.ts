
export interface Meal {
  day: string;
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance';
  activityLevel: 'sedentary' | 'moderate' | 'active';
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

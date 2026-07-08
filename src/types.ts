export interface UserProfile {
  name: string;
  avatar: string;
  wallet: number; // in dollars, e.g. 5.50
  stars: number;
  completedModules: string[]; // IDs of completed modules
  choreEarnings: number;
  savingsGoal: {
    name: string;
    target: number;
    saved: number;
  };
  jarSave: number;
  jarSpend: number;
  jarGive: number;
}

export interface ModuleDefinition {
  id: string;
  title: string;
  description: string;
  iconName: string; // Lucide icon name mapping
  category: 'Earn' | 'Save' | 'Spend' | 'Give' | 'Basics' | 'Quiz';
  difficulty: 'Elementary' | 'Middle' | 'High';
  starsReward: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Chore {
  id: string;
  task: string;
  payout: number;
  completed: boolean;
  icon: string;
}

export interface NeedWantItem {
  id: string;
  name: string;
  type: 'need' | 'want';
  icon: string;
  explanation: string;
  color: string;
}

export interface SweetShopItem {
  id: string;
  name: string;
  price: number;
  icon: string;
  color: string;
}

export interface WorksheetTemplate {
  id: string;
  title: string;
  gradeLevel: 'Elementary' | 'Middle' | 'High';
  description: string;
  questions: {
    question: string;
    answerType: 'text' | 'choice' | 'math';
    options?: string[];
    correctAnswer?: string;
  }[];
}

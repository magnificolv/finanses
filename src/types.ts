export interface SubCategory {
  id: string;
  name: string;
}

export interface MainCategory {
  id: string;
  name: string;
  icon: string;
  subCategories: SubCategory[];
}

export interface Expense {
  id: string;
  amount: number;
  mainCategoryId: string;
  subCategoryId: string; // "uncategorized" if not specified
  note?: string;
  date: string; // ISO string
}

export interface Saving {
  id: string;
  amount: number;
  description: string;
  date: string; // ISO string
}

export interface AppState {
  expenses: Expense[];
  savings: Saving[];
  categories: MainCategory[];
  version: string;
}

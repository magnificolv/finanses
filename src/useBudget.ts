import { useState, useEffect } from "react";
import { AppState, Expense, Saving, MainCategory } from "./types";
import { DEFAULT_CATEGORIES, APP_VERSION } from "./constants";

const STORAGE_KEY = "budget_app_state";

export function useBudget() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
    return {
      expenses: [],
      savings: [],
      categories: DEFAULT_CATEGORIES,
      version: APP_VERSION,
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = { ...expense, id: crypto.randomUUID() };
    setState((prev) => ({
      ...prev,
      expenses: [newExpense, ...prev.expenses],
    }));
  };

  const addSaving = (saving: Omit<Saving, "id">) => {
    const newSaving = { ...saving, id: crypto.randomUUID() };
    setState((prev) => ({
      ...prev,
      savings: [newSaving, ...prev.savings],
    }));
  };

  const addCategory = (category: Omit<MainCategory, "id">) => {
    const newCategory = { ...category, id: crypto.randomUUID() };
    setState((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
  };

  const addSubCategory = (mainCategoryId: string, name: string) => {
    setState((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === mainCategoryId
          ? {
              ...cat,
              subCategories: [
                ...cat.subCategories,
                { id: crypto.randomUUID(), name },
              ],
            }
          : cat
      ),
    }));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `budzets_export_${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return {
    state,
    addExpense,
    addSaving,
    addCategory,
    addSubCategory,
    exportData,
  };
}

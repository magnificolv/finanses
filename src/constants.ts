import { MainCategory } from "./types";

export const DEFAULT_CATEGORIES: MainCategory[] = [
  {
    id: "food",
    name: "Ēdiens",
    icon: "Utensils",
    subCategories: [
      { id: "groceries", name: "Pārtika" },
      { id: "dining-out", name: "Restorāni" },
      { id: "snacks", name: "Uzkodas" },
    ],
  },
  {
    id: "transport",
    name: "Transports",
    icon: "Car",
    subCategories: [
      { id: "fuel", name: "Degviela" },
      { id: "public-transport", name: "Sabiedriskais" },
      { id: "parking", name: "Stāvvieta" },
    ],
  },
  {
    id: "housing",
    name: "Mājoklis",
    icon: "Home",
    subCategories: [
      { id: "rent", name: "Īre" },
      { id: "utilities", name: "Komunālie" },
      { id: "repairs", name: "Remonts" },
    ],
  },
  {
    id: "entertainment",
    name: "Izklaide",
    icon: "Film",
    subCategories: [
      { id: "cinema", name: "Kino" },
      { id: "games", name: "Spēles" },
      { id: "events", name: "Pasākumi" },
    ],
  },
  {
    id: "health",
    name: "Veselība",
    icon: "Activity",
    subCategories: [
      { id: "pharmacy", name: "Aptieka" },
      { id: "doctor", name: "Ārsts" },
      { id: "gym", name: "Zāle" },
    ],
  },
  {
    id: "other",
    name: "Citi",
    icon: "MoreHorizontal",
    subCategories: [],
  },
];

export const APP_VERSION = "1.0.0";
export const UNCATEGORIZED_ID = "uncategorized";
export const UNCATEGORIZED_NAME = "Nav norādīts";

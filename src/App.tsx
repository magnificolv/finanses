import React, { useState } from "react";
import { Plus, Minus, TrendingUp, PieChart, Settings, PlusCircle, ChevronRight, Save, Download, Info } from "lucide-react";
import { useBudget } from "./useBudget";
import { UNCATEGORIZED_ID, UNCATEGORIZED_NAME, APP_VERSION } from "./constants";
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RePieChart, Pie } from "recharts";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const { state, addExpense, addSaving, addCategory, addSubCategory, exportData } = useBudget();
  const [activeTab, setActiveTab] = useState<"entry" | "stats" | "savings" | "settings">("entry");

  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(UNCATEGORIZED_ID);
  const [note, setNote] = useState("");

  const [savingAmount, setSavingAmount] = useState("");
  const [savingDesc, setSavingDesc] = useState("");

  const [newCatName, setNewCatName] = useState("");
  const [newSubCatName, setNewSubCatName] = useState("");
  const [addingSubTo, setAddingSubTo] = useState<string | null>(null);

  const handleAddExpense = () => {
    if (!amount || !selectedCategory) return;
    addExpense({
      amount: parseFloat(amount),
      mainCategoryId: selectedCategory,
      subCategoryId: selectedSubCategory,
      note,
      date: new Date().toISOString(),
    });
    setAmount("");
    setSelectedCategory(null);
    setSelectedSubCategory(UNCATEGORIZED_ID);
    setNote("");
  };

  const handleAddSaving = () => {
    if (!savingAmount || !savingDesc) return;
    addSaving({
      amount: parseFloat(savingAmount),
      description: savingDesc,
      date: new Date().toISOString(),
    });
    setSavingAmount("");
    setSavingDesc("");
  };

  const currentMonthExpenses = state.expenses.filter((e) =>
    isWithinInterval(parseISO(e.date), {
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
    })
  );

  const totalMonthly = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSavings = state.savings.reduce((sum, s) => sum + s.amount, 0);

  const categoryData = state.categories.map((cat) => ({
    name: cat.name,
    value: currentMonthExpenses
      .filter((e) => e.mainCategoryId === cat.id)
      .reduce((sum, e) => sum + e.amount, 0),
  })).filter(d => d.value > 0);

  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-20">
      {/* Header */}
      <header className="p-6 border-b border-neutral-800 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Budžeta Trackers</h1>
          <p className="text-neutral-500 text-sm">Pārvaldi savas finanses gudri</p>
        </div>
        <div className="bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium">€ {totalMonthly.toFixed(2)}</span>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto">
        {activeTab === "entry" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 shadow-xl">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Summa (€)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent text-5xl font-bold outline-none border-b border-neutral-800 pb-4 mb-6 focus:border-blue-500 transition-colors"
              />

              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">Kategorija</label>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {state.categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedSubCategory(UNCATEGORIZED_ID);
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all",
                      selectedCategory === cat.id
                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20"
                        : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-500"
                    )}
                  >
                    <span className="text-xs font-medium truncate w-full text-center">{cat.name}</span>
                  </button>
                ))}
              </div>

              {selectedCategory && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">Apakškategorija (pēc izvēles)</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedSubCategory(UNCATEGORIZED_ID)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm border transition-all",
                        selectedSubCategory === UNCATEGORIZED_ID
                          ? "bg-neutral-100 text-neutral-900 border-neutral-100"
                          : "bg-neutral-800 text-neutral-400 border-neutral-700"
                      )}
                    >
                      {UNCATEGORIZED_NAME}
                    </button>
                    {state.categories.find(c => c.id === selectedCategory)?.subCategories.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => setSelectedSubCategory(sub.id)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm border transition-all",
                          selectedSubCategory === sub.id
                            ? "bg-neutral-100 text-neutral-900 border-neutral-100"
                            : "bg-neutral-800 text-neutral-400 border-neutral-700"
                        )}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Piezīme</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Kas tika nopirkts?"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-500 transition-colors"
                />
              </div>

              <button
                onClick={handleAddExpense}
                disabled={!amount || !selectedCategory}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Pievienot tēriņu
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 px-2">Pēdējie tēriņi</h3>
              {state.expenses.slice(0, 5).map((exp) => {
                const cat = state.categories.find(c => c.id === exp.mainCategoryId);
                const sub = cat?.subCategories.find(s => s.id === exp.subCategoryId);
                return (
                  <div key={exp.id} className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{cat?.name || "Nezināms"}</p>
                      <p className="text-xs text-neutral-500">
                        {sub?.name || UNCATEGORIZED_NAME} • {format(parseISO(exp.date), "dd.MM.yyyy")}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-red-400">-€{exp.amount.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 shadow-xl">
              <h3 className="text-lg font-bold mb-6">Mēneša pārskats</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
                      itemStyle={{ color: '#f5f5f5' }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {categoryData.map((data, index) => (
                  <div key={data.name} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span>{data.name}</span>
                    </div>
                    <span className="font-mono font-semibold">€{data.value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 shadow-xl">
              <h3 className="text-lg font-bold mb-4">Kopējie ietaupījumi</h3>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-emerald-500/10 rounded-2xl">
                  <TrendingUp className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-500">€{totalSavings.toFixed(2)}</p>
                  <p className="text-sm text-neutral-500">Kopš lietošanas sākuma</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "savings" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 shadow-xl">
              <h3 className="text-lg font-bold mb-4">Pievienot ietaupījumu</h3>
              <p className="text-sm text-neutral-500 mb-6">Piemēram: "Uztaisīju kafiju mājās, nevis pirku automātā"</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Ietaupītā summa (€)</label>
                  <input
                    type="number"
                    value={savingAmount}
                    onChange={(e) => setSavingAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Apraksts</label>
                  <input
                    type="text"
                    value={savingDesc}
                    onChange={(e) => setSavingDesc(e.target.value)}
                    placeholder="Kā tu ietaupīji?"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>
                <button
                  onClick={handleAddSaving}
                  disabled={!savingAmount || !savingDesc}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Saglabāt ietaupījumu
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 px-2">Ietaupījumu vēsture</h3>
              {state.savings.map((s) => (
                <div key={s.id} className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{s.description}</p>
                    <p className="text-xs text-neutral-500">{format(parseISO(s.date), "dd.MM.yyyy")}</p>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">+€{s.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 shadow-xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-500" />
                Pārvaldīt kategorijas
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Jauna galvenā kategorija</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="Nosaukums"
                      className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-sm outline-none"
                    />
                    <button
                      onClick={() => {
                        if (newCatName) {
                          addCategory({ name: newCatName, icon: "MoreHorizontal", subCategories: [] });
                          setNewCatName("");
                        }
                      }}
                      className="bg-blue-600 p-2 rounded-xl"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">Esošās kategorijas</label>
                  {state.categories.map(cat => (
                    <div key={cat.id} className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-neutral-800 rounded-xl">
                        <span className="font-medium">{cat.name}</span>
                        <button 
                          onClick={() => setAddingSubTo(addingSubTo === cat.id ? null : cat.id)}
                          className="text-xs text-blue-400 font-semibold"
                        >
                          + Apakškategorija
                        </button>
                      </div>
                      {addingSubTo === cat.id && (
                        <div className="flex gap-2 pl-4 animate-in slide-in-from-top-2 duration-200">
                          <input
                            type="text"
                            value={newSubCatName}
                            onChange={(e) => setNewSubCatName(e.target.value)}
                            placeholder="Apakškategorijas nosaukums"
                            className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-sm outline-none"
                          />
                          <button
                            onClick={() => {
                              if (newSubCatName) {
                                addSubCategory(cat.id, newSubCatName);
                                setNewSubCatName("");
                                setAddingSubTo(null);
                              }
                            }}
                            className="bg-blue-600 p-2 rounded-xl"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 pl-4">
                        {cat.subCategories.map(sub => (
                          <span key={sub.id} className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-1 rounded-full border border-neutral-700">
                            {sub.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 shadow-xl space-y-4">
              <h3 className="text-lg font-bold mb-2">Dati un Sistēma</h3>
              <button
                onClick={exportData}
                className="w-full flex items-center justify-between p-4 bg-neutral-800 hover:bg-neutral-700 rounded-2xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-blue-400" />
                  <span className="font-medium">Eksportēt datus (JSON)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </button>

              <div className="p-4 bg-neutral-800 rounded-2xl space-y-2">
                <div className="flex items-center gap-3 text-neutral-400">
                  <Info className="w-5 h-5" />
                  <span className="text-sm">Versija: {APP_VERSION}</span>
                </div>
                <p className="text-[10px] text-neutral-500 italic">
                  Atjauninājumi tiek piegādāti caur GitHub. Lietotne ir instalējama kā PWA.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-neutral-950/80 backdrop-blur-xl border-t border-neutral-800 p-4 flex justify-around items-center z-50">
        <button
          onClick={() => setActiveTab("entry")}
          className={cn("p-2 rounded-xl transition-all", activeTab === "entry" ? "text-blue-500 bg-blue-500/10" : "text-neutral-500")}
        >
          <PlusCircle className="w-6 h-6" />
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={cn("p-2 rounded-xl transition-all", activeTab === "stats" ? "text-blue-500 bg-blue-500/10" : "text-neutral-500")}
        >
          <PieChart className="w-6 h-6" />
        </button>
        <button
          onClick={() => setActiveTab("savings")}
          className={cn("p-2 rounded-xl transition-all", activeTab === "savings" ? "text-emerald-500 bg-emerald-500/10" : "text-neutral-500")}
        >
          <TrendingUp className="w-6 h-6" />
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={cn("p-2 rounded-xl transition-all", activeTab === "settings" ? "text-blue-500 bg-blue-500/10" : "text-neutral-500")}
        >
          <Settings className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
}

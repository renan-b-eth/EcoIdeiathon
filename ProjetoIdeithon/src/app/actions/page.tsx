"use client";

import { useState } from "react";
import { Search, Filter, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ActionCard from "@/components/ActionCard";
import { ecoActions, categoryLabels, type EcoAction } from "@/lib/data";
import { cn } from "@/lib/utils";

const categories = ["all", "transport", "energy", "food", "waste", "water"];

export default function ActionsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCO2, setTotalCO2] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const filteredActions = ecoActions.filter((action) => {
    const matchesCategory = selectedCategory === "all" || action.category === selectedCategory;
    const matchesSearch =
      action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleComplete = (action: EcoAction) => {
    setCompletedCount((c) => c + 1);
    setTotalCO2((c) => Math.round((c + action.co2Saved) * 10) / 10);
    setTotalPoints((c) => c + action.points);
  };

  return (
    <main className="min-h-screen gradient-eco-bg">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Ações Sustentáveis</h1>
              <p className="text-gray-400">Registre suas ações e veja o impacto</p>
            </div>
            {completedCount > 0 && (
              <div className="flex items-center gap-4">
                <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-eco-400" />
                  <span className="text-sm text-white font-medium">{completedCount} ações</span>
                </div>
                <div className="glass rounded-xl px-4 py-2">
                  <span className="text-sm text-eco-400 font-medium">-{totalCO2}kg CO₂</span>
                </div>
                <div className="glass rounded-xl px-4 py-2">
                  <span className="text-sm text-yellow-400 font-medium">+{totalPoints} pts</span>
                </div>
              </div>
            )}
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar ações..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl glass border border-white/10 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:border-eco-500/50 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Filter className="w-4 h-4 text-gray-500 shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                    selectedCategory === cat
                      ? "gradient-eco text-white shadow-lg shadow-eco-500/25"
                      : "glass text-gray-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  {cat === "all" ? "Todas" : categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActions.map((action) => (
              <ActionCard key={action.id} action={action} onComplete={handleComplete} />
            ))}
          </div>

          {filteredActions.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Nenhuma ação encontrada</p>
              <p className="text-gray-600 text-sm mt-1">Tente ajustar os filtros</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

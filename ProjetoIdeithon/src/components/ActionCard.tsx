"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { EcoAction } from "@/lib/data";
import { categoryColors, categoryLabels } from "@/lib/data";
import {
  Bike, Bus, Salad, Recycle, Droplets, LightbulbOff,
  ShoppingBag, Home, Sun, Sprout, CupSoda, TreePine, Check
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  bike: Bike,
  bus: Bus,
  salad: Salad,
  recycle: Recycle,
  droplets: Droplets,
  "lightbulb-off": LightbulbOff,
  "shopping-bag": ShoppingBag,
  home: Home,
  sun: Sun,
  sprout: Sprout,
  "cup-soda": CupSoda,
  "tree-pine": TreePine,
};

interface ActionCardProps {
  action: EcoAction;
  onComplete?: (action: EcoAction) => void;
}

export default function ActionCard({ action, onComplete }: ActionCardProps) {
  const [completed, setCompleted] = useState(false);
  const Icon = iconMap[action.icon] || Recycle;

  const handleComplete = () => {
    setCompleted(true);
    onComplete?.(action);
    setTimeout(() => setCompleted(false), 2000);
  };

  return (
    <div
      className={cn(
        "glass rounded-xl p-5 glass-hover transition-all duration-300",
        completed && "border-eco-500/50 glow"
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", `${categoryColors[action.category]}/20`)}>
          <Icon className={cn("w-6 h-6", completed ? "text-eco-400" : "text-gray-300")} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-white truncate">{action.title}</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 shrink-0">
              {categoryLabels[action.category]}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-3">{action.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs text-eco-400 font-medium">-{action.co2Saved}kg CO₂</span>
              <span className="text-xs text-yellow-400 font-medium">+{action.points} pts</span>
            </div>
            <button
              onClick={handleComplete}
              disabled={completed}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                completed
                  ? "bg-eco-500 text-white"
                  : "bg-white/5 text-gray-300 hover:bg-eco-500/20 hover:text-eco-400 border border-white/10 hover:border-eco-500/30"
              )}
            >
              {completed ? (
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3" /> Feito!
                </span>
              ) : (
                "Registrar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

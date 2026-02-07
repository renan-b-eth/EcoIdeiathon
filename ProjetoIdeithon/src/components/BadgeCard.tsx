"use client";

import { cn } from "@/lib/utils";
import type { Badge } from "@/lib/data";
import { Award } from "lucide-react";

interface BadgeCardProps {
  badge: Badge;
}

export default function BadgeCard({ badge }: BadgeCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-4 glass-hover relative overflow-hidden",
        badge.earned && "border-eco-500/30 glow-sm"
      )}
    >
      {badge.earned && (
        <div className="absolute top-2 right-2">
          <div className="w-5 h-5 rounded-full bg-eco-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center text-center gap-3">
        <div
          className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center",
            badge.earned ? "bg-eco-500/20" : "bg-white/5"
          )}
        >
          <Award
            className={cn("w-7 h-7", badge.earned ? "text-eco-400" : "text-gray-600")}
          />
        </div>
        <div>
          <p className={cn("text-sm font-semibold", badge.earned ? "text-white" : "text-gray-500")}>
            {badge.name}
          </p>
          <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
        </div>
        {!badge.earned && (
          <div className="w-full">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progresso</span>
              <span>{badge.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-eco-500/50 rounded-full transition-all"
                style={{ width: `${badge.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

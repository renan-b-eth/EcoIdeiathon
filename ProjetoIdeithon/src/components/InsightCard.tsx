"use client";

import { TrendingUp, AlertTriangle, Link2, BarChart3, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Insight } from "@/lib/ai-engine";

const iconMap = {
  trend: TrendingUp,
  anomaly: AlertTriangle,
  correlation: Link2,
  distribution: BarChart3,
  summary: Info,
};

const severityStyles = {
  info: "border-blue-500/30 bg-blue-500/5",
  warning: "border-amber-500/30 bg-amber-500/5",
  success: "border-emerald-500/30 bg-emerald-500/5",
};

const severityIcon = {
  info: "text-blue-400",
  warning: "text-amber-400",
  success: "text-emerald-400",
};

export default function InsightCard({ insight }: { insight: Insight }) {
  const Icon = iconMap[insight.type];

  return (
    <div className={cn("rounded-xl border p-5 transition-all hover:scale-[1.01]", severityStyles[insight.severity])}>
      <div className="flex items-start gap-3">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-white/5", severityIcon[insight.severity])}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-sm font-semibold text-white truncate">{insight.title}</h3>
            {insight.value && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300 shrink-0 font-mono">
                {insight.value}
              </span>
            )}
          </div>
          <p
            className="text-xs text-gray-400 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: insight.description
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>'),
            }}
          />
        </div>
      </div>
    </div>
  );
}

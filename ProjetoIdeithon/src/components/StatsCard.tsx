"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  className?: string;
}

export default function StatsCard({ title, value, subtitle, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <div className={cn("glass rounded-2xl p-6 glass-hover glow-sm", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-3xl font-bold mt-1 text-white">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <p className="text-xs text-eco-400 mt-2 font-medium">
              {trend}
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-eco-500/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-eco-400" />
        </div>
      </div>
    </div>
  );
}

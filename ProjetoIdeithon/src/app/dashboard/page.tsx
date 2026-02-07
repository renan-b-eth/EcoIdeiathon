"use client";

import { Cloud, Flame, Leaf, Star, TreePine, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatsCard from "@/components/StatsCard";
import WeeklyChart from "@/components/WeeklyChart";
import BadgeCard from "@/components/BadgeCard";
import { mockUserStats, mockBadges } from "@/lib/data";

export default function DashboardPage() {
  const stats = mockUserStats;

  return (
    <main className="min-h-screen gradient-eco-bg">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Seu Dashboard</h1>
            <p className="text-gray-400">Acompanhe seu impacto ambiental em tempo real</p>
          </div>

          {/* Level Progress */}
          <div className="glass rounded-2xl p-6 mb-8 glow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl gradient-eco flex items-center justify-center shadow-lg shadow-eco-500/25">
                  <span className="text-xl font-bold text-white">{stats.level}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Nível {stats.level} — Eco Guerreiro</p>
                  <p className="text-sm text-gray-400">840 pts para o próximo nível</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-orange-300">{stats.streak} dias seguidos!</span>
              </div>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full gradient-eco rounded-full transition-all duration-1000"
                style={{ width: "70%" }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">2.840 pts</span>
              <span className="text-xs text-gray-500">3.680 pts</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="CO₂ Economizado"
              value={`${stats.totalCO2Saved}kg`}
              subtitle="Total acumulado"
              icon={Cloud}
              trend="↑ 12% esta semana"
            />
            <StatsCard
              title="Pontos Totais"
              value={stats.totalPoints.toLocaleString()}
              subtitle="Ranking #4 global"
              icon={Star}
              trend="↑ 605 pts esta semana"
            />
            <StatsCard
              title="Ações Hoje"
              value={stats.actionsToday}
              subtitle="Meta diária: 5"
              icon={Zap}
            />
            <StatsCard
              title="Árvores Equivalentes"
              value={stats.treesEquivalent}
              subtitle="Baseado no CO₂ economizado"
              icon={TreePine}
              trend="↑ 1 nova esta semana"
            />
          </div>

          {/* Chart + Badges */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WeeklyChart />
            </div>
            <div className="glass rounded-2xl p-6 glow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Badges Recentes</h3>
                <Leaf className="w-5 h-5 text-eco-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {mockBadges.slice(0, 4).map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

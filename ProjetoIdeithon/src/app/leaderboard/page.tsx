"use client";

import { Trophy, Medal, Crown, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { mockLeaderboard } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen gradient-eco-bg">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Ranking Global</h1>
            <p className="text-gray-400">Veja quem está liderando a corrida pela sustentabilidade</p>
          </div>

          {/* Top 3 Podium */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {/* 2nd place */}
            <div className="glass rounded-2xl p-6 text-center mt-8 glass-hover">
              <div className="w-16 h-16 rounded-full bg-gray-400/20 border-2 border-gray-400 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-gray-300">{mockLeaderboard[1].avatar}</span>
              </div>
              <Medal className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white truncate">{mockLeaderboard[1].name}</p>
              <p className="text-xs text-gray-400 mt-1">{mockLeaderboard[1].points.toLocaleString()} pts</p>
              <p className="text-xs text-eco-400 mt-0.5">-{mockLeaderboard[1].co2Saved}kg CO₂</p>
            </div>

            {/* 1st place */}
            <div className="glass rounded-2xl p-6 text-center glow border-yellow-500/30 glass-hover">
              <div className="w-20 h-20 rounded-full bg-yellow-500/20 border-2 border-yellow-500 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-yellow-300">{mockLeaderboard[0].avatar}</span>
              </div>
              <Crown className="w-7 h-7 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white truncate">{mockLeaderboard[0].name}</p>
              <p className="text-xs text-gray-400 mt-1">{mockLeaderboard[0].points.toLocaleString()} pts</p>
              <p className="text-xs text-eco-400 mt-0.5">-{mockLeaderboard[0].co2Saved}kg CO₂</p>
              <div className="mt-3 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 inline-block">
                <span className="text-[10px] text-yellow-300 font-medium">Nível {mockLeaderboard[0].level}</span>
              </div>
            </div>

            {/* 3rd place */}
            <div className="glass rounded-2xl p-6 text-center mt-12 glass-hover">
              <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-600 flex items-center justify-center mx-auto mb-3">
                <span className="text-base font-bold text-orange-300">{mockLeaderboard[2].avatar}</span>
              </div>
              <Medal className="w-5 h-5 text-orange-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white truncate">{mockLeaderboard[2].name}</p>
              <p className="text-xs text-gray-400 mt-1">{mockLeaderboard[2].points.toLocaleString()} pts</p>
              <p className="text-xs text-eco-400 mt-0.5">-{mockLeaderboard[2].co2Saved}kg CO₂</p>
            </div>
          </div>

          {/* Full Leaderboard */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-eco-400" />
                <h2 className="text-lg font-semibold text-white">Classificação Completa</h2>
              </div>
            </div>

            <div className="divide-y divide-white/5">
              {mockLeaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={cn(
                    "flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/5",
                    entry.name === "Você" && "bg-eco-500/5 border-l-2 border-eco-500"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                    entry.rank === 1 && "bg-yellow-500/20 text-yellow-400",
                    entry.rank === 2 && "bg-gray-400/20 text-gray-300",
                    entry.rank === 3 && "bg-orange-500/20 text-orange-400",
                    entry.rank > 3 && "bg-white/5 text-gray-500"
                  )}>
                    {entry.rank}
                  </div>

                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                    entry.name === "Você"
                      ? "gradient-eco text-white"
                      : "bg-white/10 text-gray-300"
                  )}>
                    {entry.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      entry.name === "Você" ? "text-eco-400" : "text-white"
                    )}>
                      {entry.name}
                      {entry.name === "Você" && (
                        <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-eco-500/20 text-eco-300">
                          Você
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">Nível {entry.level}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-white">{entry.points.toLocaleString()} pts</p>
                    <p className="text-xs text-eco-400">-{entry.co2Saved}kg CO₂</p>
                  </div>

                  {entry.rank <= 3 && (
                    <TrendingUp className="w-4 h-4 text-eco-400 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

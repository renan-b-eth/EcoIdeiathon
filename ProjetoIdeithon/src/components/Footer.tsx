import { Leaf, Github, Twitter, Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-eco flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gradient">EcoImpact</span>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              Transforme suas ações diárias em impacto real. Cada pequena escolha
              sustentável conta para um futuro melhor para todos.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Plataforma</h3>
            <ul className="space-y-2">
              <li><Link href="/dashboard" className="text-sm text-gray-400 hover:text-eco-400 transition-colors">Dashboard</Link></li>
              <li><Link href="/actions" className="text-sm text-gray-400 hover:text-eco-400 transition-colors">Ações</Link></li>
              <li><Link href="/leaderboard" className="text-sm text-gray-400 hover:text-eco-400 transition-colors">Ranking</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Comunidade</h3>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Github className="w-4 h-4 text-gray-400" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Twitter className="w-4 h-4 text-gray-400" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © 2026 EcoImpact. Feito com propósito.
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Feito com <Heart className="w-3 h-3 text-eco-500" /> para o planeta
          </p>
        </div>
      </div>
    </footer>
  );
}

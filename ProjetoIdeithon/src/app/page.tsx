import Link from "next/link";
import { Leaf, ArrowRight, BarChart3, Users, Zap, TreePine, Droplets, Wind, Shield, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  {
    icon: Zap,
    title: "Registre Ações",
    description: "Registre suas ações sustentáveis diárias e veja o impacto real que você está causando no planeta.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Inteligente",
    description: "Visualize seu progresso com gráficos interativos e métricas detalhadas de CO₂ economizado.",
  },
  {
    icon: Users,
    title: "Compete & Colabore",
    description: "Ranking global com amigos. Ganhe badges, suba de nível e inspire outros a serem sustentáveis.",
  },
  {
    icon: Shield,
    title: "Dados Verificáveis",
    description: "Cada ação é calculada com base em dados científicos reais de emissão de carbono.",
  },
];

const impactNumbers = [
  { value: "127.5", unit: "toneladas", label: "CO₂ economizado pela comunidade", icon: Wind },
  { value: "2.4K", unit: "usuários", label: "Pessoas fazendo a diferença", icon: Users },
  { value: "15K", unit: "ações", label: "Ações sustentáveis registradas", icon: Sparkles },
  { value: "340", unit: "árvores", label: "Equivalente em árvores plantadas", icon: TreePine },
];

export default function HomePage() {
  return (
    <main className="min-h-screen gradient-eco-bg">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-eco-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-eco-500/20 mb-8">
              <Leaf className="w-4 h-4 text-eco-400" />
              <span className="text-sm text-eco-300">Plataforma #1 de Impacto Ambiental</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Transforme suas{" "}
              <span className="text-gradient">ações diárias</span>
              {" "}em impacto real
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Rastreie seu impacto ambiental, ganhe pontos por ações sustentáveis,
              compete com amigos e ajude a construir um futuro mais verde.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 px-8 py-4 rounded-xl gradient-eco text-white font-semibold text-lg hover:opacity-90 transition-all shadow-lg shadow-eco-500/25"
              >
                Começar Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/actions"
                className="flex items-center gap-2 px-8 py-4 rounded-xl glass glass-hover text-white font-medium text-lg"
              >
                Ver Ações
              </Link>
            </div>
          </div>

          {/* Impact Numbers */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-20">
            {impactNumbers.map((item, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-center glass-hover">
                <item.icon className="w-8 h-8 text-eco-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white">
                  {item.value}
                  <span className="text-sm text-gray-500 ml-1">{item.unit}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Tudo que você precisa para ser{" "}
              <span className="text-gradient">mais sustentável</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Ferramentas poderosas para rastrear, medir e melhorar seu impacto ambiental todos os dias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="glass rounded-2xl p-8 glass-hover group">
                <div className="w-14 h-14 rounded-xl bg-eco-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-eco-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Como funciona
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Registre", desc: "Escolha entre dezenas de ações sustentáveis e registre o que você fez hoje.", icon: Zap },
              { step: "02", title: "Acompanhe", desc: "Veja seu dashboard com gráficos de CO₂ economizado, pontos e streak.", icon: BarChart3 },
              { step: "03", title: "Inspire", desc: "Suba no ranking, ganhe badges e inspire amigos a fazerem o mesmo.", icon: TreePine },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-2xl gradient-eco flex items-center justify-center mx-auto mb-5 shadow-lg shadow-eco-500/25">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs text-eco-400 font-mono font-bold">{item.step}</span>
                <h3 className="text-xl font-semibold text-white mt-2 mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-3xl p-12 text-center relative overflow-hidden glow">
            <div className="absolute inset-0 bg-gradient-to-br from-eco-500/10 to-transparent" />
            <div className="relative">
              <Droplets className="w-12 h-12 text-eco-400 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Cada gota conta.{" "}
                <span className="text-gradient">Comece hoje.</span>
              </h2>
              <p className="text-gray-400 max-w-lg mx-auto mb-8">
                Junte-se a milhares de pessoas que estão transformando pequenas ações
                em grande impacto ambiental.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl gradient-eco text-white font-semibold text-lg hover:opacity-90 transition-all shadow-lg shadow-eco-500/25"
              >
                Criar Minha Conta
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

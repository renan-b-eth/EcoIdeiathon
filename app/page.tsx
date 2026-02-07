import Link from "next/link";
import Navbar from "@/components/navbar";
import {
  Brain,
  Mic,
  Activity,
  ArrowRight,
  FileAudio,
  BookOpen,
  Sparkles,
  Waves,
  Cpu,
  Stethoscope,
  Shield,
} from "lucide-react";

const stats = [
  { value: "50+", label: "Voice Biomarkers", icon: Waves, color: "text-primary" },
  { value: "6", label: "Research Papers", icon: BookOpen, color: "text-accent" },
  { value: "93%", label: "Detection Accuracy*", icon: Brain, color: "text-chart-5" },
  { value: "<30s", label: "Analysis Time", icon: FileAudio, color: "text-chart-3" },
];

const steps = [
  {
    step: "01",
    icon: Mic,
    iconColor: "text-primary",
    title: "Record or Upload",
    desc: "Record your voice directly in the browser for 15+ seconds, or upload any audio file (WAV, MP3, OGG, WebM).",
  },
  {
    step: "02",
    icon: Waves,
    iconColor: "text-accent",
    title: "Extract Biomarkers",
    desc: "Our engine extracts 50+ acoustic features: MFCC, Jitter, Shimmer, HNR, F0, Formants, Pauses -- following the eGeMAPS standard.",
  },
  {
    step: "03",
    icon: Brain,
    iconColor: "text-chart-5",
    title: "AI Risk Scoring",
    desc: "A cognitive risk algorithm scores Voice Quality, Fluency, Prosody, and Articulation against published clinical thresholds.",
  },
  {
    step: "04",
    icon: Stethoscope,
    iconColor: "text-chart-3",
    title: "Clinical Report",
    desc: "Azure OpenAI GPT-4o generates a narrative report as if written by a Harvard neurologist -- with actionable recommendations.",
  },
];

const biomarkers = [
  { name: "Jitter", desc: "Pitch perturbation -- vocal fold stability", ref: "eGeMAPS", color: "bg-primary" },
  { name: "Shimmer", desc: "Amplitude variation -- neuromuscular control", ref: "AD Research & Therapy", color: "bg-chart-5" },
  { name: "HNR", desc: "Harmonic-to-Noise Ratio -- breathiness", ref: "MDPI Applied Sciences", color: "bg-accent" },
  { name: "F0 Variability", desc: "Pitch dynamics -- monotone detection", ref: "Frontiers Psychology", color: "bg-accent" },
  { name: "Pause Patterns", desc: "Word-finding difficulty markers", ref: "OVBM Model", color: "bg-chart-3" },
  { name: "Formants", desc: "Articulatory precision (F1, F2, F3)", ref: "AI Review 2024", color: "bg-chart-3" },
  { name: "MFCC", desc: "Vocal tract shape coefficients (13 dims)", ref: "Deep Learning AD", color: "bg-chart-4" },
  { name: "Speech Rate", desc: "Fluency and cognitive processing speed", ref: "Digital Biomarkers", color: "bg-chart-4" },
];

const research = [
  { title: "Longitudinal Speech Biomarkers for Automated Alzheimer's Detection (OVBM)", journal: "Frontiers in Computer Science, 2021" },
  { title: "Deep learning-based speech analysis for Alzheimer's disease detection", journal: "Alzheimer's Research & Therapy, 2022" },
  { title: "Speech based detection of Alzheimer's disease: a survey of AI techniques", journal: "Artificial Intelligence Review, 2024" },
  { title: "Digital voice biomarkers and associations with cognition", journal: "Alzheimer's & Dementia: Diagnosis, 2023" },
  { title: "eGeMAPS: Extended Geneva Minimalistic Acoustic Parameter Set", journal: "IEEE Transactions on Affective Computing, 2016" },
  { title: "MIT Vocadian: Predictive voice AI for worker safety and health", journal: "MIT Startup Exchange, 2025" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-24 overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full bg-primary/[0.06] blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-accent/[0.04] blur-[80px] pointer-events-none" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-primary/10 border border-primary/20 text-primary mb-8">
            <Sparkles size={14} />
            Based on MIT CSAIL & Harvard Medical School Research
          </div>

          <h1 className="text-balance text-5xl md:text-7xl font-black leading-[1.05] tracking-tight text-foreground mb-6">
            Detect cognitive decline{" "}
            <span className="bg-gradient-to-r from-primary via-chart-5 to-accent bg-clip-text text-transparent">
              through your voice
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            NeuroVox AI extracts{" "}
            <strong className="text-secondary-foreground">50+ voice biomarkers</strong> from a
            simple recording to screen for early signs of Alzheimer{"'"}s and cognitive decline.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-primary via-chart-5 to-accent text-primary-foreground font-semibold text-base shadow-[0_8px_32px_rgba(99,102,241,0.35)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.5)] hover:-translate-y-0.5 transition-all no-underline"
            >
              <Mic size={20} />
              Start Voice Analysis
              <ArrowRight size={18} />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-secondary/60 backdrop-blur-md text-secondary-foreground font-medium border border-border hover:bg-primary/10 hover:border-primary/40 hover:-translate-y-0.5 transition-all no-underline"
            >
              <Activity size={20} />
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-card/60 backdrop-blur-md border border-border p-6 text-center hover:border-primary/25 hover:-translate-y-1 transition-all"
              >
                <stat.icon size={24} className={`${stat.color} mx-auto mb-3`} />
                <p className="text-3xl font-extrabold text-foreground tracking-tight">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground/50 mt-4">
            *Based on published research using DementiaBank Pitt Corpus. This is a screening tool, not a diagnostic device.
          </p>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-muted/30 to-transparent">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-primary/10 border border-primary/20 text-primary mb-4">
              <Cpu size={14} />
              Pipeline
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4">
              How{" "}
              <span className="bg-gradient-to-r from-primary via-chart-5 to-accent bg-clip-text text-transparent">
                NeuroVox AI
              </span>{" "}
              works
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto text-[15px]">
              From voice recording to clinical-grade report in under 30 seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {steps.map((item) => (
              <div
                key={item.step}
                className="flex gap-5 items-start rounded-2xl bg-card/60 backdrop-blur-md border border-border p-7 hover:border-primary/25 hover:-translate-y-1 transition-all"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-14 h-14 rounded-[14px] bg-primary/[0.08] border border-primary/15">
                    <item.icon size={28} className={item.iconColor} />
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-primary font-mono tracking-[2px]">
                    STEP {item.step}
                  </span>
                  <h3 className="text-lg font-bold text-foreground mt-2 mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Biomarkers */}
      <section id="biomarkers" className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-accent/10 border border-accent/20 text-accent mb-4">
              <Activity size={14} />
              Science
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4">
              Voice{" "}
              <span className="bg-gradient-to-r from-primary via-chart-5 to-accent bg-clip-text text-transparent">
                Biomarkers
              </span>{" "}
              We Analyze
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-[15px]">
              Each biomarker is validated by peer-reviewed research and clinical datasets.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {biomarkers.map((bm) => (
              <div
                key={bm.name}
                className="rounded-2xl bg-card/60 backdrop-blur-md border border-border p-6 hover:border-primary/25 hover:-translate-y-1 transition-all"
              >
                <div className={`w-2.5 h-2.5 rounded-full ${bm.color} mb-4 shadow-[0_0_12px_var(--tw-shadow-color)]`} />
                <h4 className="text-[15px] font-bold text-foreground mb-1.5">{bm.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{bm.desc}</p>
                <span className="text-[10px] px-2.5 py-1 rounded-md bg-primary/[0.08] text-primary font-medium">
                  {bm.ref}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research */}
      <section id="research" className="py-24 bg-gradient-to-b from-muted/30 to-transparent">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-chart-3/10 border border-chart-3/20 text-chart-3 mb-4">
              <BookOpen size={14} />
              Evidence
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4">
              Backed by{" "}
              <span className="bg-gradient-to-r from-primary via-chart-5 to-accent bg-clip-text text-transparent">
                Science
              </span>
            </h2>
            <p className="text-muted-foreground text-[15px]">
              Our analysis is grounded in published, peer-reviewed research.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {research.map((ref, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl bg-card/60 backdrop-blur-md border border-border px-6 py-5 hover:border-primary/25 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-primary/[0.08] border border-primary/15">
                  <BookOpen size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-secondary-foreground leading-snug">{ref.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{ref.journal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + Disclaimer */}
      <section className="py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <div className="rounded-2xl bg-card/80 backdrop-blur-md border border-border p-14 shadow-[0_0_60px_rgba(99,102,241,0.1)]">
            <Shield size={48} className="text-chart-4 mx-auto mb-5" />
            <h3 className="text-2xl font-extrabold text-foreground mb-4">Important Disclaimer</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-9">
              NeuroVox AI is a{" "}
              <strong className="text-foreground">screening tool for research purposes only</strong>.
              It is not a medical device and does not provide medical diagnosis. Results should be
              discussed with a qualified healthcare professional.
            </p>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary via-chart-5 to-accent text-primary-foreground font-semibold text-base shadow-[0_8px_32px_rgba(99,102,241,0.35)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.5)] hover:-translate-y-0.5 transition-all no-underline"
            >
              <Mic size={20} />
              Begin Voice Screening
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-primary" />
            <span className="text-sm font-semibold text-foreground">NeuroVox AI</span>
          </div>
          <p className="text-[11px] text-muted-foreground/50">
            Built for v0 Prompt to Production 2026 - Research-grade voice analysis
          </p>
        </div>
      </footer>
    </div>
  );
}

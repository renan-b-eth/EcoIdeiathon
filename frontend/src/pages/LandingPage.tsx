import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, Mic, Activity, Shield, ArrowRight, FileAudio,
  BookOpen, Sparkles, Waves, Cpu, Stethoscope
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#050510' }}>

      {/* ===== NAVBAR ===== */}
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="gradient-primary" style={{ width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={22} color="#fff" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
              NeuroVox<span className="gradient-text"> AI</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <a href="#how-it-works" style={{ fontSize: 14, color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>How it Works</a>
            <a href="#biomarkers" style={{ fontSize: 14, color: '#94a3b8', textDecoration: 'none' }}>Biomarkers</a>
            <a href="#research" style={{ fontSize: 14, color: '#94a3b8', textDecoration: 'none' }}>Research</a>
            <Link to="/analyze" className="btn-primary" style={{ padding: '10px 22px', fontSize: 13 }}>
              Start Analysis
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section style={{ position: 'relative', paddingTop: 140, paddingBottom: 100, overflow: 'hidden' }}>
        {/* Background orbs */}
        <div className="float" style={{ position: 'absolute', top: '15%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div className="float" style={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', animationDelay: '3s' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', textAlign: 'center', maxWidth: 900 }}>
          <div className="badge fade-in" style={{ marginBottom: 28 }}>
            <Sparkles size={14} color="#818cf8" />
            Based on MIT CSAIL & Harvard Medical School Research
          </div>

          <h1 className="fade-in fade-in-delay-1 glow-text" style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.08, color: '#fff', marginBottom: 24, letterSpacing: '-1.5px' }}>
            Detect cognitive decline<br />
            <span className="gradient-text">through your voice</span>
          </h1>

          <p className="fade-in fade-in-delay-2" style={{ fontSize: 18, color: '#8892b0', maxWidth: 620, margin: '0 auto 40px', lineHeight: 1.7 }}>
            NeuroVox AI extracts <strong style={{ color: '#c7d2fe' }}>50+ voice biomarkers</strong> from a simple recording
            to screen for early signs of Alzheimer's and cognitive decline — powered by peer-reviewed science.
          </p>

          <div className="fade-in fade-in-delay-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/analyze" className="btn-primary" style={{ fontSize: 16, padding: '16px 32px' }}>
              <Mic size={20} />
              Start Voice Analysis
              <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="btn-secondary" style={{ fontSize: 16, padding: '16px 32px' }}>
              <Activity size={20} />
              Learn More
            </a>
          </div>

          {/* Stats Row */}
          <div className="fade-in fade-in-delay-4 grid-4" style={{ marginTop: 80 }}>
            {[
              { value: '50+', label: 'Voice Biomarkers', icon: <Waves size={24} color="#818cf8" /> },
              { value: '6', label: 'Research Papers', icon: <BookOpen size={24} color="#22d3ee" /> },
              { value: '93%', label: 'Detection Accuracy*', icon: <Brain size={24} color="#c084fc" /> },
              { value: '<30s', label: 'Analysis Time', icon: <FileAudio size={24} color="#34d399" /> },
            ].map((stat, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: 28 }}>
                <div style={{ marginBottom: 12 }}>{stat.icon}</div>
                <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>{stat.value}</p>
                <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{stat.label}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: '#334155', marginTop: 16 }}>
            *Based on published research using DementiaBank Pitt Corpus. This is a screening tool, not a diagnostic device.
          </p>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="section" style={{ background: 'linear-gradient(180deg, rgba(15,15,35,0.3) 0%, transparent 100%)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="badge" style={{ marginBottom: 16 }}>
              <Cpu size={14} color="#818cf8" />
              Pipeline
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-0.5px' }}>
              How <span className="gradient-text">NeuroVox AI</span> works
            </h2>
            <p style={{ color: '#8892b0', maxWidth: 500, margin: '0 auto', fontSize: 15 }}>
              From voice recording to clinical-grade report in under 30 seconds.
            </p>
          </div>

          <div className="grid-2" style={{ gap: 24 }}>
            {[
              { step: '01', icon: <Mic size={28} color="#818cf8" />, title: 'Record or Upload', desc: 'Record your voice directly in the browser for 15+ seconds, or upload any audio file (WAV, MP3, OGG, WebM).' },
              { step: '02', icon: <Waves size={28} color="#22d3ee" />, title: 'Extract Biomarkers', desc: 'Our engine extracts 50+ acoustic features: MFCC, Jitter, Shimmer, HNR, F0, Formants, Pauses — following the eGeMAPS standard.' },
              { step: '03', icon: <Brain size={28} color="#c084fc" />, title: 'AI Risk Scoring', desc: 'A cognitive risk algorithm scores Voice Quality, Fluency, Prosody, and Articulation against published clinical thresholds.' },
              { step: '04', icon: <Stethoscope size={28} color="#34d399" />, title: 'Clinical Report', desc: 'Azure OpenAI GPT-4o generates a narrative report as if written by a Harvard neurologist — with actionable recommendations.' },
            ].map((item, i) => (
              <div key={i} className="card glass-hover" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(99,102,241,0.15)' }}>
                    {item.icon}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', fontFamily: 'monospace', letterSpacing: 2 }}>STEP {item.step}</span>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '8px 0' }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: '#8892b0', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BIOMARKERS ===== */}
      <section id="biomarkers" className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="badge" style={{ marginBottom: 16 }}>
              <Activity size={14} color="#22d3ee" />
              Science
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-0.5px' }}>
              Voice <span className="gradient-text">Biomarkers</span> We Analyze
            </h2>
            <p style={{ color: '#8892b0', maxWidth: 520, margin: '0 auto', fontSize: 15 }}>
              Each biomarker is validated by peer-reviewed research and clinical datasets.
            </p>
          </div>

          <div className="grid-4">
            {[
              { name: 'Jitter', desc: 'Pitch perturbation — vocal fold stability', ref: 'eGeMAPS', color: '#6366f1' },
              { name: 'Shimmer', desc: 'Amplitude variation — neuromuscular control', ref: 'AD Research & Therapy', color: '#8b5cf6' },
              { name: 'HNR', desc: 'Harmonic-to-Noise Ratio — breathiness', ref: 'MDPI Applied Sciences', color: '#06b6d4' },
              { name: 'F0 Variability', desc: 'Pitch dynamics — monotone detection', ref: 'Frontiers Psychology', color: '#22d3ee' },
              { name: 'Pause Patterns', desc: 'Word-finding difficulty markers', ref: 'OVBM Model', color: '#10b981' },
              { name: 'Formants', desc: 'Articulatory precision (F1, F2, F3)', ref: 'AI Review 2024', color: '#34d399' },
              { name: 'MFCC', desc: 'Vocal tract shape coefficients (13 dims)', ref: 'Deep Learning AD', color: '#f59e0b' },
              { name: 'Speech Rate', desc: 'Fluency and cognitive processing speed', ref: 'Digital Biomarkers', color: '#f97316' },
            ].map((bm, i) => (
              <div key={i} className="card glass-hover" style={{ padding: 24 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: bm.color, marginBottom: 14, boxShadow: `0 0 12px ${bm.color}40` }} />
                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{bm.name}</h4>
                <p style={{ fontSize: 12, color: '#8892b0', lineHeight: 1.6, marginBottom: 12 }}>{bm.desc}</p>
                <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 6, background: 'rgba(99,102,241,0.08)', color: '#818cf8', fontWeight: 500 }}>
                  {bm.ref}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RESEARCH ===== */}
      <section id="research" className="section" style={{ background: 'linear-gradient(180deg, rgba(15,15,35,0.3) 0%, transparent 100%)' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="badge" style={{ marginBottom: 16 }}>
              <BookOpen size={14} color="#10b981" />
              Evidence
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-0.5px' }}>
              Backed by <span className="gradient-text">Science</span>
            </h2>
            <p style={{ color: '#8892b0', fontSize: 15 }}>
              Our analysis is grounded in published, peer-reviewed research.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { title: 'Longitudinal Speech Biomarkers for Automated Alzheimer\'s Detection (OVBM)', journal: 'Frontiers in Computer Science, 2021', icon: '🧬' },
              { title: 'Deep learning-based speech analysis for Alzheimer\'s disease detection', journal: 'Alzheimer\'s Research & Therapy, 2022', icon: '🧠' },
              { title: 'Speech based detection of Alzheimer\'s disease: a survey of AI techniques', journal: 'Artificial Intelligence Review, 2024', icon: '📊' },
              { title: 'Digital voice biomarkers and associations with cognition', journal: 'Alzheimer\'s & Dementia: Diagnosis, 2023', icon: '🔬' },
              { title: 'eGeMAPS: Extended Geneva Minimalistic Acoustic Parameter Set', journal: 'IEEE Transactions on Affective Computing, 2016', icon: '📐' },
              { title: 'MIT Vocadian: Predictive voice AI for worker safety and health', journal: 'MIT Startup Exchange, 2025', icon: '🎓' },
            ].map((ref, i) => (
              <div key={i} className="card glass-hover" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px' }}>
                <span style={{ fontSize: 24 }}>{ref.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', lineHeight: 1.5 }}>{ref.title}</p>
                  <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{ref.journal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA + DISCLAIMER ===== */}
      <section className="section">
        <div className="container" style={{ maxWidth: 700, textAlign: 'center' }}>
          <div className="card glow" style={{ padding: '56px 48px', background: 'rgba(15, 15, 35, 0.8)' }}>
            <Shield size={48} color="#f59e0b" style={{ margin: '0 auto 20px' }} />
            <h3 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 16 }}>Important Disclaimer</h3>
            <p style={{ fontSize: 14, color: '#8892b0', lineHeight: 1.8, marginBottom: 36, maxWidth: 500, margin: '0 auto 36px' }}>
              NeuroVox AI is a <strong style={{ color: '#fff' }}>screening tool for research purposes only</strong>.
              It is not a medical device and does not provide medical diagnosis.
              Results should be discussed with a qualified healthcare professional.
            </p>
            <Link to="/analyze" className="btn-primary" style={{ fontSize: 16, padding: '16px 36px' }}>
              <Mic size={20} />
              Begin Voice Screening
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ borderTop: '1px solid rgba(99,102,241,0.08)', padding: '24px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Brain size={18} color="#818cf8" />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>NeuroVox AI</span>
          </div>
          <p style={{ fontSize: 11, color: '#334155' }}>
            Built for v0 Prompt to Production 2026 · Research-grade voice analysis
          </p>
        </div>
      </footer>
    </div>
  );
}

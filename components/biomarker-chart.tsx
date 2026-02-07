"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";

interface BiomarkerChartProps {
  biomarkers: {
    voice_quality: Record<string, number>;
    pitch: Record<string, number>;
    fluency: Record<string, number>;
    formants: Record<string, number>;
    spectral: Record<string, number>;
    energy: Record<string, number>;
  };
}

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "voice", label: "Voice Quality" },
  { id: "pitch", label: "Pitch" },
  { id: "fluency", label: "Fluency" },
  { id: "spectral", label: "Spectral" },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; payload: { threshold?: number } }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-secondary border border-border px-4 py-3">
        <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
        <p className="text-xs text-primary">
          Value: <strong>{payload[0].value}</strong>
        </p>
        {payload[0].payload.threshold && (
          <p className="text-[11px] text-chart-4 mt-0.5">
            Threshold: {payload[0].payload.threshold}
          </p>
        )}
      </div>
    );
  }
  return null;
}

export default function BiomarkerChart({ biomarkers }: BiomarkerChartProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const overviewData = [
    { name: "Jitter", value: Math.round(Math.min(100, (1 - Math.min(biomarkers.voice_quality.jitter_percent / 3, 1)) * 100)) },
    { name: "Shimmer", value: Math.round(Math.min(100, (1 - Math.min(biomarkers.voice_quality.shimmer_percent / 10, 1)) * 100)) },
    { name: "HNR", value: Math.round(Math.min(100, (biomarkers.voice_quality.hnr_db / 25) * 100)) },
    { name: "F0 Range", value: Math.round(Math.min(100, (biomarkers.pitch.f0_range_hz / 200) * 100)) },
    { name: "Speech", value: Math.round(Math.min(100, biomarkers.fluency.speech_ratio * 100)) },
    { name: "Energy", value: Math.round(Math.min(100, biomarkers.energy.range * 1000)) },
  ];

  const voiceQualityData = [
    { name: "Jitter (%)", value: biomarkers.voice_quality.jitter_percent, threshold: 1.5 },
    { name: "Shimmer (%)", value: biomarkers.voice_quality.shimmer_percent, threshold: 6 },
    { name: "HNR (dB)", value: biomarkers.voice_quality.hnr_db, threshold: 10 },
  ];

  const pitchData = [
    { name: "F0 Mean (Hz)", value: biomarkers.pitch.f0_mean_hz },
    { name: "F0 Std (Hz)", value: biomarkers.pitch.f0_std_hz },
    { name: "F0 Range (Hz)", value: biomarkers.pitch.f0_range_hz },
  ];

  const fluencyData = [
    { name: "Speech %", value: +(biomarkers.fluency.speech_ratio * 100).toFixed(1) },
    { name: "Silence %", value: +(biomarkers.fluency.silence_ratio * 100).toFixed(1) },
    { name: "Pauses", value: biomarkers.fluency.pause_count },
    { name: "Avg Pause (ms)", value: +(biomarkers.fluency.avg_pause_sec * 1000).toFixed(0) },
  ];

  const spectralData = [
    { name: "Centroid", value: Math.round(biomarkers.spectral.centroid_mean) },
    { name: "Bandwidth", value: Math.round(biomarkers.spectral.bandwidth_mean) },
    { name: "Rolloff", value: Math.round(biomarkers.spectral.rolloff_mean) },
  ];

  const chartColors: Record<string, string> = {
    overview: "#6366f1",
    voice: "#06b6d4",
    pitch: "#8b5cf6",
    fluency: "#10b981",
    spectral: "#f59e0b",
  };

  const chartData: Record<string, Array<Record<string, unknown>>> = {
    overview: overviewData,
    voice: voiceQualityData,
    pitch: pitchData,
    fluency: fluencyData,
    spectral: spectralData,
  };

  const biomarkerItems = [
    { label: "Jitter", value: `${biomarkers.voice_quality.jitter_percent}%`, color: biomarkers.voice_quality.jitter_percent > 1.5 ? "text-chart-4" : "text-chart-3" },
    { label: "Shimmer", value: `${biomarkers.voice_quality.shimmer_percent}%`, color: biomarkers.voice_quality.shimmer_percent > 6 ? "text-chart-4" : "text-chart-3" },
    { label: "HNR", value: `${biomarkers.voice_quality.hnr_db} dB`, color: biomarkers.voice_quality.hnr_db < 10 ? "text-chart-4" : "text-chart-3" },
    { label: "F0 Mean", value: `${biomarkers.pitch.f0_mean_hz} Hz`, color: "text-primary" },
    { label: "F0 CV", value: `${biomarkers.pitch.f0_cv}`, color: biomarkers.pitch.f0_cv < 0.1 ? "text-chart-4" : "text-chart-3" },
    { label: "Speech %", value: `${(biomarkers.fluency.speech_ratio * 100).toFixed(1)}%`, color: biomarkers.fluency.speech_ratio < 0.55 ? "text-chart-4" : "text-chart-3" },
    { label: "Pauses", value: `${biomarkers.fluency.pause_count}`, color: "text-primary" },
    { label: "Duration", value: `${biomarkers.fluency.duration_sec}s`, color: "text-primary" },
  ];

  return (
    <div className="rounded-2xl bg-card/60 backdrop-blur-md border border-border p-7">
      <h3 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2.5">
        <BarChart3 size={20} className="text-primary" />
        Biomarker Analysis
      </h3>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              activeTab === tab.id
                ? "bg-primary/15 text-primary border-primary/25"
                : "bg-transparent text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData[activeTab]} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" />
          <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "rgba(99,102,241,0.1)" }} />
          <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "rgba(99,102,241,0.1)" }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill={chartColors[activeTab]} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Biomarker Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {biomarkerItems.map((item) => (
          <div key={item.label} className="px-3.5 py-3 rounded-xl bg-primary/[0.04] border border-border">
            <p className="text-[11px] text-muted-foreground mb-1">{item.label}</p>
            <p className={`text-[15px] font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

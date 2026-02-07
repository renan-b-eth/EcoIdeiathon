import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

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

export default function BiomarkerChart({ biomarkers }: BiomarkerChartProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'voice', label: 'Voice Quality' },
    { id: 'pitch', label: 'Pitch' },
    { id: 'fluency', label: 'Fluency' },
    { id: 'spectral', label: 'Spectral' },
  ];

  const overviewData = [
    { name: 'Jitter', value: Math.round(Math.min(100, (1 - Math.min(biomarkers.voice_quality.jitter_percent / 3, 1)) * 100)) },
    { name: 'Shimmer', value: Math.round(Math.min(100, (1 - Math.min(biomarkers.voice_quality.shimmer_percent / 10, 1)) * 100)) },
    { name: 'HNR', value: Math.round(Math.min(100, (biomarkers.voice_quality.hnr_db / 25) * 100)) },
    { name: 'F0 Range', value: Math.round(Math.min(100, (biomarkers.pitch.f0_range_hz / 200) * 100)) },
    { name: 'Speech', value: Math.round(Math.min(100, biomarkers.fluency.speech_ratio * 100)) },
    { name: 'Energy', value: Math.round(Math.min(100, biomarkers.energy.range * 1000)) },
  ];

  const voiceQualityData = [
    { name: 'Jitter (%)', value: biomarkers.voice_quality.jitter_percent, threshold: 1.5 },
    { name: 'Shimmer (%)', value: biomarkers.voice_quality.shimmer_percent, threshold: 6 },
    { name: 'HNR (dB)', value: biomarkers.voice_quality.hnr_db, threshold: 10 },
  ];

  const pitchData = [
    { name: 'F0 Mean (Hz)', value: biomarkers.pitch.f0_mean_hz },
    { name: 'F0 Std (Hz)', value: biomarkers.pitch.f0_std_hz },
    { name: 'F0 Range (Hz)', value: biomarkers.pitch.f0_range_hz },
  ];

  const fluencyData = [
    { name: 'Speech %', value: +(biomarkers.fluency.speech_ratio * 100).toFixed(1) },
    { name: 'Silence %', value: +(biomarkers.fluency.silence_ratio * 100).toFixed(1) },
    { name: 'Pauses', value: biomarkers.fluency.pause_count },
    { name: 'Avg Pause (ms)', value: +(biomarkers.fluency.avg_pause_sec * 1000).toFixed(0) },
  ];

  const spectralData = [
    { name: 'Centroid', value: Math.round(biomarkers.spectral.centroid_mean) },
    { name: 'Bandwidth', value: Math.round(biomarkers.spectral.bandwidth_mean) },
    { name: 'Rolloff', value: Math.round(biomarkers.spectral.rolloff_mean) },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: '10px 14px' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{label}</p>
          <p style={{ fontSize: 12, color: '#818cf8' }}>
            Value: <strong>{payload[0].value}</strong>
          </p>
          {payload[0].payload.threshold && (
            <p style={{ fontSize: 11, color: '#f59e0b', marginTop: 2 }}>
              Threshold: {payload[0].payload.threshold}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const renderBarChart = (data: any[], color: string = '#6366f1') => (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" />
        <XAxis dataKey="name" tick={{ fill: '#8892b0', fontSize: 11 }} axisLine={{ stroke: 'rgba(99,102,241,0.1)' }} />
        <YAxis tick={{ fill: '#8892b0', fontSize: 11 }} axisLine={{ stroke: 'rgba(99,102,241,0.1)' }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  const biomarkerItems = [
    { label: 'Jitter', value: `${biomarkers.voice_quality.jitter_percent}%`, color: biomarkers.voice_quality.jitter_percent > 1.5 ? '#f59e0b' : '#10b981' },
    { label: 'Shimmer', value: `${biomarkers.voice_quality.shimmer_percent}%`, color: biomarkers.voice_quality.shimmer_percent > 6 ? '#f59e0b' : '#10b981' },
    { label: 'HNR', value: `${biomarkers.voice_quality.hnr_db} dB`, color: biomarkers.voice_quality.hnr_db < 10 ? '#f59e0b' : '#10b981' },
    { label: 'F0 Mean', value: `${biomarkers.pitch.f0_mean_hz} Hz`, color: '#818cf8' },
    { label: 'F0 CV', value: `${biomarkers.pitch.f0_cv}`, color: biomarkers.pitch.f0_cv < 0.1 ? '#f59e0b' : '#10b981' },
    { label: 'Speech %', value: `${(biomarkers.fluency.speech_ratio * 100).toFixed(1)}%`, color: biomarkers.fluency.speech_ratio < 0.55 ? '#f59e0b' : '#10b981' },
    { label: 'Pauses', value: `${biomarkers.fluency.pause_count}`, color: '#818cf8' },
    { label: 'Duration', value: `${biomarkers.fluency.duration_sec}s`, color: '#818cf8' },
  ];

  return (
    <div className="card" style={{ padding: 28 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <BarChart3 size={20} color="#818cf8" />
        Biomarker Analysis
      </h3>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600,
              whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s',
              background: activeTab === tab.id ? 'rgba(99,102,241,0.15)' : 'transparent',
              color: activeTab === tab.id ? '#a5b4fc' : '#64748b',
              border: activeTab === tab.id ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Charts */}
      {activeTab === 'overview' && renderBarChart(overviewData, '#6366f1')}
      {activeTab === 'voice' && renderBarChart(voiceQualityData, '#06b6d4')}
      {activeTab === 'pitch' && renderBarChart(pitchData, '#8b5cf6')}
      {activeTab === 'fluency' && renderBarChart(fluencyData, '#10b981')}
      {activeTab === 'spectral' && renderBarChart(spectralData, '#f59e0b')}

      {/* Biomarker Grid */}
      <div className="grid-4" style={{ marginTop: 24 }}>
        {biomarkerItems.map((item, i) => (
          <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.08)' }}>
            <p style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{item.label}</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: item.color }}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

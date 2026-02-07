import React from 'react';

interface ScoreRingProps {
  score: number;
  risk: string;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export default function ScoreRing({ score, risk, size = 120, strokeWidth = 8, showLabel = true }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'elevated': return '#f97316';
      case 'high': return '#ef4444';
      default: return '#6366f1';
    }
  };

  const color = getColor(risk);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(99,102,241,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Score ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring"
          style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{Math.round(score)}</span>
          <span className="text-xs" style={{ color: '#64748b' }}>/100</span>
        </div>
      )}
    </div>
  );
}

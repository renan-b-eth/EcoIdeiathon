"use client";

interface ScoreRingProps {
  score: number;
  risk: string;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

function getColor(risk: string) {
  switch (risk) {
    case "low": return "#10b981";
    case "moderate": return "#f59e0b";
    case "elevated": return "#f97316";
    case "high": return "#ef4444";
    default: return "#6366f1";
  }
}

export default function ScoreRing({
  score,
  risk,
  size = 120,
  strokeWidth = 8,
  showLabel = true,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  const color = getColor(risk);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-border"
          strokeWidth={strokeWidth}
        />
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
          style={{
            transition: "stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: `drop-shadow(0 0 8px ${color}40)`,
          }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-foreground">{Math.round(score)}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      )}
    </div>
  );
}

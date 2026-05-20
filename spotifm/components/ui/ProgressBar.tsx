import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({ value, max = 100, color = "#1DB954", className, showLabel, label }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="flex justify-between mb-1">
          {label && <span className="text-xs text-white/50">{label}</span>}
          {showLabel && <span className="text-xs text-white/70">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

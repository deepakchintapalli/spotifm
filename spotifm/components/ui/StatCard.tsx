import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: ReactNode;
  color?: string;
  className?: string;
}

export function StatCard({ label, value, sublabel, icon, color = "#1DB954", className }: StatCardProps) {
  return (
    <div className={cn("glass-card rounded-2xl p-5 relative overflow-hidden group", className)}>
      <div
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
        style={{ background: `radial-gradient(circle at 0% 0%, ${color}, transparent 70%)` }}
      />
      <div className="relative">
        {icon && (
          <div className="mb-3" style={{ color }}>
            {icon}
          </div>
        )}
        <div className="text-2xl font-bold font-display text-white mb-1">{value}</div>
        <div className="text-sm text-white/50">{label}</div>
        {sublabel && <div className="text-xs text-white/30 mt-1">{sublabel}</div>}
      </div>
    </div>
  );
}

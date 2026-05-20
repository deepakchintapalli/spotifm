import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "green" | "purple" | "pink" | "orange";
  className?: string;
}

const variants = {
  default: "bg-surface-border text-white/70",
  green: "bg-spotify-green/20 text-spotify-green border border-spotify-green/30",
  purple: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  pink: "bg-pink-500/20 text-pink-400 border border-pink-500/30",
  orange: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

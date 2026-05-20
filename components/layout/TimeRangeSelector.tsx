"use client";

import { useAppStore } from "@/store";
import { TimeRange } from "@/types";
import { cn } from "@/lib/utils";

const RANGES: { value: TimeRange; label: string }[] = [
  { value: "short_term", label: "4 weeks" },
  { value: "medium_term", label: "6 months" },
  { value: "long_term", label: "All time" },
];

export function TimeRangeSelector() {
  const { timeRange, setTimeRange } = useAppStore();

  return (
    <div className="flex gap-1 bg-surface-card rounded-xl p-1 border border-surface-border">
      {RANGES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setTimeRange(value)}
          className={cn(
            "px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
            timeRange === value
              ? "bg-spotify-green text-black font-semibold"
              : "text-white/50 hover:text-white"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

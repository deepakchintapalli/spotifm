"use client";

import { HeatmapCell } from "@/types";
import { getHourLabel, getDayLabel } from "@/lib/utils";

interface Props {
  data: HeatmapCell[];
}

export function HeatmapChart({ data }: Props) {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  const getColor = (count: number): string => {
    if (count === 0) return "rgba(255,255,255,0.04)";
    const intensity = count / maxCount;
    if (intensity < 0.2) return "rgba(29,185,84,0.15)";
    if (intensity < 0.4) return "rgba(29,185,84,0.30)";
    if (intensity < 0.6) return "rgba(29,185,84,0.50)";
    if (intensity < 0.8) return "rgba(29,185,84,0.70)";
    return "rgba(29,185,84,0.90)";
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = Array.from({ length: 7 }, (_, i) => i);

  const getCount = (day: number, hour: number) =>
    data.find(d => d.day === day && d.hour === hour)?.count || 0;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="flex gap-1 mb-1 ml-10">
          {days.map(d => (
            <div key={d} className="flex-1 text-center text-xs text-white/40">
              {getDayLabel(d)}
            </div>
          ))}
        </div>
        <div className="space-y-1">
          {hours.map(h => (
            <div key={h} className="flex items-center gap-1">
              <div className="w-10 text-xs text-white/30 text-right pr-2 shrink-0">
                {h % 3 === 0 ? getHourLabel(h) : ""}
              </div>
              {days.map(d => {
                const count = getCount(d, h);
                return (
                  <div
                    key={d}
                    className="flex-1 h-4 rounded-sm transition-all duration-200 cursor-default group relative"
                    style={{ backgroundColor: getColor(count) }}
                    title={`${getDayLabel(d)} ${getHourLabel(h)}: ${count} plays`}
                  >
                    {count > 0 && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-surface-elevated rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-surface-border">
                        {count} plays
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4 ml-10">
          <span className="text-xs text-white/30">Less</span>
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map(i => (
            <div
              key={i}
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: i === 0 ? "rgba(255,255,255,0.04)" : `rgba(29,185,84,${i * 0.9})` }}
            />
          ))}
          <span className="text-xs text-white/30">More</span>
        </div>
      </div>
    </div>
  );
}

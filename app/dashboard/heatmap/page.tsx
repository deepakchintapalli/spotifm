"use client";

import { motion } from "framer-motion";
import { useRecentlyPlayed } from "@/hooks/useSpotifyData";
import { HeatmapChart } from "@/components/charts/HeatmapChart";
import { Skeleton } from "@/components/ui/Skeleton";
import { buildHeatmap, getPeakHour, getNightOwlScore, getWeekendScore } from "@/lib/analytics/heatmap";
import { getHourLabel } from "@/lib/utils";
import { BarChart3, Moon, Sun, Calendar } from "lucide-react";

export default function HeatmapPage() {
  const { data, isLoading } = useRecentlyPlayed();
  const heatmap = data?.items ? buildHeatmap(data.items) : [];
  const peakHour = getPeakHour(heatmap);
  const nightOwlScore = getNightOwlScore(heatmap);
  const weekendScore = getWeekendScore(heatmap);
  const isNightOwl = nightOwlScore > 40;
  const isWeekendWarrior = weekendScore > 120;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <BarChart3 size={20} className="text-spotify-green" />
          <h1 className="text-2xl font-bold font-display text-white">Listening Heatmap</h1>
        </div>
        <p className="text-white/40 text-sm">When do you actually listen to music?</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
          <Skeleton className="h-80" />
        </div>
      ) : heatmap.length ? (
        <div className="space-y-8">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Peak Hour",
                value: getHourLabel(peakHour),
                desc: "Most active listening time",
                color: "#1DB954",
                icon: <Sun size={20} />,
              },
              {
                label: "Night Owl Score",
                value: `${nightOwlScore}%`,
                desc: isNightOwl ? "You're a night listener" : "You prefer the day",
                color: isNightOwl ? "#8b5cf6" : "#f97316",
                icon: <Moon size={20} />,
              },
              {
                label: "Weekend vs Weekday",
                value: weekendScore > 100 ? "Weekend 🎉" : "Weekday 💼",
                desc: `${Math.min(weekendScore, 200)}% weekend index`,
                color: isWeekendWarrior ? "#ec4899" : "#06b6d4",
                icon: <Calendar size={20} />,
              },
            ].map(({ label, value, desc, color, icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-5 relative overflow-hidden group"
              >
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
                  style={{ background: `radial-gradient(circle at 0% 0%, ${color}, transparent 70%)` }} />
                <div className="relative">
                  <div className="mb-3" style={{ color }}>{icon}</div>
                  <div className="text-2xl font-bold font-display text-white mb-1">{value}</div>
                  <div className="text-sm text-white/50">{label}</div>
                  <div className="text-xs text-white/30 mt-1">{desc}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Heatmap */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-lg font-bold font-display text-white mb-4">Hour × Day Grid</h2>
            <div className="glass-card rounded-2xl p-6">
              <HeatmapChart data={heatmap} />
            </div>
          </motion.div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="text-lg font-bold font-display text-white mb-4">Listening Patterns</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: isNightOwl ? "Night Owl 🦉" : "Early Bird 🌅",
                  body: isNightOwl
                    ? `${nightOwlScore}% of your listening happens between 10PM and 4AM. The night is your stage.`
                    : `You're a daytime listener. Most of your music flows during productive hours.`,
                },
                {
                  title: isWeekendWarrior ? "Weekend Warrior 🎉" : "Consistent Listener 📅",
                  body: isWeekendWarrior
                    ? "You listen significantly more on weekends. Music is your weekend ritual."
                    : "Your listening is balanced across the week. Music is part of your daily life.",
                },
                {
                  title: `Peak: ${getHourLabel(peakHour)} 🎧`,
                  body: `${getHourLabel(peakHour)} is when your music truly comes alive. Something about that time just hits different.`,
                },
                {
                  title: "Data from recent plays",
                  body: `Analysis based on your ${data?.items?.length || 0} most recent plays. Enable more history access for deeper insights.`,
                },
              ].map(({ title, body }) => (
                <div key={title} className="p-4 rounded-xl bg-surface-card border border-surface-border">
                  <div className="text-sm font-semibold text-white mb-2">{title}</div>
                  <p className="text-sm text-white/50 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="text-center py-24 text-white/30">
          <BarChart3 size={48} className="mx-auto mb-4 opacity-30" />
          <p>No listening history found. Try playing some music on Spotify!</p>
        </div>
      )}
    </div>
  );
}

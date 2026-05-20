"use client";

import { motion } from "framer-motion";
import { useTopArtists } from "@/hooks/useSpotifyData";
import { useAppStore } from "@/store";
import { TimeRangeSelector } from "@/components/layout/TimeRangeSelector";
import { GenreChart } from "@/components/charts/GenreChart";
import { Skeleton } from "@/components/ui/Skeleton";
import { extractGenres, calculateDiversityScore } from "@/lib/analytics/genres";
import { Radio, TrendingUp, Award } from "lucide-react";

export default function GenresPage() {
  const { timeRange } = useAppStore();
  const { data, isLoading } = useTopArtists(timeRange);

  const genres = data?.items ? extractGenres(data.items) : [];
  const diversityScore = calculateDiversityScore(genres);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Radio size={20} className="text-spotify-green" />
            <h1 className="text-2xl font-bold font-display text-white">Genre Analytics</h1>
          </div>
          <p className="text-white/40 text-sm">Your genre distribution and diversity score.</p>
        </div>
        <TimeRangeSelector />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
          <Skeleton className="h-80" />
        </div>
      ) : genres.length ? (
        <div className="space-y-8">
          {/* Diversity stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Diversity Score",
                value: `${diversityScore}%`,
                desc: diversityScore >= 70 ? "Eclectic explorer" : diversityScore >= 40 ? "Balanced listener" : "Genre specialist",
                color: "#1DB954",
                icon: <TrendingUp size={20} />,
              },
              {
                label: "Genres Explored",
                value: genres.length,
                desc: "Unique genres found",
                color: "#8b5cf6",
                icon: <Radio size={20} />,
              },
              {
                label: "Top Genre",
                value: genres[0]?.name || "—",
                desc: `${genres[0]?.percentage || 0}% of listening`,
                color: genres[0]?.color || "#1DB954",
                icon: <Award size={20} />,
              },
            ].map(({ label, value, desc, color, icon }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-5 relative overflow-hidden group"
              >
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
                  style={{ background: `radial-gradient(circle at 0% 0%, ${color}, transparent 70%)` }} />
                <div className="relative">
                  <div className="mb-3" style={{ color }}>{icon}</div>
                  <div className="text-2xl font-bold font-display text-white mb-1 capitalize">{value}</div>
                  <div className="text-sm text-white/50">{label}</div>
                  <div className="text-xs text-white/30 mt-1">{desc}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Treemap */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-lg font-bold font-display text-white mb-4">Genre Distribution</h2>
            <div className="glass-card rounded-2xl p-4">
              <GenreChart genres={genres} />
            </div>
          </motion.div>

          {/* Ranked list */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-lg font-bold font-display text-white mb-4">Genre Ranking</h2>
            <div className="space-y-2">
              {genres.map((genre, i) => (
                <motion.div
                  key={genre.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass-card rounded-xl px-4 py-3 flex items-center gap-4"
                >
                  <span className="text-white/30 text-sm font-mono w-6 text-right shrink-0">{i + 1}</span>
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: genre.color, boxShadow: `0 0 8px ${genre.color}60` }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white capitalize truncate">{genre.name}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-32 h-1.5 bg-surface-border rounded-full overflow-hidden hidden sm:block">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${genre.percentage}%` }}
                        transition={{ duration: 0.7, delay: i * 0.04 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: genre.color }}
                      />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: genre.color }}>
                      {genre.percentage}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="text-center py-24 text-white/30">
          <Radio size={48} className="mx-auto mb-4 opacity-30" />
          <p>No genre data available.</p>
        </div>
      )}
    </div>
  );
}

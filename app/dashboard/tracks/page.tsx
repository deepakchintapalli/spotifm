"use client";

import { motion } from "framer-motion";
import { useTopTracks, useAudioFeatures } from "@/hooks/useSpotifyData";
import { useAppStore } from "@/store";
import { TimeRangeSelector } from "@/components/layout/TimeRangeSelector";
import { TrackCard } from "@/components/cards/TrackCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { AudioFeaturesRadar } from "@/components/charts/AudioFeaturesRadar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Music2, Zap } from "lucide-react";

export default function TracksPage() {
  const { timeRange } = useAppStore();
  const { data: tracksData, isLoading: tracksLoading } = useTopTracks(timeRange);
  const trackIds = tracksData?.items.map(t => t.id) || [];
  const { data: featuresData, isLoading: featuresLoading } = useAudioFeatures(trackIds);

  const isLoading = tracksLoading || featuresLoading;
  const features = featuresData?.audio_features?.filter(Boolean) || [];

  const avg = (key: string) =>
    features.length
      ? features.reduce((s, f) => s + ((f as any)[key] as number), 0) / features.length
      : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Music2 size={20} className="text-spotify-green" />
            <h1 className="text-2xl font-bold font-display text-white">Top Tracks</h1>
          </div>
          <p className="text-white/40 text-sm">Your most-played tracks with audio feature analysis.</p>
        </div>
        <TimeRangeSelector />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : tracksData?.items?.length ? (
        <div className="space-y-8">
          {/* Audio Profile */}
          {features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={18} className="text-spotify-green" />
                  <h2 className="text-lg font-bold font-display text-white">Audio Profile</h2>
                </div>
                <AudioFeaturesRadar features={features} />
              </div>
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold font-display text-white mb-5">Feature Breakdown</h2>
                <div className="space-y-4">
                  {[
                    { label: "Energy", key: "energy", color: "#f97316", desc: "How intense and active" },
                    { label: "Danceability", key: "danceability", color: "#ec4899", desc: "How suitable for dancing" },
                    { label: "Positivity (Valence)", key: "valence", color: "#1DB954", desc: "Musical positiveness" },
                    { label: "Acousticness", key: "acousticness", color: "#8b5cf6", desc: "Confidence it's acoustic" },
                    { label: "Instrumentalness", key: "instrumentalness", color: "#06b6d4", desc: "Predicts no vocals" },
                    { label: "Liveness", key: "liveness", color: "#eab308", desc: "Presence of audience" },
                  ].map(({ label, key, color, desc }) => (
                    <div key={key}>
                      <div className="flex justify-between mb-1.5">
                        <div>
                          <span className="text-sm font-medium text-white">{label}</span>
                          <span className="text-xs text-white/30 ml-2">{desc}</span>
                        </div>
                        <span className="text-sm font-semibold" style={{ color }}>
                          {Math.round(avg(key) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 bg-surface-border rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.round(avg(key) * 100)}%` }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Track list */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-lg font-bold font-display text-white mb-4">All Tracks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tracksData.items.map((track, i) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.025 }}
                >
                  <TrackCard track={track} rank={i + 1} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="text-center py-24 text-white/30">
          <Music2 size={48} className="mx-auto mb-4 opacity-30" />
          <p>No track data available. Try a different time range.</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useTopTracks, useAudioFeatures } from "@/hooks/useSpotifyData";
import { useAppStore } from "@/store";
import { TimeRangeSelector } from "@/components/layout/TimeRangeSelector";
import { MoodGauge } from "@/components/charts/MoodGauge";
import { Skeleton } from "@/components/ui/Skeleton";
import { analyzeMood } from "@/lib/analytics/mood";
import { Activity, Zap, Heart, Wind, Volume2, Music } from "lucide-react";

const MOOD_DESCRIPTIONS: Record<string, { icon: string; detail: string; tips: string[] }> = {
  Euphoric: {
    icon: "🔥",
    detail: "Your playlist radiates pure joy and energy. You're the life of every party.",
    tips: ["Perfect for morning runs", "Great pre-workout fuel", "Share with friends who need a pick-me-up"],
  },
  Chaotic: {
    icon: "⚡",
    detail: "Intense and unpredictable — your music reflects a complex emotional landscape.",
    tips: ["Best for high-intensity workouts", "Great for late-night drives", "Pairs well with creative projects"],
  },
  Chill: {
    icon: "🌊",
    detail: "Cool, calm, and collected. Your music is the sonic equivalent of a deep breath.",
    tips: ["Perfect for focus sessions", "Ideal Sunday morning listening", "Great for winding down"],
  },
  Melancholic: {
    icon: "🌙",
    detail: "You find profound beauty in sadness. Your taste reveals deep emotional intelligence.",
    tips: ["Listen when processing emotions", "Great for creative writing", "Connects you with your inner self"],
  },
  Groove: {
    icon: "💃",
    detail: "Your body was made to move. Every track is an invitation to the dancefloor.",
    tips: ["Perfect for cooking sessions", "Great social playlist", "Your commute deserves these vibes"],
  },
  Organic: {
    icon: "🌿",
    detail: "You appreciate the raw beauty of acoustic music — real instruments, real feelings.",
    tips: ["Perfect for studying", "Great for intimate gatherings", "Ideal background for conversations"],
  },
  Focused: {
    icon: "🎯",
    detail: "Instrumental and purposeful. Your music is a tool for peak mental performance.",
    tips: ["Best for deep work sessions", "Great for meditation", "Ideal for creative flow states"],
  },
  Balanced: {
    icon: "⚖️",
    detail: "A perfect equilibrium of emotions and sounds. Your taste is beautifully complex.",
    tips: ["Works in any situation", "Adaptable to any mood", "Perfect for sharing with new people"],
  },
};

function FeatureCard({ label, value, desc, color, icon: Icon }: {
  label: string; value: number; desc: string; color: string; icon: any;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5 relative overflow-hidden group"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity"
        style={{ background: color }} />
      <div className="flex items-start justify-between mb-3">
        <Icon size={20} style={{ color }} />
        <span className="text-2xl font-bold font-display" style={{ color }}>
          {Math.round(value * 100)}
        </span>
      </div>
      <div className="text-sm font-semibold text-white mb-1">{label}</div>
      <div className="text-xs text-white/40 mb-3">{desc}</div>
      <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}60` }}
        />
      </div>
    </motion.div>
  );
}

export default function MoodPage() {
  const { timeRange } = useAppStore();
  const { data: tracksData, isLoading: tracksLoading } = useTopTracks(timeRange);
  const trackIds = tracksData?.items.map(t => t.id) || [];
  const { data: featuresData, isLoading: featuresLoading } = useAudioFeatures(trackIds);

  const isLoading = tracksLoading || featuresLoading;
  const features = featuresData?.audio_features?.filter(Boolean) || [];
  const mood = analyzeMood(features);
  const moodDetail = MOOD_DESCRIPTIONS[mood.type] || MOOD_DESCRIPTIONS.Balanced;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Activity size={20} className="text-spotify-green" />
            <h1 className="text-2xl font-bold font-display text-white">Mood Analysis</h1>
          </div>
          <p className="text-white/40 text-sm">Your emotional audio fingerprint.</p>
        </div>
        <TimeRangeSelector />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-64" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
        </div>
      ) : features.length ? (
        <div className="space-y-8">
          {/* Main mood display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-8 relative overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{ background: `radial-gradient(circle at 50% 0%, ${mood.color}, transparent 70%)` }}
            />
            <div className="relative flex flex-col lg:flex-row items-center gap-8">
              <div className="shrink-0">
                <MoodGauge mood={mood} />
              </div>
              <div className="flex-1 text-center lg:text-left">
                <div className="text-5xl mb-3">{moodDetail.icon}</div>
                <h2 className="text-3xl font-bold font-display mb-2" style={{ color: mood.color }}>
                  {mood.type}
                </h2>
                <p className="text-white/60 text-lg leading-relaxed mb-6">{moodDetail.detail}</p>
                <div className="space-y-2">
                  <div className="text-xs font-bold tracking-widest uppercase text-white/30 mb-3">
                    What this means for you
                  </div>
                  {moodDetail.tips.map(tip => (
                    <div key={tip} className="flex items-start gap-2 text-sm text-white/60">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: mood.color }} />
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature cards */}
          <div>
            <h2 className="text-lg font-bold font-display text-white mb-4">Audio Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <FeatureCard
                label="Energy"
                value={mood.energy}
                desc="Intensity and activity level"
                color="#f97316"
                icon={Zap}
              />
              <FeatureCard
                label="Positivity"
                value={mood.valence}
                desc="Musical happiness quotient"
                color="#1DB954"
                icon={Heart}
              />
              <FeatureCard
                label="Danceability"
                value={mood.danceability}
                desc="Rhythm and groove factor"
                color="#ec4899"
                icon={Activity}
              />
              <FeatureCard
                label="Acousticness"
                value={mood.acousticness}
                desc="Natural, organic sound"
                color="#8b5cf6"
                icon={Wind}
              />
              <FeatureCard
                label="Instrumentalness"
                value={features.reduce((s, f) => s + f.instrumentalness, 0) / features.length}
                desc="Absence of vocals"
                color="#06b6d4"
                icon={Music}
              />
              <FeatureCard
                label="Liveness"
                value={features.reduce((s, f) => s + f.liveness, 0) / features.length}
                desc="Live performance feel"
                color="#eab308"
                icon={Volume2}
              />
            </div>
          </div>

          {/* Mood summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6 border"
            style={{ borderColor: `${mood.color}30` }}
          >
            <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: mood.color }}>
              AI Music Summary
            </div>
            <p className="text-white/70 text-base leading-relaxed">
              {mood.energy > 0.6
                ? `You listen to ${mood.type.toLowerCase()} music with high energy — you're likely someone who uses music as fuel. `
                : `Your preference for lower-energy music suggests you use it for focus or emotional processing. `}
              {mood.valence > 0.5
                ? `Your positive valence score means you gravitate toward uplifting, mood-boosting tracks. `
                : `Your lower valence score shows you appreciate emotional depth and complexity in music. `}
              {mood.danceability > 0.6
                ? `With a danceability score of ${Math.round(mood.danceability * 100)}%, your playlist is practically a cardio workout.`
                : `Your music is more cerebral than physical — built for listening, not dancing.`}
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="text-center py-24 text-white/30">
          <Activity size={48} className="mx-auto mb-4 opacity-30" />
          <p>No mood data available. Listen to more music!</p>
        </div>
      )}
    </div>
  );
}

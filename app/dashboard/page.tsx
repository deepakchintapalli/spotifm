"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useDashboardData } from "@/hooks/useSpotifyData";
import { useAppStore } from "@/store";
import { TimeRangeSelector } from "@/components/layout/TimeRangeSelector";
import { ArtistCard } from "@/components/cards/ArtistCard";
import { TrackCard } from "@/components/cards/TrackCard";
import { StatCard } from "@/components/ui/StatCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { MoodGauge } from "@/components/charts/MoodGauge";
import { AudioFeaturesRadar } from "@/components/charts/AudioFeaturesRadar";
import { GenreChart } from "@/components/charts/GenreChart";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatMinutes, getHourLabel, scoreToLabel } from "@/lib/utils";
import {
  Mic2, Music2, Radio, Clock, TrendingUp, Zap,
  Moon, Calendar, Sparkles, ChevronRight
} from "lucide-react";
import Link from "next/link";

function SectionHeader({ title, href, icon: Icon }: { title: string; href: string; icon: any }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <Icon size={18} className="text-spotify-green" />
        <h2 className="text-lg font-bold font-display text-white">{title}</h2>
      </div>
      <Link
        href={href}
        className="flex items-center gap-1 text-sm text-white/40 hover:text-spotify-green transition-colors"
      >
        See all <ChevronRight size={14} />
      </Link>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4 },
  }),
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const { timeRange } = useAppStore();
  const { data, isLoading } = useDashboardData(timeRange);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">
            Hey, {session?.user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-white/40 text-sm mt-1">Here's what your music says about you.</p>
        </div>
        <TimeRangeSelector />
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : data ? (
        <div className="space-y-10">
          {/* Stats row */}
          <motion.div
            variants={{ show: { transition: { staggerChildren: 0.07 } } }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: "Unique Artists", value: data.stats.uniqueArtists, icon: <Mic2 size={20} />, color: "#1DB954" },
              { label: "Top Tracks", value: data.stats.uniqueTracks, icon: <Music2 size={20} />, color: "#8b5cf6" },
              { label: "Genres Explored", value: data.genres.length, icon: <Radio size={20} />, color: "#ec4899" },
              { label: "Diversity Score", value: `${data.stats.diversityScore}%`, icon: <TrendingUp size={20} />, color: "#f97316", sublabel: scoreToLabel(data.stats.diversityScore) },
            ].map((s, i) => (
              <motion.div key={s.label} custom={i} variants={fadeUp}>
                <StatCard {...s} />
              </motion.div>
            ))}
          </motion.div>

          {/* Personality banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/dashboard/personality">
              <div
                className="relative rounded-2xl p-6 overflow-hidden cursor-pointer group card-lift"
                style={{
                  background: `linear-gradient(135deg, ${data.personality.auraColors[0]}25 0%, ${data.personality.auraColors[1]}30 100%)`,
                  border: `1px solid ${data.personality.auraColors[0]}40`,
                }}
              >
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-6xl opacity-20 group-hover:opacity-30 transition-opacity select-none">
                  {data.personality.icon}
                </div>
                <div className="relative">
                  <div className="text-xs font-bold tracking-widest uppercase text-white/40 mb-1 flex items-center gap-1.5">
                    <Sparkles size={10} />
                    Your Music Personality
                  </div>
                  <h3
                    className="text-2xl font-bold font-display"
                    style={{ color: data.personality.auraColors[1] }}
                  >
                    {data.personality.title}
                  </h3>
                  <p className="text-white/50 text-sm mt-1 max-w-md">{data.personality.description}</p>
                  <div className="flex gap-2 mt-3">
                    {data.personality.traits.map(t => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: `${data.personality.auraColors[0]}30`,
                          color: data.personality.auraColors[1],
                          border: `1px solid ${data.personality.auraColors[0]}50`,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Top Artists + Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
              <SectionHeader title="Top Artists" href="/dashboard/artists" icon={Mic2} />
              <div className="space-y-3">
                {data.topArtists.slice(0, 5).map((artist, i) => (
                  <ArtistCard key={artist.id} artist={artist} rank={i + 1} />
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <div className="flex items-center gap-2.5 mb-5">
                <Zap size={18} className="text-spotify-green" />
                <h2 className="text-lg font-bold font-display text-white">Audio Profile</h2>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <AudioFeaturesRadar features={data.audioFeatures} />
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { label: "Energy", val: data.audioFeatures.reduce((s, f) => s + f.energy, 0) / (data.audioFeatures.length || 1), color: "#f97316" },
                    { label: "Danceability", val: data.audioFeatures.reduce((s, f) => s + f.danceability, 0) / (data.audioFeatures.length || 1), color: "#ec4899" },
                    { label: "Happiness", val: data.audioFeatures.reduce((s, f) => s + f.valence, 0) / (data.audioFeatures.length || 1), color: "#1DB954" },
                    { label: "Acoustic", val: data.audioFeatures.reduce((s, f) => s + f.acousticness, 0) / (data.audioFeatures.length || 1), color: "#8b5cf6" },
                  ].map(({ label, val, color }) => (
                    <ProgressBar key={label} label={label} value={Math.round(val * 100)} color={color} showLabel />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Top Tracks */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <SectionHeader title="Top Tracks" href="/dashboard/tracks" icon={Music2} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.topTracks.slice(0, 6).map((track, i) => (
                <TrackCard key={track.id} track={track} rank={i + 1} />
              ))}
            </div>
          </motion.div>

          {/* Mood + Genres */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <div className="flex items-center gap-2.5 mb-5">
                <Moon size={18} className="text-spotify-green" />
                <h2 className="text-lg font-bold font-display text-white">Mood Analysis</h2>
              </div>
              <div className="glass-card rounded-2xl p-6 flex flex-col items-center">
                <MoodGauge mood={data.mood} />
                <div className="w-full mt-6 space-y-3">
                  {[
                    { label: "Energy", val: data.mood.energy, color: "#f97316" },
                    { label: "Positivity", val: data.mood.valence, color: "#1DB954" },
                    { label: "Danceability", val: data.mood.danceability, color: "#ec4899" },
                  ].map(({ label, val, color }) => (
                    <ProgressBar key={label} label={label} value={Math.round(val * 100)} color={color} showLabel />
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
              <SectionHeader title="Genre Map" href="/dashboard/genres" icon={Radio} />
              <div className="glass-card rounded-2xl p-4">
                <GenreChart genres={data.genres} />
              </div>
            </motion.div>
          </div>

          {/* Listening behavior stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <div className="flex items-center gap-2.5 mb-5">
              <Calendar size={18} className="text-spotify-green" />
              <h2 className="text-lg font-bold font-display text-white">Listening Behavior</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Peak Hour"
                value={getHourLabel(data.stats.peakHour)}
                icon={<Clock size={20} />}
                color="#06b6d4"
                sublabel="Most active"
              />
              <StatCard
                label="Night Owl Score"
                value={`${data.stats.nightOwlScore}%`}
                icon={<Moon size={20} />}
                color="#8b5cf6"
                sublabel={data.stats.nightOwlScore > 50 ? "Night listener" : "Day listener"}
              />
              <StatCard
                label="Top Genre"
                value={data.stats.topGenre}
                icon={<Radio size={20} />}
                color="#ec4899"
                sublabel="Dominant genre"
              />
              <StatCard
                label="Mood Type"
                value={data.mood.type}
                icon={<Zap size={20} />}
                color={data.mood.color}
                sublabel="Current vibe"
              />
            </div>
          </motion.div>

          {/* Recently played */}
          {data.recentlyPlayed.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
              <div className="flex items-center gap-2.5 mb-5">
                <Clock size={18} className="text-spotify-green" />
                <h2 className="text-lg font-bold font-display text-white">Recently Played</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.recentlyPlayed.slice(0, 8).map((item, i) => (
                  <TrackCard key={`${item.track.id}-${i}`} track={item.track} rank={i + 1} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="text-center py-24 text-white/30">
          <Music2 size={48} className="mx-auto mb-4 opacity-30" />
          <p>No data found. Try a different time range or listen to more music!</p>
        </div>
      )}
    </div>
  );
}

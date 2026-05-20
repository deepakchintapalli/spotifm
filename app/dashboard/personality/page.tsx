"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useDashboardData } from "@/hooks/useSpotifyData";
import { useAppStore } from "@/store";
import { TimeRangeSelector } from "@/components/layout/TimeRangeSelector";
import { PersonalityCard } from "@/components/cards/PersonalityCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function PersonalityPage() {
  const { data: session } = useSession();
  const { timeRange } = useAppStore();
  const { data, isLoading } = useDashboardData(timeRange);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Sparkles size={20} className="text-spotify-green" />
            <h1 className="text-2xl font-bold font-display text-white">Music Personality</h1>
          </div>
          <p className="text-white/40 text-sm">Your unique listener archetype based on real data.</p>
        </div>
        <TimeRangeSelector />
      </div>

      {isLoading ? (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <Skeleton className="w-[380px] h-[560px]" />
          <div className="flex-1 space-y-4">
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        </div>
      ) : data ? (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PersonalityCard
              personality={data.personality}
              stats={data.stats}
              genres={data.genres}
              mood={data.mood}
              topArtist={data.topArtists[0]}
              userName={session?.user?.name || undefined}
              userImage={session?.user?.image || undefined}
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 space-y-5"
          >
            {/* Personality description */}
            <div className="glass-card rounded-2xl p-6">
              <div className="text-4xl mb-3">{data.personality.icon}</div>
              <h2 className="text-2xl font-bold font-display mb-1" style={{ color: data.personality.auraColors[1] }}>
                {data.personality.title}
              </h2>
              <p className="text-spotify-green text-sm mb-3">{data.personality.subtitle}</p>
              <p className="text-white/60 leading-relaxed">{data.personality.description}</p>
            </div>

            {/* Traits */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-4">Your Traits</h3>
              <div className="flex flex-wrap gap-2">
                {data.personality.traits.map((t, i) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      background: `${data.personality.auraColors[0]}20`,
                      border: `1px solid ${data.personality.auraColors[0]}40`,
                      color: data.personality.auraColors[1],
                    }}
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-4">Insights</h3>
              <div className="space-y-3">
                {data.personality.insights.map((insight, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: data.personality.auraColors[1] }}
                    />
                    <p className="text-white/60 text-sm leading-relaxed">{insight}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Aura */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-3">Aura Colors</h3>
              <div className="flex gap-3">
                {data.personality.auraColors.map((color, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-xl"
                      style={{
                        backgroundColor: color,
                        boxShadow: `0 0 20px ${color}60`,
                      }}
                    />
                    <span className="text-xs text-white/40 font-mono">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA to share */}
            <Link href="/dashboard/share">
              <div className="flex items-center justify-between glass-card rounded-2xl p-5 group cursor-pointer hover:border-spotify-green/30 transition-colors border border-transparent">
                <div>
                  <div className="text-sm font-semibold text-white">Share your card</div>
                  <div className="text-xs text-white/40">Export as PNG and share with the world</div>
                </div>
                <ChevronRight size={18} className="text-white/30 group-hover:text-spotify-green transition-colors" />
              </div>
            </Link>
          </motion.div>
        </div>
      ) : (
        <div className="text-center py-24 text-white/30">
          <Sparkles size={48} className="mx-auto mb-4 opacity-30" />
          <p>Personality data not available.</p>
        </div>
      )}
    </div>
  );
}

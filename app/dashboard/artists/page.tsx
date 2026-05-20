"use client";

import { motion } from "framer-motion";
import { useTopArtists } from "@/hooks/useSpotifyData";
import { useAppStore } from "@/store";
import { TimeRangeSelector } from "@/components/layout/TimeRangeSelector";
import { ArtistCard } from "@/components/cards/ArtistCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { GenreChart } from "@/components/charts/GenreChart";
import { extractGenres } from "@/lib/analytics/genres";
import { Mic2, TrendingUp } from "lucide-react";

export default function ArtistsPage() {
  const { timeRange } = useAppStore();
  const { data, isLoading } = useTopArtists(timeRange);

  const genres = data?.items ? extractGenres(data.items) : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Mic2 size={20} className="text-spotify-green" />
            <h1 className="text-2xl font-bold font-display text-white">Top Artists</h1>
          </div>
          <p className="text-white/40 text-sm">Your most-played artists ranked by listening activity.</p>
        </div>
        <TimeRangeSelector />
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(9).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        </div>
      ) : data?.items?.length ? (
        <div className="space-y-8">
          {/* Top 3 highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.items.slice(0, 3).map((artist, i) => {
              const sizes = ["sm:col-span-1 sm:row-span-1", "", ""];
              const img = artist.images[0]?.url;
              const medals = ["🥇", "🥈", "🥉"];
              return (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative rounded-2xl overflow-hidden ${i === 0 ? "sm:row-span-2" : ""} group cursor-pointer`}
                  style={{ minHeight: i === 0 ? 280 : 130 }}
                >
                  {img && (
                    <img
                      src={img}
                      alt={artist.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-2xl mb-1">{medals[i]}</div>
                    <div className="text-white font-bold text-lg leading-tight">{artist.name}</div>
                    {artist.genres[0] && (
                      <div className="text-spotify-green text-xs mt-1 capitalize">{artist.genres[0]}</div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Genre treemap */}
          {genres.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-spotify-green" />
                <h2 className="text-lg font-bold font-display text-white">Genre Breakdown</h2>
              </div>
              <div className="glass-card rounded-2xl p-4">
                <GenreChart genres={genres} />
              </div>
            </motion.div>
          )}

          {/* Full artist list */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-lg font-bold font-display text-white mb-4">All Artists</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.items.map((artist, i) => (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.03 }}
                >
                  <ArtistCard artist={artist} rank={i + 1} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="text-center py-24 text-white/30">
          <Mic2 size={48} className="mx-auto mb-4 opacity-30" />
          <p>No artist data available. Try a different time range.</p>
        </div>
      )}
    </div>
  );
}

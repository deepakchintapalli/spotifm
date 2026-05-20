"use client";

import { SpotifyTrack } from "@/types";
import { cn, formatDuration } from "@/lib/utils";
import { ExternalLink, Music } from "lucide-react";

interface Props {
  track: SpotifyTrack;
  rank: number;
  className?: string;
}

export function TrackCard({ track, rank, className }: Props) {
  const img = track.album.images[0]?.url;
  const artistNames = track.artists.map(a => a.name).join(", ");

  return (
    <div className={cn("glass-card rounded-2xl p-4 group cursor-pointer card-lift flex items-center gap-4", className)}>
      <div className="text-white/20 font-bold text-sm w-6 text-center shrink-0">{rank}</div>
      
      <div className="relative shrink-0">
        {img ? (
          <img src={img} alt={track.name} className="w-12 h-12 rounded-lg object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-surface-hover flex items-center justify-center">
            <Music size={20} className="text-white/20" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white text-sm truncate">{track.name}</div>
        <div className="text-xs text-white/40 truncate mt-0.5">{artistNames}</div>
        <div className="text-xs text-white/25 mt-0.5">{track.album.name}</div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <div className="text-xs text-white/30">{formatDuration(track.duration_ms)}</div>
          <div className="flex items-center gap-1 mt-1">
            <div className="h-1 w-12 rounded-full bg-surface-border overflow-hidden">
              <div className="h-full rounded-full bg-spotify-green/60" style={{ width: `${track.popularity}%` }} />
            </div>
          </div>
        </div>
        <a
          href={track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-spotify-green"
          onClick={e => e.stopPropagation()}
        >
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}

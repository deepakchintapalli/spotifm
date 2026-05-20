"use client";

import { SpotifyArtist } from "@/types";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface Props {
  artist: SpotifyArtist;
  rank: number;
  className?: string;
}

export function ArtistCard({ artist, rank, className }: Props) {
  const topGenre = artist.genres[0];
  const img = artist.images[0]?.url;

  return (
    <div className={cn("glass-card rounded-2xl p-4 group cursor-pointer card-lift", className)}>
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <span className="absolute -top-1 -left-1 z-10 w-5 h-5 bg-surface-base rounded-full text-xs flex items-center justify-center font-bold text-white/60 border border-surface-border">
            {rank}
          </span>
          {img ? (
            <img
              src={img}
              alt={artist.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-surface-border group-hover:border-spotify-green/50 transition-colors"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-surface-hover flex items-center justify-center text-white/30 text-2xl">
              🎵
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white truncate text-sm">{artist.name}</div>
          {topGenre && (
            <div className="text-xs text-spotify-green mt-0.5 truncate capitalize">{topGenre}</div>
          )}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="h-1 rounded-full overflow-hidden bg-surface-border flex-1 max-w-[80px]">
              <div
                className="h-full rounded-full bg-spotify-green/70"
                style={{ width: `${artist.popularity}%` }}
              />
            </div>
            <span className="text-xs text-white/30">{artist.popularity}</span>
          </div>
        </div>

        <a
          href={artist.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-spotify-green"
          onClick={e => e.stopPropagation()}
        >
          <ExternalLink size={16} />
        </a>
      </div>

      {artist.genres.length > 1 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {artist.genres.slice(0, 3).map(g => (
            <span key={g} className="px-2 py-0.5 rounded-full text-xs bg-surface-border/60 text-white/40 capitalize">
              {g}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

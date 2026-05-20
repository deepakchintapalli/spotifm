"use client";

import { MusicPersonality, ListeningStats, GenreStats, MoodProfile, SpotifyArtist } from "@/types";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { toPng } from "html-to-image";
import { Download, Share2 } from "lucide-react";

interface Props {
  personality: MusicPersonality;
  stats: ListeningStats;
  genres: GenreStats[];
  mood: MoodProfile;
  topArtist?: SpotifyArtist;
  userName?: string;
  userImage?: string;
  forExport?: boolean;
}

export function PersonalityCard({
  personality,
  stats,
  genres,
  mood,
  topArtist,
  userName,
  userImage,
  forExport = false,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        style: { fontFamily: "DM Sans, system-ui, sans-serif" },
      });
      const link = document.createElement("a");
      link.download = `spotifm-${personality.title.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "spotifm-card.png", { type: "image/png" });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: `My Music Personality: ${personality.title}` });
      } else {
        await navigator.clipboard.writeText(`My music personality on spotifm: ${personality.title} — ${personality.subtitle}`);
      }
    } catch {}
  };

  const [c1, c2, c3] = personality.auraColors;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={cardRef}
        className="relative w-[380px] rounded-3xl overflow-hidden select-none"
        style={{
          background: `linear-gradient(135deg, ${c1}22 0%, ${c2}33 50%, ${c3}22 100%)`,
          border: `1px solid ${c1}44`,
          fontFamily: "DM Sans, system-ui, sans-serif",
        }}
      >
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Glow blobs */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-30"
          style={{ background: c1 }} />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl opacity-20"
          style={{ background: c2 }} />

        <div className="relative p-7">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs font-bold tracking-widest uppercase"
                style={{ color: c1, opacity: 0.8 }}>
                spotifm
              </div>
              <div className="text-xs text-white/30 mt-0.5">music personality</div>
            </div>
            {userImage && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">{userName}</span>
                <img src={userImage} className="w-8 h-8 rounded-full border border-white/10" alt="" />
              </div>
            )}
          </div>

          {/* Personality icon + title */}
          <div className="mb-6">
            <div className="text-5xl mb-3">{personality.icon}</div>
            <h2 className="text-3xl font-bold text-white leading-tight" style={{ fontFamily: "Syne, sans-serif" }}>
              {personality.title}
            </h2>
            <p className="text-sm mt-1" style={{ color: c1 }}>{personality.subtitle}</p>
            <p className="text-sm text-white/50 mt-2 leading-relaxed">{personality.description}</p>
          </div>

          {/* Aura bar */}
          <div className="h-1.5 rounded-full mb-6 overflow-hidden">
            <div className="h-full w-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${c1}, ${c2}, ${c3})` }} />
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: "Top Genre", value: (genres[0]?.name || "—"), accent: c1 },
              { label: "Mood", value: mood.type, accent: mood.color },
              { label: "Top Artist", value: topArtist?.name || "—", accent: c2 },
              { label: "Diversity", value: `${stats.diversityScore}%`, accent: c3 },
            ].map(({ label, value, accent }) => (
              <div
                key={label}
                className="rounded-2xl p-3"
                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="text-xs text-white/30 mb-1">{label}</div>
                <div className="text-sm font-semibold text-white capitalize truncate"
                  style={{ color: accent }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Traits */}
          <div className="flex flex-wrap gap-2 mb-5">
            {personality.traits.map(t => (
              <span
                key={t}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: `${c1}20`,
                  border: `1px solid ${c1}40`,
                  color: c1,
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-xs text-white/25">spotifm.app</div>
            <div className="text-xs text-white/25">
              {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </div>
          </div>
        </div>
      </div>

      {!forExport && (
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-spotify-green text-black hover:bg-spotify-green/90 transition-colors"
          >
            <Download size={16} />
            Export PNG
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold glass text-white hover:bg-white/10 transition-colors"
          >
            <Share2 size={16} />
            Share
          </button>
        </div>
      )}
    </div>
  );
}

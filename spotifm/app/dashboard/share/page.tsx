"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useDashboardData } from "@/hooks/useSpotifyData";
import { useAppStore } from "@/store";
import { TimeRangeSelector } from "@/components/layout/TimeRangeSelector";
import { PersonalityCard } from "@/components/cards/PersonalityCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Share2, ExternalLink, Link as LinkIcon, Download } from "lucide-react";
import { useState, useRef } from "react";
import { toPng } from "html-to-image";

const CARD_THEMES = [
  { id: "default", label: "Aura" },
  { id: "dark", label: "Dark" },
  { id: "neon", label: "Neon" },
];

export default function SharePage() {
  const { data: session } = useSession();
  const { timeRange } = useAppStore();
  const { data, isLoading } = useDashboardData(timeRange);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    if (!data) return;
    const text = `My music personality on spotifm is "${data.personality.title}" — ${data.personality.subtitle} 🎧\n\nDiscover yours:`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Share2 size={20} className="text-spotify-green" />
            <h1 className="text-2xl font-bold font-display text-white">Share Your Card</h1>
          </div>
          <p className="text-white/40 text-sm">Export your music identity as a beautiful shareable card.</p>
        </div>
        <TimeRangeSelector />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center gap-6">
          <Skeleton className="w-[380px] h-[560px]" />
          <div className="flex gap-3">
            <Skeleton className="w-36 h-10" />
            <Skeleton className="w-36 h-10" />
          </div>
        </div>
      ) : data ? (
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Card preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-white/30">Preview</div>
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

          {/* Share options */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 space-y-5"
          >
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold text-white mb-1">Your card is ready</h3>
              <p className="text-white/40 text-sm mb-5">
                Download as PNG, share on Twitter, or copy a link to invite others.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleTwitterShare}
                  className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-semibold text-sm bg-[#1DA1F2]/15 text-[#1DA1F2] border border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/25 transition-colors"
                >
                  <ExternalLink size={18} />
                  Share on Twitter / X
                </button>

                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-semibold text-sm glass text-white hover:bg-white/10 transition-colors"
                >
                  <LinkIcon size={18} />
                  {copied ? "✓ Link Copied!" : "Copy App Link"}
                </button>
              </div>
            </div>

            {/* Stats for sharing */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-4">Card Contents</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: "Personality", value: data.personality.title },
                  { label: "Mood Type", value: data.mood.type },
                  { label: "Top Genre", value: data.genres[0]?.name || "—" },
                  { label: "Top Artist", value: data.topArtists[0]?.name || "—" },
                  { label: "Diversity", value: `${data.stats.diversityScore}%` },
                  { label: "Artists", value: `${data.stats.uniqueArtists}` },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 rounded-xl bg-surface-card border border-surface-border">
                    <div className="text-white/40 text-xs mb-1">{label}</div>
                    <div className="text-white font-medium capitalize truncate">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invite message */}
            <div
              className="glass-card rounded-2xl p-5 border"
              style={{ borderColor: `${data.personality.auraColors[0]}30` }}
            >
              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: data.personality.auraColors[1] }}>
                Copy & paste this
              </div>
              <p className="text-white/60 text-sm leading-relaxed italic">
                "My music personality on spotifm is <strong className="text-white">{data.personality.title}</strong> — {data.personality.subtitle}. What's yours? Discover at spotifm.app 🎧"
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `My music personality on spotifm is "${data.personality.title}" — ${data.personality.subtitle}. What's yours? Discover at spotifm.app 🎧`
                  );
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="mt-3 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  background: `${data.personality.auraColors[0]}20`,
                  color: data.personality.auraColors[1],
                }}
              >
                {copied ? "Copied!" : "Copy text"}
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
}

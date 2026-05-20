"use client";

import { MoodProfile } from "@/types";

interface Props {
  mood: MoodProfile;
}

export function MoodGauge({ mood }: Props) {
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (mood.score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
          <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke={mood.color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ filter: `drop-shadow(0 0 8px ${mood.color}60)`, transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold font-display" style={{ color: mood.color }}>
            {mood.score}
          </div>
          <div className="text-xs text-white/40 mt-1">mood score</div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <div className="text-2xl font-bold font-display" style={{ color: mood.color }}>
          {mood.type}
        </div>
        <p className="text-sm text-white/50 mt-1 max-w-xs">{mood.description}</p>
      </div>
    </div>
  );
}

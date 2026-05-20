"use client";

import { AudioFeatures } from "@/types";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

interface Props {
  features: AudioFeatures[];
}

export function AudioFeaturesRadar({ features }: Props) {
  if (!features.length) return null;

  const avg = (key: keyof AudioFeatures) =>
    features.reduce((s, f) => s + (f[key] as number), 0) / features.length;

  const data = [
    { name: "Energy", value: Math.round(avg("energy") * 100) },
    { name: "Dance", value: Math.round(avg("danceability") * 100) },
    { name: "Valence", value: Math.round(avg("valence") * 100) },
    { name: "Acoustic", value: Math.round(avg("acousticness") * 100) },
    { name: "Instrumental", value: Math.round(avg("instrumentalness") * 100) },
    { name: "Liveness", value: Math.round(avg("liveness") * 100) },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.08)" />
        <PolarAngleAxis
          dataKey="name"
          tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
        />
        <Radar
          dataKey="value"
          stroke="#1DB954"
          fill="#1DB954"
          fillOpacity={0.15}
          strokeWidth={2}
          dot={{ fill: "#1DB954", r: 3 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

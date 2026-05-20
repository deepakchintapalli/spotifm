"use client";

import { useQuery } from "@tanstack/react-query";
import { TimeRange, SpotifyArtist, SpotifyTrack, AudioFeatures, RecentlyPlayed } from "@/types";
import { extractGenres, calculateDiversityScore } from "@/lib/analytics/genres";
import { analyzeMood } from "@/lib/analytics/mood";
import { generatePersonality } from "@/lib/analytics/personality";
import { buildHeatmap, getPeakHour, getNightOwlScore } from "@/lib/analytics/heatmap";

async function fetchAPI<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("API error");
  return res.json();
}

export function useTopArtists(timeRange: TimeRange) {
  return useQuery({
    queryKey: ["top-artists", timeRange],
    queryFn: () => fetchAPI<{ items: SpotifyArtist[] }>(`/api/spotify/top-artists?time_range=${timeRange}`),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTopTracks(timeRange: TimeRange) {
  return useQuery({
    queryKey: ["top-tracks", timeRange],
    queryFn: () => fetchAPI<{ items: SpotifyTrack[] }>(`/api/spotify/top-tracks?time_range=${timeRange}`),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRecentlyPlayed() {
  return useQuery({
    queryKey: ["recently-played"],
    queryFn: () => fetchAPI<{ items: RecentlyPlayed[] }>("/api/spotify/recently-played"),
    staleTime: 2 * 60 * 1000,
  });
}

export function useAudioFeatures(trackIds: string[]) {
  return useQuery({
    queryKey: ["audio-features", trackIds.slice(0, 10).join(",")],
    queryFn: () =>
      fetchAPI<{ audio_features: AudioFeatures[] }>(
        `/api/spotify/audio-features?ids=${trackIds.slice(0, 100).join(",")}`
      ),
    enabled: trackIds.length > 0,
    staleTime: 10 * 60 * 1000,
  });
}

export function useDashboardData(timeRange: TimeRange) {
  const { data: artistsData, isLoading: artistsLoading } = useTopArtists(timeRange);
  const { data: tracksData, isLoading: tracksLoading } = useTopTracks(timeRange);
  const { data: recentData, isLoading: recentLoading } = useRecentlyPlayed();
  
  const trackIds = tracksData?.items.map(t => t.id) || [];
  const { data: featuresData, isLoading: featuresLoading } = useAudioFeatures(trackIds);

  const isLoading = artistsLoading || tracksLoading || recentLoading || featuresLoading;

  const data = (() => {
    if (isLoading || !artistsData || !tracksData) return null;

    const artists = artistsData.items;
    const tracks = tracksData.items;
    const recent = recentData?.items || [];
    const features = featuresData?.audio_features.filter(Boolean) || [];

    const genres = extractGenres(artists);
    const mood = analyzeMood(features);
    const personality = generatePersonality(artists, features, mood, genres);
    const heatmap = buildHeatmap(recent);
    const peakHour = getPeakHour(heatmap);
    const nightOwlScore = getNightOwlScore(heatmap);
    const diversityScore = calculateDiversityScore(genres);

    const totalMinutes = tracks.reduce((s, t) => s + (t.duration_ms || 0), 0) / 60000;

    return {
      topArtists: artists,
      topTracks: tracks,
      recentlyPlayed: recent,
      audioFeatures: features,
      genres,
      mood,
      personality,
      heatmap,
      stats: {
        totalMinutes: Math.round(totalMinutes),
        uniqueArtists: artists.length,
        uniqueTracks: tracks.length,
        topGenre: genres[0]?.name || "Unknown",
        diversityScore,
        moodScore: mood.score,
        peakHour,
        nightOwlScore,
      },
    };
  })();

  return { data, isLoading };
}

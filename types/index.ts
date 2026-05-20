export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: { url: string; height: number; width: number }[];
  followers: { total: number };
  country: string;
  product: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: { url: string; height: number; width: number }[];
  popularity: number;
  followers: { total: number };
  external_urls: { spotify: string };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  album: {
    id: string;
    name: string;
    images: { url: string; height: number; width: number }[];
    release_date: string;
  };
  popularity: number;
  duration_ms: number;
  preview_url: string | null;
  external_urls: { spotify: string };
}

export interface AudioFeatures {
  id: string;
  danceability: number;
  energy: number;
  loudness: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  duration_ms: number;
  time_signature: number;
  key: number;
  mode: number;
}

export interface RecentlyPlayed {
  track: SpotifyTrack;
  played_at: string;
}

export type TimeRange = "short_term" | "medium_term" | "long_term";

export interface MoodProfile {
  score: number;
  type: string;
  description: string;
  color: string;
  energy: number;
  valence: number;
  danceability: number;
  acousticness: number;
}

export interface MusicPersonality {
  title: string;
  subtitle: string;
  description: string;
  auraColors: string[];
  traits: string[];
  insights: string[];
  icon: string;
}

export interface GenreStats {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ListeningStats {
  totalMinutes: number;
  uniqueArtists: number;
  uniqueTracks: number;
  topGenre: string;
  diversityScore: number;
  moodScore: number;
  peakHour: number;
  nightOwlScore: number;
}

export interface HeatmapCell {
  day: number;
  hour: number;
  count: number;
}

export interface DashboardData {
  topArtists: SpotifyArtist[];
  topTracks: SpotifyTrack[];
  recentlyPlayed: RecentlyPlayed[];
  audioFeatures: AudioFeatures[];
  genres: GenreStats[];
  mood: MoodProfile;
  personality: MusicPersonality;
  stats: ListeningStats;
  heatmap: HeatmapCell[];
}

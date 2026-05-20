import { SpotifyArtist, GenreStats } from "@/types";

const GENRE_COLORS: Record<string, string> = {
  pop: "#1DB954",
  rock: "#FF4444",
  "hip hop": "#FFD700",
  "r&b": "#FF69B4",
  electronic: "#00FFFF",
  jazz: "#FF8C00",
  classical: "#9370DB",
  indie: "#7CFC00",
  metal: "#DC143C",
  country: "#DEB887",
  reggae: "#228B22",
  latin: "#FF6347",
  soul: "#FF7F50",
  folk: "#8FBC8F",
  punk: "#FF1493",
  alternative: "#20B2AA",
  "k-pop": "#FF69B4",
  dance: "#EE82EE",
  house: "#4169E1",
  techno: "#008B8B",
};

function getGenreColor(genre: string): string {
  const lower = genre.toLowerCase();
  for (const [key, color] of Object.entries(GENRE_COLORS)) {
    if (lower.includes(key)) return color;
  }
  const hash = genre.split("").reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 55%)`;
}

export function extractGenres(artists: SpotifyArtist[]): GenreStats[] {
  const genreCount: Record<string, number> = {};
  
  artists.forEach(artist => {
    artist.genres.forEach(genre => {
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });
  });

  const total = Object.values(genreCount).reduce((a, b) => a + b, 0);
  
  return Object.entries(genreCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
      color: getGenreColor(name),
    }));
}

export function calculateDiversityScore(genres: GenreStats[]): number {
  if (!genres.length) return 0;
  const total = genres.reduce((a, g) => a + g.count, 0);
  const entropy = genres.reduce((e, g) => {
    const p = g.count / total;
    return e - (p > 0 ? p * Math.log2(p) : 0);
  }, 0);
  const maxEntropy = Math.log2(genres.length);
  return Math.round((entropy / maxEntropy) * 100);
}

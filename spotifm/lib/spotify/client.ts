import { TimeRange, SpotifyArtist, SpotifyTrack, AudioFeatures, RecentlyPlayed, SpotifyUser } from "@/types";

const SPOTIFY_BASE = "https://api.spotify.com/v1";

async function spotifyFetch<T>(url: string, accessToken: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 300 },
  });

  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (res.status === 429) {
    const retryAfter = res.headers.get("Retry-After") || "1";
    await new Promise(r => setTimeout(r, parseInt(retryAfter) * 1000));
    return spotifyFetch(url, accessToken);
  }
  if (!res.ok) throw new Error(`Spotify API error: ${res.status}`);
  return res.json();
}

export async function getSpotifyUser(accessToken: string): Promise<SpotifyUser> {
  return spotifyFetch<SpotifyUser>(`${SPOTIFY_BASE}/me`, accessToken);
}

export async function getTopArtists(
  accessToken: string,
  timeRange: TimeRange = "medium_term",
  limit = 50
): Promise<{ items: SpotifyArtist[] }> {
  return spotifyFetch<{ items: SpotifyArtist[] }>(
    `${SPOTIFY_BASE}/me/top/artists?time_range=${timeRange}&limit=${limit}`,
    accessToken
  );
}

export async function getTopTracks(
  accessToken: string,
  timeRange: TimeRange = "medium_term",
  limit = 50
): Promise<{ items: SpotifyTrack[] }> {
  return spotifyFetch<{ items: SpotifyTrack[] }>(
    `${SPOTIFY_BASE}/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
    accessToken
  );
}

export async function getRecentlyPlayed(
  accessToken: string,
  limit = 50
): Promise<{ items: RecentlyPlayed[] }> {
  return spotifyFetch<{ items: RecentlyPlayed[] }>(
    `${SPOTIFY_BASE}/me/player/recently-played?limit=${limit}`,
    accessToken
  );
}

export async function getAudioFeatures(
  accessToken: string,
  trackIds: string[]
): Promise<{ audio_features: AudioFeatures[] }> {
  const chunks = [];
  for (let i = 0; i < trackIds.length; i += 100) {
    chunks.push(trackIds.slice(i, i + 100));
  }

  const results = await Promise.all(
    chunks.map(chunk =>
      spotifyFetch<{ audio_features: AudioFeatures[] }>(
        `${SPOTIFY_BASE}/audio-features?ids=${chunk.join(",")}`,
        accessToken
      )
    )
  );

  return {
    audio_features: results.flatMap(r => r.audio_features).filter(Boolean),
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}> {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) throw new Error("Failed to refresh token");
  return res.json();
}

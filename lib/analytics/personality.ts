import { SpotifyArtist, AudioFeatures, MoodProfile, MusicPersonality, GenreStats } from "@/types";

export function generatePersonality(
  artists: SpotifyArtist[],
  features: AudioFeatures[],
  mood: MoodProfile,
  genres: GenreStats[]
): MusicPersonality {
  const topGenre = genres[0]?.name || "Unknown";
  const artistDiversity = new Set(artists.flatMap(a => a.genres)).size;
  
  const avgEnergy = features.reduce((s, f) => s + f.energy, 0) / (features.length || 1);
  const avgValence = features.reduce((s, f) => s + f.valence, 0) / (features.length || 1);
  const avgDance = features.reduce((s, f) => s + f.danceability, 0) / (features.length || 1);
  const avgAcoustic = features.reduce((s, f) => s + f.acousticness, 0) / (features.length || 1);

  const personalities = [
    {
      condition: avgEnergy > 0.75 && avgValence > 0.65,
      title: "Dopamine Machine",
      subtitle: "Pure serotonin fuel",
      description: "You've optimized your playlist for maximum dopamine hits. High energy, high vibes — you live life at full volume and your music does too.",
      auraColors: ["#FFD700", "#FF6B35", "#FF4444"],
      traits: ["Energy addict", "Party starter", "Vibe curator"],
      insights: [
        "You're 3x more likely to be the DJ at parties",
        "Your music raises the energy in any room",
        "Peak listening time is probably Friday night",
      ],
      icon: "⚡",
    },
    {
      condition: avgValence < 0.35 && avgAcoustic > 0.5,
      title: "Sadcore Philosopher",
      subtitle: "Beauty in the broken",
      description: "You find meaning in melancholy. Your playlist reads like a diary at 3AM — raw, honest, and devastatingly beautiful.",
      auraColors: ["#4C1D95", "#1E1B4B", "#312E81"],
      traits: ["Deep thinker", "Emotional intelligence", "Raw authenticity"],
      insights: [
        "You listen to music when you need to feel understood",
        "Rainy days are your favorite music sessions",
        "Your taste attracts fellow philosophers",
      ],
      icon: "🌙",
    },
    {
      condition: artistDiversity > 15 && genres.length > 8,
      title: "Indie Archaeologist",
      subtitle: "Unearthing sonic gold",
      description: "You don't follow trends — you set them. While others discover artists on TikTok, you've been listening to them for years.",
      auraColors: ["#065F46", "#047857", "#059669"],
      traits: ["Early adopter", "Genre explorer", "Tastemaker"],
      insights: [
        "You probably know your artists' B-sides better than their hits",
        "People come to you for music recommendations",
        "You've been to at least 10 concerts this year",
      ],
      icon: "🎸",
    },
    {
      condition: avgDance > 0.75 && avgEnergy > 0.6,
      title: "Rhythm Architect",
      subtitle: "Built for the dancefloor",
      description: "Your body processes music as movement. Every playlist is a carefully constructed journey from first beat to last drop.",
      auraColors: ["#BE185D", "#DB2777", "#EC4899"],
      traits: ["Groove master", "Beat scientist", "Floor filler"],
      insights: [
        "You unconsciously tap your foot to every song",
        "Your playlists are basically workout routines",
        "People steal your aux cord to play it at parties",
      ],
      icon: "💃",
    },
    {
      condition: avgAcoustic > 0.65 && avgValence > 0.5,
      title: "Campfire Soul",
      subtitle: "Warmth in every note",
      description: "You gravitate toward music that feels like a warm hug. Acoustic and soulful, your taste reflects a deep appreciation for human connection.",
      auraColors: ["#92400E", "#B45309", "#D97706"],
      traits: ["Cozy vibes", "Authentic taste", "Human connector"],
      insights: [
        "Coffee shops feel like home to you",
        "You probably play an instrument or have always wanted to",
        "Your friends describe you as 'the wholesome one'",
      ],
      icon: "🌿",
    },
    {
      condition: avgEnergy < 0.4 && avgValence > 0.55,
      title: "Midnight Dreamer",
      subtitle: "Floating through sound",
      description: "Your music exists in the space between waking and sleeping — ambient, atmospheric, and deeply introspective.",
      auraColors: ["#1E3A5F", "#1E40AF", "#3B82F6"],
      traits: ["Night owl", "Dreamer", "Atmosphere seeker"],
      insights: [
        "Best listening sessions happen after midnight",
        "You use music to create mental spaces",
        "Your focus playlists are legendary",
      ],
      icon: "✨",
    },
    {
      condition: true,
      title: "Chaos Listener",
      subtitle: "Genre is just a suggestion",
      description: "Why pick a lane when you can have them all? Your playlist is a beautiful, unpredictable rollercoaster of every genre imaginable.",
      auraColors: ["#7C3AED", "#6D28D9", "#5B21B6"],
      traits: ["Eclectic taste", "Unpredictable", "Genre-fluid"],
      insights: [
        "Your 'Recently Played' confuses everyone",
        "You find connections between genres others miss",
        "Shuffle mode was literally built for you",
      ],
      icon: "🌀",
    },
  ];

  const matched = personalities.find(p => p.condition) || personalities[personalities.length - 1];
  return {
    title: matched.title,
    subtitle: matched.subtitle,
    description: matched.description,
    auraColors: matched.auraColors,
    traits: matched.traits,
    insights: matched.insights,
    icon: matched.icon,
  };
}

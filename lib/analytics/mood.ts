import { AudioFeatures, MoodProfile } from "@/types";

export function analyzeMood(features: AudioFeatures[]): MoodProfile {
  if (!features.length) {
    return {
      score: 50,
      type: "Balanced",
      description: "Your music taste is perfectly balanced.",
      color: "#1DB954",
      energy: 0.5,
      valence: 0.5,
      danceability: 0.5,
      acousticness: 0.5,
    };
  }

  const avg = (key: keyof AudioFeatures) =>
    features.reduce((sum, f) => sum + (f[key] as number), 0) / features.length;

  const energy = avg("energy");
  const valence = avg("valence");
  const danceability = avg("danceability");
  const acousticness = avg("acousticness");
  const instrumentalness = avg("instrumentalness");

  let type: string;
  let description: string;
  let color: string;
  const score = Math.round((valence * 0.4 + energy * 0.3 + danceability * 0.3) * 100);

  if (energy > 0.7 && valence > 0.6) {
    type = "Euphoric";
    description = "High energy and positive vibes. You're riding a wave of pure joy.";
    color = "#FFD700";
  } else if (energy > 0.7 && valence < 0.4) {
    type = "Chaotic";
    description = "Intense and turbulent. Your music is a storm of raw emotion.";
    color = "#FF4444";
  } else if (energy < 0.4 && valence > 0.6) {
    type = "Chill";
    description = "Laid-back and optimistic. You prefer the peaceful side of life.";
    color = "#44BBFF";
  } else if (energy < 0.4 && valence < 0.4) {
    type = "Melancholic";
    description = "Introspective and deep. You find beauty in the bittersweet.";
    color = "#8B5CF6";
  } else if (danceability > 0.7) {
    type = "Groove";
    description = "You can't stop moving. Your playlist is basically one long dance session.";
    color = "#EC4899";
  } else if (acousticness > 0.6) {
    type = "Organic";
    description = "Raw and authentic. You appreciate music in its purest, most natural form.";
    color = "#F59E0B";
  } else if (instrumentalness > 0.5) {
    type = "Focused";
    description = "In the zone. Your instrumental choices suggest a deep, focused mind.";
    color = "#06B6D4";
  } else {
    type = "Balanced";
    description = "A perfect blend of emotions. Your taste is wonderfully complex.";
    color = "#1DB954";
  }

  return { score, type, description, color, energy, valence, danceability, acousticness };
}

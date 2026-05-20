"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, BarChart3, Sparkles, Music2, Share2, Zap,
  ChevronRight, ArrowRight, Star, Users, TrendingUp
} from "lucide-react";

const FEATURES = [
  {
    icon: BarChart3,
    title: "Deep Analytics",
    desc: "Uncover hidden patterns in your listening history with precision.",
    color: "#1DB954",
  },
  {
    icon: Sparkles,
    title: "Music Personality",
    desc: "Discover your unique listener archetype from 7 distinct profiles.",
    color: "#8b5cf6",
  },
  {
    icon: Music2,
    title: "Mood Mapping",
    desc: "See your emotional landscape through Spotify audio features.",
    color: "#ec4899",
  },
  {
    icon: Share2,
    title: "Viral Cards",
    desc: "Export stunning personality cards to share with the world.",
    color: "#f97316",
  },
  {
    icon: Zap,
    title: "Listening Heatmap",
    desc: "Visualize when you listen with a beautiful hour-by-day grid.",
    color: "#06b6d4",
  },
  {
    icon: TrendingUp,
    title: "Genre Diversity",
    desc: "Measure how eclectic your taste is with Shannon entropy scoring.",
    color: "#eab308",
  },
];

const TESTIMONIALS = [
  { name: "Alex R.", handle: "@alexrmusic", text: "This app broke my brain. I didn't know I was a Sadcore Philosopher until now 😭", stars: 5 },
  { name: "Priya K.", handle: "@priyabeats", text: "The personality card is SO shareable. Mine went viral on Twitter.", stars: 5 },
  { name: "Marcus T.", handle: "@marcustunes", text: "Finally an analytics tool that actually looks good. Obsessed.", stars: 5 },
];

const STATS = [
  { value: "50+", label: "Artists Analyzed" },
  { value: "7", label: "Personality Types" },
  { value: "∞", label: "Insights Generated" },
];

function MiniCard({ icon: Icon, color, label }: { icon: any; color: string; label: string }) {
  return (
    <div className="glass-card rounded-2xl p-4 flex items-center gap-3 min-w-[180px]">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <span className="text-sm text-white/70 font-medium">{label}</span>
    </div>
  );
}

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  const handleLogin = async () => {
    setSigning(true);
    await signIn("spotify", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-surface-border/50 bg-[#080808]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-spotify-green flex items-center justify-center">
              <Flame size={18} className="text-black" />
            </div>
            <span className="text-lg font-bold font-display gradient-text">spotifm</span>
          </div>
          <button
            onClick={handleLogin}
            disabled={signing}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-spotify-green text-black hover:bg-spotify-green/90 transition-all disabled:opacity-60"
          >
            {signing ? "Connecting..." : "Login with Spotify"}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 relative">
        {/* Bg glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-spotify-green/5 blur-[100px] pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[80px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-spotify-green/30 bg-spotify-green/10 text-spotify-green text-xs font-semibold mb-8"
          >
            <Zap size={12} />
            Powered by Spotify API
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-6"
          >
            Discover Your
            <br />
            <span className="gradient-text">Music Identity</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Deep analytics, mood mapping, genre diversity scores, and shareable personality cards —
            all from your Spotify listening history.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={handleLogin}
              disabled={signing}
              className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold bg-spotify-green text-black hover:bg-spotify-green/90 transition-all glow-green disabled:opacity-60"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-black">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              {signing ? "Connecting to Spotify..." : "Get Your Music Identity"}
              {!signing && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-center gap-10 mt-16 pt-10 border-t border-white/5"
          >
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold font-display gradient-text">{value}</div>
                <div className="text-sm text-white/40 mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Floating cards marquee */}
      <section className="py-12 overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex gap-4 w-max"
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <MiniCard icon={BarChart3} color="#1DB954" label="Top Artists" />
              <MiniCard icon={Music2} color="#8b5cf6" label="Track Analysis" />
              <MiniCard icon={Sparkles} color="#ec4899" label="Personality" />
              <MiniCard icon={Flame} color="#f97316" label="Mood Score" />
              <MiniCard icon={Share2} color="#06b6d4" label="Share Card" />
              <MiniCard icon={TrendingUp} color="#eab308" label="Genre Diversity" />
              <MiniCard icon={Zap} color="#1DB954" label="Heatmap" />
              <MiniCard icon={Star} color="#8b5cf6" label="Insights" />
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Everything about your music
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Six powerful modules that turn your Spotify data into meaningful insights.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6 group cursor-default card-lift"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${color}15` }}
                >
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Personality showcase */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/3 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Which listener are you?
            </h2>
            <p className="text-white/40 text-lg">7 unique music personalities. Yours is waiting.</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { title: "Midnight Dreamer", icon: "✨", colors: ["#1E3A5F", "#3B82F6"] },
              { title: "Dopamine Machine", icon: "⚡", colors: ["#92400E", "#F59E0B"] },
              { title: "Sadcore Philosopher", icon: "🌙", colors: ["#4C1D95", "#8B5CF6"] },
              { title: "Indie Archaeologist", icon: "🎸", colors: ["#065F46", "#10B981"] },
              { title: "Rhythm Architect", icon: "💃", colors: ["#831843", "#EC4899"] },
              { title: "Campfire Soul", icon: "🌿", colors: ["#78350F", "#D97706"] },
              { title: "Chaos Listener", icon: "🌀", colors: ["#4C1D95", "#7C3AED"] },
            ].map(({ title, icon, colors }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="px-5 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 cursor-default hover:scale-105 transition-transform"
                style={{
                  background: `linear-gradient(135deg, ${colors[0]}30, ${colors[1]}20)`,
                  border: `1px solid ${colors[1]}30`,
                  color: colors[1],
                }}
              >
                <span>{icon}</span>
                {title}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold mb-3">Listeners love it</h2>
            <p className="text-white/40">Join thousands who've discovered their music identity.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ name, handle, text, stars }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-5"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array(stars).fill(0).map((_, j) => (
                    <Star key={j} size={14} className="text-spotify-green fill-spotify-green" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-4">"{text}"</p>
                <div>
                  <div className="text-sm font-semibold text-white">{name}</div>
                  <div className="text-xs text-white/30">{handle}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-spotify-green/5 to-purple-500/5 pointer-events-none" />
            <div className="relative">
              <div className="text-5xl mb-6">🎧</div>
              <h2 className="font-display text-4xl font-bold mb-4">Ready to know yourself?</h2>
              <p className="text-white/50 mb-8 text-lg">
                Connect your Spotify in seconds. No credit card. No BS.
              </p>
              <button
                onClick={handleLogin}
                disabled={signing}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-bold bg-spotify-green text-black hover:bg-spotify-green/90 transition-all glow-green disabled:opacity-60"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-black">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                {signing ? "Connecting..." : "Start for Free"}
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-spotify-green flex items-center justify-center">
              <Flame size={12} className="text-black" />
            </div>
            <span className="text-sm font-semibold gradient-text">spotifm</span>
          </div>
          <p className="text-xs text-white/25 text-center">
            Not affiliated with Spotify AB. Built with love for music lovers.
          </p>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Music2,
  Mic2,
  Radio,
  Activity,
  Sparkles,
  Share2,
  LogOut,
  Flame,
  Home,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/artists", label: "Artists", icon: Mic2 },
  { href: "/dashboard/tracks", label: "Tracks", icon: Music2 },
  { href: "/dashboard/genres", label: "Genres", icon: Radio },
  { href: "/dashboard/mood", label: "Mood", icon: Activity },
  { href: "/dashboard/heatmap", label: "Heatmap", icon: BarChart3 },
  { href: "/dashboard/personality", label: "Personality", icon: Sparkles },
  { href: "/dashboard/share", label: "Share Card", icon: Share2 },
];

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col z-40 border-r border-surface-border bg-surface-elevated">
      <div className="p-6 border-b border-surface-border">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-spotify-green flex items-center justify-center">
            <Flame size={18} className="text-black" />
          </div>
          <span className="text-lg font-bold font-display gradient-text">spotifm</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-spotify-green/15 text-spotify-green"
                  : "text-white/50 hover:text-white hover:bg-surface-hover"
              )}
            >
              <Icon size={18} />
              {label}
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-spotify-green" />
              )}
            </Link>
          );
        })}
      </nav>

      {session?.user && (
        <div className="p-4 border-t border-surface-border">
          <div className="flex items-center gap-3 mb-3">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">
                {session.user.name}
              </div>
              <div className="text-xs text-white/40 truncate">{session.user.email}</div>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-surface-hover transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
}

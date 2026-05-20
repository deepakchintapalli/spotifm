import { create } from "zustand";
import { TimeRange } from "@/types";

interface AppStore {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  timeRange: "medium_term",
  setTimeRange: (range) => set({ timeRange: range }),
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));

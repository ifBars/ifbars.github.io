import { create } from 'zustand';

interface PortfolioState {
  hasEntered: boolean;
  enter: () => void;
  resetEntry: () => void;
}

export const usePortfolioStore = create<PortfolioState>()((set) => ({
  hasEntered: false,
  enter: () => set({ hasEntered: true }),
  resetEntry: () => set({ hasEntered: false }),
}));

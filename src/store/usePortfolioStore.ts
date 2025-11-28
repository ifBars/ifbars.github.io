import { create } from 'zustand';

interface PortfolioState {
  hasEntered: boolean;
  introComplete: boolean;
  enter: () => void;
  resetEntry: () => void;
  setIntroComplete: () => void;
}

export const usePortfolioStore = create<PortfolioState>()((set) => ({
  hasEntered: false,
  introComplete: false,
  enter: () => set({ hasEntered: true }),
  resetEntry: () => set({ hasEntered: false, introComplete: false }),
  setIntroComplete: () => set({ introComplete: true }),
}));

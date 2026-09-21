import { create } from 'zustand';

interface UiState {
  isGlobalLoading: boolean;
  loadingMessage?: string;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isGlobalLoading: false,
  loadingMessage: undefined,
  showLoader: (message) => set({ isGlobalLoading: true, loadingMessage: message }),
  hideLoader: () => set({ isGlobalLoading: false, loadingMessage: undefined }),
}));

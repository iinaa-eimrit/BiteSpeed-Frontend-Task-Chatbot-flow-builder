import { create } from 'zustand';
export type ThemePreset = 'light' | 'ghost' | 'teal';
type UiState = { theme: ThemePreset; setTheme: (t: ThemePreset) => void };
export const useUiStore = create<UiState>((set) => ({ theme: 'teal', setTheme: (theme) => set({ theme }) }));

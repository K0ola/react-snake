import { create } from "zustand";

const useStore = create((set) => ({
  modes: [],
  addMode: (mode) => set((state) => ({ modes: [...state.modes, mode] })),
  removeMode: (mode) => set((state) => ({ modes: state.modes.filter((m) => m !== mode) })),
}));

export default useStore;

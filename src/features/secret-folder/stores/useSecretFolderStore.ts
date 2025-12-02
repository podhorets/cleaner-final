import { create } from "zustand";

interface SecretFolderState {
  passcode: string | null;
  setPasscode: (passcode: string) => void;
  getPasscode: () => string | null;
  hasPasscode: () => boolean;
  clearPasscode: () => void;
}

export const useSecretFolderStore = create<SecretFolderState>((set, get) => ({
  passcode: null,

  setPasscode: (passcode: string) => {
    set({ passcode });
  },

  getPasscode: () => {
    return get().passcode;
  },

  hasPasscode: () => {
    return get().passcode !== null;
  },

  clearPasscode: () => {
    set({ passcode: null });
  },
}));


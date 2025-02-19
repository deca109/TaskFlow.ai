import { create } from "zustand";

interface CreateAITaskModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useCreateAITaskModal = create<CreateAITaskModalStore>((set) => ({
  isOpen: false,
  open: () => {
    set({ isOpen: true });
  },
  close: () => {
    set({ isOpen: false });
  },
}));

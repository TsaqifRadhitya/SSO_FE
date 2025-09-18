import { create } from "zustand";
import { useNotificationHookInterface } from "../types/Notification";

export const useNotification = create<useNotificationHookInterface>((set) => ({
  notification: undefined,
  setNotification: (notification) =>
    set({
      notification,
    }),
  removeNotificaton: () => set({ notification: undefined }),
}));

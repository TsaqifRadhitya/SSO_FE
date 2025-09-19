import { create } from "zustand";
import {
  NotificationType,
  useNotificationHookInterface,
} from "../types/Notification";

export const useNotification = create<useNotificationHookInterface>((set) => ({
  notificationState: undefined,
  setNotification: (notification) =>
    set({
      notificationState: {
        isAppear: false,
        notification,
      },
    }),
  removeNotificaton: () => set({ notificationState: undefined }),
  setAppear: () =>
    set((prev) => ({
      notificationState: {
        notification: prev.notificationState as unknown as NotificationType,
        isAppear: true,
      },
    })),
}));

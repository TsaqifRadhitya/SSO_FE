import { create } from "zustand";
import { useNotificationHookInterface } from "../types/Notification";

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
  setAppear: (data) =>
    set({
      notificationState: {
        isAppear: true,
        notification: data.notification,
      },
    }),
}));

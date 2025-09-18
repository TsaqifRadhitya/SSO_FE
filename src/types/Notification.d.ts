export type NotificationType = {
    message: string
    type: "Success" | "Error" | "Info" | "Warning"
}

export interface useNotificationHookInterface {
    notification?: NotificationType
    setNotification: (data: NotificationType) => void
    removeNotificaton: () => void
}
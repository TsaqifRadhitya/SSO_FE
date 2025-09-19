export type NotificationType = {
    message: string
    type: "Success" | "Error" | "Info" | "Warning"
}

export interface useNotificationHookInterface {
    notificationState?: {
        notification: NotificationType
        isAppear: boolean
    }
    setNotification: (data: NotificationType) => void
    removeNotificaton: () => void
    setAppear: (data: {
        notification: NotificationType
        isAppear: boolean
    }) => void
}
import { ApplicationType } from "./Application"

export type GlobalActionType<T> = {
    data: T
    action?: "Success" | "Failed" | "Loading"
    modalType: "Detail" | "Delete" | "Update"
}
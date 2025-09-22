export type CallbackApplicationType = {
    ID: number
    CreatedAt: string
    UpdatedAt: string
    DeletedAt: string | null
    callback: string
    application_id: number
}

export type ApplicationType = {
    ID: number
    CreatedAt: string
    UpdatedAt: string
    DeletedAt: string | null
    application_name: string
    application_key: string
    callback_applications?: CallbackApplicationType[]
}


import z from "zod"

export const UpsertApplicationValidation = z.object({
    application_name: z.string().min(1),
    callback_url: z.array(z.url()).optional()
})
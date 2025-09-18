import z from "zod";
import { BaseRepository } from "./BaseRepository";
import { UpsertApplicationValidation } from "../validators/ApplicationValidator";
import { ApplicationType } from "../types/Application";

export class ApplicationRepository extends BaseRepository {
    Index() : Promise<ApplicationType[]> {
        return this.authenticatedClientFetch("/api/application/", "GET")
    }

    Show(id: string) : Promise<ApplicationType> {
        return this.authenticatedClientFetch(`/api/application/${id}`, "GET")
    }

    Update(id: string, payload: z.infer<typeof UpsertApplicationValidation>) {
        return this.authenticatedClientFetch(`/api/application/${id}`, "PATCH", payload)
    }

    Delete(id: string) {
        return this.authenticatedClientFetch(`/api/application/${id}`, "DELETE")
    }

    Store(payload: z.infer<typeof UpsertApplicationValidation>) {
        return this.authenticatedClientFetch(`/api/application/create`, "POST", payload)
    }

    DeleteCallback(application_id: string, id: string) {
        return this.authenticatedClientFetch(`/api/application/${application_id}/${id}`, "DELETE")
    }

    UpdateCallback(application_id: string, id: string, callback: string) {
        const payload = {
            callback_url: callback
        }
        return this.authenticatedClientFetch(`/api/application/${application_id}/${id}`, "PATCH", payload)

    }
}
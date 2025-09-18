import z from "zod";
import { LoginValidator } from "../validators/LoginValidator";
import Axios from "../utils/axios";
import { UnautencicatedException } from "../errors/UnautenticatedException";
import { BaseRepository } from "./BaseRepository";

export class AuthRepository extends BaseRepository {
    async Login(data: z.infer<typeof LoginValidator>): Promise<string> {
        try {
            const loginRequest = await Axios.post("/api/auth/login", {
                ...data
            }, { withCredentials: true })

            return loginRequest.data.data.token
        } catch {
            throw new UnautencicatedException()
        }
    }

    async Register(): Promise<string> {
        return ""
    }

    async Logout() {
        try {
            await this.authenticatedClientFetch("/api/auth/logout", "POST")
        } catch {
            throw new UnautencicatedException()
        }
    }

    async SSO(callback_url: string, application_key: string): Promise<string> {
        await this.ensureToken()
        return this.authenticatedClientFetch<string>("/api/auth/sso", "POST", {
            callback_url,
            application_key
        })
    }

    async verifySSOCredential(callback_url: string, application_key: string): Promise<boolean> {
        try {
            await Axios.post("/api/auth/verify_access", {
                callback_url,
                application_key
            }, {
                withCredentials: true
            })
            return true
        } catch {
            return false
        }
    }
}
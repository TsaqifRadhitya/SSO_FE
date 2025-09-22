import { ConnectedApplicationType } from "../types/ConnectedApplication";
import { AccessLogType } from "../types/Loger";
import { UserType } from "../types/User";
import { BaseRepository } from "./BaseRepository";

export class UserRepository extends BaseRepository {
    async User(): Promise<UserType> {
        return this.authenticatedClientFetch("/api/user/", "GET")
    }

    async AccessLog(): Promise<AccessLogType[]> {
        return this.authenticatedClientFetch("/api/user/access_log", "GET")
    }

    async ConnectedApplication(): Promise<ConnectedApplicationType[]> {
        return this.authenticatedClientFetch("/api/user/connected_app", "GET")
    }
}
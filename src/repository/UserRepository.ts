import { UserType } from "../types/User";
import { BaseRepository } from "./BaseRepository";

export class UserRepository extends BaseRepository {
    async User(): Promise<UserType> {
        return this.authenticatedClientFetch("/api/user/", "GET")
    }

}
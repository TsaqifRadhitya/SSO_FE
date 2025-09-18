import { UserType } from "../types/User";
import { BaseRepository } from "./BaseRepository";

export class UserRepository extends BaseRepository {
    constructor() {
        super()
    }

    async User(): Promise<UserType> {
        return this.authenticatedClientFetch("/api/user/", "GET")
    }

}
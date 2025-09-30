// BaseRepository.ts
import Axios from "../utils/axios";
import { isAxiosError } from "axios";
import { UnautencicatedException } from "../errors/UnautenticatedException";
import { NotFoundExeption } from "../errors/NotFoundException";
import { BadRequestException } from "../errors/BadRequestException";
import { InternalServerError } from "../errors/InternalServerErrorException";

export abstract class BaseRepository {
    private static token: string | null = null;
    private static isTokenFetching: boolean = false;
    private static retryLimit = 1;

    async ensureToken(): Promise<void> {
        if (!BaseRepository.token && !BaseRepository.isTokenFetching) {
            BaseRepository.isTokenFetching = true;
            try {
                const token = await this.fetchToken();
                BaseRepository.token = token;
            } finally {
                BaseRepository.isTokenFetching = false;
            }
        }
    }

    private async fetchToken(): Promise<string> {
        try {
            const response = await Axios.get("/api/auth/refresh", {
                withCredentials: true,
            });
            return response.data.data.token;
        } catch {
            throw new UnautencicatedException();
        }
    }

    protected async authenticatedClientFetch<T>(
        url: string,
        method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH",
        payload?: object,
        retryCount = 0
    ): Promise<T> {
        await this.ensureToken();
        const headers: Record<string, string> = {};
        if (BaseRepository.token) {
            headers["Authorization"] = `Bearer ${BaseRepository.token}`;
        }
        try {
            switch (method) {
                case "GET":
                    return (await Axios.get(url, { headers })).data
                        .data;
                case "DELETE":
                    return (await Axios.delete(url, { headers })).data
                        .data;
                case "PATCH":
                    return (await Axios.patch(url, payload, { headers }))
                        .data.data;
                case "POST":
                    return (await Axios.post(url, payload, { headers }))
                        .data.data;
                case "PUT":
                    return (await Axios.put(url, payload, { headers })).data
                        .data;
                default:
                    throw new Error("Invalid method");
            }
        } catch (e: unknown) {
            if (isAxiosError(e)) {
                const status = e.response?.status;
                switch (status) {
                    case 401:
                        if (retryCount < BaseRepository.retryLimit) {
                            BaseRepository.token = null;
                            return this.authenticatedClientFetch<T>(url, method, payload, retryCount + 1);
                        }
                        throw new UnautencicatedException();
                    case 404:
                        throw new NotFoundExeption();
                    case 400:
                        throw new BadRequestException();
                    default:
                        throw new InternalServerError();
                }
            }
            throw new InternalServerError();
        }
    }
}

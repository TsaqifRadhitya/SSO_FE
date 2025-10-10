// BaseRepository.ts
import Axios from "../utils/axios";
import { isAxiosError } from "axios";
import { UnautencicatedException } from "../errors/UnautenticatedException";
import { NotFoundExeption } from "../errors/NotFoundException";
import { BadRequestException } from "../errors/BadRequestException";
import { InternalServerError } from "../errors/InternalServerErrorException";

export abstract class BaseRepository {
    private static retryLimit = 1;

    // 🧩 Ambil token dari cookie
    private getTokenFromCookie(): string | null {
        const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : null;
    }

    private setTokenToCookie(token: string): void {
        // expires 1 jam (opsional)
        const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString();
        document.cookie = `access_token=${encodeURIComponent(token)}; path=/; expires=${expires}`;
    }

    // 🧩 Hapus token dari cookie
    private clearTokenCookie(): void {
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }

    // 🔄 Refresh token dari server
    private async fetchToken(): Promise<void> {
        try {
            const response = await Axios.get("/api/auth/refresh", { withCredentials: true });
            const token = response.data.data.token;
            this.setTokenToCookie(token);
        } catch {
            this.clearTokenCookie();
            throw new UnautencicatedException();
        }
    }

    protected async authenticatedClientFetch<T>(
        url: string,
        method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH",
        payload?: object,
        retryCount = 0
    ): Promise<T> {
        let token = this.getTokenFromCookie();

        if (!token && retryCount === 0) {
            await this.fetchToken();
            token = this.getTokenFromCookie();
        }

        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        try {
            switch (method) {
                case "GET":
                    return (await Axios.get(url, { headers })).data.data;
                case "DELETE":
                    return (await Axios.delete(url, { headers })).data.data;
                case "PATCH":
                    return (await Axios.patch(url, payload, { headers })).data.data;
                case "POST":
                    return (await Axios.post(url, payload, { headers })).data.data;
                case "PUT":
                    return (await Axios.put(url, payload, { headers })).data.data;
                default:
                    throw new Error("Invalid method");
            }
        } catch (e: unknown) {
            if (isAxiosError(e)) {
                const status = e.response?.status;

                switch (status) {
                    case 401:
                        if (retryCount < BaseRepository.retryLimit) {
                            this.clearTokenCookie();
                            await this.fetchToken();
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

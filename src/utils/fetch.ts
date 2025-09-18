import { GetServerSidePropsContext, PreviewData } from "next"
import { NextParsedUrlQuery } from "next/dist/server/request-meta"
import Axios from "./axios"
import { isAxiosError } from "axios"
import { InternalServerError } from "../errors/InternalServerErrorException"
import { NotFoundExeption } from "../errors/NotFoundException"
import { BadRequestException } from "../errors/BadRequestException"
import { UnautencicatedException } from "../errors/UnautenticatedException"
import { Response } from "../types/getServerSidePropsReturn"
import axios from "./axios"


export const authenticatedServerFetch = async <T>(ctx: GetServerSidePropsContext<NextParsedUrlQuery, PreviewData>, url: string, method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH", payload?: object): Promise<Response<{ data: T }>> => {
    try {
        const cookie = ctx.req.headers.cookie;
        const tokenRequest = await axios.get("/api/auth/refresh", {
            withCredentials: true,
            headers: {
                cookie,
            },
        });

        const setCookieHeader = tokenRequest.headers["set-cookie"];
        const token = tokenRequest.data.data.token;
        const bearerToken = `Bearer ${token}`

        if (setCookieHeader) {
            ctx.res.setHeader("Set-Cookie", setCookieHeader);
        }

        switch (method) {
            case "GET":
                const requestGet = await Axios.get(url, {
                    withCredentials: true,
                    headers: {
                        Authorization: bearerToken
                    }
                })

                return {
                    token,
                    data: requestGet.data.data
                }
            case "DELETE":
                const requestDelete = await Axios.delete(url, {
                    withCredentials: true,
                    headers: {
                        Authorization: bearerToken
                    }
                })
                return {
                    token,
                    data: requestDelete.data.data
                }

            case "PATCH":
                const requestPatch = await Axios.patch(url, payload, {
                    headers: {
                        Authorization: bearerToken
                    },
                    withCredentials: true
                })
                return {
                    token,
                    data: requestPatch.data.data
                }

            case "POST":
                const requestPost = await Axios.post(url, payload, {
                    headers: {
                        Authorization: bearerToken
                    },
                    withCredentials: true
                })
                return {
                    token,
                    data: requestPost.data.data
                }

            default:
                const requestPut = await Axios.put(url, payload, {
                    headers: {
                        Authorization: bearerToken
                    },
                    withCredentials: true
                })
                return {
                    token,
                    ...requestPut.data.data
                }
        }

    }
    catch (e: unknown) {
        if (isAxiosError(e)) {
            switch (e.status) {
                case 404:
                    throw new NotFoundExeption()
                case 401:
                    throw new UnautencicatedException()
                case 400:
                    throw new BadRequestException()
                default:
                    throw new InternalServerError()
            }
        }
        throw new InternalServerError()
    }
}
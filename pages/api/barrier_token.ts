import Axios from "@/src/utils/axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse,) {
    try {
        const refreshToken = await Axios.get("/api/auth/refresh", {
            headers: {
                cookie: req.headers.cookie
            }
        })

        const setCookieHeader = refreshToken.headers["set-cookie"];
        if (setCookieHeader) {
            res.setHeader("Set-Cookie", setCookieHeader);
        }

        return res.status(200).json({
            token: refreshToken.data.data.token
        })
    } catch {
        return res.status(401).json({
            status: 401,
            message: "unauthorized"
        })
    }
}

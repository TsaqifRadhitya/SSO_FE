import { useEffect, useState } from "react"
import z from "zod"
import { LoginValidator } from "../validators/LoginValidator"
import { UserType } from "../types/User"
import { AuthRepository } from '../repository/AuthRepository';
import { UserRepository } from "../repository/UserRepository"
import { create } from "zustand"
import { ErrorMapper } from "../utils/ErroMapper";
import { useNotification } from "./useNotification";
import { useRouter } from "next/router";

export type authType = {
    status: boolean,
    user?: UserType
}

interface userUserInterface {
    auth: authType | undefined
    isFinish: boolean
    setUser: (user: UserType) => void
    resetUser: () => void
    setAuth: (auth: authType) => void
}

const useUser = create<userUserInterface>((state) => {
    return {
        auth: undefined,
        setUser: (user) => state((prev) => ({
            auth: {
                ...prev.auth as authType, user
            }
        })),
        isFinish: true,
        setAuth: (auth: authType) => state({ auth, isFinish: true }),
        resetUser: () => state((prev) => ({
            auth: undefined, isFinish: true
        }))
    }
})

export const useAuth = (initial?: boolean) => {
    const { auth, setAuth, isFinish, resetUser } = useUser()

    const { setNotification } = useNotification();
    const router = useRouter();

    const [redirectUrl, setRedirectUrl] = useState<string>()

    const [isloading, setLoading] = useState<boolean>(false)

    const autRepository = new AuthRepository()
    const userRepository = new UserRepository()

    const fetchUser = async () => {
        try {
            const data = await userRepository.User();
            setAuth({
                status: true,
                user: data
            })
        } catch {
            setAuth({ status: false });
        }
    };

    useEffect(() => {
        if (initial && !auth) {
            setLoading(true)
            fetchUser().then(() => setLoading(false))
        }
    }, [initial]);

    const SSO = async (application_key: string, callback_url: string) => {
        try {
            const SSOCallbackUrl = await autRepository.SSO(callback_url, application_key)
            setRedirectUrl(SSOCallbackUrl)
        } catch {
        }
    }

    const Login = async (data: z.infer<typeof LoginValidator>): Promise<ErrorMapper<z.infer<typeof LoginValidator>> | undefined> => {
        const validate = LoginValidator.safeParse(data)

        if (!validate.success) {
            const err = validate.error.format()
            return {
                email: err.email?._errors[0],
                password: err.password?._errors[0]
            }
        }
        try {
            await autRepository.Login(data)
            await fetchUser()
        } catch {
            return {
                email: "invalid credential"
            }
        }
    }

    const Logout = async (): Promise<boolean> => {
        try {
            await autRepository.Logout()
            setNotification({
                message: "Successfully logged out",
                type: "Success",
            });
            await router.push("/login");
            resetUser()
            return true
        } catch {
            setNotification({
                message: "Logout Failed. Please try again.",
                type: "Error",
            });
            return false
        }
    }

    return {
        auth, Login, Logout, SSO, redirectUrl, isloading, isFinish
    }
}
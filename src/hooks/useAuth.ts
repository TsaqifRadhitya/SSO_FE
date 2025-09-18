import { useEffect, useState } from "react"
import z from "zod"
import { LoginValidator } from "../validators/LoginValidator"
import { UserType } from "../types/User"
import { AuthRepository } from '../repository/AuthRepository';
import { UserRepository } from "../repository/UserRepository"
import { create } from "zustand"
import { ErrorMapper } from "../utils/ErroMapper";

interface userUserInterface {
    user: UserType | undefined,
    isAuth: boolean | undefined
    setUser: (user: UserType) => void
    resetUser: () => void
    setAuth: (a: boolean) => void
}

const useUser = create<userUserInterface>((state) => {
    return {
        setUser: (user) => state({ user: user }),
        user: undefined,
        isAuth: undefined,
        setAuth: (a: boolean) => state({ isAuth: a }),
        resetUser: () => state({ user: undefined })
    }
})

export const useAuth = () => {
    const { user, setUser, resetUser, isAuth, setAuth } = useUser()

    const [redirectUrl, setRedirectUrl] = useState<string>()

    const autRepository = new AuthRepository()
    const userRepository = new UserRepository()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await userRepository.User();
                setUser(data);
                setAuth(true);
            } catch {
                setAuth(false);
            }
        };
        if (!user && !isAuth) {
            fetchUser();
        }
    }, []);

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
            setAuth(true)
        } catch {
            return {
                email: "invalid credential"
            }
        }
    }

    const Logout = async (): Promise<boolean> => {
        try {
            await autRepository.Logout()
            resetUser()
            return true
        } catch {
            return false
        }
    }

    return {
        isAuth, user, Login, Logout, SSO, redirectUrl
    }
}
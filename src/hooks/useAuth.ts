import { useEffect, useState } from "react"
import z from "zod"
import { LoginValidator } from "../validators/LoginValidator"
import { UserType } from "../types/User"
import { AuthRepository } from '../repository/AuthRepository';
import { UserRepository } from "../repository/UserRepository"
import { create } from "zustand"
import { ErrorMapper } from "../utils/ErrorMapper";
import { useNotification } from "./useNotification";
import { RegisterValidator } from "../validators/RegisterValidator";
import { BadRequestException } from "../errors/BadRequestException";
import { checkEmail, newPasswordValidator } from '../validators/ResetPasswordValidator';

export type authType = {
    status: boolean,
    user?: UserType
}

interface userUserInterface {
    auth: authType | undefined
    isLogOut: boolean
    setUser: (user: UserType) => void
    resetUser: () => void
    setAuth: (auth: authType) => void
}

const useUser = create<userUserInterface>((set) => {
    return {
        auth: undefined,
        setUser: (user) => set((prev) => ({
            auth: {
                ...prev.auth as authType, user
            }
        })),
        isLogOut: false,
        setAuth: (auth: authType) => set({ auth }),
        resetUser: () => set({
            auth: undefined,
            isLogOut: true  // Corrected this line
        })
    }
})

export const useAuth = (initial?: boolean) => {
    const { auth, setAuth, isLogOut, resetUser } = useUser()
    const { setNotification } = useNotification();
    const [redirectUrl, setRedirectUrl] = useState<string>()
    const [isloading, setLoading] = useState<boolean>(false)
    const [ssoStep, setSSOStep] = useState<"Initial" | "Valid" | "Invalid">("Initial")

    const authRepository = new AuthRepository()
    const userRepository = new UserRepository()

    const fetchUser = async () => {
        try {
            const data = await userRepository.User();
            setAuth({
                status: true,
                user: data
            });
        } catch {
            setAuth({ status: false });
        }
    };

    useEffect(() => {
        if (initial && !auth) {
            const intialFetcth = async () => {
                setLoading(true)
                await fetchUser()
                setLoading(false)
            }
            intialFetcth()
        }
    }, [initial, auth]);

    const SSO = async (application_key?: string, callback_url?: string) => {
        if (ssoStep !== "Initial") return
        if (!application_key || !callback_url) {
            setSSOStep("Invalid")
            return
        }
        try {
            const SSOCallbackUrl = await authRepository.SSO(callback_url, application_key)
            setRedirectUrl(SSOCallbackUrl)
            setSSOStep("Valid")
        } catch {
            setSSOStep("Invalid")
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
            await authRepository.Login(data)
            await fetchUser()
        } catch {
            return {
                email: "invalid credential"
            }
        }
    }

    const Logout = async (): Promise<boolean> => {
        try {
            await authRepository.Logout()
            setNotification({
                message: "Successfully logged out",
                type: "Success",
            });
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

    const forgotPassword = async (email: string): Promise<string | undefined> => {
        const validate = checkEmail.safeParse(email)
        if (!validate.success) {
            return validate.error.format()._errors[0]
        }
        try {
            await authRepository.forgotPassword(email)
        } catch {
            return "email not found"
        }
        return undefined
    }

    const Register = async (data: z.infer<typeof RegisterValidator>): Promise<ErrorMapper<z.infer<typeof RegisterValidator> | undefined>> => {
        const validate = RegisterValidator.safeParse(data)
        if (!validate.success) {
            const err = validate.error.format()
            return {
                confirm_password: err.confirm_password?._errors[0],
                email: err.email?._errors[0],
                name: err.name?._errors[0],
                password: err.password?._errors[0],
                phone: err.phone?._errors[0]
            }
        }

        try {
            await authRepository.Register(data)
        } catch (e: unknown) {
            if (e instanceof BadRequestException) {
                return {
                    email: "",
                    phone: "",
                }
            }
        }
    }

    const verifyResetPassword = async (otp: string[], email: string): Promise<string | undefined> => {
        const code = otp.join("");
        if (code.length !== 6) {
            return "OTP harus 6 digit"
        }
        try {
            await authRepository.verifyResetPasswordOTP(email, code)
        } catch {
            return "invalid otp"
        }
    }

    const setNewPassword = async (data: z.infer<typeof newPasswordValidator>): Promise<ErrorMapper<z.infer<typeof newPasswordValidator>> | undefined> => {
        const validate = newPasswordValidator.safeParse(data)
        if (!validate.success) {
            const err = validate.error.format()
            return {
                confirm_password: err.confirm_password?._errors[0],
                password: err.password?._errors[0]
            }
        }

        try {
            await authRepository.setNewPassword(data.password)
        } catch {
            return {
                password: "Password already use in preview password"
            }
        }
        return undefined

    }

    return {
        auth, Login, Register, setNewPassword, Logout, forgotPassword, verifyResetPassword, SSO, redirectUrl, isloading, isLogOut, ssoStep
    }
}
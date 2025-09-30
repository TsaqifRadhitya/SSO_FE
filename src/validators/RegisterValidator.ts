import z from "zod"

export const RegisterValidator = z
    .object({
        name: z.string().min(1, "Harap memasukkan nama pemilik akun"),
        email: z.string().email({ message: "Harap memasukkan email dengan benar" }),
        phone: z
            .string()
            .regex(/^(?:\+62|62|0)8[1-9][0-9]{6,10}$/, "Harap memasukkan nomor yang valid"),
        password: z
            .string()
            .min(8, "Password minimal 8 karakter")
            .refine((val) => /[a-z]/.test(val), {
                message: "Password harus mengandung huruf kecil",
            })
            .refine((val) => /[A-Z]/.test(val), {
                message: "Password harus mengandung huruf besar",
            })
            .refine((val) => /\d/.test(val), {
                message: "Password harus mengandung angka",
            })
            .refine((val) => /[\W_]/.test(val), {
                message: "Password harus mengandung simbol",
            }),
        confirm_password: z.string().min(8, "Password minimal 8 karakter"),
    })
    .refine((data) => data.password === data.confirm_password, {
        path: ["confirm_password"], // error akan diarahkan ke field confirm_password
        message: "Konfirmasi password tidak sesuai",
    })

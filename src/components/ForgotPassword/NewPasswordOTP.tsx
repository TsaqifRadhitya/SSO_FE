import { useState, useTransition } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import Spinner from "../Spinner";
import { ErrorMapper } from "@/src/utils/ErrorMapper";
import z from "zod";
import { newPasswordValidator } from "@/src/validators/ResetPasswordValidator";
import { useNotification } from "@/src/hooks/useNotification";
import { useRouter } from "next/navigation";

export default function NewPasswordForm() {
  const { setNewPassword } = useAuth();
  const [isPending, startTransition] = useTransition();
  const { setNotification } = useNotification();
  const router = useRouter()

  const [password, setPassword] = useState({
    password: "",
    confirm_password: "",
  });
  const [err, setErr] =
    useState<ErrorMapper<z.infer<typeof newPasswordValidator>>>();

  const handleSubmit = () => {
    setErr(undefined);
    startTransition(async () => {
      const res = await setNewPassword(password);
      setPassword({
        confirm_password: "",
        password: "",
      });
      if (res) {
        setErr(res);
        return;
      }
      router.replace("/login")
      setNotification({
        type: "Success",
        message: "Success Reset Password",
      });
    });
  };

  return (
    <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Set New Password</h1>
        <p className="text-gray-400 mt-2">Masukkan password baru Anda</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-bold text-gray-300 block mb-2">
            Password Baru
          </label>
          <input
            type="password"
            value={password.password}
            onChange={(e) =>
              setPassword((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 placeholder:text-gray-500 border border-transparent focus:border-cyan-500 focus:ring-cyan-500 transition"
            placeholder="********"
          />
          {err?.password && (
            <p className="text-red-500 text-xs italic mt-2">{err.password}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-bold text-gray-300 block mb-2">
            Konfirmasi Password
          </label>
          <input
            type="password"
            value={password.confirm_password}
            onChange={(e) =>
              setPassword((prev) => ({
                ...prev,
                confirm_password: e.target.value,
              }))
            }
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 placeholder:text-gray-500 border border-transparent focus:border-cyan-500 focus:ring-cyan-500 transition"
            placeholder="********"
          />
          {err?.confirm_password && (
            <p className="text-red-500 text-xs italic mt-2">{err?.confirm_password}</p>
          )}
        </div>
      </div>

      <button
        className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 flex justify-center items-center shadow-lg p-3 text-white font-bold text-lg transition-colors duration-200 disabled:bg-blue-800/50 cursor-pointer disabled:cursor-not-allowed"
        disabled={isPending}
        onClick={handleSubmit}
      >
        {isPending ? <Spinner size={2} /> : "Simpan Password"}
      </button>
    </div>
  );
}

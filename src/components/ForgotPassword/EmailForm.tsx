import { Dispatch, SetStateAction, useState, useTransition } from "react";
import Spinner from "../Spinner";
import { useAuth } from "@/src/hooks/useAuth";

export default function EmailForm({setProgress,setResetedEmail} : {setProgress : Dispatch<SetStateAction<"waiting for email" | "invalid email" | "waiting for otp" | "invalid otp" | "Valid OTP">>,setResetedEmail : (email : string) => void}) {
  const [isSubmited, setSubmited] = useTransition();
  const [email,setEmail] = useState<string>("")
  const [err,setErr] = useState<string>()
  const {forgotPassword} = useAuth()

  const handleLogin = () => {
    setSubmited(async() => {
        const ress = await forgotPassword(email)
        if(ress) {
            setErr(ress)
            return
        }
        setErr(undefined)
        setResetedEmail(email)
        setProgress("waiting for otp")
    })
  }

  return (
    <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Reset Password</h1>
        <p className="text-gray-400 mt-2">Please enter your email</p>
      </div>
      <form className="space-y-4">
        <div>
          <label
            className="text-sm font-bold text-gray-300 block mb-2"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 placeholder:text-gray-500 border border-transparent focus:border-cyan-500 focus:ring-cyan-500 transition"
          />
          {err && (
            <p className="text-red-500 text-xs italic mt-2">{err}</p>
          )}
        </div>
      </form>
      <button
        className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 flex justify-center items-center shadow-lg p-3 text-white font-bold text-lg transition-colors duration-200 disabled:bg-blue-800/50 cursor-pointer disabled:cursor-not-allowed"
        disabled={isSubmited}
        onClick={handleLogin}
      >
        {isSubmited ? <Spinner size={2} /> : "Reset"}
      </button>
    </div>
  );
}

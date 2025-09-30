import {
  Dispatch,
  SetStateAction,
  useState,
  useTransition,
  useRef,
  useEffect,
} from "react";
import Spinner from "../Spinner";
import { useAuth } from "@/src/hooks/useAuth";

export default function OTPForm({
  setProgress,
  email,
}: {
  setProgress: Dispatch<
    SetStateAction<
      | "waiting for email"
      | "invalid email"
      | "waiting for otp"
      | "invalid otp"
      | "Valid OTP"
    >
  >;
  email: string;
}) {
  const [isSubmited, setSubmited] = useTransition();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [err, setErr] = useState<string>();
  const { verifyResetPassword, forgotPassword } = useAuth();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // cooldown resend OTP
  const [cooldown, setCooldown] = useState(30);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (val: string, idx: number) => {
    if (!/^\d*$/.test(val)) return; // hanya angka
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1); // ambil hanya 1 digit terakhir
    setOtp(newOtp);

    if (val && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleVerify = () => {
    setSubmited(async () => {
      const ress = await verifyResetPassword(otp,email);
      if (ress) {
        setErr(ress);
        setProgress("invalid otp");
        return;
      }
      setProgress("Valid OTP");
      console.log("jalan")
    });
  };

  const handleResend = async () => {
    const res = await forgotPassword(email);
    if (res) {
      setErr(res);
      setProgress("invalid email");
      return;
    }
    setOtp(["","","","","",""])
    setErr(undefined);
    setCooldown(30); // reset cooldown
    setProgress("waiting for otp");
  };

  return (
    <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Reset Password</h1>
        <p className="text-gray-400 mt-2">Please enter the 6-digit OTP</p>
      </div>

      <div className="flex justify-between gap-2">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputsRef.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="w-12 h-12 text-center text-xl font-bold bg-gray-700 text-white rounded-lg border border-transparent focus:border-cyan-500 focus:ring-cyan-500 outline-none"
          />
        ))}
      </div>

      {err && (
        <p className="text-red-500 text-xs italic mt-2 text-center">{err}</p>
      )}

      <button
        className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 flex justify-center items-center shadow-lg p-3 text-white font-bold text-lg transition-colors duration-200 disabled:bg-blue-800/50 cursor-pointer disabled:cursor-not-allowed"
        disabled={isSubmited}
        onClick={handleVerify}
      >
        {isSubmited ? <Spinner size={2} /> : "Verify OTP"}
      </button>

      <div className="text-center mt-4">
        {cooldown > 0 ? (
          <p className="text-gray-400 text-sm">
            Kirim ulang OTP dalam <span className="font-bold">{cooldown}</span>{" "}
            detik
          </p>
        ) : (
          <button
            onClick={handleResend}
            className="text-sm text-cyan-400 hover:underline cursor-pointer"
          >
            Kirim ulang OTP
          </button>
        )}
      </div>
    </div>
  );
}

import Spinner from "@/src/components/Spinner";
import { useAuth } from "@/src/hooks/useAuth";
import { useNotification } from "@/src/hooks/useNotification";
import BaseLayout from "@/src/layouts/BaseLayout";
import GuestLayout from "@/src/layouts/GuestLayout";
import { ErrorMapper } from "@/src/utils/ErrorMapper";
import { RegisterValidator } from "@/src/validators/RegisterValidator";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useTransition } from "react";
import z from "zod";

export default function RegisterPage() {
  const { Register } = useAuth();
  const router = useRouter();
  const { application_key, callback_url } = router.query;
  const { setNotification } = useNotification();
  const [isSubmited, setSubmited] = useTransition();
  const [err, setErr] =
    useState<ErrorMapper<z.infer<typeof RegisterValidator>>>();
  const [register, setRegister] = useState<z.infer<typeof RegisterValidator>>({
    email: "",
    name: "",
    password: "",
    phone: "",
    confirm_password: "",
  });

  const submitByEnter = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  useEffect(() => {
    document.addEventListener("keypress", submitByEnter);

    return () => document.removeEventListener("keypress", submitByEnter);
  }, [register]);

  const handleRegister = () => {
    setSubmited(async () => {
      const result = await Register(register);
      if (result) {
        setNotification({ message: "Login Failed", type: "Error" });
        setErr(undefined);
        setRegister((prev) => ({
          ...prev,
          password: "",
          confirm_password: "",
        }));
        setErr(result);
        return;
      }

      setErr(undefined);
      if (application_key && callback_url) {
        setNotification({ message: "Redirect To SSO", type: "Info" });
        router.push(
          `/sso?application_key=${application_key}&&callback_url=${callback_url}`
        );
        return;
      }
      setNotification({ message: "Register Success", type: "Success" });
    });
  };
  return (
    <GuestLayout className="flex items-center justify-center py-0 pt-20">
      <Head>
        <title>SSO - Register Page</title>
      </Head>
      <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">SSO Register</h1>
          <p className="text-gray-400 mt-2">Welcome back! Please register.</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label
              className="text-sm font-bold text-gray-300 block mb-2"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="john doe"
              value={register?.name}
              onChange={(e) =>
                setRegister((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 placeholder:text-gray-500 border border-transparent focus:border-cyan-500 focus:ring-cyan-500 transition"
            />
            {err?.name && (
              <p className="text-red-500 text-xs italic mt-2">{err.name}</p>
            )}
          </div>
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
              value={register?.email}
              onChange={(e) =>
                setRegister((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 placeholder:text-gray-500 border border-transparent focus:border-cyan-500 focus:ring-cyan-500 transition"
            />
            {err?.email && (
              <p className="text-red-500 text-xs italic mt-2">{err.email}</p>
            )}
          </div>
          <div>
            <label
              className="text-sm font-bold text-gray-300 block mb-2"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="number"
              placeholder="you@example.com"
              value={register?.phone}
              onChange={(e) =>
                setRegister((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 placeholder:text-gray-500 border border-transparent focus:border-cyan-500 focus:ring-cyan-500 transition"
            />
            {err?.phone && (
              <p className="text-red-500 text-xs italic mt-2">{err?.phone}</p>
            )}
          </div>
          <div>
            <label
              className="text-sm font-bold text-gray-300 block mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={register?.password}
              onChange={(e) =>
                setRegister((prev) => ({ ...prev, password: e.target.value }))
              }
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 placeholder:text-gray-500 border border-transparent focus:border-cyan-500 focus:ring-cyan-500 transition"
            />
            {err?.password && (
              <p className="text-red-500 text-xs italic mt-2">{err.password}</p>
            )}
          </div>
          <div>
            <label
              className="text-sm font-bold text-gray-300 block mb-2"
              htmlFor="confirm_password"
            >
              Confirm Password
            </label>
            <input
              id="confirm_password"
              type="password"
              placeholder="••••••••"
              value={register?.confirm_password}
              onChange={(e) =>
                setRegister((prev) => ({
                  ...prev,
                  confirm_password: e.target.value,
                }))
              }
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 placeholder:text-gray-500 border border-transparent focus:border-cyan-500 focus:ring-cyan-500 transition"
            />
            {err?.confirm_password && (
              <p className="text-red-500 text-xs italic mt-2">
                {err.confirm_password}
              </p>
            )}
          </div>
        </form>
        <div>
          <div className="flex gap-1 justify-end text-sm font-light mb-2.5">
            <p>Sudah punya akun ? </p>
            <Link className="font-[500]" href={"/login"}>
              Login
            </Link>
          </div>
          <button
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 flex justify-center items-center shadow-lg p-3 text-white font-bold text-lg transition-colors duration-200 disabled:bg-blue-800/50 cursor-pointer disabled:cursor-not-allowed"
            disabled={isSubmited}
            onClick={handleRegister}
          >
            {isSubmited ? <Spinner size={2} /> : "Register"}
          </button>
        </div>
      </div>
    </GuestLayout>
  );
}

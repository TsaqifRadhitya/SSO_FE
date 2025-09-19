import Spinner from "@/src/components/Spinner";
import { LoginValidator } from "@/src/validators/LoginValidator";
import { useEffect, useState, useTransition } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import z from "zod";
import { useRouter } from "next/router";
import { useNotification } from "@/src/hooks/useNotification";
import { GetServerSideProps } from "next";
import Head from "next/head";
import BaseLayout from "@/src/layouts/BaseLayout";
import { ErrorMapper } from "@/src/utils/ErroMapper";

type loginServerSidePropsType = {
  application_key?: string;
  callback_url?: string;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { application_key, callback_url } = ctx.query;

  return {
    props: {
      application_key: application_key ?? "",
      callback_url: callback_url ?? "",
    },
  };
};

export default function LoginPage({
  application_key,
  callback_url,
}: loginServerSidePropsType) {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const { setNotification } = useNotification();
  const { Login, auth } = useAuth(true);
  const [err, setErr] = useState<ErrorMapper<z.infer<typeof LoginValidator>>>();
  const [isSubmited, setSubmited] = useTransition();

  const router = useRouter();

  const submitByEnter = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  useEffect(() => {
    document.addEventListener("keypress", submitByEnter);

    return () => document.removeEventListener("keypress", submitByEnter);
  }, [login]);

  useEffect(() => {
    if (auth?.status && application_key === "" && callback_url === "") {
      router.push("/");
    }
  }, [auth]);

  const handleLogin = () => {
    setSubmited(async () => {
      const result = await Login(login);
      if (result) {
        setNotification({ message: "Login Failed", type: "Error" });
        setErr(undefined);
        setLogin({ ...login, password: "" });
        setErr(result);
        return;
      }

      setErr(undefined);
      if (application_key !== "" && callback_url !== "") {
        setNotification({ message: "Redirect To SSO", type: "Info" });
        router.push(
          `/sso?application_key=${application_key}&&callback_url=${callback_url}`
        );
        return;
      }
      setNotification({ message: "Login Success", type: "Success" });
    });
  };

  return (
    <BaseLayout className="flex items-center justify-center p-4">
      <Head>
        <title>SSO - Login Page</title>
      </Head>
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">SSO Login</h1>
          <p className="text-gray-400 mt-2">Welcome back! Please sign in.</p>
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
              value={login?.email}
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 placeholder:text-gray-500 border border-transparent focus:border-cyan-500 focus:ring-cyan-500 transition"
            />
            {err?.email && (
              <p className="text-red-500 text-xs italic mt-2">{err.email}</p>
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
              value={login?.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 placeholder:text-gray-500 border border-transparent focus:border-cyan-500 focus:ring-cyan-500 transition"
            />
            {err?.password && (
              <p className="text-red-500 text-xs italic mt-2">{err.password}</p>
            )}
          </div>
        </form>

        <button
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 flex justify-center items-center shadow-lg p-3 text-white font-bold text-lg transition-colors duration-200 disabled:bg-blue-800/50 cursor-pointer disabled:cursor-not-allowed"
          disabled={isSubmited}
          onClick={handleLogin}
        >
          {isSubmited ? <Spinner size={2} /> : "Login"}
        </button>
      </div>
    </BaseLayout>
  );
}

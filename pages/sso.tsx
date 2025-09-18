"use client";

import Spinner from "@/src/components/Spinner";
import { useAuth } from "@/src/hooks/useAuth";
import { Response } from "@/src/types/getServerSidePropsReturn";
import { UserType } from "@/src/types/User";
import Axios from "@/src/utils/axios";
import { authenticatedServerFetch } from "@/src/utils/fetch";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

type SSOServerSideProps = {
  ssoCredential?: {
    application_key: string;
    callback_url: string;
  };
  status: boolean;
};

export const getServerSideProps: GetServerSideProps<
  Response<{ data: SSOServerSideProps }>
> = async (ctx) => {
  try {
    const ress = await authenticatedServerFetch<UserType>(
      ctx,
      "api/user",
      "GET"
    );
    const application_key = Array.isArray(ctx.query.application_key)
      ? ctx.query.application_key[0]
      : ctx.query.application_key ?? "";

    const callback_url = Array.isArray(ctx.query.callback_url)
      ? ctx.query.callback_url[0]
      : ctx.query.callback_url ?? "";

    if (!application_key && !callback_url) {
      return {
        props: {
          data: {
            status: false,
          },
          token: ress.token,
        },
      };
    }
    try {
      await Axios.post("/api/auth/verify_access", {
        application_key,
        callback_url,
      });
      return {
        props: {
          data: {
            ssoCredential: {
              application_key,
              callback_url,
            },
            status: true,
          },
          token: ress.token,
        },
      };
    } catch {
      return {
        props: {
          data: {
            status: false,
          },
          token: ress.token,
        },
      };
    }
  } catch {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

export default function SSOPage({
  data: { status, ssoCredential },
}: Response<{ data: SSOServerSideProps }>) {
  const { SSO, redirectUrl } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (redirectUrl) {
      router.push(redirectUrl);
      return;
    }

    if (status && ssoCredential) {
      SSO(ssoCredential.application_key, ssoCredential.callback_url);
    }
  }, [redirectUrl, status, ssoCredential, SSO, router]);

  if (redirectUrl) {
    return (
      <main className="min-h-screen w-full flex flex-col items-center justify-center text-white p-4">
        <Spinner size={3} />
        <h1 className="text-2xl font-bold mt-6">Redirecting</h1>
        <p className="text-gray-400">
          Please wait while we securely redirect you...
        </p>
      </main>
    );
  }

  if (!status || !ssoCredential) {
    return (
      <main className="min-h-screen w-full flex flex-col items-center justify-center text-white p-4">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-16 w-16 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-3xl font-bold mt-4 text-red-500">
            Not Authorized
          </h1>
          <p className="text-gray-300 mt-2">
            You do not have permission to access this resource or the SSO
            request is invalid.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center text-white p-4">
      <Head>
        <title>SSO - Authenticating...</title>
      </Head>
      <Spinner size={3} />
      <h1 className="text-2xl font-bold mt-6">Authenticating</h1>
      <p className="text-gray-400">
        Please wait while we verify your credentials...
      </p>
    </main>
  );
}

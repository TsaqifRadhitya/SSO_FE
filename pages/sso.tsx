"use client";

import Spinner from "@/src/components/Spinner";
import { useAuth } from "@/src/hooks/useAuth";
import BaseLayout from "@/src/layouts/BaseLayout";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SSOPage() {
  const { SSO, redirectUrl, ssoStep, auth } = useAuth(true);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const { application_key, callback_url } = router.query;
    if (auth?.status === false) {
      if (application_key && callback_url) {
        router.replace(
          `/login?callback_url=${callback_url}&application_key=${application_key}`
        );
        return;
      }
      router.replace("/login");
    }
    if (redirectUrl && ssoStep === "Valid") {
      router.push(redirectUrl);
      return;
    }

    if (ssoStep === "Initial") {
      SSO(application_key as string, callback_url as string);
    }
  }, [redirectUrl, ssoStep, auth]);

  if (redirectUrl && ssoStep === "Valid") {
    return (
      <BaseLayout className="min-h-screen w-full flex flex-col items-center justify-center text-white p-4">
        <Spinner size={3} />
        <h1 className="text-2xl font-bold mt-6">Redirecting</h1>
        <p className="text-gray-400">
          Please wait while we securely redirect you...
        </p>
      </BaseLayout>
    );
  }

  if (ssoStep === "Invalid") {
    return (
      <BaseLayout className="min-h-screen w-full flex flex-col items-center justify-center text-white p-4">
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
      </BaseLayout>
    );
  }

  return (
    <BaseLayout className="min-h-screen w-full flex flex-col items-center justify-center text-white p-4">
      <Head>
        <title>SSO - Authenticating...</title>
      </Head>
      <Spinner size={3} />
      <h1 className="text-2xl font-bold mt-6">Authenticating</h1>
      <p className="text-gray-400">
        Please wait while we verify your credentials...
      </p>
    </BaseLayout>
  );
}

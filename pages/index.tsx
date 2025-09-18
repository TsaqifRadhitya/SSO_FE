"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { useNotification } from "@/src/hooks/useNotification";
import { Response } from "@/src/types/getServerSidePropsReturn";
import { UserType } from "@/src/types/User";
import { formatDate } from "@/src/utils/DateFormaterUtils";
import { authenticatedServerFetch } from "@/src/utils/fetch";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";

const connectedApps = [
  {
    id: 1,
    name: "Project Management Hub",
    description: "Collaborate and manage your team's projects seamlessly.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-400"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
      </svg>
    ),
  },
  {
    id: 2,
    name: "Internal HR Portal",
    description: "Access your employee information and company resources.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-green-400"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
  },
  {
    id: 3,
    name: "Developer Sandbox",
    description: "Test and deploy applications in a secure environment.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-purple-400"
      >
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
  },
];

const accessLogs = [
  {
    id: 1,
    appName: "Project Management Hub",
    timestamp: new Date("2025-09-18T09:45:17+07:00"),
    ipAddress: "103.45.67.89",
    location: "Jakarta, Indonesia",
  },
  {
    id: 2,
    appName: "Internal HR Portal",
    timestamp: new Date("2025-09-17T15:22:05+07:00"),
    ipAddress: "202.15.11.2",
    location: "Bandung, Indonesia",
  },
  {
    id: 3,
    appName: "Project Management Hub",
    timestamp: new Date("2025-09-17T08:01:40+07:00"),
    ipAddress: "103.45.67.89",
    location: "Jakarta, Indonesia",
  },
  {
    id: 4,
    appName: "Developer Sandbox",
    timestamp: new Date("2025-09-16T11:50:33+07:00"),
    ipAddress: "114.20.8.15",
    location: "Surabaya, Indonesia",
  },
];

export const getServerSideProps: GetServerSideProps<
  Response<{data : UserType}>
> = async (ctx) => {
  try {
    const ress = await authenticatedServerFetch<UserType>(
      ctx,
      "api/user",
      "GET"
    );
    return {
      props: ress,
    };
  } catch (e: unknown) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

export default function Home({token,data : {email, name, phone} }: Response<{data : UserType}>) {
  const { Logout } = useAuth();
  const { setNotification } = useNotification();
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const logoutHandler = async () => {
    setLoading(true);
    const ressLogout = await Logout();
    if (ressLogout) {
      setNotification({
        message: "Successfully logged out",
        type: "Success",
      });
      router.push("/login");
    } else {
      setNotification({
        message: "Logout Failed. Please try again.",
        type: "Error",
      });
    }
    setLoading(false);
  };

  const handleConsoleRedirect = () => {
    router.push("/application");
  };

  return (
    <main className="w-full min-h-screen text-white p-4 sm:p-8 flex flex-col items-center">
      <Head>
        <title>SSO - Home Page</title>
      </Head>
      <header className="w-full max-w-6xl flex justify-end items-center space-x-4">
        <button
          disabled={isLoading}
          onClick={handleConsoleRedirect}
          className="rounded-md shadow bg-blue-600 hover:bg-blue-700 text-white p-3 py-2 cursor-pointer transition-colors duration-200 disabled:opacity-50"
        >
          Go to SSO Console
        </button>
        <button
          disabled={isLoading}
          onClick={logoutHandler}
          className="rounded-md shadow bg-red-700 hover:bg-red-800 text-white p-3 py-2 cursor-pointer transition-colors duration-200 disabled:opacity-50"
        >
          Log Out
        </button>
      </header>

      <div className="w-full max-w-6xl mt-8">
        <section className="bg-gray-800 rounded-xl shadow-2xl p-8 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">{name}</h1>
          <p className="text-gray-400 mt-2">{email}</p>
          <p className="text-gray-400 mt-1">{phone}</p>
        </section>
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-6 text-left">
            Connected Applications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {connectedApps.map((app) => (
              <div
                key={app.id}
                className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full mr-4">
                    {app.icon}
                  </div>
                  <h3 className="text-xl font-bold">{app.name}</h3>
                </div>
                <p className="text-gray-400 text-sm flex-grow">
                  {app.description}
                </p>
                <a
                  href="#"
                  className="mt-4 text-blue-400 hover:text-blue-300 self-start"
                >
                  Go to App &rarr;
                </a>
              </div>
            ))}
          </div>
        </section>
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-6 text-left">
            Recent SSO Access
          </h2>
          <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg border border-cyan-500/30">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">
              Last Login Activity
            </h3>
            <p>
              <span className="font-semibold text-gray-300">Time:</span>{" "}
              <span className="text-gray-400">
                {formatDate(accessLogs[0].timestamp)}
              </span>
            </p>
            <p>
              <span className="font-semibold text-gray-300">
                From Application:
              </span>{" "}
              <span className="text-gray-400">{accessLogs[0].appName}</span>
            </p>
          </div>
          <div className="space-y-4">
            {accessLogs.map((log) => (
              <div
                key={log.id}
                className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4"
              >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <div className="flex-grow">
                  <p className="font-bold">{log.appName}</p>
                  <p className="text-sm text-gray-400">
                    {formatDate(log.timestamp)}
                  </p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{log.ipAddress}</p>
                  <p>{log.location}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

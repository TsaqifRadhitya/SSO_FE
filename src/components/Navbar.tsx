"use client";

import Link from "next/link";
import { UserType } from "../types/User";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "../utils/Cn";

const Navbar = ({ user }: { user: UserType | undefined }) => {
  const icon = user?.name.includes(" ")
    ? [user.name.split(" ")[0], user.name.split(" ")[1]].join("")
    : user?.name.substring(0, 1);

  const pathName = usePathname();
  const [pathNameState, setPathName] = useState<
    "HOME" | "APPLICATION" | "PROFILE" | "LOG" | "SETTING"
  >("HOME");

  useEffect(() => {
    if (pathName.startsWith("/application")) {
      setPathName("APPLICATION");
      return;
    }

    if (pathName.startsWith("/logs")) {
      setPathName("LOG");
      return;
    }

    if (pathName.startsWith("/profile")) {
      setPathName("PROFILE");
      return;
    }

    if (pathName.startsWith("/Setting")) {
      setPathName("SETTING");
      return;
    }

    pathName === "/" && setPathName("HOME");
  }, [pathName]);
  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-800 shadow-lg z-50 border-b border-gray-700">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href={user ? "/" : "login"}
            className="flex items-center space-x-4"
          >
            <svg
              className="h-8 w-8 text-cyan-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="text-xl font-bold text-white">SSO</span>
          </Link>

          {user && (
            <>
              <nav className="hidden md:flex items-center space-x-4">
                <Link
                  href="/"
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium",
                    pathNameState === "HOME"
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  href="/application"
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium",
                    pathNameState === "APPLICATION"
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  )}
                >
                  Applications
                </Link>
                <Link
                  href="/logs"
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium",
                    pathNameState === "LOG"
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  )}
                >
                  Logs
                </Link>
              </nav>

              <Link href={"/profile"} className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{icon}</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-white">
                    {user.name}
                  </p>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

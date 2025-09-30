"use client";

import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import NotificationProvider from "../providers/NotificationProvider";
import { cn } from "../utils/Cn";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export default function BaseLayout({
  className,
  children,
}: Readonly<{
  className?: string;
  children: React.ReactNode;
}>) {
  const { auth } = useAuth();
  return (
    <NotificationProvider className={montserrat.className}>
      <div
        className="absolute bg-fixed inset-0 z-[-1]"
        style={{
          backgroundImage: `
          radial-gradient(ellipse at 20% 30%, rgba(56, 189, 248, 0.4) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 70%),
          radial-gradient(ellipse at 60% 20%, rgba(236, 72, 153, 0.25) 0%, transparent 50%),
          radial-gradient(ellipse at 40% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 65%)
        `,
        }}
      />
      {<Navbar className={montserrat.className} auth={auth} />}
      <main
        className={cn(
          "py-28 px-36 w-full min-h-screen bg-fixed",
          className,
          montserrat.className
        )}
      >
        {children}
      </main>
    </NotificationProvider>
  );
}

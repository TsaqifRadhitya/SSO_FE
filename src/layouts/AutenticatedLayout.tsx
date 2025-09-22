import { ReactNode, useLayoutEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import BaseLayout from "./BaseLayout";
import { cn } from "../utils/Cn";

const AuthenticatedLayout = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { auth, isLogOut, isloading } = useAuth(true);
  const router = useRouter();

  useLayoutEffect(() => {
    if (!isloading && !auth?.status) {
      router.push("/login");
    }
  }, [isloading, auth, router]);

  if (auth?.status) {
    return <BaseLayout className={className}>{children}</BaseLayout>;
  }

  if (isloading && !isLogOut) {
    return (
      <BaseLayout className={cn("flex h-screen flex-col items-center justify-center text-center",className)}>
        <div className="animate-pulse">
          <h1 className="mt-4 text-xl font-bold text-white">
            Memverifikasi Sesi...
          </h1>
          <p className="text-gray-400">Harap tunggu sebentar.</p>
        </div>
      </BaseLayout>
    );
  }
  return (
    <BaseLayout className={className}>
      <></>
    </BaseLayout>
  );
};

export default AuthenticatedLayout;

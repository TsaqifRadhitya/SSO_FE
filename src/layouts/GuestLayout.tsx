import { ReactNode, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import BaseLayout from "./BaseLayout";

export default function GuestLayout({ children,className }: { children: ReactNode,className? : string }) {
  const { auth, isloading } = useAuth(true);
  const router = useRouter();
  const { application_key, callback_url } = router.query;

  useEffect(() => {
    if (!isloading && auth?.status && !application_key && !callback_url) {
      router.push("/");
      return;
    }

    if (!isloading && auth?.status) {
      router.replace(
        `/sso?application_key=${application_key}&callback_url=${callback_url}`
      );
      return;
    }
  }, [auth, isloading]);
  return <BaseLayout className={className}>{children}</BaseLayout>;
}

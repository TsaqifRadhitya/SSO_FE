import { ReactNode, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";

const AutenticatedProvider = ({ children }: { children: ReactNode }) => {
  const { isAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuth === false) {
      router.push("/login");
    }
  }, [isAuth]);

  return children;
};

export default AutenticatedProvider;

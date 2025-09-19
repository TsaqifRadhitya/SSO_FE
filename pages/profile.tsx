import { useAuth } from "@/src/hooks/useAuth";
import { useNotification } from "@/src/hooks/useNotification";
import BaseLayout from "@/src/layouts/BaseLayout";
import AutenticatedProvider from "@/src/providers/AutenticatedProvider";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProfilePage() {
  const [isLoading, setLoading] = useState(false);
  const { Logout } = useAuth();

  const logoutHandler = async () => {
    setLoading(true);
    await Logout();
    setLoading(false);
  };

  return (
    <AutenticatedProvider>
      <BaseLayout>
        <header className="w-full flex justify-between items-center space-x-4">
          <div>
            <h1 className="text-4xl font-bold text-white">Profile Account</h1>
          </div>
          <button
            disabled={isLoading}
            onClick={logoutHandler}
            className="rounded-md shadow bg-red-700 hover:bg-red-800 text-white p-3 py-2 cursor-pointer transition-colors duration-200 disabled:opacity-50"
          >
            Log Out
          </button>
        </header>
      </BaseLayout>
    </AutenticatedProvider>
  );
}

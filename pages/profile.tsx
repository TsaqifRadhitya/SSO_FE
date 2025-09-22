import { useAuth } from "@/src/hooks/useAuth";
import AuthenticatedLayout from "@/src/layouts/AutenticatedLayout";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProfilePage() {
  const [isLoading, setLoading] = useState(false);
  const { Logout } = useAuth();
  const router = useRouter()

  const logoutHandler = async () => {
    setLoading(true);
    if(await Logout()){
      router.replace("/login")
    }
    setLoading(false);
  };

  return (
    <AuthenticatedLayout>
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
    </AuthenticatedLayout>
  );
}

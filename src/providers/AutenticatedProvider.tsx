import { ReactNode, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import BaseLayout from "../layouts/BaseLayout";

const LoadingScreen = () => {
  return (
    <BaseLayout className="flex h-screen flex-col items-center justify-center text-center">
      <div className="animate-pulse">
        {/* Menggunakan ikon gembok dari Navbar untuk konsistensi */}
        <svg
          className="mx-auto h-12 w-12 text-cyan-400"
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
        <h1 className="mt-4 text-xl font-bold text-white">
          Memverifikasi Sesi...
        </h1>
        <p className="text-gray-400">Harap tunggu sebentar.</p>
      </div>
    </BaseLayout>
  );
};

const AutenticatedProvider = ({ children }: { children: ReactNode }) => {
  const { isAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Hanya redirect jika statusnya sudah pasti `false`.
    if (isAuth === false) {
      router.push("/login");
    }
  }, [isAuth, router]); // <-- Menambahkan router ke dependency array

  // 1. KONDISI LOADING: Saat isAuth masih undefined, proses verifikasi sedang berjalan.
  if (isAuth === undefined) {
    return <LoadingScreen />;
  }

  // 2. KONDISI BERHASIL: Saat isAuth true, tampilkan konten halaman.
  if (isAuth === true) {
    return <>{children}</>;
  }

  // 3. KONDISI GAGAL: Saat isAuth false, jangan tampilkan apa-apa.
  //    useEffect di atas akan menangani redirect. Ini mencegah konten berkedip.
  return null;
};

export default AutenticatedProvider;

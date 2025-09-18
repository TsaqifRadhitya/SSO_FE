import RootLayout from "@/src/layouts/BaseLayout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import NotificationProvider from '@/src/providers/NotificationProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RootLayout>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </RootLayout>
  );
}

import Head from "next/head";
import { useApplication } from "@/src/hooks/useApplication";
import BaseLayout from "@/src/layouts/BaseLayout";
import AutenticatedProvider from "@/src/providers/AutenticatedProvider";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ApplicationDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const applicationId = typeof id === "string" ? id : undefined;
  const { application, isLoading } = useApplication(applicationId);
  useEffect(() => {
    if (!application && !isLoading) {
      router.replace("/404");
    }
  }, [isLoading, application]);
  return (
    <AutenticatedProvider>
      <BaseLayout>
        <main className="min-h-screen">
          <Head>
            <title>SSO - {application?.application_name} Application</title>
          </Head>
        </main>
        ;
      </BaseLayout>
    </AutenticatedProvider>
  );
}

import Head from "next/head";
import { useApplication } from "@/src/hooks/useApplication";
import AutenticatedProvider from "@/src/layouts/AutenticatedLayout";
import { useRouter } from "next/router";

export default function ApplicationDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const applicationId = typeof id === "string" ? id : undefined;
  const { application } = useApplication(applicationId);

  return (
    <AutenticatedProvider>
      <main className="min-h-screen">
        <Head>
          <title>SSO - {application?.application_name} Application</title>
        </Head>
      </main>
      ;
    </AutenticatedProvider>
  );
}

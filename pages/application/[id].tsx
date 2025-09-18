import { GetServerSideProps } from "next";
import { ApplicationType } from "../../src/types/Application";
import { authenticatedServerFetch } from "@/src/utils/fetch";
import { Response } from "@/src/types/getServerSidePropsReturn";
import Head from "next/head";
import { useApplication } from "@/src/hooks/useApplication";
import BaseLayout from "@/src/layouts/BaseLayout";

export const getServerSideProps: GetServerSideProps<
  Response<{ data: ApplicationType }>
> = async (ctx) => {
  const { id } = ctx.query;
  try {
    const data = await authenticatedServerFetch<ApplicationType>(
      ctx,
      `/api/application/${id}`,
      "GET"
    );
    return { props: data };
  } catch {
    return {
      notFound: true,
    };
  }
};

export default function ApplicationDetailPage({
  data,
}: Response<{ data: ApplicationType }>) {
  const {
    Delete,
    CreateCallback,
    UpdateCallback,
    Update,
    DeleteCallback,
    isLoading,
    application,
  } = useApplication(data);
  console.log(application);
  return (
    <BaseLayout>
      <main className="min-h-screen">
        <Head>
          <title>SSO - {data.application_name} Application</title>
        </Head>
      </main>
      ;
    </BaseLayout>
  );
}

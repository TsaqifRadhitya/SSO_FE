import { useApplication } from "@/src/hooks/useApplication";
import BaseLayout from "@/src/layouts/BaseLayout";
import AutenticatedProvider from "@/src/providers/AutenticatedProvider";
import { ApplicationType } from "@/src/types/Application";
import { Response } from "@/src/types/getServerSidePropsReturn";
import { formatDate } from "@/src/utils/DateFormaterUtils";
import { authenticatedServerFetch } from "@/src/utils/fetch";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useState } from "react";

export default function ApplicationPage() {
  const [searchTerm, setSearchTerm] = useState<string>();
  const { applications } = useApplication();
  const filteredData = useMemo(() => {
    if (!searchTerm) return applications;
    return applications?.filter((app) =>
      app.application_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, applications]);

  const router = useRouter();

  const handleActionClick = (
    action: "Detail" | "Delete",
    app: ApplicationType
  ) => {
    if (action === "Detail") {
      router.push(`/application/${app.ID}`);
    }
  };

  return (
    <AutenticatedProvider>
      <BaseLayout className="text-white">
        <Head>
          <title>SSO - Application Console</title>
        </Head>

        <div className="w-full mx-auto">
          <header className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Application Console
              </h1>
              <p className="text-gray-400 mt-2">
                Manage all applications connected to your SSO.
              </p>
            </div>
            <Link
              href="/application/create"
              className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
            >
              + Create New Application
            </Link>
          </header>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by application name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 max-w-xs text-white rounded-lg px-4 py-2 placeholder:text-gray-400 border border-transparent focus:border-cyan-500 focus:ring-cyan-500 transition"
            />
          </div>

          <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="p-4 font-semibold text-sm">ID</th>
                    <th className="p-4 font-semibold text-sm">
                      Application Name
                    </th>
                    <th className="p-4 font-semibold text-sm">Status</th>
                    <th className="p-4 font-semibold text-sm">Created At</th>
                    <th className="p-4 font-semibold text-sm">Updated At</th>
                    <th className="p-4 font-semibold text-sm text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredData?.map((app) => (
                    <tr
                      key={app.ID}
                      className="hover:bg-gray-700/40 transition-colors duration-200"
                    >
                      <td className="p-4 text-gray-400">{app.ID}</td>
                      <td className="p-4 font-medium text-white">
                        {app.application_name}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            app.DeletedAt
                              ? "bg-red-500/20 text-red-300"
                              : "bg-green-500/20 text-green-300"
                          }`}
                        >
                          {app.DeletedAt ? "Deleted" : "Active"}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">
                        {formatDate(new Date(app.CreatedAt))}
                      </td>
                      <td className="p-4 text-gray-400">
                        {formatDate(new Date(app.UpdatedAt))}
                      </td>
                      <td className="p-4 text-center flex flex-col items-center">
                        <button
                          onClick={() => handleActionClick("Detail", app)}
                          className="text-blue-400 w-20 text-center cursor-pointer hover:text-blue-300 font-medium"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleActionClick("Delete", app)}
                          className="text-red-400 w-20 text-center cursor-pointer hover:text-red-300 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </BaseLayout>
    </AutenticatedProvider>
  );
}

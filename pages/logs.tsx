import BaseLayout from "@/src/layouts/BaseLayout";
import AutenticatedProvider from "@/src/providers/AutenticatedProvider";

export default function LogsPage() {
  return (
    <AutenticatedProvider>
      <BaseLayout className="flex flex-col justify-center items-center">
        <h1>Logs Page</h1>
      </BaseLayout>
    </AutenticatedProvider>
  );
}

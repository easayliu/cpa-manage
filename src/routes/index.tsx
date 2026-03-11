import { createBrowserRouter, useRouteError } from "react-router";
import { AdminLayout } from "@/layouts/admin-layout";
import { DashboardPage } from "@/pages/dashboard";
import { SettingsPage } from "@/pages/settings";
import { LogsPage } from "@/pages/logs";
import { ConfigPage } from "@/pages/config";
import { AmpcodePage } from "@/pages/ampcode";

function ErrorPage() {
  const error = useRouteError();
  return (
    <div className="p-8 text-red-600">
      <h1 className="text-lg font-bold">Error</h1>
      <pre className="mt-2 text-sm whitespace-pre-wrap">
        {error instanceof Error
          ? `${error.message}\n\n${error.stack}`
          : JSON.stringify(error, null, 2)}
      </pre>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
        handle: { title: "Dashboard" },
      },
      {
        path: "config",
        element: <ConfigPage />,
        handle: { title: "Config" },
      },
      {
        path: "ampcode",
        element: <AmpcodePage />,
        handle: { title: "AmpCode" },
      },
      {
        path: "logs",
        element: <LogsPage />,
        handle: { title: "Logs" },
      },
      {
        path: "settings",
        element: <SettingsPage />,
        handle: { title: "Settings" },
      },
    ],
  },
]);

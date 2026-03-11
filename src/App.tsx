import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { queryClient } from "@/lib/query-client";
import { router } from "@/routes";
import { AuthGuard } from "@/components/auth-guard";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard>
        <RouterProvider router={router} />
      </AuthGuard>
    </QueryClientProvider>
  );
}

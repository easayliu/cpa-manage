import { useState } from "react";
import { Outlet, useMatches } from "react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { useSidebarStore } from "@/stores/sidebar-store";
import { cn } from "@/lib/utils";

export function AdminLayout() {
  const { collapsed } = useSidebarStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Dynamic route title from handle
  const matches = useMatches();
  const currentHandle = matches[matches.length - 1]?.handle as
    | { title?: string }
    | undefined;
  const title = currentHandle?.title ?? "";

  return (
    <div className="flex h-dvh bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden shrink-0 md:flex md:flex-col transition-all duration-200",
          collapsed ? "w-14" : "w-56",
        )}
      >
        <Sidebar />
      </aside>

      {/* Mobile sidebar (Radix Dialog) */}
      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30 md:hidden" />
          <Dialog.Content
            className="fixed inset-y-0 left-0 z-50 w-56 bg-background md:hidden"
            aria-label="Sidebar navigation"
          >
            <Dialog.Title className="sr-only">Navigation</Dialog.Title>
            <Sidebar />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          title={title}
          onMenuClick={() => setMobileOpen((v) => !v)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

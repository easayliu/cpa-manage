import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, Settings, ChevronLeft, FileText, FileCode, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar-store";

const navItems = [
  { path: "/", icon: LayoutDashboard, labelKey: "nav.dashboard" },
  { path: "/config", icon: FileCode, labelKey: "nav.config" },
  { path: "/ampcode", icon: Cpu, labelKey: "nav.ampcode" },
  { path: "/logs", icon: FileText, labelKey: "nav.logs" },
  { path: "/settings", icon: Settings, labelKey: "nav.settings" },
] as const;

export function Sidebar() {
  const { t } = useTranslation();
  const { collapsed, toggle } = useSidebarStore();

  return (
    <div className="h-full flex flex-col bg-background">
      <nav className="flex-1 flex flex-col gap-1 pt-3 px-2">
        {navItems.map(({ path, icon: Icon, labelKey }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 min-h-[36px] px-2 py-1.5 rounded-lg text-[13px] transition-colors",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className="size-[18px] shrink-0"
                  strokeWidth={isActive ? 2 : 1.75}
                />
                {!collapsed && <span>{t(labelKey)}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border/60 px-2 py-2">
        <button
          type="button"
          onClick={toggle}
          className={cn(
            "flex items-center gap-2 w-full min-h-[36px] px-2 py-1.5 rounded-lg text-[13px] text-muted-foreground transition-colors hover:text-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          <ChevronLeft
            className={cn(
              "size-[18px] shrink-0 transition-transform",
              collapsed && "rotate-180",
            )}
            strokeWidth={1.75}
          />
          {!collapsed && <span>{t("sidebar.collapse")}</span>}
        </button>
      </div>
    </div>
  );
}

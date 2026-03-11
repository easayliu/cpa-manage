import { Languages, Menu, Monitor, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/theme-store";

const toolbarBtnClass =
  "inline-flex items-center justify-center size-8 rounded-md text-muted-foreground/60 hover:bg-muted/60 hover:text-foreground transition-colors cursor-pointer";

// Theme icon mapping
const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

// Theme cycle order
const themeCycle = { light: "dark", dark: "system", system: "light" } as const;

export function Topbar({
  title,
  onMenuClick,
}: {
  title: string;
  onMenuClick?: () => void;
}) {
  const { theme, setTheme } = useThemeStore();
  const { t, i18n } = useTranslation();

  // Translate route title using nav.{key} pattern
  const translatedTitle = title ? t(`nav.${title.toLowerCase()}`) : "";

  const ThemeIcon = themeIcons[theme];

  function handleThemeToggle() {
    setTheme(themeCycle[theme]);
  }

  function handleLanguageToggle() {
    i18n.changeLanguage(i18n.language === "zh" ? "en" : "zh");
  }

  return (
    <header
      className={cn(
        "h-12 shrink-0 flex items-center justify-between px-4",
        "border-b border-border/60 md:border-b-0",
      )}
    >
      {/* Left side */}
      <div className="flex items-center">
        {/* Mobile menu button */}
        <button
          type="button"
          className={cn(toolbarBtnClass, "md:hidden mr-2")}
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="size-[18px]" />
        </button>

        {/* Mobile title */}
        <span className="md:hidden text-[13px] font-medium text-foreground">{translatedTitle}</span>

        {/* Desktop breadcrumb */}
        <nav className="hidden md:flex items-center text-[13px]">
          <span className="text-muted-foreground">CPA Manage</span>
          <span className="text-muted-foreground/30 mx-1.5">/</span>
          <span className="text-foreground font-medium">{translatedTitle}</span>
        </nav>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          className={toolbarBtnClass}
          onClick={handleLanguageToggle}
          aria-label="Toggle language"
        >
          <Languages className="size-[18px]" />
        </button>

        <button
          type="button"
          className={toolbarBtnClass}
          onClick={handleThemeToggle}
          aria-label="Toggle theme"
        >
          <ThemeIcon className="size-[18px]" />
        </button>
      </div>
    </header>
  );
}

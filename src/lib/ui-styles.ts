import { cn } from "./utils";

// Input styles
export const inputStyles = cn(
  "h-8 w-full rounded-lg bg-transparent px-3 text-[13px]",
  "ring-1 ring-border/60 placeholder:text-muted-foreground/40",
  "focus:outline-none focus:ring-foreground/20",
  "transition-shadow duration-150",
);

// Label styles
export const labelStyles = cn(
  "text-[13px] font-medium text-muted-foreground",
);

// Button variants
type ButtonVariant = "default" | "primary" | "destructive" | "ghost" | "outline";
type ButtonSize = "sm" | "default" | "icon";

const buttonBase = [
  "inline-flex items-center justify-center gap-1.5",
  "rounded-lg font-medium transition-colors duration-150",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
  "disabled:pointer-events-none disabled:opacity-50",
  "cursor-pointer select-none",
];

const buttonVariants: Record<ButtonVariant, string> = {
  default: "bg-muted/60 text-foreground hover:bg-muted",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-primary-foreground hover:bg-destructive/90",
  ghost: "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
  outline: "ring-1 ring-border/60 text-muted-foreground hover:bg-muted/60 hover:text-foreground",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-7 px-2 text-xs",
  default: "h-8 px-3 text-[13px]",
  icon: "size-8 text-[13px]",
};

export function getButtonClass(
  variant: ButtonVariant = "default",
  size: ButtonSize = "default",
) {
  return cn(...buttonBase, buttonVariants[variant], buttonSizes[size]);
}

// Card styles
export const cardStyles = cn(
  "rounded-lg bg-card p-4",
  "ring-1 ring-border/60",
);

// Badge variants
export const badgeVariants = {
  default: cn(
    "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium",
    "ring-1 ring-border/60 text-muted-foreground",
  ),
  success: cn(
    "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium",
    "ring-1 ring-success/30 bg-success/5 text-success",
  ),
  warning: cn(
    "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium",
    "ring-1 ring-warning/30 bg-warning/5 text-warning",
  ),
  destructive: cn(
    "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium",
    "ring-1 ring-destructive/30 bg-destructive/5 text-destructive",
  ),
  info: cn(
    "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium",
    "ring-1 ring-info/30 bg-info/5 text-info",
  ),
} as const;

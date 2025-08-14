import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children?: React.ReactNode;
}

/** Coerce non-renderable children (plain objects/arrays) into a safe string. */
function normalizeChildren(children: React.ReactNode): React.ReactNode {
  if (children == null) return null;
  if (typeof children === "string" || typeof children === "number") return children;
  if (React.isValidElement(children)) return children;
  if (Array.isArray(children)) {
    return children
      .map((c, i) =>
        typeof c === "string" || typeof c === "number" || React.isValidElement(c)
          ? c
          : null
      )
      .filter(Boolean);
  }
  // Plain object (e.g., { primaryColor, ... }) — show a compact JSON string instead of crashing.
  try {
    return JSON.stringify(children);
  } catch {
    return "";
  }
}

function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {normalizeChildren(children)}
    </div>
  );
}

export { Badge, badgeVariants };
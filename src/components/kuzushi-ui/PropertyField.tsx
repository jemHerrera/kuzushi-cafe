import { CircleHelp, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type PropertyFieldProps = {
  icon?: LucideIcon;
  label: string;
  description?: string;
  descriptionLabel?: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
};

export function PropertyField({
  icon: Icon,
  label,
  description,
  descriptionLabel,
  htmlFor,
  children,
  className,
}: PropertyFieldProps) {
  return (
    <div
      data-slot="property-field"
      className={cn(
        "group grid min-h-10 grid-cols-[1.25rem_5rem_minmax(0,1fr)] items-start gap-2 rounded-md px-1.5 py-1.5 transition-colors sm:grid-cols-[1.25rem_8rem_minmax(0,1fr)] sm:px-2",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex h-10 items-center justify-center text-zinc-500"
      >
        {Icon ? <Icon className="size-4" /> : null}
      </span>
      <div className="flex min-h-10 min-w-0 items-center gap-1">
        {htmlFor ? (
          <Label
            htmlFor={htmlFor}
            className="min-w-0 text-sm font-normal leading-normal text-zinc-600"
          >
            {label}
          </Label>
        ) : (
          <span className="min-w-0 text-sm font-normal leading-normal text-zinc-600">
            {label}
          </span>
        )}
        {description ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  aria-label={descriptionLabel ?? `About ${label}`}
                  className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-medium text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  type="button"
                >
                  <CircleHelp className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{description}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

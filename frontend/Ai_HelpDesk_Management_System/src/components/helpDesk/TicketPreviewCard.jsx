import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Network, CircleDot, CircleCheck, CircleSlash } from "lucide-react";

/**
 * Status → visual language. Kept as a lookup so new statuses are a one-line
 * addition rather than a new conditional branch scattered through the JSX.
 */
const STATUS_CONFIG = {
  Open: {
    icon: CircleDot,
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
  },
  "In Progress": {
    icon: CircleDot,
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20",
  },
  Resolved: {
    icon: CircleCheck,
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
  },
  Closed: {
    icon: CircleSlash,
    dot: "bg-neutral-400",
    badge: "bg-neutral-100 text-neutral-600 ring-1 ring-inset ring-neutral-500/15 dark:bg-neutral-500/10 dark:text-neutral-400 dark:ring-neutral-500/20",
  },
};

/**
 * TicketPreviewCard
 * A tool-result widget rendered by the assistant when it looks up, creates,
 * or updates a helpdesk ticket. Designed to sit inline in the message list
 * without feeling like a foreign "component" — same radius and border
 * language as the rest of the chat surface, just with a bit more structure.
 *
 * Props:
 *  - id: string        e.g. "#TK-102"
 *  - status: string     one of STATUS_CONFIG keys (falls back gracefully)
 *  - category: string   e.g. "Network"
 *  - summary: string    short description of the issue
 */
export function TicketPreviewCard({
  id = "#TK-000",
  status = "Open",
  category = "General",
  summary = "No summary provided.",
}) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.Open;
  const StatusIcon = config.icon;

  return (
    <Card
      className={cn(
        "w-full max-w-md gap-0 overflow-hidden rounded-2xl border-border/60 bg-card py-0 shadow-none",
        "transition-colors hover:border-border",
      )}
    >
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 border-b border-border/60 bg-muted/40 px-5 py-3.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", config.dot)} aria-hidden="true" />
          <CardTitle className="truncate text-[13px] font-medium tracking-tight text-foreground/90">
            {id}
          </CardTitle>
        </div>

        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium leading-none",
            config.badge,
          )}
        >
          <StatusIcon className="h-3 w-3" strokeWidth={2.25} />
          {status}
        </span>
      </CardHeader>

      <CardContent className="space-y-3 px-5 py-4">
        <p className="text-[14px] leading-relaxed text-foreground/80">{summary}</p>

        <div className="flex items-center gap-1.5 pt-0.5 text-[12px] text-muted-foreground">
          <Network className="h-3.5 w-3.5" strokeWidth={2} />
          <span>{category}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default TicketPreviewCard;

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Moon, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const RECENT_CONVERSATIONS = [
  { id: "c1", title: "VPN dropping on office wifi", timestamp: "2m ago" },
  { id: "c2", title: "Shared drive permissions request", timestamp: "1h ago" },
  { id: "c3", title: "Laptop won't wake from sleep", timestamp: "Yesterday" },
  { id: "c4", title: "Printer offline on 3rd floor", timestamp: "Yesterday" },
  { id: "c5", title: "Password reset — SSO portal", timestamp: "2 days ago" },
  { id: "c6", title: "Onboarding access for new hire", timestamp: "3 days ago" },
  { id: "c7", title: "Monitor flickering after update", timestamp: "1 week ago" },
];

function ConversationItem({ conversation, isActive, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      className={cn(
        "group flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left",
        "transition-colors duration-150",
        isActive
          ? "bg-foreground/[0.06] text-foreground"
          : "text-foreground/70 hover:bg-foreground/[0.04] hover:text-foreground",
      )}
    >
      <MessageSquare
        className={cn(
          "h-4 w-4 shrink-0",
          isActive
            ? "text-foreground/80"
            : "text-muted-foreground group-hover:text-foreground/70",
        )}
        strokeWidth={2}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] leading-tight">
          {conversation.title}
        </p>
      </div>
      <span className="shrink-0 text-[11px] text-muted-foreground/70 opacity-0 transition-opacity group-hover:opacity-100">
        {conversation.timestamp}
      </span>
    </button>
  );
}

export default function EnterpriseLayout({ children }) {
  const [activeId, setActiveId] = useState("c1");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans">
      {/* Sidebar */}
      <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border/60 bg-muted/30">
        {/* New chat action */}
        <div className="px-3 pb-2 pt-4">
          <Button
            variant="outline"
            className={cn(
              "h-9 w-full justify-start gap-2 rounded-xl border-border/70 bg-background",
              "text-[13.5px] font-medium text-foreground/85 shadow-none",
              "hover:bg-foreground/[0.03] hover:text-foreground",
            )}
          >
            <Plus className="h-4 w-4" strokeWidth={2.25} />
            New Ticket
          </Button>
        </div>

        {/* Recent conversations */}
        <div className="flex min-h-0 flex-1 flex-col">
          <p className="px-5 pb-1.5 pt-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/60">
            Recent
          </p>
          <ScrollArea className="min-h-0 flex-1 px-3">
            <div className="flex flex-col gap-0.5 pb-3">
              {RECENT_CONVERSATIONS.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={conversation.id === activeId}
                  onSelect={setActiveId}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Footer identity area */}
        <div className="border-t border-border/60 p-3 space-y-1">
          <button
            type="button"
            className={cn(
              "flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left",
              "transition-colors duration-150 hover:bg-foreground/[0.04]",
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-[12.5px] font-medium text-foreground/80">
              NC
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium leading-tight text-foreground/90">
                Neal Chakravarty
              </p>
              <p className="truncate text-[11.5px] leading-tight text-muted-foreground">
                IT Support · Tier 2
              </p>
            </div>
            <ChevronsUpDown
              className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70"
              strokeWidth={2}
            />
          </button>

          {/* Single clean Theme Toggle using shadcn Button with ghost variant */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => document.documentElement.classList.toggle("dark")}
            className={cn(
              "flex w-full items-center justify-start gap-2.5 rounded-xl px-2 py-2 h-9 text-left",
              "text-[13px] font-normal text-muted-foreground transition-colors duration-150",
              "hover:bg-foreground/[0.04] hover:text-foreground",
            )}
          >
            <Moon className="h-4 w-4 shrink-0" strokeWidth={2} />
            Toggle Theme
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-background">
        {children}
      </main>
    </div>
  );
}
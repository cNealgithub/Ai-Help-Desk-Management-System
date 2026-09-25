import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { TicketPreviewCard } from "@/components/helpdesk/TicketPreviewCard";
import { streamChat } from "@/lib/api";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

function MessageBubble({ message, isLoading, isLast }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end px-6 py-2 animate-slide-up-fade">
        <div className="max-w-[75%] rounded-2xl bg-muted px-4 py-2.5 text-[15px] leading-relaxed text-foreground/90 shadow-sm">
          {message.content}
        </div>
      </div>
    );
  }

  const isWaitingForStream = isLast && isLoading && !message.content;

  return (
    <div className="flex flex-col gap-3 px-6 py-3 animate-slide-up-fade">
      {isWaitingForStream ? (
        <div className="flex items-center gap-2 text-primary mt-1">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-[13px] font-medium animate-pulse">
            Analyzing request...
          </span>
        </div>
      ) : (
        <div className="max-w-[85%] text-[15px] leading-relaxed text-foreground/90 overflow-hidden">
          <ReactMarkdown
            components={{
              // Claude-style paragraph spacing
              p: ({ node, ...props }) => (
                <p className="mb-4 last:mb-0" {...props} />
              ),
              // Bold text highlight (Makes **Status** stand out)
              strong: ({ node, ...props }) => (
                <strong className="font-semibold text-foreground" {...props} />
              ),
              // Bulleted lists
              ul: ({ node, ...props }) => (
                <ul
                  className="mb-4 list-outside list-disc space-y-1.5 pl-4"
                  {...props}
                />
              ),
              // Numbered lists
              ol: ({ node, ...props }) => (
                <ol
                  className="mb-4 list-outside list-decimal space-y-1.5 pl-4"
                  {...props}
                />
              ),
              // List items
              li: ({ node, ...props }) => <li className="pl-1" {...props} />,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      )}
      {message.ticket && <TicketPreviewCard {...message.ticket} />}
    </div>
  );
}
export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const [chatId, setChatId] = useState("");

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const parseMessageContext = (rawText) => {
    const ticketRegex = /<<TICKET_DATA:\s*(\{.*?\})\s*>>/;
    const match = rawText.match(ticketRegex);

    let content = rawText;
    let ticket = null;

    if (match && match[1]) {
      try {
        ticket = JSON.parse(match[1]);
        content = rawText.replace(ticketRegex, "").trim();
      } catch (e) {
        console.error("Failed to parse tool payload", e);
      }
    }
    return { content, ticket };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!chatId.trim()) {
      alert(
        "Please enter a Conversation ID in the top right to start chatting.",
      );
      return;
    }

    const userQuery = input.trim();
    setInput("");
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: userQuery }]);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", ticket: null },
    ]);

    try {
      await streamChat(
        userQuery,
        chatId.trim(),
        (chunk) => {
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            // FIX: Create a completely new object for the last message to prevent double-mutations
            newMessages[lastIndex] = {
              ...newMessages[lastIndex],
              content: newMessages[lastIndex].content + chunk,
            };
            return newMessages;
          });
        },
        () => {
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            const finalAssistantMessage = newMessages[lastIndex].content;

            const { content, ticket } = parseMessageContext(
              finalAssistantMessage,
            );
            newMessages[lastIndex].content = content;
            newMessages[lastIndex].ticket = ticket;

            return newMessages;
          });
          setIsLoading(false);
        },
        (error) => {
          console.error("Streaming error:", error);
          setIsLoading(false);
        },
      );
    } catch (error) {
      console.error("Failed to start stream:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col font-serif">
      {/* Top Bar for Session Management - Now properly aligned with max-w-4xl */}
      <div className="border-b border-border/60 bg-background/95 px-6 py-3 backdrop-blur z-10">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
          <div className="text-[14px] font-medium text-foreground/80">
            Support Interface
          </div>
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <Input
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="Enter Conversation ID..."
              className="h-8 w-48 rounded-lg bg-muted/30 px-3 text-[13px] shadow-none focus-visible:ring-1 focus-visible:ring-foreground/20 border-transparent transition-all"
            />
          </div>
        </div>
      </div>
      <ScrollArea ref={scrollRef} className="min-h-0 flex-1">
        <div className="mx-auto flex w-full max-w-4xl flex-col py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-24 text-muted-foreground animate-slide-up-fade">
              <p className="text-lg">How can I help you today?</p>
            </div>
          ) : (
            messages.map((message, i) => (
              <MessageBubble
                key={i}
                message={message}
                isLoading={isLoading}
                isLast={i === messages.length - 1}
              />
            ))
          )}
        </div>
      </ScrollArea>
      <div className="border-t border-border/60 bg-background/95 px-6 pb-6 pt-4 backdrop-blur">
        <form
          onSubmit={handleSubmit}
          className={cn(
            "relative mx-auto flex w-full max-w-4xl items-center gap-2 rounded-2xl",
            "bg-card px-2 py-2 transition-all duration-500 ease-out",
            "border border-border/60 hover:border-border",
            /* The Magic Glow */
            "focus-within:border-primary/50 focus-within:shadow-[0_0_20px_rgba(var(--color-primary),0.15)]",
            "focus-within:bg-background/50",
            isLoading && "opacity-70",
          )}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Describe your issue, or ask about an existing ticket…"
            className={cn(
              "h-10 flex-1 rounded-xl border-none bg-transparent px-3 text-[15px]",
              "shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-muted-foreground/70",
            )}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className={cn(
              "h-9 w-9 shrink-0 rounded-xl transition-all active:scale-95",
              /* Shimmer effect when loading */
              isLoading
                ? "bg-[linear-gradient(110deg,var(--color-primary),45%,oklch(0.9_0.1_265),55%,var(--color-primary))] bg-[length:200%_100%] animate-shimmer"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2.25} />
          </Button>
        </form>
      </div>
    </div>
  );
}

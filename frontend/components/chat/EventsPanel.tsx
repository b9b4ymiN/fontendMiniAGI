import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Event = {
  step: number;
  agent: string;
  action: string;
  tool?: string | null;
  target_agent?: string | null;
  thought: string;
};

interface EventsPanelProps {
  events: Event[];
}

export function EventsPanel({ events }: EventsPanelProps) {
  return (
    <Card className="h-full flex flex-col rounded-none border-0 border-l">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-sm font-semibold">Agent Timeline</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Internal orchestration steps
        </p>
      </div>

      {/* Events list */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {events.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No events yet.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Send a message to see the agent workflow.
              </p>
            </div>
          ) : (
            events.map((event) => (
              <EventItem key={event.step} event={event} />
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}

function EventItem({ event }: { event: Event }) {
  return (
    <div className="space-y-2">
      {/* Step header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">
          Step {event.step} • {event.agent}
        </span>
        <ActionBadge action={event.action} />
      </div>

      {/* Event details */}
      <div className="text-xs space-y-1 text-muted-foreground">
        {event.tool && (
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground">Tool:</span>
            <code className="px-1 py-0.5 bg-muted rounded text-[10px]">
              {event.tool}
            </code>
          </div>
        )}

        {event.target_agent && (
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground">Delegated to:</span>
            <span className="text-foreground">{event.target_agent}</span>
          </div>
        )}

        <div className="pt-1">
          <span className="font-medium text-foreground">Thought:</span>
          <p className="mt-0.5 text-[11px] leading-relaxed">
            {event.thought}
          </p>
        </div>
      </div>

      <Separator className="mt-3" />
    </div>
  );
}

function ActionBadge({ action }: { action: string }) {
  const variants: Record<string, "default" | "secondary" | "destructive"> = {
    use_tool: "default",
    delegate: "secondary",
    final: "destructive",
  };

  return (
    <Badge variant={variants[action] || "default"} className="text-[10px]">
      {action}
    </Badge>
  );
}

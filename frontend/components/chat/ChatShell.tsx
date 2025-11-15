"use client";

import { Thread, useThreadMessages } from "@assistant-ui/react";
import { EventsPanel } from "./EventsPanel";

type Event = {
  step: number;
  agent: string;
  action: string;
  tool?: string | null;
  target_agent?: string | null;
  thought: string;
};

export function ChatShell() {
  const messages = useThreadMessages();

  // Get events from the last assistant message
  const lastAssistantMessage = messages
    .filter((m) => m.role === "assistant")
    .at(-1);

  const events = (lastAssistantMessage?.metadata?.events as Event[]) ?? [];

  return (
    <div className="flex h-screen w-full">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col border-r">
        <header className="border-b px-4 py-3">
          <h1 className="text-lg font-semibold">Mini-AGI Chat</h1>
          <p className="text-sm text-muted-foreground">
            Powered by Orchestrator + Agents + Tools
          </p>
        </header>
        <div className="flex-1 overflow-hidden">
          <Thread />
        </div>
      </div>

      {/* Events panel - hide on mobile, show on md+ */}
      <div className="hidden md:flex md:w-80 lg:w-96 flex-col">
        <EventsPanel events={events} />
      </div>
    </div>
  );
}

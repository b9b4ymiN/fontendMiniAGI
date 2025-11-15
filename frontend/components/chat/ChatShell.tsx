"use client";

import { motion } from "framer-motion";
import { Thread, useThreadMessages } from "@assistant-ui/react";
import { EventsPanel } from "./EventsPanel";
import { pageTransition, slideInLeft, slideInRight, headerSlideDown } from "@/lib/animations";

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
    <motion.div
      className="flex h-screen w-full"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
    >
      {/* Main chat area */}
      <motion.div
        className="flex-1 flex flex-col border-r"
        variants={slideInLeft}
        initial="hidden"
        animate="visible"
      >
        {/* Header with animation */}
        <motion.header
          className="border-b px-4 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          variants={headerSlideDown}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-lg font-semibold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            Mini-AGI Chat
          </motion.h1>
          <motion.p
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Powered by Orchestrator + Agents + Tools
          </motion.p>
        </motion.header>

        {/* Chat thread area */}
        <motion.div
          className="flex-1 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Thread />
        </motion.div>
      </motion.div>

      {/* Events panel - hide on mobile, show on md+ */}
      <motion.div
        className="hidden md:flex md:w-80 lg:w-96 flex-col"
        variants={slideInRight}
        initial="hidden"
        animate="visible"
      >
        <EventsPanel events={events} />
      </motion.div>
    </motion.div>
  );
}

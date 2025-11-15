"use client";

import { motion } from "framer-motion";
import { Thread, useThreadMessages } from "@assistant-ui/react";
import { EventsPanel } from "./EventsPanel";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sparkles } from "lucide-react";
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
      className="flex h-screen w-full overflow-hidden bg-gradient-bg"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
    >
      {/* Main chat area */}
      <motion.div
        className="flex-1 flex flex-col border-r border-border/50"
        variants={slideInLeft}
        initial="hidden"
        animate="visible"
      >
        {/* Professional Header with Glassmorphism */}
        <motion.header
          className="relative border-b border-border/50 px-6 py-4 glass"
          variants={headerSlideDown}
          initial="hidden"
          animate="visible"
        >
          {/* Gradient accent line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 gradient-primary" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Animated icon */}
              <motion.div
                className="flex items-center justify-center w-10 h-10 rounded-lg gradient-primary shadow-glow"
                whileHover={{ scale: 1.05, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </motion.div>

              {/* Title and subtitle */}
              <div>
                <motion.h1
                  className="text-xl font-bold text-gradient"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  Mini-AGI Chat
                </motion.h1>
                <motion.p
                  className="text-xs text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  AI Orchestration Platform
                </motion.p>
              </div>
            </div>

            {/* Theme Toggle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <ThemeToggle />
            </motion.div>
          </div>

          {/* Feature badges */}
          <motion.div
            className="flex items-center gap-2 mt-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            {["Orchestrator", "Agents", "Tools"].map((feature, index) => (
              <motion.span
                key={feature}
                className="px-2 py-1 text-[10px] font-medium rounded-md bg-primary/10 text-primary border border-primary/20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {feature}
              </motion.span>
            ))}
          </motion.div>
        </motion.header>

        {/* Chat thread area with enhanced background */}
        <motion.div
          className="flex-1 overflow-hidden relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background/20 pointer-events-none" />
          <Thread />
        </motion.div>
      </motion.div>

      {/* Events panel - hide on mobile, show on md+ */}
      <motion.div
        className="hidden md:flex md:w-80 lg:w-96 flex-col border-l border-border/50"
        variants={slideInRight}
        initial="hidden"
        animate="visible"
      >
        <EventsPanel events={events} />
      </motion.div>
    </motion.div>
  );
}

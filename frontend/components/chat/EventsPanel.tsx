"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  eventCard,
  staggerContainer,
  fadeIn,
  badgePop,
  separatorGrow,
  headerSlideDown,
  hoverScale
} from "@/lib/animations";

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
    <Card className="h-full flex flex-col rounded-none border-0 border-l overflow-hidden">
      {/* Header with slide down animation */}
      <motion.div
        className="p-4 border-b"
        variants={headerSlideDown}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-sm font-semibold">Agent Timeline</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Internal orchestration steps
        </p>
      </motion.div>

      {/* Events list */}
      <ScrollArea className="flex-1">
        <AnimatePresence mode="popLayout">
          {events.length === 0 ? (
            <motion.div
              key="empty-state"
              className="text-center py-8 px-4"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <p className="text-sm text-muted-foreground">
                No events yet.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Send a message to see the agent workflow.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="events-list"
              className="p-4 space-y-3"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {events.map((event, index) => (
                <EventItem key={`${event.step}-${index}`} event={event} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </Card>
  );
}

function EventItem({ event, index }: { event: Event; index: number }) {
  return (
    <motion.div
      className="space-y-2"
      variants={eventCard}
      custom={index}
      layout
    >
      {/* Step header */}
      <div className="flex items-center justify-between">
        <motion.span
          className="text-xs font-medium"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          Step {event.step} • {event.agent}
        </motion.span>
        <ActionBadge action={event.action} index={index} />
      </div>

      {/* Event details */}
      <motion.div
        className="text-xs space-y-1 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.05 + 0.1 }}
      >
        {event.tool && (
          <motion.div
            className="flex items-center gap-1"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 + 0.15 }}
          >
            <span className="font-medium text-foreground">Tool:</span>
            <motion.code
              className="px-1 py-0.5 bg-muted rounded text-[10px]"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {event.tool}
            </motion.code>
          </motion.div>
        )}

        {event.target_agent && (
          <motion.div
            className="flex items-center gap-1"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 + 0.2 }}
          >
            <span className="font-medium text-foreground">Delegated to:</span>
            <motion.span
              className="text-foreground"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {event.target_agent}
            </motion.span>
          </motion.div>
        )}

        <motion.div
          className="pt-1"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 + 0.25 }}
        >
          <span className="font-medium text-foreground">Thought:</span>
          <p className="mt-0.5 text-[11px] leading-relaxed">
            {event.thought}
          </p>
        </motion.div>
      </motion.div>

      <motion.div variants={separatorGrow}>
        <Separator className="mt-3" />
      </motion.div>
    </motion.div>
  );
}

function ActionBadge({ action, index }: { action: string; index: number }) {
  const variants: Record<string, "default" | "secondary" | "destructive"> = {
    use_tool: "default",
    delegate: "secondary",
    final: "destructive",
  };

  return (
    <motion.div
      variants={badgePop}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.05 + 0.1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Badge variant={variants[action] || "default"} className="text-[10px]">
        {action}
      </Badge>
    </motion.div>
  );
}

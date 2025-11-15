"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Activity, Zap, CheckCircle2, Code, Users } from "lucide-react";
import {
  eventCard,
  staggerContainer,
  fadeIn,
  badgePop,
  separatorGrow,
  headerSlideDown,
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
    <Card className="h-full flex flex-col rounded-none border-0 overflow-hidden bg-card/50">
      {/* Professional Header with gradient accent */}
      <motion.div
        className="relative p-5 border-b border-border/50 glass"
        variants={headerSlideDown}
        initial="hidden"
        animate="visible"
      >
        {/* Gradient accent */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 gradient-primary opacity-50" />

        <div className="flex items-center gap-2 mb-2">
          <motion.div
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Activity className="w-4 h-4" />
          </motion.div>
          <h2 className="text-sm font-bold">Agent Timeline</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Real-time orchestration insights
        </p>

        {/* Event count badge */}
        {events.length > 0 && (
          <motion.div
            className="absolute top-4 right-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <span className="flex items-center justify-center w-6 h-6 text-[10px] font-bold rounded-full bg-primary text-primary-foreground shadow-glow">
              {events.length}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Events list with enhanced scrolling */}
      <ScrollArea className="flex-1">
        <AnimatePresence mode="popLayout">
          {events.length === 0 ? (
            <motion.div
              key="empty-state"
              className="text-center py-12 px-6"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Activity className="w-8 h-8 text-muted-foreground" />
              </motion.div>
              <p className="text-sm font-medium text-foreground mb-2">
                No events yet
              </p>
              <p className="text-xs text-muted-foreground">
                Send a message to see the agent workflow
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="events-list"
              className="p-4 space-y-4"
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
  const getAgentIcon = (agent: string) => {
    const icons: Record<string, any> = {
      orchestrator: Activity,
      coder: Code,
      researcher: Users,
    };
    const Icon = icons[agent.toLowerCase()] || Activity;
    return Icon;
  };

  const AgentIcon = getAgentIcon(event.agent);

  return (
    <motion.div
      className="group relative glass-card rounded-lg p-3 hover:bg-card/70 transition-all duration-300"
      variants={eventCard}
      custom={index}
      layout
      whileHover={{ scale: 1.02 }}
    >
      {/* Step indicator with gradient */}
      <div className="absolute -left-2 top-3 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 border-2 border-background shadow-sm">
        <span className="text-[10px] font-bold text-primary">{event.step}</span>
      </div>

      {/* Step header with enhanced styling */}
      <div className="flex items-center justify-between mb-3">
        <motion.div
          className="flex items-center gap-2 pl-6"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <AgentIcon className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">
            {event.agent}
          </span>
        </motion.div>
        <ActionBadge action={event.action} index={index} />
      </div>

      {/* Event details with better spacing */}
      <motion.div
        className="text-xs space-y-2 pl-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.05 + 0.1 }}
      >
        {event.tool && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 + 0.15 }}
          >
            <Zap className="w-3 h-3 text-amber-500" />
            <span className="font-medium text-foreground">Tool:</span>
            <motion.code
              className="px-2 py-0.5 bg-muted/50 rounded text-[10px] font-mono border border-border/50"
              whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--muted))" }}
              transition={{ duration: 0.2 }}
            >
              {event.tool}
            </motion.code>
          </motion.div>
        )}

        {event.target_agent && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 + 0.2 }}
          >
            <Users className="w-3 h-3 text-blue-500" />
            <span className="font-medium text-foreground">Delegated to:</span>
            <motion.span
              className="text-primary font-medium"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {event.target_agent}
            </motion.span>
          </motion.div>
        )}

        <motion.div
          className="pt-2"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 + 0.25 }}
        >
          <div className="flex items-start gap-2">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Thought
            </span>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
            {event.thought}
          </p>
        </motion.div>
      </motion.div>

      {/* Separator with gradient */}
      <motion.div
        variants={separatorGrow}
        className="mt-3"
      >
        <Separator className="bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      </motion.div>
    </motion.div>
  );
}

function ActionBadge({ action, index }: { action: string; index: number }) {
  const config: Record<string, { variant: "default" | "secondary" | "destructive"; icon: any }> = {
    use_tool: { variant: "default", icon: Zap },
    delegate: { variant: "secondary", icon: Users },
    final: { variant: "destructive", icon: CheckCircle2 },
  };

  const { variant, icon: Icon } = config[action] || { variant: "default", icon: Activity };

  return (
    <motion.div
      variants={badgePop}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.05 + 0.1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Badge
        variant={variant}
        className="text-[10px] font-semibold px-2 py-0.5 gap-1 shadow-sm"
      >
        <Icon className="w-3 h-3" />
        {action.replace(/_/g, " ")}
      </Badge>
    </motion.div>
  );
}

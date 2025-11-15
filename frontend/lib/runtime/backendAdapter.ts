import type { ChatModelAdapter, ChatModelRunResult } from "@assistant-ui/react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export const BackendAdapter: ChatModelAdapter = {
  async run({ messages, abortSignal }): Promise<ChatModelRunResult> {
    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortSignal,
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as {
        answer: string;
        events?: Array<{
          step: number;
          agent: string;
          action: string;
          tool?: string | null;
          target_agent?: string | null;
          thought: string;
        }>;
      };

      return {
        content: [
          {
            type: "text",
            text: data.answer,
          },
        ],
        metadata: {
          events: data.events ?? [],
        },
      };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw error;
      }

      console.error("Backend adapter error:", error);

      return {
        content: [
          {
            type: "text",
            text: "Sorry, I encountered an error communicating with the backend. Please try again.",
          },
        ],
        metadata: {
          events: [],
          error: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  },
};

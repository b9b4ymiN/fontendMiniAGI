# Claude Code – Frontend Implementation Specification

**Full technical specification for Mini-AGI Frontend (Next.js + assistant-ui + shadcn/ui Tailwind v4)**

---

## Table of Contents

1. [Overview & Objectives](#overview)
2. [Tech Stack & Dependencies](#dependencies)
3. [Project Setup](#setup)
4. [Project Structure](#structure)
5. [Runtime & Backend Adapter](#runtime)
6. [Layout & Components](#components)
7. [Styling & Theme](#styling)
8. [UX Details](#ux)
9. [Testing & Deployment](#deployment)

---

## <a id="overview"></a>1. Overview & Objectives

### Purpose
Build a Next.js frontend that provides:
- **Chat interface** using @assistant-ui/react
- **Agent timeline visualization** showing orchestration steps
- **Backend integration** via custom ChatModelAdapter
- **Responsive design** using shadcn/ui (Tailwind v4)

### High-Level Behavior

1. User types message in chat interface
2. Frontend sends message to backend `/chat` endpoint
3. Backend processes via orchestrator (agents + tools)
4. Backend returns `{ answer, events[] }`
5. Frontend displays:
   - Answer in chat thread
   - Events in side timeline panel

### Architecture Principles

**Frontend Role:**
- Display layer only
- No orchestration logic
- No tool execution
- No agent decision-making

**Backend Role:**
- All AI/agent orchestration
- Tool execution
- LLM calls
- Event generation

### Non-Goals
- ❌ Streaming (SSE/WebSocket)
- ❌ Complex state management (Redux/Zustand)
- ❌ Authentication/authorization
- ❌ Offline support

---

## <a id="dependencies"></a>2. Tech Stack & Dependencies

### Core Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript 5+
- **Runtime:** Node.js 18+

### UI Libraries
- **@assistant-ui/react** - Chat thread component
- **@assistant-ui/next** - Next.js integration helpers
- **shadcn/ui** - Design system components (Tailwind v4)
- **Tailwind CSS v4** - Utility-first styling
- **Radix UI** - Headless UI primitives (via shadcn)

### Installation

```bash
# Create Next.js app
npx create-next-app@latest frontend --typescript --tailwind --app

cd frontend

# Install assistant-ui
npm install @assistant-ui/react @assistant-ui/next

# Install additional dependencies
npm install class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-scroll-area @radix-ui/react-separator
```

### Backend Dependency
- Backend API: `http://localhost:8000`
- Endpoint: `POST /chat`
- CORS must allow `http://localhost:3000`

---

## <a id="setup"></a>3. Project Setup

### 3.1 Initialize Next.js

```bash
npx create-next-app@latest frontend
```

**Configuration prompts:**
- TypeScript? **Yes**
- ESLint? **Yes**
- Tailwind CSS? **Yes**
- `src/` directory? **No**
- App Router? **Yes**
- Import alias? **Yes** (`@/*`)

### 3.2 Configure Tailwind v4

**Reference:** https://ui.shadcn.com/docs/tailwind-v4

**1. Update `tailwind.config.ts`:**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

**2. Update `app/globals.css`:**

```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### 3.3 Initialize shadcn/ui

```bash
npx shadcn@latest init
```

**Configuration:**
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

**Add required components:**

```bash
npx shadcn@latest add card
npx shadcn@latest add scroll-area
npx shadcn@latest add badge
npx shadcn@latest add separator
npx shadcn@latest add skeleton
```

---

## <a id="structure"></a>4. Project Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Home page
│   └── globals.css             # Tailwind + theme
├── components/
│   ├── chat/
│   │   ├── ChatShell.tsx       # Main chat container
│   │   └── EventsPanel.tsx     # Agent timeline
│   └── ui/                     # shadcn components
│       ├── card.tsx
│       ├── scroll-area.tsx
│       ├── badge.tsx
│       ├── separator.tsx
│       └── skeleton.tsx
├── lib/
│   ├── runtime/
│   │   ├── backendAdapter.ts   # ChatModelAdapter
│   │   └── MyRuntimeProvider.tsx  # Runtime provider
│   └── utils.ts                # cn() helper
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## <a id="runtime"></a>5. Runtime & Backend Adapter

### 5.1 Backend Adapter

**File:** `lib/runtime/backendAdapter.ts`

```typescript
import type { ChatModelAdapter, ChatModelRunResult } from "@assistant-ui/react";

const BACKEND_URL = "http://localhost:8000";

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
```

**Key Features:**
- Proper error handling
- AbortSignal support for cancellation
- Type-safe response handling
- Metadata preservation

### 5.2 Runtime Provider

**File:** `lib/runtime/MyRuntimeProvider.tsx`

```typescript
"use client";

import type { ReactNode } from "react";
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
} from "@assistant-ui/react";
import { BackendAdapter } from "./backendAdapter";

export function MyRuntimeProvider({ children }: { children: ReactNode }) {
  const runtime = useLocalRuntime(BackendAdapter);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
```

**Usage:**
- Wrap entire app or specific routes
- Provides runtime context to all children
- Handles runtime lifecycle

---

## <a id="components"></a>6. Layout & Components

### 6.1 Root Layout

**File:** `app/layout.tsx`

```typescript
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MyRuntimeProvider } from "@/lib/runtime/MyRuntimeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mini-AGI Chat",
  description: "AI Orchestrator with Agents and Tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MyRuntimeProvider>{children}</MyRuntimeProvider>
      </body>
    </html>
  );
}
```

### 6.2 Home Page

**File:** `app/page.tsx`

```typescript
import { ChatShell } from "@/components/chat/ChatShell";

export default function HomePage() {
  return <ChatShell />;
}
```

### 6.3 Chat Shell Component

**File:** `components/chat/ChatShell.tsx`

```typescript
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
```

**Features:**
- Responsive layout (stacks on mobile)
- Header with title
- Thread component from assistant-ui
- Events extracted from message metadata

### 6.4 Events Panel Component

**File:** `components/chat/EventsPanel.tsx`

```typescript
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
```

**Features:**
- Empty state when no events
- Color-coded action badges
- Tool and delegation info
- Scrollable timeline
- Thought display

---

## <a id="styling"></a>7. Styling & Theme

### 7.1 Utility Helper

**File:** `lib/utils.ts`

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Usage in components:**
```typescript
<div className={cn("base-class", conditional && "conditional-class")} />
```

### 7.2 Theme Customization

**Colors:**
- Primary: Slate-based
- Muted: Light gray for secondary text
- Border: Subtle borders
- Destructive: Red for warnings/errors

**Typography:**
- Font: Inter (via next/font)
- Sizes: xs (11px), sm (12px), base (14px), lg (16px)
- Weight: normal (400), medium (500), semibold (600)

**Spacing:**
- Consistent: 2, 3, 4, 6, 8 (0.5rem increments)
- Generous padding for touch targets
- Balanced whitespace

### 7.3 Responsive Design

**Breakpoints:**
- Mobile: < 768px (single column)
- Tablet: 768px - 1024px (side panel 320px)
- Desktop: > 1024px (side panel 384px)

**Strategy:**
- Mobile-first approach
- Hide events panel on small screens
- Consider adding sheet/drawer for mobile access

---

## <a id="ux"></a>8. UX Details

### 8.1 Loading States

**During backend request:**
- Show loading indicator in chat
- Optionally disable input
- Display "AI is thinking..." message

**Implementation idea:**
```typescript
// In ChatShell or Thread configuration
// assistant-ui handles this automatically
```

### 8.2 Error Handling

**Backend errors:**
- Display user-friendly error message
- Log technical details to console
- Allow retry

**Network errors:**
- Graceful degradation
- Offline indicator
- Retry mechanism

### 8.3 Empty States

**No events:**
- Clear messaging
- Helpful prompt to send message
- Centered, friendly design

**No messages:**
- Welcome message
- Suggested prompts
- Quick start guide

### 8.4 Accessibility

**Keyboard navigation:**
- Tab through interactive elements
- Enter to send message
- Esc to cancel

**Screen readers:**
- Semantic HTML
- ARIA labels on icons
- Descriptive text

**Color contrast:**
- WCAG AA compliance
- Test with tools
- High contrast mode support

---

## <a id="deployment"></a>9. Testing & Deployment

### 9.1 Development

```bash
# Start dev server
npm run dev

# Access at
http://localhost:3000
```

**Prerequisites:**
- Backend running at `http://localhost:8000`
- Node.js 18+
- Modern browser

### 9.2 Type Checking

```bash
# Run TypeScript compiler
npm run type-check

# Watch mode
npm run type-check -- --watch
```

### 9.3 Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### 9.4 Build for Production

```bash
# Create optimized build
npm run build

# Start production server
npm start
```

### 9.5 Testing Checklist

**Functional:**
- [ ] Send message shows in chat
- [ ] Backend response appears
- [ ] Events populate timeline
- [ ] Multiple messages work
- [ ] Error handling works
- [ ] Cancel request works

**Visual:**
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] Dark mode works (if implemented)
- [ ] Scrolling works smoothly
- [ ] Loading states show

**Integration:**
- [ ] Backend connection works
- [ ] CORS configured correctly
- [ ] Message format correct
- [ ] Metadata preserved
- [ ] Events parse correctly

### 9.6 Common Issues

**Issue: Backend connection refused**
```
Solution: Verify backend is running on port 8000
Check CORS allows localhost:3000
```

**Issue: Events not showing**
```
Solution: Check metadata structure in network tab
Verify events array exists
Console log lastAssistantMessage
```

**Issue: Styling not applied**
```
Solution: Rebuild Tailwind
Clear .next cache
Check CSS import order
```

**Issue: TypeScript errors**
```
Solution: Install missing @types packages
Check @assistant-ui/react version
Update type definitions
```

### 9.7 Environment Variables

**File:** `.env.local`

```bash
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Enable debug logging
NEXT_PUBLIC_DEBUG=true
```

**Usage:**
```typescript
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
```

---

## Appendix: Component Import Map

```typescript
// shadcn/ui components
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// assistant-ui
import {
  Thread,
  useThreadMessages,
  AssistantRuntimeProvider,
  useLocalRuntime,
} from "@assistant-ui/react";

// Utils
import { cn } from "@/lib/utils";
```

---

## Complete File Checklist

- [ ] `app/layout.tsx` - Root layout with provider
- [ ] `app/page.tsx` - Home page
- [ ] `app/globals.css` - Tailwind + theme
- [ ] `components/chat/ChatShell.tsx` - Main container
- [ ] `components/chat/EventsPanel.tsx` - Timeline
- [ ] `components/ui/card.tsx` - Card component
- [ ] `components/ui/scroll-area.tsx` - ScrollArea
- [ ] `components/ui/badge.tsx` - Badge
- [ ] `components/ui/separator.tsx` - Separator
- [ ] `components/ui/skeleton.tsx` - Skeleton (optional)
- [ ] `lib/runtime/backendAdapter.ts` - Backend adapter
- [ ] `lib/runtime/MyRuntimeProvider.tsx` - Runtime provider
- [ ] `lib/utils.ts` - cn() helper
- [ ] `tailwind.config.ts` - Tailwind config
- [ ] `tsconfig.json` - TypeScript config

---

**End of Specification**

# CLAUDE.md - AI Assistant Guide for Mini-AGI Frontend

**Last Updated:** 2025-11-15
**Repository Purpose:** Documentation and specifications for Mini-AGI Frontend (Next.js + assistant-ui)
**Status:** Documentation repository - no implementation code yet

---

## 🎯 Repository Overview

### What This Repository Is

This is a **documentation and specification repository** for the Mini-AGI Frontend project. It contains:

- Complete architecture specifications
- Setup guides and workflows
- Development patterns and conventions
- Quick reference materials
- Claude Code instructions

### What This Repository Is NOT

- ❌ Not an implemented codebase (no source code files yet)
- ❌ Not the backend API (separate repository)
- ❌ Not a deployment-ready application

### Project Vision

Build a Next.js frontend that provides:
- **Chat interface** using @assistant-ui/react
- **Agent timeline visualization** showing AI orchestration steps
- **Backend integration** via custom ChatModelAdapter
- **Responsive design** using shadcn/ui (Tailwind v4)

---

## 📚 Documentation Structure

### Core Documentation Files

| File | Purpose | When to Use |
|------|---------|-------------|
| **PROJECT-OVERVIEW.md** | Full-stack architecture, system design, flow diagrams | Understanding the complete system |
| **SPECS.md** | Detailed frontend implementation specification | Implementing the frontend |
| **README.md** | Setup guide, quick start, troubleshooting | Getting started, installation |
| **QUICK-REFERENCE.md** | Command cheat sheet, common patterns | Daily development tasks |
| **.Claude/instructions.md** | Claude-specific frontend instructions | Claude Code sessions |
| **CLAUDE.md** (this file) | AI assistant comprehensive guide | AI-assisted development |

### Navigation Guide

**When a user asks...**

- "How does the system work?" → Read **PROJECT-OVERVIEW.md**
- "How do I implement X component?" → Read **SPECS.md**
- "How do I set up the project?" → Read **README.md**
- "What's the command for Y?" → Read **QUICK-REFERENCE.md**
- "How should I structure my code?" → Read **.Claude/instructions.md**
- "Give me the complete picture" → Read **CLAUDE.md** (this file)

---

## 🏗️ Architecture Summary

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                    │
│  ┌──────────────┐              ┌─────────────────┐     │
│  │  Chat UI     │              │  Events Panel   │     │
│  │  (Thread)    │              │  (Timeline)     │     │
│  └──────────────┘              └─────────────────┘     │
│         │                              ▲                 │
│         └──────────────┬───────────────┘                 │
│                  BackendAdapter                          │
└────────────────────────┼─────────────────────────────────┘
                         │
                    POST /chat
              { messages: [...] }
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                BACKEND (Python + FastAPI)                │
│  ┌────────────────────────────────────────────────┐     │
│  │         Orchestrator Core Loop                  │     │
│  │  ┌──────────┐   ┌──────────┐   ┌──────────┐   │     │
│  │  │Orchestr. │   │  Coder   │   │Researcher│   │     │
│  │  │  Agent   │──▶│  Agent   │   │  Agent   │   │     │
│  │  └──────────┘   └──────────┘   └──────────┘   │     │
│  │        │               │               │       │     │
│  │        └───────────────┴───────────────┘       │     │
│  │                   ┌────▼────┐                  │     │
│  │                   │  Tools  │                  │     │
│  │                   └─────────┘                  │     │
│  └────────────────────────────────────────────────┘     │
│                     ┌────▼────┐                         │
│                     │ Ollama  │                         │
│                     │LLM API  │                         │
│                     └─────────┘                         │
└─────────────────────────────────────────────────────────┘

        Returns: { answer: string, events: Event[] }
```

### Technology Stack

**Frontend:**
- Next.js 14+ (App Router)
- TypeScript (strict mode)
- @assistant-ui/react (Chat UI)
- shadcn/ui + Tailwind v4 (Design system)
- Radix UI (Headless components)

**Backend (separate repo):**
- Python 3.10+ + FastAPI
- Ollama (Local LLM)
- Pydantic (Validation)

### Data Flow

1. **User Input** → User types message in chat UI
2. **Frontend → Backend** → POST `/chat` with messages array
3. **Backend Processing** → Orchestrator runs agent loop (max 10 steps)
4. **Backend → Frontend** → Returns `{ answer, events[] }`
5. **Frontend Display** → Chat shows answer, timeline shows events

---

## 🎨 Frontend Architecture

### Project Structure (When Implemented)

```
frontend/
├── app/
│   ├── layout.tsx           # Root layout + MyRuntimeProvider
│   ├── page.tsx             # Home page with ChatShell
│   └── globals.css          # Tailwind imports + theme variables
├── components/
│   ├── chat/
│   │   ├── ChatShell.tsx    # Main container (Thread + EventsPanel)
│   │   └── EventsPanel.tsx  # Agent timeline visualization
│   └── ui/                  # shadcn/ui components
│       ├── card.tsx
│       ├── scroll-area.tsx
│       ├── badge.tsx
│       ├── separator.tsx
│       └── skeleton.tsx
├── lib/
│   ├── runtime/
│   │   ├── backendAdapter.ts      # Custom ChatModelAdapter
│   │   └── MyRuntimeProvider.tsx  # AssistantRuntimeProvider wrapper
│   └── utils.ts             # cn() utility for className merging
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

### Key Components

#### 1. BackendAdapter (`lib/runtime/backendAdapter.ts`)

**Purpose:** Integrates @assistant-ui/react with custom backend API

**Responsibilities:**
- POST messages to `/chat` endpoint
- Parse response `{ answer, events }`
- Return ChatModelRunResult format
- Handle errors gracefully
- Support AbortSignal for cancellation

**Key Interface:**
```typescript
ChatModelAdapter {
  run({ messages, abortSignal }) {
    // POST to backend
    // Return { content: [...], metadata: { events } }
  }
}
```

#### 2. MyRuntimeProvider (`lib/runtime/MyRuntimeProvider.tsx`)

**Purpose:** Provides assistant-ui runtime context to app

**Pattern:**
```typescript
const runtime = useLocalRuntime(BackendAdapter);
return <AssistantRuntimeProvider runtime={runtime}>
  {children}
</AssistantRuntimeProvider>
```

#### 3. ChatShell (`components/chat/ChatShell.tsx`)

**Purpose:** Main layout container

**Features:**
- Responsive flex layout
- Thread component from assistant-ui
- EventsPanel for timeline
- Header with title
- Mobile-first design

**Layout Pattern:**
```typescript
<div className="flex h-screen">
  <div className="flex-1">{/* Chat */}</div>
  <div className="hidden md:flex md:w-80 lg:w-96">{/* Events */}</div>
</div>
```

#### 4. EventsPanel (`components/chat/EventsPanel.tsx`)

**Purpose:** Visualize agent orchestration timeline

**Features:**
- Scrollable event list
- Color-coded action badges
- Step numbers and agent names
- Tool and delegation info
- Agent thought display
- Empty state handling

**Event Type:**
```typescript
type Event = {
  step: number
  agent: string
  action: "use_tool" | "delegate" | "final"
  tool?: string | null
  target_agent?: string | null
  thought: string
}
```

---

## 🔌 API Contract

### Endpoint: `POST /chat`

**Request Format:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": [
        { "type": "text", "text": "User message here" }
      ]
    }
  ]
}
```

**Response Format:**
```json
{
  "answer": "AI response text",
  "events": [
    {
      "step": 1,
      "agent": "orchestrator",
      "action": "delegate",
      "tool": null,
      "target_agent": "coder",
      "thought": "This is a coding task, delegating to CoderAgent"
    },
    {
      "step": 2,
      "agent": "coder",
      "action": "use_tool",
      "tool": "write_file",
      "target_agent": null,
      "thought": "Writing the Python function to file"
    },
    {
      "step": 3,
      "agent": "coder",
      "action": "final",
      "tool": null,
      "target_agent": null,
      "thought": "Task completed successfully"
    }
  ]
}
```

### Backend Requirements

**Must support:**
- CORS allowing `http://localhost:3000`
- Content-Type: `application/json`
- POST method on `/chat`
- Health check on `/health` (returns `{"status": "ok"}`)

**Error Handling:**
- Return 200 with error message in `answer` field
- Include empty `events` array on errors
- Don't expose internal error details to frontend

---

## 🎨 Styling Conventions

### Tailwind v4 Setup

**CSS Import Pattern:**
```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    /* ... more variables */
  }
}
```

**Why CSS variables?**
- Easy theme switching
- Dark mode support
- Consistent color system
- shadcn/ui compatibility

### Common Patterns

**Layout:**
```typescript
"flex h-screen w-full"              // Full-height flex container
"flex-1 flex flex-col"              // Flexible column
"hidden md:flex md:w-80 lg:w-96"    // Responsive sidebar
```

**Typography:**
```typescript
"text-sm font-medium"               // Small bold text
"text-muted-foreground"             // Secondary text
"text-xs text-foreground"           // Tiny primary text
```

**Spacing:**
```typescript
"p-4 space-y-3"                     // Padding + vertical gaps
"px-4 py-3"                         // Horizontal + vertical padding
"mt-1"                              // Small top margin
```

**Interactive:**
```typescript
"hover:bg-accent"                   // Hover effect
"cursor-pointer"                    // Pointer cursor
```

### Component Styling

**Use cn() utility:**
```typescript
import { cn } from "@/lib/utils"

<div className={cn("base-class", conditional && "extra-class")} />
```

**shadcn component pattern:**
```typescript
<Card className="h-full rounded-none border-0">
  <ScrollArea className="flex-1">
    <Badge variant="default" className="text-[10px]">
      {action}
    </Badge>
  </ScrollArea>
</Card>
```

---

## 💻 Development Workflows

### Initial Setup (When Implementing)

```bash
# 1. Create Next.js app
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend

# 2. Install dependencies
npm install @assistant-ui/react @assistant-ui/next
npm install class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-scroll-area @radix-ui/react-separator

# 3. Initialize shadcn
npx shadcn@latest init
npx shadcn@latest add card scroll-area badge separator skeleton

# 4. Configure Tailwind v4 (see SPECS.md)

# 5. Create directory structure
mkdir -p components/chat lib/runtime

# 6. Implement files (use SPECS.md as reference)
```

### Daily Development

```bash
# Terminal 1: Backend (separate repo)
cd backend
source venv/bin/activate
uvicorn backend.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev

# Access at http://localhost:3000
```

### Common Commands

```bash
# Add shadcn component
npx shadcn@latest add [component-name]

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint -- --fix

# Build for production
npm run build
npm start
```

### Testing Checklist

**Functional Tests:**
- [ ] Send message appears in chat
- [ ] Backend response displays
- [ ] Events populate timeline
- [ ] Multiple messages work
- [ ] Error handling graceful
- [ ] Cancellation works

**Visual Tests:**
- [ ] Responsive on mobile (< 768px)
- [ ] Responsive on tablet (768-1024px)
- [ ] Responsive on desktop (> 1024px)
- [ ] Scrolling smooth
- [ ] Loading states show
- [ ] Empty states display

**Integration Tests:**
- [ ] Backend connection works
- [ ] CORS configured
- [ ] Message format correct
- [ ] Metadata preserved
- [ ] Events parse correctly

---

## 🤖 AI Assistant Guidelines

### When Working with This Repository

**As an AI Assistant, you should:**

1. **Always read the relevant docs first**
   - Check SPECS.md for implementation details
   - Reference PROJECT-OVERVIEW.md for architecture
   - Use QUICK-REFERENCE.md for commands

2. **Follow TypeScript strictly**
   - Use proper type annotations
   - Avoid `any` type
   - Define interfaces for props
   - Use generics where appropriate

3. **Maintain consistency**
   - Follow existing patterns
   - Use established naming conventions
   - Keep file structure organized
   - Match coding style

4. **Implement incrementally**
   - Start with core functionality
   - Add features one at a time
   - Test after each change
   - Keep commits atomic

5. **Handle errors gracefully**
   - Always add try-catch blocks
   - Show user-friendly error messages
   - Log technical details to console
   - Don't crash on backend errors

6. **Focus on UX**
   - Responsive design first
   - Loading states for async operations
   - Empty states with helpful messages
   - Accessibility (keyboard nav, ARIA)

### Code Patterns to Follow

**Component Structure:**
```typescript
"use client"; // Only if needed

import { /* ... */ } from "...";

interface ComponentNameProps {
  // Props with types
}

export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // Hooks first
  // Event handlers
  // Derived state

  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
}
```

**Async Operations:**
```typescript
try {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: abortSignal,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return await response.json();
} catch (error) {
  console.error("Operation failed:", error);
  // Handle gracefully
}
```

**Metadata Extraction:**
```typescript
const messages = useThreadMessages();
const lastAssistantMessage = messages
  .filter((m) => m.role === "assistant")
  .at(-1);
const events = (lastAssistantMessage?.metadata?.events as Event[]) ?? [];
```

### Common Pitfalls to Avoid

❌ **Don't:**
- Add backend logic to frontend
- Skip error handling
- Break @assistant-ui message format
- Modify adapter without testing
- Use inline styles instead of Tailwind
- Forget responsive design
- Skip TypeScript types
- Add streaming (out of scope)

✅ **Do:**
- Keep frontend as display layer only
- Use proper error boundaries
- Follow assistant-ui conventions
- Test adapter with real backend
- Use Tailwind utility classes
- Mobile-first approach
- Full type coverage
- Simple request-response pattern

### When User Asks for Changes

**For Documentation Updates:**
1. Identify which file(s) to modify
2. Maintain existing structure
3. Keep examples accurate
4. Update related sections

**For Implementation Tasks:**
1. Read SPECS.md for detailed requirements
2. Follow established patterns
3. Test with backend running
4. Ensure type safety
5. Update docs if needed

**For Troubleshooting:**
1. Check QUICK-REFERENCE.md troubleshooting section
2. Verify backend is running
3. Check browser console
4. Inspect network requests
5. Validate data structures

---

## 🎯 Key Principles

### 1. Backend-First Architecture

**Frontend Responsibilities:**
- Display chat messages
- Show agent events timeline
- Handle user input
- Make API calls

**Frontend Does NOT:**
- Run agent orchestration
- Execute tools
- Make LLM calls
- Implement business logic

### 2. Type Safety First

**Every component must:**
- Have typed props interface
- Use proper TypeScript types
- Avoid `any` type
- Export types for reuse

### 3. Responsive Design

**Mobile (< 768px):**
- Single column layout
- Chat full width
- Events panel hidden (or drawer)

**Tablet (768-1024px):**
- Two column layout
- Chat flex-1, Events 320px

**Desktop (> 1024px):**
- Two column layout
- Chat flex-1, Events 384px

### 4. Error Handling

**Always handle:**
- Network failures
- Backend errors
- Invalid responses
- Timeouts
- Cancellations

**User should see:**
- Friendly error messages
- Retry options
- Never raw stack traces

### 5. Accessibility

**Requirements:**
- Semantic HTML
- Keyboard navigation
- ARIA labels
- Color contrast (WCAG AA)
- Screen reader support

---

## 📝 Naming Conventions

### Files & Directories

- **Components:** `PascalCase.tsx` (e.g., `ChatShell.tsx`)
- **Utilities:** `camelCase.ts` (e.g., `backendAdapter.ts`)
- **Directories:** `lowercase` (e.g., `chat/`, `runtime/`)

### Code Elements

- **Components:** `PascalCase` (e.g., `EventsPanel`)
- **Hooks:** `useCamelCase` (e.g., `useThreadMessages`)
- **Functions:** `camelCase` (e.g., `handleSubmit`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `BACKEND_URL`)
- **Interfaces:** `PascalCaseProps` (e.g., `EventsPanelProps`)
- **Types:** `PascalCase` (e.g., `Event`)

### CSS Classes

- Use Tailwind utilities
- Avoid custom CSS unless necessary
- Use `cn()` for conditional classes
- Follow shadcn/ui patterns

---

## 🔍 Troubleshooting Guide

### Backend Connection Issues

**Symptoms:**
- "Cannot connect to backend"
- CORS errors in console
- Network errors

**Solutions:**
1. Check backend running: `curl http://localhost:8000/health`
2. Verify CORS allows `http://localhost:3000`
3. Check firewall/network settings
4. Inspect browser console for details

### Events Not Displaying

**Symptoms:**
- Events panel empty
- Timeline shows "No events yet"
- Events array missing

**Solutions:**
1. Check network tab for `/chat` response
2. Verify response has `events` array
3. Log `lastAssistantMessage?.metadata`
4. Validate event structure matches `Event` type

### TypeScript Errors

**Symptoms:**
- Red squiggles in IDE
- Build fails with type errors
- Missing type definitions

**Solutions:**
1. Install missing types: `npm install -D @types/node @types/react`
2. Restart TS server in VSCode
3. Check `@assistant-ui/react` version
4. Verify imports are correct

### Styling Issues

**Symptoms:**
- Tailwind classes not working
- Theme colors wrong
- Layout broken

**Solutions:**
1. Check `globals.css` imported in `layout.tsx`
2. Verify `tailwind.config.ts` content paths
3. Restart dev server
4. Clear `.next` cache: `rm -rf .next`

### Component Not Found

**Symptoms:**
- Import errors for UI components
- Module not found errors

**Solutions:**
1. Install component: `npx shadcn@latest add [name]`
2. Check import path: `@/components/ui/...`
3. Verify `components/ui/` directory exists
4. Check `tsconfig.json` paths

---

## 🚀 Quick Start for AI Assistants

### First Time Setup

```bash
# 1. Verify prerequisites
node --version  # Should be 18+
npm --version

# 2. Read key docs
- Read PROJECT-OVERVIEW.md (architecture)
- Read SPECS.md (implementation)
- Read .Claude/instructions.md (coding style)

# 3. Understand the data flow
User Input → BackendAdapter → POST /chat → Backend Processing
→ Response { answer, events } → Display in UI

# 4. Understand the file structure
app/          # Next.js App Router pages
components/   # React components
lib/          # Utilities and runtime
```

### When Implementing Features

```typescript
// 1. Define types
interface MyFeatureProps {
  data: SomeType;
}

// 2. Create component
export function MyFeature({ data }: MyFeatureProps) {
  // Implementation
}

// 3. Add to parent component
import { MyFeature } from "./MyFeature";

// 4. Test with backend
npm run dev
# Send test messages
```

### When Debugging

```typescript
// Add strategic console.logs
console.log("Messages:", messages);
console.log("Events:", events);
console.log("Metadata:", lastAssistantMessage?.metadata);

// Check network tab
// Look for POST /chat request
// Inspect request/response

// Verify types
// Check TypeScript errors
// Ensure proper casting
```

---

## 📖 Reference Links

### External Documentation

- **Next.js:** https://nextjs.org/docs
- **@assistant-ui:** https://github.com/assistant-ui/assistant-ui
- **shadcn/ui:** https://ui.shadcn.com
- **Tailwind CSS:** https://tailwindcss.com
- **Radix UI:** https://www.radix-ui.com

### Internal Documentation

- **Architecture:** PROJECT-OVERVIEW.md
- **Implementation:** SPECS.md
- **Setup:** README.md
- **Commands:** QUICK-REFERENCE.md
- **Coding Style:** .Claude/instructions.md

---

## 🎓 Learning Path for New AI Assistants

### Level 1: Understanding

1. Read PROJECT-OVERVIEW.md
2. Understand system architecture
3. Learn data flow
4. Review API contract

### Level 2: Setup Knowledge

1. Read README.md
2. Learn installation steps
3. Understand prerequisites
4. Know daily development workflow

### Level 3: Implementation

1. Read SPECS.md thoroughly
2. Understand component structure
3. Learn TypeScript patterns
4. Review styling conventions

### Level 4: Mastery

1. Read QUICK-REFERENCE.md
2. Know common commands by heart
3. Understand troubleshooting
4. Can debug efficiently

### Level 5: Contributing

1. Follow coding conventions
2. Write clean, typed code
3. Test thoroughly
4. Update documentation

---

## ✅ Pre-Implementation Checklist

Before writing code, ensure:

- [ ] Backend API is running (`http://localhost:8000`)
- [ ] Ollama is installed and running
- [ ] Node.js 18+ installed
- [ ] Read PROJECT-OVERVIEW.md
- [ ] Read SPECS.md
- [ ] Understand @assistant-ui/react
- [ ] Understand shadcn/ui setup
- [ ] Know the API contract
- [ ] Prepared to use TypeScript strictly
- [ ] Ready to test incrementally

---

## 🎯 Success Criteria

### For Implementation

Code is successful when:

- [ ] TypeScript compiles with no errors
- [ ] All components properly typed
- [ ] Responsive on all screen sizes
- [ ] Backend integration works
- [ ] Events display correctly
- [ ] Error handling graceful
- [ ] Loading states present
- [ ] Empty states helpful
- [ ] Follows established patterns
- [ ] Tests pass (when added)

### For Documentation

Docs are successful when:

- [ ] Clear and comprehensive
- [ ] Examples are accurate
- [ ] Structure is logical
- [ ] Easy to navigate
- [ ] Up to date
- [ ] Covers edge cases
- [ ] Includes troubleshooting
- [ ] References correct

---

## 🔄 Keeping This Document Updated

### When to Update CLAUDE.md

Update this file when:

- Architecture changes
- New patterns emerge
- Common issues found
- Dependencies updated
- Best practices evolve
- User feedback received

### Update Process

1. Identify section to update
2. Maintain existing structure
3. Keep examples accurate
4. Update "Last Updated" date
5. Test all code examples
6. Review for clarity

---

## 🤝 Working with Users

### Communication Style

**Do:**
- Explain what you're doing
- Reference specific docs
- Provide file paths with line numbers
- Show code examples
- Explain trade-offs

**Don't:**
- Make assumptions
- Skip explanations
- Provide incomplete code
- Ignore errors
- Over-engineer solutions

### Clarifying Requirements

**Always ask when:**
- Feature scope unclear
- Multiple approaches possible
- Breaking changes needed
- Documentation insufficient
- User intent ambiguous

### Delivering Solutions

**Always:**
- Test before delivering
- Provide complete code
- Include type definitions
- Add error handling
- Update relevant docs
- Explain your approach

---

## 📊 Project Status

### Current State

- **Status:** Documentation repository
- **Code Implementation:** Not yet started
- **Documentation:** Complete and comprehensive
- **Ready for:** Implementation phase

### Next Steps

1. Create Next.js project
2. Install dependencies
3. Configure Tailwind v4
4. Implement BackendAdapter
5. Implement MyRuntimeProvider
6. Create ChatShell component
7. Create EventsPanel component
8. Test with backend
9. Refine and iterate

### Future Enhancements

Potential features:
- [ ] Conversation history persistence
- [ ] Export conversation feature
- [ ] Dark mode toggle
- [ ] Mobile drawer for events
- [ ] Code syntax highlighting
- [ ] Copy code button
- [ ] Message retry
- [ ] Streaming support (major change)

---

## 🎉 Final Notes

### Philosophy

This project follows a **specification-first** approach:
- Define architecture clearly
- Document thoroughly
- Implement systematically
- Test continuously
- Iterate based on feedback

### For AI Assistants

You have everything you need to:
- Understand the system completely
- Implement features correctly
- Debug issues effectively
- Help users successfully
- Maintain quality consistently

### Remember

- **Quality over speed** - Take time to understand
- **Types are your friend** - Embrace TypeScript
- **Users come first** - Focus on UX
- **Documentation matters** - Keep it updated
- **Testing is essential** - Always verify
- **Patterns over reinvention** - Follow established conventions

---

**Happy Coding! 🚀**

*This is your definitive guide. Refer to it often. Update it when needed. Use it to build amazing things.*

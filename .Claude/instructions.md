# Mini-AGI Frontend - Project Instructions

## Project Overview
Next.js 14+ (App Router) frontend with chat UI using @assistant-ui/react and shadcn/ui (Tailwind v4). Connects to Python backend orchestrator API to display AI conversations and agent execution timeline.

## Core Architecture

**UI Components:**
- Chat interface powered by `@assistant-ui/react`
- Side panel showing agent execution events
- Responsive layout (chat main, timeline side/below)

**Data Flow:**
1. User sends message via chat UI
2. Frontend calls `POST /chat` to backend
3. Backend returns `{ answer, events[] }`
4. Display answer in chat + events in timeline panel

**No Streaming:** Simple request → response pattern

## Technology Stack

**Framework & Language:**
- Next.js 14+ with App Router
- TypeScript (strict mode)
- React 18+

**UI Libraries:**
- `@assistant-ui/react` - Chat thread component
- `shadcn/ui` for Tailwind v4 - Design system components
- Tailwind CSS v4 - Styling

**Backend Integration:**
- Backend URL: `http://localhost:8000`
- Endpoint: `POST /chat`
- Custom `ChatModelAdapter` for @assistant-ui

## Key Principles

1. **Backend-First Logic** - Frontend is display-only, no orchestration
2. **Type Safety** - Full TypeScript coverage
3. **Responsive Design** - Mobile-friendly layout
4. **Metadata Handling** - Events stored in message metadata
5. **Clean Separation** - Runtime logic separate from UI components

## Project Structure

```
frontend/
  app/
    layout.tsx           # Root layout + provider wrapper
    page.tsx             # Home page with ChatShell
    globals.css          # Tailwind imports + custom styles
  components/
    chat/
      ChatShell.tsx      # Main chat layout (Thread + panel)
      EventsPanel.tsx    # Agent timeline display
    ui/                  # shadcn/ui components
      card.tsx
      scroll-area.tsx
      badge.tsx
      separator.tsx
  lib/
    runtime/
      backendAdapter.ts  # Custom ChatModelAdapter
      MyRuntimeProvider.tsx  # AssistantRuntimeProvider wrapper
```

## Important Constraints

**API Contract:**
- Request: `{ messages: [...] }` (assistant-ui format)
- Response: `{ answer: string, events: Event[] }`
- No authentication in dev mode
- CORS handled by backend

**Event Structure:**
```typescript
{
  step: number
  agent: string
  action: "use_tool" | "delegate" | "final"
  tool?: string | null
  target_agent?: string | null
  thought: string
}
```

**UI Requirements:**
- Chat takes primary space (flex-1)
- Events panel: 320-384px wide on desktop
- Stack vertically on mobile
- Show "No events yet" placeholder when empty

## Coding Preferences

**Style:**
- Use `"use client"` only when necessary
- Prefer composition over inheritance
- Keep components small and focused
- Use Tailwind utility classes consistently

**Patterns:**
- Custom hooks for data access
- Provider pattern for runtime
- Controlled components where needed
- Props destructuring with types

**Naming:**
- Components: PascalCase
- Files: PascalCase for components, camelCase for utilities
- Props interfaces: `ComponentNameProps`
- Event handlers: `handleActionName`

## Development Workflow

**Start dev server:**
```bash
npm run dev
# Access at http://localhost:3000
```

**Add shadcn component:**
```bash
npx shadcn@latest add [component-name]
```

**Type checking:**
```bash
npm run type-check
```

## shadcn/ui Tailwind v4 Setup

**Reference:** https://ui.shadcn.com/docs/tailwind-v4

**Key Points:**
- Use `@import "tailwindcss"` in CSS
- Configure theme with CSS variables
- Components use CSS variable-based theming
- Dark mode via class strategy

**Required Components:**
- Card - Container styling
- ScrollArea - Scrollable timeline
- Badge - Action indicators
- Separator - Visual dividers
- Button - Actions (if needed)
- Skeleton - Loading states

## @assistant-ui/react Integration

**Runtime Setup:**
- Use `useLocalRuntime` hook
- Provide custom `ChatModelAdapter`
- Wrap app with `AssistantRuntimeProvider`

**Message Access:**
- Use appropriate hooks to access messages
- Extract metadata from assistant messages
- Handle missing metadata gracefully

**Thread Component:**
- Import from `@assistant-ui/react`
- Minimal configuration needed
- Handles message rendering automatically

## When Making Changes

✅ **Do:**
- Maintain TypeScript types strictly
- Test with backend running
- Handle loading/error states
- Keep responsive layout working
- Preserve metadata structure

❌ **Don't:**
- Add backend logic to frontend
- Skip error boundaries
- Break assistant-ui message format
- Modify adapter without testing
- Add streaming (out of scope)

## Quick Reference

**Access latest message events:**
```typescript
const messages = useThreadMessages()
const lastAssistant = messages
  .filter(m => m.role === "assistant")
  .at(-1)
const events = lastAssistant?.metadata?.events ?? []
```

**Backend adapter structure:**
```typescript
ChatModelAdapter {
  run({ messages, abortSignal }) {
    // POST to backend
    // Return { content: [...], metadata: { events } }
  }
}
```

**Layout pattern:**
```tsx
<div className="flex h-screen flex-col md:flex-row">
  <div className="flex-1">{/* Chat */}</div>
  <div className="w-80 lg:w-96">{/* Events */}</div>
</div>
```

## Common Tasks

**Add new UI component:**
1. Run `npx shadcn@latest add [name]`
2. Import in component
3. Use with Tailwind classes

**Modify event display:**
1. Edit `EventsPanel.tsx`
2. Update event item structure
3. Test with various event types

**Change backend URL:**
1. Update `backendAdapter.ts`
2. Consider environment variable
3. Update CORS on backend if needed

## Debug Tips

- Check Network tab for `/chat` requests
- Verify message format matches backend expectations
- Use React DevTools to inspect runtime state
- Check console for assistant-ui errors
- Validate events array structure

---

For detailed implementation specs, see `FRONTEND-SPECS.md`

# Mini-AGI Frontend - Setup Guide

## 📁 Project Structure

```
your-frontend/
├── .claude/
│   └── instructions.md    ← Claude Code configuration
├── app/
│   ├── layout.tsx        ← Root layout + providers
│   ├── page.tsx          ← Home page
│   └── globals.css       ← Tailwind + theme
├── components/
│   ├── chat/
│   │   ├── ChatShell.tsx
│   │   └── EventsPanel.tsx
│   └── ui/               ← shadcn components
├── lib/
│   ├── runtime/
│   │   ├── backendAdapter.ts
│   │   └── MyRuntimeProvider.tsx
│   └── utils.ts
├── FRONTEND-SPECS.md     ← Full implementation specification
└── README.md             ← This file
```

## 🚀 Quick Start

### 1. Create Next.js Project

```bash
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend
```

**Select these options:**
- ✅ TypeScript
- ✅ ESLint  
- ✅ Tailwind CSS
- ✅ App Router
- ✅ Import alias (@/*)
- ❌ src/ directory

### 2. Install Dependencies

```bash
# Assistant-ui libraries
npm install @assistant-ui/react @assistant-ui/next

# Utility libraries
npm install class-variance-authority clsx tailwind-merge

# Radix UI primitives (used by shadcn)
npm install @radix-ui/react-scroll-area @radix-ui/react-separator
```

### 3. Setup shadcn/ui (Tailwind v4)

Initialize shadcn:
```bash
npx shadcn@latest init
```

**Configuration:**
- Style: Default
- Base color: Slate
- CSS variables: Yes

Add required components:
```bash
npx shadcn@latest add card scroll-area badge separator skeleton
```

### 4. Configure Tailwind v4

Follow the official guide: https://ui.shadcn.com/docs/tailwind-v4

**Update `app/globals.css`** with theme variables (see FRONTEND-SPECS.md)

### 5. Create Project Structure

```bash
# Create directories
mkdir -p .claude components/chat lib/runtime

# Move instructions file
mv .claude-frontend-instructions.md .claude/instructions.md
```

### 6. Implement Files

You can either:

**Option A: Use Claude Code (Recommended)**
```bash
# Claude will read .claude/instructions.md automatically
claude code "implement all frontend files according to FRONTEND-SPECS.md"
```

**Option B: Manual Implementation**
Follow the detailed specification in `FRONTEND-SPECS.md` to create each file.

### 7. Configure Backend URL

Create `.env.local`:
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### 8. Start Development Server

```bash
npm run dev
```

Access at: http://localhost:3000

## 🔧 Prerequisites

### Backend Must Be Running

The frontend requires the backend API:
```bash
# In backend directory
uvicorn backend.main:app --reload --port 8000
```

Verify backend is running:
```bash
curl http://localhost:8000/health
# Should return: {"status": "ok"}
```

### Backend CORS Configuration

Backend must allow frontend origin in `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🧪 Testing

### Test Chat Functionality

1. Open http://localhost:3000
2. Type a message: "Hello"
3. Check that:
   - Message appears in chat
   - Backend responds with answer
   - Events panel shows orchestration steps

### Test Event Display

Try complex queries that trigger multiple agent steps:
```
"Write a Python function to calculate fibonacci numbers"
"Analyze this data and create a summary"
"Help me debug this code"
```

Watch the Events Panel populate with:
- Step numbers
- Agent names (orchestrator, coder, researcher)
- Actions (use_tool, delegate, final)
- Tools used
- Agent thoughts

### Test Responsive Layout

1. **Desktop (> 1024px):**
   - Chat on left (flex-1)
   - Events panel on right (384px)

2. **Tablet (768px - 1024px):**
   - Chat on left (flex-1)
   - Events panel on right (320px)

3. **Mobile (< 768px):**
   - Chat full width
   - Events panel hidden
   - (Optional: add drawer/sheet for mobile)

### Test Error Handling

**Backend offline:**
```bash
# Stop backend server
# Try sending message
# Should show error message gracefully
```

**Invalid backend response:**
```bash
# Modify backend to return invalid JSON
# Should handle error without crashing
```

## 📝 Development Workflow

### File Organization

```
components/chat/     # Chat-specific components
components/ui/       # Reusable UI components (shadcn)
lib/runtime/         # Backend integration logic
```

### Adding New Components

**shadcn component:**
```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

**Custom component:**
```bash
# Create file in appropriate directory
touch components/chat/NewComponent.tsx
```

### Type Checking

```bash
# Check types
npm run type-check

# Watch mode
npm run type-check -- --watch
```

### Linting

```bash
# Run linter
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

## 🎨 Customization

### Change Backend URL

**Development:**
```bash
# .env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

**Production:**
```bash
# .env.production
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
```

**Update adapter:**
```typescript
// lib/runtime/backendAdapter.ts
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
```

### Modify Event Display

Edit `components/chat/EventsPanel.tsx`:

```typescript
// Add new event field
{event.custom_field && (
  <div>Custom: {event.custom_field}</div>
)}

// Change badge colors
const variants = {
  use_tool: "default",
  delegate: "secondary", 
  final: "outline",       // Changed from "destructive"
  custom: "default",      // New action type
};
```

### Customize Chat UI

The Thread component from @assistant-ui/react can be customized:

```typescript
<Thread
  className="h-full"
  // Add custom styling or configuration
/>
```

Refer to @assistant-ui/react documentation for full customization options.

### Add Mobile Events Panel

Create a drawer/sheet for mobile:

```bash
npx shadcn@latest add sheet
```

```typescript
// In ChatShell.tsx
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

<div className="md:hidden fixed bottom-4 right-4">
  <Sheet>
    <SheetTrigger asChild>
      <Button>View Events</Button>
    </SheetTrigger>
    <SheetContent>
      <EventsPanel events={events} />
    </SheetContent>
  </Sheet>
</div>
```

## 🐛 Troubleshooting

### "Cannot connect to backend"

**Problem:** Frontend can't reach backend API  
**Solution:**
```bash
# 1. Check backend is running
curl http://localhost:8000/health

# 2. Check CORS configuration
# Verify allow_origins includes "http://localhost:3000"

# 3. Check browser console for CORS errors
# Open DevTools > Console
```

### "Events not showing"

**Problem:** Events panel empty after response  
**Solution:**
```bash
# 1. Check network tab
# POST /chat should return events array

# 2. Check message metadata
console.log(lastAssistantMessage?.metadata)

# 3. Verify event structure matches type
# See Event type in EventsPanel.tsx
```

### "Type errors in IDE"

**Problem:** TypeScript errors in editor  
**Solution:**
```bash
# 1. Install missing types
npm install -D @types/node @types/react @types/react-dom

# 2. Restart TypeScript server
# VSCode: Cmd/Ctrl + Shift + P > "TypeScript: Restart TS Server"

# 3. Check @assistant-ui/react version
npm list @assistant-ui/react
```

### "Tailwind classes not working"

**Problem:** Styles not applied  
**Solution:**
```bash
# 1. Check globals.css import in layout.tsx
import "./globals.css";

# 2. Verify tailwind.config.ts content paths
content: [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
]

# 3. Restart dev server
npm run dev
```

### "shadcn component not found"

**Problem:** Import error for UI component  
**Solution:**
```bash
# 1. Check component is installed
npx shadcn@latest add [component-name]

# 2. Verify import path
import { Card } from "@/components/ui/card";

# 3. Check components/ui/ directory exists
ls components/ui/
```

## 📚 API Integration

### Message Format

**Frontend sends:**
```typescript
{
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "User message here" }
      ]
    }
  ]
}
```

**Backend returns:**
```typescript
{
  answer: "AI response text",
  events: [
    {
      step: 1,
      agent: "orchestrator",
      action: "use_tool",
      tool: "read_file",
      target_agent: null,
      thought: "I need to read the file first"
    }
  ]
}
```

### Adapter Flow

1. User sends message via Thread component
2. `BackendAdapter.run()` called with messages
3. POST request to backend `/chat`
4. Response parsed and returned as ChatModelRunResult
5. Content shown in chat, events in metadata
6. EventsPanel extracts events from metadata

## 🔄 Next Steps

After basic setup is working:

1. ✅ Test all agent types (orchestrator, coder, researcher)
2. ✅ Test all action types (use_tool, delegate, final)
3. ✅ Implement mobile drawer for events
4. ✅ Add dark mode toggle
5. ✅ Add copy code button for code blocks
6. ✅ Add message retry functionality
7. ✅ Add conversation history persistence
8. ✅ Add export conversation feature

## 🎯 Production Checklist

Before deploying:

- [ ] Update BACKEND_URL to production API
- [ ] Enable HTTPS
- [ ] Add error tracking (Sentry, etc.)
- [ ] Add analytics (optional)
- [ ] Optimize images and assets
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Add rate limiting (if needed)
- [ ] Configure CSP headers
- [ ] Test error scenarios

## 📖 Additional Resources

- **Next.js Docs:** https://nextjs.org/docs
- **@assistant-ui Docs:** https://github.com/assistant-ui/assistant-ui
- **shadcn/ui Docs:** https://ui.shadcn.com
- **Tailwind v4 Docs:** https://tailwindcss.com
- **Backend Specs:** See `../backend/SPECS.md`

---

**Happy Coding! 🚀**

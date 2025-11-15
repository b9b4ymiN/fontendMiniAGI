# Mini-AGI Frontend

Next.js frontend application for the Mini-AGI orchestrator system with chat UI and agent timeline visualization.

## Features

- **Chat Interface** - Built with @assistant-ui/react for smooth conversation flow
- **Agent Timeline** - Visualize orchestration steps, agent decisions, and tool usage
- **Responsive Design** - Mobile-first design using Tailwind CSS
- **Type Safe** - Full TypeScript coverage for reliability
- **Backend Integration** - Custom adapter for Python/FastAPI backend

## Prerequisites

- **Node.js 18+** - Required for Next.js 14
- **Backend API** - Python backend running on `http://localhost:8000`
- **npm or yarn** - Package manager

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local` (or copy from `.env.example`):

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### 3. Start Backend

Ensure the Python backend is running:

```bash
# In backend directory
uvicorn backend.main:app --reload --port 8000
```

Verify backend health:

```bash
curl http://localhost:8000/health
# Should return: {"status": "ok"}
```

### 4. Start Development Server

```bash
npm run dev
```

Access the application at: **http://localhost:3000**

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout + MyRuntimeProvider
│   ├── page.tsx            # Home page with ChatShell
│   └── globals.css         # Tailwind + theme variables
├── components/
│   ├── chat/
│   │   ├── ChatShell.tsx   # Main container (Thread + EventsPanel)
│   │   └── EventsPanel.tsx # Agent timeline visualization
│   └── ui/                 # shadcn/ui components
│       ├── card.tsx
│       ├── scroll-area.tsx
│       ├── badge.tsx
│       └── separator.tsx
├── lib/
│   ├── runtime/
│   │   ├── backendAdapter.ts      # ChatModelAdapter for backend
│   │   └── MyRuntimeProvider.tsx  # AssistantRuntimeProvider wrapper
│   └── utils.ts            # Utility functions (cn)
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── tailwind.config.ts      # Tailwind config
└── next.config.js          # Next.js config
```

## Available Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Production
npm run build            # Build optimized production bundle
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking
```

## Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **Chat UI:** @assistant-ui/react
- **Styling:** Tailwind CSS 3
- **Components:** shadcn/ui + Radix UI
- **Font:** Inter (via next/font)

## How It Works

### Data Flow

1. **User Input** → User types message in chat UI
2. **Frontend Request** → POST to `/chat` with messages array
3. **Backend Processing** → Orchestrator runs agent loop
4. **Backend Response** → Returns `{ answer, events[] }`
5. **Frontend Display** → Chat shows answer, timeline shows events

### API Contract

**Request Format:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": [{"type": "text", "text": "Your message"}]
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
      "thought": "Reasoning..."
    }
  ]
}
```

### Component Hierarchy

```
HomePage (app/page.tsx)
  └─ ChatShell (components/chat/ChatShell.tsx)
      ├─ Thread (@assistant-ui/react)
      └─ EventsPanel (components/chat/EventsPanel.tsx)
```

## Configuration

### Backend URL

Update `.env.local`:

```bash
# Development
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Production
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
```

### Theme Customization

Edit `app/globals.css` to customize colors:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  /* ... more variables */
}
```

## Responsive Design

- **Mobile (< 768px):** Single column, chat full width, events hidden
- **Tablet (768px - 1024px):** Two columns, events panel 320px
- **Desktop (> 1024px):** Two columns, events panel 384px

## Troubleshooting

### Backend Connection Failed

**Symptoms:** "Cannot connect to backend" error

**Solutions:**
1. Verify backend is running: `curl http://localhost:8000/health`
2. Check CORS configuration in backend allows `http://localhost:3000`
3. Verify `.env.local` has correct `NEXT_PUBLIC_BACKEND_URL`

### Events Not Showing

**Symptoms:** Events panel empty after response

**Solutions:**
1. Check network tab for `/chat` response
2. Verify response includes `events` array
3. Check browser console for errors
4. Log metadata: `console.log(lastAssistantMessage?.metadata)`

### TypeScript Errors

**Symptoms:** Build fails with type errors

**Solutions:**
1. Install missing types: `npm install -D @types/node @types/react`
2. Restart TypeScript server in IDE
3. Clear `.next` directory: `rm -rf .next`
4. Verify `@assistant-ui/react` version compatibility

### Styling Issues

**Symptoms:** Tailwind classes not working

**Solutions:**
1. Ensure `globals.css` imported in `layout.tsx`
2. Verify `tailwind.config.ts` content paths include all files
3. Restart dev server: `npm run dev`
4. Clear cache: `rm -rf .next`

## Development Tips

### Adding New shadcn Components

```bash
# Install specific component
npx shadcn@latest add button

# Then import and use
import { Button } from "@/components/ui/button"
```

### Accessing Message Metadata

```typescript
const messages = useThreadMessages();
const lastAssistant = messages.filter(m => m.role === "assistant").at(-1);
const events = lastAssistant?.metadata?.events ?? [];
```

### Custom Error Handling

```typescript
// In backendAdapter.ts
return {
  content: [{ type: "text", text: "Custom error message" }],
  metadata: { events: [], error: "Details..." }
};
```

## Testing Checklist

Before deployment:

- [ ] Messages send and display correctly
- [ ] Backend responses appear in chat
- [ ] Events populate timeline
- [ ] Responsive on mobile devices
- [ ] Error handling works gracefully
- [ ] Loading states show during requests
- [ ] Empty states display properly
- [ ] TypeScript compiles without errors
- [ ] Build completes successfully

## Production Deployment

### Build

```bash
npm run build
```

### Deploy

The frontend can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Custom server** (using `npm start`)

### Environment Variables

Set in deployment platform:

```bash
NEXT_PUBLIC_BACKEND_URL=https://api.production.com
```

### Checklist

- [ ] Update `NEXT_PUBLIC_BACKEND_URL` to production API
- [ ] Enable HTTPS
- [ ] Configure CSP headers
- [ ] Add error tracking (Sentry, etc.)
- [ ] Optimize images and assets
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Set up monitoring

## Documentation

For detailed specifications, see the main repository docs:

- **SPECS.md** - Complete implementation specification
- **PROJECT-OVERVIEW.md** - System architecture
- **QUICK-REFERENCE.md** - Command cheat sheet
- **CLAUDE.md** - AI assistant guide

## Support

For issues or questions:

1. Check documentation in main repository
2. Review troubleshooting section above
3. Check backend logs and frontend console
4. Verify API contract matches between frontend and backend

## License

ISC

---

**Built with Next.js 14 + @assistant-ui/react + shadcn/ui**

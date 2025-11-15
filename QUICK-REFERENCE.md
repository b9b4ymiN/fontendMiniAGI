# Mini-AGI Quick Reference

**Essential commands and patterns for daily development**

---

## 🚀 Quick Start Commands

### Initial Setup (First Time Only)

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install fastapi uvicorn requests pydantic

# Frontend
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend
npm install @assistant-ui/react @assistant-ui/next
npm install class-variance-authority clsx tailwind-merge
npx shadcn@latest init
npx shadcn@latest add card scroll-area badge separator
```

### Daily Development

```bash
# Terminal 1: Backend
cd backend && source venv/bin/activate
uvicorn backend.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Ollama (if not running as service)
ollama serve
```

---

## 📝 Common Commands

### Backend

```bash
# Install new package
pip install package-name

# Freeze dependencies
pip freeze > requirements.txt

# Run without reload (production-like)
uvicorn backend.main:app --port 8000

# Run with custom host
uvicorn backend.main:app --host 0.0.0.0 --port 8000

# Check types
mypy backend/

# Format code
black backend/
```

### Frontend

```bash
# Install package
npm install package-name

# Add shadcn component
npx shadcn@latest add [component-name]

# Type check
npm run type-check

# Lint
npm run lint

# Lint and fix
npm run lint -- --fix

# Build for production
npm run build

# Run production build
npm start
```

### Claude Code

```bash
# Backend
cd backend
claude code "implement the orchestrator loop"
claude code "add error handling to tools.py"

# Frontend
cd frontend
claude code "create the EventsPanel component"
claude code "add dark mode support"
```

---

## 🧪 Testing Commands

### Backend Testing

```bash
# Quick health check
curl http://localhost:8000/health

# Test chat endpoint
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": [{"type": "text", "text": "Hello"}]
      }
    ]
  }'

# Pretty print response
curl -s http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":[{"type":"text","text":"test"}]}]}' \
  | python -m json.tool

# Check Ollama
curl http://localhost:11434/api/tags
```

### Frontend Testing

```bash
# Open in browser
open http://localhost:3000

# Check build
npm run build && npm start

# Test specific URL
curl http://localhost:3000
```

---

## 🔧 File Templates

### New Backend Tool

```python
# In backend/orchestrator/tools.py

def tool_my_new_tool(param1: str, param2: int) -> str:
    """Description of what this tool does."""
    try:
        # Implementation
        result = f"Processed {param1} with {param2}"
        return result
    except Exception as e:
        return f"ERROR(tool_my_new_tool): {e}"

# Add to TOOLS registry
TOOLS["my_new_tool"] = lambda **kw: tool_my_new_tool(
    kw.get("param1", ""),
    kw.get("param2", 0)
)
```

### New Backend Agent

```python
# In backend/orchestrator/agents.py

AGENTS["my_agent"] = {
    "system": """You are MyAgent.
    You specialize in [specific task].
    
    Always respond in JSON:
    {
      "thought": "your reasoning",
      "action": "use_tool | delegate | final",
      "tool": "tool_name or null",
      "target_agent": "agent_name or null",
      "args": {},
      "answer": "final answer if action=final"
    }
    
    Available tools: [list tools]
    """
}
```

### New Frontend Component

```typescript
// components/MyComponent.tsx

"use client";

import { cn } from "@/lib/utils";

interface MyComponentProps {
  className?: string;
  // other props
}

export function MyComponent({ className, ...props }: MyComponentProps) {
  return (
    <div className={cn("base-classes", className)}>
      {/* content */}
    </div>
  );
}
```

---

## 🎨 Styling Patterns

### Tailwind Classes

```typescript
// Layout
"flex flex-col h-screen"
"grid grid-cols-2 gap-4"
"container mx-auto px-4"

// Spacing
"p-4"      // padding: 1rem
"px-6"     // padding-left/right: 1.5rem
"mt-2"     // margin-top: 0.5rem
"space-y-4" // gap between children

// Typography
"text-sm font-medium"
"text-lg font-semibold"
"text-muted-foreground"

// Colors
"bg-background"
"text-foreground"
"border-border"
"bg-primary text-primary-foreground"

// Interactive
"hover:bg-accent"
"focus:ring-2 focus:ring-ring"
"cursor-pointer"

// Responsive
"hidden md:block"        // hide on mobile, show on tablet+
"flex-col md:flex-row"   // stack on mobile, row on tablet+
"w-full md:w-80"         // full width on mobile, 320px on tablet+
```

### CSS Variables

```css
/* In globals.css */

:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}
```

---

## 🔌 API Patterns

### Backend Response Format

```python
# Success
return ChatResponse(
    answer="The answer text",
    events=[
        OrchestratorEvent(
            step=1,
            agent="orchestrator",
            action="final",
            tool=None,
            target_agent=None,
            thought="Task completed"
        )
    ]
)

# Error (don't raise, return gracefully)
return ChatResponse(
    answer="I encountered an error. Please try again.",
    events=[]
)
```

### Frontend Fetch Pattern

```typescript
// With error handling
try {
  const response = await fetch(`${BACKEND_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: abortSignal,
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  return data;
} catch (error) {
  console.error("Fetch error:", error);
  throw error;
}
```

---

## 🐛 Debug Helpers

### Backend Logging

```python
# Add to any file
import logging
logger = logging.getLogger(__name__)

# Log levels
logger.debug("Detailed information")
logger.info("General information")
logger.warning("Warning message")
logger.error("Error occurred", exc_info=True)

# In orchestrator
logger.info(f"Step {step}: {agent} -> {action}")
logger.debug(f"Agent response: {json.dumps(result)}")
```

### Frontend Console

```typescript
// Structured logging
console.log("Message:", { messages, events });
console.table(events);  // Nice table format
console.dir(object, { depth: null });  // Full object

// Performance
console.time("operation");
// ... code ...
console.timeEnd("operation");

// Conditional logging
if (process.env.NODE_ENV === "development") {
  console.log("Dev only:", data);
}
```

### Debug Environment Variables

```bash
# Backend (.env)
DEBUG=1
LOG_LEVEL=DEBUG
OLLAMA_URL=http://localhost:11434

# Frontend (.env.local)
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

---

## 📦 Package Management

### Backend Dependencies

```bash
# Core
fastapi>=0.104.0
uvicorn[standard]>=0.24.0
pydantic>=2.0.0
requests>=2.31.0

# Dev
black
mypy
pytest
pytest-asyncio
```

### Frontend Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "@assistant-ui/react": "latest",
    "@assistant-ui/next": "latest",
    "tailwindcss": "^4.0.0",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest"
  },
  "devDependencies": {
    "@types/node": "latest",
    "@types/react": "latest",
    "typescript": "latest",
    "eslint": "latest"
  }
}
```

---

## 🎯 Common Tasks

### Add New MCP Server

```python
# 1. Add to tools.py
TOOLS["mcp_myserver"] = lambda **kw: call_mcp_tool(
    server_url="http://localhost:8003",
    tool_name=kw.get("tool", "default"),
    args=kw.get("args", {}),
)

# 2. Update orchestrator prompt
"""
Available tools:
- mcp_myserver(tool, args) - My custom MCP server
"""
```

### Change Event Display

```typescript
// In EventsPanel.tsx

// Add new field display
{event.custom_field && (
  <div>Custom: {event.custom_field}</div>
)}

// Change badge colors
const actionColors = {
  use_tool: "blue",
  delegate: "purple",
  final: "green",
};
```

### Update Theme Colors

```css
/* globals.css */
:root {
  --primary: 221 83% 53%;      /* New blue */
  --secondary: 210 40% 96.1%;  /* Light gray */
}
```

### Add Loading State

```typescript
// In component
const [isLoading, setIsLoading] = useState(false);

// Use
{isLoading ? (
  <Skeleton className="h-4 w-full" />
) : (
  <div>Content</div>
)}
```

---

## 🔍 Troubleshooting Checklist

### Backend Not Working

```bash
# Check Python version
python --version  # Should be 3.10+

# Check FastAPI installed
pip show fastapi

# Check Ollama running
curl http://localhost:11434/api/tags

# Check port not in use
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Restart with debug
uvicorn backend.main:app --reload --log-level debug
```

### Frontend Not Working

```bash
# Check Node version
node --version  # Should be 18+

# Check dependencies installed
ls node_modules/@assistant-ui

# Clear cache
rm -rf .next node_modules
npm install

# Check backend reachable
curl http://localhost:8000/health

# Check CORS
# Open browser console, look for CORS errors
```

### Events Not Showing

```typescript
// Add debug logging
const lastMsg = messages.filter(m => m.role === "assistant").at(-1);
console.log("Last message:", lastMsg);
console.log("Metadata:", lastMsg?.metadata);
console.log("Events:", lastMsg?.metadata?.events);
```

---

## 📋 Git Workflow

### Commit Messages

```bash
# Format: <type>: <description>

feat: add web search tool
fix: correct event parsing in frontend
docs: update setup instructions
style: format code with black
refactor: simplify orchestrator loop
test: add unit tests for agents
chore: update dependencies
```

### Branch Strategy

```bash
# Create feature branch
git checkout -b feat/web-search-tool

# Work and commit
git add .
git commit -m "feat: implement web search tool"

# Push
git push origin feat/web-search-tool

# Merge to main (after review)
git checkout main
git merge feat/web-search-tool
```

---

## 🔐 Security Notes

### Development vs Production

**Never in production:**
- `--reload` flag
- `allow_origins=["*"]`
- `run_python` tool without sandboxing
- Debug logging with sensitive data

**Always in production:**
- Environment variables for secrets
- HTTPS/TLS
- Rate limiting
- Input validation
- Authentication

---

## 📞 Getting Help

### Check Logs

```bash
# Backend
# Look for ERROR or WARNING in terminal

# Frontend  
# Open browser DevTools > Console
# Check Network tab for failed requests
```

### Search Issues

- Check SPECS.md for implementation details
- Review PROJECT-OVERVIEW.md for architecture
- Search GitHub issues (if applicable)
- Check official documentation

### Ask Claude Code

```bash
claude code "why is my backend returning 500 errors?"
claude code "how do I debug the events panel?"
claude code "explain the orchestrator loop"
```

---

**Pro Tip:** Bookmark this file for quick access during development! 🚀

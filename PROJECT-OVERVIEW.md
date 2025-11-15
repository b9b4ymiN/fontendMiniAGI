# Mini-AGI Full Stack - Project Overview

**Complete guide to the Backend + Frontend architecture**

---

## 🎯 Project Goal

Build a complete AI orchestration system with:
- **Backend:** Python orchestrator using Ollama + agents + tools + MCP
- **Frontend:** Next.js chat UI with agent timeline visualization
- **Communication:** Simple REST API (non-streaming)

---

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                    (Next.js + React)                         │
│                                                              │
│  ┌──────────────┐              ┌─────────────────┐         │
│  │  Chat UI     │              │  Events Panel   │         │
│  │  (Thread)    │              │  (Timeline)     │         │
│  └──────────────┘              └─────────────────┘         │
│         │                              ▲                     │
│         │                              │                     │
│         └──────────────┬───────────────┘                     │
│                        │                                     │
│                  BackendAdapter                              │
│                        │                                     │
└────────────────────────┼─────────────────────────────────────┘
                         │
                    POST /chat
              { messages: [...] }
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│                    (Python + FastAPI)                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Orchestrator Core Loop                   │   │
│  │                                                        │   │
│  │  ┌──────────┐   ┌──────────┐   ┌──────────┐         │   │
│  │  │Orchestr. │   │  Coder   │   │Researcher│         │   │
│  │  │  Agent   │──▶│  Agent   │   │  Agent   │         │   │
│  │  └──────────┘   └──────────┘   └──────────┘         │   │
│  │        │               │               │             │   │
│  │        └───────────────┴───────────────┘             │   │
│  │                        │                              │   │
│  │                   ┌────▼────┐                        │   │
│  │                   │  Tools  │                        │   │
│  │                   └─────────┘                        │   │
│  │                   │         │                        │   │
│  │              ┌────┴─┐   ┌───┴───┐                   │   │
│  │              │Local │   │  MCP  │                   │   │
│  │              │Tools │   │ Tools │                   │   │
│  │              └──────┘   └───────┘                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                          │                                   │
│                     ┌────▼────┐                             │
│                     │ Ollama  │                             │
│                     │LLM API  │                             │
│                     └─────────┘                             │
└─────────────────────────────────────────────────────────────┘

        Returns: { answer: string, events: Event[] }
```

---

## 🔄 Request Flow

### Step-by-Step Execution

1. **User Input**
   - User types message in chat UI
   - Frontend collects message

2. **Frontend → Backend**
   - `BackendAdapter` sends POST to `/chat`
   - Payload: `{ messages: [...] }`

3. **Backend Processing**
   - Extract latest user message
   - Start orchestration loop
   - Current agent: `orchestrator`

4. **Orchestration Loop** (max 10 steps)
   ```
   For each step:
     ├─ Call current agent via LLM (Ollama)
     ├─ Agent returns JSON decision
     │  ├─ action: "use_tool" → Execute tool
     │  ├─ action: "delegate" → Switch to specialist agent  
     │  └─ action: "final" → Stop and return answer
     ├─ Record event
     └─ Update context for next step
   ```

5. **Backend → Frontend**
   - Return: `{ answer, events[] }`
   - Events contain orchestration trace

6. **Frontend Display**
   - Chat shows `answer`
   - Timeline shows `events`

---

## 📂 Project Structure

### Complete Directory Layout

```
mini-agi/
├── .claude/
│   └── instructions.md          # Claude Code config
│
├── backend/
│   ├── main.py                  # FastAPI app
│   ├── orchestrator/
│   │   ├── __init__.py
│   │   ├── llm.py              # Ollama client
│   │   ├── agents.py           # Agent definitions
│   │   ├── tools.py            # Tool registry
│   │   ├── core.py             # Orchestration loop
│   │   └── models.py           # Pydantic models
│   ├── SPECS.md                # Backend specification
│   └── README.md               # Backend setup guide
│
├── frontend/
│   ├── .claude/
│   │   └── instructions.md     # Frontend Claude config
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Tailwind + theme
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatShell.tsx   # Main container
│   │   │   └── EventsPanel.tsx # Timeline
│   │   └── ui/                 # shadcn components
│   ├── lib/
│   │   ├── runtime/
│   │   │   ├── backendAdapter.ts
│   │   │   └── MyRuntimeProvider.tsx
│   │   └── utils.ts
│   ├── FRONTEND-SPECS.md       # Frontend specification
│   └── FRONTEND-README.md      # Frontend setup guide
│
└── PROJECT-OVERVIEW.md         # This file
```

---

## 🔧 Technology Comparison

### Backend Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Runtime | Python 3.10+ | Core language |
| Framework | FastAPI | HTTP API |
| Server | Uvicorn | ASGI server |
| LLM | Ollama | Local AI model |
| Model | gpt-oss-20b | Language model |
| Validation | Pydantic | Data models |
| Tools | Local + MCP | Function execution |

### Frontend Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Runtime | Node.js 18+ | JavaScript runtime |
| Framework | Next.js 14+ | React framework |
| Language | TypeScript | Type safety |
| Chat UI | @assistant-ui/react | Conversation UI |
| Design | shadcn/ui | Component library |
| Styling | Tailwind v4 | CSS framework |
| State | React hooks | Component state |

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
        {
          "type": "text",
          "text": "Your question here"
        }
      ]
    }
  ]
}
```

**Response Format:**
```json
{
  "answer": "AI response text here",
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

---

## 🎭 Agent System

### Agent Hierarchy

```
Orchestrator (Main Coordinator)
├─ Delegates to specialists
├─ Uses tools directly
└─ Makes final decisions

Coder (Code Specialist)
├─ Python, Node.js, Next.js
├─ Trading automation
└─ Code debugging

Researcher (Analysis Specialist)
├─ Information analysis
├─ Data structuring
└─ Summarization
```

### Agent Actions

| Action | Description | Next Step |
|--------|-------------|-----------|
| `use_tool` | Execute a tool | Return to same agent |
| `delegate` | Hand off to specialist | Switch to target agent |
| `final` | Provide final answer | Stop orchestration |

### Agent Decision Protocol

All agents respond in JSON:
```json
{
  "thought": "Reasoning in English",
  "action": "use_tool | delegate | final",
  "tool": "tool_name or null",
  "target_agent": "agent_name or null",
  "args": {},
  "answer": "final answer if action=final"
}
```

---

## 🛠️ Tool System

### Local Tools

| Tool | Function | Use Case |
|------|----------|----------|
| `read_file` | Read file contents | View code/docs |
| `write_file` | Write to file | Save output |
| `run_python` | Execute Python | Test code |

### MCP Tools

| Tool | Server | Use Case |
|------|--------|----------|
| `mcp_filesystem` | Port 8001 | File operations |
| `mcp_trader` | Port 8002 | Trading analysis |

### Tool Invocation Flow

```
Agent Decision
    │
    ├─ action: "use_tool"
    ├─ tool: "read_file"
    └─ args: { path: "..." }
         │
         ▼
    Tool Registry Lookup
         │
         ▼
    Execute Tool Function
         │
         ▼
    Return Result String
         │
         ▼
    Feed Back to Agent
```

---

## 🚀 Setup Instructions

### Prerequisites

**System Requirements:**
- Python 3.10+
- Node.js 18+
- Ollama installed and running

**Install Ollama:**
```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Pull model
ollama pull gpt-oss-20b
```

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install fastapi uvicorn requests pydantic

# 4. Implement files
# Use Claude Code or manual implementation

# 5. Start server
uvicorn backend.main:app --reload --port 8000
```

### Frontend Setup

```bash
# 1. Create Next.js app
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend

# 2. Install dependencies
npm install @assistant-ui/react @assistant-ui/next
npm install class-variance-authority clsx tailwind-merge

# 3. Setup shadcn
npx shadcn@latest init
npx shadcn@latest add card scroll-area badge separator

# 4. Implement files
# Use Claude Code or manual implementation

# 5. Start dev server
npm run dev
```

### Verify Setup

**Test Backend:**
```bash
curl http://localhost:8000/health
# Should return: {"status": "ok"}
```

**Test Frontend:**
```bash
# Open http://localhost:3000
# Should see chat interface
```

**Test Integration:**
```bash
# 1. Ensure both servers running
# 2. Send message in chat UI
# 3. Check for response and events
```

---

## 🔍 Development Workflow

### Daily Development

```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate
uvicorn backend.main:app --reload --port 8000

# Terminal 2: Frontend  
cd frontend
npm run dev

# Terminal 3: Ollama (if not running as service)
ollama serve
```

### Making Changes

**Backend Changes:**
1. Edit Python files in `backend/orchestrator/`
2. Server auto-reloads (if using `--reload`)
3. Test via frontend or curl

**Frontend Changes:**
1. Edit TypeScript files in `frontend/`
2. Hot module replacement updates browser
3. Test in browser

### Using Claude Code

**For Backend:**
```bash
cd backend
claude code "add a new tool for web scraping"
claude code "create a new agent for data analysis"
```

**For Frontend:**
```bash
cd frontend
claude code "add dark mode toggle"
claude code "implement conversation export"
```

---

## 📊 Monitoring & Debugging

### Backend Logs

**Uvicorn logs:**
```
INFO:     127.0.0.1:54321 - "POST /chat HTTP/1.1" 200 OK
```

**Add custom logging:**
```python
# In orchestrator/core.py
import logging
logger = logging.getLogger(__name__)

def orchestrate(user_input: str):
    logger.info(f"Starting orchestration: {user_input}")
    # ...
```

### Frontend Logs

**Browser Console:**
- Network tab: Monitor `/chat` requests
- Console tab: Check for errors
- React DevTools: Inspect component state

**Add debug logging:**
```typescript
// In backendAdapter.ts
console.log('Sending to backend:', messages);
console.log('Received from backend:', data);
```

### Common Debug Points

**Backend:**
- Agent JSON parsing
- Tool execution
- LLM responses
- Event generation

**Frontend:**
- Backend connection
- Message format
- Metadata extraction
- Event rendering

---

## 🎨 Customization Guide

### Add New Agent

**Backend:** `backend/orchestrator/agents.py`
```python
AGENTS["data_analyst"] = {
    "system": """You are DataAnalystAgent.
    You specialize in data analysis and visualization.
    Always respond in JSON: {thought, action, tool, args, answer}.
    """
}
```

**Update orchestrator prompt:**
```python
AGENTS["orchestrator"]["system"] += """
Available agents:
- coder: Code specialist
- researcher: Research specialist  
- data_analyst: Data analysis specialist (NEW)
"""
```

### Add New Tool

**Backend:** `backend/orchestrator/tools.py`
```python
def tool_web_search(query: str) -> str:
    # Implementation
    pass

TOOLS["web_search"] = lambda **kw: tool_web_search(kw.get("query", ""))
```

**Update orchestrator prompt:**
```python
"""
Available tools:
- read_file(path)
- write_file(path, content)
- run_python(code)
- web_search(query) (NEW)
"""
```

### Customize Frontend Theme

**Edit:** `frontend/app/globals.css`
```css
:root {
  --primary: 221 83% 53%;  /* Custom blue */
  --radius: 0.75rem;       /* Larger radius */
}
```

---

## 🧪 Testing Strategy

### Backend Tests

**Unit Tests:**
```python
# tests/test_agents.py
def test_run_agent():
    result = run_agent("orchestrator", "Hello")
    assert "thought" in result
    assert "action" in result
```

**Integration Tests:**
```python
# tests/test_api.py
def test_chat_endpoint():
    response = client.post("/chat", json={
        "messages": [{"role": "user", "content": [{"type": "text", "text": "Hello"}]}]
    })
    assert response.status_code == 200
    assert "answer" in response.json()
```

### Frontend Tests

**Component Tests:**
```typescript
// __tests__/EventsPanel.test.tsx
test('renders events correctly', () => {
  const events = [/* mock events */];
  render(<EventsPanel events={events} />);
  expect(screen.getByText(/Step 1/)).toBeInTheDocument();
});
```

**Integration Tests:**
```typescript
// __tests__/ChatShell.test.tsx
test('sends message and displays response', async () => {
  // Mock backend
  // Send message
  // Assert response appears
});
```

---

## 🚢 Deployment

### Production Checklist

**Backend:**
- [ ] Remove `--reload` flag
- [ ] Set production CORS origins
- [ ] Add authentication
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Use production-grade ASGI server (gunicorn)

**Frontend:**
- [ ] Update `NEXT_PUBLIC_BACKEND_URL`
- [ ] Build optimized bundle (`npm run build`)
- [ ] Enable HTTPS
- [ ] Configure CSP headers
- [ ] Add error tracking
- [ ] Optimize images

**Infrastructure:**
- [ ] Set up reverse proxy (nginx)
- [ ] Configure SSL certificates
- [ ] Set up database (if adding persistence)
- [ ] Configure backups
- [ ] Set up CI/CD pipeline

### Example Production Setup

**Backend (systemd service):**
```ini
[Unit]
Description=Mini-AGI Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/opt/mini-agi/backend
ExecStart=/opt/mini-agi/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend.main:app
Restart=always

[Install]
WantedBy=multi-user.target
```

**Frontend (Next.js):**
```bash
# Build
npm run build

# Start
npm start

# Or use PM2
pm2 start npm --name "mini-agi-frontend" -- start
```

---

## 📈 Future Enhancements

### Potential Features

**Backend:**
- [ ] Streaming responses (SSE)
- [ ] Conversation persistence (database)
- [ ] Multi-user support
- [ ] Agent performance metrics
- [ ] Custom agent creation API
- [ ] Tool marketplace integration

**Frontend:**
- [ ] Real-time event streaming
- [ ] Conversation history
- [ ] Export conversations
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Voice input/output

**Integration:**
- [ ] WebSocket for real-time updates
- [ ] GraphQL API
- [ ] Webhook integrations
- [ ] Third-party LLM support
- [ ] Cloud deployment templates

---

## 🤝 Contributing

### Code Style

**Backend (Python):**
- PEP 8 compliance
- Type hints required
- Docstrings for functions

**Frontend (TypeScript):**
- ESLint rules enforced
- Prettier for formatting
- Strict TypeScript mode

### Pull Request Process

1. Fork the repository
2. Create feature branch
3. Implement changes with tests
4. Update documentation
5. Submit PR with description

---

## 📚 Resources

### Official Documentation

- **Next.js:** https://nextjs.org/docs
- **FastAPI:** https://fastapi.tiangolo.com
- **Ollama:** https://ollama.com/docs
- **@assistant-ui:** https://github.com/assistant-ui/assistant-ui
- **shadcn/ui:** https://ui.shadcn.com
- **Tailwind CSS:** https://tailwindcss.com

### Community

- **Discussions:** GitHub Discussions (if applicable)
- **Issues:** GitHub Issues
- **Discord:** (link if available)

---

**Built with ❤️ using Claude Code**

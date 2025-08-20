# GenUI: AI-Powered Dynamic UI Generation

GenUI enables AI models to dynamically compose React interfaces by understanding natural language, selecting tools, and
streaming composed UIs in real-time.

## Architecture

```mermaid
flowchart LR
    subgraph YourApp["Your App - React/Next.js"]
        UI["React Components<br/>AlbumCard, AlbumGrid..."]
        Tools["Tools - server funcs<br/>getCurrentWeekAlbum, listBacklog..."]
        AISDK["AI Runtime / SDK<br/>Vercel AI SDK"]
    end

    subgraph Provider["LLM Provider"]
        LLM["LLM API<br/>OpenAI, Anthropic..."]
    end

    API[("DataSource")]
    User -->|natural language| AISDK
    AISDK <-->|API calls| LLM
    AISDK <-->|tool calls| Tools
    Tools -.->|optional| API
    Tools --> UI
```

**Ownership:**
• You: components, tools, SDK config, system prompt
• AI SDK: tool orchestration, streaming
• LLM: intent parsing, tool selection, UI composition

## Request Flow

```mermaid
sequenceDiagram
    participant U as User
    participant SDK as AI SDK
    participant L as LLM
    participant T as Tools
    participant D as Data
    
    U ->> SDK: "Show this week's album"
    SDK ->> L: user message + system prompt + tools
    L ->> T: getCurrentWeekAlbum()
    T ->> D: read data files
    D -->> T: album + rating data
    T -->> L: complete data
    L -->> SDK: <AlbumCard with data />
    SDK -->> U: Rendered UI component
```

## Mental Model

**Core Roles:**
- **Runtime:** Orchestrates the conversation and streams UI
- **Tools:** Fetch and return data (not UI)
- **Components:** Render UI with the data
- **LLM:** Decides which tools to call and which components to render

**Key Principle:** Tools return data. LLM composes UI.

## Implementation

**Tools:** Return data objects, handle errors
**Components:** Pure rendering with props
**Data:** JSON files or APIs

## Basic Guidelines

• Use schemas for tool inputs/outputs
• Keep components simple and reusable
• Let the LLM handle UI composition

## Tech Talk Notes

**Value Prop:** Build blocks (components + tools), not screens. Natural language → composed UI.

**Demo:** "What's this week's album?" → tool selection → data fetch → UI composition → result
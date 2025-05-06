# Vibestation Architecture Overview

Vibestation is a desktop application designed for AI chat and MCP (Machine Control Protocol) tool integration, similar to Claude Desktop. Here's a summary of its architecture based on the project structure and documentation:

## Technology Stack
* __Electron__: Provides the desktop application shell.
* __React (with TypeScript)__: Handles the UI, using Tailwind CSS for styling.
* __AI SDK__: Integrates with AI models (Anthropic, OpenAI).
* __MCP Client__: Connects to MCP servers/tools.

## Project Structure
```
vibestation/
├── config/                 # Configuration files (AI providers, MCP servers)
├── src/                    # Source code
│   ├── main/               # Electron main process (app lifecycle, IPC)
│   ├── preload/            # Preload scripts for secure context bridging
│   ├── renderer/           # React UI (App.tsx, entry points, styles)
│   ├── components/         # React components (UI building blocks)
│   ├── contexts/           # React contexts (state management)
│   ├── services/           # Core services (AI, MCP, storage)
│   └── utils/              # Utility functions
├── assets/                 # Application assets (images, icons, etc.)
└── scripts/                # Build and utility scripts
```

## Key Architectural Components

* __Electron Main Process (src/main/)__
  Manages the application lifecycle, window creation, and IPC (inter-process communication) with the renderer.
* __Preload Scripts (src/preload/)__
  Securely exposes APIs from the main process to the renderer.
* __Renderer Process (src/renderer/)__
* __The React-based UI__, where users interact with AI models and MCP tools.
  Uses Tailwind CSS for styling.
* __Services (src/services/)__
  Handles integration with AI providers and MCP servers.
  Manages storage and possibly other backend-like logic.
* __Contexts (src/contexts/)__
  Provides global state management for things like user sessions, chat history, and configuration.
* __Configuration (config/)__
  JSON files for AI provider and MCP server settings, allowing easy customization and extension.

## Configuration & Extensibility
* __AI Providers:__ Configured in `config/ai.config.json` (enables/disables providers, sets default models).
* __MCP Servers:__ Configured in `config/mcp.config.json` (supports local and remote servers, auto-start options).

## Development & Build
* __Development:__ Run with `npm start` for live reloading.
* __Production Build:__ Use `npm run make` to generate installers for different platforms.

## Summary:
Vibestation is a modular, Electron-based desktop app with a React frontend, supporting pluggable AI and MCP integrations. Its architecture separates concerns cleanly between the main process (__Electron__), renderer (__React UI__), and service layers (__AI/MCP/storage__), with configuration-driven extensibility.


```
+-------------------------------------------------------------+
|                        Vibestation App                      |
|                                                             |
|  +-------------------+       +--------------------------+   |
|  | Electron Main     |<----->|  Preload Scripts         |   |
|  | Process           |       |  (Secure API Bridge)     |   |
|  +-------------------+       +--------------------------+   |
|            |                                   |             |
|            v                                   v             |
|  +-------------------------------------------------------+   |
|  |                Renderer (React UI)                    |   |
|  |  +-------------------+   +------------------------+   |   |
|  |  | Contexts          |   | Components             |   |   |
|  |  +-------------------+   +------------------------+   |   |
|  |  | Services (via IPC):   | - Chat UI              |   |   |
|  |  | - AI Client       |   | - MCP Tool Panels      |   |   |
|  |  | - MCP Client      |   | - History, Settings    |   |   |
|  |  | - Storage         |   +------------------------+   |   |
|  +-------------------------------------------------------+   |
|            |                                   |             |
|            v                                   v             |
|  +-------------------+       +--------------------------+    |
|  | AI Providers      |       | MCP Servers/Tools        |    |
|  | (Anthropic,       |       | (Local/Remote,           |    |
|  |  OpenAI, etc.)    |       |  Stdio/SSE)              |    |
|  +-------------------+       +--------------------------+    |
+-------------------------------------------------------------+

```
Config files:
* - config/ai.config.json      (AI provider settings)
  - `config/mcp.config.jso`n     (MCP server/tool settings)
  - `config/mcp.config.json`     (MCP server/tool settings)
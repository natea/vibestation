# Vibestation

Vibestation is an AI and MCP client for desktop, similar to Claude Desktop. It allows you to chat with AI models and use MCP tools.

## Features

- Chat with AI models (Claude, OpenAI)
- Load and use MCP servers and tools
- Save and load chat history
- Display HTML artifacts in a sandbox environment

## Technology Stack

- Electron: Desktop application framework
- React: UI library
- TypeScript: Programming language
- Tailwind CSS: Styling
- AI SDK: AI model integration
- MCP Client: MCP server integration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vibestation.git
cd vibestation
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your API keys:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### Development

Start the development server:
```bash
npm start
```

### Building

Build the application for production:
```bash
npm run make
```

This will create platform-specific installers in the `out` directory.

## Configuration

### AI Providers

Configure AI providers in `config/ai.config.json`:
```json
{
  "providers": {
    "anthropic": {
      "enabled": true,
      "models": [...]
    },
    "openai": {
      "enabled": true,
      "models": [...]
    }
  },
  "defaultProvider": "anthropic",
  "defaultModel": "claude-3-sonnet-20240229"
}
```

### MCP Servers

Configure MCP servers in `config/mcp.config.json`:
```json
{
  "servers": [
    {
      "name": "local-tools",
      "type": "stdio",
      "command": "node ./mcp-servers/local-tools/index.js",
      "enabled": true,
      "autoStart": true
    },
    {
      "name": "remote-server",
      "type": "sse",
      "url": "https://example.com/sse",
      "apiKey": "${API_KEY_ENV_VAR}",
      "enabled": true,
      "autoStart": false
    }
  ],
  "defaultServer": "local-tools"
}
```

## Project Structure

```
vibestation/
├── config/                 # Configuration files
├── src/                    # Source code
│   ├── main/               # Electron main process
│   ├── preload/            # Preload scripts
│   ├── renderer/           # React UI
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── services/           # Core services
│   └── utils/              # Utility functions
├── assets/                 # Application assets
└── scripts/                # Build and utility scripts
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

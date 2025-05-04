const { MCPServer } = require('mcp-server');

// Create a new MCP server
const server = new MCPServer({
  name: 'local-tools',
  description: 'Local tools for testing',
});

// Register tools
server.registerTool({
  name: 'echo',
  description: 'Echo back the input',
  inputSchema: {
    type: 'object',
    properties: {
      text: {
        type: 'string',
        description: 'Text to echo back',
      },
    },
    required: ['text'],
  },
  execute: async (args) => {
    return {
      result: args.text,
    };
  },
});

server.registerTool({
  name: 'add',
  description: 'Add two numbers',
  inputSchema: {
    type: 'object',
    properties: {
      a: {
        type: 'number',
        description: 'First number',
      },
      b: {
        type: 'number',
        description: 'Second number',
      },
    },
    required: ['a', 'b'],
  },
  execute: async (args) => {
    return {
      result: args.a + args.b,
    };
  },
});

server.registerTool({
  name: 'weather',
  description: 'Get weather information for a location',
  inputSchema: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'Location to get weather for',
      },
    },
    required: ['location'],
  },
  execute: async (args) => {
    // This is a mock implementation
    const locations = {
      'new york': { temperature: 72, condition: 'Sunny', humidity: 45 },
      'london': { temperature: 62, condition: 'Cloudy', humidity: 80 },
      'tokyo': { temperature: 78, condition: 'Rainy', humidity: 90 },
      'sydney': { temperature: 85, condition: 'Clear', humidity: 50 },
    };
    
    const location = args.location.toLowerCase();
    
    if (locations[location]) {
      return {
        result: locations[location],
      };
    } else {
      return {
        error: `Weather information not available for ${args.location}`,
      };
    }
  },
});

// Register resources
server.registerResource({
  uri: 'info://server-info',
  description: 'Information about the server',
  accessSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
  access: async () => {
    return {
      name: server.name,
      description: server.description,
      tools: server.getTools().map(tool => tool.name),
      resources: server.getResources().map(resource => resource.uri),
    };
  },
});

// Start the server
server.start();

console.log('Local MCP server started');
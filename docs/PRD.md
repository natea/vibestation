# Product Requirements

We want to build an AI and MCP client that is like Claude Desktop. We will install the MCP client on a local computer. The MCP client will have a window where we can chat with an AI model. It will load MCP servers and tools. The chat will call MCP tools.

The name of the application is Vibestation.

Later, we will extend this application to add UI, prompts, and tools for specific human roles. We are inspired by the success of Cursor and Windsurf, and their promise to make you a more effective programmer. AI \+ MCP workstations  will make you a better trader, lawyer, doctor, storyteller. Our first customized application will be a “Vibe Trader” for crypto traders.

The difficult technical problem is controlling the context so that the AI has a small set of useful tools and prompts for the current task. We will work down from a general purpose AI+MCP client, to role based packages, to specific tasks.

The product will be similar to successful MCP clients like  [Claude Desktop](https://claude.ai/download), Roo Code, [Cursor,](https://www.cursor.com/) [VScode](https://code.visualstudio.com/), and [Windsurf](https://windsurf.com/editor). The [Vercel AI chatbot](https://vercel.com/templates/next.js/nextjs-ai-chatbot) is an inspiration. Open source competitors include [Flujo](https://github.com/mario-andreschak/FLUJO/) and [Agent Tars](https://vercel.com/templates/next.js/nextjs-ai-chatbot).

Successful MCP clients such as Cursor, Windsurf, and Claude Destop use Electron, Nodejs, and typescript. This gives them installers that work on Mac, Windows, and Linux.

# Specification

## Technology Stack

Write code in javascript and Typescript.

I think that we want to use libraries from Electron, node.js, React, AI-SDK, and mcp-client.

We want to use node packages and open source libraries where they are available. This will allow us to build an application that has less custom code, and is easier to modify. 

### Electron: [https://www.electronjs.org/docs/latest/](https://www.electronjs.org/docs/latest/) 

Electron is an installer and a user interface framework that is used in successful MCP clients like Claude Desktop, Cursor, Windsurf. It uses typescript.

### React: [https://react.dev/](https://react.dev/) 

We can use React to write a typescript UI for an Electron application.

### AI-SDK: [https://sdk.vercel.ai/docs/introduction](https://sdk.vercel.ai/docs/introduction) 

AI SDK from Vercel gives us npm packages that connect to multiple AI models. They are called “providers”. It gives us ways to connect, to chat, and to parse and run MCP tool calls. We will use it to make an application that works with Anthropic Claude, OpenAI, and other models.

### Mcp-client: [https://www.npmjs.com/package/mcp-client](https://www.npmjs.com/package/mcp-client) 

Mcp-client is a node package that makes it easy to connect to MCP servers, and call tools.

## Installation

The MCP client will run locally. The user will customize the MCP client with tools. We will deploy the first version by pulling and building a github repository.

## User Interface

The user interface should be similar to Claude Desktop. 

* It should have a main chat window.   
* It will have an optional left column to select chats from a history. It should remember previous chats locally, and have a “new chat” option.   
* It should have an optional artifact window on the right. The artifact window can show HTML that it gets from the AI. The artifact window will use a “sandbox” tag. The artifact window can also show debugging information and the debugging console

We will use the Electron user interface framework. Electron is a node and typescript framework that provides an installer and a typescript user interface.

We want to use React for the user interface controls.

I suggest that we use Tailwind CSS to get useful styles.

## AI models

We should be able to connect to AI models from Anthropic Claude, and from OpenAI. We will add more models later. We need a configuration file where we can set the connection parameters for each model connection. We will start by testing it with Claude Sonnet 3.7 to see if it behaves like Claude Desktop, and calls tools. Then, we will add connections and parsing for OpenAI and other models.

Use code from [AI SDK](https://sdk.vercel.ai/docs/foundations/providers-and-models) : [https://www.npmjs.com/package/ai](https://www.npmjs.com/package/ai) 

It includes a connection provider for Anthropic: [https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic](https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic)  
It includes a connection provider for OpenAI: [https://sdk.vercel.ai/providers/ai-sdk-providers/openai](https://sdk.vercel.ai/providers/ai-sdk-providers/openai) 

## AI chat loop

Implement an AI chat using the chat window in our app, and the AI SDK UI chatbot: [https://sdk.vercel.ai/docs/ai-sdk-ui/overview](https://sdk.vercel.ai/docs/ai-sdk-ui/overview)

We want an AI chat loop that accepts input from the chat window, sends it to the selected model, and shows the results.

Add a config file to hold parameters for the AI-SDK provider. Test it with Anthropic Claude. We know that Claude can call tools.

We want our chat to implement MCP tool calls. We can get tools calls from AI SDK by following the instructions for implementing a chatbot: [https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot](https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot) . This will implement tools calls described here: [https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot-tool-usage](https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot-tool-usage) 

 If the AI model returns a tool call, the chat loop will

* Call the AI with the chat input and chat context  
* Find tool calls in the response  
* call the tools  
* append the results to the chat context  
* Call the AI again

Try the same thing with an OpenAI model.

## MCP client

Use mcp-client to load and start mcp servers, and to call mcp tools. [https://www.npmjs.com/package/mcp-client](https://www.npmjs.com/package/mcp-client) 

Write a preload script that loads MCP servers from an mcp.config.json file. It should start local STDIO servers. It should make a list of local STDIO, and remote SSE servers. It should load tools into a data structure.

Provide the list of tools to the AI chat application in a form that AI SDK will understand.

Extra task \- Test with local servers plus a set of C[omposio servers](https://gist.github.com/natea/0100d376da078e0602ab7ff5a707efba)

## Extra task: Local storage

We will want local storage for three reasons:

* Chat history  
* Logs. We want to log all of the AI and tool calls and responses for local debugging, and for global analysis and improvement. We also need logs of blockchain transactions for the crypto trader  
* Tools, agents, and prompts. We will learn to control the set of tools, agents, and prompts that we present to the tool-using AI. We will search for relevant resources. We want to try it with local db, vector, and RAG search.

Should we look at a lightweight package that provides some Postgres features, such as [pglite](https://pglite.dev/)? Or, just use normal files?

## Licensing

Use components that have open source licenses like the MIT license or the Apache license.

# Suggested Work Plan

Here is a suggested work plan.

1) Set up a project with Electron, Nodejs, React, and tailwindcss. This article has instructions. However, the instructions are old. To install Electron, use the npx call from the bottom of the article. To install Tailwindcss, use the new instructions for installing Tailwindcss with Node.js [https://medium.com/@mosaif.ali.39/electron-react-typescript-tailwind-css-awesomeness-9256fae116b1](https://medium.com/@mosaif.ali.39/electron-react-typescript-tailwind-css-awesomeness-9256fae116b1)  
2) Add the windows. It will look like Claude Desktop. We get a top menu from electron. Implement a center column with a control where we enter a chat input. There is an optional column on the right for HTML artifacts. Electron sometimes uses this area for console logs.  There is an optional column on the left for chat history.  
3) Install the packages for Vercel’s AI SDK: [https://sdk.vercel.ai/docs/introduction](https://sdk.vercel.ai/docs/introduction) . This uses zod and dotenv. Use the instructions for NodeJS: [https://sdk.vercel.ai/docs/getting-started/nodejs](https://sdk.vercel.ai/docs/getting-started/nodejs) . Add the provider for anthropic.  
4) Install the [mcp-client](https://www.npmjs.com/package/mcp-client/v/1.8.0) package  
5) Add a preload script to connect to an AI API. Use AI SDK  Make an ai.config.json file to hold the configuration information for an anthropic provider and an openAI provider. Add a preload script to connect to AI APIs that are specified in the file. Log errors to the console.   
6) Add the AI chat. Use these instructions from AI SDK UI to add a chat control to the main UI window. [https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot](https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot)  
7) Add a preload script to load MCP servers. Create an mcp.config.json to hold the MCP server configurations. Use the mcp-client package to start the servers. Make a data structure to hold tools. Provide tools in a format that works with AI SDK  
8) Improve the chat to call tools. AI SDK chat should do a lot of it. Here is their detailed discussion: [https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling)   
9) Add a right column to show HTML artifacts. The right column is hidden by default. Ask Claude for an HTML landing page, parse it from the reply, and show it in the right artifact window.  
10) Improve the chat to save chat history, show a list of chats in a left column, and implement a “new chat”


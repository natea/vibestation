import React, { useState, useEffect } from 'react';
import { AIProvider } from '../contexts/AIContext';
import { MCPProvider } from '../contexts/MCPContext';
import { ChatProvider, useChat } from '../contexts/ChatContext';
import { useAI } from '../contexts/AIContext';

// Chat component that uses the contexts
const ChatComponent: React.FC = () => {
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [artifact, setArtifact] = useState<string | null>(null);
  
  // Use the chat context
  const {
    chats,
    currentChat,
    createChat,
    addMessage
  } = useChat();
  
  // Use the AI context
  const {
    sendMessage,
    loading
  } = useAI();

  // Create a new chat if none exists
  useEffect(() => {
    if (chats.length === 0) {
      createChat('New Chat');
    }
  }, [chats, createChat]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !currentChat) return;

    // Add user message to chat
    await addMessage({
      role: 'user',
      content: inputValue
    });
    
    // Clear input
    setInputValue('');
    
    try {
      // Send message to AI
      const response = await sendMessage(inputValue);
      
      // Add AI response to chat
      await addMessage({
        role: 'assistant',
        content: response
      });
      
      // Check for HTML content in response
      const htmlMatch = response.match(/<html[\s\S]*?<\/html>/i);
      if (htmlMatch) {
        setArtifact(htmlMatch[0]);
        setShowRightSidebar(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="app-container">
      {/* Left Sidebar - Chat History */}
      {showLeftSidebar && (
        <div className="sidebar">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold">Chat History</h2>
            <button
              className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg w-full"
              onClick={() => createChat('New Chat')}
            >
              New Chat
            </button>
          </div>
          <div className="p-4">
            {chats.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No previous chats</p>
            ) : (
              <ul className="space-y-2">
                {chats.map(chat => (
                  <li
                    key={chat.id}
                    className={`p-2 rounded-lg cursor-pointer ${currentChat?.id === chat.id ? 'bg-primary-100 dark:bg-primary-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    onClick={() => currentChat?.id !== chat.id && createChat(chat.title)}
                  >
                    {chat.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="main-content">
        <div className="chat-container">
          {/* Message List */}
          <div className="message-list">
            {!currentChat || currentChat.messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-2">Welcome to Vibestation</h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    Start a conversation with AI and use MCP tools
                  </p>
                </div>
              </div>
            ) : (
              currentChat.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={msg.role === 'user' ? 'text-right text-blue-700' : 'text-left text-gray-800'}
                >
                  <div className="inline-block px-4 py-2 rounded-lg bg-gray-100 my-2">
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="message ai-message">
                <div className="animate-pulse">Thinking...</div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="input-area">
            <form onSubmit={handleSubmit}>
              <div className="flex">
                <input
                  type="text"
                  className="input-box"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="ml-2 px-4 py-2 bg-primary-500 text-white rounded-lg"
                  disabled={!inputValue.trim() || loading}
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Artifact Window */}
      {showRightSidebar && (
        <div className="artifact-container">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold">Artifacts</h2>
          </div>
          <div className="p-4">
            {artifact ? (
              <div
                className="sandbox"
                dangerouslySetInnerHTML={{ __html: artifact }}
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No artifacts to display</p>
            )}
          </div>
        </div>
      )}

      {/* Toggle Buttons */}
      <div className="fixed bottom-4 right-4 flex space-x-2">
        <button
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
          onClick={() => setShowLeftSidebar(!showLeftSidebar)}
          title={showLeftSidebar ? "Hide chat history" : "Show chat history"}
        >
          {showLeftSidebar ? "←" : "→"}
        </button>
        <button
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
          onClick={() => setShowRightSidebar(!showRightSidebar)}
          title={showRightSidebar ? "Hide artifacts" : "Show artifacts"}
        >
          {showRightSidebar ? "→" : "←"}
        </button>
      </div>
    </div>
  );
};

// Main App component with providers
const App: React.FC = () => {
  return (
    <AIProvider>
      <MCPProvider>
        <ChatProvider>
          <ChatComponent />
        </ChatProvider>
      </MCPProvider>
    </AIProvider>
  );
};

export default App;
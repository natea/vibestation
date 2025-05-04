#!/bin/bash

# Vibestation setup script

echo "Setting up Vibestation..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Install MCP server dependencies
echo "Installing MCP server dependencies..."
cd mcp-servers/local-tools
npm install
cd ../..

# Start the application
echo "Starting Vibestation..."
npm start
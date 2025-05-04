@echo off
REM Vibestation setup script for Windows

echo Setting up Vibestation...

REM Install dependencies
echo Installing dependencies...
call npm install

REM Install MCP server dependencies
echo Installing MCP server dependencies...
cd mcp-servers\local-tools
call npm install
cd ..\..

REM Start the application
echo Starting Vibestation...
call npm start
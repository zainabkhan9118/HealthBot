import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, RefreshCw } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi there! I\'m MIND, your mental wellness companion. How are you feeling today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I hear you. Would you like to tell me more about what\'s on your mind?'
      }]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#E6E6FA]/30 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm p-6 border-b border-[#E6E6FA] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-[#9B7EDC]" />
            <h1 className="text-xl font-semibold text-[#8B6AD1]">Chat with MIND</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#9B7EDC] hover:bg-[#E6E6FA]/50"
            onClick={() => setMessages([messages[0]])}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 ${
                message.role === 'user' ? 'justify-end' : ''
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[#9B7EDC]/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-[#9B7EDC]" />
                </div>
              )}
              <Card className={`${
                message.role === 'user'
                  ? 'bg-[#9B7EDC] text-white'
                  : 'border border-[#E6E6FA] bg-white'
              } max-w-[80%]`}>
                <CardContent className="p-3">
                  <p className={message.role === 'user' ? 'text-white' : 'text-[#9B7EDC]'}>
                    {message.content}
                  </p>
                </CardContent>
              </Card>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-[#9B7EDC] flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#9B7EDC]/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-[#9B7EDC]" />
              </div>
              <Card className="border border-[#E6E6FA] bg-white">
                <CardContent className="p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-[#9B7EDC] animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-[#9B7EDC] animate-bounce delay-100" />
                    <div className="w-2 h-2 rounded-full bg-[#9B7EDC] animate-bounce delay-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Chat Input */}
      <div className="border-t border-[#E6E6FA] bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-4">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border-[#E6E6FA] focus:ring-[#9B7EDC] focus:border-[#9B7EDC]"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-[#9B7EDC] hover:bg-[#8B6AD1] text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-[#9B7EDC]/60 mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
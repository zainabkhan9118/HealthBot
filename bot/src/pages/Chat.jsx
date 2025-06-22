import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, RefreshCw, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi there! I\'m MIND, your mental wellness companion. How are you feeling today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sentiment, setSentiment] = useState(null);
  const [sources, setSources] = useState([]);

  // Connect to Flask backend with Ollama integration
  const sendMessageToBackend = async (userMessage) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Store sentiment and sources for UI display
      if (data.sentiment) {
        setSentiment(data.sentiment);
      }
      
      if (data.sources && Array.isArray(data.sources)) {
        setSources(data.sources);
      }
      
      return data.response || 'Sorry, I couldn\'t process your request.';
    } catch (error) {
      console.error('Error connecting to the server:', error);
      return 'Sorry, there was an error connecting to the server. Make sure the backend is running.';
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsLoading(true);
    setSentiment(null);
    setSources([]);

    try {
      const reply = await sendMessageToBackend(input);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error connecting to the server. Please make sure the backend is running.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // const getSentimentColor = (sentiment) => {
  //   if (!sentiment) return 'bg-gray-200';
    
  //   const sentimentValue = sentiment.sentiment?.toLowerCase();
    
  //   if (sentimentValue?.includes('very negative')) return 'bg-red-500 text-white';
  //   if (sentimentValue?.includes('negative')) return 'bg-orange-500 text-white';
  //   if (sentimentValue?.includes('neutral')) return 'bg-blue-200';
  //   if (sentimentValue?.includes('positive')) return 'bg-green-400';
  //   if (sentimentValue?.includes('very positive')) return 'bg-green-600 text-white';
    
  //   return 'bg-gray-200';
  // };

  return (    
  <div className="flex flex-col h-screen bg-gradient-to-br from-[#E6E6FA]/30 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm p-6 border-b border-[#E6E6FA] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-[#9B7EDC]" />
            <h1 className="text-xl font-semibold text-[#8B6AD1]">Chat with MIND</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#9B7EDC] hover:bg-[#E6E6FA]/50"
            onClick={() => {
              setMessages([messages[0]]);
              setSentiment(null);
              setSources([]);
            }}
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
              )}              <Card className={`${
                message.role === 'user'
                  ? 'bg-[#9B7EDC] text-white'
                  : 'border border-[#E6E6FA] bg-white'
              } max-w-[80%]`}>
                <CardContent className="p-3">
                  <p className={message.role === 'user' ? 'text-white' : 'text-[#9B7EDC]'}>
                    {message.content}
                  </p>
                  
                  {/* Display sentiment and sources only for the last assistant message */}
                  {/* Sentiment display commented out
                  {message.role === 'assistant' && index === messages.length - 1 && sentiment && (
                    <div className="mt-3 pt-2 border-t border-[#E6E6FA] text-sm">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-gray-500 text-xs">Sentiment:</span>
                        <Badge className={`${getSentimentColor(sentiment)}`}>
                          {sentiment.sentiment || 'Unknown'}
                        </Badge>
                        
                        {sentiment.emotions && sentiment.emotions.length > 0 && (
                          <div className="flex flex-wrap gap-1 ml-1">
                            {sentiment.emotions.map((emotion, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {emotion}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  */}
                  
                  {/* {message.role === 'assistant' && index === messages.length - 1 && sources && sources.length > 0 && (
                    <div className="mt-2">
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center text-xs text-gray-500 mb-1 cursor-help">
                            <Info className="h-3 w-3 mr-1" />
                            <span>Sources:</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Resources used to generate this response</TooltipContent>
                      </Tooltip>
                      <ul className="list-disc pl-4 text-xs text-gray-600">
                        {sources.map((source, i) => (
                          <li key={i}>{source}</li>
                        ))}
                      </ul>
                    </div>
                  )} */}
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
      <div className="border-t border-[#E6E6FA] bg-white p-4 text-black">
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
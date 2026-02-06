/// <reference types="vite/client" />
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2, Key } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m LifeLink AI Assistant. I can help you find blood donors, volunteer opportunities, or answer questions about donations. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, showKeyInput]);

  // Check for API key in env or local storage on mount
  useEffect(() => {
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    const storedKey = localStorage.getItem('gemini_api_key');

    if (envKey) {
      setApiKey(envKey);
    } else if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const quickReplies = [
    'Find blood donors near me',
    'Show urgent causes',
    'Upcoming events',
    'How does blood donation work?'
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // UI update for user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      if (!apiKey) {
        setShowKeyInput(true);
        setMessages((prev) => [...prev, {
          id: Date.now().toString() + '-sys',
          text: 'To provide smart responses, I need a Google Gemini API Key. Please enter it below.',
          sender: 'ai',
          timestamp: new Date()
        }]);
        setIsLoading(false);
        return;
      }

      const generativeAI = new GoogleGenerativeAI(apiKey);
      const model = generativeAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

      const systemContext = `You are LifeLink AI, a helpful assistant for a social impact platform called LifeLink+. 
       The platform features: Blood Donation, Financial Donations (NGOs), Disaster Relief, and Volunteer Events.
       Your goal is to be helpful, empathetic, and encourage social good.
       Be concise.
       User Question: "${text}"`;

      const result = await model.generateContent(systemContext);
      const response = await result.response;
      const responseText = response.text();

      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date()
      }]);

    } catch (error: any) {
      console.error("AI Error:", error);
      const errorMessage = error?.message || error?.toString() || 'Unknown error';

      // Handle invalid key specifically
      if (errorMessage.includes('400') || errorMessage.includes('API key') || errorMessage.includes('403')) {
        setApiKey('');
        localStorage.removeItem('gemini_api_key');
        setShowKeyInput(true);
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: `Authentication Error: ${errorMessage}. Please check your API Key.`,
          sender: 'ai',
          timestamp: new Date()
        }]);
      } else {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: `Connection Error: ${errorMessage}. Please check your internet connection.`,
          sender: 'ai',
          timestamp: new Date()
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeySubmit = (key: string) => {
    if (key.trim()) {
      setApiKey(key);
      localStorage.setItem('gemini_api_key', key);
      setShowKeyInput(false);

      // Add success message
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        text: 'API Key saved! You can now chat with me.',
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleSendClick = () => handleSendMessage(inputValue);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50 group"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
        </div>
      </button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col overflow-hidden border-2 border-red-200 animate-in slide-in-from-bottom-10 fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-yellow-200" />
          </div>
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              LifeLink Assistant
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white/90">Beta</span>
            </h3>
            <p className="text-xs text-white/90">Powered by Gemini AI</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0 p-4 bg-gray-50/50" ref={scrollAreaRef}>
        <div className="space-y-4 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              {message.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center mr-2 shadow-sm border border-red-100 mt-1">
                  <Sparkles className="w-4 h-4 text-red-500" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${message.sender === 'user'
                  ? 'bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-tr-none'
                  : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                  }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center mr-2">
                <Sparkles className="w-4 h-4 text-red-500" />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                <span className="text-xs text-gray-500">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Replies or Key Input */}
      {showKeyInput ? (
        <div className="p-4 bg-red-50/50 border-t border-red-100">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Key className="absolute left-3 top-2.5 h-4 w-4 text-red-400" />
              <Input
                type="password"
                placeholder="Paste Gemini API Key here"
                className="pl-9 border-red-200 focus-visible:ring-red-400 bg-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleKeySubmit((e.currentTarget as HTMLInputElement).value);
                  }
                }}
              />
            </div>
            <Button
              onClick={() => {
                const input = document.querySelector('input[type="password"]') as HTMLInputElement;
                if (input) handleKeySubmit(input.value);
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Save
            </Button>
          </div>
          <p className="text-[10px] text-red-500 mt-2 text-center">
            Your key is stored locally in your browser and never sent to our servers.
          </p>
        </div>
      ) : (
        <>
          {messages.length <= 2 && (
            <div className="px-4 py-2 bg-white/50 backdrop-blur-sm border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <Button
                    key={reply}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors bg-white"
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendClick()}
                placeholder="Type your message..."
                className="flex-1 border-gray-200 focus-visible:ring-red-400 bg-gray-50 focus:bg-white transition-colors"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendClick}
                disabled={isLoading || !inputValue.trim()}
                className="bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-md hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

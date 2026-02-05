"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  User,
  Send,
  Sparkles,
  Loader2,
  MessageSquare,
  X,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AgentChatProps {
  agentName?: string;
  initialMessage?: string;
  className?: string;
}

export default function AgentChat({
  agentName = "NovaClaw Agent",
  initialMessage = "Hello! I'm your NovaClaw AI assistant. I can help you understand our autonomous marketing system. What would you like to know?",
  className,
}: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content: initialMessage,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Floating Chat Button
  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50",
          "w-16 h-16 rounded-full",
          "bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta",
          "flex items-center justify-center",
          "shadow-lg shadow-neon-purple/30",
          "animate-pulse-neon",
          className
        )}
      >
        <MessageSquare className="w-7 h-7 text-white" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        height: isMinimized ? "auto" : "500px",
      }}
      exit={{ opacity: 0, y: 100, scale: 0.8 }}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "w-[380px] glass-dark rounded-2xl overflow-hidden",
        "flex flex-col",
        "shadow-xl shadow-black/50",
        "border border-white/10",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-neon-green rounded-full border-2 border-gray-900" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{agentName}</h3>
            <p className="text-xs text-white/50">Always online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-white/60" />
            ) : (
              <Minimize2 className="w-4 h-4 text-white/60" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      message.role === "user"
                        ? "bg-neon-purple/30"
                        : "bg-neon-cyan/30"
                    )}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-neon-purple" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-neon-cyan" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-3",
                      message.role === "user"
                        ? "bg-neon-purple/20 rounded-tr-sm"
                        : "bg-white/5 rounded-tl-sm"
                    )}
                  >
                    <p className="text-sm text-white/90 leading-relaxed">
                      {message.content}
                    </p>
                    <span className="text-[10px] text-white/30 mt-1 block">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-neon-cyan/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-neon-cyan" />
                </div>
                <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" />
                    <span
                      className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <span
                      className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-white/10 bg-white/5"
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className={cn(
                  "flex-1 px-4 py-3 rounded-xl",
                  "bg-white/5 border border-white/10",
                  "text-white placeholder-white/40",
                  "focus:outline-none focus:border-neon-cyan/50",
                  "transition-all duration-200",
                  "disabled:opacity-50"
                )}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={cn(
                  "px-4 py-3 rounded-xl",
                  "bg-gradient-to-r from-neon-cyan to-neon-purple",
                  "hover:shadow-neon-cyan transition-all duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </motion.div>
  );
}

"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
interface Message { role: "user" | "assistant"; content: string; timestamp: Date; }
export default function AgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: "Hoi! Ik ben Nova, de AI-assistent van NovaClaw. Hoe kan ik je helpen?", timestamp: new Date() }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = { role: "user", content: input.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })) }) });
      const data = await response.json();
      if (data.response) { setMessages((prev) => [...prev, { role: "assistant", content: data.response, timestamp: new Date() }]); }
    } catch (error) { setMessages((prev) => [...prev, { role: "assistant", content: "Er ging iets mis.", timestamp: new Date() }]); }
    finally { setIsLoading(false); }
  };
  return (
    <>
      <motion.button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>{isOpen ? <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}</motion.button>
      <AnimatePresence>{isOpen && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px] bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl flex flex-col"><div className="p-4 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border-b border-gray-700/50"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center"><span className="text-white font-bold">N</span></div><div><h3 className="text-white font-semibold">Nova</h3><p className="text-xs text-green-400 flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>Online</p></div></div></div><div className="flex-1 overflow-y-auto p-4 space-y-4">{messages.map((msg, idx) => (<div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === "user" ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white" : "bg-gray-800 text-gray-100"}`}><p className="text-sm whitespace-pre-wrap">{msg.content}</p><p className="text-xs mt-1 opacity-60">{msg.timestamp.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}</p></div></div>))}{isLoading && <div className="flex justify-start"><div className="bg-gray-800 p-3 rounded-2xl"><div className="flex gap-1"><span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></span><span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span><span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span></div></div></div>}<div ref={messagesEndRef} /></div><div className="p-4 border-t border-gray-700/50"><div className="flex gap-2"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && sendMessage()} placeholder="Stel een vraag..." className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm" disabled={isLoading} /><button onClick={sendMessage} disabled={isLoading || !input.trim()} className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center disabled:opacity-50"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button></div></div></motion.div>)}</AnimatePresence>
    </>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, X, Send, Bot, User, ShoppingBag, Plus, ArrowRight, Lightbulb } from 'lucide-react';

export default function AIAssistantModal() {
  const { isAIOpen, setIsAIOpen, addToCart, formatPrice } = useApp();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Namaste! I'm your ApnaGrocer Smart Shopping Assistant. How can I help you stock up today?",
      suggestedProducts: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isAIOpen) return null;

  const starterPrompts = [
    "Plan groceries for family of 4 under ₹2000",
    "Healthy high-protein snacks for work",
    "What ingredients do I need for Matar Paneer?",
    "Show me rice & oil deals"
  ];

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    // Add User Message
    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });
      const data = await res.json();
      
      setMessages([...newMessages, {
        sender: 'ai',
        text: data.reply || "Here are some top recommended items for your list:",
        products: data.products || []
      }]);
    } catch (err) {
      setMessages([...newMessages, {
        sender: 'ai',
        text: "I found these top essential groceries for your request:",
        products: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-0 md:p-6 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full md:max-w-xl h-full md:h-[90vh] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-emerald-100">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                ApnaGrocer AI
                <span className="bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">Gemini Powered</span>
              </h3>
              <p className="text-xs text-emerald-100">Your personal grocery & meal assistant</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAIOpen(false)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50">
          
          {/* Quick Starter Chips */}
          {messages.length === 1 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Suggested Prompts
              </p>
              <div className="grid grid-cols-1 gap-2">
                {starterPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="text-left text-xs bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold p-3 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between shadow-sm group"
                  >
                    <span>"{prompt}"</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              
              <div className={`max-w-[85%] space-y-3`}>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-emerald-700 text-white rounded-br-none shadow-md font-medium' 
                    : 'bg-white text-slate-800 rounded-bl-none shadow-sm border border-slate-200'
                }`}>
                  {msg.text}
                </div>

                {/* Recommended Products Cards inside Chat */}
                {msg.products && msg.products.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Recommended Products ({msg.products.length}):</p>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.products.map((prod) => (
                        <div key={prod.id} className="bg-white p-3 rounded-2xl border border-slate-200 hover:border-emerald-300 flex items-center justify-between shadow-sm gap-3">
                          <img src={prod.image} alt={prod.name} className="w-12 h-12 object-contain rounded-lg bg-slate-50" />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-xs text-slate-800 truncate">{prod.name}</h5>
                            <p className="text-[11px] text-slate-500">{prod.quantity} • <span className="font-bold text-emerald-700">{formatPrice(prod.sellingPrice)}</span></p>
                          </div>
                          <button
                            onClick={() => addToCart(prod)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl text-xs font-bold transition-transform active:scale-95 flex items-center gap-1 shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-md">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-200" />
                <span className="text-xs text-slate-500 font-semibold ml-2">ApnaGrocer AI is cooking...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Footer Input */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI: e.g. 'Plan my weekly breakfast under ₹1000'..."
              className="flex-1 px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-medium transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-3 rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

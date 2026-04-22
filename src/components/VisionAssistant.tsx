import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { MarthyGull } from './MarthyGull';
import { GoogleGenAI } from "@google/genai";
import { useTranslation } from "react-i18next";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `Sen Türk Hava Yolları'nın (THY) Vizyon 2033 dijital asistanı MARTHY'sin. 
Görevin, kullanıcılara THY'nin 2033 hedefleri hakkında KISA ve ÖZ bilgiler vermektir.

Önemli: Çok kısa konuş. Cevapların en fazla 2 kısa cümleden oluşsun. Samimi ol ama asla uzatma.

Kurallar:
1. Her cevap maksimum 25-30 kelime olmalı.
2. Gereksiz detayları at, sadece ana fikri samimiyetle söyle.
3. Sorulara doğrudan ve hızlı cevap ver.
4. Sen bir sembolden (Martı) ilham alan, havacılık tutkunu bir dijital karaktersin.`;

export const VisionAssistant: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: t('chat.welcome') }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...messages.map(m => ({ 
            role: m.role === 'ai' ? 'model' : 'user', 
            parts: [{ text: m.text }] 
          })),
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });

      const aiResponse = response.text || t('chat.error_api');
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: t('chat.error_generic') }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[380px] h-[550px] bg-white rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-slate-900 p-6 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center p-1">
                  <MarthyGull className="w-full h-full" mood="happy" />
                </div>
                <div>
                  <h4 className="font-black text-sm tracking-tight">MARTHY Vizyon Asistanı</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{t('chat.online')}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 opacity-50" />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50"
            >
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-[24px] text-sm leading-relaxed shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none font-bold' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none font-medium'
                  }`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-[24px] rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('chat.thinking')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 flex gap-2 shrink-0">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('chat.placeholder')}
                disabled={isLoading}
                className="flex-1 bg-slate-100 border-none rounded-2xl px-6 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none disabled:opacity-50 transition-all font-medium"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-12 h-12 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:bg-slate-300 transition-all flex items-center justify-center shadow-lg shadow-blue-600/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-20 h-20 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white relative group border-4 border-white"
      >
        <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-20" />
        {isOpen ? (
          <X className="w-8 h-8" />
        ) : (
          <div className="relative w-14 h-14">
            <MarthyGull className="w-full h-full group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
          </div>
        )}
      </motion.button>
    </div>
  );
};

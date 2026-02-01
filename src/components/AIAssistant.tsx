import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, User, Bot, MessageCircle } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';
import type { Property } from '../types';

interface Message {
    role: 'user' | 'model';
    text: string;
}

interface AIAssistantProps {
    properties: Property[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ properties }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showWATooltip, setShowWATooltip] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: '¡Hola! Soy ConnectBot. ¿Buscas alguna propiedad específica en Córdoba o necesitas validar un dato de IDECOR?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userText = input;
        setInput('');

        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setIsLoading(true);

        try {
            const aiResponse = await getChatResponse([...messages, { role: 'user', text: userText }], properties);
            setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
        } catch (error: any) {
            console.error("ConnectBot Error:", error);
            setMessages(prev => [...prev, { role: 'model', text: 'Lo siento, tuve un problema al procesar tu mensaje. ¿Podemos intentar de nuevo?' }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Reemplaza este número por el real de la inmobiliaria
    const whatsappNumber = "+54 351 627 1526";
    const whatsappLink = `https://wa.me/543516271526`;

    const handleWAClick = (e: React.MouseEvent) => {
        // Si no estaba el tooltip mostrado (primer clic en móvil), lo mostramos primero
        if (!showWATooltip) {
            e.preventDefault();
            setShowWATooltip(true);
            // Después de un breve delay, permitimos el acceso si vuelve a clickear o si queremos auto-redirigir
            setTimeout(() => {
                window.open(whatsappLink, '_blank');
            }, 800);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3">
            {/* CHAT IA WINDOW */}
            {isOpen && (
                <div className="mb-2 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                    <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <p className="font-black text-sm tracking-tight">ConnectBot IA</p>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">En Línea</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scroll-smooth">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-900 text-white shadow-sm'}`}>
                                        {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                    </div>
                                    <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}>
                                        {m.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-100">
                        <div className="relative">
                            <input
                                type="text"
                                disabled={isLoading}
                                placeholder="Escribe tu consulta..."
                                className="w-full pl-6 pr-14 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold text-slate-900 disabled:opacity-50"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="absolute right-2 top-2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-slate-900 transition-all shadow-lg disabled:opacity-0"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* BUTTONS STACK */}
            <div className="flex flex-col items-end gap-4">
                {/* WHATSAPP BUBBLE */}
                <div className="relative flex items-center group">
                    {/* Tooltip Label with Arrow */}
                    <div className={`mr-4 px-6 py-4 bg-white text-slate-900 rounded-[1.5rem] shadow-2xl border border-slate-100 whitespace-nowrap transition-all duration-500 transform origin-right relative ${showWATooltip ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-4 scale-90 pointer-events-none'}`}>
                        <p className="text-[11px] font-black uppercase tracking-widest flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Chatea en WhatsApp con el <span className="text-emerald-600 font-extrabold">{whatsappNumber}</span>
                        </p>
                        {/* Small Arrow */}
                        <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-white border-r border-t border-slate-100 rotate-45"></div>
                    </div>

                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={() => setShowWATooltip(true)}
                        onMouseLeave={() => setShowWATooltip(false)}
                        onClick={handleWAClick}
                        className="bg-emerald-500 text-white p-5 rounded-[2rem] shadow-2xl hover:scale-110 hover:bg-emerald-600 transition-all flex items-center justify-center relative overflow-hidden group/wa border-4 border-white"
                    >
                        {/* Soft Pulse Effect */}
                        <span className="absolute inset-0 bg-white opacity-0 group-hover/wa:opacity-20 group-hover/wa:animate-ping rounded-full"></span>
                        <MessageCircle size={32} />

                        {/* Small online indicator */}
                        <span className="absolute top-3 right-3 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full"></span>
                    </a>
                </div>

                {/* AI TOGGLE BUTTON */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-5 rounded-[2rem] shadow-2xl hover:scale-110 transition-all flex items-center gap-3 relative border-4 border-white ${isOpen ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white hover:bg-slate-900'}`}
                >
                    {isOpen ? <X size={32} /> : <MessageSquare size={32} />}
                    {!isOpen && <span className="font-black text-[10px] uppercase tracking-widest pr-2 hidden md:block">Consultar IA</span>}
                </button>
            </div>
        </div>
    );
};

export default AIAssistant;












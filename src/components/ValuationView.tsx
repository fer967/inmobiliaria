import React, { useState } from 'react';
import { Calculator, Home, Sparkles, ArrowRight, CheckCircle2, RefreshCw, Send, ShieldCheck, MailCheck, Eye, X } from 'lucide-react';
import { getAIValuation, composeValuationEmail } from '../services/geminiService';
import { submitLeadToCRM, sendValuationEmail } from '../services/apiService';

const ValuationView: React.FC = () => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [emailBody, setEmailBody] = useState<string | null>(null);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [showEmailPreview, setShowEmailPreview] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        neighborhood: '',
        m2: '',
        rooms: '2',
        condition: 'Excelente'
    });

    const handleNext = () => setStep(s => s + 1);

    const handleValuation = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStep(3);

        try {
            // 1. Obtener tasación de IA
            const valuationText = await getAIValuation({
                address: formData.address,
                neighborhood: formData.neighborhood,
                m2: Number(formData.m2),
                rooms: Number(formData.rooms),
                condition: formData.condition
            });
            setResult(valuationText);

            // 2. Redactar Email Automático con IA
            const composedEmail = await composeValuationEmail(formData.name, valuationText);
            setEmailBody(composedEmail);

            // 3. Enviar a CRM automáticamente
            await submitLeadToCRM({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                propertyId: 'TASACIÓN_ONLINE',
                status: 'Nuevo',
                message: `TASACIÓN AUTOMÁTICA enviada. Dirección: ${formData.address}. Rango: ${valuationText.substring(0, 50)}...`
            });

            // 4. Simular Envío de Mail
            await sendValuationEmail(formData.email, composedEmail);
            setIsEmailSent(true);

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-20 px-4">
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-100">
                    <Sparkles size={14} className="animate-pulse" />
                    Market Intel Engine
                </div>
                <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-4">Tasación Online con <span className="text-indigo-600">IA</span></h1>
                <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">Obtén un valor de mercado preciso y recibe un informe detallado en tu casilla de correo en segundos.</p>
            </div>

            <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-indigo-100/50 border border-slate-100 overflow-hidden min-h-[500px] flex flex-col">
                {/* PROGRESS BAR */}
                <div className="h-2 w-full bg-slate-50 flex">
                    <div className={`h-full bg-indigo-600 transition-all duration-700 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`}></div>
                </div>

                <div className="p-12 flex-1">
                    {step === 1 && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-slate-900 text-white rounded-2xl"><Home size={24} /></div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Datos de la Propiedad</h3>
                                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Paso 1 de 2</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Dirección</label>
                                    <input
                                        className="w-full px-8 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none font-bold transition-all"
                                        placeholder="Ej: Rafael Nuñez 3500"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Barrio / Zona</label>
                                    <input
                                        className="w-full px-8 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none font-bold transition-all"
                                        placeholder="Ej: Cerro de las Rosas"
                                        value={formData.neighborhood}
                                        onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Superficie Total (m2)</label>
                                    <input
                                        type="number"
                                        className="w-full px-8 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none font-bold transition-all"
                                        placeholder="Ej: 250"
                                        value={formData.m2}
                                        onChange={e => setFormData({ ...formData, m2: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Estado General</label>
                                    <select
                                        className="w-full px-8 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none font-bold transition-all cursor-pointer"
                                        value={formData.condition}
                                        onChange={e => setFormData({ ...formData, condition: e.target.value })}
                                    >
                                        <option>Excelente</option>
                                        <option>Muy Bueno</option>
                                        <option>A Refaccionar</option>
                                        <option>A Estrenar</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!formData.address || !formData.m2}
                                className="w-full md:w-auto bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all disabled:opacity-50"
                            >
                                Siguiente Paso <ArrowRight size={18} />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-indigo-600 text-white rounded-2xl"><Send size={24} /></div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Información de Contacto</h3>
                                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Paso 2 de 2</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Nombre Completo</label>
                                    <input
                                        className="w-full px-8 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none font-bold transition-all"
                                        placeholder="Tu nombre..."
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Email</label>
                                    <input
                                        className="w-full px-8 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none font-bold transition-all"
                                        placeholder="email@ejemplo.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleValuation}
                                disabled={!formData.name || !formData.email}
                                className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-black uppercase text-sm tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100"
                            >
                                Generar Tasación & Enviar Informe <Sparkles size={18} />
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="min-h-[400px] flex flex-col items-center justify-center text-center animate-in zoom-in-95">
                            {isLoading ? (
                                <div className="space-y-6">
                                    <div className="relative">
                                        <RefreshCw size={64} className="text-indigo-600 animate-spin mx-auto" />
                                        <Sparkles size={24} className="absolute top-0 right-0 text-amber-400 animate-pulse" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Procesando Informe...</h3>
                                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Sincronizando IDECOR & Redactando Correo Personalizado</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full text-left space-y-8 animate-in fade-in">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-50 pb-8 gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center"><CheckCircle2 size={32} /></div>
                                            <div>
                                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Informe de Valuación</h3>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connect Intelligence Engine</p>
                                            </div>
                                        </div>

                                        {isEmailSent && (
                                            <div className="flex items-center gap-3 bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-lg shadow-emerald-100 animate-bounce">
                                                <MailCheck size={20} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Enviado a {formData.email}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-700"><Calculator size={120} /></div>
                                        <div className="prose prose-invert max-w-none whitespace-pre-wrap text-indigo-50 font-medium leading-relaxed">
                                            {result}
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-4">
                                        <button onClick={() => setStep(1)} className="flex-1 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all border border-slate-100">Nueva Tasación</button>
                                        {emailBody && (
                                            <button
                                                onClick={() => setShowEmailPreview(true)}
                                                className="flex-1 bg-slate-50 text-slate-700 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-100 transition-all border border-slate-200"
                                            >
                                                <Eye size={18} /> Ver Email Enviado
                                            </button>
                                        )}
                                        <button className="flex-[1.5] bg-indigo-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-900 transition-all">
                                            Hablar con un Experto <ShieldCheck size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* EMAIL PREVIEW MODAL */}
            {showEmailPreview && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
                        <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center"><MailCheck size={20} /></div>
                                <div>
                                    <h4 className="font-black text-sm uppercase tracking-tight">Correo Automatizado</h4>
                                    <p className="text-[10px] font-bold text-slate-400">Redactado por Connect AI</p>
                                </div>
                            </div>
                            <button onClick={() => setShowEmailPreview(false)} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24} /></button>
                        </div>

                        <div className="p-10 space-y-6">
                            <div className="border-b border-slate-100 pb-4 space-y-2">
                                <div className="flex gap-4"><span className="text-[10px] font-black text-slate-400 uppercase w-12">Para:</span> <span className="text-xs font-bold text-slate-700">{formData.name} &lt;{formData.email}&gt;</span></div>
                                <div className="flex gap-4"><span className="text-[10px] font-black text-slate-400 uppercase w-12">Asunto:</span> <span className="text-xs font-bold text-slate-700">Informe de Tasación - Connect Inmobiliaria Córdoba</span></div>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl text-sm font-medium text-slate-600 leading-relaxed italic whitespace-pre-wrap max-h-[400px] overflow-y-auto border border-slate-100">
                                {emailBody}
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Este correo ha sido entregado exitosamente al servidor del cliente.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ValuationView;





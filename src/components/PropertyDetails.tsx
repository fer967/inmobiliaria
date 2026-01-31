import React, { useEffect, useState } from 'react';
import { ChevronLeft, Calendar, Sparkles, ShieldCheck, RefreshCcw, AlertTriangle } from 'lucide-react';
import { type Property, TransactionType } from '../types';
import MapComponent from './MapComponent';
import LeadForm from './LeadForm';
import { getPropertyAdvice } from '../services/geminiService';
import { fetchIdecorData } from '../services/apiService';

interface PropertyDetailsProps {
    property: Property;
    onBack: () => void;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, onBack }) => {
    const [activeImage, setActiveImage] = useState(0);
    const [aiAdvice, setAiAdvice] = useState<string | null>(null);
    const [realIdecor, setRealIdecor] = useState<any>(null);
    const [loadingIdecor, setLoadingIdecor] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            setLoadingIdecor(true);

            // 1. Fetch AI Advice
            getPropertyAdvice(property.title, property.price, property.transaction)
                .then(advice => { if (isMounted) setAiAdvice(advice); });

            // 2. Fetch Real IDECOR Data from Python Backend
            const data = await fetchIdecorData(property.idecor.nomenclatura);
            if (isMounted) {
                setRealIdecor(data);
                setLoadingIdecor(false);
            }
        };

        loadData();
        return () => { isMounted = false; };
    }, [property]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
            <button
                onClick={onBack}
                className="flex items-center text-indigo-600 font-bold mb-6 hover:translate-x-[-4px] transition-transform text-sm uppercase tracking-widest"
            >
                <ChevronLeft size={20} className="mr-2" />
                Volver al listado
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    <div className="space-y-4">
                        <div className="relative h-[600px] rounded-[2.5rem] overflow-hidden group shadow-2xl">
                            <img
                                src={property.images[activeImage]}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                alt={property.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                            <div className="absolute bottom-10 left-10 text-white">
                                <div className="flex gap-2 mb-4">
                                    <span className="bg-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{property.transaction}</span>
                                    <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{property.type}</span>
                                </div>
                                <h1 className="text-5xl font-black mb-2 tracking-tighter">{property.title}</h1>
                                <p className="text-xl opacity-80 font-medium">{property.address}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {property.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden border-4 transition-all duration-300 ${activeImage === idx ? 'border-indigo-600 scale-105 shadow-xl' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt="" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100">
                        <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">Detalles de la Propiedad</h2>
                        <p className="text-slate-500 leading-relaxed mb-12 text-xl font-medium">{property.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {property.features.map(f => (
                                <div key={f} className="flex items-center p-6 bg-slate-50 rounded-3xl text-sm font-bold text-slate-700 border border-slate-100">
                                    <Sparkles size={16} className="text-indigo-500 mr-3" />
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECCIÓN IDECOR REAL */}
                    <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
                        {loadingIdecor && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                                <RefreshCcw size={40} className="text-indigo-600 animate-spin mb-4" />
                                <span className="font-black text-xs uppercase tracking-widest text-slate-400">Conectando con Catastro Córdoba...</span>
                            </div>
                        )}

                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Validación IDECOR</h2>
                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Sincronización Web Feature Service (WFS)</p>
                                </div>
                            </div>
                            {realIdecor?.verificado ? (
                                <div className="bg-emerald-50 text-emerald-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    Título Verificado
                                </div>
                            ) : (
                                <div className="bg-amber-50 text-amber-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100 flex items-center gap-2">
                                    <AlertTriangle size={14} />
                                    Datos Offline
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all">
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3 block">Nomenclatura Provincial</span>
                                <span className="font-mono text-2xl font-black text-indigo-900">{realIdecor?.nomenclatura || property.idecor.nomenclatura}</span>
                            </div>
                            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all">
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3 block">Valor Fiscal Registrado</span>
                                <span className="text-2xl font-black text-slate-900">${(realIdecor?.valorFiscal || property.idecor.valorFiscal).toLocaleString()}</span>
                            </div>
                            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all">
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3 block">Uso de Suelo (Zonificación)</span>
                                <span className="text-2xl font-black text-slate-900">{realIdecor?.tipoSuelo || property.idecor.tipoSuelo}</span>
                            </div>
                            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all">
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3 block">Superficie Gráfica</span>
                                <span className="text-2xl font-black text-slate-900">{realIdecor?.superficieM2 || property.idecor.superficieM2} m²</span>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Fuente oficial: {realIdecor?.fuente || 'Dirección General de Catastro de Córdoba'}</p>
                        </div>
                    </div>

                    <div className="h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                        <MapComponent center={property.location} zoom={16} />
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-2xl sticky top-28 border border-white/5">
                        <div className="text-[10px] uppercase tracking-[0.3em] font-black text-indigo-400 mb-4">Precio de Mercado</div>
                        <div className="text-6xl font-black mb-10 flex items-baseline gap-3">
                            <span className="text-2xl font-bold opacity-40">{property.transaction === TransactionType.BUY ? 'USD' : '$'}</span>
                            {property.price.toLocaleString()}
                        </div>

                        {aiAdvice ? (
                            <div className="mb-10 p-8 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 backdrop-blur-md relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                                    <Sparkles size={60} />
                                </div>
                                <div className="flex items-center text-indigo-400 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                                    <Sparkles size={14} className="mr-2 animate-pulse" />
                                    AI Market Intel
                                </div>
                                <p className="text-lg italic text-indigo-50 leading-relaxed font-bold tracking-tight">"{aiAdvice}"</p>
                            </div>
                        ) : (
                            <div className="mb-10 p-8 bg-white/5 rounded-3xl border border-white/10 animate-pulse">
                                <div className="h-2 w-24 bg-white/20 rounded mb-4"></div>
                                <div className="h-6 w-full bg-white/20 rounded mb-2"></div>
                                <div className="h-6 w-2/3 bg-white/20 rounded"></div>
                            </div>
                        )}

                        <div className="flex items-center gap-4 text-slate-400 mb-10 bg-white/5 p-4 rounded-2xl border border-white/5">
                            <Calendar size={20} className="text-indigo-500" />
                            <span className="text-sm font-bold uppercase tracking-widest">Publicación Verificada</span>
                        </div>

                        <LeadForm propertyId={property.id} onSuccess={() => { }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;


// import React, { useEffect, useState } from 'react';
// import { ChevronLeft, Info, Calendar, Sparkles } from 'lucide-react';
// // Added TransactionType to imports to fix type comparison error
// import { type Property, TransactionType } from '../types';
// import MapComponent from './MapComponent';
// import LeadForm from './LeadForm';
// import { getPropertyAdvice } from '../services/geminiService';

// interface PropertyDetailsProps {
//     property: Property;
//     onBack: () => void;
// }

// const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, onBack }) => {
//     const [activeImage, setActiveImage] = useState(0);
//     const [aiAdvice, setAiAdvice] = useState<string | null>(null);

//     useEffect(() => {
//         let isMounted = true;
//         const fetchAdvice = async () => {
//             const advice = await getPropertyAdvice(property.title, property.price, property.transaction);
//             if (isMounted) {
//                 setAiAdvice(advice);
//             }
//         };
//         fetchAdvice();
//         return () => { isMounted = false; };
//     }, [property]);

//     return (
//         <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
//             <button
//                 onClick={onBack}
//                 className="flex items-center text-indigo-600 font-medium mb-6 hover:translate-x-[-4px] transition-transform"
//             >
//                 <ChevronLeft size={20} className="mr-1" />
//                 Volver al listado
//             </button>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 <div className="lg:col-span-2 space-y-8">
//                     <div className="space-y-4">
//                         <div className="relative h-[500px] rounded-2xl overflow-hidden group shadow-2xl">
//                             <img
//                                 src={property.images[activeImage]}
//                                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                                 alt={property.title}
//                             />
//                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
//                             <div className="absolute bottom-6 left-6 text-white">
//                                 <h1 className="text-4xl font-extrabold mb-2 drop-shadow-md">{property.title}</h1>
//                                 <p className="text-lg opacity-90 drop-shadow-md">{property.address}</p>
//                             </div>
//                         </div>
//                         <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
//                             {property.images.map((img, idx) => (
//                                 <button
//                                     key={idx}
//                                     onClick={() => setActiveImage(idx)}
//                                     className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-indigo-600 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
//                                 >
//                                     <img src={img} className="w-full h-full object-cover" alt="" />
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
//                         <h2 className="text-2xl font-bold text-gray-900 mb-6">Descripción</h2>
//                         <p className="text-gray-600 leading-relaxed mb-8 text-lg">{property.description}</p>

//                         <h3 className="text-lg font-bold text-gray-900 mb-4">Características principales</h3>
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                             {property.features.map(f => (
//                                 <div key={f} className="flex items-center p-4 bg-indigo-50/50 rounded-xl text-sm font-semibold text-indigo-900 border border-indigo-100/50">
//                                     <Sparkles size={14} className="text-indigo-500 mr-3" />
//                                     {f}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
//                         <div className="flex items-center justify-between mb-8">
//                             <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-indigo-600 rounded-lg text-white">
//                                     <Info size={20} />
//                                 </div>
//                                 <h2 className="text-2xl font-bold text-gray-900">Datos IDECOR (Catastro)</h2>
//                             </div>
//                             <div className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
//                                 Sincronizado WFS
//                             </div>
//                         </div>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
//                                 <span className="text-gray-500 font-medium">Nomenclatura</span>
//                                 <span className="font-mono font-bold text-indigo-900 bg-white px-3 py-1 rounded-lg border border-slate-200">{property.idecor.nomenclatura}</span>
//                             </div>
//                             <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
//                                 <span className="text-gray-500 font-medium">Valor Fiscal</span>
//                                 <span className="font-bold text-gray-900 text-lg">${property.idecor.valorFiscal.toLocaleString()}</span>
//                             </div>
//                             <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
//                                 <span className="text-gray-500 font-medium">Tipo de Suelo</span>
//                                 <span className="font-bold text-gray-900">{property.idecor.tipoSuelo}</span>
//                             </div>
//                             <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
//                                 <span className="text-gray-500 font-medium">Superficie</span>
//                                 <span className="font-bold text-gray-900">{property.idecor.superficieM2} m²</span>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="h-[450px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
//                         <MapComponent center={property.location} zoom={16} />
//                     </div>
//                 </div>

//                 <div className="space-y-6">
//                     <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-2xl sticky top-24 border border-white/10">
//                         <div className="text-xs uppercase tracking-[0.2em] font-black text-indigo-300 mb-3">Valor de Mercado</div>
//                         <div className="text-5xl font-black mb-8 flex items-baseline gap-2">
//                             {/* Fixed: Use TransactionType.BUY constant instead of hardcoded string to avoid type mismatch */}
//                             <span className="text-2xl font-bold opacity-60">{property.transaction === TransactionType.BUY ? 'USD' : '$'}</span>
//                             {property.price.toLocaleString()}
//                         </div>

//                         {aiAdvice ? (
//                             <div className="mb-8 p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm relative overflow-hidden group">
//                                 <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
//                                     <Sparkles size={40} />
//                                 </div>
//                                 <div className="flex items-center text-amber-400 text-[10px] font-black mb-3 uppercase tracking-widest">
//                                     <Sparkles size={12} className="mr-2 animate-pulse" />
//                                     Smart Insight AI
//                                 </div>
//                                 <p className="text-sm italic text-indigo-50 leading-relaxed font-medium">"{aiAdvice}"</p>
//                             </div>
//                         ) : (
//                             <div className="mb-8 p-5 bg-white/5 rounded-2xl border border-white/10 animate-pulse">
//                                 <div className="h-2 w-24 bg-white/20 rounded mb-3"></div>
//                                 <div className="h-4 w-full bg-white/20 rounded mb-2"></div>
//                                 <div className="h-4 w-2/3 bg-white/20 rounded"></div>
//                             </div>
//                         )}

//                         <div className="flex items-center gap-3 text-indigo-300 mb-10 bg-white/5 p-3 rounded-xl border border-white/5">
//                             <Calendar size={18} />
//                             <span className="text-sm font-medium">Publicado hace 3 días</span>
//                         </div>

//                         <LeadForm propertyId={property.id} onSuccess={() => { }} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PropertyDetails;


// import React, { useEffect, useState } from 'react';
// import { ChevronLeft, Info, Calendar, Sparkles } from 'lucide-react';
// import type { Property } from '../types';
// import MapComponent from './MapComponent';
// import LeadForm from './LeadForm';
// import { getPropertyAdvice } from '../services/geminiService';

// interface PropertyDetailsProps {
//     property: Property;
//     onBack: () => void;
// }

// const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, onBack }) => {
//     const [activeImage, setActiveImage] = useState(0);
//     const [aiAdvice, setAiAdvice] = useState<string | null>(null);

//     useEffect(() => {
//         let isMounted = true;
//         const fetchAdvice = async () => {
//             const advice = await getPropertyAdvice(property.title, property.price, property.transaction);
//             if (isMounted) {
//                 setAiAdvice(advice);
//             }
//         };
//         fetchAdvice();
//         return () => { isMounted = false; };
//     }, [property]);

//     return (
//         <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
//             <button
//                 onClick={onBack}
//                 className="flex items-center text-indigo-600 font-medium mb-6 hover:translate-x-[-4px] transition-transform"
//             >
//                 <ChevronLeft size={20} className="mr-1" />
//                 Volver al listado
//             </button>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 <div className="lg:col-span-2 space-y-8">
//                     <div className="space-y-4">
//                         <div className="relative h-[500px] rounded-2xl overflow-hidden group shadow-2xl">
//                             <img
//                                 src={property.images[activeImage]}
//                                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                                 alt={property.title}
//                             />
//                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
//                             <div className="absolute bottom-6 left-6 text-white">
//                                 <h1 className="text-4xl font-extrabold mb-2 drop-shadow-md">{property.title}</h1>
//                                 <p className="text-lg opacity-90 drop-shadow-md">{property.address}</p>
//                             </div>
//                         </div>
//                         <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
//                             {property.images.map((img, idx) => (
//                                 <button
//                                     key={idx}
//                                     onClick={() => setActiveImage(idx)}
//                                     className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-indigo-600 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
//                                 >
//                                     <img src={img} className="w-full h-full object-cover" alt="" />
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
//                         <h2 className="text-2xl font-bold text-gray-900 mb-6">Descripción</h2>
//                         <p className="text-gray-600 leading-relaxed mb-8 text-lg">{property.description}</p>

//                         <h3 className="text-lg font-bold text-gray-900 mb-4">Características principales</h3>
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                             {property.features.map(f => (
//                                 <div key={f} className="flex items-center p-4 bg-indigo-50/50 rounded-xl text-sm font-semibold text-indigo-900 border border-indigo-100/50">
//                                     <Sparkles size={14} className="text-indigo-500 mr-3" />
//                                     {f}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
//                         <div className="flex items-center justify-between mb-8">
//                             <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-indigo-600 rounded-lg text-white">
//                                     <Info size={20} />
//                                 </div>
//                                 <h2 className="text-2xl font-bold text-gray-900">Datos IDECOR (Catastro)</h2>
//                             </div>
//                             <div className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
//                                 Sincronizado WFS
//                             </div>
//                         </div>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
//                                 <span className="text-gray-500 font-medium">Nomenclatura</span>
//                                 <span className="font-mono font-bold text-indigo-900 bg-white px-3 py-1 rounded-lg border border-slate-200">{property.idecor.nomenclatura}</span>
//                             </div>
//                             <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
//                                 <span className="text-gray-500 font-medium">Valor Fiscal</span>
//                                 <span className="font-bold text-gray-900 text-lg">${property.idecor.valorFiscal.toLocaleString()}</span>
//                             </div>
//                             <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
//                                 <span className="text-gray-500 font-medium">Tipo de Suelo</span>
//                                 <span className="font-bold text-gray-900">{property.idecor.tipoSuelo}</span>
//                             </div>
//                             <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
//                                 <span className="text-gray-500 font-medium">Superficie</span>
//                                 <span className="font-bold text-gray-900">{property.idecor.superficieM2} m²</span>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="h-[450px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
//                         <MapComponent center={property.location} zoom={16} />
//                     </div>
//                 </div>

//                 <div className="space-y-6">
//                     <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-2xl sticky top-24 border border-white/10">
//                         <div className="text-xs uppercase tracking-[0.2em] font-black text-indigo-300 mb-3">Valor de Mercado</div>
//                         <div className="text-5xl font-black mb-8 flex items-baseline gap-2">
//                             <span className="text-2xl font-bold opacity-60">{property.transaction === 'Compra' ? 'USD' : '$'}</span>
//                             {property.price.toLocaleString()}
//                         </div>

//                         {aiAdvice ? (
//                             <div className="mb-8 p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm relative overflow-hidden group">
//                                 <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
//                                     <Sparkles size={40} />
//                                 </div>
//                                 <div className="flex items-center text-amber-400 text-[10px] font-black mb-3 uppercase tracking-widest">
//                                     <Sparkles size={12} className="mr-2 animate-pulse" />
//                                     Smart Insight AI
//                                 </div>
//                                 <p className="text-sm italic text-indigo-50 leading-relaxed font-medium">"{aiAdvice}"</p>
//                             </div>
//                         ) : (
//                             <div className="mb-8 p-5 bg-white/5 rounded-2xl border border-white/10 animate-pulse">
//                                 <div className="h-2 w-24 bg-white/20 rounded mb-3"></div>
//                                 <div className="h-4 w-full bg-white/20 rounded mb-2"></div>
//                                 <div className="h-4 w-2/3 bg-white/20 rounded"></div>
//                             </div>
//                         )}

//                         <div className="flex items-center gap-3 text-indigo-300 mb-10 bg-white/5 p-3 rounded-xl border border-white/5">
//                             <Calendar size={18} />
//                             <span className="text-sm font-medium">Publicado hace 3 días</span>
//                         </div>

//                         <LeadForm propertyId={property.id} onSuccess={() => { }} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PropertyDetails;

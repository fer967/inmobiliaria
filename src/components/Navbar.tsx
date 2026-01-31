import React from 'react';
import { Menu, X, Settings, Briefcase, UserCircle, LayoutDashboard, Users, PlusCircle, LogOut } from 'lucide-react';

interface NavbarProps {
    onViewChange: (view: 'home' | 'listings' | 'dashboard' | 'publish', tab?: 'analytics' | 'crm') => void;
    currentView: string;
    isAdmin: boolean;
    newLeadsCount?: number;
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onViewChange, currentView, isAdmin, newLeadsCount = 0, onLogout }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <nav className="glass border-b border-slate-200 sticky top-0 z-[60]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => onViewChange('home')}>
                            <div className="bg-slate-900 p-2 rounded-xl text-white transition-all group-hover:bg-indigo-600">
                                <Briefcase size={22} />
                            </div>
                            <div className="ml-3">
                                <span className="block text-xl font-black text-slate-900 leading-none tracking-tighter">CONNECT</span>
                                <span className="block text-[10px] font-black text-indigo-600 tracking-[0.3em] uppercase">Staff Edition</span>
                            </div>
                        </div>

                        <div className="hidden md:ml-12 md:flex md:items-center md:space-x-1">
                            <button
                                onClick={() => onViewChange('listings')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentView === 'listings' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                            >
                                PROPIEDADES
                            </button>

                            {isAdmin ? (
                                <>
                                    <div className="w-px h-6 bg-slate-200 mx-2" />
                                    <button
                                        onClick={() => onViewChange('dashboard', 'analytics')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentView === 'dashboard' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                                    >
                                        <LayoutDashboard size={16} />
                                        PANEL CONTROL
                                    </button>
                                    <button
                                        onClick={() => onViewChange('dashboard', 'crm')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all relative ${currentView === 'dashboard' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                                    >
                                        <Users size={16} />
                                        GESTIÓN CRM
                                        {newLeadsCount > 0 && (
                                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-black text-white ring-2 ring-white">
                                                {newLeadsCount}
                                            </span>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50">TASACIONES</button>
                                    <button className="px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50">IDECOR MAPS</button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        {isAdmin ? (
                            <div className="hidden lg:flex items-center gap-4">
                                <button
                                    onClick={() => onViewChange('publish')}
                                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
                                >
                                    <PlusCircle size={14} />
                                    Publicar
                                </button>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Autorizado</span>
                                    </div>
                                    <button
                                        onClick={onLogout}
                                        title="Cerrar Sesión"
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => onViewChange('dashboard')} className="hidden md:flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm bg-slate-50 px-5 py-2.5 rounded-xl transition-all border border-slate-100">
                                <UserCircle size={20} />
                                Acceso Staff
                            </button>
                        )}

                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900 p-2">
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 p-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-300">
                    <button onClick={() => { onViewChange('listings'); setIsOpen(false); }} className="flex items-center justify-between w-full font-black text-slate-900 text-lg uppercase tracking-tighter">
                        Propiedades
                        <X size={16} className="opacity-0" />
                    </button>

                    {isAdmin ? (
                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <button onClick={() => { onViewChange('dashboard', 'analytics'); setIsOpen(false); }} className="flex items-center gap-3 w-full p-4 rounded-2xl bg-indigo-50 text-indigo-600 font-black text-xs uppercase tracking-widest">
                                <LayoutDashboard size={18} /> Panel Control
                            </button>
                            <button onClick={() => { onViewChange('dashboard', 'crm'); setIsOpen(false); }} className="flex items-center justify-between w-full p-4 rounded-2xl bg-emerald-50 text-emerald-600 font-black text-xs uppercase tracking-widest">
                                <div className="flex items-center gap-3"><Users size={18} /> Gestión CRM</div>
                                {newLeadsCount > 0 && <span className="bg-emerald-500 text-white px-2 py-1 rounded-lg text-[10px]">{newLeadsCount}</span>}
                            </button>
                            <button onClick={() => { onViewChange('publish'); setIsOpen(false); }} className="flex items-center justify-center gap-2 bg-slate-900 text-white w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">
                                <PlusCircle size={18} /> Nueva Publicación
                            </button>
                            <button
                                onClick={() => { onLogout(); setIsOpen(false); }}
                                className="flex items-center justify-center gap-3 w-full p-4 rounded-2xl text-red-500 font-black text-xs uppercase tracking-widest border border-red-100"
                            >
                                <LogOut size={18} /> Cerrar Sesión
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => { onViewChange('dashboard'); setIsOpen(false); }} className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-xs tracking-widest bg-indigo-50 w-full p-5 rounded-2xl">
                            Iniciar Sesión Staff
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;


// import React from 'react';
// import { Menu, X, Briefcase, UserCircle, LayoutDashboard, Users, PlusCircle } from 'lucide-react';

// interface NavbarProps {
//     onViewChange: (view: 'home' | 'listings' | 'dashboard' | 'publish', tab?: 'analytics' | 'crm') => void;
//     currentView: string;
//     isAdmin: boolean;
//     newLeadsCount?: number;
// }

// const Navbar: React.FC<NavbarProps> = ({ onViewChange, currentView, isAdmin, newLeadsCount = 0 }) => {
//     const [isOpen, setIsOpen] = React.useState(false);

//     return (
//         <nav className="glass border-b border-slate-200 sticky top-0 z-[60]">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between h-20">
//                     <div className="flex items-center">
//                         <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => onViewChange('home')}>
//                             <div className="bg-slate-900 p-2 rounded-xl text-white transition-all group-hover:bg-indigo-600">
//                                 <Briefcase size={22} />
//                             </div>
//                             <div className="ml-3">
//                                 <span className="block text-xl font-black text-slate-900 leading-none tracking-tighter">CONNECT</span>
//                                 <span className="block text-[10px] font-black text-indigo-600 tracking-[0.3em] uppercase">Staff Edition</span>
//                             </div>
//                         </div>

//                         <div className="hidden md:ml-12 md:flex md:items-center md:space-x-1">
//                             <button
//                                 onClick={() => onViewChange('listings')}
//                                 className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentView === 'listings' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
//                             >
//                                 PROPIEDADES
//                             </button>

//                             {isAdmin ? (
//                                 <>
//                                     <div className="w-px h-6 bg-slate-200 mx-2" />
//                                     <button
//                                         onClick={() => onViewChange('dashboard', 'analytics')}
//                                         className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentView === 'dashboard' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
//                                     >
//                                         <LayoutDashboard size={16} />
//                                         PANEL CONTROL
//                                     </button>
//                                     <button
//                                         onClick={() => onViewChange('dashboard', 'crm')}
//                                         className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all relative ${currentView === 'dashboard' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
//                                     >
//                                         <Users size={16} />
//                                         GESTIÓN CRM
//                                         {newLeadsCount > 0 && (
//                                             <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-black text-white ring-2 ring-white">
//                                                 {newLeadsCount}
//                                             </span>
//                                         )}
//                                     </button>
//                                 </>
//                             ) : (
//                                 <>
//                                     <button className="px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50">TASACIONES</button>
//                                     <button className="px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50">IDECOR MAPS</button>
//                                 </>
//                             )}
//                         </div>
//                     </div>

//                     <div className="flex items-center space-x-6">
//                         {isAdmin ? (
//                             <div className="hidden lg:flex items-center gap-4">
//                                 <button
//                                     onClick={() => onViewChange('publish')}
//                                     className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
//                                 >
//                                     <PlusCircle size={14} />
//                                     Publicar
//                                 </button>
//                                 <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100">
//                                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
//                                     <span className="text-[10px] font-black uppercase tracking-widest">Personal Autorizado</span>
//                                 </div>
//                             </div>
//                         ) : (
//                             <button onClick={() => onViewChange('dashboard')} className="hidden md:flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm bg-slate-50 px-5 py-2.5 rounded-xl transition-all border border-slate-100">
//                                 <UserCircle size={20} />
//                                 Acceso Staff
//                             </button>
//                         )}

//                         <div className="md:hidden flex items-center">
//                             <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900 p-2">
//                                 {isOpen ? <X size={24} /> : <Menu size={24} />}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* MOBILE MENU */}
//             {isOpen && (
//                 <div className="md:hidden bg-white border-t border-slate-100 p-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-300">
//                     <button onClick={() => { onViewChange('listings'); setIsOpen(false); }} className="flex items-center justify-between w-full font-black text-slate-900 text-lg uppercase tracking-tighter">
//                         Propiedades
//                         <X size={16} className="opacity-0" />
//                     </button>

//                     {isAdmin ? (
//                         <div className="space-y-4 pt-4 border-t border-slate-50">
//                             <button onClick={() => { onViewChange('dashboard', 'analytics'); setIsOpen(false); }} className="flex items-center gap-3 w-full p-4 rounded-2xl bg-indigo-50 text-indigo-600 font-black text-xs uppercase tracking-widest">
//                                 <LayoutDashboard size={18} /> Panel Control
//                             </button>
//                             <button onClick={() => { onViewChange('dashboard', 'crm'); setIsOpen(false); }} className="flex items-center justify-between w-full p-4 rounded-2xl bg-emerald-50 text-emerald-600 font-black text-xs uppercase tracking-widest">
//                                 <div className="flex items-center gap-3"><Users size={18} /> Gestión CRM</div>
//                                 {newLeadsCount > 0 && <span className="bg-emerald-500 text-white px-2 py-1 rounded-lg text-[10px]">{newLeadsCount}</span>}
//                             </button>
//                             <button onClick={() => { onViewChange('publish'); setIsOpen(false); }} className="flex items-center justify-center gap-2 bg-slate-900 text-white w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">
//                                 <PlusCircle size={18} /> Nueva Publicación
//                             </button>
//                         </div>
//                     ) : (
//                         <button onClick={() => { onViewChange('dashboard'); setIsOpen(false); }} className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-xs tracking-widest bg-indigo-50 w-full p-5 rounded-2xl">
//                             Iniciar Sesión Staff
//                         </button>
//                     )}
//                 </div>
//             )}
//         </nav>
//     );
// };

// export default Navbar;


// import React from 'react';
// import { Menu, X, Settings, Briefcase, UserCircle } from 'lucide-react';


// interface NavbarProps {
//     onViewChange: (view: 'home' | 'listings' | 'dashboard' | 'publish') => void;
//     currentView: string;
//     isAdmin: boolean;
// }

// const Navbar: React.FC<NavbarProps> = ({ onViewChange, currentView, isAdmin }) => {
//     const [isOpen, setIsOpen] = React.useState(false);

//     return (
//         <nav className="glass border-b border-slate-200 sticky top-0 z-[60]">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between h-20">
//                     <div className="flex items-center">
//                         <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => onViewChange('home')}>
//                             <div className="bg-slate-900 p-2 rounded-xl text-white transition-all group-hover:bg-indigo-600">
//                                 <Briefcase size={22} />
//                             </div>
//                             <div className="ml-3">
//                                 <span className="block text-xl font-black text-slate-900 leading-none tracking-tighter">CONNECT</span>
//                                 <span className="block text-[10px] font-black text-indigo-600 tracking-[0.3em] uppercase">Staff Edition</span>
//                             </div>
//                         </div>

//                         <div className="hidden md:ml-12 md:flex md:space-x-8">
//                             <button onClick={() => onViewChange('listings')} className="text-sm font-bold text-slate-500 hover:text-slate-900">PROPIEDADES</button>
//                             <button className="text-sm font-bold text-slate-500 hover:text-slate-900">TASACIONES</button>
//                             <button className="text-sm font-bold text-slate-500 hover:text-slate-900">IDECOR MAPS</button>
//                         </div>
//                     </div>

//                     <div className="flex items-center space-x-6">
//                         {isAdmin ? (
//                             <div className="hidden lg:flex items-center gap-4 border-l border-slate-200 pl-6">
//                                 <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
//                                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
//                                     Staff Activo
//                                 </div>
//                                 <button onClick={() => onViewChange('dashboard')} className={`p-2 rounded-xl transition-all ${currentView === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-100'}`} title="Analytics">
//                                     <Settings size={20} />
//                                 </button>
//                                 <button onClick={() => onViewChange('publish')} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">
//                                     Publicar
//                                 </button>
//                             </div>
//                         ) : (
//                             <button onClick={() => onViewChange('dashboard')} className="hidden md:flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm">
//                                 <UserCircle size={20} />
//                                 Acceso Staff
//                             </button>
//                         )}

//                         <div className="md:hidden flex items-center">
//                             <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900 p-2">
//                                 {isOpen ? <X size={24} /> : <Menu size={24} />}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {isOpen && (
//                 <div className="md:hidden bg-white border-t border-slate-100 p-6 space-y-4 shadow-2xl">
//                     <button onClick={() => { onViewChange('listings'); setIsOpen(false); }} className="block w-full text-left font-black text-slate-900 text-lg uppercase tracking-tighter">Propiedades</button>
//                     <div className="h-px bg-slate-100 my-4" />
//                     {!isAdmin ? (
//                         <button onClick={() => { onViewChange('dashboard'); setIsOpen(false); }} className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-xs tracking-widest bg-indigo-50 w-full p-4 rounded-xl">Iniciar Sesión Staff</button>
//                     ) : (
//                         <>
//                             <button onClick={() => { onViewChange('dashboard'); setIsOpen(false); }} className="block w-full text-left font-bold text-slate-600 uppercase text-xs tracking-widest">Analytics Dashboard</button>
//                             <button onClick={() => { onViewChange('publish'); setIsOpen(false); }} className="flex items-center justify-center gap-2 bg-slate-900 text-white w-full py-4 rounded-xl font-black uppercase text-xs tracking-widest">NUEVA PUBLICACIÓN</button>
//                         </>
//                     )}
//                 </div>
//             )}
//         </nav>
//     );
// };

// export default Navbar;


// import React from 'react';
// import { Home, Search, LayoutDashboard, Menu, X, Settings, Briefcase } from 'lucide-react';
// import { PropertyType, TransactionType } from '../types';

// interface NavbarProps {
//     onTypeChange: (type: PropertyType | null) => void;
//     onTransactionChange: (trans: TransactionType | null) => void;
//     onViewChange: (view: 'home' | 'listings' | 'dashboard' | 'publish') => void;
//     currentView: string;
// }

// const Navbar: React.FC<NavbarProps> = ({ onTypeChange, onTransactionChange, onViewChange, currentView }) => {
//     const [isOpen, setIsOpen] = React.useState(false);

//     return (
//         <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between h-20">
//                     <div className="flex items-center">
//                         <div
//                             className="flex-shrink-0 flex items-center cursor-pointer group"
//                             onClick={() => onViewChange('home')}
//                         >
//                             <div className="bg-slate-900 p-2 rounded-xl text-white transition-all group-hover:bg-indigo-600">
//                                 <Briefcase size={24} />
//                             </div>
//                             <div className="ml-3">
//                                 <span className="block text-xl font-black text-gray-900 leading-none">CONNECT</span>
//                                 <span className="block text-xs font-bold text-indigo-600 tracking-[0.3em] uppercase">Inmobiliaria</span>
//                             </div>
//                         </div>

//                         <div className="hidden md:ml-12 md:flex md:space-x-8">
//                             <button
//                                 onClick={() => { onViewChange('listings'); onTransactionChange(TransactionType.BUY); }}
//                                 className={`px-1 py-2 text-sm font-bold border-b-2 transition-all ${currentView === 'listings' && !isOpen ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
//                             >
//                                 PROPIEDADES EN VENTA
//                             </button>
//                             <button
//                                 onClick={() => { onViewChange('listings'); onTransactionChange(TransactionType.RENT); }}
//                                 className={`px-1 py-2 text-sm font-bold border-b-2 transition-all ${currentView === 'listings' && !isOpen ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
//                             >
//                                 ALQUILERES
//                             </button>
//                             <button
//                                 className="px-1 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 border-b-2 border-transparent"
//                                 onClick={() => alert("Función de tasación online próximamente.")}
//                             >
//                                 TASACIONES
//                             </button>
//                         </div>
//                     </div>

//                     <div className="flex items-center space-x-4">
//                         <div className="hidden lg:flex items-center gap-1 text-xs font-black text-gray-400 mr-4">
//                             <span className="w-2 h-2 rounded-full bg-green-500"></span>
//                             STAFF ONLINE
//                         </div>
//                         <button
//                             onClick={() => onViewChange('dashboard')}
//                             className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
//                             title="Panel Administrativo"
//                         >
//                             <Settings size={20} />
//                         </button>
//                         <button
//                             onClick={() => onViewChange('publish')}
//                             className="hidden md:flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg"
//                         >
//                             GESTIÓN INTERNA
//                         </button>
//                         <div className="md:hidden flex items-center">
//                             <button onClick={() => setIsOpen(!isOpen)} className="text-gray-900 p-2">
//                                 {isOpen ? <X size={24} /> : <Menu size={24} />}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Mobile menu */}
//             {isOpen && (
//                 <div className="md:hidden bg-white border-t border-gray-100 p-6 space-y-4 shadow-xl">
//                     <button onClick={() => { onViewChange('listings'); onTransactionChange(TransactionType.BUY); setIsOpen(false); }} className="block w-full text-left font-black text-gray-900 text-lg uppercase">En Venta</button>
//                     <button onClick={() => { onViewChange('listings'); onTransactionChange(TransactionType.RENT); setIsOpen(false); }} className="block w-full text-left font-black text-gray-900 text-lg uppercase">Alquileres</button>
//                     <div className="h-px bg-gray-100 my-4" />
//                     <button onClick={() => { onViewChange('dashboard'); setIsOpen(false); }} className="flex items-center gap-2 text-gray-500 font-bold"><Settings size={18} /> Dashboard Agencia</button>
//                     <button onClick={() => { onViewChange('publish'); setIsOpen(false); }} className="flex items-center justify-center gap-2 bg-slate-900 text-white w-full py-4 rounded-xl font-black">NUEVA PUBLICACIÓN</button>
//                 </div>
//             )}
//         </nav>
//     );
// };

// export default Navbar;


// import React from 'react';
// import { Home, Search, LayoutDashboard, Menu, X, PlusCircle } from 'lucide-react';
// import { PropertyType, TransactionType } from '../types';

// interface NavbarProps {
//     onTypeChange: (type: PropertyType | null) => void;
//     onTransactionChange: (trans: TransactionType | null) => void;
//     onViewChange: (view: 'home' | 'listings' | 'dashboard' | 'publish') => void;
//     currentView: string;
// }

// const Navbar: React.FC<NavbarProps> = ({ onTypeChange, onTransactionChange, onViewChange, currentView }) => {
//     const [isOpen, setIsOpen] = React.useState(false);

//     return (
//         <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between h-16">
//                     <div className="flex items-center">
//                         <div
//                             className="flex-shrink-0 flex items-center cursor-pointer group"
//                             onClick={() => onViewChange('home')}
//                         >
//                             <div className="bg-indigo-600 p-1.5 rounded-lg text-white transition-all group-hover:scale-110">
//                                 <Home size={20} />
//                             </div>
//                             <span className="ml-2 text-xl font-bold text-gray-900">Connect<span className="text-indigo-600 italic">Prop</span></span>
//                         </div>

//                         <div className="hidden md:ml-8 md:flex md:space-x-4">
//                             <button
//                                 onClick={() => { onViewChange('listings'); onTransactionChange(TransactionType.BUY); }}
//                                 className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'listings' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'}`}
//                             >
//                                 Comprar
//                             </button>
//                             <button
//                                 onClick={() => { onViewChange('listings'); onTransactionChange(TransactionType.RENT); }}
//                                 className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'listings' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'}`}
//                             >
//                                 Alquilar
//                             </button>
//                             <div className="h-4 w-px bg-gray-200 self-center mx-2" />
//                             <button
//                                 onClick={() => onViewChange('dashboard')}
//                                 className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'dashboard' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'}`}
//                             >
//                                 Analítica
//                             </button>
//                         </div>
//                     </div>

//                     <div className="flex items-center space-x-3">
//                         <button
//                             onClick={() => onViewChange('publish')}
//                             className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-100"
//                         >
//                             <PlusCircle size={18} />
//                             Publicar
//                         </button>
//                         <div className="md:hidden flex items-center">
//                             <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 p-2">
//                                 {isOpen ? <X size={24} /> : <Menu size={24} />}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Mobile menu */}
//             {isOpen && (
//                 <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300">
//                     <div className="px-4 pt-2 pb-6 space-y-2">
//                         <button onClick={() => { onViewChange('publish'); setIsOpen(false); }} className="flex items-center justify-center w-full gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold mb-4">
//                             <PlusCircle size={18} /> Publicar
//                         </button>
//                         <button onClick={() => { onViewChange('listings'); onTransactionChange(TransactionType.BUY); setIsOpen(false); }} className="block w-full text-left px-3 py-3 text-gray-700 font-medium">Comprar</button>
//                         <button onClick={() => { onViewChange('listings'); onTransactionChange(TransactionType.RENT); setIsOpen(false); }} className="block w-full text-left px-3 py-3 text-gray-700 font-medium">Alquilar</button>
//                         <button onClick={() => { onViewChange('dashboard'); setIsOpen(false); }} className="block w-full text-left px-3 py-3 text-gray-700 font-medium">Analítica</button>
//                     </div>
//                 </div>
//             )}
//         </nav>
//     );
// };

// export default Navbar;
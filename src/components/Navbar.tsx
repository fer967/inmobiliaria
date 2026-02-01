import React from 'react';
import { Menu, X, Briefcase, UserCircle, LayoutDashboard, Users, PlusCircle, LogOut } from 'lucide-react';

interface NavbarProps {
    onViewChange: (view: 'home' | 'listings' | 'dashboard' | 'publish' | 'valuation', tab?: 'analytics' | 'crm') => void;
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

                            <button
                                onClick={() => onViewChange('valuation')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentView === 'valuation' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                            >
                                TASACIONES
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
                                <button className="px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50">IDECOR MAPS</button>
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
                    </button>
                    <button onClick={() => { onViewChange('valuation'); setIsOpen(false); }} className="flex items-center justify-between w-full font-black text-slate-900 text-lg uppercase tracking-tighter">
                        Tasación IA
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








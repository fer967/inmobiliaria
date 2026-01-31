import React, { useEffect, useState } from 'react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import {
    Users, TrendingUp, Landmark, Map, Search, Mail, Phone,
    ExternalLink, CheckCircle2, Clock, AlertCircle, X, ChevronRight,
    Activity, ArrowUpRight
} from 'lucide-react';
import { fetchLeads, updateLeadStatus, fetchStats } from '../services/apiService';

interface DashboardProps {
    initialTab?: 'analytics' | 'crm';
}

const Dashboard: React.FC<DashboardProps> = ({ initialTab = 'analytics' }) => {
    const [activeTab, setActiveTab] = useState<'analytics' | 'crm'>(initialTab);
    const [leads, setLeads] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({ visitas_hoy: 0, leads_totales: 0, leads_nuevos: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLead, setSelectedLead] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    // Sincronizar el estado interno si la prop cambia desde el Navbar
    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const trendData = [
        { day: 'Lun', visitas: 1200, leads: 12 },
        { day: 'Mar', visitas: 1500, leads: 18 },
        { day: 'Mie', visitas: 1100, leads: 10 },
        { day: 'Jue', visitas: 1800, leads: 25 },
        { day: 'Vie', visitas: 2100, leads: 32 },
        { day: 'Sab', visitas: 1600, leads: 15 },
        { day: 'Dom', visitas: 900, leads: 8 },
    ];

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        const [leadsData, statsData] = await Promise.all([fetchLeads(), fetchStats()]);
        setLeads(leadsData);
        setStats(statsData);
        setLoading(false);
    };

    const handleStatusChange = async (email: string, newStatus: string) => {
        const success = await updateLeadStatus(email, newStatus);
        if (success) {
            setLeads(leads.map(l => l.email === email ? { ...l, status: newStatus } : l));
            if (selectedLead?.email === email) setSelectedLead({ ...selectedLead, status: newStatus });
            const updatedStats = await fetchStats();
            setStats(updatedStats);
        }
    };

    const filteredLeads = leads.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.property_id && l.property_id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-8 bg-slate-50/50 min-h-screen">
            <div className="max-w-7xl mx-auto">

                {/* HEADER & TAB NAVIGATION */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-1 bg-indigo-600 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Administrative Suite</span>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
                            {activeTab === 'analytics' ? 'Performance Hub' : 'Lead Manager'}
                        </h1>
                        <p className="text-slate-400 font-medium text-lg mt-2">Control centralizado de operaciones y conversiones.</p>
                    </div>

                    <div className="bg-white p-1.5 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex gap-2">
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
                        >
                            <Activity size={16} />
                            Métricas
                        </button>
                        <button
                            onClick={() => setActiveTab('crm')}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'crm' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
                        >
                            <Users size={16} />
                            CRM Leads
                            {stats.leads_nuevos > 0 && (
                                <span className="bg-white text-emerald-600 px-2 py-0.5 rounded-md text-[8px] font-black">{stats.leads_nuevos}</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* TOP STATS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <StatCard icon={<Users />} label="Tráfico Web" value={stats.visitas_hoy.toLocaleString()} trend="+12%" color="indigo" />
                    <StatCard icon={<TrendingUp />} label="Nuevos Leads" value={stats.leads_nuevos} trend="Hoy" color="emerald" />
                    <StatCard icon={<Landmark />} label="Total CRM" value={stats.leads_totales} trend="Acumulado" color="amber" />
                    <StatCard icon={<Map />} label="API IDECOR" value="Sync OK" trend="Real-time" color="slate" />
                </div>

                {activeTab === 'analytics' ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Tráfico Semanal vs Conversión</h3>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-2 rounded-xl">Últimos 7 días</div>
                                </div>
                                <div className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={trendData}>
                                            <defs>
                                                <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                            <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)' }} />
                                            <Area type="monotone" dataKey="visitas" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorVisitas)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl flex flex-col justify-between h-[280px]">
                                    <div>
                                        <ArrowUpRight className="text-indigo-400 mb-6" size={32} />
                                        <h4 className="text-2xl font-black tracking-tight mb-2">Tasa de Cierre</h4>
                                        <p className="text-slate-400 font-medium">15% de los leads del mes han concretado reserva.</p>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <span className="text-5xl font-black">15.4%</span>
                                        <div className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-lg text-xs font-bold">+2.1%</div>
                                    </div>
                                </div>

                                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex-1">
                                    <h4 className="text-lg font-black text-slate-900 mb-6">Fuentes de Leads</h4>
                                    <div className="space-y-6">
                                        <SourceProgress label="Búsqueda Directa" value={65} color="indigo" />
                                        <SourceProgress label="Redes Sociales" value={20} color="emerald" />
                                        <SourceProgress label="Portales Inmob." value={15} color="amber" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden min-h-[600px] flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="relative w-full md:w-[400px]">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                <input
                                    type="text"
                                    placeholder="Buscar por cliente o propiedad..."
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-3xl outline-none transition-all font-bold text-sm text-slate-900"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button onClick={loadDashboardData} className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all">
                                Actualizar CRM
                            </button>
                        </div>

                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/30 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <th className="px-10 py-8">Información del Cliente</th>
                                        <th className="px-10 py-8">Fecha</th>
                                        <th className="px-10 py-8">Referencia</th>
                                        <th className="px-10 py-8">Estado Actual</th>
                                        <th className="px-10 py-8 text-right">Detalles</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredLeads.map((lead, idx) => (
                                        <tr
                                            key={idx}
                                            onClick={() => setSelectedLead(lead)}
                                            className="hover:bg-slate-50/50 transition-all cursor-pointer group"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg">
                                                        {lead.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <span className="font-black text-slate-900 block text-lg">{lead.name}</span>
                                                        <span className="text-sm text-slate-400 font-medium">{lead.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-sm font-bold text-slate-500">
                                                {new Date(lead.timestamp).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl w-fit flex items-center gap-2">
                                                    #{lead.property_id || 'N/A'}
                                                    <ExternalLink size={12} />
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <StatusBadge status={lead.status || 'Nuevo'} />
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <button className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                                                    <ChevronRight size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredLeads.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-10 py-32 text-center">
                                                <AlertCircle className="mx-auto text-slate-200 mb-6" size={64} />
                                                <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Sin leads registrados</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* LEAD DETAIL MODAL (SIDE DRAWER) */}
            {selectedLead && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white h-full w-full max-w-xl shadow-2xl p-12 overflow-y-auto animate-in slide-in-from-right duration-500">
                        <div className="flex justify-between items-center mb-12">
                            <StatusBadge status={selectedLead.status} />
                            <button onClick={() => setSelectedLead(null)} className="p-3 hover:bg-slate-100 rounded-full transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-10">
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{selectedLead.name}</h2>
                                <p className="text-slate-400 text-lg font-medium">Interesado en propiedad #{selectedLead.property_id || 'N/A'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <a href={`mailto:${selectedLead.email}`} className="p-6 bg-slate-50 rounded-[2rem] flex flex-col gap-2 hover:bg-indigo-50 transition-all group">
                                    <Mail className="text-indigo-600 mb-2" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enviar Correo</span>
                                    <span className="text-sm font-bold text-slate-900 truncate">{selectedLead.email}</span>
                                </a>
                                <a href={`tel:${selectedLead.phone}`} className="p-6 bg-slate-50 rounded-[2rem] flex flex-col gap-2 hover:bg-emerald-50 transition-all">
                                    <Phone className="text-emerald-600 mb-2" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Llamar Ahora</span>
                                    <span className="text-sm font-bold text-slate-900">{selectedLead.phone}</span>
                                </a>
                            </div>

                            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Mensaje del Cliente</h4>
                                <p className="text-slate-700 text-lg font-medium leading-relaxed italic">"{selectedLead.message}"</p>
                            </div>

                            <div className="pt-10 border-t border-slate-100 space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Gestionar Estado</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleStatusChange(selectedLead.email, 'Contactado')}
                                        className="flex items-center justify-center gap-3 py-5 bg-amber-50 text-amber-600 rounded-2xl font-black text-xs uppercase tracking-widest border border-amber-100 hover:bg-amber-100 transition-all">
                                        <Clock size={16} />
                                        En Proceso
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(selectedLead.email, 'Cerrado')}
                                        className="flex items-center justify-center gap-3 py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all">
                                        <CheckCircle2 size={16} />
                                        Cerrado
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ icon, label, value, trend, color }: any) => {
    const colorMap: any = {
        indigo: 'bg-indigo-600 text-white shadow-indigo-100',
        emerald: 'bg-emerald-600 text-white shadow-emerald-100',
        amber: 'bg-amber-500 text-white shadow-amber-100',
        slate: 'bg-slate-900 text-white shadow-slate-100'
    };

    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${colorMap[color]}`}>{icon}</div>
                <span className="text-[10px] font-black px-3 py-1 bg-slate-50 text-slate-400 rounded-lg uppercase tracking-widest">{trend}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        'Nuevo': 'bg-indigo-50 text-indigo-600 border-indigo-100',
        'Contactado': 'bg-amber-50 text-amber-600 border-amber-100',
        'Cerrado': 'bg-emerald-50 text-emerald-600 border-emerald-100'
    };
    return (
        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles['Nuevo']}`}>
            {status}
        </span>
    );
};

const SourceProgress = ({ label, value, color }: any) => {
    const colors: any = { indigo: 'bg-indigo-600', emerald: 'bg-emerald-600', amber: 'bg-amber-500' };
    return (
        <div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                <span className="text-slate-500">{label}</span>
                <span className="text-slate-900">{value}%</span>
            </div>
            <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                <div className={`h-full ${colors[color]} rounded-full`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
};

export default Dashboard;



// import React, { useEffect, useState } from 'react';
// import {
//     BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
//     AreaChart, Area
// } from 'recharts';
// import {
//     Users, TrendingUp, Landmark, Map, Search, Filter, Mail, Phone,
//     ExternalLink, CheckCircle2, Clock, AlertCircle, X, ChevronRight,
//     PieChart as PieIcon, Activity, ArrowUpRight
// } from 'lucide-react';
// import { fetchLeads, updateLeadStatus, fetchStats } from '../services/apiService';

// const Dashboard: React.FC = () => {
//     const [activeTab, setActiveTab] = useState<'analytics' | 'crm'>('analytics');
//     const [leads, setLeads] = useState<any[]>([]);
//     const [stats, setStats] = useState<any>({ visitas_hoy: 0, leads_totales: 0, leads_nuevos: 0 });
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedLead, setSelectedLead] = useState<any | null>(null);
//     const [loading, setLoading] = useState(true);

//     // Datos simulados para tendencia (en producción vendrían del backend/GA4)
//     const trendData = [
//         { day: 'Lun', visitas: 1200, leads: 12 },
//         { day: 'Mar', visitas: 1500, leads: 18 },
//         { day: 'Mie', visitas: 1100, leads: 10 },
//         { day: 'Jue', visitas: 1800, leads: 25 },
//         { day: 'Vie', visitas: 2100, leads: 32 },
//         { day: 'Sab', visitas: 1600, leads: 15 },
//         { day: 'Dom', visitas: 900, leads: 8 },
//     ];

//     useEffect(() => {
//         loadDashboardData();
//     }, []);

//     const loadDashboardData = async () => {
//         setLoading(true);
//         const [leadsData, statsData] = await Promise.all([fetchLeads(), fetchStats()]);
//         setLeads(leadsData);
//         setStats(statsData);
//         setLoading(false);
//     };

//     const handleStatusChange = async (email: string, newStatus: string) => {
//         const success = await updateLeadStatus(email, newStatus);
//         if (success) {
//             setLeads(leads.map(l => l.email === email ? { ...l, status: newStatus } : l));
//             if (selectedLead?.email === email) setSelectedLead({ ...selectedLead, status: newStatus });
//             // Actualizar contadores locales
//             const updatedStats = await fetchStats();
//             setStats(updatedStats);
//         }
//     };

//     const filteredLeads = leads.filter(l =>
//         l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         l.property_id.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="p-8 bg-slate-50/50 min-h-screen">
//             <div className="max-w-7xl mx-auto">

//                 {/* HEADER & TAB NAVIGATION */}
//                 <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
//                     <div>
//                         <div className="flex items-center gap-3 mb-2">
//                             <div className="w-10 h-1 bg-indigo-600 rounded-full"></div>
//                             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Administrative Suite</span>
//                         </div>
//                         <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
//                             {activeTab === 'analytics' ? 'Performance Hub' : 'Lead Manager'}
//                         </h1>
//                         <p className="text-slate-400 font-medium text-lg mt-2">Control centralizado de operaciones y conversiones.</p>
//                     </div>

//                     <div className="bg-white p-1.5 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex gap-2">
//                         <button
//                             onClick={() => setActiveTab('analytics')}
//                             className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
//                         >
//                             <Activity size={16} />
//                             Métricas
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('crm')}
//                             className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'crm' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
//                         >
//                             <Users size={16} />
//                             CRM Leads
//                             {stats.leads_nuevos > 0 && (
//                                 <span className="bg-white text-emerald-600 px-2 py-0.5 rounded-md text-[8px]">{stats.leads_nuevos}</span>
//                             )}
//                         </button>
//                     </div>
//                 </div>

//                 {/* TOP STATS */}
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
//                     <StatCard icon={<Users />} label="Tráfico Web" value={stats.visitas_hoy.toLocaleString()} trend="+12%" color="indigo" />
//                     <StatCard icon={<TrendingUp />} label="Nuevos Leads" value={stats.leads_nuevos} trend="Hoy" color="emerald" />
//                     <StatCard icon={<Landmark />} label="Total CRM" value={stats.leads_totales} trend="Acumulado" color="amber" />
//                     <StatCard icon={<Map />} label="API IDECOR" value="Sync OK" trend="Real-time" color="slate" />
//                 </div>

//                 {activeTab === 'analytics' ? (
//                     <div className="space-y-8">
//                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                             <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
//                                 <div className="flex justify-between items-center mb-10">
//                                     <h3 className="text-xl font-black text-slate-900 tracking-tight">Tráfico Semanal vs Conversión</h3>
//                                     <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-500 outline-none">
//                                         <Last7Days />
//                                     </select>
//                                 </div>
//                                 <div className="h-[400px]">
//                                     <ResponsiveContainer width="100%" height="100%">
//                                         <AreaChart data={trendData}>
//                                             <defs>
//                                                 <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
//                                                     <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
//                                                     <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
//                                                 </linearGradient>
//                                             </defs>
//                                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                                             <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
//                                             <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
//                                             <Tooltip
//                                                 contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)' }}
//                                             />
//                                             <Area type="monotone" dataKey="visitas" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorVisitas)" />
//                                         </AreaChart>
//                                     </ResponsiveContainer>
//                                 </div>
//                             </div>

//                             <div className="space-y-8">
//                                 <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl flex flex-col justify-between h-[280px]">
//                                     <div>
//                                         <ArrowUpRight className="text-indigo-400 mb-6" size={32} />
//                                         <h4 className="text-2xl font-black tracking-tight mb-2">Tasa de Cierre</h4>
//                                         <p className="text-slate-400 font-medium">15% de los leads del mes han concretado reserva.</p>
//                                     </div>
//                                     <div className="flex items-end justify-between">
//                                         <span className="text-5xl font-black">15.4%</span>
//                                         <div className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-lg text-xs font-bold">+2.1%</div>
//                                     </div>
//                                 </div>

//                                 <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex-1">
//                                     <h4 className="text-lg font-black text-slate-900 mb-6">Fuentes de Leads</h4>
//                                     <div className="space-y-6">
//                                         <SourceProgress label="Búsqueda Directa" value={65} color="indigo" />
//                                         <SourceProgress label="Redes Sociales" value={20} color="emerald" />
//                                         <SourceProgress label="Portales Inmob." value={15} color="amber" />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden min-h-[600px] flex flex-col">
//                         <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
//                             <div className="relative w-full md:w-[400px]">
//                                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
//                                 <input
//                                     type="text"
//                                     placeholder="Buscar por cliente o propiedad..."
//                                     className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-3xl outline-none transition-all font-bold text-sm text-slate-900"
//                                     value={searchTerm}
//                                     onChange={e => setSearchTerm(e.target.value)}
//                                 />
//                             </div>
//                             <div className="flex gap-4">
//                                 <button onClick={loadDashboardData} className="p-5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl transition-all">
//                                     <Clock size={20} />
//                                 </button>
//                                 <button className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all">
//                                     <Filter size={14} />
//                                     Filtrar Vista
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="flex-1 overflow-x-auto">
//                             <table className="w-full text-left">
//                                 <thead>
//                                     <tr className="bg-slate-50/30 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
//                                         <th className="px-10 py-8">Información del Cliente</th>
//                                         <th className="px-10 py-8">Fecha</th>
//                                         <th className="px-10 py-8">Referencia</th>
//                                         <th className="px-10 py-8">Estado Actual</th>
//                                         <th className="px-10 py-8 text-right">Detalles</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-slate-50">
//                                     {filteredLeads.map((lead, idx) => (
//                                         <tr
//                                             key={idx}
//                                             onClick={() => setSelectedLead(lead)}
//                                             className="hover:bg-slate-50/50 transition-all cursor-pointer group"
//                                         >
//                                             <td className="px-10 py-8">
//                                                 <div className="flex items-center gap-4">
//                                                     <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg">
//                                                         {lead.name.charAt(0)}
//                                                     </div>
//                                                     <div>
//                                                         <span className="font-black text-slate-900 block text-lg">{lead.name}</span>
//                                                         <span className="text-sm text-slate-400 font-medium">{lead.email}</span>
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                             <td className="px-10 py-8 text-sm font-bold text-slate-500">
//                                                 {new Date(lead.timestamp).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
//                                             </td>
//                                             <td className="px-10 py-8">
//                                                 <div className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl w-fit flex items-center gap-2">
//                                                     #{lead.property_id}
//                                                     <ExternalLink size={12} />
//                                                 </div>
//                                             </td>
//                                             <td className="px-10 py-8">
//                                                 <StatusBadge status={lead.status || 'Nuevo'} />
//                                             </td>
//                                             <td className="px-10 py-8 text-right">
//                                                 <button className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
//                                                     <ChevronRight size={20} />
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* LEAD DETAIL MODAL */}
//             {selectedLead && (
//                 <div className="fixed inset-0 z-[100] flex items-center justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
//                     <div className="bg-white h-full w-full max-w-xl shadow-2xl p-12 overflow-y-auto animate-in slide-in-from-right duration-500">
//                         <div className="flex justify-between items-center mb-12">
//                             <StatusBadge status={selectedLead.status} />
//                             <button onClick={() => setSelectedLead(null)} className="p-3 hover:bg-slate-100 rounded-full transition-all">
//                                 <X size={24} />
//                             </button>
//                         </div>

//                         <div className="space-y-10">
//                             <div>
//                                 <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{selectedLead.name}</h2>
//                                 <p className="text-slate-400 text-lg font-medium">Interesado en propiedad #{selectedLead.property_id}</p>
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <a href={`mailto:${selectedLead.email}`} className="p-6 bg-slate-50 rounded-[2rem] flex flex-col gap-2 hover:bg-indigo-50 transition-all group">
//                                     <Mail className="text-indigo-600 mb-2" />
//                                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enviar Correo</span>
//                                     <span className="text-sm font-bold text-slate-900 truncate">{selectedLead.email}</span>
//                                 </a>
//                                 <a href={`tel:${selectedLead.phone}`} className="p-6 bg-slate-50 rounded-[2rem] flex flex-col gap-2 hover:bg-emerald-50 transition-all">
//                                     <Phone className="text-emerald-600 mb-2" />
//                                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Llamar Ahora</span>
//                                     <span className="text-sm font-bold text-slate-900">{selectedLead.phone}</span>
//                                 </a>
//                             </div>

//                             <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
//                                 <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Mensaje del Cliente</h4>
//                                 <p className="text-slate-700 text-lg font-medium leading-relaxed italic">"{selectedLead.message}"</p>
//                             </div>

//                             <div className="pt-10 border-t border-slate-100 space-y-4">
//                                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Gestionar Estado</h4>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <button
//                                         onClick={() => handleStatusChange(selectedLead.email, 'Contactado')}
//                                         className="flex items-center justify-center gap-3 py-5 bg-amber-50 text-amber-600 rounded-2xl font-black text-xs uppercase tracking-widest border border-amber-100 hover:bg-amber-100 transition-all">
//                                         <Clock size={16} />
//                                         En Proceso
//                                     </button>
//                                     <button
//                                         onClick={() => handleStatusChange(selectedLead.email, 'Cerrado')}
//                                         className="flex items-center justify-center gap-3 py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all">
//                                         <CheckCircle2 size={16} />
//                                         Venta/Alquiler
//                                     </button>
//                                 </div>
//                                 <button
//                                     onClick={() => handleStatusChange(selectedLead.email, 'Nuevo')}
//                                     className="w-full py-5 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-all">
//                                     Resetear a Nuevo
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// const StatCard = ({ icon, label, value, trend, color }: any) => {
//     const colorMap: any = {
//         indigo: 'bg-indigo-600 text-white shadow-indigo-100',
//         emerald: 'bg-emerald-600 text-white shadow-emerald-100',
//         amber: 'bg-amber-500 text-white shadow-amber-100',
//         slate: 'bg-slate-900 text-white shadow-slate-100'
//     };

//     return (
//         <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
//             <div className="flex justify-between items-start mb-6">
//                 <div className={`p-4 rounded-2xl ${colorMap[color]}`}>{icon}</div>
//                 <span className="text-[10px] font-black px-3 py-1 bg-slate-50 text-slate-400 rounded-lg uppercase tracking-widest">{trend}</span>
//             </div>
//             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
//             <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
//         </div>
//     );
// };

// const StatusBadge = ({ status }: { status: string }) => {
//     const styles: any = {
//         'Nuevo': 'bg-indigo-50 text-indigo-600 border-indigo-100',
//         'Contactado': 'bg-amber-50 text-amber-600 border-amber-100',
//         'Cerrado': 'bg-emerald-50 text-emerald-600 border-emerald-100'
//     };
//     return (
//         <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles['Nuevo']}`}>
//             {status}
//         </span>
//     );
// };

// const SourceProgress = ({ label, value, color }: any) => {
//     const colors: any = { indigo: 'bg-indigo-600', emerald: 'bg-emerald-600', amber: 'bg-amber-500' };
//     return (
//         <div>
//             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
//                 <span className="text-slate-500">{label}</span>
//                 <span className="text-slate-900">{value}%</span>
//             </div>
//             <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
//                 <div className={`h-full ${colors[color]} rounded-full`} style={{ width: `${value}%` }} />
//             </div>
//         </div>
//     );
// };

// const Last7Days = () => (
//     <>
//         <option>Últimos 7 días</option>
//         <option>Últimos 30 días</option>
//         <option>Mes en curso</option>
//     </>
// );

// export default Dashboard;


// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
// import { Users, TrendingUp, Landmark, Map, Search, Mail, Phone, ExternalLink, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
// import { fetchLeads, updateLeadStatus, fetchStats } from '../services/apiService';

// const Dashboard: React.FC = () => {
//     const [activeTab, setActiveTab] = useState<'analytics' | 'crm'>('analytics');
//     const [leads, setLeads] = useState<any[]>([]);
//     const [stats, setStats] = useState<any>({ visitas_hoy: 0, leads_totales: 0, leads_nuevos: 0 });
//     const [searchTerm, setSearchTerm] = useState('');
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         loadDashboardData();
//     }, []);

//     const loadDashboardData = async () => {
//         // Fixed: 'True' is not a valid boolean in JavaScript, must use 'true'
//         setLoading(true);
//         const [leadsData, statsData] = await Promise.all([fetchLeads(), fetchStats()]);
//         setLeads(leadsData);
//         setStats(statsData);
//         setLoading(false);
//     };

//     const handleStatusChange = async (email: string, newStatus: string) => {
//         const success = await updateLeadStatus(email, newStatus);
//         if (success) {
//             setLeads(leads.map(l => l.email === email ? { ...l, status: newStatus } : l));
//         }
//     };

//     const filteredLeads = leads.filter(l =>
//         l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         l.email.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const chartData = [
//         { name: 'Nuevos', value: stats.leads_nuevos, color: '#4f46e5' },
//         { name: 'Totales', value: stats.leads_totales, color: '#0ea5e9' },
//     ];

//     return (
//         <div className="p-8 bg-slate-50/50 min-h-screen">
//             <div className="max-w-7xl mx-auto">
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
//                     <div>
//                         <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Panel de Gestión Staff</h1>
//                         <p className="text-slate-500 font-medium">Consolidado GA4 + CRM Connect Inmobiliaria</p>
//                     </div>

//                     <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 flex">
//                         <button
//                             onClick={() => setActiveTab('analytics')}
//                             className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
//                         >
//                             Métricas
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('crm')}
//                             className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'crm' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
//                         >
//                             CRM Leads ({stats.leads_nuevos})
//                         </button>
//                     </div>
//                 </div>

//                 {/* STATS CARDS */}
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
//                     <StatCard icon={<Users />} label="Visitas Hoy" value={stats.visitas_hoy.toLocaleString()} color="blue" />
//                     <StatCard icon={<TrendingUp />} label="Nuevos Leads" value={stats.leads_nuevos} color="green" />
//                     <StatCard icon={<Landmark />} label="Leads Totales" value={stats.leads_totales} color="indigo" />
//                     <StatCard icon={<Map />} label="API IDECOR" value="Online" color="emerald" />
//                 </div>

//                 {activeTab === 'analytics' ? (
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                         <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
//                             <h3 className="text-xl font-black mb-8 text-slate-900 tracking-tight">Actividad de Conversión</h3>
//                             <div className="h-80">
//                                 <ResponsiveContainer width="100%" height="100%">
//                                     <BarChart data={chartData}>
//                                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                                         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
//                                         <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
//                                         <Tooltip
//                                             cursor={{ fill: '#f8fafc' }}
//                                             contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '1rem' }}
//                                         />
//                                         <Bar dataKey="value" radius={[8, 8, 0, 0]}>
//                                             {chartData.map((entry, index) => (
//                                                 <Cell key={`cell-${index}`} fill={entry.color} />
//                                             ))}
//                                         </Bar>
//                                     </BarChart>
//                                 </ResponsiveContainer>
//                             </div>
//                         </div>

//                         <div className="bg-indigo-600 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 flex flex-col justify-between">
//                             <div>
//                                 <SparklesIcon className="mb-6 opacity-40" size={40} />
//                                 <h4 className="text-2xl font-black tracking-tight mb-4">Meta del Mes</h4>
//                                 <p className="text-indigo-100 font-medium mb-8">Llevamos 45 de 100 leads procesados. ¡Gran trabajo del equipo comercial!</p>
//                             </div>
//                             <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md">
//                                 <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3">
//                                     <span>Progreso</span>
//                                     <span>45%</span>
//                                 </div>
//                                 <div className="h-2 bg-white/20 rounded-full overflow-hidden">
//                                     <div className="h-full bg-white w-[45%] rounded-full" />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
//                         <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
//                             <div className="relative w-full md:w-96">
//                                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                                 <input
//                                     type="text"
//                                     placeholder="Buscar por nombre o correo..."
//                                     className="w-full pl-12 pr-6 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-bold text-sm"
//                                     value={searchTerm}
//                                     onChange={e => setSearchTerm(e.target.value)}
//                                 />
//                             </div>
//                             <button onClick={loadDashboardData} className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:bg-indigo-50 px-6 py-3 rounded-xl transition-all">
//                                 Actualizar Lista
//                             </button>
//                         </div>

//                         <div className="overflow-x-auto">
//                             <table className="w-full text-left">
//                                 <thead>
//                                     <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
//                                         <th className="px-8 py-6">Interesado</th>
//                                         <th className="px-8 py-6">Contacto</th>
//                                         <th className="px-8 py-6">Fecha</th>
//                                         <th className="px-8 py-6">ID Propiedad</th>
//                                         <th className="px-8 py-6">Estado</th>
//                                         <th className="px-8 py-6 text-right">Acción</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-slate-50">
//                                     {filteredLeads.map((lead, idx) => (
//                                         <tr key={idx} className="hover:bg-slate-50/30 transition-colors group">
//                                             <td className="px-8 py-6">
//                                                 <span className="font-black text-slate-900 block">{lead.name}</span>
//                                                 <span className="text-xs text-slate-400 font-medium truncate max-w-[200px] block">{lead.message}</span>
//                                             </td>
//                                             <td className="px-8 py-6">
//                                                 <div className="flex flex-col gap-1">
//                                                     <a href={`mailto:${lead.email}`} className="flex items-center text-xs font-bold text-slate-500 hover:text-indigo-600">
//                                                         <Mail size={12} className="mr-2" /> {lead.email}
//                                                     </a>
//                                                     <a href={`tel:${lead.phone}`} className="flex items-center text-xs font-bold text-slate-500 hover:text-indigo-600">
//                                                         <Phone size={12} className="mr-2" /> {lead.phone}
//                                                     </a>
//                                                 </div>
//                                             </td>
//                                             <td className="px-8 py-6 text-xs font-bold text-slate-400">
//                                                 {new Date(lead.timestamp).toLocaleDateString()}
//                                             </td>
//                                             <td className="px-8 py-6">
//                                                 <div className="flex items-center gap-2 text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg w-fit">
//                                                     {lead.property_id}
//                                                     <ExternalLink size={10} />
//                                                 </div>
//                                             </td>
//                                             <td className="px-8 py-6">
//                                                 <StatusBadge status={lead.status || 'Nuevo'} />
//                                             </td>
//                                             <td className="px-8 py-6 text-right">
//                                                 <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                                                     <button
//                                                         onClick={() => handleStatusChange(lead.email, 'Contactado')}
//                                                         className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Marcar como Contactado">
//                                                         <Clock size={18} />
//                                                     </button>
//                                                     <button
//                                                         onClick={() => handleStatusChange(lead.email, 'Cerrado')}
//                                                         className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Marcar como Cerrado">
//                                                         <CheckCircle2 size={18} />
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                     {filteredLeads.length === 0 && (
//                                         <tr>
//                                             <td colSpan={6} className="px-8 py-20 text-center">
//                                                 <AlertCircle className="mx-auto text-slate-200 mb-4" size={48} />
//                                                 <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No se encontraron leads</p>
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// const StatCard = ({ icon, label, value, color }: { icon: any, label: string, value: any, color: string }) => {
//     const colors: any = {
//         blue: 'bg-blue-50 text-blue-600',
//         green: 'bg-emerald-50 text-emerald-600',
//         indigo: 'bg-indigo-50 text-indigo-600',
//         emerald: 'bg-emerald-50 text-emerald-600'
//     };
//     return (
//         <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
//             <div className={`p-4 rounded-2xl ${colors[color] || 'bg-slate-50 text-slate-600'}`}>{icon}</div>
//             <div>
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
//                 <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
//             </div>
//         </div>
//     );
// };

// const StatusBadge = ({ status }: { status: string }) => {
//     const styles: any = {
//         'Nuevo': 'bg-indigo-50 text-indigo-600 border-indigo-100',
//         'Contactado': 'bg-amber-50 text-amber-600 border-amber-100',
//         'Cerrado': 'bg-emerald-50 text-emerald-600 border-emerald-100'
//     };
//     return (
//         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles['Nuevo']}`}>
//             {status}
//         </span>
//     );
// };

// const SparklesIcon = ({ className, size }: { className?: string, size: number }) => (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//         <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
//         <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
//     </svg>
// );

// export default Dashboard;


// import React from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// import { Users, TrendingUp, Landmark, Map } from 'lucide-react';

// const Dashboard: React.FC = () => {
//     const barData = [
//         { name: 'Casas', leads: 45, views: 1200 },
//         { name: 'Deptos', leads: 82, views: 3400 },
//         { name: 'Lotes', leads: 15, views: 800 },
//         { name: 'Oficinas', leads: 8, views: 400 },
//     ];

//     const pieData = [
//         { name: 'Capital', value: 65 },
//         { name: 'Gran Cba', value: 25 },
//         { name: 'Sierras', value: 10 },
//     ];

//     const COLORS = ['#4f46e5', '#818cf8', '#c7d2fe'];

//     return (
//         <div className="p-8 bg-gray-50 min-h-screen">
//             <div className="mb-8">
//                 <h1 className="text-3xl font-bold text-gray-900">Analytics & Métricas</h1>
//                 <p className="text-gray-500">Consolidado GA4 + CRM ConnectProp</p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
//                     <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users /></div>
//                     <div>
//                         <p className="text-sm text-gray-500">Visitas Hoy</p>
//                         <p className="text-2xl font-bold">1,429</p>
//                     </div>
//                 </div>
//                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
//                     <div className="p-3 bg-green-100 text-green-600 rounded-lg"><TrendingUp /></div>
//                     <div>
//                         <p className="text-sm text-gray-500">Nuevos Leads</p>
//                         <p className="text-2xl font-bold">24</p>
//                     </div>
//                 </div>
//                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
//                     <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Landmark /></div>
//                     <div>
//                         <p className="text-sm text-gray-500">Consultas IDECOR</p>
//                         <p className="text-2xl font-bold">156</p>
//                     </div>
//                 </div>
//                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
//                     <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><Map /></div>
//                     <div>
//                         <p className="text-sm text-gray-500">CTR Mapas</p>
//                         <p className="text-2xl font-bold">12.5%</p>
//                     </div>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//                     <h3 className="text-lg font-bold mb-6 text-gray-800">Interés por Tipo de Propiedad</h3>
//                     <div className="h-80">
//                         <ResponsiveContainer width="100%" height="100%">
//                             <BarChart data={barData}>
//                                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                                 <XAxis dataKey="name" />
//                                 <YAxis />
//                                 <Tooltip
//                                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
//                                 />
//                                 <Bar dataKey="leads" fill="#4f46e5" radius={[4, 4, 0, 0]} />
//                             </BarChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>

//                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//                     <h3 className="text-lg font-bold mb-6 text-gray-800">Distribución Geográfica</h3>
//                     <div className="h-80 flex items-center justify-center">
//                         <ResponsiveContainer width="100%" height="100%">
//                             <PieChart>
//                                 <Pie
//                                     data={pieData}
//                                     cx="50%"
//                                     cy="50%"
//                                     innerRadius={60}
//                                     outerRadius={100}
//                                     paddingAngle={5}
//                                     dataKey="value"
//                                 >
//                                     {pieData.map((entry, index) => (
//                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip />
//                             </PieChart>
//                         </ResponsiveContainer>
//                         <div className="space-y-2">
//                             {pieData.map((item, i) => (
//                                 <div key={item.name} className="flex items-center space-x-2">
//                                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
//                                     <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;
import React, { useEffect, useState } from 'react';
import {
    Users, TrendingUp, Map, Search, Mail, Phone,
    ExternalLink, X, ChevronRight,
    LayoutGrid, List, MessageSquare, Tag, Plus
} from 'lucide-react';
import { fetchLeads, updateLeadStatus, fetchStats } from '../services/apiService';
import { LeadStatus } from '../types';

interface DashboardProps {
    initialTab?: 'analytics' | 'crm';
}

const Dashboard: React.FC<DashboardProps> = ({ initialTab = 'analytics' }) => {
    const [activeTab, setActiveTab] = useState<'analytics' | 'crm'>(initialTab);
    const [viewMode, setViewMode] = useState<'list' | 'pipeline'>('pipeline');
    const [leads, setLeads] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({ visitas_hoy: 0, leads_totales: 0, leads_nuevos: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLead, setSelectedLead] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

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
        }
    };

    const filteredLeads = leads.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.property_id && l.property_id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const pipelineColumns = [
        { id: LeadStatus.NEW, label: 'Nuevos', color: 'bg-indigo-500' },
        { id: LeadStatus.CONTACTED, label: 'Contactados', color: 'bg-amber-500' },
        { id: LeadStatus.VISIT, label: 'Citas', color: 'bg-emerald-500' },
        { id: LeadStatus.NEGOTIATION, label: 'Cierre', color: 'bg-rose-500' }
    ];

    const renderPipeline = () => (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full pb-10">
            {pipelineColumns.map(col => (
                <div key={col.id} className="bg-slate-50/50 rounded-[2rem] p-4 flex flex-col border border-slate-100 min-h-[500px]">
                    <div className="flex justify-between items-center mb-6 px-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{col.label}</h3>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 bg-white px-2 py-1 rounded-lg">
                            {filteredLeads.filter(l => l.status === col.id).length}
                        </span>
                    </div>
                    <div className="space-y-4 flex-1">
                        {filteredLeads.filter(l => l.status === col.id).map(lead => (
                            <div
                                key={lead.id}
                                onClick={() => setSelectedLead(lead)}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                                        {lead.name.charAt(0)}
                                    </div>
                                    <button className="text-slate-300 group-hover:text-indigo-600 transition-colors"><ChevronRight size={16} /></button>
                                </div>
                                <h4 className="font-black text-slate-900 text-sm mb-1">{lead.name}</h4>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 mb-4">
                                    <Tag size={10} />
                                    Prop: {lead.property_id || 'Consulta Gral'}
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <span className="text-[9px] font-bold text-slate-400">{new Date(lead.timestamp).toLocaleDateString()}</span>
                                    {lead.phone && <Phone size={12} className="text-slate-300" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="p-8 bg-slate-50/50 min-h-screen">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-1 bg-indigo-600 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Connect Suite v2.0</span>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
                            {activeTab === 'analytics' ? 'Performance' : 'Pipeline Inmobiliario'}
                        </h1>
                    </div>

                    <div className="bg-white p-1.5 rounded-[2rem] shadow-xl border border-slate-100 flex gap-2">
                        <button onClick={() => setActiveTab('analytics')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}>Métricas</button>
                        <button onClick={() => setActiveTab('crm')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'crm' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}>CRM</button>
                    </div>
                </div>

                {activeTab === 'crm' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 gap-6">
                            <div className="relative w-full md:w-[400px]">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                <input
                                    type="text"
                                    placeholder="Buscar cliente..."
                                    className="w-full pl-16 pr-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl">
                                <button onClick={() => setViewMode('pipeline')} className={`p-3 rounded-xl transition-all ${viewMode === 'pipeline' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><LayoutGrid size={20} /></button>
                                <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><List size={20} /></button>
                            </div>
                        </div>

                        {viewMode === 'pipeline' ? renderPipeline() : (
                            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <th className="px-10 py-6">Cliente</th>
                                            <th className="px-10 py-6">Estado</th>
                                            <th className="px-10 py-6">Fecha</th>
                                            <th className="px-10 py-6">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredLeads.map(lead => (
                                            <tr key={lead.id} onClick={() => setSelectedLead(lead)} className="hover:bg-slate-50 cursor-pointer">
                                                <td className="px-10 py-6 font-black text-slate-900">{lead.name}</td>
                                                <td className="px-10 py-6"><StatusBadge status={lead.status} /></td>
                                                <td className="px-10 py-6 text-sm text-slate-400">{new Date(lead.timestamp).toLocaleDateString()}</td>
                                                <td className="px-10 py-6"><ChevronRight size={18} className="text-slate-300" /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatCard icon={<TrendingUp />} label="Conversión" value="4.2%" trend="+0.5%" color="indigo" />
                        <StatCard icon={<MessageSquare />} label="IA Assists" value="128" trend="Total" color="emerald" />
                        <StatCard icon={<Map />} label="IDECOR Hits" value="850" trend="Sinc" color="amber" />
                        <StatCard icon={<Users />} label="Leads Activos" value={stats.leads_nuevos} trend="Hoy" color="indigo" />
                    </div>
                )}
            </div>

            {/* LEAD DETAIL - MODAL CRM */}
            {selectedLead && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white h-full w-full max-w-2xl shadow-2xl p-12 overflow-y-auto animate-in slide-in-from-right">
                        <div className="flex justify-between items-center mb-10">
                            <button onClick={() => setSelectedLead(null)} className="p-3 bg-slate-50 rounded-full hover:bg-slate-100 transition-all"><X size={24} /></button>
                            <StatusBadge status={selectedLead.status} />
                        </div>

                        <div className="space-y-10">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-[2rem] bg-indigo-600 text-white flex items-center justify-center text-3xl font-black">
                                    {selectedLead.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{selectedLead.name}</h2>
                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Ingresado via Web • {new Date(selectedLead.timestamp).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Contacto Directo</span>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 font-bold text-slate-700"><Mail size={16} className="text-indigo-500" /> {selectedLead.email}</div>
                                        <div className="flex items-center gap-3 font-bold text-slate-700"><Phone size={16} className="text-emerald-500" /> {selectedLead.phone}</div>
                                    </div>
                                </div>
                                <div className="p-6 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-100 flex flex-col justify-between">
                                    <span className="text-[10px] font-black opacity-60 uppercase tracking-widest block mb-2">Propiedad de Interés</span>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-black tracking-tight">#{selectedLead.property_id || 'Consulta'}</span>
                                        <ExternalLink size={20} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Actualizar Etapa del Embudo</h3>
                                <div className="flex flex-wrap gap-2">
                                    {Object.values(LeadStatus).map(s => (
                                        <button
                                            key={s}
                                            onClick={() => handleStatusChange(selectedLead.email, s)}
                                            className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedLead.status === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-600'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Mensaje Inicial</h3>
                                <p className="text-slate-700 font-medium leading-relaxed italic">"{selectedLead.message}"</p>
                            </div>

                            <div className="pt-10 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Notas de Seguimiento</h3>
                                    <button className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest"><Plus size={14} /> Nueva Nota</button>
                                </div>
                                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 text-[11px] font-bold text-amber-700 leading-relaxed">
                                    El cliente consultó específicamente por la validación de IDECOR. Interesado en financiación si el valor fiscal es estable.
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
    const colors: any = { indigo: 'bg-indigo-600', emerald: 'bg-emerald-600', amber: 'bg-amber-500' };
    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl text-white ${colors[color]}`}>{icon}</div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{trend}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        [LeadStatus.NEW]: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        [LeadStatus.CONTACTED]: 'bg-amber-50 text-amber-600 border-amber-100',
        [LeadStatus.VISIT]: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        [LeadStatus.NEGOTIATION]: 'bg-rose-50 text-rose-600 border-rose-100',
        [LeadStatus.WON]: 'bg-slate-900 text-white border-slate-900',
        [LeadStatus.LOST]: 'bg-slate-100 text-slate-400 border-slate-200'
    };
    return (
        <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status] || styles[LeadStatus.NEW]}`}>
            {status}
        </span>
    );
};

export default Dashboard;





import React, { useState, useMemo, useEffect } from 'react';
import { type Property } from './types';
import { MOCK_PROPERTIES } from './constants';
import Navbar from './components/Navbar';
import PropertyCard from './components/PropertyCard';
import PropertyDetails from './components/PropertyDetails';
import PropertyForm from './components/PropertyForm';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import ValuationView from './components/ValuationView';
import { trackEvent, fetchLeads } from './services/apiService';
import { Search, Lock, BadgeCheck, X, LogIn, Key } from 'lucide-react';

const App: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [currentView, setCurrentView] = useState<'home' | 'listings' | 'dashboard' | 'publish' | 'valuation'>('home');
  const [dashboardTab, setDashboardTab] = useState<'analytics' | 'crm'>('analytics');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newLeadsCount, setNewLeadsCount] = useState(0);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [accessKey, setAccessKey] = useState('');

  useEffect(() => {
    const updateLeadsCount = async () => {
      if (isAdmin) {
        const leads = await fetchLeads();
        const news = leads.filter((l: any) => l.status === 'Nuevo').length;
        setNewLeadsCount(news);
      }
    };
    updateLeadsCount();
    const interval = setInterval(updateLeadsCount, 30000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = !searchTerm || 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.address.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [properties, searchTerm]);

  const handleViewChange = (view: 'home' | 'listings' | 'dashboard' | 'publish' | 'valuation', tab?: 'analytics' | 'crm') => {
    if ((view === 'dashboard' || view === 'publish') && !isAdmin) {
      setShowLoginModal(true);
      return;
    }
    if (tab) setDashboardTab(tab);
    setCurrentView(view);
    setSelectedProperty(null); // Limpiar propiedad seleccionada al cambiar de vista
    trackEvent('view_change', { view, tab });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessKey === '1234') {
      setIsAdmin(true);
      setShowLoginModal(false);
      setAccessKey('');
      setCurrentView('dashboard');
      setDashboardTab('analytics');
      trackEvent('admin_login_success');
    } else {
      alert("Clave incorrecta.");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setNewLeadsCount(0);
    setCurrentView('home');
    trackEvent('admin_logout');
  };

  const renderHome = () => (
    <div className="flex flex-col">
      <div className="relative h-[90vh] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-50">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1920" className="w-full h-full object-cover" alt="" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              <BadgeCheck size={16} className="text-indigo-400" />
              Gestión Integral Córdoba
            </div>
            <h1 className="text-7xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
              Invertí con <br/> <span className="text-indigo-400 underline decoration-indigo-500/30">certeza</span> técnica.
            </h1>
            <p className="text-xl text-slate-300 max-w-xl font-medium leading-relaxed">
              La única inmobiliaria que integra datos de <strong>IDECOR</strong> en tiempo real para validar tu inversión.
            </p>
            <div className="bg-white p-2 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-2xl">
              <div className="flex-1 flex items-center px-6 py-4">
                <Search className="text-slate-400 mr-4" size={24} />
                <input 
                  type="text" 
                  placeholder="Barrio, calle o propiedad..." 
                  className="bg-transparent w-full outline-none text-slate-900 font-bold"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => { if(currentView !== 'listings') setCurrentView('listings'); }}
                />
              </div>
              <button onClick={() => setCurrentView('listings')} className="bg-indigo-600 hover:bg-slate-900 text-white font-black uppercase text-xs tracking-widest px-10 py-5 rounded-2xl transition-all">
                Buscar Ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar 
        onViewChange={handleViewChange}
        currentView={currentView}
        isAdmin={isAdmin}
        newLeadsCount={newLeadsCount}
        onLogout={handleLogout}
      />
      
      <main className="min-h-[calc(100vh-80px)]">
        {currentView === 'home' && renderHome()}
        {currentView === 'valuation' && <ValuationView />}
        {currentView === 'listings' && (
          selectedProperty ? 
          <PropertyDetails property={selectedProperty} onBack={() => setSelectedProperty(null)} /> : 
          <div className="max-w-7xl mx-auto px-4 py-20">
            <h2 className="text-4xl font-black mb-12 tracking-tighter">Nuestro Catálogo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredProperties.map(p => <PropertyCard key={p.id} property={p} onViewDetails={(prop) => setSelectedProperty(prop)} />)}
            </div>
          </div>
        )}
        {currentView === 'dashboard' && <Dashboard initialTab={dashboardTab} />}
        {currentView === 'publish' && <PropertyForm onSave={(p) => { setProperties([p, ...properties]); setCurrentView('listings'); }} onCancel={() => setCurrentView('home')} />}
      </main>

      <AIAssistant properties={properties} />
      <Footer />

      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-8">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl"><Lock size={32} /></div>
              <button onClick={() => setShowLoginModal(false)} className="text-slate-400 hover:text-slate-900"><X size={24} /></button>
            </div>
            <h3 className="text-2xl font-black tracking-tight mb-2">Acceso a Gestión Interna</h3>
            <p className="text-slate-500 mb-8 font-medium">Solo personal autorizado.</p>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <input 
                  autoFocus
                  type="password"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none transition-all font-black text-center text-2xl tracking-widest"
                  placeholder="••••"
                  value={accessKey}
                  onChange={e => setAccessKey(e.target.value)}
                />
                <div className="flex items-center justify-center gap-2 py-2 text-indigo-400 bg-indigo-50/50 rounded-xl">
                  <Key size={12} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Clave Demo: 1234</span>
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white font-black uppercase text-xs tracking-widest py-5 rounded-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3">
                <LogIn size={20} /> Ingresar al Panel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;










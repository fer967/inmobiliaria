import React, { useState, useMemo, useEffect } from 'react';
import { type Property, PropertyType, TransactionType } from './types';
import { MOCK_PROPERTIES } from './constants';
import Navbar from './components/Navbar';
import PropertyCard from './components/PropertyCard';
import PropertyDetails from './components/PropertyDetails';
import PropertyForm from './components/PropertyForm';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import { trackEvent, fetchLeads } from './services/apiService';
import { Search, Lock, BadgeCheck, MessageCircle, X, LogIn, Key } from 'lucide-react';

const App: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [currentView, setCurrentView] = useState<'home' | 'listings' | 'dashboard' | 'publish'>('home');
  const [dashboardTab, setDashboardTab] = useState<'analytics' | 'crm'>('analytics');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newLeadsCount, setNewLeadsCount] = useState(0);
  
  // SISTEMA DE ROLES
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [accessKey, setAccessKey] = useState('');

  // Sincronizar conteo de leads para el badge del Navbar
  useEffect(() => {
    const updateLeadsCount = async () => {
      if (isAdmin) {
        const leads = await fetchLeads();
        const news = leads.filter((l: any) => l.status === 'Nuevo').length;
        setNewLeadsCount(news);
      }
    };
    updateLeadsCount();
    const interval = setInterval(updateLeadsCount, 30000); // Actualizar cada 30s
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

  // PROTECCIÓN DE RUTAS Y NAVEGACIÓN
  const handleViewChange = (view: 'home' | 'listings' | 'dashboard' | 'publish', tab?: 'analytics' | 'crm') => {
    if ((view === 'dashboard' || view === 'publish') && !isAdmin) {
      setShowLoginModal(true);
      return;
    }
    
    if (tab) setDashboardTab(tab);
    setCurrentView(view);
    trackEvent('view_change', { view, tab });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // CLAVE DE ACCESO: 1234
    if (accessKey === '1234') {
      setIsAdmin(true);
      setShowLoginModal(false);
      setAccessKey('');
      setCurrentView('dashboard');
      setDashboardTab('analytics');
      trackEvent('admin_login_success');
    } else {
      alert("Clave incorrecta. Acceso denegado.");
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
      <a href="https://wa.me/543510000000" target="_blank" className="fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-3 font-bold pr-6">
        <MessageCircle size={32} />
        <span className="hidden md:block">¿Hablamos?</span>
      </a>
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



// import React, { useState, useMemo, useEffect } from 'react';
// import { type Property, PropertyType, TransactionType } from './types';
// import { MOCK_PROPERTIES } from './constants';
// import Navbar from './components/Navbar';
// import PropertyCard from './components/PropertyCard';
// import PropertyDetails from './components/PropertyDetails';
// import PropertyForm from './components/PropertyForm';
// import Footer from './components/Footer';
// import Dashboard from './components/Dashboard';
// import { trackEvent, fetchLeads } from './services/apiService';
// import { Search, Lock, BadgeCheck, MessageCircle, X, LogIn } from 'lucide-react';

// const App: React.FC = () => {
//   const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
//   const [currentView, setCurrentView] = useState<'home' | 'listings' | 'dashboard' | 'publish'>('home');
//   const [dashboardTab, setDashboardTab] = useState<'analytics' | 'crm'>('analytics');
//   const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [newLeadsCount, setNewLeadsCount] = useState(0);
  
//   // SISTEMA DE ROLES
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [accessKey, setAccessKey] = useState('');

//   // Sincronizar conteo de leads para el badge del Navbar
//   useEffect(() => {
//     const updateLeadsCount = async () => {
//       if (isAdmin) {
//         const leads = await fetchLeads();
//         const news = leads.filter((l: any) => l.status === 'Nuevo').length;
//         setNewLeadsCount(news);
//       }
//     };
//     updateLeadsCount();
//     const interval = setInterval(updateLeadsCount, 30000); // Actualizar cada 30s
//     return () => clearInterval(interval);
//   }, [isAdmin]);

//   const filteredProperties = useMemo(() => {
//     return properties.filter(p => {
//       const matchesSearch = !searchTerm || 
//         p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
//         p.address.toLowerCase().includes(searchTerm.toLowerCase());
//       return matchesSearch;
//     });
//   }, [properties, searchTerm]);

//   // PROTECCIÓN DE RUTAS Y NAVEGACIÓN
//   const handleViewChange = (view: 'home' | 'listings' | 'dashboard' | 'publish', tab?: 'analytics' | 'crm') => {
//     if ((view === 'dashboard' || view === 'publish') && !isAdmin) {
//       setShowLoginModal(true);
//       return;
//     }
    
//     if (tab) setDashboardTab(tab);
//     setCurrentView(view);
//     trackEvent('view_change', { view, tab });
//   };

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (accessKey === '1234') {
//       setIsAdmin(true);
//       setShowLoginModal(false);
//       setAccessKey('');
//       setCurrentView('dashboard');
//       setDashboardTab('analytics');
//       trackEvent('admin_login_success');
//     } else {
//       alert("Clave incorrecta. Acceso denegado.");
//     }
//   };

//   const renderHome = () => (
//     <div className="flex flex-col">
//       <div className="relative h-[90vh] flex items-center overflow-hidden bg-slate-900">
//         <div className="absolute inset-0 opacity-50">
//           <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1920" className="w-full h-full object-cover" alt="" />
//         </div>
//         <div className="relative max-w-7xl mx-auto px-4 w-full">
//           <div className="max-w-3xl space-y-8">
//             <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">
//               <BadgeCheck size={16} className="text-indigo-400" />
//               Gestión Integral Córdoba
//             </div>
//             <h1 className="text-7xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
//               Invertí con <br/> <span className="text-indigo-400 underline decoration-indigo-500/30">certeza</span> técnica.
//             </h1>
//             <p className="text-xl text-slate-300 max-w-xl font-medium leading-relaxed">
//               La única inmobiliaria que integra datos de <strong>IDECOR</strong> en tiempo real para validar tu inversión.
//             </p>
//             <div className="bg-white p-2 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-2xl">
//               <div className="flex-1 flex items-center px-6 py-4">
//                 <Search className="text-slate-400 mr-4" size={24} />
//                 <input 
//                   type="text" 
//                   placeholder="Barrio, calle o propiedad..." 
//                   className="bg-transparent w-full outline-none text-slate-900 font-bold"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   onFocus={() => { if(currentView !== 'listings') setCurrentView('listings'); }}
//                 />
//               </div>
//               <button onClick={() => setCurrentView('listings')} className="bg-indigo-600 hover:bg-slate-900 text-white font-black uppercase text-xs tracking-widest px-10 py-5 rounded-2xl transition-all">
//                 Buscar Ahora
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <a href="https://wa.me/543510000000" target="_blank" className="fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-3 font-bold pr-6">
//         <MessageCircle size={32} />
//         <span className="hidden md:block">¿Hablamos?</span>
//       </a>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50/50">
//       <Navbar 
//         onViewChange={handleViewChange}
//         currentView={currentView}
//         isAdmin={isAdmin}
//         newLeadsCount={newLeadsCount}
//       />
      
//       <main className="min-h-[calc(100vh-80px)]">
//         {currentView === 'home' && renderHome()}
//         {currentView === 'listings' && (
//           selectedProperty ? 
//           <PropertyDetails property={selectedProperty} onBack={() => setSelectedProperty(null)} /> : 
//           <div className="max-w-7xl mx-auto px-4 py-20">
//             <h2 className="text-4xl font-black mb-12 tracking-tighter">Nuestro Catálogo</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//               {filteredProperties.map(p => <PropertyCard key={p.id} property={p} onViewDetails={(prop) => setSelectedProperty(prop)} />)}
//             </div>
//           </div>
//         )}
//         {currentView === 'dashboard' && <Dashboard initialTab={dashboardTab} />}
//         {currentView === 'publish' && <PropertyForm onSave={(p) => { setProperties([p, ...properties]); setCurrentView('listings'); }} onCancel={() => setCurrentView('home')} />}
//       </main>

//       <Footer />

//       {showLoginModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
//           <div className="bg-white rounded-[2rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
//             <div className="flex justify-between items-start mb-8">
//               <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl"><Lock size={32} /></div>
//               <button onClick={() => setShowLoginModal(false)} className="text-slate-400 hover:text-slate-900"><X size={24} /></button>
//             </div>
//             <h3 className="text-2xl font-black tracking-tight mb-2">Acceso a Gestión Interna</h3>
//             <p className="text-slate-500 mb-8 font-medium">Solo personal autorizado.</p>
//             <form onSubmit={handleLogin} className="space-y-6">
//               <input 
//                 autoFocus
//                 type="password"
//                 className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none transition-all font-black text-center text-2xl tracking-widest"
//                 placeholder="••••"
//                 value={accessKey}
//                 onChange={e => setAccessKey(e.target.value)}
//               />
//               <button type="submit" className="w-full bg-slate-900 text-white font-black uppercase text-xs tracking-widest py-5 rounded-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3">
//                 <LogIn size={20} /> Ingresar al Panel
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;


// import React, { useState, useMemo, useEffect } from 'react';
// import { type Property, PropertyType, TransactionType } from './types';
// import { MOCK_PROPERTIES } from './constants';
// import Navbar from './components/Navbar';
// import PropertyCard from './components/PropertyCard';
// import PropertyDetails from './components/PropertyDetails';
// import PropertyForm from './components/PropertyForm';
// import Footer from './components/Footer';
// import Dashboard from './components/Dashboard';
// import { trackEvent } from './services/apiService';
// import { Search, Lock, BadgeCheck, MessageCircle, X, LogIn } from 'lucide-react';

// const App: React.FC = () => {
//   const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
//   const [currentView, setCurrentView] = useState<'home' | 'listings' | 'dashboard' | 'publish'>('home');
//   const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
//   const [typeFilter, setTypeFilter] = useState<PropertyType | null>(null);
//   const [transactionFilter, setTransactionFilter] = useState<TransactionType | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // SISTEMA DE ROLES
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [accessKey, setAccessKey] = useState('');

//   const filteredProperties = useMemo(() => {
//     return properties.filter(p => {
//       const matchesType = !typeFilter || p.type === typeFilter;
//       const matchesTrans = !transactionFilter || p.transaction === transactionFilter;
//       const matchesSearch = !searchTerm || 
//         p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
//         p.address.toLowerCase().includes(searchTerm.toLowerCase());
//       return matchesType && matchesTrans && matchesSearch;
//     });
//   }, [properties, typeFilter, transactionFilter, searchTerm]);

//   // PROTECCIÓN DE RUTAS
//   useEffect(() => {
//     if ((currentView === 'dashboard' || currentView === 'publish') && !isAdmin) {
//       setCurrentView('home');
//       alert("Acceso Restringido: Esta sección requiere perfil de Staff Administrativo.");
//     }
//     trackEvent('view_change', { view: currentView });
//   }, [currentView, isAdmin]);

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (accessKey === '1234') { // Simulación de clave maestra
//       setIsAdmin(true);
//       setShowLoginModal(false);
//       setAccessKey('');
//       trackEvent('admin_login_success');
//     } else {
//       alert("Clave incorrecta. Contacte al administrador del sistema.");
//       trackEvent('admin_login_fail');
//     }
//   };

//   const renderHome = () => (
//     <div className="flex flex-col">
//       {/* Hero Section */}
//       <div className="relative h-[90vh] flex items-center overflow-hidden bg-slate-900">
//         <div className="absolute inset-0 opacity-50">
//           <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1920" className="w-full h-full object-cover" alt="" />
//         </div>
//         <div className="relative max-w-7xl mx-auto px-4 w-full">
//           <div className="max-w-3xl space-y-8">
//             <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">
//               <BadgeCheck size={16} className="text-indigo-400" />
//               Gestión Integral Córdoba
//             </div>
//             <h1 className="text-7xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
//               Invertí con <br/> <span className="text-indigo-400 underline decoration-indigo-500/30">certeza</span> técnica.
//             </h1>
//             <p className="text-xl text-slate-300 max-w-xl font-medium leading-relaxed">
//               La única inmobiliaria que integra datos de <strong>IDECOR</strong> en tiempo real para validar tu inversión antes de firmar.
//             </p>
//             <div className="bg-white p-2 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-2xl">
//               <div className="flex-1 flex items-center px-6 py-4">
//                 <Search className="text-slate-400 mr-4" size={24} />
//                 <input 
//                   type="text" 
//                   placeholder="Barrio, calle o tipo de propiedad..." 
//                   className="bg-transparent w-full outline-none text-slate-900 font-bold"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   onFocus={() => { if(currentView !== 'listings') setCurrentView('listings'); }}
//                 />
//               </div>
//               <button onClick={() => setCurrentView('listings')} className="bg-indigo-600 hover:bg-slate-900 text-white font-black uppercase text-xs tracking-widest px-10 py-5 rounded-2xl transition-all shadow-lg shadow-indigo-200">
//                 Buscar Ahora
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Floating WhatsApp */}
//       <a 
//         href="https://wa.me/543510000000" 
//         target="_blank" 
//         className="fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-3 font-bold pr-6"
//       >
//         <MessageCircle size={32} />
//         <span className="hidden md:block">¿Hablamos?</span>
//       </a>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50/50">
//       <Navbar 
//         onViewChange={(v) => {
//           if ((v === 'dashboard' || v === 'publish') && !isAdmin) {
//             setShowLoginModal(true);
//           } else {
//             setCurrentView(v);
//           }
//         }}
//         currentView={currentView}
//         isAdmin={isAdmin}
//       />
      
//       <main className="min-h-[calc(100vh-80px)]">
//         {currentView === 'home' && renderHome()}
//         {currentView === 'listings' && (
//           selectedProperty ? 
//           <PropertyDetails property={selectedProperty} onBack={() => setSelectedProperty(null)} /> : 
//           <div className="max-w-7xl mx-auto px-4 py-20">
//             <h2 className="text-4xl font-black mb-12 tracking-tighter">Nuestro Catálogo</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//               {filteredProperties.map(p => <PropertyCard key={p.id} property={p} onViewDetails={(prop) => { setSelectedProperty(prop); trackEvent('view_item', { item_id: prop.id }); }} />)}
//             </div>
//           </div>
//         )}
//         {currentView === 'dashboard' && <Dashboard />}
//         {currentView === 'publish' && <PropertyForm onSave={(p) => { setProperties([p, ...properties]); setCurrentView('listings'); }} onCancel={() => setCurrentView('home')} />}
//       </main>

//       <Footer />

//       {/* MODAL DE LOGIN STAFF */}
//       {showLoginModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
//           <div className="bg-white rounded-[2rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
//             <div className="flex justify-between items-start mb-8">
//               <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
//                 <Lock size={32} />
//               </div>
//               <button onClick={() => setShowLoginModal(false)} className="text-slate-400 hover:text-slate-900"><X size={24} /></button>
//             </div>
//             <h3 className="text-2xl font-black tracking-tight mb-2">Acceso a Gestión Interna</h3>
//             <p className="text-slate-500 mb-8 font-medium">Solo personal autorizado de Connect Inmobiliaria.</p>
            
//             <form onSubmit={handleLogin} className="space-y-6">
//               <div>
//                 <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Llave Maestra</label>
//                 <input 
//                   autoFocus
//                   type="password"
//                   className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none transition-all font-black text-center text-2xl tracking-widest"
//                   placeholder="••••"
//                   value={accessKey}
//                   onChange={e => setAccessKey(e.target.value)}
//                 />
//               </div>
//               <button type="submit" className="w-full bg-slate-900 text-white font-black uppercase text-xs tracking-widest py-5 rounded-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3">
//                 <LogIn size={20} />
//                 Ingresar al Panel
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;


// import React, { useState, useMemo } from 'react';
// import { type Property, PropertyType, TransactionType } from './types';
// import { MOCK_PROPERTIES } from './constants';
// import Navbar from './components/Navbar';
// import PropertyCard from './components/PropertyCard';
// import PropertyDetails from './components/PropertyDetails';
// import PropertyForm from './components/PropertyForm';
// import Footer from './components/Footer';
// import Dashboard from './components/Dashboard';
// import { Search, MapPin, Building2, Landmark, Users, ArrowRight, ShieldCheck, BadgeCheck } from 'lucide-react';

// const App: React.FC = () => {
//   const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
//   const [currentView, setCurrentView] = useState<'home' | 'listings' | 'dashboard' | 'publish'>('home');
//   const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
//   const [typeFilter, setTypeFilter] = useState<PropertyType | null>(null);
//   const [transactionFilter, setTransactionFilter] = useState<TransactionType | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredProperties = useMemo(() => {
//     return properties.filter(p => {
//       const matchesType = !typeFilter || p.type === typeFilter;
//       const matchesTrans = !transactionFilter || p.transaction === transactionFilter;
//       const matchesSearch = !searchTerm ||
//         p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         p.address.toLowerCase().includes(searchTerm.toLowerCase());
//       return matchesType && matchesTrans && matchesSearch;
//     });
//   }, [properties, typeFilter, transactionFilter, searchTerm]);

//   const handlePropertyDetails = (p: Property) => {
//     setSelectedProperty(p);
//     setCurrentView('listings');
//   };

//   const handleAddProperty = (newProp: Property) => {
//     setProperties([newProp, ...properties]);
//     setCurrentView('listings');
//     setTypeFilter(null);
//     setTransactionFilter(null);
//     setSearchTerm('');
//   };

//   const renderHome = () => (
//     <div className="flex flex-col">
//       <div className="relative h-[90vh] flex items-center overflow-hidden bg-slate-900">
//         <div className="absolute inset-0 opacity-40">
//           <img
//             src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=1920"
//             className="w-full h-full object-cover"
//             alt="Hero Background"
//           />
//         </div>

//         <div className="relative max-w-7xl mx-auto px-4 w-full">
//           <div className="max-w-3xl space-y-10">
//             <div className="inline-flex items-center gap-2 bg-indigo-600/20 border border-indigo-400/30 text-indigo-300 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
//               <BadgeCheck size={16} />
//               Inmobiliaria Registrada Córdoba
//             </div>
//             <h1 className="text-7xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
//               El hogar que <br />
//               <span className="text-indigo-500">soñaste</span> hoy.
//             </h1>
//             <p className="text-xl text-gray-300 leading-relaxed max-w-xl font-medium">
//               Gestión inmobiliaria transparente. Somos especialistas en tasaciones precisas utilizando tecnología **IDECOR** y análisis de mercado local.
//             </p>

//             <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-2xl group transition-all focus-within:ring-4 focus-within:ring-indigo-500/20">
//               <div className="flex-1 flex items-center px-6 py-4">
//                 <Search className="text-gray-400 mr-4" size={24} />
//                 <input
//                   type="text"
//                   placeholder="Buscá por barrio, zona o calle..."
//                   className="bg-transparent w-full outline-none text-gray-900 placeholder:text-gray-400 font-bold"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   onFocus={() => { if (currentView !== 'listings') setCurrentView('listings'); }}
//                 />
//               </div>
//               <button
//                 onClick={() => setCurrentView('listings')}
//                 className="bg-slate-900 hover:bg-indigo-600 text-white font-black uppercase text-xs tracking-widest px-10 py-5 rounded-xl transition-all"
//               >
//                 Explorar Catálogo
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-slate-50 py-16 border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-10">
//             <div className="flex items-center gap-6">
//               <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 border border-gray-100">
//                 <ShieldCheck size={32} />
//               </div>
//               <div>
//                 <h4 className="text-lg font-black text-gray-900">Operaciones Seguras</h4>
//                 <p className="text-sm text-gray-500 font-medium">Respaldo legal en cada contrato.</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-6">
//               <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 border border-gray-100">
//                 <Landmark size={32} />
//               </div>
//               <div>
//                 <h4 className="text-lg font-black text-gray-900">IDECOR Integrado</h4>
//                 <p className="text-sm text-gray-500 font-medium">Validación catastral instantánea.</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-6">
//               <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 border border-gray-100">
//                 <Users size={32} />
//               </div>
//               <div>
//                 <h4 className="text-lg font-black text-gray-900">Atención Personal</h4>
//                 <p className="text-sm text-gray-500 font-medium">Asesores expertos a tu disposición.</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="py-24 bg-white">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
//             <div>
//               <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Destacados de la semana</span>
//               <h2 className="text-5xl font-black text-gray-900 tracking-tighter">Nuestra Cartera.</h2>
//             </div>
//             <button
//               onClick={() => setCurrentView('listings')}
//               className="group flex items-center gap-4 text-gray-900 font-black text-xs uppercase tracking-widest bg-slate-50 px-8 py-4 rounded-full hover:bg-indigo-600 hover:text-white transition-all"
//             >
//               Ver Todas las Propiedades
//               <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
//             </button>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//             {properties.slice(0, 3).map(p => (
//               <PropertyCard key={p.id} property={p} onViewDetails={handlePropertyDetails} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderListings = () => {
//     if (selectedProperty) {
//       return (
//         <PropertyDetails
//           property={selectedProperty}
//           onBack={() => setSelectedProperty(null)}
//         />
//       );
//     }

//     return (
//       <div className="max-w-7xl mx-auto px-4 py-20 animate-in fade-in duration-500">
//         <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 border-b border-gray-100 pb-12">
//           <div className="space-y-4">
//             <h1 className="text-6xl font-black text-gray-900 tracking-tighter">Catálogo Córdoba</h1>
//             <p className="text-gray-400 text-xl font-medium">Mostrando {filteredProperties.length} propiedades exclusivas.</p>
//           </div>

//           <div className="flex flex-wrap gap-4">
//             <select
//               className="bg-slate-50 border-none px-8 py-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-black text-xs uppercase tracking-widest text-gray-700 cursor-pointer"
//               value={typeFilter || ''}
//               onChange={(e) => setTypeFilter(e.target.value as PropertyType || null)}
//             >
//               <option value="">Todos los Tipos</option>
//               {Object.values(PropertyType).map(v => <option key={v} value={v}>{v}</option>)}
//             </select>
//             <select
//               className="bg-slate-50 border-none px-8 py-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-black text-xs uppercase tracking-widest text-gray-700 cursor-pointer"
//               value={transactionFilter || ''}
//               onChange={(e) => setTransactionFilter(e.target.value as TransactionType || null)}
//             >
//               <option value="">Cualquier Operación</option>
//               {Object.values(TransactionType).map(v => <option key={v} value={v}>{v}</option>)}
//             </select>
//           </div>
//         </div>

//         {filteredProperties.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
//             {filteredProperties.map(p => (
//               <PropertyCard key={p.id} property={p} onViewDetails={handlePropertyDetails} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-40 bg-slate-50 rounded-[3rem] border-2 border-dashed border-gray-200">
//             <Search className="mx-auto text-gray-300 mb-8" size={80} />
//             <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Sin resultados exactos</h3>
//             <p className="text-gray-500 mt-4 text-lg">Ajustá los filtros para encontrar lo que buscás en nuestra cartera.</p>
//             <button
//               onClick={() => { setSearchTerm(''); setTypeFilter(null); setTransactionFilter(null); }}
//               className="bg-indigo-600 text-white font-black uppercase text-xs tracking-widest px-12 py-5 rounded-2xl mt-10 hover:bg-slate-900 transition-all shadow-xl"
//             >
//               Ver Todas las Propiedades
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
//       <Navbar
//         onTypeChange={(t) => { setTypeFilter(t); setSelectedProperty(null); }}
//         onTransactionChange={(tr) => { setTransactionFilter(tr); setSelectedProperty(null); }}
//         onViewChange={(view) => {
//           setCurrentView(view);
//           if (view !== 'listings') setSelectedProperty(null);
//         }}
//         currentView={currentView}
//       />

//       <main className="min-h-[calc(100vh-80px)]">
//         {currentView === 'home' && renderHome()}
//         {currentView === 'listings' && renderListings()}
//         {currentView === 'dashboard' && <Dashboard />}
//         {currentView === 'publish' && (
//           <PropertyForm
//             onSave={handleAddProperty}
//             onCancel={() => setCurrentView('home')}
//           />
//         )}
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default App;



// import React, { useState, useMemo } from 'react';
// import { type Property, PropertyType, TransactionType } from './types.ts';
// import { MOCK_PROPERTIES } from './constants';
// import Navbar from './components/Navbar';
// import PropertyCard from './components/PropertyCard';
// import PropertyDetails from './components/PropertyDetails';
// import PropertyForm from './components/PropertyForm';
// import Footer from './components/Footer';
// import Dashboard from './components/Dashboard';
// import { Search, MapPin, Building2, Landmark, Users, ArrowRight } from 'lucide-react';

// const App: React.FC = () => {
//   const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
//   const [currentView, setCurrentView] = useState<'home' | 'listings' | 'dashboard' | 'publish'>('home');
//   const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
//   const [typeFilter, setTypeFilter] = useState<PropertyType | null>(null);
//   const [transactionFilter, setTransactionFilter] = useState<TransactionType | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredProperties = useMemo(() => {
//     return properties.filter(p => {
//       const matchesType = !typeFilter || p.type === typeFilter;
//       const matchesTrans = !transactionFilter || p.transaction === transactionFilter;
//       const matchesSearch = !searchTerm ||
//         p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         p.address.toLowerCase().includes(searchTerm.toLowerCase());
//       return matchesType && matchesTrans && matchesSearch;
//     });
//   }, [properties, typeFilter, transactionFilter, searchTerm]);

//   const handlePropertyDetails = (p: Property) => {
//     setSelectedProperty(p);
//     setCurrentView('listings');
//   };

//   const handleAddProperty = (newProp: Property) => {
//     setProperties([newProp, ...properties]);
//     setCurrentView('listings');
//     setTypeFilter(null);
//     setTransactionFilter(null);
//     setSearchTerm('');
//   };

//   const renderHome = () => (
//     <div className="flex flex-col">
//       {/* Hero Section */}
//       <div className="relative h-[85vh] flex items-center overflow-hidden">
//         <div className="absolute inset-0">
//           <img
//             src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1920"
//             className="w-full h-full object-cover"
//             alt="Hero Background"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/40 to-transparent" />
//         </div>

//         <div className="relative max-w-7xl mx-auto px-4 w-full">
//           <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
//             <h1 className="text-6xl md:text-7xl font-extrabold text-white leading-tight">
//               Decidí con <span className="text-indigo-400">datos reales</span>.
//             </h1>
//             <p className="text-xl text-gray-200 leading-relaxed font-light">
//               La única plataforma en Córdoba que cruza el mercado inmobiliario con la transparencia de **IDECOR**.
//             </p>

//             <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl flex flex-col md:flex-row gap-2">
//               <div className="flex-1 flex items-center px-4 py-3 bg-white/90 rounded-xl">
//                 <Search className="text-indigo-600 mr-3" size={20} />
//                 <input
//                   type="text"
//                   placeholder="¿Dónde querés vivir? Barrio, calle..."
//                   className="bg-transparent w-full outline-none text-gray-800 placeholder:text-gray-400 font-medium"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//               <button
//                 onClick={() => setCurrentView('listings')}
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg active:scale-95"
//               >
//                 Buscar Ahora
//               </button>
//             </div>

//             <div className="flex gap-10 pt-4">
//               <div className="text-white">
//                 <div className="text-3xl font-bold">500+</div>
//                 <div className="text-indigo-300 text-xs font-bold uppercase tracking-wider">Activos</div>
//               </div>
//               <div className="text-white">
//                 <div className="text-3xl font-bold">100%</div>
//                 <div className="text-indigo-300 text-xs font-bold uppercase tracking-wider">IDECOR Sync</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mini Dashboard Preview */}
//       <div className="bg-white py-12 border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Building2 size={24} /></div>
//               <div>
//                 <p className="text-2xl font-bold text-gray-900">2.4k</p>
//                 <p className="text-xs text-gray-500 font-medium uppercase">Deptos</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Landmark size={24} /></div>
//               <div>
//                 <p className="text-2xl font-bold text-gray-900">1.8k</p>
//                 <p className="text-xs text-gray-500 font-medium uppercase">Casas</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><MapPin size={24} /></div>
//               <div>
//                 <p className="text-2xl font-bold text-gray-900">850</p>
//                 <p className="text-xs text-gray-500 font-medium uppercase">Lotes</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Users size={24} /></div>
//               <div>
//                 <p className="text-2xl font-bold text-gray-900">45</p>
//                 <p className="text-xs text-gray-500 font-medium uppercase">Agencias</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Featured Grid */}
//       <div className="py-24 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex justify-between items-end mb-12">
//             <div>
//               <h2 className="text-4xl font-extrabold text-gray-900">Oportunidades Hoy</h2>
//               <p className="text-gray-500 mt-2 text-lg">Selección curada por inteligencia artificial en base a valor de mercado.</p>
//             </div>
//             <button
//               onClick={() => setCurrentView('listings')}
//               className="group flex items-center gap-2 text-indigo-600 font-bold bg-white px-6 py-3 rounded-xl border border-indigo-100 hover:border-indigo-600 transition-all"
//             >
//               Ver todo el catálogo
//               <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//             </button>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {properties.slice(0, 3).map(p => (
//               <PropertyCard key={p.id} property={p} onViewDetails={handlePropertyDetails} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderListings = () => {
//     if (selectedProperty) {
//       return (
//         <PropertyDetails
//           property={selectedProperty}
//           onBack={() => setSelectedProperty(null)}
//         />
//       );
//     }

//     return (
//       <div className="max-w-7xl mx-auto px-4 py-12">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
//           <div className="space-y-2">
//             <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">Catálogo Córdoba</h1>
//             <p className="text-gray-500 text-lg">Encontramos {filteredProperties.length} resultados para tu búsqueda.</p>
//           </div>

//           <div className="flex flex-wrap gap-3 bg-gray-100 p-2 rounded-2xl">
//             <select
//               className="bg-white border-none px-6 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-700 shadow-sm"
//               value={typeFilter || ''}
//               onChange={(e) => setTypeFilter(e.target.value as PropertyType || null)}
//             >
//               <option value="">Tipo Propiedad</option>
//               {Object.values(PropertyType).map(v => <option key={v} value={v}>{v}</option>)}
//             </select>
//             <select
//               className="bg-white border-none px-6 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-700 shadow-sm"
//               value={transactionFilter || ''}
//               onChange={(e) => setTransactionFilter(e.target.value as TransactionType || null)}
//             >
//               <option value="">Operación</option>
//               {Object.values(TransactionType).map(v => <option key={v} value={v}>{v}</option>)}
//             </select>
//           </div>
//         </div>

//         {filteredProperties.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//             {filteredProperties.map(p => (
//               <PropertyCard key={p.id} property={p} onViewDetails={handlePropertyDetails} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-32 bg-gray-50 rounded-3xl border-4 border-dashed border-gray-200">
//             <Search className="mx-auto text-gray-300 mb-6" size={64} />
//             <h3 className="text-2xl font-bold text-gray-900">No hay coincidencias</h3>
//             <p className="text-gray-500 mt-2">Probá quitando algunos filtros o buscando otra zona.</p>
//             <button
//               onClick={() => { setSearchTerm(''); setTypeFilter(null); setTransactionFilter(null); }}
//               className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl mt-8 hover:bg-indigo-700 transition-all"
//             >
//               Reiniciar Búsqueda
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
//       <Navbar
//         onTypeChange={(t) => { setTypeFilter(t); setSelectedProperty(null); }}
//         onTransactionChange={(tr) => { setTransactionFilter(tr); setSelectedProperty(null); }}
//         onViewChange={(view) => {
//           setCurrentView(view);
//           if (view !== 'listings') setSelectedProperty(null);
//         }}
//         currentView={currentView}
//       />

//       <main className="min-h-[calc(100vh-64px)] pb-20">
//         {currentView === 'home' && renderHome()}
//         {currentView === 'listings' && renderListings()}
//         {currentView === 'dashboard' && <Dashboard />}
//         {currentView === 'publish' && (
//           <PropertyForm
//             onSave={handleAddProperty}
//             onCancel={() => setCurrentView('home')}
//           />
//         )}
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default App;
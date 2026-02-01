import { LeadStatus } from '../types';

let mockLeads: any[] = [
    {
        id: 'lead_1',
        name: 'Ana García',
        email: 'ana.garcia@gmail.com',
        phone: '3515551234',
        property_id: '1',
        message: 'Interesada en la casa del Cerro. ¿Sigue disponible?',
        status: LeadStatus.NEW,
        timestamp: new Date().toISOString()
    }
];

export const trackEvent = (eventName: string, params: object = {}) => {
    if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', eventName, params);
    }
    console.log(`[Analytics] ${eventName}:`, params);
};

export const fetchLeads = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockLeads];
};

export const updateLeadStatus = async (email: string, status: string) => {
    mockLeads = mockLeads.map(l => l.email === email ? { ...l, status } : l);
    return true;
};

export const fetchStats = async () => {
    return {
        visitas_hoy: 1420,
        leads_totales: mockLeads.length,
        leads_nuevos: mockLeads.filter(l => l.status === LeadStatus.NEW).length,
        api_status: "online"
    };
};

export const fetchIdecorData = async (nomenclatura: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
        nomenclatura: nomenclatura,
        valorFiscal: 18500000,
        tipoSuelo: 'Residencial Baja Densidad (IDECOR)',
        superficieM2: 850,
        verificado: true,
        fuente: 'Sincronizado con Catastro Córdoba (Mock)'
    };
};

export const submitLeadToCRM = async (leadData: any) => {
    trackEvent('generar_lead', { property_id: leadData.propertyId });

    const newLead = {
        ...leadData,
        id: `lead_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        status: leadData.status || LeadStatus.NEW
    };

    mockLeads = [newLead, ...mockLeads];
    return true;
};

export const sendValuationEmail = async (email: string, body: string) => {
    console.log(`[Email Service] Enviando informe a: ${email}`);
    console.log(`[Email Content]:\n${body}`);
    // Simulamos delay de servicio de mail (SendGrid/Mailgun)
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
};




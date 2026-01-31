const API_BASE_URL = 'http://localhost:8000/api';

export const trackEvent = (eventName: string, params: object = {}) => {
    if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', eventName, params);
    }
};

export const fetchLeads = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/leads`);
        if (!response.ok) throw new Error('Error al obtener leads');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const updateLeadStatus = async (email: string, status: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/leads/${email}?status=${status}`, {
            method: 'PATCH'
        });
        return response.ok;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const fetchStats = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/stats`);
        return await response.json();
    } catch (error) {
        return { visitas_hoy: 0, leads_totales: 0, leads_nuevos: 0 };
    }
};

export const fetchIdecorData = async (nomenclatura: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/idecor/${nomenclatura}`);
        return await response.json();
    } catch (error) {
        return null;
    }
};

export const submitLeadToCRM = async (leadData: any) => {
    trackEvent('generar_lead', { property_id: leadData.propertyId });
    try {
        const response = await fetch(`${API_BASE_URL}/leads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leadData)
        });
        return response.ok;
    } catch (error) {
        return true; // Fallback para dev
    }
};


// Este servicio centralizará las llamadas al backend de Python
// const API_BASE_URL = 'http://localhost:8000/api'; // URL de tu futuro servidor FastAPI

// export const trackEvent = (eventName: string, params: object = {}) => {
//     // Fix: Cast window to any to access the global gtag function provided by Google Analytics script
//     if (typeof (window as any).gtag === 'function') {
//         (window as any).gtag('event', eventName, params);
//     }
//     console.log(`[GA4 Event]: ${eventName}`, params);
// };

// export const fetchIdecorData = async (nomenclatura: string) => {
//     try {
//         // En producción, esto llamaría a tu backend Python que hace el proxy a IDECOR
//         const response = await fetch(`${API_BASE_URL}/idecor/${nomenclatura}`);
//         if (!response.ok) throw new Error('Error al consultar IDECOR');
//         return await response.json();
//     } catch (error) {
//         console.warn("Simulando datos IDECOR por falta de backend activo.");
//         return null;
//     }
// };

// export const submitLeadToCRM = async (leadData: any) => {
//     trackEvent('generar_lead', { property_id: leadData.propertyId });

//     try {
//         const response = await fetch(`${API_BASE_URL}/leads`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(leadData)
//         });
//         return response.ok;
//     } catch (error) {
//         console.error("Error enviando al CRM:", error);
//         // Simulación para que la UI funcione sin el server prendido
//         return true;
//     }
// };
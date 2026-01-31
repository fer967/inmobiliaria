export const PropertyType = {
    HOUSE: 'Casas',
    APARTMENT: 'Departamentos',
    LAND: 'Terrenos',
    COMMERCIAL: 'Locales Comerciales',
    OFFICE: 'Oficinas'
} as const;

export type PropertyType = typeof PropertyType[keyof typeof PropertyType];

export const TransactionType = {
    BUY: 'Venta',
    RENT: 'Alquiler'
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export interface IdecorData {
    nomenclatura: string;
    valorFiscal: number;
    tipoSuelo: string;
    superficieM2: number;
}

export interface Property {
    id: string;
    title: string;
    price: number;
    type: PropertyType;
    transaction: TransactionType;
    location: [number, number];
    address: string;
    description: string;
    images: string[];
    features: string[];
    idecor: IdecorData;
}

export interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    propertyId: string;
    timestamp: string;
    status: 'New' | 'Contacted' | 'Closed';
}


// export const PropertyType = {
//     HOUSE: 'Casas',
//     APARTMENT: 'Departamentos',
//     LOT: 'Lotes',
//     OFFICE: 'Oficinas'
// } as const;

// export type PropertyType = typeof PropertyType[keyof typeof PropertyType];

// export const TransactionType = {
//     BUY: 'Compra',
//     RENT: 'Alquiler'
// } as const;

// export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

// export interface IdecorData {
//     nomenclatura: string;
//     valorFiscal: number;
//     tipoSuelo: string;
//     superficieM2: number;
// }

// export interface Property {
//     id: string;
//     title: string;
//     price: number;
//     type: PropertyType;
//     transaction: TransactionType;
//     location: [number, number]; // [lat, lng]
//     address: string;
//     description: string;
//     images: string[];
//     features: string[];
//     idecor: IdecorData;
// }

// export interface Lead {
//     id: string;
//     name: string;
//     email: string;
//     phone: string;
//     message: string;
//     propertyId: string;
//     timestamp: string;
//     status: 'New' | 'Contacted' | 'Closed';
// }

// export interface AnalyticsData {
//     pageViews: number;
//     leadsGenerated: number;
//     topProperty: string;
// }

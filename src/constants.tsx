import { type Property, PropertyType, TransactionType } from './types';

export const MOCK_PROPERTIES: Property[] = [
    {
        id: '1',
        title: 'Exclusiva Residencia en Cerro de las Rosas',
        price: 480000,
        type: PropertyType.HOUSE,
        transaction: TransactionType.BUY,
        location: [-31.3685, -64.2342],
        address: 'Av. Rafael Nuñez 3500, Córdoba',
        description: 'Majestuosa propiedad de estilo clásico con amplios jardines, piscina climatizada y detalles de categoría en mármol y madera.',
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000'],
        features: ['4 Dormitorios', 'Suite con Vestidor', 'Quincho Premium', 'Piscina'],
        idecor: {
            nomenclatura: '11-05-021-045',
            valorFiscal: 18500000,
            tipoSuelo: 'Residencial Baja Densidad',
            superficieM2: 850
        }
    },
    {
        id: '2',
        title: 'Semipiso de Lujo en Nueva Córdoba',
        price: 1250,
        type: PropertyType.APARTMENT,
        transaction: TransactionType.RENT,
        location: [-31.4285, -64.1857],
        address: 'Av. Hipólito Yrigoyen 400, Córdoba',
        description: 'Impresionante vista al Parque Sarmiento. Piso alto, terminaciones en porcelanato, calefacción central y seguridad 24hs.',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000'],
        features: ['2 Dormitorios', 'Balcón Terraza', 'Amenities VIP', 'Cochera Doble'],
        idecor: {
            nomenclatura: '11-01-088-002',
            valorFiscal: 9500000,
            tipoSuelo: 'Urbano Alta Densidad',
            superficieM2: 110
        }
    },
    {
        id: '3',
        title: 'Local Comercial en Recta Martinolli',
        price: 220000,
        type: PropertyType.COMMERCIAL,
        transaction: TransactionType.BUY,
        location: [-31.3412, -64.2615],
        address: 'Recta Martinolli 7800, Argüello',
        description: 'Excelente oportunidad comercial en el corazón de la zona norte. Doble vidriera, planta libre y depósito.',
        images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000'],
        features: ['Vidriera 8m', 'Planta Libre', 'Zona Alto Tránsito'],
        idecor: {
            nomenclatura: '11-06-115-010',
            valorFiscal: 15000000,
            tipoSuelo: 'Corredor Comercial',
            superficieM2: 150
        }
    }
];



// import { type Property, PropertyType, TransactionType } from './types.ts';

// export const MOCK_PROPERTIES: Property[] = [
//     {
//         id: '1',
//         title: 'Moderna Casa en Country Jockey',
//         price: 350000,
//         type: PropertyType.HOUSE,
//         transaction: TransactionType.BUY,
//         location: [-31.4554, -64.1837],
//         address: 'Elias Yofre 800, Córdoba',
//         description: 'Hermosa propiedad de 3 dormitorios con piscina y quincho.',
//         images: ['/images/house1.jpg', '/images/house1-int.jpg'],
//         features: ['3 Dormitorios', '2 Baños', 'Piscina', 'Seguridad 24hs'],
//         idecor: {
//             nomenclatura: '11-02-045-012',
//             valorFiscal: 12500000,
//             tipoSuelo: 'Urbano Residencial',
//             superficieM2: 450
//         }
//     },
//     {
//         id: '2',
//         title: 'Departamento Vista al Río',
//         price: 850,
//         type: PropertyType.APARTMENT,
//         transaction: TransactionType.RENT,
//         location: [-31.4054, -64.1937],
//         address: 'Av. Costanera 1200, Alberdi',
//         description: 'Departamento de 1 dormitorio con balcón aterrazado.',
//         images: ['/images/apt1.jpg', '/images/apt1-int.jpg'],
//         features: ['1 Dormitorio', 'Gimnasio', 'SUM', 'Cochera'],
//         idecor: {
//             nomenclatura: '11-01-020-005',
//             valorFiscal: 8000000,
//             tipoSuelo: 'Urbano Alta Densidad',
//             superficieM2: 55
//         }
//     },
//     {
//         id: '3',
//         title: 'Lote en Villa Belgrano',
//         price: 180000,
//         type: PropertyType.LOT,
//         transaction: TransactionType.BUY,
//         location: [-31.3454, -64.2437],
//         address: 'Nepper 5000, Córdoba',
//         description: 'Terreno ideal para desarrollo inmobiliario de categoría.',
//         images: ['/images/lot1.jpg'],
//         features: ['Servicios luz/gas', 'Escritura inmediata'],
//         idecor: {
//             nomenclatura: '11-05-110-099',
//             valorFiscal: 25000000,
//             tipoSuelo: 'Urbano Residencial Especial',
//             superficieM2: 1200
//         }
//     }
// ];
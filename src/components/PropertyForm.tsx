import React, { useState } from 'react';
import { type Property, PropertyType, TransactionType } from '../types';
import { Save, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

interface PropertyFormProps {
    onSave: (property: Property) => void;
    onCancel: () => void;
}

interface FormData {
    title: string;
    price: string;
    type: PropertyType;
    transaction: TransactionType;
    address: string;
    description: string;
    superficie: string;
    imageFileName: string;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState<FormData>({
        title: '',
        price: '',
        type: PropertyType.HOUSE,
        transaction: TransactionType.BUY,
        address: '',
        description: '',
        superficie: '300',
        imageFileName: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1000'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newProperty: Property = {
            id: Math.random().toString(36).substr(2, 9),
            title: formData.title,
            price: Number(formData.price),
            type: formData.type,
            transaction: formData.transaction,
            address: formData.address,
            description: formData.description,
            location: [-31.4201, -64.1888],
            images: [formData.imageFileName],
            features: ['Propiedad Verificada', 'IDECOR Sync OK', 'Entrega Inmediata'],
            idecor: {
                nomenclatura: `11-0${Math.floor(Math.random() * 9)}-${Math.floor(Math.random() * 999)}-${Math.floor(Math.random() * 999)}`,
                valorFiscal: Number(formData.price) * 0.35,
                tipoSuelo: 'Urbano Residencial',
                superficieM2: Number(formData.superficie)
            }
        };

        onSave(newProperty);
    };

    return (
        <div className="max-w-5xl mx-auto p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-indigo-600 rounded-3xl p-10 mb-12 text-white shadow-2xl shadow-indigo-200">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-200 text-xs font-black uppercase tracking-[0.2em] mb-3">
                            <CheckCircle2 size={16} />
                            Panel de Administrador
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter">Publicar Nueva Propiedad</h2>
                        <p className="text-indigo-100 mt-2 font-medium opacity-80 italic">El contenido será visible instantáneamente en el catálogo público.</p>
                    </div>
                    <button onClick={onCancel} className="bg-white/10 p-3 rounded-full text-white hover:bg-white/20 transition-all">
                        <X size={24} />
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-12 rounded-[2.5rem] shadow-xl border border-gray-100 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Título Comercial del Anuncio</label>
                        <input
                            required
                            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-indigo-600 outline-none transition-all text-gray-900 font-bold placeholder:font-normal"
                            placeholder="Ej: Impresionante Chalet en Valle Escondido"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">URL de Imagen (Unsplash o similar)</label>
                        <div className="relative">
                            <ImageIcon className="absolute left-5 top-5 text-gray-400" size={20} />
                            <input
                                required
                                className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-indigo-600 outline-none transition-all font-medium text-sm"
                                placeholder="https://images.unsplash.com/..."
                                value={formData.imageFileName}
                                onChange={e => setFormData({ ...formData, imageFileName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Precio (USD / ARS)</label>
                        <input
                            required
                            type="number"
                            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-indigo-600 outline-none transition-all font-black text-gray-900"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Categoría de Bien</label>
                        <select
                            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-indigo-600 outline-none transition-all font-black text-gray-700 cursor-pointer"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value as PropertyType })}
                        >
                            {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Superficie Total (m²)</label>
                        <input
                            required
                            type="number"
                            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold"
                            placeholder="Ej: 450"
                            value={formData.superficie}
                            onChange={e => setFormData({ ...formData, superficie: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Tipo de Operación</label>
                        <div className="flex gap-6">
                            {Object.values(TransactionType).map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, transaction: t })}
                                    className={`flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-4 ${formData.transaction === t ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xl shadow-indigo-100 scale-105' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Dirección Exacta (Córdoba)</label>
                        <input
                            required
                            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold"
                            placeholder="Ej: Av. Rafael Nuñez 4500, Cerro de las Rosas"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Descripción Detallada</label>
                        <textarea
                            required
                            rows={5}
                            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-indigo-600 outline-none transition-all font-medium text-gray-700 resize-none"
                            placeholder="Escribe aquí los detalles, comodidades y puntos de interés cercanos..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>
                </div>

                <div className="pt-10 border-t border-gray-50 flex gap-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-5 font-black text-xs uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all"
                    >
                        Descartar Cambios
                    </button>
                    <button
                        type="submit"
                        className="flex-[2] bg-indigo-600 text-white font-black text-xs uppercase tracking-widest py-5 px-12 rounded-2xl hover:bg-slate-900 shadow-2xl shadow-indigo-200 transition-all flex items-center justify-center gap-3"
                    >
                        <Save size={20} />
                        Confirmar y Publicar Anuncio
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PropertyForm;


// import React, { useState } from 'react';
// import { type Property, PropertyType, TransactionType } from '../types';
// import { Save, X, Image as ImageIcon } from 'lucide-react';

// interface PropertyFormProps {
//     onSave: (property: Property) => void;
//     onCancel: () => void;
// }

// // Definimos una interfaz para el estado del formulario
// // Esto garantiza que TypeScript no intente "adivinar" tipos más estrechos
// interface FormData {
//     title: string;
//     price: string;
//     type: PropertyType;
//     transaction: TransactionType;
//     address: string;
//     description: string;
//     superficie: string;
//     imageFileName: string;
// }

// const PropertyForm: React.FC<PropertyFormProps> = ({ onSave, onCancel }) => {
//     const [formData, setFormData] = useState<FormData>({
//         title: '',
//         price: '',
//         type: PropertyType.HOUSE,
//         transaction: TransactionType.BUY,
//         address: '',
//         description: '',
//         superficie: '300',
//         imageFileName: 'nueva-propiedad.jpg'
//     });

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         const newProperty: Property = {
//             id: Math.random().toString(36).substr(2, 9),
//             title: formData.title,
//             price: Number(formData.price),
//             type: formData.type,
//             transaction: formData.transaction,
//             address: formData.address,
//             description: formData.description,
//             location: [-31.4201, -64.1888],
//             images: [`/images/${formData.imageFileName}`],
//             features: ['Cargada localmente', 'Verificada'],
//             idecor: {
//                 nomenclatura: `11-0${Math.floor(Math.random() * 9)}-${Math.floor(Math.random() * 999)}-${Math.floor(Math.random() * 999)}`,
//                 valorFiscal: Number(formData.price) * 0.4,
//                 tipoSuelo: 'Urbano Residencial',
//                 superficieM2: Number(formData.superficie)
//             }
//         };

//         onSave(newProperty);
//     };

//     return (
//         <div className="max-w-4xl mx-auto p-8 animate-in fade-in duration-500">
//             <div className="flex justify-between items-center mb-8">
//                 <div>
//                     <h2 className="text-3xl font-bold text-gray-900">Publicar Nueva Propiedad</h2>
//                     <p className="text-gray-500 mt-1">Completa los datos para el listado local.</p>
//                 </div>
//                 <button onClick={onCancel} className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
//                     <X size={24} />
//                 </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="md:col-span-2">
//                         <label className="block text-sm font-bold text-gray-700 mb-2">Título del Anuncio</label>
//                         <input
//                             required
//                             className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
//                             placeholder="Ej: Casa 3 dorm en Barrio Jardín"
//                             value={formData.title}
//                             onChange={e => setFormData({ ...formData, title: e.target.value })}
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Archivo de Imagen</label>
//                         <div className="relative">
//                             <ImageIcon className="absolute left-4 top-3.5 text-gray-400" size={18} />
//                             <input
//                                 required
//                                 className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
//                                 placeholder="ej: casa1.jpg"
//                                 value={formData.imageFileName}
//                                 onChange={e => setFormData({ ...formData, imageFileName: e.target.value })}
//                             />
//                         </div>
//                         <p className="text-[10px] text-gray-400 mt-1 ml-1">Guarda el archivo en /public/images/</p>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-bold text-gray-700 mb-2">Precio</label>
//                         <input
//                             required
//                             type="number"
//                             className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
//                             placeholder="Valor total"
//                             value={formData.price}
//                             onChange={e => setFormData({ ...formData, price: e.target.value })}
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Propiedad</label>
//                         <select
//                             className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium"
//                             value={formData.type}
//                             onChange={e => setFormData({ ...formData, type: e.target.value as PropertyType })}
//                         >
//                             {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
//                         </select>
//                     </div>

//                     <div className="md:col-span-2">
//                         <label className="block text-sm font-bold text-gray-700 mb-2">Operación</label>
//                         <div className="flex gap-4">
//                             {Object.values(TransactionType).map(t => (
//                                 <button
//                                     key={t}
//                                     type="button"
//                                     onClick={() => setFormData({ ...formData, transaction: t })}
//                                     className={`flex-1 py-4 rounded-xl font-bold transition-all border-2 ${formData.transaction === t ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-gray-500 border-gray-100 hover:border-indigo-200'}`}
//                                 >
//                                     {t}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="md:col-span-2">
//                         <label className="block text-sm font-bold text-gray-700 mb-2">Dirección</label>
//                         <input
//                             required
//                             className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
//                             placeholder="Calle y número, Córdoba"
//                             value={formData.address}
//                             onChange={e => setFormData({ ...formData, address: e.target.value })}
//                         />
//                     </div>

//                     <div className="md:col-span-2">
//                         <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
//                         <textarea
//                             required
//                             rows={4}
//                             className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
//                             placeholder="Detalles adicionales de la propiedad..."
//                             value={formData.description}
//                             onChange={e => setFormData({ ...formData, description: e.target.value })}
//                         ></textarea>
//                     </div>
//                 </div>

//                 <div className="pt-6 border-t border-gray-100 flex gap-4">
//                     <button
//                         type="button"
//                         onClick={onCancel}
//                         className="flex-1 py-4 font-bold text-gray-500 hover:text-gray-700 transition-colors"
//                     >
//                         Cancelar
//                     </button>
//                     <button
//                         type="submit"
//                         className="flex-[2] bg-indigo-600 text-white font-bold py-4 px-12 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
//                     >
//                         <Save size={20} />
//                         Guardar y Publicar
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default PropertyForm;
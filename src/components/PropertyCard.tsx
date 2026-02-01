import React from 'react';
import { MapPin, ImageOff, ChevronRight } from 'lucide-react';
// Added TransactionType to imports to fix type comparison error
import { type Property, TransactionType } from '../types';

interface PropertyCardProps {
    property: Property;
    onViewDetails: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onViewDetails }) => {
    const [imgError, setImgError] = React.useState(false);

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group">
            <div className="relative h-64 overflow-hidden bg-gray-100">
                {!imgError ? (
                    <img
                        src={property.images[0]}
                        alt={property.title}
                        onError={() => setImgError(true)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                        <ImageOff size={40} className="mb-2 opacity-20" />
                        <span className="text-xs font-medium">Imagen no encontrada</span>
                    </div>
                )}

                <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded shadow-lg">
                        {property.transaction}
                    </span>
                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded shadow-lg">
                        {property.type}
                    </span>
                </div>

                <div className="absolute bottom-4 left-4">
                    <div className="text-white text-3xl font-black drop-shadow-2xl">
                        {/* Fixed: Use TransactionType.BUY constant instead of hardcoded string to avoid type mismatch */}
                        <span className="text-sm font-bold mr-1">{property.transaction === TransactionType.BUY ? 'USD' : '$'}</span>
                        {property.price.toLocaleString()}
                    </div>
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {property.title}
                </h3>
                <div className="flex items-center text-gray-400 text-sm mb-6">
                    <MapPin size={14} className="mr-1 flex-shrink-0 text-indigo-400" />
                    <span className="truncate">{property.address}</span>
                </div>

                <div className="flex items-center justify-between border-t border-gray-50 pt-5">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Superficie</span>
                        <span className="text-sm font-bold text-gray-700">{property.idecor.superficieM2} m²</span>
                    </div>
                    <button
                        onClick={() => onViewDetails(property)}
                        className="bg-gray-900 text-white p-3 rounded-xl hover:bg-indigo-600 transition-all duration-300 shadow-lg shadow-gray-200"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;




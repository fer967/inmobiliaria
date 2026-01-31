import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapComponentProps {
    center: [number, number];
    zoom: number;
    properties?: { location: [number, number]; title: string }[];
}

const MapComponent: React.FC<MapComponentProps> = ({ center, zoom, properties }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);

    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            mapInstance.current = L.map(mapRef.current).setView(center, zoom);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance.current);

            // Add a base marker for the property
            if (properties) {
                properties.forEach(p => {
                    L.marker(p.location).addTo(mapInstance.current!).bindPopup(p.title);
                });
            } else {
                L.marker(center).addTo(mapInstance.current!).bindPopup('Propiedad seleccionada');
            }
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [center, zoom, properties]);

    return <div ref={mapRef} className="h-full w-full rounded-xl overflow-hidden shadow-inner border border-gray-200" />;
};

export default MapComponent;

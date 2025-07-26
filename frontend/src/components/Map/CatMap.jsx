/**
 * CatMap.jsx
 * ---------------------------------------
 * Renders the main Leaflet map with bodega cat markers.
 * 
 * Dependencies:
 * - React, React Leaflet
 * - Leaflet for map rendering
 * - Lucide-react icons 
 * 
 * Notes:
 * - Leaflet marker icon paths are manually patched for compatibility with Vite 
 */
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Heart, Calendar } from 'lucide-react';
import { catAPI } from '../../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet marker fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
    iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
    shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
  });

// New custom cat marker
const catIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <circle cx="12" cy="12" r="10" fill="#f97316" stroke="#fff" stroke-width="2"/>
        <text x="12" y="16" text-anchor="middle" font-size="12" fill="white">🐱</text>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

function CatMap({ cats, onCatClick, center = [40.7128, -74.006] }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    return (
        <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '400px', width: '100%', borderRadius: '12px' }}
        className="shadow-md"
        >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            { /* loop through cats */ }
            {cats.map(cat => (
                <Marker
                  key={cat.id}
                  position={[cat.latitude, cat.longitude]}
                  icon={catIcon}
                  eventHandlers={{
                    click: () => onCatClick && onCatClick(cat)
                  }}
                >
                    <Popup className>
                        <div className="p-2 min-w-48">
                            {/* Cat image */}
                            <div className="mb-3">
                                <img
                                  src={catAPI.getImageUrl(cat.image_url)}
                                  alt={cat.name || 'Bodega Cat'}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                            </div>

                            {/* Cat Info */}
                            <div className="space-y-2">
                                <div className="flex items-start justify-between">
                                    <h3 className="front-semibold text-gray-800">
                                        {cat.name || 'Cat! (name unknown)'}
                                    </h3>
                                    <Heart size={16} className="text-red-400 fill-current" />
                                </div>

                                {cat.bodega_name && (
                                    <p className="text-sm text-orange-600 front medium flex items-center gap-1">
                                        <MapPin size={12} />
                                        {cat.bodega_name}
                                    </p>
                                )}

                                {cat.description && (
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {cat.description}
                                    </p>
                                )}
                                
                                <div className="flex items-ceter gap-1 text-xs text-gray-500 pt-2 border-t">
                                    <Calendar size={12} />
                                    Spotted {formatDate(cat.created_at)}
                                </div>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}

        </MapContainer>
    )

}
export default CatMap;
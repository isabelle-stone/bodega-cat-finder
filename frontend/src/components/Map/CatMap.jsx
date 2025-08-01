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
        <text x="12" y="16" text-anchor="middle" font-size="12" fill="white">CAT</text>
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
                    <Popup >
                        <div style={{
                            width: '250px',
                            maxWidth: '250px',
                            padding: '8px',
                            fontFamily: 'system-ui, -apple-system, sans-serif'
                        }}>
                            {/* Cat image & sizing */}
                            <div style={{marginBottom: '12px' }}>
                                <img
                                  src={catAPI.getImageUrl(cat.image_url)}
                                  alt={cat.name || 'Bodega Cat'}
                                  style={{
                                    width: '100%',
                                    height: '150px',
                                    objectFit: 'conatin',
                                    borderRadius: '8px',
                                    display: 'block',
                                    maxWidth: '100%'
                                  }}
                                />
                            </div>

                            {/* Cat Info */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3 style={{
                                        fontWeight: '600',
                                        color: '#1f2937',
                                        margin: '0',
                                        fontSize: '16px',
                                        lineHeight: '1.2'
                                    }}>
                                        {cat.name || 'Cat! (name unknown)'}
                                    </h3>
                                    <Heart size={16} style={{ color: '#f87171', fill: 'currentColor' }}  />
                                </div>

                                {cat.bodega_name && (
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#de6b2f',
                                        fontWeight: '500',
                                        margin: '0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'

                                    }}>
                                        <MapPin size={12} />
                                        {cat.bodega_name}
                                    </p>
                                )}

                                {cat.description && (
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#344761',
                                        margin: '0',
                                        lineHeight: '1.4',
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                    }}>
                                        {cat.description}
                                    </p>
                                )}
                                
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '12px',
                                    color: '#5b5e73',
                                    paddingTop: '8px',
                                    borderTop: '1px solid #e0dfeb',
                                    margin: '0'
                                }}>
                                    <Calendar size={12} />
                                    Spotted {formatDate(cat.created_at)}
                                </div>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}

        </MapContainer>
    );

}
export default CatMap;
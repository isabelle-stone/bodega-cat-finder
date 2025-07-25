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

import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Heart, Plus, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

        </MapContainer>
    )

}
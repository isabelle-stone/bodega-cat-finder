/**
 * CatCard.jsx
 * -----------
 * Cat card display
 */

import React from 'react';
import { MapPin, Heart, Clock } from 'lucide-react';
import { catAPI } from '../../services/api';

function CatCard({ cat, onClick }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
      onClick={() => onClick && onClick(cat)}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={catAPI.getImageUrl(cat.image_url)}
          alt={cat.name || 'Bodega cat'}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {cat.name || 'Anonymous Cat'}
          </h3>
          <Heart size={18} className="text-red-400 fill-current flex-shrink-0" />
        </div>
        
        {cat.bodega_name && (
          <p className="text-sm text-orange-600 font-medium mb-2 truncate">
            {cat.bodega_name}
          </p>
        )}
        
        {cat.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {cat.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {cat.latitude.toFixed(3)}, {cat.longitude.toFixed(3)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {formatDate(cat.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CatCard;
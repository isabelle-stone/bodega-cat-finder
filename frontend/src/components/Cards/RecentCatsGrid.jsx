/**
 * RecentCatsGrid.jsx
 * ------------------
 * Map popup-style grid display for recently added cats
 */

import React from 'react';
import { catAPI } from '../../services/api';

function RecentCatsGrid({ cats, onCatClick, limit }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '24px', 
      justifyContent: 'center' 
    }}>
      {cats.slice(0, limit || cats.length).map((cat) => {
        return (
          <div
            key={cat.id}
            className="shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300"
            onClick={() => onCatClick && onCatClick(cat)}
            style={{ 
              backgroundColor: '#FFCB61',
              borderRadius: '16px',
              width: '180px',
              flexBasis: 'calc(33.333% - 16px)',
              maxWidth: '180px'
            }}
          >
            {/* Cat Image */}
            <div 
              className="flex items-center justify-center"
              style={{ 
                height: '120px',
                padding: '12px'
              }}
            >
              <img
                src={catAPI.getImageUrl(cat.image_url)}
                alt={cat.name || 'Bodega cat'}
                className="hover:scale-110 transition-transform duration-300"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
              />
            </div>
            
            {/* Cat Info */}
            <div style={{ padding: '12px', paddingTop: '0' }}>
              <h4 className="font-bold text-sm mb-1 truncate text-gray-800">
                {cat.name || 'Anonymous Cat'}
              </h4>
              
              {cat.bodega_name && (
                <p className="text-xs text-gray-700 truncate mb-1 font-medium">
                  {cat.bodega_name}
                </p>
              )}
              
              <p className="text-xs text-gray-600">
                {formatDate(cat.created_at)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RecentCatsGrid;
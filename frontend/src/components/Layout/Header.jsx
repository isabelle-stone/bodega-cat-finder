/**
 * Header.jsx
 * ----------
 * App header
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Map } from 'lucide-react';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="cursor-pointer"
            onClick={() => navigate('/')}
          >
            <h1 className="text-2xl font-bold" style={{ color: '#FFCB61', textShadow:  ` -1px -1px 0 #00243b, 1px -1px 0 #00243b, -1px  1px 0 #00243b, 1px  1px 0 #00243b `}}>
              Bodega Cats NYC
            </h1>
            <p className="text-sm text-gray-600">
              Discover NYC's beloved bodega cats
            </p>
          </div>

          <div className="flex items-center gap-4">
            {location.pathname !== '/' && (
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                <Map size={20} />
                View Map
              </button>
            )}
            
            <button
              onClick={() => navigate('/add')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Spot a Cat
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
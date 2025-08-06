/**
 * Header.jsx
 * ----------
 * App header (with navigation buttons moved to individual pages)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="cursor-pointer"
            onClick={() => navigate('/')}
          >
            <h1 className="text-2xl font-bold" style={{ color: '#FFCB61', textShadow:  ` -1px -1px 0 #00243b, 1px -1px 0 #00243b, -1px  1px 0 #00243b, 1px  1px 0 #00243b `}}>
              NYC Bodega Cats!
            </h1>
            <p>
              The rats dont run this city, the bodega cats do.
            </p>
            
            <p>
            These cats are on the clock! Be kind, be gentle, and thank the humans who share their space.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
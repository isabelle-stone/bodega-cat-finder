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
    <header style={{
      background: 'linear-gradient(135deg, #8fc1e4 0%, #a8d5e8 100%)',
      padding: 'clamp(20px, 4vw, 40px) clamp(12px, 3vw, 20px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    }}>
      <div style={{
        maxWidth: 'min(90vw, 900px)',
        margin: '0 auto',
        width: '100%',
        background: 'white',
        borderRadius: 'clamp(12px, 3vw, 20px)',
        padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 32px)',
        textAlign: 'center'  
        
      }}>
        <div 
          onClick={() => navigate('/')}
          style={{ 
            cursor: 'pointer',
          }}
        >
          <h1 style={{ 
            color: '#FFCB61', 
            textShadow: '-1px -1px 0 #00243b, 1px -1px 0 #00243b, -1px 1px 0 #00243b, 1px 1px 0 #00243b',
            fontFamily: "'Libre Baskerville', serif",
            fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
            lineHeight: '1.2',
            marginBottom: 'clamp(12px, 3vw, 20px)',
            fontWeight: '700'
          }}>
            NYC Bodega Cats!
          </h1>
          
          <p style={{ 
            marginBottom: 'clamp(8px, 2vw, 16px)',
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: '#00243b',
            fontWeight: '600',
            lineHeight: '1.4'
          }}>
            The rats don't run this city, the bodega cats do.
          </p>
          
          <p style={{ 
            fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
            color: '#6C757D',
            lineHeight: '1.6',
            fontWeight: '400',
            fontStyle: 'italic',  // ITALICIZED!
            maxWidth: '650px',
            margin: '0 auto',
            padding: '0 clamp(8px, 2vw, 16px)'
          }}>
            <em>These cats are on the clock! Be kind, be gentle, and thank the humans who share their space.</em>
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;
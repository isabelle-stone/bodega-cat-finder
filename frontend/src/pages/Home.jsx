/**
 * Home.jsx
 * --------
 * Main home page with map and cat list
 */

import React, { useState } from 'react';
import { Grid, Map, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import CatMap from '../components/Map/CatMap';
import CatCard from '../components/Cards/CatCard';
import RecentCatsGrid from '../components/Cards/RecentCatsGrid';
import { useCats } from '../hooks/useCats';
import Header from '../components/Layout/Header';


function Home() {
  const { cats, loading, error } = useCats();
  const [viewMode, setViewMode] = useState('map');
  const navigate = useNavigate();

  const handleCatClick = (cat) => {
    console.log('Cat clicked:', cat);
    // potentially add navigate to cat details page
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading cats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">
          <h2 className="text-xl font-bold mb-2">Error loading cats...</h2>
          <p>{error}</p>
          <p className="text-sm mt-2">Make sure your backend is running on http://127.0.0.1:5050/api</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#8fc1e4' }}>
      <Header />

      {/* Stats bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3" style={{ textAlign: 'center' }}>
          <p className="text-gray-600">
            Found {cats.length} cats in NYC bodegas!
          </p>

          {/* View toggle and Add Cat button */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'map'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Map size={16} />
                Map
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid size={16} />
                Grid
              </button>
            </div>
            
            <button
              onClick={() => navigate('/add')}
              className="px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Plus size={20} />
              Spot a Cat
            </button>
          </div>

        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {viewMode === 'map' ? (
          /* Map */
          <div className="space-y-6">
            <CatMap
              cats={cats}
              onCatClick={handleCatClick}
              center={[40.7128, -74.0060]}
            />
            
            {/* Recent Cats Below Map */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Recently Added Cats
                </h2>
                {cats.length > 12 && (
                  <button
                    onClick={() => setViewMode('grid')}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    View all {cats.length} cats →
                  </button>
                )}
              </div>
              
              {cats.length > 0 ? (
                <RecentCatsGrid 
                  cats={cats} 
                  onCatClick={handleCatClick}
                  limit={9}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-4">No cats found yet!</p>
                  <p className="text-gray-500">Use the "Spot a Cat" button above to add the first cat!</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  All Bodega Cats ({cats.length})
                </h2>
                <button
                  onClick={() => setViewMode('map')}
                  className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2"
                >
                  <Map size={16} />
                  View on Map
                </button>
              </div>
              
              {cats.length > 0 ? (
                <RecentCatsGrid 
                  cats={cats} 
                  onCatClick={handleCatClick}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-4">No cats found yet!</p>
                  <p className="text-gray-500">Use the "Spot a Cat" button above to add the first cat!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
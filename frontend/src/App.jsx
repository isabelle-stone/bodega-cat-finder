import { useState, useEffect } from 'react'
import CatMap from './components/Map/CatMap.jsx'
import { useCats } from './hooks/useCats';
import './App.css'
import AddCatForm from './components/Forms/AddCatForm.jsx';


function App() {
  const { cats, loading, error, addCat } = useCats();

  const [showAddForm, setShowAddForm] = useState(false);

  const handleCatClick = (cat) => {
    console.log('Cat clicked: ', cat);
    // add more functionality ?
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm boarder-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Bodega Cat Finder
          </h1>
          <p className="text-gray-600">
            Found {cats.length} cats in NYC bodegas!
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <CatMap
          cats={cats}
          onCatClick={handleCatClick}
          center={[40.7128, -74.0060]}
        />

        <button
          onClick={() => setShowAddForm(prev => !prev)}
          className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow"
        >
          {showAddForm ? 'Cancel' : 'Add a Cat'}
        </button>

        {showAddForm && (
          <AddCatForm
            onCatAdded={async (newCat) => {
              const result = await addCat(newCat);
              if (result.success) {
                setShowAddForm(false);
              } else {
                alert("Failed to add cat: " + result.error);
              }
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}
      </main>
    </div>
  );
}

export default App
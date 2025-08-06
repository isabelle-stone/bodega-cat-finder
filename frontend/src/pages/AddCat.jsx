/**
 * AddCat.jsx
 * ----------
 * Dedicated page for adding new cats!
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import AddCatForm from '../components/Forms/AddCatForm';
import Header from '../components/Layout/Header';
import { useCats } from '../hooks/useCats';

function AddCat() {
    const navigate = useNavigate();
    const { addCat } = useCats();
    const handleCatAdded = async (newCat) => {
        const result = await addCat(newCat);
        if (result.success) {
            // Go back to home page after adding cat
            navigate('/', { 
                state: { message: 'Cat added successfully!' }
            });
        } else {
            alert("Failed to add cat: " + result.error);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            {/* Breadcrumb nav */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <button
                      onClick={() => navigate('/')}
                      className="flex items-center gap-2 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Map
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Tell us about this cat!!
                    </h2>
                    <p className="text-gray-600 text-sm">
                    Upload a photo and share details about where you found the kitty.
                    All fields except the photo are optional :)
                    </p>
                </div>

                <AddCatForm
                    onCatAdded={handleCatAdded}
                    onCancel={handleCancel}
                />
                </div>

                {/* Tips Section */}
                <div className="mt-8 bg-orange-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-900 mb-3">
                    Tips & Tricks!!
                </h3>
                <ul className="text-orange-800 text-sm space-y-2">
                    <li> You'll be able to crop the photo after uploading</li>
                    <li> Respect the cat and store owner!!! Ask permission if needed</li>
                </ul>
                </div>
            </main>
        </div>
    );
}
export default AddCat;
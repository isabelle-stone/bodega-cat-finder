/**
 * API calls to Flask backend
 * 
 * api.jsx
 */

const API_BASE = 'http://localhost:500/api';

export const catAPI = {
    // Get all cats..
    getAllCats: async () => {
        const response = await fetch(`${API_BASE}/cats`);
        if (!response.ok) throw new Error('Failed to get cats.');
        return response.json();
    },

    // Add new cat...
    addCat: async (forData) => {
        const response = await fetch(`${API_BASE}/cats`, {
            method: 'POST',
            body: forData
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add cat.');
        }
        return response.json();
    },

    // Get image URL
    getImageUrl: (imageUrl) => {
        return `${API_BASE.replace('/api', '')}${imageUrl}`;
    }
};
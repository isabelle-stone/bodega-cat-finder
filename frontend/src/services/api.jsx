/**
 * API calls to Flask backend
 * 
 * api.jsx
 */

const API_BASE = 'http://127.0.0.1:5050/api';

export const catAPI = {
    
    // Get all cats..

    // getAllCats: async () => {
    //     const response = await fetch(`${API_BASE}/cats`);
    //     if (!response.ok) throw new Error('Failed to get cats.');
    //     return response.json();
    // },

    getAllCats: async () => {
        const response = await fetch(`${API_BASE}/cats`);
        console.log("Response:", response);
        const data = await response.json();
        console.log("Parsed data:", data);
        return data;
    },

    // Add new cat...
    addCat: async (formData) => {
        const response = await fetch(`${API_BASE}/cats`, {
            method: 'POST',
            body: formData
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
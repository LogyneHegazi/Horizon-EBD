const API_URL = 'http://localhost:3000/api/listings';

// Get authentication token
const getToken = () => {
    return localStorage.getItem('token');
};

// Common request function
const sendRequest = async (endpoint, options = {}) => {

    const token = getToken();

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && {
                Authorization: `Bearer ${token}`
            }),
            ...options.headers
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
};

// Create a listing
export const createListing = (listingData) => {
    return sendRequest('', {
        method: 'POST',
        body: JSON.stringify(listingData)
    });
};

// Get tutor's listings
export const getMyListings = () => {
    return sendRequest('/my-listings');
};

// Update a listing
export const updateListing = (id, listingData) => {
    return sendRequest(`/${id}`, {
        method: 'PUT',
        body: JSON.stringify(listingData)
    });
};

// Deactivate a listing
export const deactivateListing = (id) => {
    return sendRequest(`/${id}/deactivate`, {
        method: 'PATCH'
    });
};
// Reactivate a listing
export const reactivateListing = (id) => {
    return sendRequest(`/${id}/reactivate`, {
        method: 'PATCH'
    });
};

// Delete a listing
export const deleteListing = (id) => {
    return sendRequest(`/${id}`, {
        method: 'DELETE'
    });
};
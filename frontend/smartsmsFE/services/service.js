import axios from 'axios'

const baseUrl = 'http://localhost:3001/api'

const getResidents = async () => {
    try {
        const residents = await axios.get(`${baseUrl}/resident/all`)
        return residents
    } catch (err) {
        console.error('ERROR FETCHING RESIDENT')
        throw err
    }
}

export const registerResident = async (residentData) => {
    try {
        const response = await axios.post(`${baseUrl}/resident/register`, residentData);
        return response.data; // Return the response data (e.g., the newly created resident)
    } catch (error) {
        console.error("Error registering resident:", error);
        throw error; // Re-throw the error for handling in the calling function
    }
}

const deleteResident = async (residentId) => {
    return axios.delete(`${baseUrl}/resident/delete/${residentId}`);
}

const updateResident = async (residentId, residentData) => {
    try {
        const response = await axios.put(`${baseUrl}/resident/update/${residentId}`, residentData);
        return response.data;
    } catch (error) {
        console.error("Error updating resident:", error);
        throw error;
    }
};

const sendSms = async (phoneNumbers, message, createdBy, broadcastType) => {
    try {
        // Validate input before making the API call
        if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
            throw new Error('Phone numbers must be a non-empty array');
        }
        if (!message || typeof message !== 'string' || message.trim() === '') {
            throw new Error('Message is required and must be a non-empty string');
        }
        if (!createdBy || typeof createdBy !== 'string' || createdBy.trim() === '') {
            throw new Error('Created by field is required and must be a non-empty string');
        }

        // Make the POST request to the backend
        const response = await axios.post(`${baseUrl}/send-sms`, {
            phoneNumbers,
            message,
            createdBy,
            broadcastType
        });

        // Return the server's response
        return response.data;
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw error; // Re-throw the error for handling in the calling function
    }
};

const getBroadcastHistory = async () => {
    try {
        const response = await axios.get(`${baseUrl}/history/getall`);
        return response.data; // Return only the data
    } catch (error) {
        console.error('Error fetching broadcast history:', error);
        throw error; // Re-throw the error for handling in the calling function
    }
};

// DOCUMENT REQUEST FUNCTIONS
const submitDocumentRequest = async (requestData) => {
    try {
        const response = await axios.post(`${baseUrl}/resident/documentRequest`, requestData);
        return response.data;
    } catch (error) {
        console.error('Error submitting document request:', error);
        throw error;
    }
};

const getAllDocumentRequests = async () => {
    try {
        const response = await axios.get(`${baseUrl}/admin/allrequest`);
        return response.data;
    } catch (error) {
        console.error('Error fetching document requests:', error);
        throw error;
    }
};

const getPendingDocumentRequests = async () => {
    try {
        const response = await axios.get(`${baseUrl}/admin/pendingrequest`);
        return response.data;
    } catch (error) {
        console.error('Error fetching document requests:', error);
        throw error;
    }
};

const updateDocumentRequestStatus = async (id, status) => {
    try {
        const response = await fetch(`${baseUrl}/admin/updaterequests/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update status');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in updateDocumentRequestStatus:', error);
        throw error;
    }
}
const loginAdmin = async (username, password) => {
    try {
        const res = await axios.post(`${baseUrl}/admin/login`, { username, password });
        return res.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

const verifyAdminToken = async (token) => {
    try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await axios.get(`${baseUrl}/admin/verify-token`);
        return true;
    } catch (error) {
        console.error("Token verification failed:", error);
        return false;
    }
};

// Broadcast Template Service Functions
const getTemplates = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseUrl}/templates`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching templates:', error);
        throw error;
    }
};

const addTemplate = async (template) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${baseUrl}/templates`, template, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding template:', error);
        throw error;
    }
};

const updateTemplate = async (id, template) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${baseUrl}/templates/${id}`, template, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating template:', error);
        throw error;
    }
};

const deleteTemplate = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${baseUrl}/templates/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting template:', error);
        throw error;
    }
};

// Add: Verify document request code
const verifyDocumentRequest = async ({ email, code }) => {
    try {
        const response = await axios.post(`${baseUrl}/resident/verifyDocumentRequest`, { email, code });
        return response.data;
    } catch (error) {
        console.error('Error verifying document request:', error);
        throw error;
    }
};

export default {
    getResidents,
    registerResident,
    deleteResident,
    updateResident,
    sendSms,
    getBroadcastHistory,
    // Document request exports
    submitDocumentRequest,
    getAllDocumentRequests,
    getPendingDocumentRequests,
    updateDocumentRequestStatus,
    loginAdmin,
    verifyAdminToken,
    // Broadcast template exports
    getTemplates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    verifyDocumentRequest,
};
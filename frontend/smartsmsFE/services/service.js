import axios from 'axios'

const baseUrl = '/api'

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

const updateDocumentRequestStatus = async (id, status, additionalData = {}) => {
    try {
        // Get the authentication token from localStorage or wherever you store it
         // or however you store your auth token
        
        const response = await axios.put(`${baseUrl}/admin/updaterequests/${id}`, 
            { status, ...additionalData }, 
        );

        return response.data;
    } catch (error) {
        console.error('Error in updateDocumentRequestStatus:', error);
        throw error.response?.data?.message || error.message || 'Failed to update status';
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

// --- Admin Accounts CRUD ---
const getAdminAccounts = async () => {
    const res = await axios.get(`${baseUrl}/admin/accounts`);
    return res.data;
};
const addAdminAccount = async (admin) => {
    const res = await axios.post(`${baseUrl}/admin/accounts`, admin);
    return res.data;
};
const updateAdminAccount = async (id, update) => {
    const res = await axios.put(`${baseUrl}/admin/accounts/${id}`, update);
    return res.data;
};
const deleteAdminAccount = async (id) => {
    const res = await axios.delete(`${baseUrl}/admin/accounts/${id}`);
    return res.data;
};

const getAdminActionHistory = async (token) => {
    try {
        const response = await axios.get(`${baseUrl}/admin/action-history`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching admin action history:', error);
        throw error;
    }
};


// ================================
// HOUSEHOLD SERVICES
// ================================

// Get all households
const getHouseholds = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseUrl}/households`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching households:', error);
        throw error;
    }
};

// Get single household with members
const getHousehold = async (householdId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseUrl}/households/${householdId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching household:', error);
        throw error;
    }
};

// Get household details with all members for printing
const getHouseholdForPrint = async (householdId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseUrl}/households/${householdId}/print`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching household for print:', error);
        // Fallback to regular household endpoint if print endpoint doesn't exist
        if (error.response?.status === 404) {
            console.warn('Print endpoint not found, falling back to regular household endpoint');
            return await getHousehold(householdId);
        }
        throw error;
    }
};

// Create new household
const createHousehold = async (householdData, members) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${baseUrl}/households`, {
            householdData,
            members
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating household:', error);
        throw error;
    }
};

// Update household
const updateHousehold = async (householdId, householdData) => {
    try {
        const token = localStorage.getItem('token');
        console.log('Updating household:', householdId, 'with data:', householdData);
        
        const response = await axios.put(`${baseUrl}/households/${householdId}`, {
            householdData
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Household update response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating household:', error.response?.data || error.message);
        throw error;
    }
};

// Add member to household
const addHouseholdMember = async (householdId, memberData, isExisting = false) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${baseUrl}/households/${householdId}/members`, {
            memberData,
            isExisting
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding household member:', error);
        throw error;
    }
};

// Remove member from household
const removeHouseholdMember = async (householdId, memberId, action = 'unassign') => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${baseUrl}/households/${householdId}/members/${memberId}?action=${action}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error removing household member:', error);
        throw error;
    }
};

// Change household head
const changeHouseholdHead = async (householdId, newHeadId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${baseUrl}/households/${householdId}/head`, {
            newHeadId
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error changing household head:', error);
        throw error;
    }
};

// Get unassigned residents
const getUnassignedResidents = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseUrl}/residents/unassigned`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching unassigned residents:', error);
        throw error;
    }
};

// Get household audit history
const getHouseholdAudit = async (householdId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseUrl}/households/${householdId}/audit`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching household audit:', error);
        throw error;
    }
};

// Delete household
const deleteHousehold = async (householdId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${baseUrl}/households/${householdId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting household:', error);
        throw error;
    }
};

// Delete household with residents
const deleteHouseholdWithResidents = async (householdId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${baseUrl}/households/${householdId}/with-residents`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting household with residents:', error);
        throw error;
    }
};

// Export all services including household services
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
    // Admin accounts
    getAdminAccounts,
    addAdminAccount,
    updateAdminAccount,
    deleteAdminAccount,
    // Admin action history
    getAdminActionHistory,    // Household services
    getHouseholds,
    getHousehold,
    getHouseholdForPrint,
    createHousehold,
    updateHousehold,
    addHouseholdMember,
    removeHouseholdMember,
    changeHouseholdHead,
    getUnassignedResidents,
    getHouseholdAudit,
    deleteHousehold,
    deleteHouseholdWithResidents
};
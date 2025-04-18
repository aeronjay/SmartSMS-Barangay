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

const sendSms = async (phoneNumbers, message, createdBy) => {
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
            createdBy
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
        const response = await axios.post(`${baseUrl}/requests`, requestData);
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

const updateDocumentRequestStatus = async (requestId, status) => {
    try {
        const response = await axios.put(`${baseUrl}/requests/${requestId}`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating document request status:', error);
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
    updateDocumentRequestStatus
};

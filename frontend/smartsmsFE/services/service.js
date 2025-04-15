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

export default {
    getResidents,
    registerResident,
    deleteResident,
    updateResident
}
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

export default {
    getResidents,
    registerResident,
    deleteResident
}
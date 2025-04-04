import axios from 'axios'


const baseUrl = '/api'

const getResidents = async () => {
    try{
        const residents = await axios.get(`${baseUrl}/resident/all`)
        return residents
    }catch(err){
        console.error('ERROR FETCHING RESIDENT')
        throw err
    }
}


export default { 
    getResidents
}
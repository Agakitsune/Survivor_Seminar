
import axios from 'axios'

function login(email, password) {
    const headers = {
        'accept': 'application/json',
        'X-Group-Authorization': 'oNLNtdimPh8oE_Qi-dBQDvujQsSm7tMN',
        'Content-Type': 'application/json'
    }

    return (axios.post('https://masurao.fr/api/employees/login', {email, password}, {headers}))
}

function getEmployees(token) {
    const headers = {
        'accept': 'application/json',
        'X-Group-Authorization': 'oNLNtdimPh8oE_Qi-dBQDvujQsSm7tMN',
        'Authorization': 'Bearer ' + token
    };

    return (axios.get('https://masurao.fr/api/employees', {headers}))
}

export {login, getEmployees};
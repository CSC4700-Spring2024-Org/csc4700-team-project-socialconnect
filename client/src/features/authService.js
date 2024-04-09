import axios from 'axios'

const API_URL = 'http://localhost:8080/api/';

axios.defaults.withCredentials = true;

const register = async (userData) => {
    const response = await axios.post(API_URL + 'register', userData);

    return response.data;
}

const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData);

    return response.data;
}

const refreshToken = async () => {
    const response = await axios.post(API_URL + 'refreshToken');

    return response.data;
}

const getUser = async () => {
    try {
        const response = await axios.get(API_URL + 'profile');

        return response.data;
    } catch (error) {
        if (error.response.status === 401) {
            const refreshResponse = await refreshToken();
            if (refreshResponse !== 401) {
                const newResponse = await axios.get(API_URL + 'profile');
                return newResponse.data;
            }
        }
    }
}


const authService = {
    register,
    login,
    refreshToken,
    getUser,
}

export default authService;
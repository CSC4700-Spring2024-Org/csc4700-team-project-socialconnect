import axios from 'axios'

const API_URL = 'https://api.danbfrost.com:443/api/';

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

const logout = async () => {
    try {
        const response = await axios.post(API_URL + 'logout')

        return response.data;
    } catch (error) {
        if (error.response.status === 401) {
            const refreshResponse = await refreshToken();
            if (refreshResponse !== 401) {
                const newResponse = await axios.post(API_URL + 'logout');
                return newResponse.data;
            }
        }
    }
}

const setInstagram = async (instaToken) => {
    try {
        const response = await axios.post(API_URL + 'setInstagram', {token : instaToken});

        return instaToken;
    } catch (error) {
        if (error.response.status === 401) {
            const refreshResponse = await refreshToken();
            if (refreshResponse !== 401) {
                const newResponse = await axios.post(API_URL + 'setInstagram', instaToken);
                return instaToken;
            }
        }
    }
}


const authService = {
    register,
    login,
    refreshToken,
    getUser,
    logout,
    setInstagram
}

export default authService;
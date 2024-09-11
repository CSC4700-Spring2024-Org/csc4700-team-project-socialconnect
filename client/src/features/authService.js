import axios from 'axios'

//const API_URL = 'https://api.danbfrost.com:443/api/';
const API_URL = 'http://localhost:8080/api/'

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
    const response = await axios.get(API_URL + 'profile');

    return response.data;
}

const logout = async () => {
    const response = await axios.post(API_URL + 'logout')

    return response.data;
}

const setInstagram = async (instaToken) => {
    const response = await axios.post(API_URL + 'setInstagram', {token : instaToken});

    return response.data;
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
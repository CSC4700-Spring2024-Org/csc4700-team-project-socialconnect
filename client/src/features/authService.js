import axios from 'axios'

<<<<<<< HEAD
const API_URL = process.env.REACT_APP_BACKEND_URL
=======
//const API_URL = 'https://api.danbfrost.com:443/api/';
const API_URL = 'http://localhost:8080/api/'
>>>>>>> 60bb0cfde84bbe347365fb943adc491fe1482467

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
<<<<<<< HEAD
}

const tiktokLogout = async() => {
    const res = await axios.post(API_URL + 'tiktokLogout')
    return res.data
=======
>>>>>>> 60bb0cfde84bbe347365fb943adc491fe1482467
}


const authService = {
    register,
    login,
    refreshToken,
    getUser,
    logout,
    setInstagram,
    tiktokLogout
}

export default authService;
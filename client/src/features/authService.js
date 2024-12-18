import axios from 'axios'

const API_URL = process.env.REACT_APP_BACKEND_URL

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

const tiktokLogout = async() => {
    const res = await axios.post(API_URL + 'tiktokLogout')
    return res.data
}

const youtubeLogout = async() => {
    const res = await axios.post(API_URL + 'youtubeLogout')
    return res.data
}

const removePostStatusMessage = async() => {
    const res = await axios.post(API_URL + 'removeMessage')
    return res.data
}


const authService = {
    register,
    login,
    refreshToken,
    getUser,
    logout,
    setInstagram,
    tiktokLogout,
    youtubeLogout,
    removePostStatusMessage
}

export default authService;
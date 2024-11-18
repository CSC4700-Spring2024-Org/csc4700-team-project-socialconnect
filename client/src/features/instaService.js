import axios from 'axios'

<<<<<<< HEAD
const API_URL = process.env.REACT_APP_BACKEND_URL

const getInstaProfile = async () => {
    const res = await axios.get(API_URL + 'instagramProfile')
    if (res.data.error) {
        return res.data
    }
    return {instaPage: res.data.instaResponse.business_discovery, comments: res.data.instaResponse.comments, tiktokPage: res.data.tiktokResponse?.data?.videos, insights: res.data.instaResponse.insights}
}

const createInstagramPost = async(postData) => {
    const res = await axios.post(API_URL + 'createInstagramPost', postData, {
=======
const getInstaProfile = async (token) => {
    const res = await axios.get(`http://localhost:8080/api/instagramProfile?token=${token}`)
    if (res.data.error) {
        return res.data
    }
    return {page: res.data.business_discovery, comments: res.data.comments}
}

const createInstagramPost = async(token, postData) => {
    const res = await axios.post(`http://localhost:8080/api/createInstagramPost?token=${token}`, postData, {
>>>>>>> 60bb0cfde84bbe347365fb943adc491fe1482467
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return res
}

<<<<<<< HEAD
const replyInstagram = async(replyData) => {
    const res = await axios.post(API_URL + 'replyInstagram', replyData)
    return {oldID: replyData.id, newComment:res.data}
}

const tiktokInitializeLogin = async() => {
    const res = await axios.get(API_URL + 'tiktokInitializeLogin')
    return res.data
=======
const replyInstagram = async(token, replyData) => {
    const res = await axios.post(`http://localhost:8080/api/replyInstagram?token=${token}`, replyData)
    return {oldID: replyData.id, newComment:res.data}
>>>>>>> 60bb0cfde84bbe347365fb943adc491fe1482467
}

const instaService = {
    getInstaProfile,
    createInstagramPost,
<<<<<<< HEAD
    replyInstagram,
    tiktokInitializeLogin
=======
    replyInstagram
>>>>>>> 60bb0cfde84bbe347365fb943adc491fe1482467
}

export default instaService;
import axios from 'axios'

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
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return res
}

const replyInstagram = async(replyData) => {
    const res = await axios.post(API_URL + 'replyInstagram', replyData)
    return {oldID: replyData.id, newComment:res.data}
}

const tiktokInitializeLogin = async() => {
    const res = await axios.get(API_URL + 'tiktokInitializeLogin')
    return res.data
}

const instaService = {
    getInstaProfile,
    createInstagramPost,
    replyInstagram,
    tiktokInitializeLogin
}

export default instaService;
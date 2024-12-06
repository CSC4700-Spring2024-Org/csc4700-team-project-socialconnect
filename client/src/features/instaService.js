import axios from 'axios'

const API_URL = process.env.REACT_APP_BACKEND_URL

const getInstaProfile = async () => {
    const res = await axios.get(API_URL + 'instagramProfile')
    if (res.data.error) {
        return res.data
    }
    return {instaPage: res.data.instaResponse.business_discovery, comments: res.data.instaResponse.comments, tiktokPage: res.data.tiktokResponse, insights: res.data.instaResponse.insights, youtubePage: res.data.youtubeResponse}
}

const createInstagramPost = async(postData) => {
    const res = await axios.post(API_URL + 'createInstagramPost', postData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    console.log(res.data)
    return res
}

const replyInstagram = async(replyData) => {
    const res = await axios.post(API_URL + 'replyInstagram', replyData)
    return {oldID: replyData.id, newComment:res.data}
}

const replyYoutube = async(replyData) => {
    const res = await axios.post(API_URL + 'replyYoutube', replyData)
    return {oldID: replyData.id, newComment:res.data}
}

const tiktokInitializeLogin = async() => {
    const res = await axios.get(API_URL + 'tiktokInitializeLogin')
    return res.data
}

const youtubeInitializeLogin = async() => {
    const res = await axios.get(API_URL + 'youtubeInitializeLogin')
    return res.data
}

const createFuturePost = async(postData, datetime) => {
    const res = await axios.post(API_URL + `schedulePost?datetime=${datetime}`, postData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return res
}

const instaService = {
    getInstaProfile,
    createInstagramPost,
    replyInstagram,
    tiktokInitializeLogin,
    createFuturePost,
    youtubeInitializeLogin,
    replyYoutube
}

export default instaService;
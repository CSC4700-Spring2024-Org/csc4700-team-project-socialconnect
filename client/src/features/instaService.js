import axios from 'axios'

const getInstaProfile = async (token) => {
    const res = await axios.get(`https://api.danbfrost.com:443/api/instagramProfile?token=${token}`)
    if (res.data.error) {
        return res.data
    }
    return {page: res.data.business_discovery, comments: res.data.comments}
}

const createInstagramPost = async(token, postData) => {
    const res = await axios.post(`https://api.danbfrost.com:443/api/createInstagramPost?token=${token}`, postData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return res
}

const replyInstagram = async(token, replyData) => {
    const res = await axios.post(`https://api.danbfrost.com:443/api/replyInstagram?token=${token}`, replyData)
    return {oldID: replyData.id, newComment:res.data}
}

const tiktokInitializeLogin = async() => {
    const res = await axios.get('https://api.danbfrost.com:443/api/tiktokInitializeLogin')
    return res.data
}

const instaService = {
    getInstaProfile,
    createInstagramPost,
    replyInstagram,
    tiktokInitializeLogin
}

export default instaService;
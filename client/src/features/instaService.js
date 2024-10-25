import axios from 'axios'

const getInstaProfile = async (token) => {
    const res = await axios.get(`http://localhost:8080/api/instagramProfile?token=${token}`)
    if (res.data.error) {
        return res.data
    }
    return {page: res.data.business_discovery, comments: res.data.comments, insights: res.data.insights}
}

const createInstagramPost = async(token, postData) => {
    const res = await axios.post(`http://localhost:8080/api/createInstagramPost?token=${token}`, postData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return res
}

const replyInstagram = async(token, replyData) => {
    const res = await axios.post(`http://localhost:8080/api/replyInstagram?token=${token}`, replyData)
    return {oldID: replyData.id, newComment:res.data}
}

const instaService = {
    getInstaProfile,
    createInstagramPost,
    replyInstagram
}

export default instaService;
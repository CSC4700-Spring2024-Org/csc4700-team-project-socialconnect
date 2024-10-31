import axios from 'axios'

const getInstaProfile = async () => {
    const res = await axios.get(`http://localhost:8080/api/instagramProfile`)
    if (res.data.error) {
        return res.data
    }
    return {instaPage: res.data.instaResponse.business_discovery, comments: res.data.instaResponse.comments, tiktokPage: res.data.tiktokResponse.data.videos}
}

const createInstagramPost = async(postData) => {
    const res = await axios.post(`http://localhost:8080/api/createInstagramPost`, postData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return res
}

const replyInstagram = async(replyData) => {
    const res = await axios.post(`http://localhost:8080/api/replyInstagram`, replyData)
    return {oldID: replyData.id, newComment:res.data}
}

const tiktokInitializeLogin = async() => {
    const res = await axios.get('http://localhost:8080/api/tiktokInitializeLogin')
    return res.data
}

const instaService = {
    getInstaProfile,
    createInstagramPost,
    replyInstagram,
    tiktokInitializeLogin
}

export default instaService;
import axios from 'axios'

const getInstaProfile = async (token) => {
    const res = await axios.get(`http://localhost:8080/api/instagramProfile?token=${token}`)
    return {page: res.data.business_discovery, comments: res.data.comments}
}

const instaService = {
    getInstaProfile
}

export default instaService;
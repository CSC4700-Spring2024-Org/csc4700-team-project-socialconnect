import axios from 'axios'

const getInstaProfile = async (instaAccountId, token) => {
    const username = await axios.get(`https://graph.facebook.com/v19.0/${instaAccountId}?fields=username&access_token=${token}`, {withCredentials : false})
    const response = await axios.get(`https://graph.facebook.com/v19.0/${instaAccountId}?fields=business_discovery.username(${username.data.username}){username,website,name,ig_id,id,profile_picture_url,biography,follows_count,followers_count,media_count,media{id,caption,like_count,comments_count,timestamp,username,media_product_type,media_type,owner,permalink,media_url,children{media_url}}}&access_token=${token}`, {withCredentials: false});

    return response.data;
}

const instaService = {
    getInstaProfile
}

export default instaService;
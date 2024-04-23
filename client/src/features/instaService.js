import axios from 'axios'

const getInstaProfile = async (instaAccountId, token) => {
    const username = await axios.get(`https://graph.facebook.com/v19.0/${instaAccountId}?fields=username&access_token=${token}`, {withCredentials : false})
    const response = await axios.get(`https://graph.facebook.com/v19.0/${instaAccountId}?fields=business_discovery.username(${username.data.username}){username,website,name,ig_id,id,profile_picture_url,biography,follows_count,followers_count,media_count,media{id,caption,like_count,comments_count,timestamp,username,media_product_type,media_type,owner,permalink,media_url,children{media_url}}}&access_token=${token}`, {withCredentials: false});

    let commentsArr = []
    for (let i = 0; i < Math.min(response.data.business_discovery.media.data.length, 10); i++) {
        const commentResponse = await axios.get(`https://graph.facebook.com/v19.0/${response.data.business_discovery.media.data[i].id}/comments?fields=username,text,timestamp,replies{username,text,timestamp}&access_token=${token}`, {withCredentials: false})
        commentsArr.push(commentResponse.data.data)
    }
    return {page : response.data, comments : commentsArr};
}

const instaService = {
    getInstaProfile
}

export default instaService;
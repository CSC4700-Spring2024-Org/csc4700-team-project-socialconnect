import React, {useState} from 'react'

const Post = () => {
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
        }
    };
    return (
        <div>
            <h1>Image</h1>
            <input type="file" onChange={handleImageChange} />
        </div>
    )
}

export default Post
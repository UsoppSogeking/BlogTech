import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase';
import { formatDistanceToNow } from 'date-fns';
import { getUserName, getUserPhotoUrl } from '../../utils/userUtils';
import { Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import './Favorites.css';

const Favorites = () => {
    const [favoritePosts, setFavoritesPosts] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchFavoritePosts = async () => {
            try {
                if (!user) return;

                //Obtem o documento do usuário
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    const userFavorites = userDocSnapshot.data().favoritePosts || [];
                    const favoritePostsData = [];

                    //buscar pelos posts favoritados
                    for (const postId of userFavorites) {
                        const postDocRef = doc(db, 'posts', postId);
                        const postDocSnapshot = await getDoc(postDocRef);

                        if (postDocSnapshot.exists()) {
                            const postData = postDocSnapshot.data();
                            const userId = postData.userId;
                            const userName = await getUserName(userId);
                            const userPhotoUrl = await getUserPhotoUrl(userId);

                            favoritePostsData.push({ id: postId, ...postData, user: { name: userName, photoUrl: userPhotoUrl } })
                        }
                    }
                    setFavoritesPosts(favoritePostsData);
                }
            } catch (error) {
                console.error('Error fetching favorite posts:', error);
            }
        }
        fetchFavoritePosts();
    }, [user]);

    const handlePostClick = (postId) => {
        navigate(`/postdetails/${postId}`);
    }

    return (
        <div className="container">
            <h2 className="my-4">Postagens favoritas</h2>
            {favoritePosts.length > 0 ? (
                <div className="row">
                    {favoritePosts.map((post, index) => (
                        <div key={index} className="col-md-6">
                            <div className="card mb-3" style={{ cursor: 'pointer' }} onClick={() => handlePostClick(post.id)}>
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-2">
                                        <Image src={post.user.photoUrl} className="me-3" alt="User Thumbnail" roundedCircle style={{ width: '40px', height: '40px' }} />
                                        <div>
                                            <h5 className="card-title">{post.user.name}</h5>
                                        </div>
                                    </div>
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className="card-text">{post.content.slice(0, 100)}</p>
                                    <p className="card-text">
                                        <small className="text-muted">{formatDistanceToNow(new Date(post.createdAt.toDate()))} ago</small>
                                        {post.interests.slice(0, 2).map((interest, index) => (
                                            <span key={index} className="badge bg-secondary ms-2">{interest}</span>
                                        ))}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>não há post favoritado.</div>
            )}

        </div>
    )
}

export default Favorites
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useState } from 'react';
import { useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { getUserName, getUserPhotoUrl } from '../../utils/userUtils';
import { Image } from 'react-bootstrap';
import { AiOutlineHeart, AiFillHeart, AiOutlineRead } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import useFavorites from '../../hooks/useFavorites';

import './Home.css';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postCollection = collection(db, 'posts');
                const q = query(postCollection, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const fetchedPosts = [];

                for (const docSnap of querySnapshot.docs) {
                    const postData = docSnap.data();
                    const userId = postData.userId;

                    // Buscar o nome e a URL da foto do usuário
                    const userName = await getUserName(userId);
                    const userPhotoUrl = await getUserPhotoUrl(userId);

                    // Adicionar os dados do usuário ao objeto de post
                    fetchedPosts.push({ id: docSnap.id, ...postData, user: { name: userName, photoUrl: userPhotoUrl } });
                }

                setPosts(fetchedPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        }
        fetchPosts();
    }, []);

    const handlePostClick = (postId) => {
        navigate(`/postdetails/${postId}`);
    }

    return (
        <>
            <div className="banner p-5 text-center bg-dark text-white">
                <h1 className="display-4">Stay curious.</h1>
                <p className="lead">Discover stories, thinking, and expertise from writers on any topic.</p>
            </div>

            <div className="container">
                <h2 className="my-4">Latest Posts</h2>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {posts.map((post) => (
                        <div key={post.id} className="col">
                            <div className={`card h-100 ${isHovered ? 'card-hover' : ''}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={{ cursor: 'pointer' }}>
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex align-items-center mb-2">
                                        <Image
                                            src={post.user.photoUrl}
                                            className="me-3"
                                            alt="User Thumbnail"
                                            roundedCircle
                                            style={{ width: '40px', height: '40px' }}
                                        />
                                        <div>
                                            <h5 className="card-title">{post.user.name}</h5>
                                        </div>
                                    </div>
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className="card-text flex-grow-1">{post.content.slice(0, 100)}</p>
                                    <p className="card-text mt-auto">
                                        <small className="text-muted">
                                            {formatDistanceToNow(new Date(post.createdAt.toDate()))} ago
                                        </small>
                                        {post.interests.slice(0, 2).map((interest, index) => (
                                            <span key={index} className="badge bg-secondary ms-2">{interest}</span>
                                        ))}
                                    </p>
                                </div>
                                <div className="card-footer">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <button type="button" className="btn btn-outline-warning me-2 read-button flex-grow-1" onClick={() => handlePostClick(post.id)}>
                                            <AiOutlineRead />
                                        </button>
                                        <FavoriteButton postId={post.id} className="btn btn-outline-warning flex-grow-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

const FavoriteButton = ({ postId }) => {
    const { isFavorite, toggleFavorite } = useFavorites(postId);

    return (
        <button title='Favorites' type='button' className={`btn btn-outline-danger btn-sm float-end favorite-button ${isFavorite ? 'active' : ''}`} onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
        }}>
            {isFavorite ? (
                <>
                    <AiFillHeart style={{ color: '#fff' }} />
                    {/* <span>Remove from favorites</span> */}
                </>
            ) : (
                <>
                    <AiOutlineHeart style={{ color: '#dc3545' }} />
                    {/* <span>Add to favorites</span> */}
                </>
            )}
        </button>
    )
}

export default Home
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useState } from 'react';
import { useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { getUserName, getUserPhotoUrl } from '../../utils/userUtils';
import { Image } from 'react-bootstrap';
import { IoBookmarkOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [posts, setPosts] = useState([]);
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
                <div className="row">
                    {posts.map((post) => (
                        <div key={post.id} className="col-md-6" onClick={() => handlePostClick(post.id)}>
                            <div className="card mb-3" style={{cursor: 'pointer'}}>
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-2">
                                        <Image
                                            src={post.user.photoUrl}
                                            className="img-thumbnail me-3"
                                            alt="User Thumbnail"
                                            roundedCircle
                                            style={{ width: '48px', height: '48px' }}
                                        />
                                        <div>
                                            <h5 className="card-title">{post.user.name}</h5>
                                        </div>
                                    </div>
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className="card-text">{post.content.slice(0, 100)}</p>
                                    <p className="card-text">
                                        <small className="text-muted">
                                            {formatDistanceToNow(new Date(post.createdAt.toDate()))} ago
                                        </small>
                                        <span className="badge bg-secondary ms-2">
                                            {post.interests[0]}
                                        </span>
                                        <button type="button" className="btn btn-outline-warning btn-sm float-end">
                                            <IoBookmarkOutline />
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </>

    )
}

export default Home
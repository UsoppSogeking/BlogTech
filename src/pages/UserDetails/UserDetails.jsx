import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Image, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { collection, getDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import useFollow from '../../hooks/useFollow';
import { getFollowerCount } from '../../utils/userUtils';

const UserDetails = () => {
    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [userPostCount, setUserPostCount] = useState(0);
    const { isFollowing, followUser } = useFollow(userId);
    const [followButtonText, setFollowButtonText] = useState('');
    const [followerCount, setFollowerCount] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', userId));
                if (userDoc.exists()) {
                    setUserDetails(userDoc.data());
                } else {
                    console.error('Dados do usuário não encontrados para o usuário com o ID:', userId);
                }
            } catch (error) {
                console.error('Erro ao buscar detalhes do usuário:', error);
            }
        };

        const fetchUserPosts = async () => {
            try {
                const q = query(collection(db, 'posts'), where('userId', '==', userId));
                const snapshot = await getDocs(q);
                const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUserPosts(postsData);
                setUserPostCount(postsData.length);
            } catch (err) {
                console.error('Erro ao buscar posts do usuário:', err);
            }
        };

        fetchUserData();
        fetchUserPosts();
    }, [userId]);

    useEffect(() => {
        // Função assíncrona para obter a contagem de seguidores
        const fetchFollowerCount = async () => {
            try {
                // Verifica se o usuário atual está autenticado
                if (userId) {
                    // Chama a função getFollowerCount para obter a contagem de seguidores
                    const count = await getFollowerCount(userId);
                    // Atualiza o estado com a contagem de seguidores obtida
                    setFollowerCount(count);
                }
            } catch (error) {
                console.error('Erro ao obter contagem de seguidores:', error);
            }
        };

        // Chama a função fetchFollowerCount ao montar o componente
        fetchFollowerCount();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]); // Executa o efeito sempre que currentUser mudar

    useEffect(() => {
        // Define o texto do botão com base no estado de isFollowing
        setFollowButtonText(isFollowing ? 'unfollow' : 'follow');
    }, [isFollowing]);


    const handlePostClick = (postId) => {
        navigate(`/postdetails/${postId}`);
    };

    return (
        <div className="perfil d-flex flex-column align-items-center" style={{ margin: "50px auto", maxWidth: "800px" }}>
            <h2 className="mb-4">Detalhes do Usuário</h2>
            <div className="container">
                {userDetails && (
                    <div className="d-flex flex-column flex-md-row align-items-center">
                        <div className="user-img me-md-4 mb-3 mb-md-0">
                            {userDetails.photoUrl ? (
                                <Image src={userDetails.photoUrl} alt="Foto de perfil" roundedCircle style={{ width: "150px", height: "150px" }} />
                            ) : (
                                <span>Nenhuma foto de perfil selecionada</span>
                            )}
                        </div>
                        <div className="user-data d-flex flex-column">
                            <div className="d-flex align-items-center mb-2">
                                <h3 className="mb-0 me-2">{userDetails.name}</h3>
                                <Button className={`btn btn-outline-primary btn-sm float-end favorite-button  ${isFollowing ? 'active' : ''}`} onClick={followUser} style={{color: "#fff"}}>{followButtonText}</Button>
                            </div>
                            <p className="mb-2">{userDetails.bio}</p>
                            <p className="mb-2"><strong>Interesses:</strong> {userDetails.userInterests.length > 0 ? userDetails.userInterests.join(', ') : "Nenhum interesse disponível"}</p>
                            <div className="d-flex flex-wrap mb-2">
                                <p className="me-3"><strong>Seguidores:</strong> {followerCount}</p>
                                <p><strong>Posts:</strong> {userPostCount}</p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="posts-container" style={{ width: "100%", maxWidth: "800px", marginTop: "20px" }}>
                    {userPosts.map(post => (
                        <div key={post.id} className="post card mb-3" onClick={() => handlePostClick(post.id)}>
                            <div className="card-body">
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">Interesses: {post.interests.join(', ')}</p>
                                <p className="card-text"><small className="text-muted">Data de publicação: {new Date(post.createdAt.seconds * 1000).toLocaleString()}</small></p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UserDetails;

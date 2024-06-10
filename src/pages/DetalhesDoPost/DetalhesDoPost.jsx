import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import useProfile from '../../hooks/useProfile';
import { getPostById, } from '../../services/postService';
import ReactMarkdown from 'react-markdown';
import CommentForm from '../../components/CommentForm';
import { db } from '../../firebase';
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { getUserPhotoUrl } from '../../utils/userUtils';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineHeart, AiFillHeart, AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { useAuth } from '../../context/AuthContext';

import './DetalhesDoPost.css';
import useFollow from '../../hooks/useFollow';

const DetalhesDoPost = () => {
    const { postId } = useParams();
    const { user } = useAuth();
    const { loading: profileLoading, userData: profileData } = useProfile();
    const [post, setPost] = useState(null);
    const [creator, setCreator] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const { isFollowing, followUser } = useFollow(post?.userId);
    const [followButtonText, setFollowButtonText] = useState('');
    const isPostCreator = user && post && user.uid === post.userId;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const fetchedPost = await getPostById(postId);
                setPost(fetchedPost);
                setLoading(false);

                const userDoc = await getDoc(doc(db, 'users', fetchedPost.userId));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setCreator(userData); // Define os dados do criador do post
                } else {
                    console.error('Dados do usuário não encontrados para o criador do post');
                }
            } catch (error) {
                console.error('Erro ao buscar detalhes do post:', error);
                setError(error.message);
                setLoading(false);
            }
        }
        fetchPost();
    }, [postId]);

    useEffect(() => {
        // Define o texto do botão com base no estado de isFollowing
        setFollowButtonText(isFollowing ? 'Deixar de seguir' : 'Seguir');
    }, [isFollowing]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postRef = doc(db, 'posts', postId);
                const postSnap = await getDoc(postRef);

                if (postSnap.exists()) {
                    const postData = postSnap.data();
                    setLikesCount(postData.likes || 0);

                    // Verifica se o usuário está autenticado antes de acessar o UID
                    if (user && user.uid) {
                        const likesCollectionRef = collection(db, 'posts', postId, 'likes');
                        const userLikeRef = doc(likesCollectionRef, user.uid);
                        const userLikeSnap = await getDoc(userLikeRef);

                        if (userLikeSnap.exists()) {
                            setLiked(true);
                        } else {
                            setLiked(false);
                        }
                    }
                } else {
                    console.error('Documento do post não encontrado');
                }
            } catch (error) {
                console.error('Erro ao buscar detalhes do post:', error);
            }
        };

        fetchData();
    }, [postId, user]);

    const handleLikeClick = async () => {
        if (!user) {
            navigate("/login");
        }

        try {
            const likesCollectionRef = collection(db, 'posts', postId, 'likes');
            const userLikeRef = doc(likesCollectionRef, user.uid);
            const userLikeSnap = await getDoc(userLikeRef);

            if (!userLikeSnap.exists()) {
                // Se o usuário ainda não deu like, adicionar o like
                await setDoc(userLikeRef, { timestamp: new Date().toISOString() });

                setLiked(true); // Atualizar o estado do botão

                setLikesCount(prevCount => {
                    const newCount = prevCount + 1;
                    // Incrementar o contador de likes no Firestore
                    updateDoc(doc(db, 'posts', postId), { likes: newCount }).catch(error => {
                        console.error('Erro ao atualizar o contador de likes no Firestore:', error);
                    });
                    return newCount; // Retornar o novo valor para atualizar localmente
                });
            } else {
                // Se o usuário já deu like, remover o like
                await deleteDoc(userLikeRef);

                setLiked(false); // Atualizar o estado do botão

                setLikesCount(prevCount => {
                    const newCount = Math.max(prevCount - 1, 0);
                    // Decrementar o contador de likes no Firestore
                    updateDoc(doc(db, 'posts', postId), { likes: newCount }).catch(error => {
                        console.error('Erro ao atualizar o contador de likes no Firestore:', error);
                    });
                    return newCount; // Retornar o novo valor para atualizar localmente
                });
            }
        } catch (error) {
            console.error('Erro ao atualizar o like:', error);
        }
    };

    useEffect(() => {
        const checkFavorite = async () => {
            if (user && user.uid) {
                const userRef = doc(db, 'users', user.uid);
                try {
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        setIsFavorite(userData.favoritePosts.includes(postId));
                    }
                } catch (error) {
                    console.error('Erro ao verificar favoritos:', error);
                }
            }
        };
        checkFavorite();
    }, [user, postId]);

    const handleFavoriteClick = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            const userRef = doc(db, 'users', user.uid);
            if (isFavorite) {
                await updateDoc(userRef, {
                    favoritePosts: arrayRemove(postId)
                });
                console.log('Post removido dos favoritos:', postId);
            } else {
                await updateDoc(userRef, {
                    favoritePosts: arrayUnion(postId)
                });
                console.log('Post adicionado aos favoritos:', postId);
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Erro ao atualizar favoritos:', error);
        }
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const commentsRef = collection(db, 'comments');
                const q = query(commentsRef, where('postId', '==', postId), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const fetchedComments = [];
                // Mapear os documentos de forma síncrona para garantir que a atualização do estado seja consistente
                for (const doc of querySnapshot.docs) {
                    const commentData = doc.data();
                    const userPhoto = await getUserPhotoUrl(commentData.userId);
                    fetchedComments.push({ id: doc.id, ...commentData, userPhoto });
                }
                console.log('Comentários recuperados:', fetchedComments);
                setComments(fetchedComments);
            } catch (error) {
                console.error('Erro ao buscar comentários:', error);
                setError(error.message);
            }
        }

        fetchComments();
    }, [postId]);

    const updateComments = async () => {
        const commentsRef = collection(db, 'comments');
        const q = query(commentsRef, where('postId', '==', postId), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedComments = [];
        for (const doc of querySnapshot.docs) {
            const commentData = doc.data();
            const userPhoto = await getUserPhotoUrl(commentData.userId);
            fetchedComments.push({ id: doc.id, ...commentData, userPhoto });
        }
        setComments(fetchedComments);
    }

    const handleEditComment = async (commentId, newText) => {
        try {
            const commentDocRef = doc(db, 'comments', commentId);
            await updateDoc(commentDocRef, {
                text: newText
            });

            setEditingCommentId(null);
            setEditingCommentText('');

            updateComments();
        } catch (error) {
            console.error('Erro ao editar comentário:', error);
        }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteDoc(doc(db, 'comments', commentId));

            updateComments();
        } catch (error) {
            console.error('Erro ao excluir comentário:', error);
        }
    }

    const userDetailsNavigate = (userId) => {
        if (userId === user.uid) {
            navigate(`/perfil`);
        } else {
            navigate(`/userdetails/${userId}`);
        }
    }

    if (loading || profileLoading) {
        return <div>Carregando detalhes do post...</div>;
    }

    if (error) {
        return <div>Erro ao carregar detalhes do post: {error}</div>;
    }

    return (
        <div className="detalhes-do-post d-flex flex-column align-items-center" style={{ maxWidth: "800px", margin: "40px auto", padding: '0 20px' }}>
            <div className="criador-do-post d-flex align-items-start justify-content-start w-100 mb-4">
                <div className="foto-criador me-3" onClick={() => userDetailsNavigate(post?.userId)} style={{ cursor: "pointer" }}>
                    <Image src={creator?.photoUrl} alt='Foto de perfil do criador' roundedCircle style={{ width: "80px", height: "80px" }} />
                </div>
                <div className="info-criador text-left" onClick={() => userDetailsNavigate(post?.userId)} style={{ cursor: "pointer" }}>
                    <h3 style={{ marginBottom: "5px", marginRight: "8px" }}>{creator?.name}</h3>
                    <p style={{ fontSize: "14px", marginBottom: "10px" }}>{creator?.bio}</p>
                </div>
                {!isPostCreator && (
                    <button
                        className={`btn btn-outline-primary btn-sm float-end favorite-button mt-1 ${isFollowing ? 'active' : ''}`}
                        onClick={followUser}
                    >
                        {isFollowing ? 'unfollow' : 'follow'}
                    </button>
                )}
            </div>

            <div className="detalhes-do-post text-center" style={{ marginTop: '20px' }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>{post?.title}</h2>
                <h5 style={{ marginBottom: "15px" }}>{post?.interests.join(', ')}</h5>
                <img src={post?.image} alt="Imagem do post" className="img-fluid" style={{ marginBottom: '20px' }} />
                <div className="content-container" style={{ textAlign: "justify" }}>
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
                <div className="button-section d-flex align-items-center mb-4">
                    {/* Botão de like ... */}
                    <button
                        className={`btn btn-outline-warning d-flex align-items-center justify-content-start position-relative like-button ${liked ? 'active' : ''}`}
                        onClick={handleLikeClick}
                        style={{ marginRight: '5px', marginBottom: '5px' }} // Adicionando margem à direita e inferior
                    >
                        {liked ? (
                            <AiFillLike style={{ color: '#fff' }} />
                        ) : (
                            <AiOutlineLike style={{ color: '#ffc107' }} />
                        )}
                        <span className="ms-2">{likesCount}</span>
                    </button>
                    {/* Botão de favorito */}
                    <button
                        title='Favorites'
                        className={`btn btn-outline-danger btn-sm favorite-button ${isFavorite ? 'active' : ''}`}
                        onClick={handleFavoriteClick}
                        style={{ padding: '7px', verticalAlign: 'top', marginBottom: '5px' }} // Ajustando o padding para igualar a altura
                    >
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
                </div>
                <CommentForm postId={postId} userName={profileData?.name} updateComments={updateComments} />
            </div>
            <div className="comments-section">
                <h3>Comentários</h3>
                <ul className="list-unstyled">
                    {comments.map(comment => (
                        <li key={comment.id} className="mb-4">
                            <div className="user-info d-flex align-items-center mb-2">
                                <Image src={comment.userPhoto} alt="Foto de perfil do usuário" roundedCircle style={{ width: "40px", height: "40px" }} />
                                <span className="ms-2">{comment.userName}</span>
                                {/* ícones de edição e exclusão */}
                                {user && (
                                    <div className="ml-auto comment-icons"> {/* Adicionamos a classe 'ml-auto' para alinhar os ícones à direita */}
                                        {/* Verificar se o usuário é o autor do post ou o autor do comentário */}
                                        {(user.uid === profileData.uid || user.uid === comment.userId) && (
                                            <button className="btn btn-outline-primary me-2 edit-btn">
                                                <AiOutlineEdit
                                                    className="edit-icon"
                                                    onClick={() => {
                                                        setEditingCommentId(comment.id);
                                                        setEditingCommentText(comment.text);
                                                    }}
                                                    size={24}
                                                    style={{ color: '#007bff' }} // Adicione esta linha para definir a cor e o tamanho do ícone de edição
                                                />
                                            </button>
                                        )}

                                        {/* Verificar se o usuário é o autor do post ou o autor do comentário */}
                                        {(user.uid === profileData.uid || user.uid === comment.userId || profileData.uid === user.uid) && (
                                            <button className="btn btn-outline-danger delete-btn">
                                                <AiOutlineDelete
                                                    className="delete-icon"
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    size={24}
                                                    style={{ color: '#ff6347' }} // Adicione esta linha para definir a cor e o tamanho do ícone de exclusão
                                                />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            {editingCommentId === comment.id ? (
                                <div className="edit-comment-form">
                                    <input
                                        className="comment-edit-input"
                                        type="text"
                                        value={editingCommentText}
                                        onChange={(e) => setEditingCommentText(e.target.value)}
                                    />
                                    <button className="comment-edit-button" onClick={() => handleEditComment(comment.id, editingCommentText)}>Salvar</button>
                                </div>
                            ) : (
                                <div className="comment-content">
                                    <p>{comment.text}</p>
                                </div>
                            )}
                        </li>
                    ))}

                </ul>
            </div>
        </div>
    )
}

export default DetalhesDoPost
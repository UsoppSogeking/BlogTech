import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import useProfile from '../../hooks/useProfile';
import { getPostById } from '../../services/postService';
import ReactMarkdown from 'react-markdown';
import CommentForm from '../../components/CommentForm';
import { db } from '../../firebase';
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { getUserPhotoUrl } from '../../utils/userUtils';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { useAuth } from '../../context/AuthContext';

import './DetalhesDoPost.css';

const DetalhesDoPost = () => {
    const { postId } = useParams();
    const { user } = useAuth();
    const { loading: profileLoading, userData: profileData } = useProfile();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const fetchedPost = await getPostById(postId);
                setPost(fetchedPost);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao buscar detalhes do post:', error);
                setError(error.message);
                setLoading(false);
            }
        }
        fetchPost();
    }, [postId]);

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

    if (loading || profileLoading) {
        return <div>Carregando detalhes do post...</div>;
    }

    if (error) {
        return <div>Erro ao carregar detalhes do post: {error}</div>;
    }

    return (
        <div className="detalhes-do-post d-flex flex-column align-items-center" style={{ maxWidth: "800px", margin: "40px auto", padding: '0 20px' }}>
            <div className="criador-do-post d-flex align-items-start justify-content-start w-100 mb-4">
                <div className="foto-criador me-3">
                    <Image src={profileData?.photoUrl} alt='Foto de perfil do criador' roundedCircle style={{ width: "80px", height: "80px" }} />
                </div>
                <div className="info-criador text-left">
                    <h3 style={{ marginBottom: "5px" }}>{profileData?.name}</h3>
                    <p style={{ fontSize: "14px", marginBottom: "10px" }}>{profileData?.bio}</p>
                </div>
            </div>
            <div className="detalhes-do-post text-center" style={{ marginTop: '20px' }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>{post?.title}</h2>
                <h5 style={{ marginBottom: "15px" }}>{post?.interests.join(', ')}</h5>
                <img src={post?.image} alt="Imagem do post" className="img-fluid" style={{ marginBottom: '20px' }} />
                <div className="content-container" style={{ textAlign: "justify" }}>
                    <ReactMarkdown>{post.content}</ReactMarkdown>
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
                                {editingCommentId === comment.id ? (
                                    <>
                                        <input
                                            className="comment-edit-input"
                                            type="text"
                                            value={editingCommentText}
                                            onChange={(e) => setEditingCommentText(e.target.value)}
                                        />
                                        <button className="comment-edit-button" onClick={() => handleEditComment(comment.id, editingCommentText)}>Salvar</button>
                                    </>
                                ) : (
                                    <>
                                        <div className="ml-auto comment-icons"> {/* Adicionamos a classe 'ml-auto' para alinhar os ícones à direita */}
                                            {/* Verificar se o usuário é o autor do post ou o autor do comentário */}
                                            {(user.uid === profileData.uid || user.uid === comment.userId) && (
                                                <AiOutlineEdit
                                                    className="edit-icon"
                                                    onClick={() => {
                                                        setEditingCommentId(comment.id);
                                                        setEditingCommentText(comment.text);
                                                    }}
                                                    size={24}
                                                    style={{ color: '#007bff' }} // Adicione esta linha para definir a cor e o tamanho do ícone de edição
                                                />
                                            )}
                                            {/* Verificar se o usuário é o autor do post ou o autor do comentário */}
                                            {(user.uid === profileData.uid || user.uid === comment.userId || profileData.uid === user.uid) && (
                                                <AiOutlineDelete
                                                    className="delete-icon"
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    size={24}
                                                    style={{ color: '#ff6347' }} // Adicione esta linha para definir a cor e o tamanho do ícone de exclusão
                                                />
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className={`comment-content ${editingCommentId === comment.id && 'edit-mode'}`}>
                                {editingCommentId === comment.id ? (
                                    <p>Modo de edição...</p>
                                ) : (
                                    <p>{comment.text}</p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default DetalhesDoPost
import { Image } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

import './Perfil.css';
import useProfile from '../../hooks/useProfile';
import { useEffect, useState } from 'react';
import useUserPosts from '../../hooks/useUserPosts';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

const Perfil = () => {
    const { user } = useAuth();
    const { loading, error, userData, fetchUserData } = useProfile();
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [userInterests, setUserInterests] = useState([]);
    const { posts, loading: postsLoading, error: postsError } = useUserPosts();

    useEffect(() => {
        if (userData) {
            setName(userData.name || '');
            setBio(userData.bio || "");
            setUserInterests(userData.userInterests || []);
        }
    }, [userData])

    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user, fetchUserData]);


    if (loading) {
        return <div>Aguarde...</div>
    }

    if (error) {
        return <div>Erro ao carregar perfil: {error.message}</div>
    }

    if (!userData) {
        return <div>Dados do usuário não encontrados.</div>
    }

    const handleEditPost = (postId) => {
        // Lógica para edição do post
    };

    const handleDeletePost = (postId) => {
        // Lógica para exclusão do post
    };

    return (
        <div className="perfil d-flex flex-column align-items-center" style={{ margin: "50px auto", maxWidth: "800px" }}>
            <h2 className="mb-4">Perfil</h2>
            <div className="container">
                <div className="d-flex flex-column flex-md-row align-items-center">
                    <div className="user-img me-md-4 mb-3 mb-md-0">
                        {userData?.photoUrl ? (
                            <Image src={userData.photoUrl} alt="Foto de perfil" roundedCircle style={{ width: "150px", height: "150px" }} />
                        ) : (
                            <span>Nenhuma foto de perfil selecionada</span>
                        )}
                    </div>
                    <div className="user-data">
                        <h3>{name || "Nome do Usuário"}</h3>
                        <p>{bio || "Nenhuma bio disponível"}</p>
                        <p><strong>Interesses:</strong> {userInterests.length > 0 ? userInterests.join(', ') : "Nenhum interesse disponível"}</p>
                        <div className="user-stats d-flex flex-wrap">
                            <p className="me-3"><strong>Seguindo:</strong> {userData?.following || 0}</p>
                            <p className="me-3"><strong>Seguidores:</strong> {userData?.followers || 0}</p>
                            <p><strong>Posts:</strong> {userData?.userPosts || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="posts-container" style={{ width: "100%", maxWidth: "800px", marginTop: "20px" }}>
                    {postsLoading && <p>Carregando posts...</p>}
                    {postsError && <p>Erro ao carregar posts: {postsError.message}</p>}
                    {!postsLoading && !postsError && posts.length === 0 && <p>Nenhum post encontrado.</p>}
                    {posts.map(post => (
                        <div key={post.id} className="post card mb-3">
                            <div className="card-body ">
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">Interesses: {post.interests.join(', ')}</p>
                                <p className="card-text"><small className="text-muted">Data de publicação: {new Date(post.createdAt.seconds * 1000).toLocaleString()}</small></p>
                                {user && user.uid === post.userId && ( // Verifica se o usuário é o dono do post
                                    <div>
                                        <button className="btn btn-outline-primary me-2" onClick={() => handleEditPost(post.id)}>
                                            <AiOutlineEdit style={{ color: '#007bff' }} /> {/* Ícone de editar com cor azul suave */}
                                        </button>
                                        <button className="btn btn-outline-danger" onClick={() => handleDeletePost(post.id)}>
                                            <AiOutlineDelete style={{ color: '#ff6347' }} /> {/* Ícone de excluir com cor vermelha próxima ao laranja */}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Perfil
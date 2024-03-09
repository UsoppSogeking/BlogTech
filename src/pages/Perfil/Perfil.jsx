import { Image, Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

import './Perfil.css';
import useProfile from '../../hooks/useProfile';
import { useEffect, useState } from 'react';
import useUserPosts from '../../hooks/useUserPosts';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
    const { user } = useAuth();
    const { loading, error, userData, fetchUserData } = useProfile();
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [userInterests, setUserInterests] = useState([]);
    const { posts, loading: postsLoading, error: postsError, handleDeletePost, handleEditPost } = useUserPosts();
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);
    const [editedPost, setEditedPost] = useState(null);
    const navigate = useNavigate();

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

    const handleShowModal = (e, postId) => {
        e.stopPropagation();
        setPostIdToDelete(postId);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setPostIdToDelete(null);
    }

    const handleConfirmDelete = async () => {
        if (postIdToDelete) {
            await handleDeletePost(postIdToDelete);
            handleCloseModal();
        }
    }

    const handlePostClick = (postId) => {
        navigate(`/postdetails/${postId}`);
    }

    const handleEditPostClick = (e, post) => {
        e.stopPropagation();
        setEditedPost(post);
        setShowModal(true);
    };

    const handleSubmitEditPost = async (e) => {
        e.preventDefault();
        try {
            await handleEditPost(editedPost.id, editedPost);
            handleCloseModal();
        } catch (err) {
            console.error('Erro ao editar o post: ', err);
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if(file.size > 1048487) {
            alert("A imagem selecionada é muito grande. Por favor, selecione uma imagem menor.");
            return;
        }

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                const imageUrl = reader.result;
                setEditedPost({ ...editedPost, image: imageUrl });
            }
            reader.readAsDataURL(file);
        }
    }

    if (loading) {
        return <div>Aguarde...</div>
    }

    if (error) {
        return <div>Erro ao carregar perfil: {error.message}</div>
    }

    if (!userData) {
        return <div>Dados do usuário não encontrados.</div>
    }

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
                        <div key={post.id} className="post card mb-3" onClick={() => handlePostClick(post.id)}>
                            <div className="card-body ">
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">Interesses: {post.interests.join(', ')}</p>
                                <p className="card-text"><small className="text-muted">Data de publicação: {new Date(post.createdAt.seconds * 1000).toLocaleString()}</small></p>
                                {user && user.uid === post.userId && ( // Verifica se o usuário é o dono do post
                                    <div>
                                        <button className="btn btn-outline-primary me-2 edit-btn" onClick={(e) => handleEditPostClick(e, post)}>
                                            <AiOutlineEdit style={{ color: '#007bff' }} /> {/* Ícone de editar com cor azul suave */}
                                        </button>
                                        <button className="btn btn-outline-danger delete-btn" onClick={(e) => handleShowModal(e, post.id)}>
                                            <AiOutlineDelete style={{ color: '#ff6347' }} /> {/* Ícone de excluir com cor vermelha próxima ao laranja */}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editedPost ? 'Editar Post' : 'Confirmar exclusão'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editedPost ? (
                        <Form onSubmit={handleSubmitEditPost}>
                            <Form.Group controlId="formBasicTitle">
                                <Form.Label>Título</Form.Label>
                                <Form.Control type="text" placeholder="Título do post" value={editedPost.title} onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })} />
                            </Form.Group>
                            <Form.Group controlId="formBasicImage">
                                <Form.Label>Imagem</Form.Label>
                                <Form.Control type="file" onChange={handleImageChange} />
                                {/* Você pode adicionar uma prévia da imagem aqui se desejar */}
                                {/* <img src={previewImage} alt="Preview" /> */}
                            </Form.Group>
                            <Form.Group controlId="formBasicInterests">
                                <Form.Label>Interesses</Form.Label>
                                <Form.Control type="text" placeholder="Interesses (separados por vírgula)" value={editedPost.interests.join(', ')} onChange={(e) => setEditedPost({ ...editedPost, interests: e.target.value.split(',').map(interest => interest.trim()) })} />
                            </Form.Group>
                            <Form.Group controlId="formBasicContent">
                                <Form.Label>Conteúdo</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Conteúdo do post" value={editedPost.content} onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })} />
                            </Form.Group>
                        </Form>
                    ) : (
                        <p>Tem certeza de que deseja excluir este post?</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Não
                    </Button>
                    <Button variant="danger" onClick={editedPost ? handleSubmitEditPost : handleConfirmDelete}>
                        {editedPost ? 'Salvar Alterações' : 'Sim, Excluir'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Perfil
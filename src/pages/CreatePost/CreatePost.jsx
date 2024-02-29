import { useEffect, useState } from 'react';
import useCreatePosts from '../../hooks/useCreatePosts';
import { v4 as uuidv4 } from 'uuid';

import { useAuth } from '../../context/AuthContext';

//import './CreatePost.css';

const CreatePost = () => {
    const { user } = useAuth();
    const [postId, setPostId] = useState(uuidv4);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const [interests, setInterests] = useState([]);
    const [newInterest, setNewInterests] = useState("");
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState(0);
    const [successMessage, setSuccessMessage] = useState(null);

    //Importando o hook useCreatePost
    const { loading, error, createPost } = useCreatePosts();

    useEffect(() => {
        const timer = setTimeout(() => {
            setSuccessMessage(null);
        }, 2000);

        return () => clearTimeout(timer);
    }, [successMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        //Criando o objeto de dados do post
        const postData = {
            postId,
            userId: user.uid,
            title,
            content,
            image,
            interests,
            comments,
            likes
        }

        await createPost(postData, image);

        setTitle("");
        setContent("");
        setImage("");
        setInterests([]);

        setSuccessMessage("Post criado com sucesso!");
    }

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    }

    const handleAddInterests = () => {
        if (newInterest.trim() !== "") {
            setInterests([...interests, newInterest.trim()]); //adiciona o novo interesse ao Array
            setNewInterests("");
        }
    }

    if (loading) {
        return <div>Carregando...</div>
    }

    return (
        <div className="create-post d-flex align-items-center justify-content-center" style={{ padding: '0 20px' }}>
            <div className="col-md-6">
                <div className="card mt-5">
                    <div className="card-body">
                        <h2 className="card-title text-center">Criar Novo Post</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">Título:</label>
                                <input type="text" id="title" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="content" className="form-label">Conteúdo:</label>
                                <textarea id="content" className="form-control" value={content} onChange={(e) => setContent(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="photo" className="form-label">Imagem:</label>
                                <input type="file" id="photo" className="form-control" onChange={handlePhotoChange} />
                            </div>
                            {image && (
                                <div className="mb-3">
                                    <img src={URL.createObjectURL(image)} alt="Preview da imagem" className="post-img-preview" style={{ maxHeight: '300px' }} />
                                </div>
                            )}
                            <div className="mb-3">
                                <label htmlFor="interests" className="form-label">Interesses:</label>
                                <input type="text" id="interests" className="form-control" value={newInterest} onChange={(e) => setNewInterests(e.target.value)} />
                                <button type="button" onClick={handleAddInterests} className="btn btn-secondary mt-2">Adicionar Interesse</button>
                            </div>
                            <div className="mb-3">
                                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Aguarde..." : "Publicar"}</button>
                            </div>

                            {successMessage && (
                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                    {successMessage}
                                    <button type="button" className="btn-close" onClick={() => setSuccessMessage(null)}></button>
                                </div>
                            )}
                        </form>
                        {error && <p className="error-message">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePost
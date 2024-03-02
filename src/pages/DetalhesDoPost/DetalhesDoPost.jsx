import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import useProfile from '../../hooks/useProfile';
import { getPostById } from '../../services/postService';

const DetalhesDoPost = () => {
    const { postId } = useParams();
    const { loading: profileLoading, userData: profileData } = useProfile();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) {
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
                <img src={post?.image} alt="Imagem do post" className="img-fluid" />
                <p style={{ textAlign: "justify", lineHeight: "1.6", fontSize: "16px" }}>{post?.content}</p>
            </div>
        </div>
    )
}

export default DetalhesDoPost
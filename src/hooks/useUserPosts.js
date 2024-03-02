import { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext';
import { deletePostById, getPostsByUserId, updatePost } from "../services/postService";

const useUserPosts = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                if (user) {
                    const userId = user.uid;
                    const userPosts = await getPostsByUserId(userId);
                    // Ordenar os posts por data de publicação, da mais recente para a mais antiga
                    const sortedPosts = userPosts.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
                    setPosts(sortedPosts);
                }
                setLoading(false);
            } catch (error) {
                console.error('Erro ao buscar posts do usuário:', error);
                setError(error.message);
                setLoading(false);
            }
        }

        fetchPosts();
    }, [user]);

    const handleDeletePost = async (postId) => {
        try {
            await deletePostById(postId);
            // Após a exclusão bem sucedida, atualize a lista de posts removendo o post excluído
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Erro ao excluir o post:', error);
            setError(error.message);
        }
    }

    const handleEditPost = async (postId, updatedData) => {
        setLoading(true);
        try {
            await updatePost(postId, updatedData);
            // Atualiza o post editado na lista de posts
            setPosts(posts.map(post => (post.id === postId ? { ...post, ...updatedData } : post)));
            setLoading(false);
        } catch (error) {
            console.error('Erro ao editar o post:', error);
            setError(error.message);
            setLoading(false);
        }
    }

    return { posts, loading, error, handleDeletePost, handleEditPost };
}

export default useUserPosts;

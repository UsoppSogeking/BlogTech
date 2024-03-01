import { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext';
import { deletePostById, getPostsByUserId } from "../services/postService";

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
                    setPosts(userPosts);
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

    const handleDeletePosts = async (postId) => {
        try {
            await deletePostById(postId);
            //Após a exclusão bem sucedida, atualize a lista de posts removendo o post excluido
            setPosts(posts.filter(post => post.id !== postId));
        } catch (err) {
            console.error('Erro ao excluir o post:', err);
        }
    }

    return { posts, loading, error, handleDeletePosts }
}

export default useUserPosts;
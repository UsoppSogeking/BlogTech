import { db } from '../firebase';
import { collection, where, query, getDocs, doc, deleteDoc, getDoc } from 'firebase/firestore';

//Função para buscar os posts de um usuário pelo Id
const getPostsByUserId = async (userId) => {
    const userPosts = [];
    try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            userPosts.push({ id: doc.id, ...doc.data() });
        });
        return userPosts;
    } catch (error) {
        console.error('Erro ao buscar posts: ', error);
        throw new Error('Erro ao buscar posts')
    }
}

const deletePostById = async (postId) => {
    try {
        const postRef = doc(db, 'posts', postId);
        await deleteDoc(postRef);
        console.log('Post excluido com sucesso');
    } catch (error) {
        console.error('Erro ao excluir o post:', error);
        throw new Error('Erro ao excluir post.')
    }
}

const getPostById = async (postId) => {
    try {
        const postDoc = await getDoc(doc(db, 'posts', postId));
        if (postDoc.exists()) {
            return { id: postDoc.id, ...postDoc.data() }
        } else {
            throw new Error('Post não encontrado');
        }
    } catch (error) {
        console.error('Erro ao buscar o post:', error);
        throw new Error('Erro ao buscar o post');
    }
}


export { getPostsByUserId, deletePostById, getPostById };
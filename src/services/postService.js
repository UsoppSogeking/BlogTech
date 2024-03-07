import { db } from '../firebase';
import { collection, where, query, getDocs, doc, deleteDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

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
            const postData = postDoc.data();
            // Aqui você precisa buscar os dados do criador do post
            // e adicioná-los ao objeto postData
            const userDoc = await getDoc(doc(db, 'users', postData.userId));
            const userData = userDoc.data();
            postData.creatorData = userData;
            return postData;
        } else {
            throw new Error('Post not found');
        }
    } catch (error) {
        console.error('Error fetching post by ID:', error);
        throw error;
    }
}

const updatePost = async (postId, updatedData) => {
    try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, updatedData);
        console.log('Post atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar o post:', error);
        throw new Error('Erro ao atualizar post.');
    }
}

const addCommentToPost = async (postId, commentData) => {
    try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
            comments: arrayUnion(commentData)
        });
        console.log('Comentário adicionado com sucesso!');
    } catch (error) {
        console.error('Erro ao adicionar comentário:', error);
        throw new Error('Erro ao adicionar comentário.');
    }
}

const updatePostLike = async (postId, newLikesCount) => {
    try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, { likes: newLikesCount });
    } catch (error) {
        console.error('Erro ao atualizar o like do post:', error);
        throw new Error('Erro ao atualizar o like do post');
    }
};


export { getPostsByUserId, deletePostById, getPostById, updatePost, addCommentToPost, updatePostLike };
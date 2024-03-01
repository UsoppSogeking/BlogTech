import { db } from '../firebase';
import { collection, where, query, getDocs } from 'firebase/firestore';

//Função para buscar os posts de um usuário pelo Id
const getPostsByUserId = async (userId) => {
    const userPosts = [];
    try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            userPosts.push({id: doc.id, ...doc.data()});
        });
        return userPosts;
    } catch (error) {
        console.error('Erro ao buscar posts: ', error);
        throw new Error('Erro ao buscar posts')
    }
}


export { getPostsByUserId };
import { db } from '../firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

const getUserName = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            return userDoc.data().name;
        } else {
            return "Nome do autor desconhecido"
        }
    } catch (error) {
        console.error('Erro ao buscar nome do usuário:', error);
        return "Nome do autor desconhecido";
    }
}

const getUserPhotoUrl = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            return userDoc.data().photoUrl;
        } else {
            return "URL da foto do usuário desconhecida";
        }
    } catch (error) {
        console.error('Erro ao buscar URL da foto do usuário:', error);
        return "URL da foto do usuário desconhecida";
    }
}

const getFollowerCount = async (userId) => {
    try {
        const followersQuery = query(collection(db, 'users'), where('following', 'array-contains', userId));
        const followersSnapshot = await getDocs(followersQuery);
        return followersSnapshot.size; // Retorna o número de documentos no snapshot, que é a contagem de seguidores
    } catch (error) {
        console.error('Erro ao obter contagem de seguidores:', error);
        throw error; // Lança o erro para que ele possa ser tratado no componente que chama esta função
    }
};

export { getUserName, getUserPhotoUrl, getFollowerCount };
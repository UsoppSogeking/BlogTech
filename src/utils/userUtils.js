import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

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

export { getUserName, getUserPhotoUrl };
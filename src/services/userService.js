import { db, storage } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const getUserData = async (userId) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            return userDocSnap.data();
        } else {
            throw new Error('Documento do usuário não econtrado');
        }
    } catch (error) {
        throw new Error('Erro ao buscar dados do usuário: ' + error.message);
    }
}

const updateUserProfile = async (userId, updatedData) => {
    try {
        console.log("Dados recebidos em updateUserProfile:", userId, updatedData);
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, updatedData);
    } catch (error) {
        throw new Error('Erro ao atualizar perfil do usuário: ' + error.message);
    }
}

const updateUserPhoto = async (userId, file) => {
    try {
        const storageRef = ref(storage, `profile_images/${userId}/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);

        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { photoUrl: downloadUrl });
    } catch (error) {
        throw new Error('Erro ao atualizar a foto do usuário: ' + error.message);
    }
}

export { getUserData, updateUserProfile, updateUserPhoto };
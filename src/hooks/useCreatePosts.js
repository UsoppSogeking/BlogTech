import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

const useCreatePosts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createPost = async (postData, imageFile) => {
        setLoading(true);
        setError(null);

        try {
            //Upload da imagem para o Firebase Storage
            const storageRef = ref(getStorage(), `images/${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);

            //Obter a URL da image no Firebase Storage
            const imageUrl = await getDownloadURL(storageRef);

            //adicionar a URL da imagem ao objeto de dados do post
            const postDataWithImage = { ...postData, image: imageUrl };

            //Adicionar o novo post ao Firestore
            const docRef = await addDoc(collection(db, 'posts'), postDataWithImage);
            console.log('Post criado com ID: ', docRef.id);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao criar post:', error);
            setError(error.message);
            setLoading(false);
        }
    }

    return { loading, error, createPost }
}

export default useCreatePosts;
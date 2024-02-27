import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const useProfile = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState({
        name: "",
        bio: "",
        photoUrl: "",
        userInterests: [],
        following: 0,
        followers: 0,
        userPosts: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserData = async () => {
        try {
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userDataFromFirestore = userDocSnap.data();
                    setUserData(userDataFromFirestore);
                    setUserData(prevUserData => ({
                        ...prevUserData,
                        ...userDataFromFirestore,
                        userInterests: Array.isArray(userDataFromFirestore.userInterests) ? userDataFromFirestore.userInterests : []
                    }));
                } else {
                    setError("Perfil não encontrado.");
                }
            }
        } catch (error) {
            setError("Erro ao buscar dados do usuário.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData(); // Chama a função fetchUserData imediatamente após a definição
    }, [user]);

    const updateUserData = (newData) => {
        setUserData(prevData => ({
            ...prevData,
            ...newData
        }));
    }

    // Retorne o objeto contendo os dados do perfil, o estado de carregamento e o erro, e a função fetchUserData
    return { userData, loading, error, fetchUserData, updateUserData };
};

export default useProfile;

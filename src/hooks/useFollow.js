import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const useFollow = (userId) => {
    const { user } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const checkFollowingStatus = async () => {
            try {
                if (!user || !userId) return;

                const currentUserRef = doc(db, 'users', user.uid);
                const currentUserSnap = await getDoc(currentUserRef);
                const currentUserData = currentUserSnap.data();

                if (!currentUserData.following) {
                    console.error('O objeto user não possui a propriedade following.');
                    return;
                }

                setIsFollowing(currentUserData.following.includes(userId));
            } catch (error) {
                console.error('Erro ao verificar status de seguir:', error);
            }
        };

        checkFollowingStatus();
    }, [user, userId]);

    // const updateFollowerCountForAllUsers = async (userId, increment) => {
    //     try {
    //         const userRef = doc(db, 'users', userId);
    //         const userSnap = await getDoc(userRef);
    //         const userData = userSnap.data();

    //         if (!userData) {
    //             console.error('Usuário não encontrado.');
    //             return;
    //         }

    //         const updatedFollowersCount = userData.followers + increment;

    //         await updateDoc(userRef, {
    //             followers: updatedFollowersCount
    //         });
    //     } catch (error) {
    //         console.error('Erro ao atualizar contador de seguidores:', error);
    //     }
    // };

    const followUser = async () => {
        try {
            if (!user || !userId) return;

            const currentUserRef = doc(db, 'users', user.uid);
            const currentUserSnap = await getDoc(currentUserRef);
            const currentUserData = currentUserSnap.data();

            // Verifica se a propriedade following existe e inicializa se não existir
            const following = currentUserData.following || [];

            await updateDoc(currentUserRef, {
                following: isFollowing
                    ? following.filter(id => id !== userId) // Remove o ID do usuário alvo do array 'following'
                    : [...following, userId] // Adiciona o ID do usuário alvo ao array 'following'
            });

            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error('Erro ao seguir o usuário:', error);
        }
    };

    return { isFollowing, followUser };
};

export default useFollow;

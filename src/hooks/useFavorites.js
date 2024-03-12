import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const useFavorites = (postId) => {
    const { user } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const checkIsFavorite = async () => {
            if (!user) return;

            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const favoritePosts = userDoc.data().favoritePosts || [];
                setIsFavorite(favoritePosts.includes(postId));
            }
        }

        checkIsFavorite();
    }, [user, postId]);

    const toggleFavorite = async () => {
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const favoritePosts = userDoc.data().favoritePosts || [];
            const updatedFavorites = [...favoritePosts];

            if (favoritePosts.includes(postId)) {
                //Remove post from favorites
                const index = updatedFavorites.indexOf(postId);
                if (index !== -1) {
                    updatedFavorites.splice(index, 1);
                }
            } else {
                //Add post to favorites
                updatedFavorites.push(postId);
            }

            //Update user document with new favorite posts array
            await updateDoc(userRef, { favoritePosts: updatedFavorites });
            setIsFavorite(!isFavorite);
        }
    }

    return { isFavorite, toggleFavorite };
}

export default useFavorites;
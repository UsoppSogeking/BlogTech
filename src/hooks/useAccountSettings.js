import { useState } from "react";
import { useAuth } from '../context/AuthContext';
import { getUserData, updateUserProfile, updateUserPhoto } from "../services/userService";

const useAccountSettings = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({
        name: "",
        bio: "",
        photoUrl: "",
        userInterests: [],
        following: 0,
        followers: 0,
        userPosts: 0
    });

    const fetchUserData = async () => {
        if (user) {
            setLoading(true);
            try {
                const userData = await getUserData(user.uid);
                setUserData(userData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleUpdateProfile = async ({ name, bio, userInterests }) => {
        if (user) {
            setLoading(true);
            try {
                console.log("Atualizando perfil com dados:", name, bio, userInterests);
                const updatedData = {};
                // Verifique se o nome foi alterado e adicione ao objeto de dados atualizados
                if (name !== userData.name) {
                    updatedData.name = name;
                }

                // Verifique se a bio foi alterada e adicione ao objeto de dados atualizados
                if (bio !== userData.bio) {
                    updatedData.bio = bio;
                }

                // Verifique se os interesses foram alterados e adicione ao objeto de dados atualizados
                if (JSON.stringify(userInterests) !== JSON.stringify(userData.userInterests)) {
                    updatedData.userInterests = userInterests;
                }

                if (Object.keys(updatedData).length > 0) {
                    await updateUserProfile(user.uid, updatedData);
                    setUserData(prevData => ({
                        ...prevData,
                        ...updatedData
                    }));
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleUpdatePhoto = async (file) => {
        if (user) {
            setLoading(true);
            try {
                await updateUserPhoto(user.uid, file);
                setUserData(prevUserData => ({
                    ...prevUserData,
                    photoUrl: URL.createObjectURL(file)//atualiza a url da foto diretamente no estado local
                }))
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
    };



    return { loading, error, userData, fetchUserData, handleUpdateProfile, handleUpdatePhoto }
}

export default useAccountSettings;
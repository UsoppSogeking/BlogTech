import { useAuth } from '../../context/AuthContext';

import './Perfil.css';
import useProfile from '../../hooks/useProfile';
import { useEffect, useState } from 'react';

const Perfil = () => {
    const { user } = useAuth();
    const { loading, error, userData, fetchUserData } = useProfile();
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [userInterests, setUserInterests] = useState([]);

    useEffect(() => {
        if (userData) {
            setName(userData.name || '');
            setBio(userData.bio || "");
            setUserInterests(userData.userInterests || []);
        }
    }, [userData])

    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user, fetchUserData]);

    if (loading) {
        return <div>Aguarde...</div>
    }

    if (error) {
        return <div>Erro ao carregar perfil: {error.message}</div>
    }

    if (!userData) {
        return <div>Dados do usuário não encontrados.</div>
    }

    return (
        <div className='perfil'>
            <h2>Perfil</h2>
            <div className='container'>
                <div className='user-img'>
                    {userData?.photoUrl ? (
                        <img src={userData.photoUrl} alt="Foto de perfil" />
                    ) : (
                        <span>Nenhuma foto de perfil selecionada</span>
                    )}
                </div>
                <div className='user-data'>
                    <h3>{name || "Nome do Usuário"}</h3>
                    <p>{bio || "Nenhuma bio disponível"}</p>
                    <p><strong>Interesses:</strong> {userInterests.length > 0 ? userInterests.join(', ') : "Nenhum interesse disponível"}</p>
                    <div className="user-stats">
                        <p><strong>Seguindo:</strong> {userData?.following || 0}</p>
                        <p><strong>Seguidores:</strong> {userData?.followers || 0}</p>
                        <p><strong>Posts:</strong> {userData?.userPosts || 0}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Perfil
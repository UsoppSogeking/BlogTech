import { useState } from "react"
import useAccountSettings from "../../hooks/useAccountSettings";

import './AccountSettings.css';

const AccountSettings = () => {
    const { loading, error, userData, fetchUserData, handleUpdateProfile, handleUpdatePhoto } = useAccountSettings();
    const [name, setName] = useState(userData?.name || '');
    const [bio, setBio] = useState(userData?.bio || '');
    const [interests, setInterests] = useState([]);
    const [photo, setPhoto] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'name') {
            setName(value);
        } else if (name === 'bio') {
            setBio(value);
        } else if (name === 'interests') {
            if (typeof value === 'string') {
                const newInterests = value.split(',').map(interest => interest.trim());
                setInterests(newInterests);
            } else {
                setInterests(value);
            }
        }
    }

    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        setPhoto(file);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const updatedData = {
                name: name.trim(),
                bio: bio.trim() ? bio.trim() : userData.bio,
                userInterests: interests.length > 0 ? interests : userData.userInterests
            };
            console.log("Dados atualizados:", updatedData);
            // Atualize apenas os campos que foram alterados
            console.log("Chamando handleUpdateProfile...");
            await handleUpdateProfile(updatedData);
            //Verifica se houve alteração na foto
            if (photo) {
                await handleUpdatePhoto(photo);
            }
            // Recarrega os dados do usuário após a atualização
            fetchUserData();

            //Limpar o campo de seleção de arquivo
            setPhoto(null);
        } catch (error) {
            console.error('Erro ao atualizar perfil: ', error);
        }
    }

    if (error) {
        return <div>Erro: {error}</div>
    }

    if (loading) {
        return <div>Carregando...</div>
    }

    return (
        <div className="account-settings">
            <h2>Configurações</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Nome:</label>
                <input type="text" id="name" name="name" value={name} onChange={handleChange} />

                <label htmlFor="bio">Bio:</label>
                <textarea name="bio" id="bio" value={bio} onChange={handleChange} />

                <label htmlFor="interests">Interesses:</label>
                <input type="text" id="interests" name="interests" placeholder='Adicione seus interesses separados por vírgula' value={interests} onChange={handleChange} />

                <label htmlFor="photo">Foto de perfil</label>
                <input type="file" id="photo" name="photo" accept="image/*" onChange={handlePhotoChange} />

                <button type="submit">Salvar</button>
            </form>
        </div>
    )
}

export default AccountSettings
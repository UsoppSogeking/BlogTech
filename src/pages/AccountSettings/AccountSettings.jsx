import { useEffect, useState } from "react"
import useAccountSettings from "../../hooks/useAccountSettings";


const AccountSettings = () => {
    const { loading, error, userData, fetchUserData, handleUpdateProfile, handleUpdatePhoto } = useAccountSettings();
    const [name, setName] = useState(userData?.name || '');
    const [bio, setBio] = useState(userData?.bio || '');
    const [interests, setInterests] = useState([]);
    const [photo, setPhoto] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSuccessMessage(null);
        }, 2000);

        return () => clearTimeout(timer);//limpa o temporizador e desmonta o componente
    }, [successMessage])

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

            setName("");
            setBio("");
            setInterests([]);

            setSuccessMessage("Dados atualizados com sucesso!");
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
        <div className="account-settings d-flex align-items-center justify-content-center" style={{ padding: '0 20px' }}>
            <div className="col-md-6">
                <div className="card mt-5">
                    <div className="card-body">
                        <h2 className="card-title text-center">Configurações</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Nome:</label>
                                <input type="text" className="form-control" id="name" name="name" value={name} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="bio" className="form-label">Bio:</label>
                                <textarea className="form-control" id="bio" name="bio" value={bio} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="interests" className="form-label">Interesses:</label>
                                <input type="text" className="form-control" id="interests" name="interests" placeholder='Adicione seus interesses separados por vírgula' value={interests} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="photo" className="form-label">Foto de perfil:</label>
                                <input type="file" className="form-control" id="photo" name="photo" accept="image/*" onChange={handlePhotoChange} />
                            </div>
                            {photo && (
                                <div className="mb-3">
                                    <label className="form-label">Prévia da Foto de Perfil:</label>
                                    <div className="user-img">
                                        <img src={URL.createObjectURL(photo)} alt="Preview" />
                                    </div>
                                </div>
                            )}
                            {successMessage && (
                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                    {successMessage}
                                    <button type="button" className="btn-close" onClick={() => setSuccessMessage(null)}></button>
                                </div>
                            )}
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default AccountSettings
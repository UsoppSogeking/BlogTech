//firebase
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

//hooks
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

import './Perfil.css';

const Perfil = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);
    const [bio, setBio] = useState("");
    const [interests, setInterests] = useState("");
    const [following, setFollowing] = useState(0);
    const [followers, setFollowers] = useState(0);
    const [userPosts, setUserPosts] = useState(0);
    const maxBioLength = 150;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (user) {
                    //Obtenha os detalhes do usuário do Firestore usando seu UID
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        const userDataFromFirestore = userDocSnap.data();
                        setUserData(userDataFromFirestore);
                        setPhotoUrl(userDataFromFirestore.photoUrl);
                        setBio(userDataFromFirestore.bio || "");
                        // Converta os interesses de array para string para exibição
                        setInterests(userDataFromFirestore.userInterests.join(', '));
                        setFollowing(userDataFromFirestore.following);
                        setFollowers(userDataFromFirestore.followers);
                        setUserPosts(userDataFromFirestore.userPosts);
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar dados do usuário', error);
            }
        }
        fetchUserData();
    }, [user]);

    if (!user) {
        return <div>Aguarde...</div>
    }

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        const storageRef = ref(storage, `profile_images/${user.uid}/${file.name}`);

        try {
            await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(storageRef);
            setPhotoUrl(downloadUrl)

            //salvar o url da foto no firestore
            const useRef = doc(db, 'users', user.uid);
            await updateDoc(useRef, { photoUrl: downloadUrl });
        } catch (error) {
            console.log('Erro ao fazer upload da foto:', error);
        }
    }

    const handleBioSave = async () => {
        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { bio });
        } catch (error) {
            console.error('Erro ao salvar a bio do usuário', error);
        }
    }

    const handleInterestsSave = async () => {
        try {
            // Converta os interesses em um array antes de salvar no banco de dados
            const interestsArray = interests.split(",").map(interest => interest.trim());
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { userInterests: interestsArray });
        } catch (error) {
            console.error('Erro ao salvar os interesses do usuário', error);
        }
    }

    const handleChange = (event) => {
        const { value } = event.target;
        setBio(value);
    };

    const handleInterestsChange = (event) => {
        const { value } = event.target;
        setInterests(value);
    }

    return (
        <div className='perfil'>
            <h2>Perfil</h2>
            <div className='containerr'>
                <div className='user-img'>
                    {photoUrl && <img src={photoUrl} alt="Foto de perfil" />}
                    {!photoUrl && <span>Nenhuma foto de perfil selecionada</span>} {/* Adiciona uma mensagem se não houver foto */}
                    <div className="file-input-container">
                        <label htmlFor="file-upload">Escolha uma foto</label>
                        <input type="file" accept="image/*" id="file-upload" onChange={handlePhotoUpload} />
                    </div>
                </div>
                <div className='user-datas'>
                    <h3>{userData?.name || "Nome do Usuário"}</h3>
                    <div className="user-stats">
                        <p>Seguindo: {following}</p>
                        <p>Seguidores: {followers}</p>
                        <p>Posts: {userPosts}</p>
                    </div>
                    <div className='bio-container'>
                        <label htmlFor="bio-input">Bio:</label>
                        <input
                            id='bio-input'
                            className='bio-input'
                            placeholder='Adicione uma bio...'
                            value={bio}
                            onChange={handleChange}
                            maxLength={maxBioLength}
                        />
                        <div className='bio-char-counter'>
                            {bio.length}/{maxBioLength}
                        </div>
                        <button className='save-bio-button' onClick={handleBioSave}>Salvar Bio</button>
                    </div>
                    <div className="interests-container">
                        <label htmlFor="interests-input">Interesses:</label>
                        <input
                            id='interests-input'
                            className='interests-input'
                            placeholder='Adicione seus interesses separados por virgula'
                            value={interests}
                            onChange={handleInterestsChange}
                        />
                        <button className='save-interests-button' onClick={handleInterestsSave}>Salvar Interesses</button>
                    </div>
                </div>
            </div>
            <div className="my-posts">

            </div>
        </div>
    )
}

export default Perfil
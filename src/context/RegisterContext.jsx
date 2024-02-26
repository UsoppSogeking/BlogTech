import { createContext, useContext, useState } from "react";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { doc, getFirestore, setDoc } from "firebase/firestore";

//Criar o context de registro
const RegisterContext = createContext();

//Provedor de contexto de registro
export const RegisterProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    //Função de registro
    const register = async (name, email, password) => {
        setLoading(true);
        setError(null);

        try {
            //Chamar a função de registro do firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userId = user.uid;
            // Armazena o ID do usuário junto com outros dados do usuário no Firestore
            const db = getFirestore();
            await setDoc(doc(db, 'users', userId), {
                name,
                email,
                bio: "",
                photoUrl: "",
                userInterests: [],
                userPosts: 0,
                following: 0,
                followers: 0
            });
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }

    return (
        <RegisterContext.Provider value={{ error, loading, register }}>
            {children}
        </RegisterContext.Provider>
    )
}

export const useRegister = () => useContext(RegisterContext);
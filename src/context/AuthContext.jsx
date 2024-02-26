import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

//Criar o contexto de autenticação
const AuthContext = createContext();

//Provedor de contexto de autenticação
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    //função de login
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/BlogTech");
        } catch (error) {
            setError("Usuário ou senha inválidos.");
        }
        setLoading(false);
    }

    //função de logout
    const logout = async () => {
        setLoading(true);
        setError(null);
        try {
            await signOut(auth);
            setUser(null);
            navigate("/login")
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    }

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);
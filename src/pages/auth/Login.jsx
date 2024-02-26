import { useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useAuth } from '../../context/AuthContext';

import './Auth.css';

import { Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login, error, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await login(email, password);
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <div className='login'>
            <h1>Inicie sua sessão para explorar</h1>
            <form onSubmit={handleSubmit}>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Email address"
                    className="mb-3"
                >
                    <Form.Control type="email" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} value={email || ""} />
                </FloatingLabel>
                <FloatingLabel controlId="floatingPassword" label="Password" className='mb-3'>
                    <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password || ""} />
                </FloatingLabel>
                <p>Ainda não possui uma conta? <Link to={`/register`}>Cadastre-se</Link></p>
                {!loading ? (
                    <button type='submit'>Entrar</button>
                ) : (
                    <button type='submit' disabled>Aguarde...</button>
                )}
            </form>
            {error && <p className='error-message'>{error}</p>}
        </div>
    );
}

export default Login;
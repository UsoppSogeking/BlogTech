import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

//hooks
import { useState } from 'react';
import { useRegister } from '../../context/RegisterContext';
import { Link, useNavigate } from 'react-router-dom';

//css
import './Auth.css';


function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { loading, register } = useRegister();

    const isPasswordValid = (password) => {
        //verifica se a senha tem pelo menos 6 caracteres e contem letras e numeros
        const regex = /^(?=.*\d)(?=.*[A-Z])(?=.*[!.@']).{8,}$/;
        return regex.test(password);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("As senhas não correspondem");
            return;
        }

        if (!isPasswordValid(password)) {
            setError("Senha inválida. Use pelo menos 8 caracteres, incluindo números, letras maiúsculas e um dos seguintes símbolos: !, ., @ ou '.");
            return;
        }

        try {
            await register(name, email, password);
            //limpa os campos apos registro bem sucedido
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

            navigate("/");
        } catch (err) {
            console.error('Erro ao registrar:', err);
            setError(err.message);
        }
    }


    return (
        <div className='register'>
            <h1>Registre-se para ver o que há de novo</h1>
            <form onSubmit={handleSubmit}>
                <FloatingLabel
                    controlId="floatingName"
                    label="Name"
                    className="mb-3"
                >
                    <Form.Control type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} value={name || ""} />
                </FloatingLabel>
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

                <FloatingLabel controlId="floatingConfirmPassword" label="ConfirmPassword" className='mb-3'>
                    <Form.Control type="password" placeholder="ConfirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword || ""} />
                </FloatingLabel>
                <p>Já possui uma conta? <Link to={`/login`}>Entrar</Link></p>
                {!loading ? (
                    <button type='submit'>Enviar</button>
                ) : (
                    <button type='submit' disabled>Aguarde...</button>
                )}
            </form>
            {error && <p className='error-message'>{error}</p>}
        </div>
    );
}

export default Register;
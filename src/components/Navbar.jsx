import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';

function Navigation() {
    const { user, logout } = useAuth();

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand as={NavLink} to="/BlogTech">Blog-Tech</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/BlogTech">Home</Nav.Link>
                        {user ? (
                            <>
                                <Nav.Link as={NavLink} to="/perfil">Perfil</Nav.Link>
                                <NavDropdown title="Sair" id="basic-nav-dropdown">
                                    <NavDropdown.Item onClick={logout}>Encerrar Sessão</NavDropdown.Item>
                                    <NavDropdown.Item as={NavLink} to="/settings">Conta</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={NavLink} to="/createpost">Criar Post</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            <NavDropdown title="Entrar" id="basic-nav-dropdown">
                                <NavDropdown.Item as={NavLink} to="/register">Cadastre-se</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/login">Iniciar Sessão</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;
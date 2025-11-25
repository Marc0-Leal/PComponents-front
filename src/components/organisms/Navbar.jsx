import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

// Configuración: emails autorizados (coincide con CreatorsPanel)
const AUTHORIZED_EMAILS = ['tu-email@ejemplo.com'];

function NavBar() {
  const { usuario } = useAuth();

  // comprobar si se ha concedido acceso de creador (por passphrase) en esta sesión
  const creatorFlag = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('creator_access') === '1';

  const userEmail = usuario?.email || null;

  // autorización: si el usuario tiene rol de administrador (rol.id === 2), o la propiedad isCreator, o su email está en la lista
  const isAuthorized =
    creatorFlag ||
    !!(usuario && (usuario.rol?.id === 2 || usuario.isCreator)) ||
    (userEmail && AUTHORIZED_EMAILS.includes(userEmail));

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">PComponents</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Inicio</Nav.Link>
            <Nav.Link href="/products">Productos</Nav.Link>
            <Nav.Link href="/blog">Blog</Nav.Link>
            <Nav.Link href="/contact">Contacto</Nav.Link>
            <Nav.Link href="/Nosotros">Nosotros</Nav.Link>
            <Nav.Link href="/login">Iniciar Sesión</Nav.Link>
            <Nav.Link href="/carrito">Carrito</Nav.Link>
            {/* Enlace oculto: solo renderizar cuando el usuario esté autorizado */}
            {isAuthorized && <Nav.Link href="/admin/creators">Creators</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;

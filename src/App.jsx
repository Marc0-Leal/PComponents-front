import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/organisms/Navbar';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import NotFound from './pages/NotFound';
import Contact from './pages/Contact';
import Nosotros from './pages/Nosotros';
import InicioSesion from './pages/InicioSesion';
import Home from './pages/Home';
import Carrito from './pages/Carrito';
import Blog from './pages/Blog';
import CreatorsPanel from './pages/admin/CreatorsPanel';





function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/admin/creators" element={<CreatorsPanel />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/Nosotros" element={<Nosotros />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<InicioSesion />} />      
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </>

  );
}

export default App;


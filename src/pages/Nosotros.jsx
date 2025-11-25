import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Text from '../components/atoms/Text';
import Image from '../components/atoms/Image';
import Button from '../components/atoms/Button';
import ProductCard from '../components/organisms/ProductCard';
import products from '../data/Products';

function Nosotros() {
  const featuredProducts = products.slice(0, 3);

  return (
    <Container className="my-5">
      <Row className="mb-5">
        <Col>
          <Text variant="h1" className="text-center mb-4">Sobre Nosotros</Text>
          <Text variant="p" className="text-center">
            Somos una empresa dedicada a la venta de componentes de computadoras de alta calidad.
            Nuestro proyecto se enfoca en proporcionar a nuestros clientes los mejores productos
            tecnológicos para mejorar su experiencia informática. Ofrecemos una amplia gama de
            procesadores, memorias RAM, tarjetas gráficas y unidades SSD, todos seleccionados
            por su rendimiento y confiabilidad.
          </Text>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <Text variant="h2" className="text-center mb-4">Nuestros Productos</Text>
          <Text variant="p" className="text-center mb-4">
            Descubre algunos de nuestros productos destacados. Ofrecemos componentes de las mejores marcas
            para satisfacer todas tus necesidades tecnológicas.
          </Text>
          <Row className="justify-content-center">
            {featuredProducts.map((product) => (
              <Col key={product.id} md={4} className="d-flex justify-content-center">
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Button variant="primary" onClick={() => window.location.href = '/products'}>
              Ver Todos los Productos
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={6}>
          <Text variant="h2" className="mb-4">Cómo Contactarnos</Text>
          <Text variant="p">
            ¿Tienes preguntas o necesitas ayuda? Estamos aquí para ayudarte.
            Puedes contactarnos a través de nuestro formulario en línea o por los siguientes medios:
          </Text>
          <ul>
            <li><strong>Email:</strong> contacto@pcomponent.com</li>
            <li><strong>Teléfono:</strong> +56 9 1234 5678</li>
            <li><strong>Horario:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM</li>
          </ul>
          <Button variant="primary" onClick={() => window.location.href = '/contact'}>
            Ir al Formulario de Contacto
          </Button>
        </Col>
        <Col md={6}>
          <Image src="../src/assets/img/Contacto.webp" alt="Imagen de contacto" className="img-fluid rounded" />
        </Col>
      </Row>

      <Row>
        <Col>
          <Text variant="h2" className="text-center mb-4">Dónde Estamos Ubicados</Text>
          <Text variant="p" className="text-center mb-4">
            Visítanos en nuestra tienda física en la siguiente dirección:
          </Text>
          <div className="text-center">
            <Text variant="p"><strong>Dirección:</strong> Av. Américo Vespucio 1501</Text>
            <div className="mt-4">

            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Nosotros;

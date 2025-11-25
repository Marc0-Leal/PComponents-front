import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import posts from '../data/BlogPosts';
import bgImage from '../assets/img/Fondo.webp';

function Blog() {
  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container className="my-5 flex-grow-1">
        <h1 style={{ color: 'white' }}>Blog</h1>
        <p style={{ color: 'white' }}>Últimos artículos y guías.</p>

        <Row className="mt-4">
          {posts.map((post) => (
            <Col key={post.id} md={4} className="mb-4">
              <Card
                className="h-100 text-center shadow"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                }}
              >
                {post.image && (
                  <Card.Img
                    variant="top"
                    src={post.image}
                    alt={post.title}
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                )}
                <Card.Body>
                  <Card.Title style={{ color: 'white' }}>{post.title}</Card.Title>
                  <Card.Text style={{ color: 'white' }}>{post.excerpt}</Card.Text>
                  <Button variant="primary" href="#" disabled>
                    Leer más
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Blog;

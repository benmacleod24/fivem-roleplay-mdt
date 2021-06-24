import Header from '../components/header';
import Footer from '../components/footer';
import React from 'react';
import { Container } from '@chakra-ui/react';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <Container minH="80vh" justifyContent="normal" maxW="container.xl">{children} </Container>
      <Footer />
    </>
  );
}

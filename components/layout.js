import Header from '../components/header';
import Footer from '../components/footer';
import React from 'react';
import { Container, Flex } from '@chakra-ui/react';

export default function Layout({ children }) {
  return (
    <Flex direction="column" height="100vh" width="100vw">
      <Header />
      <Container minH="82.5vh" justifyContent="normal" maxW="container.xl">
        {children}{' '}
      </Container>
      <Footer />
    </Flex>
  );
}

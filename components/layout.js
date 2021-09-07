import Header from './Header';
import Footer from '../components/footer';
import React from 'react';
import { Container, Flex } from '@chakra-ui/react';

export default function Layout({ children }) {
  return (
    <Flex direction="column" height="100vh" width="100vw">
      <Header />
      <Container justifyContent="normal" maxW="container.xl" flexGrow={1} boxSizing="border-box">
        {children}{' '}
      </Container>
      <Footer />
    </Flex>
  );
}

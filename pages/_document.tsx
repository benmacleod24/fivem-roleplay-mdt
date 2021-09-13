import React from 'react';
import { ColorModeScript } from '@chakra-ui/react';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import 'focus-visible/dist/focus-visible';
import theme from '../components/theme';
export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body id="body">
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

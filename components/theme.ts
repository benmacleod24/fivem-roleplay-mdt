// 1. import `extendTheme` function
import { extendTheme, ThemeConfig, Theme, ColorModeScript, Colors } from '@chakra-ui/react';

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

// 3. extend the theme
const theme = extendTheme({
  initalColorMode: 'dark',
  useSystemColorMode: false,
  colors: {
    gray: {
      700: '#232c3d',
    },
  },
});

export default theme;

// 1. import `extendTheme` function
import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

// Breakpoints
const breakpoints = createBreakpoints({
  sm: '20em',
  md: '23.4375em',
  lg: '26.5625em',
  xl: '80em',
  '2xl': '96em',
});

const colors = {
  gray: {
    700: '#232c3d',
  },
};

// 3. extend the theme
const theme = extendTheme({ config, colors, breakpoints });

export default theme;


import React, { ReactElement } from 'react';
import { Spinner as ChakraSpinner } from '@chakra-ui/react';
import { Flex as ChakraFlex } from '@chakra-ui/react';
import { theme } from '@chakra-ui/react';
export const spinnerSizes = {
  xm: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
};

type SpinnerSizes = keyof typeof spinnerSizes;

const Loader = ({
  size = 'md',
  height = '25vh',
}: {
  size?: SpinnerSizes;
  height?: string | number;
}): ReactElement<typeof ChakraSpinner> => (
  <ChakraFlex h={height} justify="center" align="center" p="0.25rem">
    <ChakraSpinner size={size} color={theme.colors.yellow[500]} />
  </ChakraFlex>
);

export default Loader;

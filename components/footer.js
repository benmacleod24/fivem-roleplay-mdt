import React from 'react';
import { useColorModeValue, Flex, Text, Link, theme } from '@chakra-ui/react';

// I was redoing the layout in flex form

export default function Footer() {
  const headerColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <Flex
      pl="6.5%"
      pr="6.5%"
      width="100%"
      height="8vh"
      minHeight="8vh"
      maxHeight="8vh"
      background={headerColor}
      border="none"
      alignItems="center"
      justifyContent="space-between"
      mt="1rem"
    >
      <Flex>
        <Link href="https://www.raze.community/forum/index.php" target="_blank">
          Raze Network ®
        </Link>
      </Flex>
      <Flex>
        <Text fontStyle="italic">
          {`Developed by `}
          <Link
            href="https://github.com/knames"
            target="_blank"
            color={theme.colors.blue[400]}
          >{`Chips`}</Link>
          {` & `}
          <Link
            href="https://github.com/twotap02"
            target="_blank"
            color={theme.colors.blue[400]}
          >{`Ben`}</Link>
        </Text>
      </Flex>
      <Flex>
        <Text>Change Logs</Text>
      </Flex>
    </Flex>
  );
}

import { Box, Flex, Heading, Text } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/react';
import * as React from 'react';

export interface AssociatesProps {}

const Associates: React.FunctionComponent<AssociatesProps> = ({}) => {
  return (
    <Flex
      w="16%"
      mr="3"
      p="3"
      h="fit-content"
      borderRadius="md"
      background="gray.700"
      flexDir="column"
    >
      <Flex flexDir="column" mb="2.5">
        <Heading size="sm">Associates</Heading>
        <Text fontSize="xx-small" color="gray.540">
          List of known associates that this citzens interacts with.
        </Text>
      </Flex>
      <Flex w="full" flexGrow={1} alignItems="center" flexDir="column">
        <Flex
          w="90%"
          h="40"
          borderWidth="1px"
          borderStyle="solid"
          borderColor="gray.600"
          borderRadius="md"
          overflow="hidden"
          flexDir="column"
          pos="relative"
          mb="2"
        >
          <Image src="https://i.imgur.com/jax4sA7.png" w="full" h="full" objectFit="cover" />
          <Flex
            background="gray.600"
            pos="absolute"
            left="0"
            bottom="0"
            p="1.5"
            w="full"
            flexGrow={1}
            alignItems="center"
          >
            <Text fontSize="xs" fontWeight="semibold">
              William Jr. Bryant
            </Text>
          </Flex>
        </Flex>
        <Flex
          w="90%"
          h="40"
          borderWidth="1px"
          borderStyle="solid"
          borderColor="gray.600"
          borderRadius="md"
          overflow="hidden"
          flexDir="column"
          pos="relative"
          mb="2"
        >
          <Image src="https://i.imgur.com/MtrDeB8.png" w="full" h="full" objectFit="cover" />
          <Flex
            background="gray.600"
            pos="absolute"
            left="0"
            bottom="0"
            p="1.5"
            w="full"
            flexGrow={1}
            alignItems="center"
          >
            <Text fontSize="xs" fontWeight="semibold">
              Walter Washington
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Associates;

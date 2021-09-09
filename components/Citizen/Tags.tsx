import { IconButton } from '@chakra-ui/button';
import { AddIcon } from '@chakra-ui/icons';
import { Flex, Heading, Text } from '@chakra-ui/layout';
import * as React from 'react';

export interface TagsProps {}

const Tags: React.FunctionComponent<TagsProps> = ({}) => {
  return (
    <Flex
      w="full"
      mb="3"
      h="fit-content"
      p="2.5"
      borderRadius="md"
      flexDir="column"
      background="gray.700"
    >
      <Heading size="sm">Licenses</Heading>
      <Text mb="2" fontSize="xs" color="gray.500">
        Tags for the citizen to lend more profiling to them for investigations.
      </Text>
      <Flex w="full">
        <IconButton
          icon={<AddIcon />}
          aria-label="add-lic"
          borderRadius="full"
          size="xs"
          variant="ghost"
        />
      </Flex>
    </Flex>
  );
};

export default Tags;

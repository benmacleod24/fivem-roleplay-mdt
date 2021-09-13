import { Box, Code, Flex, Heading, Text } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/react';
import { fivem_characters } from '@prisma/client';
import * as React from 'react';
import useSWR, { SWRResponse } from 'swr';
import { toQuery } from '../../utils/query';
import SearchDropdown from '../SearchDropdonwn';

export interface AssociatesProps {}

interface SWRResponseType extends fivem_characters {}

const Associates: React.FunctionComponent<AssociatesProps> = ({}) => {
  const [value, setValue] = React.useState('');

  return (
    <Flex
      w="16%"
      mr="3"
      p="3"
      h="fit-content"
      borderRadius="md"
      background="gray.700"
      flexDir="column"
      pos="relative"
    >
      <Flex flexDir="column" mb="2.5">
        <Heading size="sm">Associates</Heading>
        <Text fontSize="xx-small" color="gray.540">
          List of known associates that this citzens interacts with.
        </Text>
        <Flex pos="absolute" top="3" right="3">
          <SearchDropdown offsetX={50} debounce debounceTimeout={500} placeholder="Search Citizens">
            {filter => {
              const searchParams = toQuery({
                firstName: filter.split(' ')[0],
                lastName: filter.split(' ')[1],
              });

              console.log(searchParams);

              const { data: citizens, error } = useSWR(
                `/api/citizens?page=0&${searchParams}`,
              ) as SWRResponse<Array<SWRResponseType>, any>;

              if (!filter)
                return (
                  <Flex flexDir="column" alignItems="center" justifyContent="center" h="24">
                    <Text>Start Typing</Text>
                    <Code mt="1" borderRadius="lg" px="2">
                      First Last
                    </Code>
                  </Flex>
                );

              return (
                <Flex w="full" h="full" flexDir="column" overflowY="auto">
                  {citizens?.map(c => (
                    <Flex
                      py="2.5"
                      transition="0.2s ease-in-out"
                      cursor="pointer"
                      px="3.5"
                      _hover={{ background: 'gray.500' }}
                    >
                      <Text>
                        {c.first_name} {c.last_name}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              );
            }}
          </SearchDropdown>
        </Flex>
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

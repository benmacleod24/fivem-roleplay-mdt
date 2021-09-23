import { Box, Code, Flex, Heading, Text } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/react';
import { fivem_characters, mdt_associates } from '@prisma/client';
import Link from 'next/link';
import * as React from 'react';
import useSWR, { SWRResponse } from 'swr';
import { toQuery } from '../../utils/query';
import SearchDropdown from '../SearchDropdonwn';

export interface AssociatesProps {
  id: number;
}

interface SWRResponseType extends fivem_characters {}
interface SWRResponseType2 extends mdt_associates {
  fivem_characters: fivem_characters;
}

const Associates: React.FunctionComponent<AssociatesProps> = ({ id }) => {
  const [value, setValue] = React.useState('');

  const {
    data: associates,
    revalidate,
    mutate,
  } = useSWR(`/api/citizen/associates?id=${id}`) as SWRResponse<SWRResponseType2[], any>;

  const postAssociated = async (aId: number) => {
    const res = await fetch(`/api/citizen/associates?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({ id: aId }),
    }).then(r => r.json());
    mutate();
    return res;
  };

  return (
    <Flex
      w="16%"
      minW="16%"
      maxW="16%"
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
            {(filter, open, setOpen) => {
              const searchParams = toQuery({
                firstName: filter.split(' ')[0],
                lastName: filter.split(' ')[1],
              });

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
                  {citizens
                    ?.filter(c => c.id !== id)
                    .map(c => (
                      <Flex
                        py="2.5"
                        transition="0.2s ease-in-out"
                        cursor="pointer"
                        px="3.5"
                        _hover={{ background: 'gray.500' }}
                        onClick={() => {
                          postAssociated(c.id);
                          setOpen(false);
                        }}
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
        {associates?.map(a => (
          <Flex
            key={a.associateId}
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
            <Image
              src={
                a.fivem_characters.image
                  ? a.fivem_characters.image
                  : 'https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255634-stock-illustration-avatar-icon-male-profile-gray.jpg'
              }
              w="full"
              h="full"
              objectFit="cover"
            />
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
              <Link href={`/citizens/${a.fivem_characters.cuid}/profile`}>
                <Text
                  fontSize="xs"
                  _hover={{ textDecor: 'underline' }}
                  cursor="pointer"
                  fontWeight="semibold"
                >
                  {a.fivem_characters.first_name} {a.fivem_characters.last_name}
                </Text>
              </Link>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default Associates;

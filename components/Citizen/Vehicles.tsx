import { fivem_vehicles } from '.prisma/client';
import { Flex, Heading, Text } from '@chakra-ui/layout';
import { Grid } from '@chakra-ui/react';
import * as React from 'react';
import useSWR, { SWRResponse } from 'swr';

export interface VehiclesProps {
  citizenId: number;
}

const Vehicles: React.SFC<VehiclesProps> = ({ citizenId }) => {
  const { data: vehicles } = useSWR(`/api/citizen/vehicles?cid=${citizenId}`) as SWRResponse<
    Array<fivem_vehicles>,
    any
  >;

  return (
    <Flex w="full" background="gray.700" p="4" borderRadius="md" flexDir="column">
      <Flex flexDir="column" mb="2">
        <Heading size="sm">Owned Vehicles</Heading>
        <Text fontSize="xs" color="gray.500">
          List of all vehicles owned by this person.
        </Text>
      </Flex>
      <Grid w="full" gap={2} templateColumns="repeat(4, 1fr)" maxH="72" overflow="auto">
        {vehicles?.map(v => (
          <Flex
            flexDir="column"
            key={v.vehicleid}
            background="gray.600"
            borderRadius="md"
            p="1.5"
            px="3"
          >
            <Flex>
              <Text fontSize="sm" color="yellow.200" fontWeight="semibold" mr="1">
                Model:
              </Text>
              <Text fontSize="sm" color="white">
                {v.name}
              </Text>
            </Flex>
            <Flex>
              <Text fontSize="sm" color="yellow.200" fontWeight="semibold" mr="1">
                Plate:
              </Text>
              <Text fontSize="sm" color="white">
                {v.plate}
              </Text>
            </Flex>
          </Flex>
        ))}
      </Grid>
    </Flex>
  );
};

export default Vehicles;

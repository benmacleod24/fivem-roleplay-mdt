import { mdt_bookings_new, mdt_booked_charges_new, mdt_charges } from '.prisma/client';
import { Flex, Grid, GridItem, Heading, Text } from '@chakra-ui/layout';
import * as React from 'react';
import useSWR, { SWRResponse } from 'swr';
import { Item } from '../CopSelect';

interface ChargesProps {
  citizenId: number;
}

interface mdt_booked_charges_newType extends mdt_booked_charges_new {
  mdt_charges: mdt_charges;
}

interface SWRResponseT extends mdt_bookings_new {
  mdt_booked_charges_new: mdt_booked_charges_newType[];
}

const Charges: React.FunctionComponent<ChargesProps> = ({ citizenId }) => {
  const { data: charges, revalidate } = useSWR(
    `/api/booking?criminalId=${citizenId}`,
  ) as SWRResponse<SWRResponseT[], any>;

  const chargesPrintable = React.useMemo(() => {
    const _arr: { [x: string]: Item } = {};

    charges?.map(c => {
      c.mdt_booked_charges_new.map(cr => {
        if (!cr.mdt_charges.name) return;

        if (_arr[cr.mdt_charges.name]) {
          _arr[cr.mdt_charges.name].value = String(
            Number(_arr[cr.mdt_charges.name].value) + cr.chargeCount,
          );
        } else {
          _arr[cr.mdt_charges.name] = {
            value: String(cr.chargeCount),
            label: cr.mdt_charges.name,
          };
        }
      });
    });

    console.log(_arr);
    return Object.values(_arr);
  }, [charges]);

  return (
    <Flex mt="3" w="full" background="gray.700" p="4" borderRadius="md" flexDir="column">
      <Heading size="sm">Conviction Records</Heading>
      <Text mb="2" fontSize="xs" color="gray.500">
        Past conviction record of this citizen.
      </Text>
      <Grid templateColumns="repeat(3, 1fr)" gap={3}>
        {chargesPrintable.map(c => (
          <Flex
            alignItems="center"
            borderRadius="md"
            justifyContent="space-between"
            background="gray.600"
            p="2"
            w="full"
          >
            <Heading size="sm" color="yellow.300">
              {c.label}
            </Heading>
            <Text>
              {c.value} {Number(c.value) > 1 ? 'Counts' : 'Count'}
            </Text>
          </Flex>
        ))}
      </Grid>
    </Flex>
  );
};

export default Charges;

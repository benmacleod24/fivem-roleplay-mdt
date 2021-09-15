import { Flex, Heading } from '@chakra-ui/layout';
import * as React from 'react';

interface ChargesProps {
  citizenId: number;
}

const Charges: React.FunctionComponent<ChargesProps> = ({ citizenId }) => {
  return (
    <Flex mt="3" w="full" background="gray.700" p="4" borderRadius="md" flexDir="column">
      <Heading size="sm">Conviction Records</Heading>
    </Flex>
  );
};

export default Charges;

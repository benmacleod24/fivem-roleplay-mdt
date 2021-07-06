import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  VStack,
  Text,
  HStack,
  Tag,
} from '@chakra-ui/react';
import { mdt_charges, mdt_charges_categories } from '@prisma/client';
import * as React from 'react';
import { mdtCharges } from '../../../components/hooks/api/usePenal';
import { numberWithComma } from '../../../utils';

const PCodeAccordian = ({ category }: { category?: (mdt_charges_categories & mdtCharges)[] }) => {
  return (
    <Accordion mt="8" allowMultiple w="100%">
      {category &&
        category.map(c => {
          return (
            <AccordionItem key={c.categoryid}>
              <AccordionButton>
                <Box w="100%" textAlign="left">
                  {c.name}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <VStack spacing={3}>
                  {c.mdt_charges.map(ch => (
                    <PCodeChargeWrapper key={ch.chargeid} charge={ch} />
                  ))}
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          );
        })}
    </Accordion>
  );
};

export default PCodeAccordian;

// Penal Code Charge Wrapper
export interface PCodeChargeWrapperProps {
  charge: mdt_charges;
}

const PCodeChargeWrapper: React.SFC<PCodeChargeWrapperProps> = ({ charge }) => {
  const isHoldUntil = () => (charge.time && charge.time >= 99999 ? true : false);

  const classColor = () => {
    switch (charge.class) {
      case 'infraction':
        return 'blue';
      case 'misdemeanor':
        return 'orange';
      case 'felony':
        return 'red';
      default:
        return;
    }
  };

  return (
    <Flex
      p="3"
      boxSizing="border-box"
      direction="column"
      background="gray.700"
      borderRadius="md"
      w="full"
    >
      <Heading color="blue.400" mb="1" size="sm">
        {charge.name}
      </Heading>
      <Text>{charge.description}</Text>
      <HStack mt="2">
        {!isHoldUntil() ? (
          <React.Fragment>
            <Tag size="md">${numberWithComma(charge.fine)}</Tag>
            <Tag size="md">{charge.time} Month(s)</Tag>
          </React.Fragment>
        ) : (
          <Tag size="md" colorScheme="yellow">
            Hold Until Trial
          </Tag>
        )}
        <Tag size="md" colorScheme={classColor()} textTransform="capitalize">
          {charge.class}
        </Tag>
      </HStack>
    </Flex>
  );
};

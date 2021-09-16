import { SearchIcon } from '@chakra-ui/icons';
import {
  Flex,
  Grid,
  GridItem,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { mdt_charges, mdt_charges_categories } from '@prisma/client';
import * as React from 'react';
import { SingleCitizen } from '../../pages/api/citizen';
import { LoadableContentSafe } from '../../ui/LoadableContent';
import { numberWithComma } from '../../utils';
import { mdtCharges } from '../hooks/api/usePenal';
import useChargeColor from '../hooks/useChargeColor';

export interface BookingCategoryConProps {
  character?: SingleCitizen;
  penal?: (mdt_charges_categories & mdtCharges)[];
  characterError: any;
  penalError: any;
  addChagre: (a: mdt_charges) => void;
}

const BookingCategoryCon = ({
  addChagre,
  character,
  penal,
  characterError,
  penalError,
}: BookingCategoryConProps) => {
  const [filter, setFilter] = React.useState('');

  return (
    <Flex minW="70%" maxW="70%" w="70%" h="full" flexDir="column">
      <InputGroup variant="filled" mb="3">
        <InputLeftElement>
          <SearchIcon />
        </InputLeftElement>
        <Input
          placeholder="Filter Charges"
          value={filter}
          onChange={evt => setFilter(evt.target.value)}
        />
      </InputGroup>
      <LoadableContentSafe data={{ character, penal }} errors={[characterError, penalError]}>
        {({ character, penal }) => {
          return (
            <VStack w="full" h="full" spacing="3">
              {penal.map(cat => {
                return (
                  <Flex w="full" key={cat.categoryid} flexDir="column">
                    <Flex
                      mb="1"
                      background="gray.700"
                      py="1.5"
                      justifyContent="center"
                      alignItems="center"
                      borderTopRadius="md"
                      w="full"
                    >
                      {cat.name}
                    </Flex>
                    <Grid
                      alignItems="center"
                      justifyItems="center"
                      templateColumns="repeat(4, 1fr)"
                      gap={1}
                    >
                      {cat.mdt_charges
                        .filter(c => !c.deleted)
                        .filter(_c => _c.name?.toLocaleLowerCase().match(filter))
                        .map(char => (
                          <ChargeBox addChagre={addChagre} charge={char} key={char.chargeid} />
                        ))}
                    </Grid>
                  </Flex>
                );
              })}
            </VStack>
          );
        }}
      </LoadableContentSafe>
    </Flex>
  );
};

export default BookingCategoryCon;

export interface ChargeBoxProps {
  charge: mdt_charges;
  addChagre: (a: mdt_charges) => void;
}

const ChargeBox: React.FunctionComponent<ChargeBoxProps> = ({ charge, addChagre }) => {
  const chargeColor = useChargeColor(charge.class);

  const isHUT = () => (charge.time === 99999 ? true : false);

  return (
    <GridItem
      onClick={() => addChagre(charge)}
      cursor="pointer"
      borderRadius="sm"
      w="full"
      h="5.5rem"
      background={chargeColor}
      userSelect="none"
    >
      <Flex w="full" h="full" alignItems="center" justifyContent="center" flexDir="column">
        <Tooltip label={charge.description}>
          <Text
            fontWeight="medium"
            w="10rem"
            textAlign="center"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {charge.name}
          </Text>
        </Tooltip>
        {isHUT() ? (
          <Text fontSize="sm" fontStyle="italic" color="gray.100">
            Hold Until Trial
          </Text>
        ) : (
          <Text fontSize="sm" fontStyle="italic" color="gray.100">
            {numberWithComma(charge.time)} month(s) {' | '} ${numberWithComma(charge.fine)}
          </Text>
        )}
      </Flex>
    </GridItem>
  );
};

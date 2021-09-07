import { IconButton } from '@chakra-ui/button';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { Badge, Flex, Heading, Text } from '@chakra-ui/layout';
import { Tag, TagCloseButton, TagLabel, TagLeftIcon, TagRightIcon } from '@chakra-ui/tag';
import * as React from 'react';
import { GiDoubleFish, GiPistolGun, GiPolarBear } from 'react-icons/gi';
import { IoIosAirplane, IoMdCar } from 'react-icons/io';

export interface LicensesProps {}

const Licenses: React.SFC<LicensesProps> = ({}) => {
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
        Licenses can be revoked or added from the section.{' '}
      </Text>
      <Flex w="full">
        <Tag colorScheme="red" mr="2">
          <TagLeftIcon as={GiPistolGun} />
          <TagLabel>Weapons License</TagLabel>
          <TagCloseButton />
        </Tag>
        <Tag colorScheme="orange" mr="2">
          <TagLeftIcon as={IoMdCar} />
          <TagLabel>Drivers License</TagLabel>
          <TagCloseButton />
        </Tag>
        <Tag colorScheme="purple" mr="2">
          <TagLeftIcon as={IoIosAirplane} />
          <TagLabel>Piolets License</TagLabel>
          <TagCloseButton />
        </Tag>
        <Tag colorScheme="green" mr="2">
          <TagLeftIcon as={GiPolarBear} />
          <TagLabel>Hunting License</TagLabel>
          <TagCloseButton />
        </Tag>
        <Tag colorScheme="blue" mr="2">
          <TagLeftIcon as={GiDoubleFish} />
          <TagLabel>Fishing License</TagLabel>
          <TagCloseButton />
        </Tag>
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

export default Licenses;

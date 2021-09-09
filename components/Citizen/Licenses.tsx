import { fivem_licenses } from '.prisma/client';
import { IconButton } from '@chakra-ui/button';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { Badge, Flex, Heading, Text } from '@chakra-ui/layout';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu';
import { Tag, TagCloseButton, TagLabel, TagLeftIcon, TagRightIcon } from '@chakra-ui/tag';
import * as React from 'react';
import { GiDoubleFish, GiPistolGun, GiPolarBear } from 'react-icons/gi';
import { IoIosAirplane, IoMdCar } from 'react-icons/io';
import useSWR, { SWRResponse } from 'swr';

export interface LicensesProps {
  id: number;
}

const Licenses: React.FunctionComponent<LicensesProps> = ({ id }) => {
  const { data: lics, revalidate } = useSWR(`/api/citizen/licenses?citizenId=${id}`) as SWRResponse<
    fivem_licenses,
    any
  >;

  const updateLic = async (lic: string, lvl: number) => {
    const res = await fetch(`/api/citizen/licenses?citizenId=${id}&value=${lic}&level=${lvl}`, {
      method: 'PATCH',
    }).then(r => r.json());
    revalidate();
    return res;
  };

  if (!lics) return <React.Fragment></React.Fragment>;

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
        <Tag
          colorScheme="red"
          mr="2"
          display={lics.weapons === null || lics.weapons! >= 32 ? 'none' : 'inherit'}
        >
          <TagLeftIcon as={GiPistolGun} />
          <TagLabel>Weapons License</TagLabel>
          <TagCloseButton onClick={() => updateLic('weapons', 32)} />
        </Tag>
        <Tag
          colorScheme="orange"
          mr="2"
          display={lics.drivers === null || lics.drivers! >= 32 ? 'none' : 'inherit'}
        >
          <TagLeftIcon as={IoMdCar} />
          <TagLabel>Drivers License</TagLabel>
          <TagCloseButton onClick={() => updateLic('drivers', 32)} />
        </Tag>
        <Tag
          colorScheme="purple"
          mr="2"
          display={lics.pilots === null || lics.pilots! >= 32 ? 'none' : 'inherit'}
        >
          <TagLeftIcon as={IoIosAirplane} />
          <TagLabel>Pilots License</TagLabel>
          <TagCloseButton onClick={() => updateLic('pilots', 32)} />
        </Tag>
        <Tag
          colorScheme="green"
          mr="2"
          display={lics.hunting === null || lics.hunting! >= 32 ? 'none' : 'inherit'}
        >
          <TagLeftIcon as={GiPolarBear} />
          <TagLabel>Hunting License</TagLabel>
          <TagCloseButton onClick={() => updateLic('hunting', 32)} />
        </Tag>
        <Tag
          colorScheme="blue"
          mr="2"
          display={lics.fishing === null || lics.fishing! >= 32 ? 'none' : 'inherit'}
        >
          <TagLeftIcon as={GiDoubleFish} />
          <TagLabel>Fishing License</TagLabel>
          <TagCloseButton onClick={() => updateLic('fishing', 32)} />
        </Tag>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<AddIcon />}
            aria-label="add-lic"
            borderRadius="full"
            size="xs"
            variant="ghost"
          />
          <MenuList>
            {lics.drivers! === null ? (
              <MenuItem onClick={() => updateLic('drivers', 0)}>Drivers</MenuItem>
            ) : (
              ''
            )}{' '}
            {lics.pilots! === null ? (
              <MenuItem onClick={() => updateLic('pilots', 0)}>Pilots</MenuItem>
            ) : (
              ''
            )}
            {lics.weapons! === null ? (
              <MenuItem onClick={() => updateLic('weapons', 0)}>Weapons</MenuItem>
            ) : (
              ''
            )}
            {lics.hunting! === null ? (
              <MenuItem onClick={() => updateLic('hunting', 0)}>Hunting</MenuItem>
            ) : (
              ''
            )}
            {lics.fishing! === null ? (
              <MenuItem onClick={() => updateLic('fishing', 0)}>Fishing</MenuItem>
            ) : (
              ''
            )}
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Licenses;

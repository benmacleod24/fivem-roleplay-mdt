import { Flex, Text } from '@chakra-ui/layout';
import { fivem_characters, mdt_criminals } from '@prisma/client';
import * as React from 'react';
import { stringToNumber } from '../../utils/parse';

interface SWRResponseType extends fivem_characters {
  mdt_criminals: mdt_criminals[];
}

export interface ProfileDataProps {
  citizen: SWRResponseType;
}

const ProfileData: React.FunctionComponent<ProfileDataProps> = ({ citizen }) => {
  const calculateAge = (): string => {
    if (!citizen.dob) return 'DoB not found';
    const birthYear = stringToNumber(citizen.dob.split('-')[0]);
    if (!birthYear) return citizen.dob;
    return String(new Date().getFullYear() - birthYear);
  };

  return (
    <Flex flexGrow={1} background="gray.700" h="full" borderRadius="md" p="3">
      <Flex w="fit-content" h="fit-content" flexDir="column">
        <Flex>
          <Text mr="1" color="blue.300" fontWeight="semibold">
            Name:
          </Text>
          {citizen.first_name} {citizen.last_name}
        </Flex>
        <Flex>
          <Text mr="1" color="blue.300" fontWeight="semibold">
            Age:
          </Text>
          {calculateAge()}
        </Flex>
        <Flex>
          <Text mr="1" color="blue.300" fontWeight="semibold">
            Date of Birth:
          </Text>
          {citizen.dob}
        </Flex>
        <Flex>
          <Text mr="1" color="blue.300" fontWeight="semibold">
            Gender:
          </Text>
          {citizen.gender === false ? 'Male' : 'Female'}
        </Flex>
        <Flex>
          <Text mr="1" color="blue.300" fontWeight="semibold">
            State Identifier:
          </Text>
          {citizen.id}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProfileData;

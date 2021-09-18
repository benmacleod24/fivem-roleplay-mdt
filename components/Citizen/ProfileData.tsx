import { IconButton } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Flex, Text } from '@chakra-ui/layout';
import { fivem_characters } from '@prisma/client';
import * as React from 'react';
import { BiImage } from 'react-icons/bi';
import { stringToNumber } from '../../utils/parse';
import { patchImage } from '../hooks/api/patchCitizen';

interface SWRResponseType extends fivem_characters {}

export interface ProfileDataProps {
  citizen: SWRResponseType;
  mutate: any;
}

const ProfileData: React.FunctionComponent<ProfileDataProps> = ({ citizen, mutate }) => {
  const [image, setImage] = React.useState('');

  React.useEffect(() => {
    if (!citizen.image) return;
    setImage(citizen.image);
  }, [citizen]);

  const calculateAge = (): string => {
    if (!citizen.dob) return 'DoB not found';
    const birthYear = stringToNumber(citizen.dob.split('-')[0]);
    if (!birthYear) return citizen.dob;
    return String(new Date().getFullYear() - birthYear);
  };

  return (
    <Flex flexGrow={1} background="gray.700" pos="relative" h="full" borderRadius="md" p="3">
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
      <Flex pos="absolute" right="5" top="5">
        <Input
          placeholder="Citizen Image"
          _focus={{ boxShadow: 'none' }}
          variant="filled"
          value={image}
          onChange={e => setImage(e.target.value)}
        />
        <IconButton
          aria-label="save-image"
          icon={<BiImage />}
          ml="2"
          borderRadius="md"
          colorScheme="yellow"
          onClick={async () => {
            await patchImage(citizen.id.toString(), { image });
            mutate();
          }}
        />
      </Flex>
    </Flex>
  );
};

export default ProfileData;

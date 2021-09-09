import { Box, Flex, Heading, Image, Button } from '@chakra-ui/react';
import {
  fivem_characters,
  mdt_criminals,
  mdt_criminal_flags,
  mdt_flag_types,
} from '@prisma/client';
import { useSession } from 'next-auth/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import useSWR, { SWRResponse } from 'swr';
import useFlags from '../../../components/hooks/api/useFlags';
import Layout from '../../../components/layout';
import ProfileData from '../../../components/Citizen/ProfileData';
import Associates from '../../../components/Citizen/Associates';
import Licenses from '../../../components/Citizen/Licenses';
import Vehicles from '../../../components/Citizen/Vehicles';

export interface CitizenProfileProps {}

interface SWRResponseType extends fivem_characters {
  mdt_criminals: mdt_criminals[];
}

const CitizenProfile: React.SFC<CitizenProfileProps> = ({}) => {
  const router = useRouter();
  const { citizenid } = router.query;
  const [session, loading] = useSession();

  // API Data
  const { data: citizen } = useSWR(`/api/citizen/?citizenid=${citizenid}`) as SWRResponse<
    SWRResponseType,
    any
  >;

  if (!citizen) return <React.Fragment></React.Fragment>;

  // const checkFlags = () => {
  //   if (!flags) return [];
  //   const missingFlags = flags.filter(
  //     f => !criminalFlags && !criminalFlags?.find(_f => f.typeid === _f.typeid),
  //   );

  //   if (missingFlags.length <= 0) return <MenuItem>No More Flags</MenuItem>;
  //   return missingFlags.map(f => <MenuItem key={f.typeid}>{f.type_name}</MenuItem>);
  // };

  return (
    <Layout>
      <Flex width="full" height="full" direction="column">
        <Box
          width="full"
          display="flex"
          alignItems="center"
          p="3"
          mb="3"
          pr="5"
          background="gray.700"
          height="fit-content"
          borderRadius="md"
        >
          <Heading flex={1} size="md">
            Viewing {citizen?.first_name} {citizen?.last_name}
          </Heading>
          <Link href={`/booking/${citizen.cuid}`}>
            {session?.user.isCop ? (
              <Button size="sm" colorScheme="blue">
                Process
              </Button>
            ) : (
              ''
            )}
          </Link>
        </Box>
        <Flex width="full" height="100%" maxHeight="30%" mb="3">
          <Image
            mr="3"
            borderRadius="md"
            height="auto"
            maxHeight="100%"
            width="16%"
            border="1px solid #4A5568"
            objectFit="cover"
            objectPosition="center center"
            src={
              citizen.image
                ? citizen.image
                : citizen.mdt_criminals &&
                  citizen.mdt_criminals[0] &&
                  citizen.mdt_criminals[0].image
                ? citizen.mdt_criminals[0].image
                : 'https://i.imgur.com/tdi3NGah.jpg'
            }
            alt="profile-pic"
          />
          <ProfileData citizen={citizen} />
        </Flex>
        <Flex w="full">
          {session?.user.isCop ? <Associates /> : ''}
          <Flex flexGrow={1} borderRadius="md" flexDir="column">
            {session?.user.isCop ? <Licenses id={citizen.id} /> : ''}
            {session?.user.isCop ? <Vehicles citizenId={citizen.id} /> : ''}
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default CitizenProfile;

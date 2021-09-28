import { Box, Flex, Heading, Image, Button } from '@chakra-ui/react';
import { fivem_characters } from '@prisma/client';
import { useSession } from 'next-auth/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import useSWR, { SWRResponse } from 'swr';
import Layout from '../../../components/layout';
import { ReportCard } from '../../reports';
import Associates from '../../../components/Citizen/Associates';
import Licenses from '../../../components/Citizen/Licenses';
import Vehicles from '../../../components/Citizen/Vehicles';
import ProfileData from '../../../components/Citizen/ProfileData';
import { LoadableContentSafe } from '../../../ui/LoadableContent';
import Charges from '../../../components/Citizen/Charges';

// Images

export interface CitizenProfileProps {}

interface SWRResponseType extends fivem_characters {}

// type SWRFlagsResponse = Array<mdt_criminal_flags & mdt_flag_types>;

const CitizenProfile: React.SFC<CitizenProfileProps> = ({}) => {
  // Router Data
  const router = useRouter();
  const { citizenid } = router.query;
  const [session, loading] = useSession();

  // API Data
  const {
    data: citizen,
    error: citizenError,
    mutate,
  } = useSWR(`/api/citizen/?citizenid=${citizenid}`) as SWRResponse<SWRResponseType, any>;

  const [pageIndex, setPageIndex] = React.useState(0);

  if (!citizen) return <React.Fragment></React.Fragment>;

  return (
    <Layout>
      <LoadableContentSafe data={{ citizen }} errors={[citizenError]}>
        {({ citizen }) => (
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
                Viewing {citizen.first_name} {citizen.last_name}
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
                src={
                  citizen && citizen.image
                    ? citizen.image
                    : 'https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255634-stock-illustration-avatar-icon-male-profile-gray.jpg'
                }
                alt="profile-pic"
              />
              <ProfileData mutate={mutate} citizen={citizen} />
            </Flex>
            <Flex w="full">
              {session?.user.isCop || session?.user.isDA ? <Associates id={citizen.id} /> : ''}
              <Flex flexGrow={1} borderRadius="md" flexDir="column">
                {session?.user.isCop || session?.user.isJudge || session?.user.isDA ? (
                  <Licenses id={citizen.id} />
                ) : (
                  ''
                )}
                {session?.user.isCop || session?.user.isJudge || session?.user.isDA ? (
                  <Vehicles citizenId={citizen.id} />
                ) : (
                  ''
                )}
                <Charges citizenId={citizen.id} />
              </Flex>
            </Flex>

            {(session?.user.isCop || session?.user.isJudge || session?.user.isDA) && (
              <>
                <ReportCard
                  hideReport={true}
                  index={pageIndex}
                  searchValues={{ suspectStateId: citizen.id }}
                />
                <Flex>
                  <Button
                    m="1rem"
                    isDisabled={pageIndex < 1}
                    onClick={() => setPageIndex(pageIndex - 1)}
                  >
                    Previous
                  </Button>
                  <Button m="1rem" onClick={() => setPageIndex(pageIndex + 1)}>
                    Next
                  </Button>
                </Flex>
              </>
            )}
          </Flex>
        )}
      </LoadableContentSafe>
    </Layout>
  );
};

export default CitizenProfile;

import { Box, Button, Flex, Heading, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { useSession } from 'next-auth/client';
import * as React from 'react';
import { BiHash } from 'react-icons/bi';
import { FiHash } from 'react-icons/fi';
import useSWR, { SWRResponse } from 'swr';
import { DeptMember } from '../../components/Command/Officers';
import { patchMember } from '../../components/hooks/api/patchMember';
import Layout from '../../components/layout';

export interface ProfileProps {}

const Profile: React.FunctionComponent<ProfileProps> = ({}) => {
  const [session, loading] = useSession();
  const [callSign, setCallSign] = React.useState<string | undefined>('');
  const [_loading, isLoading] = React.useState(false);

  const {
    data: member,
    error: memberError,
    mutate: MutateMember,
    revalidate,
  } = useSWR(`/api/departments/members?characterId=${session?.user.copId}`) as SWRResponse<
    DeptMember,
    any
  >;

  React.useEffect(() => {
    setCallSign(member?.callSign);
  }, [member]);

  const onDevDatRequest = () => {
    navigator.clipboard.writeText(`Dev Data:
    isCop: ${session?.user.isCop}
    isJudge: ${session?.user.isJudge}
    copId: ${session?.user.copId}
    copName: ${session?.user.copName}
    discordID: ${session?.user.id}`);
  };

  const onUpdateCallSign = async () => {
    if (!member) return;
    isLoading(true);
    await patchMember({
      rankId: member.rankId,
      departmentId: member.departmentId,
      memberId: member.memberId,
      callSign: callSign,
      email: member.email,
    });
    MutateMember();
    isLoading(false);
  };

  return (
    <Layout>
      <Flex flexDir="column">
        <Box background="gray.700" borderRadius="md" width="100%" p="3">
          <Heading size="md">My Profile</Heading>
        </Box>
        <Flex w="25%" flexDir="column" background="gray.700" borderRadius="md" p="3" my="2">
          <Flex mb="3" w="full" flexDir="column">
            <Heading size="sm">Call Sign</Heading>
          </Flex>
          <InputGroup variant="filled" size="md">
            <InputLeftElement>
              <FiHash />
            </InputLeftElement>
            <Input
              value={callSign}
              onChange={e => setCallSign(e.target.value)}
              _focus={{ boxShadow: 'none' }}
              placeholder="Call Sign"
            />
          </InputGroup>
          <Button
            isLoading={_loading}
            onClick={onUpdateCallSign}
            isFullWidth
            size="sm"
            colorScheme="yellow"
            mt="3"
          >
            Submit
          </Button>
        </Flex>
        <Button mt="3" w="fit-content" colorScheme="yellow" onClick={onDevDatRequest}>
          Copy Dev Data
        </Button>
      </Flex>
    </Layout>
  );
};

export default Profile;

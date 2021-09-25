import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { useSession } from 'next-auth/client';
import * as React from 'react';
import Layout from '../../components/layout';

export interface ProfileProps {}

const Profile: React.FunctionComponent<ProfileProps> = ({}) => {
  const [session, loading] = useSession();

  const onDevDatRequest = () => {
    navigator.clipboard.writeText(`Dev Data:
    isCop: ${session?.user.isCop}
    isJudge: ${session?.user.isJudge}
    copId: ${session?.user.copId}
    copName: ${session?.user.copName}
    discordID: ${session?.user.id}`);
  };

  return (
    <Layout>
      <Flex flexDir="column">
        <Box background="gray.700" borderRadius="md" width="100%" p="3">
          <Heading size="md">My Profile</Heading>
        </Box>
        <Button mt="3" w="fit-content" colorScheme="yellow" onClick={onDevDatRequest}>
          Copy Dev Data
        </Button>
      </Flex>
    </Layout>
  );
};

export default Profile;

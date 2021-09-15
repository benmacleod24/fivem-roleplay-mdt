import { Box, Flex, Heading } from '@chakra-ui/react';
import { useSession } from 'next-auth/client';
import * as React from 'react';
import Layout from '../../components/layout';

export interface ProfileProps {

}

const Profile: React.FunctionComponent<ProfileProps> = ({}) => {
  const [session, loading] = useSession();

  return (
    <Layout>
      <Flex>
        <Box background="gray.700" borderRadius="md" width="100%" p="3">
          <Heading size="lg">My Profile</Heading>
        </Box>
      </Flex>
    </Layout>
  );
};

export default Profile;
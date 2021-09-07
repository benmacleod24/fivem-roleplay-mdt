import { Badge, Button, Flex, Heading, Text, Tooltip } from '@chakra-ui/react';
import * as React from 'react';
import useDispatch from '../../components/hooks/api/useDispatch';
import Layout from '../../components/layout';

export interface DispatchProps {}

const Dispatch: React.SFC<DispatchProps> = ({}) => {
  const { dispatch, error } = useDispatch();

  return (
    <Layout>
      <head>
        <title>Dispatch</title>
      </head>
      <Flex w="full" h="full">
        <Flex w="full" h="fit-content" background="gray.700" p="3" borderRadius="md">
          <Tooltip label="In Service" background="gray.600" color="white" borderRadius="md">
            <Button size="sm" colorScheme="green" variant="outline">
              10-8
            </Button>
          </Tooltip>
          <Tooltip label="Out of service" background="gray.600" color="white" borderRadius="md">
            <Button ml="2" size="sm" colorScheme="orange" variant="outline">
              10-7
            </Button>
          </Tooltip>
          <Tooltip
            label="Busy, unless urgent"
            background="gray.600"
            color="white"
            borderRadius="md"
          >
            <Button ml="2" size="sm" colorScheme="cyan" variant="outline">
              10-6
            </Button>
          </Tooltip>
          <Tooltip label="Traffic Stop" background="gray.600" color="white" borderRadius="md">
            <Button ml="2" size="sm" colorScheme="facebook" variant="outline">
              10-38
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Dispatch;

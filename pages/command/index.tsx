import { Button, Flex, Heading } from '@chakra-ui/react';
import * as React from 'react';
import Layout from '../../components/layout';

export interface CommandProps {}

const Command: React.SFC<CommandProps> = ({}) => {
  const [page, setPage] = React.useState('home');

  return (
    <Layout>
      <title>Command Management</title>
      <Flex
        w="full"
        mb="3"
        pb="3"
        borderBottomColor="gray.700"
        borderBottomWidth="1px"
        borderBottomStyle="solid"
      >
        <Heading size="md">Command Management</Heading>
      </Flex>
      <Flex w="full" h="full">
        <Flex h="full" w="xs" minW="xs" flexDir="column">
          <Button
            onClick={() => setPage('home')}
            variant={page === 'home' ? 'solid' : 'ghost'}
            colorScheme={page === 'home' ? 'blue' : 'gray'}
            justifyContent="flex-start"
            my="1"
          >
            Home
          </Button>
          <Button
            onClick={() => setPage('off_man')}
            variant={page === 'off_man' ? 'solid' : 'ghost'}
            colorScheme={page === 'off_man' ? 'blue' : 'gray'}
            justifyContent="flex-start"
            my="1"
          >
            Officer Management
          </Button>
          <Button
            onClick={() => setPage('dept_man')}
            variant={page === 'dept_man' ? 'solid' : 'ghost'}
            colorScheme={page === 'dept_man' ? 'blue' : 'gray'}
            justifyContent="flex-start"
            my="1"
          >
            Dept. Management
          </Button>
          <Button
            onClick={() => setPage('doj')}
            variant={page === 'doj' ? 'solid' : 'ghost'}
            colorScheme={page === 'doj' ? 'blue' : 'gray'}
            justifyContent="flex-start"
            my="1"
          >
            Dept. of Justice
          </Button>
        </Flex>
        <Flex h="full" w="full" p="1" boxSizing="border-box">
          <h1>{page === 'home' ? 'home' : ''}</h1>
          <h1>{page === 'off_man' ? 'Officer Management' : ''}</h1>
          <h1>{page === 'dept_man' ? 'Department Management' : ''}</h1>
          <h1>{page === 'doj' ? 'Dept. of Justice' : ''}</h1>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Command;

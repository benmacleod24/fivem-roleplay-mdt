import { Button, Flex, Heading } from '@chakra-ui/react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/client';
import { ParsedUrlQuery } from 'querystring';
import * as React from 'react';
import DojContainer from '../../components/Command/Doj';
import CommandHome from '../../components/Command/Home';
import Officers from '../../components/Command/Officers';
import Layout from '../../components/layout';

export interface CommandProps {}

const Command: React.FunctionComponent<CommandProps> = ({}) => {
  const [page, setPage] = React.useState('home');
  const [session, loading] = useSession();

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
          {session?.user.isJudge ? (
            <Button
              onClick={() => setPage('doj')}
              variant={page === 'doj' ? 'solid' : 'ghost'}
              colorScheme={page === 'doj' ? 'blue' : 'gray'}
              justifyContent="flex-start"
              my="1"
            >
              Dept. of Justice
            </Button>
          ) : (
            ''
          )}
        </Flex>
        <Flex h="full" w="full" px="1">
          {page === 'home' ? <CommandHome /> : ''}
          {page === 'doj' ? <DojContainer /> : ''}
          {page === 'off_man' ? <Officers /> : ''}
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Command;

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext<ParsedUrlQuery>,
) => {
  const session = await getSession(ctx);
  if (
    !session ||
    !session.user ||
    (!session.user.isJudge && !session.user.isCop) ||
    !session.user.rankLvl ||
    session.user.rankLvl < 4
  ) {
    return { redirect: { permanent: false, destination: '/?l=t' } };
  }
  return { props: { session } };
};
